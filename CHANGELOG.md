# Changelog

## [Unreleased] — 2026-10-19-4

### Fixed

- Remove the normalized provider-workflow guidance claim belonging to the separate, unfinished Core #230 work. Keep this guide scoped to the standalone webhook release in Core #271.

## [Unreleased] — 2026-10-19-3

### Changed

- Clarify that unmapped provider-workflow codes use the safe generic fallback while normalized payment-result guidance remains available.

## [Unreleased] — 2026-10-19-2

### Fixed

- Match event-history resource filters to Core: `txn_`, `ses_` and `qreq_`, underscores allowed, maximum 120 characters; add quote-request IDs to the API guide and a contract regression.
- State explicitly that quote-request failure capture is best-effort: bursts/timeouts can skip events without retry or backfill, while saved events retain normal delivery guarantees.

## [Unreleased] — 2026-10-19-1

### Fixed

- Document issued-only payment coverage, exclusion of browser failure reports and uncertain pre-issuance outcomes, preserved enrollment cancellation category, and confirmed-only quote correlation headers with bounded capture.
- Publish neutral enrollment error codes, actionable messages and transaction-level payment-result error normalization/legacy-code migration guidance.

## [Unreleased] — 2026-10-16-2

### Fixed

- Clarify that a retried operation may create a different payment-attempt resource, while delivery retries and replays preserve the original event bytes.

## [Unreleased] — 2026-10-16-1

### Added

- Document safe error codes across payment, enrollment and mandate outcomes, quote-request failure subscriptions/examples, and explicit missing lifecycle-event coverage.

### Changed

- Explain credential-issuance failure stages, retained-event compatibility, terminal enrollment status reasons, and twelve supported event choices in OpenAPI.

## [Unreleased] — 2026-10-12-4

### Changed

- Keep webhook signature guidance language-independent; move optional Node/Python receiver setup and runtime requirements into a separate examples page.
- Separate sandbox testing guidance and opt-in automated receiver controls from the main security guide.

## [Unreleased] — 2026-10-12-3

### Changed

- Simplify webhook environment enablement guidance and link the event catalog near the start of the setup overview.

## [Unreleased] — 2026-10-12-2

### Changed

- Add API compatibility notes for `GET /v1/sessions/{sessionId}/status`: a full-enrollment session revoked at or after expiry remains `expired`; earlier cancellation stays `cancelled`. Integrators should handle both terminal states.

## [Unreleased] — 2026-10-12-1

### Fixed

- Use canonical session IDs in API/webhook examples and filters, and document actionable receiver/challenge errors and bodyless control requests.

### Changed

- Clarify HTTP acknowledgement independently of bounded response bodies, bounded replay retention grace and cancellation/expiry chronology.

## [Unreleased] — 2026-10-09-5

### Changed

- Clarify internal preparation delays, event-scoped exhaustion recovery, adaptive Dashboard refresh and durable queued notice semantics.

## [Unreleased] — 2026-10-09-4

### Added

- Document reseller-managed application subscriptions, shared receivers and independent bulk setup results.

## [Unreleased] — 2026-10-09-3

### Changed

- Clarify repeated retry result versions, replay key binding across destination changes, incident visibility and retained recovery reads during delivery shutdown.

## [Unreleased] — 2026-10-09-2

### Security

- Add optional authenticated control for a dedicated sandbox account and synthetic deliveries; ordinary receivers keep it disabled.

### Fixed

- Preserve nullable uncapped mandate budgets and document expiry after capture activation.

## [Unreleased] — 2026-10-09-1

### Added

- Document full enrollment and mandate-creation events, event filters, queued synthetic tests, circuit recovery and verified incident notices.
- Add runnable Node/Python receivers with raw-byte signature verification and durable SQLite receipt deduplication.

## [Unreleased] — 2026-10-08-1

### Added

- Gated-preview webhook setup, event catalog, signature verification, delivery/recovery guidance, and matching OpenAPI operations. Availability remains dependent on sandbox-first Core activation.
