# Prava Docs — Improvement Roadmap & Tracker

Internal tracker (not published — not in `docs.json` nav). Captures the competitive benchmark, what's
shipped, and what's next to make these docs best-in-class.

_Last updated: 2026-07-13 · Live at https://docs.prava.space (Mintlify, auto-deploys on merge to `main`)._

## Benchmark summary (vs Stripe / Twilio / Plaid / Adyen)

We match the **explanatory** fundamentals the best docs are praised for; we lag on **interactivity** and
**visuals**.

- **Strengths (already good):** use-case-first structure, fast self-serve quickstart, first-class
  troubleshooting/error docs, clean product-scoped IA, and (post fact-check) accuracy vs code.
- **Gaps (to close):** no interactive "try it" API playground, single-language (cURL/Node) examples,
  hand-authored reference that can drift, thin visuals, no changelog.

Sources: [Moesif Stripe teardown](https://www.moesif.com/blog/best-practices/api-product-management/the-stripe-developer-experience-and-docs-teardown/) ·
[Raw.Studio Stripe UX](https://raw.studio/blog/how-stripe-uses-4-developer-first-ux-principles-to-drive-massive-adoption/) ·
[Mintlify API doc tools](https://www.mintlify.com/blog/top-7-api-documentation-tools-of-2025) ·
[Fern best practices](https://buildwithfern.com/post/api-documentation-best-practices-guide) · [Diátaxis](https://diataxis.fr/)

## ✅ Shipped (this cycle — merged to `main`, PR #1)

- [x] **Accuracy pass** — SDK, REST API, and Concepts fact-checked against core code
- [x] **SDK corrected** to its real surface (`collectPAN`); removed fictional intent/card SDK methods
- [x] **Prava Pay (CLI) tab** — overview, quickstart, linking, sessions, shopping, skills, troubleshooting
- [x] **Choosing Your Integration** decision guide + **embedded vs hosted** integration modes
- [x] **Server REST API** reference verified vs core; **Sandbox/Production** examples on every endpoint
- [x] **Self-serve onboarding** (dashboard.prava.space); fixed quickstart & authentication
- [x] **Concepts** reframed to reality — Accounts & Agents (was "Wallets"), Payments, Guardrails
- [x] **Agentic Commerce tab** — UCP + Browser Harness capabilities (replaced "Merchant Integration")
- [x] **AI access (Part A)** — hosted **MCP** (`/mcp`) + **llms.txt** (both auto) + "Use Prava Docs with AI" page
- [x] **Sidebar declutter** — moved Blog/X/LinkedIn out of the sidebar top

## ✅ Shipped (2026-07-13 — content/IA revamp, branch `docs/prava-pay-and-sdk-refresh`)

- [x] **OpenAPI spec → interactive API Reference** (P0) — `api-reference/openapi.json` wired into the
      nav; sandbox/prod servers; `POST /v1/deleteCard` added (verified vs core `external.ts`).
- [x] **Changelog page** (was P1) — `changelog.mdx` with `<Update>` components.
- [x] **Task-titled how-to guides** (was P2) — `guides/add-payments-to-your-ai-app`,
      `guides/rest-checkout-walkthrough`, `guides/go-live-checklist`.
- [x] **Canonical errors reference** — `api-reference/errors.mdx`, codes verified against core.
- [x] **Sandbox testing page** — `api-reference/testing.mdx` (honest: test cards are team-provisioned).
- [x] **Audience journeys completed** — `prava-pay/your-wallet` (agent owners),
      `integration/merchants`, index 4-persona router, `developer-faq`, `concepts/glossary`.
- [x] **Concepts reframed to public flow** — payments.mdx "lifecycle you drive vs what Prava does";
      statuses verified vs code (`pending/awaiting_result/completed/failed`).
- [x] **Consistency pass** — support@prava.space everywhere; recurring-mandate "planned" aligned;
      10-min poll vs 15-min expiry disambiguated; collectPAN + pipeline dedupes; portals snippet
      (dashboard vs pay); real README; dead snippet removed.

## ✅ Shipped (2026-07-14 — team-feedback round: MCP + IA + tone)

- [x] **Prava MCP documented** (live at `mcp.pay.prava.space/mcp`) — `mcp/{overview,connect,tools}`,
      12 tools verified from `wallet-mcp/src/mcp/server.ts`; all "MCP coming soon" mentions replaced.
- [x] **IA restructure** — Prava Pay tab dissolved into Developer Guide (SDK/MCP/CLI as sibling
      groups); Agentic Commerce → **Capabilities** (Shopping + coming-soon Travel/Dining); **FAQ** tab.
- [x] **Public sandbox test cards + test OTP** published on the testing page (was P1).
- [x] **Use Cases** + **Compliance & Verification** pages; ai.mdx → "Navigating These Docs"
      (human + agent paths; docs MCP vs payments MCP).
- [x] **Brand callout theming** (Note/Info/Tip/Warning off stock blue/yellow) + one mermaid design
      language across all diagrams (was "Visual consistency", P2).
- [x] **Tone pass** — fewer em dashes, plain-language first-use intros, worked examples
      (human-in-the-loop + recurring-as-planned); "Prava Wallet" renamed to **Prava Pay dashboard**.

## 🔜 Backlog (prioritized)

### P0 — highest leverage
- [ ] **Enable "Ask AI" chat widget** (Mintlify dashboard; paid tier). Effort: **S (config)**.
      _Deferred earlier as paid — turn on when budget allows._
- [ ] **Webhooks: ship event delivery, then document.** Outbound delivery is **not implemented** in
      core (verified 2026-07-13 — only `webhook_url`/`webhook_secret` storage). Docs now say "coming
      soon" honestly (`authentication.mdx`). When delivery ships: event catalog, payload schemas,
      signature verification page.

### P1
- [ ] **Visuals** — screenshots (hosted collect page, dashboard "Create API Key") + one **terminal
      recording** (asciinema/GIF) of the Prava Pay flow. Effort: **M**. _Breaks the text wall; builds trust._
- [ ] **Multi-language code samples** (add Python/Go). Effort: **M** — or **free** now that OpenAPI landed.
- [ ] **Travel + Dining capabilities** — docs stubs live as "coming soon"
      (`integration/{travel,dining}.mdx`); flesh out when the products ship (Duffel/lastminute,
      OpenTable/Toast).
- [ ] **Pricing page** — deferred (owner undecided); FAQ carries a contact line meanwhile.

### P2 — polish
- [ ] **Stronger landing hero** — "first payment in ~2 min" + the paths. Effort: **S**.
- [ ] **"Was this page helpful?" feedback** + review Mintlify AI/traffic analytics. Effort: **S**.
- [ ] **Visual consistency** — logo/hero imagery, shared design language with the dashboard. Effort: **S/M**.

## 🛠 Ops / infra
- [ ] **CDN cache purge on deploy.** `docs.prava.space` is proxied through **Cloudflare**, which served
      **~14h-stale HTML** after a fresh deploy (`cf-cache-status: HIT`, `age: ~49669`). New paths were
      fine; already-cached paths went stale. Fix: purge the Cloudflare cache on each Mintlify deploy (or
      stop caching HTML / lower TTL) so "latest live" is instant. Effort: **S**.

## 📌 Known content debt / deliberate decisions
- **Guardrails** intentionally keeps the "intent register/update/delete" passkey line and omits the
  sandbox-fallback caveat (per owner decision). Revisit if the intent model ships or changes.
- **Merchant-lock "network-level enforcement" claim STANDS** (owner decision 2026-07-13): enforcement
  is at Visa as well as at Prava — kept in faqs, index, and how-it-works. Supersedes the earlier
  "over-claim" debt entry.
- **Platform examples "OpenClaw, Hermes, ChatGPT" STAND** (owner decision 2026-07-13) on index +
  choosing-your-integration, even though the CLI `--platform` id list differs.
- **"MCP connector — coming soon"** (Prava Pay) and **recurring mandate frequencies "planned"** — flip
  to real once shipped (report-status now aligned to "planned" too).
- **Webhooks "coming soon"** — see P0 backlog item; do not document delivery until it ships.

## How deploys are tracked
- No repo CI. **Mintlify GitHub App** auto-builds on merge to `main`.
- Watch: **Mintlify dashboard → Deployments** (commit SHA + build status) · **GitHub commit check** ("Deployment") ·
  or probe the live site: `curl -s -o /dev/null -w "%{http_code}" https://docs.prava.space/<page>`.
- **Remember the Cloudflare cache** (Ops item above) when checking "is it live?".
