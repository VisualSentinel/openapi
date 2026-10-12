"""Visual Sentinel API examples (Python 3.10+, requests).

Set VS_API_KEY before running:
    VS_API_KEY=vs_live_xxx python examples/python.py
"""
import os
import sys

import requests

API = "https://visualsentinel.com/api"
KEY = os.environ.get("VS_API_KEY")
if not KEY:
    print("Set VS_API_KEY (https://visualsentinel.com/organization/settings#developer)", file=sys.stderr)
    sys.exit(1)

session = requests.Session()
session.headers.update({"X-API-Key": KEY, "Accept": "application/json"})


def list_monitors():
    res = session.get(f"{API}/monitors")
    res.raise_for_status()
    return res.json()


def create_monitor(payload):
    res = session.post(f"{API}/monitors", json=payload)
    res.raise_for_status()
    return res.json()


def list_open_incidents(limit=5):
    res = session.get(f"{API}/incidents", params={"status": "active", "limit": limit})
    res.raise_for_status()
    return res.json()["incidents"]


def regions():
    res = session.get(f"{API}/monitoring/regions")
    res.raise_for_status()
    return res.json()


monitors = list_monitors()
print(f"monitors: {len(monitors)}")

# Check regions: EU, US and ASIA (Asia Pacific). ASIA is enabled per
# workspace; without it the API answers 400 REGION_UNAVAILABLE.
available = regions()
locations = ["EU", "US"]
if available["apac"]["available"] and available["apacAllowed"]:
    locations.append("ASIA")

created = create_monitor({
    "name": "Example",
    "url": "https://example.com",
    "type": "HTTPS",
    "checkInterval": 300,  # seconds
    "locations": locations,
})
print(f"created: {created['id']}")

incidents = list_open_incidents(5)
print(f"open incidents: {len(incidents)}")
