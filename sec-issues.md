# Security notes

> **Reseller webhook delegation (2026-10-09):** Reuse active environment-scoped reseller access, credential-management configuration and canonical ready child ownership; enforce ordinary webhook roles and independently check canonical active parent ownership in Core. Subscriptions/secrets remain application-owned. Explicit bulk setup is bounded, authorizes the full selection before writes and returns application-labelled private/no-store results. Retry keys stay application-scoped; secrets are shown once and never logged or persisted in browser storage. No reseller-owned aggregate feed or implicit future-child subscription is created.

## Customer webhook preview — 2026-10-08

Document raw-body HMAC verification with a five-minute timestamp window, one-time per-endpoint secrets, environment/account checks, durable event-ID deduplication, 24-hour rotation overlap, and excluded payment/PII fields. Management endpoints use application secret keys; dashboard users use their existing role and application grants. No secrets or live endpoint addresses are included in examples.

## Webhook review contract clarifications — 2026-10-09

Recovery reads retain application authentication and account/environment scope during delivery shutdown; mutation capabilities remain disabled. Retried replay keys return the originally bound delivery generation rather than retargeting a replaced URL. Public history diagnostics expose no signing/encrypted material or contact data.

## 2026-10-09 — Reviewed delivery semantics

Document that known preparation failures belong to Prava and do not consume receiver attempts, that exhausted events retain independent incidents, and that queued email notice acknowledgement is distinct from sending. Examples continue to exclude credentials and customer response bodies. No live receiver or infrastructure configuration changed.
