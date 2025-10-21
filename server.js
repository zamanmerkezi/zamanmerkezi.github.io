/**
 * server.js
 * - Express sunucu
 * - VAPID anahtarlarını otomatik üretir (ve vapid.json'a kaydeder)
 * - /vapidPublicKey  -> istemcinin alacağı public key
 * - /subscribe       -> POST ile abonelik kaydet
 * - /sendTest        -> POST ile tüm abonelere test bildirimi gönder
 * - /add-schedule    -> POST ile aboneliğe schedule ekle (sunucuda saklanır)
 * - cron ile her dakika schedule kontrolü yapılır
 *
 * Çalıştırma:
 * 1) npm install
 * 2) node server.js
 *
 * HTTPS: local test için localhost yeterlidir; üretimde HTTPS zorunlu.
 */

const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const DB_DIR = path.join(__dirname);
const SUBS_FILE = path.join(DB_DIR, 'subscriptions.json');
const SCHEDULE_FILE = path.join(DB_DIR, 'schedules.json');
const VAPID_FILE = path.join(DB_DIR, 'vapid.json');

if (!fs.existsSync(SUBS_FILE)) fs.writeFileSync(SUBS_FILE, JSON.stringify([]));
if (!fs.existsSync(SCHEDULE_FILE)) fs.writeFileSync(SCHEDULE_FILE, JSON.stringify([]));

// 1) VAPID anahtarlarını oluştur / yükle
let vapid;
if (fs.existsSync(VAPID_FILE)) {
  vapid = JSON.parse(fs.readFileSync(VAPID_FILE, 'utf8'));
  console.log('VAPID loaded from file.');
} else {
  const keys = webpush.generateVAPIDKeys();
  vapid = { publicKey: keys.publicKey, privateKey: keys.privateKey, contact: 'mailto:you@example.com' };
  fs.writeFileSync(VAPID_FILE, JSON.stringify(vapid, null, 2));
  console.log('VAPID generated and saved to vapid.json');
}
webpush.setVapidDetails(vapid.contact || 'mailto:you@example.com', vapid.publicKey, vapid.privateKey);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/'))); // statik dosyalar (isteğe bağlı)

function readSubs() {
  try { return JSON.parse(fs.readFileSync(SUBS_FILE, 'utf8')); }
  catch (e) { return []; }
}
function saveSubs(arr) { fs.writeFileSync(SUBS_FILE, JSON.stringify(arr, null, 2)); }

function readSchedules() {
  try { return JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8')); }
  catch (e) { return []; }
}
function saveSchedules(arr) { fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(arr, null, 2)); }

// Endpoint: public VAPID key
app.get('/vapidPublicKey', (req, res) => {
  return res.json({ publicKey: vapid.publicKey });
});

// Endpoint: subscribe (istemciden abonelik al)
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  if (!subscription || !subscription.endpoint) return res.status(400).json({ error: 'Invalid subscription' });
  const subs = readSubs();
  if (!subs.find(s => s.endpoint === subscription.endpoint)) {
    subs.push(subscription);
    saveSubs(subs);
    console.log('Yeni abonelik kaydedildi. Toplam abonelik:', subs.length);
  } else {
    console.log('Abonelik zaten kayıtlı.');
  }
  res.status(201).json({ success: true });
});

// Endpoint: sendTest -> tüm abonelere test bildirimi gönder
app.post('/sendTest', async (req, res) => {
  const subs = readSubs();
  const payload = {
    title: req.body.title || 'ZAMAN MERKEZİ Test',
    body: req.body.body || 'Bu bir test bildirimidir.',
    url: req.body.url || '/'
  };
  let sent = 0, failed = 0;
  await Promise.all(subs.map(async (sub) => {
    try {
      await webpush.sendNotification(sub, JSON.stringify(payload));
      sent++;
    } catch (e) {
      failed++;
      console.error('Push send error, removing subscription if gone:', e.statusCode || e.message);
      // cleanup 410 Gone etc.
      if (e.statusCode === 410 || e.statusCode === 404) {
        // remove
        const filtered = readSubs().filter(s => s.endpoint !== sub.endpoint);
        saveSubs(filtered);
      }
    }
  }));
  res.json({ sent, failed });
});

// Endpoint: add schedule (client-side / UI kullanabilir)
app.post('/add-schedule', (req, res) => {
  // { endpoint, time: "HH:MM", pattern: "daily|weekdays|weekly", payload: {title, body} }
  const rec = req.body;
  if (!rec || !rec.endpoint || !rec.time) return res.status(400).json({ error: 'Invalid schedule' });
  const schedules = readSchedules();
  schedules.push(rec);
  saveSchedules(schedules);
  return res.json({ ok: true });
});

// Cron: her dakika schedule check et
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const hhmm = now.toTimeString().slice(0,5);
  const weekday = now.getDay(); // 0 pazar ... 6 cumartesi
  const schedules = readSchedules();
  const subs = readSubs();
  console.log('Cron check at', hhmm, 'schedules:', schedules.length, 'subs:', subs.length);
  for (const sch of schedules) {
    try {
      // örnek simplest: daily or weekdays or weekly with same weekday
      const pattern = sch.pattern || 'daily';
      let should = false;
      if (pattern === 'daily' && sch.time === hhmm) should = true;
      if (pattern === 'weekdays' && weekday >=1 && weekday <=5 && sch.time === hhmm) should = true;
      if (pattern === 'weekly' && sch.weekday == weekday && sch.time === hhmm) should = true;
      if (should) {
        // send push to the subscription with endpoint matching
        const sub = subs.find(s => s.endpoint === sch.endpoint);
        if (sub) {
          await webpush.sendNotification(sub, JSON.stringify({
            title: sch.payload && sch.payload.title ? sch.payload.title : '⏰ Zaman Merkezi',
            body: sch.payload && sch.payload.body ? sch.payload.body : `Alarm: ${sch.time}`,
            url: '/'
          }));
          console.log('Scheduled push sent to', sch.endpoint);
        }
      }
    } catch (e) { console.error('Schedule send error', e); }
  }
});

// Basit health endpoint
app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Push server running on port ${PORT}`));
