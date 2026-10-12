# Visual Sentinel OpenAPI Specification

OpenAPI 3.1.0 specification for the [Visual Sentinel](https://visualsentinel.com) REST API: a six-layer website monitoring platform covering uptime, performance, SSL, DNS, visual change detection and content change detection.

* **Live spec (source of truth):** https://visualsentinel.com/openapi.json
* **Mirror in this repo:** [`openapi.json`](./openapi.json) and [`openapi.yaml`](./openapi.yaml)
* **Hosted reference:** https://visualsentinel.com/docs
* **API keys:** Organization settings > Developer, https://visualsentinel.com/organization/settings#developer
* **MCP server:** https://github.com/VisualSentinel/mcp-server
* **Changelog:** [`CHANGELOG.md`](./CHANGELOG.md)

`openapi.json` here is a copy of the live spec at the version in `info.version`. If the two differ, the live spec wins.

## What the spec covers

185 paths and 283 operations:

* 190 operations accept an API key: monitors (including check regions, bulk changes, alert mutes and server links), incidents and incident updates, alert rules, alerts and alert groups, notification channels, status pages (monitors, groups, servers, branding), maintenance windows, servers, service dependencies and reports.
* 42 operations are public and need no credentials: the free tools under `/api/tools/*`, health, public status pages and other public data.
* 37 operations are session-only and marked with `SessionAuth` only: sign-in flows, billing changes, API key and member management, and the AI features (chat, AI insights, incident summaries, digests). An API key on them returns 403 `SESSION_REQUIRED`.
* 14 retired operations are kept as `deprecated`. They always return 410 Gone and name the replacement.

## Authentication

**API access requires the Business or Agency plan.** On other plans every API key request returns 403 with code `API_ACCESS_NOT_IN_PLAN`.

Owners and admins create keys in Organization settings > Developer. A key is `vs_` followed by 64 hexadecimal characters and is shown once. Send it as any of:

```
Authorization: Bearer vs_...
X-API-Key: vs_...
?api_key=vs_...
```

Keys belong to one workspace and carry scopes of the form `{resource}:{read|write}` (for example `monitors:read`, `incidents:write`). GET needs `read`; POST, PUT, PATCH and DELETE need `write`. A missing scope returns 403 `SCOPE_DENIED` naming the scope required. Changes also follow the role of the member who created the key. Revoke a leaked key in the same place; revocation is immediate. The full scope and resource table is in `info.description` of the spec.

`/api/public/*` and `/api/tools/*` need no authentication.

## Check regions

Uptime checks for HTTP, HTTPS, KEYWORD, API and GRAPHQL monitors can run from `EU` (Europe), `US` (United States) and `ASIA` (Asia Pacific); other monitor types run from `EU`. Set them with `locations` when you create or update a monitor. Screenshots for visual checks are taken in `EU` or `ASIA` (`visualRegion`).

Asia Pacific is enabled per workspace while it rolls out. `GET /api/monitoring/regions` tells you whether your workspace can use it. When it cannot, a monitor request with `ASIA` returns 400 `REGION_UNAVAILABLE`. A region outside your plan returns 403 `LOCATION_RESTRICTED`.

## Rate limits

* API keys: 1,000 requests per minute per key. Over the limit the API returns 429 with code `RATE_LIMIT` and a `Retry-After` header (seconds).
* Some operations have their own limits as well, for example monitor creation (1,000 per hour per workspace), bulk monitor changes (30 per minute per workspace) and the public tools (10 per minute per IP address). The spec's `info.description` lists them.

## Quick start

### curl

```bash
curl https://visualsentinel.com/api/monitors \
  -H "Authorization: Bearer $VS_API_KEY" \
  -H "Accept: application/json"
```

Create a monitor checked every 5 minutes from Europe and the United States:

```bash
curl -X POST https://visualsentinel.com/api/monitors \
  -H "Authorization: Bearer $VS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Shop","url":"https://shop.example.com","type":"HTTPS","checkInterval":300,"locations":["EU","US"]}'
```

`checkInterval` is in seconds (values below your plan's minimum are raised to it). `timeout` is in milliseconds.

### JavaScript (fetch)

```javascript
const res = await fetch("https://visualsentinel.com/api/monitors", {
  headers: { Authorization: `Bearer ${process.env.VS_API_KEY}` },
});
const monitors = await res.json();
```

### Python (requests)

```python
import os, requests
res = requests.get(
    "https://visualsentinel.com/api/monitors",
    headers={"Authorization": f"Bearer {os.environ['VS_API_KEY']}"},
)
res.raise_for_status()
print(res.json())
```

More examples in [`examples/`](./examples/).

## Versioning

* `info.version` is the Visual Sentinel release the spec describes.
* New optional fields and new endpoints are not breaking. Deprecations and removals are recorded in `CHANGELOG.md`.

## Validation

The GitHub Actions workflow ([`.github/workflows/validate.yml`](./.github/workflows/validate.yml)) runs `redocly lint` and `spectral lint` and checks that `openapi.yaml` is a regeneration of `openapi.json`. Validate locally:

```bash
npx @redocly/cli lint openapi.json
npx @stoplight/spectral-cli lint openapi.yaml
```

## Updating the mirror

```bash
curl -fsS https://visualsentinel.com/openapi.json -o openapi.json
python3 -c "import json,yaml; yaml.safe_dump(json.load(open('openapi.json')), open('openapi.yaml','w'), sort_keys=False, allow_unicode=True, width=120)"
```

Then add a `CHANGELOG.md` entry.

## Discovery

Visual Sentinel publishes RFC 9727 API catalog metadata at https://visualsentinel.com/.well-known/api-catalog. It points agents and discovery tools at the live spec, https://visualsentinel.com/openapi.json. A copy is kept in [`.well-known/api-catalog.json`](./.well-known/api-catalog.json).

## Issues, suggestions, and corrections

If you spot a bug in the spec (missing field, wrong type, undocumented behavior, broken example), please [open an issue](https://github.com/VisualSentinel/openapi/issues). Pull requests welcome; see [`CONTRIBUTING.md`](./CONTRIBUTING.md).

For questions about the product itself: support@visualsentinel.com.

## License

Spec is published under the MIT License (see [`LICENSE`](./LICENSE)). The Visual Sentinel API service itself is governed by the [Visual Sentinel Terms of Service](https://visualsentinel.com/terms).
