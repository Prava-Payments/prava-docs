# Security notes

## Customer webhook preview — 2026-10-08

Document raw-body HMAC verification with a five-minute timestamp window, one-time per-endpoint secrets, environment/account checks, durable event-ID deduplication, 24-hour rotation overlap, and excluded payment/PII fields. Management endpoints use application secret keys; dashboard users use their existing role and application grants. No secrets or live endpoint addresses are included in examples.
