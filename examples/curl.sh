#!/usr/bin/env bash
# Visual Sentinel API examples (curl).
# Set VS_API_KEY in your environment before running.
set -euo pipefail
: "${VS_API_KEY:?Set VS_API_KEY (https://visualsentinel.com/organization/settings#developer)}"

API="https://visualsentinel.com/api"
H_AUTH="X-API-Key: $VS_API_KEY"
H_ACCEPT="Accept: application/json"

echo "== List monitors =="
curl -fsS "$API/monitors" -H "$H_AUTH" -H "$H_ACCEPT" | jq '.[0:3]'

echo "== Can this workspace use Asia Pacific (ASIA)? =="
curl -fsS "$API/monitoring/regions" -H "$H_AUTH" -H "$H_ACCEPT" | jq

echo "== Create a monitor (checked from Europe and the US every 5 minutes) =="
curl -fsS -X POST "$API/monitors" \
  -H "$H_AUTH" -H "$H_ACCEPT" -H "Content-Type: application/json" \
  -d '{"name":"Example","url":"https://example.com","type":"HTTPS","checkInterval":300,"locations":["EU","US"]}' \
  | jq '{ id, name, url, status, locations }'

echo "== List open incidents =="
curl -fsS "$API/incidents?status=active&limit=5" -H "$H_AUTH" -H "$H_ACCEPT" | jq '.incidents[] | {id, monitorId, status, startedAt}'

echo "== Public health =="
curl -fsS "$API/health" -H "$H_ACCEPT" | jq
