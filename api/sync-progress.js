// POST /api/sync-progress — saves Devvrat's progress summary to KV after each session
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const data = req.body;
  if (!data) return res.status(400).json({ error: 'No data' });

  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return res.status(500).json({ error: 'KV not configured' });

  await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['SET', 'devvrat_progress', JSON.stringify(data)]),
  });

  return res.status(200).json({ ok: true });
}
