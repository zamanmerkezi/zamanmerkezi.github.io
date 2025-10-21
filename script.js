// ============================
// 🕒 SAAT ve TARİH
// ============================
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString("tr-TR");
  document.getElementById("date").textContent = now.toLocaleDateString("tr-TR", {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}
setInterval(updateClock, 1000);
updateClock();

// ============================
// 🌍 DÜNYA SAATLERİ
// ============================
const cities = [
  { name: "İstanbul", tz: "Europe/Istanbul" },
  { name: "Londra", tz: "Europe/London" },
  { name: "Tokyo", tz: "Asia/Tokyo" },
  { name: "New York", tz: "America/New_York" },
  { name: "Sydney", tz: "Australia/Sydney" }
];

function updateWorldTimes() {
  const container = document.getElementById("worldTimes");
  container.innerHTML = "";
  cities.forEach(city => {
    const now = new Date().toLocaleTimeString("tr-TR", { timeZone: city.tz });
    const div = document.createElement("div");
    div.textContent = `${city.name}: ${now}`;
    container.appendChild(div);
  });
}
setInterval(updateWorldTimes, 1000);
updateWorldTimes();

// ============================
// ⏱ KRONOMETRE
// ============================
let timer, seconds = 0;
function start() {
  if (!timer) {
    timer = setInterval(() => {
      seconds++;
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      document.getElementById("timer").textContent =
        `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }, 1000);
  }
}
function stop() { clearInterval(timer); timer = null; }
function reset() { stop(); seconds = 0; document.getElementById("timer").textContent = "00:00"; }

// ============================
// ⏳ GERİ SAYIM
// ============================
let countdown;
function startCountdown() {
  clearInterval(countdown);
  let timeLeft = parseInt(document.getElementById("countdownInput").value);
  const display = document.getElementById("countdownDisplay");
  if (isNaN(timeLeft) || timeLeft <= 0) return alert("Geçerli bir süre gir!");

  countdown = setInterval(() => {
    display.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      display.textContent = "Bitti!";
      showNotification("Geri Sayım Tamamlandı ⏳");
    }
    timeLeft--;
  }, 1000);
}

// ============================
// 🔔 ALARM
// ============================
let alarmTime = null;
function setAlarm() {
  alarmTime = document.getElementById("alarmTime").value;
  document.getElementById("alarmStatus").textContent = `Alarm kuruldu: ${alarmTime}`;
}

setInterval(() => {
  if (alarmTime) {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    if (currentTime === alarmTime) {
      showNotification("🔔 Alarm Çalıyor!");
      alert("🔔 Alarm Çalıyor!");
      alarmTime = null;
      document.getElementById("alarmStatus").textContent = "Alarm tamamlandı.";
    }
  }
}, 1000);

// ============================
// 🎨 TEMA DEĞİŞTİRME
// ============================
function setTheme(theme) {
  document.body.className = theme;
  localStorage.setItem("theme", theme);
}
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) document.body.className = savedTheme;
});

// ============================
// 🔔 TARAYICI BİLDİRİMLERİ
// ============================
function showNotification(message) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification("ZAMAN MERKEZİ", { body: message, icon: "icons/icon-192.png" });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("ZAMAN MERKEZİ", { body: message, icon: "icons/icon-192.png" });
      }
    });
  }
}
