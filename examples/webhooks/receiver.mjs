import { createHmac, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import { readFileSync, writeFileSync, renameSync, chmodSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { pathToFileURL } from "node:url";

export function verify(raw, header, secrets, now = Date.now()) {
  if (
    !Buffer.isBuffer(raw) ||
    typeof header !== "string" ||
    header.length > 1024
  )
    return false;
  const parts = header.split(",").map((x) => x.trim());
  const timestamps = parts.filter((x) => x.startsWith("t="));
  if (timestamps.length !== 1 || !/^t=\d{1,16}$/.test(timestamps[0]))
    return false;
  const timestamp = timestamps[0].slice(2),
    seconds = Number(timestamp);
  if (!Number.isSafeInteger(seconds) || Math.abs(now / 1000 - seconds) > 300)
    return false;
  const signatures = parts
    .filter((x) => /^v1=[0-9a-f]{64}$/.test(x))
    .slice(0, 4)
    .map((x) => Buffer.from(x.slice(3), "hex"));
  return secrets.some((secret) => {
    const expected = createHmac("sha256", secret)
      .update(timestamp + ".")
      .update(raw)
      .digest();
    return signatures.some((candidate) => timingSafeEqual(candidate, expected));
  });
}

export function receiver({ config, database, control }) {
  const db = new DatabaseSync(database);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;
    CREATE TABLE IF NOT EXISTS webhook_inbox(event_id TEXT PRIMARY KEY,payload_text TEXT NOT NULL,received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,processed_at TEXT);
    CREATE TABLE IF NOT EXISTS webhook_delivery_probe(delivery_id TEXT PRIMARY KEY,attempts INTEGER NOT NULL);`);
  const server = createServer(async (req, res) => {
    const reply = (status, body = {}) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(body));
    };
    // Disabled by default. Only for a dedicated, sandbox test-only receiver.
    if (control && req.url === "/e2e/config") {
      const token =
        typeof req.headers.authorization === "string"
          ? req.headers.authorization.replace(/^Bearer /, "")
          : "";
      const actual = Buffer.from(token),
        expected = Buffer.from(control.key);
      if (
        actual.length !== expected.length ||
        !timingSafeEqual(actual, expected)
      )
        return reply(401);
      if (req.method === "DELETE") {
        control.save({});
        return reply(204);
      }
      if (req.method !== "POST") return reply(405);
      try {
        const chunks = [];
        let size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 4096) {
            reply(413);
            req.destroy();
            return;
          }
          chunks.push(chunk);
        }
        const input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        if (
          input.account_id !== control.account_id ||
          input.environment !== "sandbox" ||
          !Array.isArray(input.secrets) ||
          input.secrets.length !== 1 ||
          typeof input.secrets[0] !== "string" ||
          !/^whsec_[A-Za-z0-9_-]{20,128}$/.test(input.secrets[0]) ||
          ![0, 1].includes(input.reject_attempts)
        )
          return reply(400);
        control.save({
          account_id: control.account_id,
          environment: "sandbox",
          secrets: input.secrets,
          reject_attempts: input.reject_attempts,
        });
        return reply(204);
      } catch {
        return reply(503);
      }
    }
    if (req.method !== "POST" || req.url !== "/webhooks") return reply(404);
    try {
      const settings = config();
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 65536) {
          reply(413);
          req.destroy();
          return;
        }
        chunks.push(chunk);
      }
      const raw = Buffer.concat(chunks);
      if (!verify(raw, req.headers["prava-signature"], settings.secrets))
        return reply(401);
      const event = JSON.parse(raw.toString("utf8"));
      if (
        event.account_id !== settings.account_id ||
        event.environment !== settings.environment ||
        typeof event.id !== "string" ||
        (!/^evt_[A-Za-z0-9_]+$/.test(event.id) &&
          event.type !== "webhook.endpoint_verification")
      )
        return reply(400);
      if (
        control &&
        event.type !== "webhook.endpoint_verification" &&
        event.test !== true
      )
        return reply(400);
      if (event.type === "webhook.endpoint_verification")
        return typeof event.challenge === "string"
          ? reply(200, { challenge: event.challenge })
          : reply(400);
      if (
        typeof event.type !== "string" ||
        !event.resource ||
        !Number.isSafeInteger(event.resource.version)
      )
        return reply(400);
      // Optional, sandbox-only E2E fault injection. Never use for normal delivery.
      if (
        settings.environment === "sandbox" &&
        event.test === true &&
        settings.reject_attempts > 0
      ) {
        const delivery = req.headers["prava-delivery-id"];
        if (typeof delivery !== "string" || delivery.length > 120)
          return reply(400);
        const probe = db
          .prepare(
            "INSERT INTO webhook_delivery_probe VALUES(?,1) ON CONFLICT(delivery_id) DO UPDATE SET attempts=attempts+1 RETURNING attempts",
          )
          .get(delivery);
        if (probe.attempts <= settings.reject_attempts) return reply(503);
      }
      // The primary key is both durable enqueue and duplicate suppression.
      db.prepare(
        "INSERT INTO webhook_inbox(event_id,payload_text) VALUES(?,?) ON CONFLICT(event_id) DO NOTHING",
      ).run(event.id, raw.toString("utf8"));
      return reply(204);
    } catch {
      return reply(503);
    }
  });
  server.headersTimeout = 5000;
  server.requestTimeout = 10000;
  server.on("close", () => db.close());
  return server;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const path = process.env.WEBHOOK_CONFIG_PATH;
  if (!path) throw new Error("WEBHOOK_CONFIG_PATH is required");
  let control;
  if (process.env.WEBHOOK_E2E_CONTROL_KEY) {
    if (
      !/^[A-Za-z0-9_-]{32,128}$/.test(process.env.WEBHOOK_E2E_CONTROL_KEY) ||
      !/^ma_[A-Za-z0-9]+$/.test(process.env.WEBHOOK_E2E_ACCOUNT_ID || "")
    )
      throw new Error("Invalid sandbox test-only control configuration");
    control = {
      key: process.env.WEBHOOK_E2E_CONTROL_KEY,
      account_id: process.env.WEBHOOK_E2E_ACCOUNT_ID,
      save: (settings) => {
        const temporary = path + ".new";
        writeFileSync(temporary, JSON.stringify(settings), { mode: 0o600 });
        chmodSync(temporary, 0o600);
        renameSync(temporary, path);
      },
    };
  }
  receiver({
    config: () => JSON.parse(readFileSync(path, "utf8")),
    control,
    database: process.env.WEBHOOK_INBOX_PATH || "webhook-inbox.sqlite",
  }).listen(Number(process.env.PORT || 8787), "127.0.0.1");
}
