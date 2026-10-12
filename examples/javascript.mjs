// Visual Sentinel API examples (Node 18+, pure fetch).
// Set VS_API_KEY before running:
//   VS_API_KEY=vs_live_xxx node examples/javascript.mjs

const API = "https://visualsentinel.com/api";
const KEY = process.env.VS_API_KEY;
if (!KEY) {
  console.error("Set VS_API_KEY (https://visualsentinel.com/organization/settings#developer)");
  process.exit(1);
}

const headers = { "X-API-Key": KEY, Accept: "application/json" };

async function listMonitors() {
  const res = await fetch(`${API}/monitors`, { headers });
  if (!res.ok) throw new Error(`monitors ${res.status}`);
  return res.json();
}

async function createMonitor(payload) {
  const res = await fetch(`${API}/monitors`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`create ${res.status}: ${await res.text()}`);
  return res.json();
}

async function listOpenIncidents(limit = 5) {
  const res = await fetch(`${API}/incidents?status=active&limit=${limit}`, { headers });
  if (!res.ok) throw new Error(`incidents ${res.status}`);
  return (await res.json()).incidents;
}

async function regions() {
  const res = await fetch(`${API}/monitoring/regions`, { headers });
  if (!res.ok) throw new Error(`regions ${res.status}`);
  return res.json();
}

const monitors = await listMonitors();
console.log(`monitors: ${monitors.length}`);

// Check regions: EU, US and ASIA (Asia Pacific). ASIA is enabled per
// workspace; without it the API answers 400 REGION_UNAVAILABLE.
const available = await regions();
const locations = ["EU", "US"];
if (available.apac.available && available.apacAllowed) locations.push("ASIA");

const created = await createMonitor({
  name: "Example",
  url: "https://example.com",
  type: "HTTPS",
  checkInterval: 300, // seconds
  locations,
});
console.log(`created: ${created.id}`);

const incidents = await listOpenIncidents(5);
console.log(`open incidents: ${incidents.length}`);
