# Changelog

All notable changes to the public Visual Sentinel OpenAPI specification.

This file tracks changes to the **spec itself**: added or removed endpoints, field changes, type changes, deprecations. Visual Sentinel product release notes live at https://visualsentinel.com/changelog.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the spec uses [Semantic Versioning](https://semver.org/) in `info.version`.

## [2.214.52] - 2026-10-12

Resync with the live spec at https://visualsentinel.com/openapi.json, which is now the source of truth (this file is a copy). 185 paths, 283 operations.

### Fixed

* Maintenance window create requires `title` (the spec said `name`, which the API rejects with 400). Recurrence fields (`recurrenceKind`, `timezone`) and `POST /api/maintenance/{id}/cancel` are documented.
* `CreateMonitorRequest` and `UpdateMonitorRequest` document every field the API accepts, including `locations` (check regions `EU`, `US`, `ASIA`), `visualRegion`, `keywordConfig`, `contentConfig`, `apiConfig` and alert settings. `timeout` allows up to 120000 ms; `checkInterval` defaults to 300 seconds.
* `MonitorType` lists the 12 types that can be created. `VISUAL` and `CONTENT` were never creatable types; visual and content checks are settings on an HTTP or HTTPS monitor. `StoredMonitorType` lists every stored value; `Monitor.type` is returned in lower case.
* Incident update documents `acknowledged`, `resolution`, `rootCause`, `autoResolve` and the other accepted fields (`updateMessage` was never read). `PATCH /api/incidents/{id}` and `POST /api/incidents/{id}/updates` are documented.
* Notification channel create no longer lists `SMS`; it lists `TEAMS`, `OPSGENIE`, `PROMETHEUS` and `PUSH` with the right type names, plus `alertTypes` and `isDefault`.
* `GET /api/tools/ssl-check` takes `domain` (not `url`); `GET /api/tools/dns-check` documents `type`.
* `POST /api/monitors/{id}/anomalies` and `POST /api/monitors/{id}/report` are marked session-only, as the API enforces.
* Authentication notes: 1,000 requests per minute per key (not per hour), keys are `vs_` plus 64 hexadecimal characters, the real scope and resource list, and API access on the Business and Agency plans only.
* OpenAPI 3.0 `nullable: true` replaced with 3.1 type unions.

### Added

* 148 operations that were missing from this mirror, including `GET /api/monitoring/regions` (Asia Pacific availability, `REGION_UNAVAILABLE`, `LOCATION_RESTRICTED`), monitor alert mute, bulk monitor changes, monitor and server links, status page groups, servers, ordering, logo and favicon, incident context, alert deliveries, monitor restore and deleted monitors, service dependencies, settings and organization endpoints, and the session-only endpoints (marked `SessionAuth`).
* Retired endpoints (`/api/teams*`, `/api/organization/email-templates`, `POST /api/settings/reports/test`, `/api/reports/generate`) documented as `deprecated` with their 410 response and replacement path.

### Removed

* 17 operations that no longer exist or never worked: `/api/integrations/{slack,discord,pagerduty,webhook}` (and their `/test` endpoints), `GET /api/analytics/journeys` and `POST /api/monitors/check`.

### Changed

* README: rate limits, key format, `checkInterval` in examples, endpoint counts, plan requirement, check regions.
* Examples use `checkInterval`, `locations`, `status=active` for open incidents and the `{ incidents, pagination }` response shape.
* `.well-known/api-catalog.json` matches the live catalog, which points at the live spec.

## [2.25.1] - 2026-04-29

Initial public release of the spec.

* 93 endpoints across 25 tags: System, Monitors, Visual Monitoring, Servers, Server Alerts, Notification Channels, Alerts, Alert Rules, Alert Groups, Incidents, Status Pages, Maintenance, Integrations, Tools, Reports, Analytics, Notifications, API Keys, Push Subscriptions, DNS, Plan, Public Data, plus the public read-only blog and status surface.
* `ApiKeyAuth` security scheme as the only public authentication method.
* External documentation pointer at https://visualsentinel.com/docs.

The internal session-only surface (authentication flows, billing, organization administration, AI-assisted endpoints, internal webhooks) is intentionally excluded; those are not part of the public contract.
