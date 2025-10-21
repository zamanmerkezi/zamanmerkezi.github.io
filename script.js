/* 🕒 ZAMAN MERKEZİ v2.0 - Ana JavaScript */

// =============== SAAT & TARİH ===============
function updateClock() {
  const now = new Date();
  document.getElementById("digitalClock").textContent = now.toLocaleTimeString("tr-TR");
  document.getElementById("digitalDate").textContent = now.toLocaleDateString("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
setInterval(updateClock, 1000);
updateClock();

// =============== DÜNYA SAATLERİ ===============
const worldCities = {
  "Londra": "Europe/London",
  "New York": "America/New_York",
  "Tokyo": "Asia/Tokyo",
  "Sydney": "Australia/Sydney",
  "İstanbul": "Europe/Istanbul"
};
function updateWorldTimes() {
  const container = document.getElementById("worldTimes");
  container.innerHTML = "";
  for (let city in worldCities) {
    const time = new Date().toLocaleTimeString("tr-TR", { timeZone: worldCities[city] });
    const div = document.createElement("div");
    div.textContent = `${city}: ${time}`;
    container.appendChild(div);
  }
}
setInterval(updateWorldTimes, 1000);
updateWorldTimes();

// =============== KRONOMETRE ===============
let timerInterval;
let timerSeconds = 0;

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function start() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      timerSeconds++;
      document.getElementById("timer").textContent = formatTime(timerSeconds);
    }, 1000);
  }
}
function stop() {
  clearInterval(timerInterval);
  timerInterval = null;
}
function reset() {
  stop();
  timerSeconds = 0;
  document.getElementById("timer").textContent = "00:00";
}

// =============== GERİ SAYIM ===============
let countdownInterval;
function startCountdown() {
  let duration = parseInt(document.getElementById("countdownInput").value);
  const display = document.getElementById("countdownDisplay");

  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    if (duration > 0) {
      duration--;
      display.textContent = duration + " sn";
    } else {
      clearInterval(countdownInterval);
      display.textContent = "⏰ Süre Doldu!";
      playAlarmSound();
    }
  }, 1000);
}

// =============== ALARM ===============
let alarmTime = null;
function setAlarm() {
  const time = document.getElementById("alarmTime").value;
  if (time) {
    alarmTime = time;
    document.getElementById("alarmStatus").textContent = "🔔 Alarm kuruldu: " + time;
  }
}
setInterval(() => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  if (alarmTime === currentTime) {
    playAlarmSound();
    alert("🔔 Alarm çalıyor!");
    alarmTime = null;
  }
}, 1000);

function playAlarmSound() {
  const sound = new Audio("https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg");
  sound.play();
}

// =============== NOT DEFTERİ ===============
const noteArea = document.getElementById("notes");
noteArea.value = localStorage.getItem("zamanNotlar") || "";
noteArea.addEventListener("input", () => {
  localStorage.setItem("zamanNotlar", noteArea.value);
});

// =============== TAKVİM ===============
function loadCalendar() {
  const now = new Date();
  const monthDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const today = now.getDate();
  const cal = document.getElementById("miniCalendar");
  cal.innerHTML = "";
  for (let d = 1; d <= monthDays; d++) {
    const div = document.createElement("div");
    div.textContent = d;
    if (d === today) div.classList.add("today");
    cal.appendChild(div);
  }
}
loadCalendar();

// =============== HAVA DURUMU (Open-Meteo API) ===============
async function getWeather() {
  try {
    const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=41.0082&longitude=28.9784&current_weather=true");
    const data = await res.json();
    const w = data.current_weather;
    document.getElementById("weather").textContent =
      `🌡 ${w.temperature}°C, 💨 ${w.windspeed} km/s`;
  } catch {
    document.getElementById("weather").textContent = "⚠️ Hava bilgisi alınamadı.";
  }
}
getWeather();
setInterval(getWeather, 600000); // 10 dakikada bir

// =============== TEMA SİSTEMİ ===============
function setTheme(name) {
  document.body.className = "";
  document.body.classList.add("theme-" + name);
  localStorage.setItem("theme", name);
}
const savedTheme = localStorage.getItem("theme");
if (savedTheme) setTheme(savedTheme);

// =============== OTOMATİK GECE/GÜNDÜZ MODU ===============
(function autoTheme() {
  const hour = new Date().getHours();
  if (!savedTheme) {
    if (hour >= 7 && hour < 20) setTheme("gradient");
    else setTheme("dark");
  }
})();

// =============== SERVICE WORKER ===============
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("✅ Service Worker aktif"))
    .catch(e => console.log("❌ SW hatası:", e));
}
