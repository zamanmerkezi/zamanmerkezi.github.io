// 🕒 ZAMAN MERKEZİ — Tam İşlevli Script v2.5
// Her özellik aktif, bildirim destekli, PWA uyumlu

// ======================= //
//  🌍 Dijital + Tarih
// ======================= //
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString("tr-TR");
  document.getElementById("date").textContent = now.toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
setInterval(updateClock, 1000);
updateClock();

// ======================= //
//  🌍 Dünya Saatleri
// ======================= //
const worldZones = {
  "İstanbul": "Europe/Istanbul",
  "Londra": "Europe/London",
  "New York": "America/New_York",
  "Tokyo": "Asia/Tokyo"
};
function updateWorldTimes() {
  const list = document.getElementById("worldTimes");
  if (!list) return;
  list.innerHTML = "";
  Object.keys(worldZones).forEach(city => {
    const time = new Date().toLocaleTimeString("tr-TR", { timeZone: worldZones[city] });
    const p = document.createElement("p");
    p.textContent = `${city}: ${time}`;
    list.appendChild(p);
  });
}
setInterval(updateWorldTimes, 1000);
updateWorldTimes();

// ======================= //
//  ⏱ Kronometre (saat:dakika:saniye:milisaniye)
// ======================= //
let swStartTime, swInterval, swElapsed = 0, swRunning = false;
const timerEl = document.getElementById("timer");

function updateStopwatch() {
  const diff = Date.now() - swStartTime + swElapsed;
  const ms = Math.floor((diff % 1000) / 10);
  const sec = Math.floor((diff / 1000) % 60);
  const min = Math.floor((diff / (1000 * 60)) % 60);
  const hr = Math.floor(diff / (1000 * 60 * 60));
  timerEl.textContent = `${hr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
}

document.getElementById("sw-start")?.addEventListener("click", () => {
  if (!swRunning) {
    swStartTime = Date.now();
    swInterval = setInterval(updateStopwatch, 10);
    swRunning = true;
  }
});
document.getElementById("sw-stop")?.addEventListener("click", () => {
  if (swRunning) {
    clearInterval(swInterval);
    swElapsed += Date.now() - swStartTime;
    swRunning = false;
  }
});
document.getElementById("sw-reset")?.addEventListener("click", () => {
  clearInterval(swInterval);
  swRunning = false;
  swElapsed = 0;
  timerEl.textContent = "00:00:00.00";
});

// ======================= //
//  ⏳ Geri Sayım (Başlat - Durdur - Sıfırla)
// ======================= //
let cdInterval, cdRemaining = 0;
const cdDisplay = document.getElementById("countdownDisplay");

document.getElementById("cd-start")?.addEventListener("click", () => {
  const input = parseInt(document.getElementById("countdownInput").value);
  if (!input || input <= 0) return alert("Lütfen geçerli bir süre (saniye) girin.");
  cdRemaining = input;
  cdDisplay.textContent = cdRemaining;
  clearInterval(cdInterval);
  cdInterval = setInterval(() => {
    cdRemaining--;
    cdDisplay.textContent = cdRemaining;
    if (cdRemaining <= 0) {
      clearInterval(cdInterval);
      cdDisplay.textContent = "00";
      showNotification("⏳ Süre Doldu!", "Geri sayım tamamlandı.");
      playBeep();
    }
  }, 1000);
});
document.getElementById("cd-stop")?.addEventListener("click", () => clearInterval(cdInterval));
document.getElementById("cd-reset")?.addEventListener("click", () => {
  clearInterval(cdInterval);
  cdRemaining = 0;
  cdDisplay.textContent = "00";
});

// ======================= //
//  ⏰ Alarm
// ======================= //
let alarmTime = null, alarmTimeout;
document.getElementById("alarm-set")?.addEventListener("click", () => {
  const time = document.getElementById("alarmTime").value;
  if (!time) return alert("Lütfen saat seçin ⏰");
  alarmTime = time;
  document.getElementById("alarmStatus").textContent = `Alarm kuruldu: ${alarmTime}`;
  checkAlarm();
});
document.getElementById("alarm-clear")?.addEventListener("click", () => {
  alarmTime = null;
  clearTimeout(alarmTimeout);
  document.getElementById("alarmStatus").textContent = "Alarm kapatıldı";
});

function checkAlarm() {
  if (!alarmTime) return;
  const [h, m] = alarmTime.split(":").map(Number);
  const now = new Date();
  if (now.getHours() === h && now.getMinutes() === m && now.getSeconds() === 0) {
    showNotification("⏰ Alarm!", "Belirlediğin saate ulaşıldı.");
    playBeep();
    alarmTime = null;
  }
  alarmTimeout = setTimeout(checkAlarm, 1000);
}

// ======================= //
//  🗒 Not Defteri
// ======================= //
const noteInput = document.getElementById("noteInput");
const noteSaved = document.getElementById("noteSaved");

document.getElementById("saveNote")?.addEventListener("click", () => {
  const val = noteInput.value.trim();
  localStorage.setItem("zamanmerkezi_note", val);
  noteSaved.textContent = "✅ Not kaydedildi!";
});
document.getElementById("clearNote")?.addEventListener("click", () => {
  localStorage.removeItem("zamanmerkezi_note");
  noteInput.value = "";
  noteSaved.textContent = "🗑 Not silindi!";
});
window.addEventListener("load", () => {
  const saved = localStorage.getItem("zamanmerkezi_note");
  if (saved) noteInput.value = saved;
});

// ======================= //
//  📅 Takvim (mini)
// ======================= //
const cal = document.getElementById("miniCalendar");
function renderCalendar() {
  if (!cal) return;
  const now = new Date();
  const month = now.toLocaleString("tr-TR", { month: "long" });
  const year = now.getFullYear();
  const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
  let html = `<h5>${month} ${year}</h5><div class="days">`;
  for (let d = 1; d <= daysInMonth; d++) html += `<span>${d}</span>`;
  html += "</div>";
  cal.innerHTML = html;
}
renderCalendar();

// ======================= //
//  🔔 Bildirim & Ses
// ======================= //
function showNotification(title, body) {
  if ('Notification' in window && navigator.serviceWorker) {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification(title, {
            body,
            icon: "icon-192.png",
            badge: "icon-192.png",
            vibrate: [200, 100, 200],
          });
        });
      }
    });
  }
}

function playBeep() {
  const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
  audio.play();
}

// ======================= //
//  🌙 Tema & Yıl
// ======================= //
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("themeSelect")?.addEventListener("change", e => {
  document.body.setAttribute("data-theme", e.target.value);
});
