// GET /api/get-progress — Sandy's dashboard fetches Devvrat's synced progress
export default async function handler(req, res) {
  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return res.status(500).json({ error: 'KV not configured' });

  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['GET', 'devvrat_progress']),
  });
  const data = await r.json();
  if (!data?.result) return res.status(404).json({ error: 'No data yet' });

  return res.status(200).json(JSON.parse(data.result));
}
