# Contributing

Thanks for considering a contribution. This repository is the public contract for the Visual Sentinel REST API; changes here propagate to every customer integration, so we keep the bar deliberately high.

## Reporting a spec bug

If a documented endpoint behaves differently from the spec, [open an issue](https://github.com/VisualSentinel/openapi/issues) with:

1. The endpoint and method.
2. A minimal `curl` reproduction (with `-i` to capture response headers).
3. The actual versus expected behavior.
4. Your spec commit SHA (`git rev-parse HEAD` in your fork).

If the spec field is missing or the type is wrong, label the issue `spec-correction` and a maintainer will pick it up.

## Suggesting a new endpoint

The public spec only documents endpoints that are part of the supported API contract. New endpoints land in this repository after they ship in production, not before. If you have a request for a new operation, open a feature request on https://visualsentinel.com/contact rather than this repo so it lands in the product backlog.

## Pull requests

Welcome for documentation fixes, example clarifications, and corrections. PRs should:

* Pass `npx @redocly/cli lint openapi.json`.
* Pass `npx @stoplight/spectral-cli lint openapi.yaml`.
* Update `CHANGELOG.md` if the change is observable to consumers.
* Keep `openapi.json` and `openapi.yaml` in sync. Only edit one and regenerate the other:
  ```
  python3 -c "import json,yaml; yaml.safe_dump(json.load(open('openapi.json')), open('openapi.yaml','w'), sort_keys=False, allow_unicode=True, width=120)"
  ```

Large structural changes (new top-level fields, removed schemas) are easier to review if you open an issue first to align on the shape.

## Code of Conduct

Be civil and accurate. We will not engage with PRs that misrepresent product behavior to push a competitive narrative.
