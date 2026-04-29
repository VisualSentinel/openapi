// Visual Sentinel API examples (Node 18+, pure fetch).
// Set VS_API_KEY before running:
//   VS_API_KEY=vs_live_xxx node examples/javascript.mjs

const API = "https://visualsentinel.com/api";
const KEY = process.env.VS_API_KEY;
if (!KEY) {
  console.error("Set VS_API_KEY (https://visualsentinel.com/settings/api-keys)");
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

async function listIncidents(limit = 5) {
  const res = await fetch(`${API}/incidents?limit=${limit}`, { headers });
  if (!res.ok) throw new Error(`incidents ${res.status}`);
  return res.json();
}

const monitors = await listMonitors();
console.log(`monitors: ${monitors.length}`);

const created = await createMonitor({
  name: "Example",
  url: "https://example.com",
  type: "HTTP",
  interval: 300,
});
console.log(`created: ${created.id}`);

const incidents = await listIncidents(5);
console.log(`recent incidents: ${incidents.length}`);
