// 🕒 ZAMAN MERKEZİ — Tam İşlevli Script

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
//  ⏱ Kronometre
// ======================= //
let swStartTime, swInterval, swElapsed = 0, running = false;
const timerEl = document.getElementById("timer");

function updateStopwatch() {
  const diff = Date.now() - swStartTime + swElapsed;
  const ms = Math.floor((diff % 1000) / 10);
  const sec = Math.floor((diff / 1000) % 60);
  const min = Math.floor((diff / (1000 * 60)) % 60);
  const hr = Math.floor(diff / (1000 * 60 * 60));
  timerEl.textContent = `${hr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
}

document.getElementById("sw-start").onclick = () => {
  if (!running) {
    swStartTime = Date.now();
    swInterval = setInterval(updateStopwatch, 10);
    running = true;
  }
};

document.getElementById("sw-stop").onclick = () => {
  if (running) {
    clearInterval(swInterval);
    swElapsed += Date.now() - swStartTime;
    running = false;
  }
};

document.getElementById("sw-reset").onclick = () => {
  clearInterval(swInterval);
  running = false;
  swElapsed = 0;
  timerEl.textContent = "00:00:00.00";
};

// ======================= //
//  ⏳ Geri Sayım
// ======================= //
let cdInterval, cdRemaining = 0;
const cdDisplay = document.getElementById("countdownDisplay");

document.getElementById("cd-start").onclick = () => {
  const input = document.getElementById("countdownInput").value;
  if (!input || input <= 0) return alert("Lütfen geçerli bir süre girin (saniye)");
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
};

document.getElementById("cd-stop").onclick = () => clearInterval(cdInterval);
document.getElementById("sw-reset")?.addEventListener("click", () => {
  cdDisplay.textContent = "00";
  clearInterval(cdInterval);
});

// ======================= //
//  🔔 Alarm
// ======================= //
let alarmTime = null, alarmTimeout;

document.getElementById("alarm-set").onclick = () => {
  const time = document.getElementById("alarmTime").value;
  if (!time) return alert("Lütfen saat seçin ⏰");
  alarmTime = time;
  document.getElementById("alarmStatus").textContent = `Alarm kuruldu: ${alarmTime}`;
  checkAlarm();
};

document.getElementById("alarm-clear").onclick = () => {
  alarmTime = null;
  clearTimeout(alarmTimeout);
  document.getElementById("alarmStatus").textContent = "Alarm kapatıldı";
};

function checkAlarm() {
  if (!alarmTime) return;
  const [h, m] = alarmTime.split(":").map(Number);
  const now = new Date();
  if (now.getHours() === h && now.getMinutes() === m) {
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

document.getElementById("saveNote").onclick = () => {
  const val = noteInput.value.trim();
  localStorage.setItem("zamanmerkezi_note", val);
  noteSaved.textContent = "✅ Not kaydedildi!";
};

document.getElementById("clearNote").onclick = () => {
  localStorage.removeItem("zamanmerkezi_note");
  noteInput.value = "";
  noteSaved.textContent = "🗑 Not silindi!";
};

window.addEventListener("load", () => {
  const saved = localStorage.getItem("zamanmerkezi_note");
  if (saved) noteInput.value = saved;
});

// ======================= //
//  📅 Takvim (mini)
// ======================= //
const cal = document.getElementById("miniCalendar");
function renderCalendar() {
  const now = new Date();
  const month = now.toLocaleString("tr-TR", { month: "long" });
  const year = now.getFullYear();
  let html = `<h5>${month} ${year}</h5><div class="days">`;
  for (let d = 1; d <= 30; d++) html += `<span>${d}</span>`;
  html += "</div>";
  cal.innerHTML = html;
}
renderCalendar();

// ======================= //
//  🔔 Bildirim & Ses
// ======================= //
function showNotification(title, body) {
  if (Notification.permission === "granted") {
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg) reg.showNotification(title, { body, icon: "icon-192.png" });
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((perm) => {
      if (perm === "granted") showNotification(title, body);
    });
  }
}

function playBeep() {
  const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
  audio.play();
}

// ======================= //
//  🔄 Tema & yıl
// ======================= //
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("themeSelect")?.addEventListener("change", (e) => {
  document.body.setAttribute("data-theme", e.target.value);
});
