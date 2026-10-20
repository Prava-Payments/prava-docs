# Security notes

> **Endpoint pause notices (2026-10-21):** Explain owner/environment-scoped auto-pause, one notice per outage and send-time membership/address/current-incident checks. Receiver URLs, secrets and payloads stay out of emails; paused gaps use authenticated Events API recovery. No authentication/signature or live configuration change.


> **Mandate lifecycle contract (2026-10-20):** Explicit opt-in, merchant/customer/registry/parent checks and environment-scoped delivery apply to lifecycle events and payment mandate-ID correlation. Exclude agent/internal/simulation resources and private instruction/provider metadata. Normal control/expiry events carry null errors. Clock expiry has a family activation boundary and does not mutate financial state or imply network revocation. Historical event/replay bytes remain immutable. No receiver/signature or live configuration change.

> **Confirmed credential rejection (2026-10-19):** Preserve existing public error codes, including historical network-named codes, until a versioned API release. Only the authenticated credential service's actual upstream HTTP rejection can supply private versioned evidence; Core binds it to its request and exact stored code, and SQL validates the receipt before publishing. Missing/mismatched proof, local/service-wrapper errors, transport/timeout/rate/server outcomes, unreadable or contradictory bodies and prior PENDING remain uncertain. Browser/legacy reports remain excluded. No raw provider diagnostics enter public messages/events; charge responses use fixed safe catalog copy. Quote-charge reservation release requires matching evidence, and local persistence retries never mint credentials again. No new trust principal, secret, configuration or live operation.

> **Reseller webhook delegation (2026-10-09):** Reuse active environment-scoped reseller access, credential-management configuration and canonical ready child ownership; enforce ordinary webhook roles and independently check canonical active parent ownership in Core. Subscriptions/secrets remain application-owned. Explicit bulk setup is bounded, authorizes the full selection before writes and returns application-labelled private/no-store results. Retry keys stay application-scoped; secrets are shown once and never logged or persisted in browser storage. No reseller-owned aggregate feed or implicit future-child subscription is created.

## Customer webhook preview — 2026-10-08

Document raw-body HMAC verification with a five-minute timestamp window, one-time per-endpoint secrets, environment/account checks, durable event-ID deduplication, 24-hour rotation overlap, and excluded payment/PII fields. Management endpoints use application secret keys; dashboard users use their existing role and application grants. No secrets or live endpoint addresses are included in examples.

## Webhook review contract clarifications — 2026-10-09

Recovery reads retain application authentication and account/environment scope during delivery shutdown; mutation capabilities remain disabled. Retried replay keys return the originally bound delivery generation rather than retargeting a replaced URL. Public history diagnostics expose no signing/encrypted material or contact data.

## 2026-10-09 — Reviewed delivery semantics

Document that known preparation failures belong to Prava and do not consume receiver attempts, that exhausted events retain independent incidents, and that queued email notice acknowledgement is distinct from sending. Examples continue to exclude credentials and customer response bodies. No live receiver or infrastructure configuration changed.


## 2026-10-12 — Reviewed receiver and lifecycle boundaries

Public webhook examples use canonical session IDs. Document safe receiver422 errors,
complete bounded challenge echoes, HTTP acknowledgement without stored response bodies,
and bounded replay inspection/payload grace. No credentials, receiver diagnostics or
live endpoint data are included. Event/new replay scope remains application/environment
bound and limited to30days. These are contract clarifications, not live activation.

## Enrollment status compatibility note — 2026-10-12

The documented late-revocation status follows persisted session/action chronology.
This note adds no recipient, authorization, credential or response fields. Public
status and webhook semantics remain aligned; source checks still enforce the
creating merchant's session ownership. Deployment timing is described as upcoming.

## Webhook receiver documentation structure — 2026-10-12

Clarify that any backend can receive signed webhooks; runtime and SQLite requirements apply only to optional examples. Preserve raw-byte verification, application/environment checks, durable deduplication and private signing-key configuration. Distinguish application API credentials from endpoint signing secrets. Move opt-in sandbox control configuration to advanced testing guidance and explicitly exclude actual lifecycle receipt in control mode; ordinary receivers leave those controls unset. No code, credential, authorization or deployed configuration changed.

## Webhook public outcome errors — 2026-10-16

Document only fixed allowlisted public error text; provider diagnostics, request bodies, shipping/contact data, access grants and unverified quote IDs are excluded. Quote-request failure is distinct from Merchant quote/payment lifecycle, especially on timeouts. Existing ownership/environment/subscription checks and raw-byte signature verification remain. Old retained payloads stay immutable and may omit additive fields. No new auth scope, receiver controls, dependency, environment or live configuration.

## Outcome authority and compatibility repair — 2026-10-19

Only authoritative issued payment transitions enter payment webhooks; browser reports and pre-issuance failures cannot attest card-issuer causes. Public result projections sanitize client-selected financial reasons and preserve cancellation identity. Neutral enrollment aliases and fixed actionable text replace unpublished network-specific public codes. Quote correlation is exposed only on confirmed subscribed capture; short isolated acquisition/lock/statement/client limits preserve the API failure without automatically retrying ambiguous writes. Existing cancellation category and retained event bytes stay unchanged. No live configuration, secret or receiver changes.

Legacy fail-report metadata cannot establish issuer authority; the API compatibility guide documents its conservative generic projection.

## Quote capture and resource-filter clarification — 2026-10-19

The documented identifier pattern now matches Core’s existing bound, parameterized validation; it grants no new scope or data access. Best-effort capture is distinguished from durable delivery, with explicit burst/timeout loss and no backfill; receivers must use the synchronous error response. No receiver/authentication/credential configuration changes.

## 2026-10-19 — Outcome compatibility and trusted credential failures

Only fixed Core writers attach a code-bound credential-failure receipt. The capture function excludes end-user markers and legacy caller-controlled fail-report pairs, transport/unknown issuance results, agent/simulation/authorize-only flows and unresolved ownership. API compatibility preserves existing recognized public codes or safe authentication/cancellation reports; unverified issuer claims and unknown codes remain generic. All returned messages use fixed local copy. Existing categories/schema and immutable replay bytes are preserved; no transaction trigger DDL, new grants, secrets, dependencies or live configuration changes.

Mandate setup keeps its existing generic failure event when all attempts fail, but source-aware reason selection prevents marked or legacy shopper reports from supplying an issuer diagnosis. The payment.failed publication gate remains stricter: no browser report or uncertain outcome creates it.
