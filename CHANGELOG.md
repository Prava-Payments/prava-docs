# Changelog

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
