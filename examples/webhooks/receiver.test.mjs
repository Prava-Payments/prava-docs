import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { receiver, verify } from "./receiver.mjs";
const secret = "whsec_example",
  raw = Buffer.from('{"id":"evt_a"}'),
  now = Date.now(),
  t = String(Math.floor(now / 1000));
const signature = (body, timestamp = t) =>
  `t=${timestamp},v1=${createHmac("sha256", secret)
    .update(timestamp + ".")
    .update(body)
    .digest("hex")}`;
test("signature rejects tampering, stale time and duplicate timestamps while accepting overlap", () => {
  assert(verify(raw, signature(raw), ["old", secret], now));
  assert(!verify(Buffer.from("{}"), signature(raw), [secret], now));
  assert(!verify(raw, signature(raw, "1"), [secret], now));
  assert(!verify(raw, signature(raw) + ",t=" + t, [secret], now));
});
test("receiver verifies scope, persists duplicate receipt once and echoes signed challenges", async () => {
  const dir = await mkdtemp(join(tmpdir(), "webhook-receiver-")),
    database = join(dir, "inbox.sqlite");
  const server = receiver({
    config: () => ({
      account_id: "ma_a",
      environment: "sandbox",
      secrets: [secret],
    }),
    database,
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  try {
    const url = `http://127.0.0.1:${server.address().port}/webhooks`;
    const send = async (event) => {
      const body = JSON.stringify(event);
      return fetch(url, {
        method: "POST",
        headers: { "Prava-Signature": signature(body) },
        body,
      });
    };
    const event = {
      id: "evt_example",
      type: "card_enrollment.completed",
      account_id: "ma_a",
      environment: "sandbox",
      test: true,
      resource: { id: "sess_a", version: 1 },
    };
    assert.equal((await send(event)).status, 204);
    assert.equal((await send(event)).status, 204);
    assert.equal(
      (await send({ ...event, account_id: "ma_other" })).status,
      400,
    );
    assert.deepEqual(
      await (
        await send({
          ...event,
          type: "webhook.endpoint_verification",
          challenge: "nonce",
        })
      ).json(),
      { challenge: "nonce" },
    );
    const db = new DatabaseSync(database);
    assert.equal(
      db.prepare("SELECT count(*) AS n FROM webhook_inbox").get().n,
      1,
    );
    db.close();
  } finally {
    await new Promise((r) => server.close(r));
    await rm(dir, { recursive: true, force: true });
  }
});

test("optional E2E control is authenticated, sandbox/account scoped and accepts only synthetic deliveries", async () => {
  const dir = await mkdtemp(join(tmpdir(), "webhook-e2e-"));
  let settings = {};
  const controlKey = "a".repeat(43),
    signing = "whsec_" + "b".repeat(43);
  const server = receiver({
    config: () => settings,
    database: join(dir, "inbox.sqlite"),
    control: {
      key: controlKey,
      account_id: "ma_e2e",
      save: (s) => {
        settings = s;
      },
    },
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const input = {
      account_id: "ma_e2e",
      environment: "sandbox",
      secrets: [signing],
      reject_attempts: 1,
    };
    const configure = (body, token = controlKey) =>
      fetch(base + "/e2e/config", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: JSON.stringify(body),
      });
    assert.equal((await configure(input, "wrong")).status, 401);
    assert.equal(
      (await configure({ ...input, environment: "production" })).status,
      400,
    );
    assert.equal(
      (await configure({ ...input, account_id: "ma_other" })).status,
      400,
    );
    assert.equal((await configure(input)).status, 204);
    const send = async (test) => {
      const body = JSON.stringify({
        id: "evt_e2e",
        type: "payment.succeeded",
        account_id: "ma_e2e",
        environment: "sandbox",
        test,
        resource: { id: "txn_example", version: 1 },
      });
      const sig = `t=${t},v1=${createHmac("sha256", signing)
        .update(t + "." + body)
        .digest("hex")}`;
      return fetch(base + "/webhooks", {
        method: "POST",
        headers: { "Prava-Signature": sig, "Prava-Delivery-Id": "whd_e2e" },
        body,
      });
    };
    assert.equal((await send(false)).status, 400);
    assert.equal((await send(true)).status, 503);
    assert.equal((await send(true)).status, 204);
    assert.equal(
      (
        await fetch(base + "/e2e/config", {
          method: "DELETE",
          headers: { Authorization: "Bearer " + controlKey },
        })
      ).status,
      204,
    );
    assert.deepEqual(settings, {});
  } finally {
    await new Promise((r) => server.close(r));
    await rm(dir, { recursive: true, force: true });
  }
});
