# Prava Docs

Source for [docs.prava.space](https://docs.prava.space) — Prava's developer documentation, built with
[Mintlify](https://mintlify.com).

## Preview locally

```bash
npm i -g mint
mint dev          # http://localhost:3000
mint broken-links # check internal links
```

## Structure

- `docs.json` — navigation, theme, fonts, SEO
- `*.mdx` — pages (tabs: Developer Guide, Prava Pay, API Reference, Concepts, Agentic Commerce)
- `api-reference/openapi.json` — OpenAPI spec backing the interactive API reference
- `style.css`, `fonts/`, `images/`, `logo/` — branding
- `ROADMAP.md` — internal improvement tracker (not published)

## Deploys

Merging to `main` auto-deploys via the Mintlify GitHub app — watch the Mintlify dashboard →
Deployments. Note: docs.prava.space sits behind Cloudflare; cached HTML can serve stale after a deploy
(see ROADMAP ops item).

## Support

Questions: support@prava.space
