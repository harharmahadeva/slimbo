// POST /api/sync-mins — saves Devvrat's studied minutes to KV so push messages are accurate
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { mins } = req.body || {};
  if (typeof mins !== 'number') return res.status(400).json({ error: 'Invalid mins' });

  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return res.status(500).json({ error: 'KV not configured' });

  // Store with midnight expiry (86400s = 24h) so it resets each day
  await fetch(`${url}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['SET', 'devvrat_today_mins', String(mins), 'EX', '86400']),
  });

  return res.status(200).json({ ok: true });
}
