/* ===========================
   AŞAMA 1 - script.js
   - Saat & tarih
   - Dünya saatleri (İstanbul, Londra, New York, Tokyo)
   - Kronometre
   - Geri sayım
   - Alarm (basit alert + local status)
   - Tema sistemi (otomatik + manuel, localStorage)
   - Share API (basit)
   =========================== */

/* ---------- Saat & Tarih ---------- */
function updateClock() {
  const now = new Date();
  const clockEl = document.getElementById('clock');
  const dateEl = document.getElementById('date');
  clockEl.textContent = now.toLocaleTimeString('tr-TR');
  dateEl.textContent = now.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
setInterval(updateClock, 1000);
updateClock();

/* ---------- Dünya Saatleri ---------- */
/* Offsets are example values relative to UTC; you can expand later */
const cities = {
  "İstanbul": 3,
  "Londra": 0,
  "New York": -4,
  "Tokyo": 9
};

function updateWorldTimes() {
  const container = document.getElementById('worldTimes');
  container.innerHTML = '';
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  for (const [city, offset] of Object.entries(cities)) {
    const local = new Date(utc + (3600000 * offset));
    const timeStr = local.toLocaleTimeString('tr-TR');
    const el = document.createElement('div');
    el.textContent = `${city}: ${timeStr}`;
    container.appendChild(el);
  }
}
setInterval(updateWorldTimes, 1000);
updateWorldTimes();

/* ---------- Kronometre (Stopwatch) ---------- */
let swInterval = null;
let swSeconds = 0;
let swRunning = false;

function renderStopwatch() {
  const mins = String(Math.floor(swSeconds / 60)).padStart(2, '0');
  const secs = String(swSeconds % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${mins}:${secs}`;
}

function swStart() {
  if (swRunning) return;
  swRunning = true;
  swInterval = setInterval(() => {
    swSeconds++;
    renderStopwatch();
  }, 1000);
}
function swStop() {
  swRunning = false;
  clearInterval(swInterval);
}
function swReset() {
  swRunning = false;
  clearInterval(swInterval);
  swSeconds = 0;
  renderStopwatch();
}

/* attach SW buttons */
document.getElementById('sw-start').addEventListener('click', swStart);
document.getElementById('sw-stop').addEventListener('click', swStop);
document.getElementById('sw-reset').addEventListener('click', swReset);

/* ---------- Geri Sayım (Countdown) ---------- */
let cdInterval = null;
let cdRemaining = 0;

function renderCountdown() {
  document.getElementById('countdownDisplay').textContent = (cdRemaining >= 0) ? cdRemaining : '00';
}

function startCountdown() {
  const raw = parseInt(document.getElementById('countdownInput').value);
  if (!raw || raw <= 0) return alert('Lütfen geçerli bir saniye girin.');
  cdRemaining = raw;
  clearInterval(cdInterval);
  renderCountdown();
  cdInterval = setInterval(() => {
    cdRemaining--;
    renderCountdown();
    if (cdRemaining <= 0) {
      clearInterval(cdInterval);
      cdRemaining = 0;
      renderCountdown();
      // Basit uyarı (Aşama2'de bildirim eklenecek)
      alert('⏰ Süre doldu!');
    }
  }, 1000);
}

function stopCountdown() {
  clearInterval(cdInterval);
}

/* attach CD buttons */
document.getElementById('cd-start').addEventListener('click', startCountdown);
document.getElementById('cd-stop').addEventListener('click', stopCountdown);

/* ---------- Alarm (basit) ---------- */
let alarmTime = localStorage.getItem('zm_alarm') || null;

function setAlarm() {
  const val = document.getElementById('alarmTime').value;
  if (!val) return alert('Lütfen bir saat seçin.');
  alarmTime = val;
  localStorage.setItem('zm_alarm', alarmTime);
  document.getElementById('alarmStatus').textContent = `Alarm kuruldu: ${alarmTime}`;
}
function clearAlarm() {
  alarmTime = null;
  localStorage.removeItem('zm_alarm');
  document.getElementById('alarmStatus').textContent = 'Alarm yok';
}
document.getElementById('alarm-set').addEventListener('click', setAlarm);
document.getElementById('alarm-clear').addEventListener('click', clearAlarm);

/* Alarm kontrol (HH:MM) */
setInterval(() => {
  if (!alarmTime) return;
  const now = new Date();
  const cur = now.toTimeString().slice(0,5);
  if (cur === alarmTime) {
    // Basit alert (Aşama2'de Notification API eklenecek)
    alert(`🔔 Alarm: ${alarmTime}`);
    // Bir kere çalsın
    clearAlarm();
  }
}, 1000);

/* sayfa yüklendiğinde mevcut alarmı göster */
if (alarmTime) {
  document.getElementById('alarmStatus').textContent = `Alarm kuruldu: ${alarmTime}`;
}

/* ---------- Tema Sistemi (Otomatik + Manuel) ---------- */
const themeSelect = document.getElementById('themeSelect');

function applyTheme(theme) {
  document.body.classList.remove('space','gradient','wave','stars','light','dark');
  if (theme === 'auto') {
    // Saat bazlı otomatik: gece 19:00-06:00 koyu
    const h = new Date().getHours();
    if (h >= 19 || h < 6) document.body.classList.add('dark');
    else document.body.classList.add('light');
  } else {
    document.body.classList.add(theme);
  }
}

/* yüklenen temayı uygula (localStorage) */
(function initTheme() {
  const saved = localStorage.getItem('zm_theme') || 'auto';
  themeSelect.value = saved;
  applyTheme(saved);
})();

themeSelect.addEventListener('change', () => {
  const val = themeSelect.value;
  localStorage.setItem('zm_theme', val);
  applyTheme(val);
});

/* ---------- Share (Web Share API basit) ---------- */
const shareBtn = document.getElementById('shareBtn');
shareBtn.addEventListener('click', async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        text: 'Zaman Merkezi — Hızlı saat uygulaması',
        url: location.href
      });
    } catch (err) {
      console.warn('Share cancelled or failed', err);
    }
  } else {
    // fallback: kopyala
    try {
      await navigator.clipboard.writeText(location.href);
      alert('Sayfa linki kopyalandı.');
    } catch (e) {
      alert('Paylaşma desteklenmiyor, linki kopyalayın: ' + location.href);
    }
  }
});

/* ---------- Footer Yılı ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Küçük UX iyileştirmeleri ---------- */
/* Klavye ile input submit engelle */
document.querySelectorAll('input').forEach(i => {
  i.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') e.preventDefault();
  });
});
