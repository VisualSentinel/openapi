# Visual Sentinel OpenAPI Specification

Public OpenAPI 3.1.0 specification for the [Visual Sentinel](https://visualsentinel.com) REST API: a six-layer website monitoring platform covering uptime, performance, SSL, DNS, visual regression, and content change detection.

* **Spec (JSON):** [`openapi.json`](./openapi.json)
* **Spec (YAML):** [`openapi.yaml`](./openapi.yaml)
* **Hosted reference (Scalar UI):** https://visualsentinel.com/docs
* **Sign up / API key:** https://visualsentinel.com/settings/api-keys
* **Changelog:** [`CHANGELOG.md`](./CHANGELOG.md)

## What this spec covers

The 93 endpoints in this spec are the public, API-key-callable surface of Visual Sentinel: monitor management, server registration, incident workflows, alert rules and groups, notification channels, status pages, maintenance windows, integrations (Slack, Discord, PagerDuty, generic webhooks), public read-only data (announcement, blog, status pages), and the four free public tools (DNS / SSL / speed / website checker).

Out of scope on purpose: authentication flows, account billing, organization administration, AI-assisted endpoints (chat, summarization), and internal infrastructure routes. Those are session-only by design and not part of the public contract.

## Authentication

All non-public endpoints require an API key sent in the `X-API-Key` header:

```
X-API-Key: vs_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Generate keys at https://visualsentinel.com/settings/api-keys. Keys are scoped to the issuing organization and inherit the user's role-based permissions. Revoke a leaked key from the same UI; revocation is immediate.

The `/api/public/*` and `/api/tools/*` paths require no authentication.

## Rate limits

Default per-organization limits, applied on a sliding window:

| Tier         | Requests / minute | Burst |
|--------------|-------------------|-------|
| Free         | 60                | 120   |
| Solo         | 300               | 600   |
| Starter      | 600               | 1200  |
| Business     | 1500              | 3000  |
| Agency       | 3000              | 6000  |

`429 Too Many Requests` responses include `Retry-After` (seconds) and `RateLimit-Reset` (epoch). The full per-endpoint policy is in `info.x-rate-limit` of the spec.

## Quick start

### curl

```bash
curl https://visualsentinel.com/api/monitors \
  -H "X-API-Key: $VS_API_KEY" \
  -H "Accept: application/json"
```

### JavaScript (fetch)

```javascript
const res = await fetch("https://visualsentinel.com/api/monitors", {
  headers: { "X-API-Key": process.env.VS_API_KEY },
});
const data = await res.json();
```

### Python (requests)

```python
import os, requests
res = requests.get(
    "https://visualsentinel.com/api/monitors",
    headers={"X-API-Key": os.environ["VS_API_KEY"]},
)
res.raise_for_status()
print(res.json())
```

More examples in [`examples/`](./examples/).

## Versioning

* **API version:** semantic, tracked in `info.version` of the spec. Breaking changes get a major bump and a deprecation window of at least 90 days.
* **Spec version:** the file in this repository tracks the production API. Each tagged release here corresponds to a deployed Visual Sentinel release.

Backwards-incompatible changes to existing endpoints are avoided whenever possible. New optional fields and new endpoints are not considered breaking. We document deprecations in `CHANGELOG.md` with the removal target version.

## Validation

This repository ships with a GitHub Actions workflow ([`.github/workflows/validate.yml`](./.github/workflows/validate.yml)) that runs `redocly lint` and `spectral lint` on every push and pull request. Validate locally:

```bash
npx @redocly/cli lint openapi.json
npx @stoplight/spectral-cli lint openapi.yaml
```

## Discovery

Visual Sentinel publishes RFC 9727 API catalog metadata at [https://visualsentinel.com/.well-known/api-catalog](https://visualsentinel.com/.well-known/api-catalog), pointing AI agents and discovery tools at this repository's spec. The same catalog is mirrored in this repo at [`.well-known/api-catalog.json`](./.well-known/api-catalog.json).

## Issues, suggestions, and corrections

If you spot a bug in the spec (missing field, wrong type, undocumented behavior, broken example), please [open an issue](https://github.com/VisualSentinel/openapi/issues). Pull requests welcome; see [`CONTRIBUTING.md`](./CONTRIBUTING.md).

For questions about the product itself: support@visualsentinel.com.

## License

Spec is published under the MIT License (see [`LICENSE`](./LICENSE)). The Visual Sentinel API service itself is governed by the [Visual Sentinel Terms of Service](https://visualsentinel.com/terms).
