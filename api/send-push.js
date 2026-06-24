// GET /api/send-push — called by Vercel Cron, sends study reminder to Devvrat's iPad
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:sandeepsharma1984@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

function getMessage(hour, studiedMins) {
  const goal = 120;
  const left = Math.max(0, goal - studiedMins);
  if (hour === 7)  return { title: 'Goedemorgen Devvrat! 🌅', body: 'Tijd om te starten met Slimbo! Doel: 2 uur vandaag 🚀' };
  if (hour === 15) return { title: 'Hey Devvrat! ⚡', body: studiedMins < 60 ? `Je hebt nog ${left} minuten te gaan vandaag! Kom op 💪` : `Goed bezig — nog ${left} min te gaan! 🌟` };
  if (hour === 20) return { title: 'Laatste herinnering! ⏰', body: left > 0 ? `Nog ${left} minuten voor je dagdoel. Je kunt het! 🎯` : 'Dagdoel bereikt! Super gedaan vandaag ⭐' };
  return null;
}

export default async function handler(req, res) {
  // Protect the cron endpoint
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return res.status(500).json({ error: 'KV not configured' });

  // Fetch saved subscription from KV
  const kvRes = await fetch(`${url}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['GET', 'push_subscription']),
  });
  const kvData = await kvRes.json();
  const raw = kvData?.result;
  if (!raw) return res.status(200).json({ ok: true, skipped: 'no subscription saved' });

  const subscription = JSON.parse(raw);

  // Fetch today's studied minutes from KV (saved by the app)
  const minsRes = await fetch(`${url}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['GET', 'devvrat_today_mins']),
  });
  const minsData = await minsRes.json();
  const studiedMins = parseInt(minsData?.result || '0', 10);

  // Pick the right message based on current hour (Amsterdam time)
  const hour = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' })).getHours();
  const msg = getMessage(hour, studiedMins);
  if (!msg) return res.status(200).json({ ok: true, skipped: 'no message for this hour' });

  try {
    await webpush.sendNotification(subscription, JSON.stringify({
      title: msg.title,
      body:  msg.body,
      icon:  '/icon.svg',
      badge: '/icon.svg',
      tag:   'slimbo-reminder',
    }));
    return res.status(200).json({ ok: true, sent: msg.title });
  } catch (err) {
    if (err.statusCode === 410) {
      // Subscription expired — remove it
      await fetch(`${url}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(['DEL', 'push_subscription']),
      });
    }
    return res.status(500).json({ error: err.message });
  }
}
