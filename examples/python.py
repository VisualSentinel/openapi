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
    print("Set VS_API_KEY (https://visualsentinel.com/settings/api-keys)", file=sys.stderr)
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


def list_incidents(limit=5):
    res = session.get(f"{API}/incidents", params={"limit": limit})
    res.raise_for_status()
    return res.json()


monitors = list_monitors()
print(f"monitors: {len(monitors)}")

created = create_monitor({
    "name": "Example",
    "url": "https://example.com",
    "type": "HTTP",
    "interval": 300,
})
print(f"created: {created['id']}")

incidents = list_incidents(5)
print(f"recent incidents: {len(incidents)}")
