# Changelog

All notable changes to the public Visual Sentinel OpenAPI specification.

This file tracks changes to the **spec itself**: added or removed endpoints, field changes, type changes, deprecations. Visual Sentinel product release notes live at https://visualsentinel.com/changelog.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the spec uses [Semantic Versioning](https://semver.org/) in `info.version`.

## [2.25.1] - 2026-04-29

Initial public release of the spec.

* 93 endpoints across 25 tags: System, Monitors, Visual Monitoring, Servers, Server Alerts, Notification Channels, Alerts, Alert Rules, Alert Groups, Incidents, Status Pages, Maintenance, Integrations, Tools, Reports, Analytics, Notifications, API Keys, Push Subscriptions, DNS, Plan, Public Data, plus the public read-only blog and status surface.
* `ApiKeyAuth` security scheme as the only public authentication method.
* External documentation pointer at https://visualsentinel.com/docs.

The internal session-only surface (authentication flows, billing, organization administration, AI-assisted endpoints, internal webhooks) is intentionally excluded; those are not part of the public contract.
