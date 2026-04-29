#!/usr/bin/env bash
# Visual Sentinel API examples (curl).
# Set VS_API_KEY in your environment before running.
set -euo pipefail
: "${VS_API_KEY:?Set VS_API_KEY (https://visualsentinel.com/settings/api-keys)}"

API="https://visualsentinel.com/api"
H_AUTH="X-API-Key: $VS_API_KEY"
H_ACCEPT="Accept: application/json"

echo "== List monitors =="
curl -fsS "$API/monitors" -H "$H_AUTH" -H "$H_ACCEPT" | jq '.[0:3]'

echo "== Create a monitor =="
curl -fsS -X POST "$API/monitors" \
  -H "$H_AUTH" -H "$H_ACCEPT" -H "Content-Type: application/json" \
  -d '{"name":"Example","url":"https://example.com","type":"HTTP","interval":300}' \
  | jq '{ id, name, url, status }'

echo "== List recent incidents =="
curl -fsS "$API/incidents?limit=5" -H "$H_AUTH" -H "$H_ACCEPT" | jq '.[] | {id, monitorId, status, startedAt}'

echo "== Public health =="
curl -fsS "$API/health" -H "$H_ACCEPT" | jq
