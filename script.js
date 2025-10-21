// Saat
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString("tr-TR");
  document.getElementById("date").textContent = now.toLocaleDateString("tr-TR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
}
setInterval(updateClock, 1000);
updateClock();

// Dünya Saatleri
const cities = { "İstanbul": 3, "Londra": 0, "New York": -4, "Tokyo": 9 };
function updateWorldTimes() {
  const container = document.getElementById("worldTimes");
  container.innerHTML = "";
  const now = new Date();
  for (const [city, offset] of Object.entries(cities)) {
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const local = new Date(utc + 3600000 * offset);
    const div = document.createElement("div");
    div.textContent = `${city}: ${local.toLocaleTimeString("tr-TR")}`;
    container.appendChild(div);
  }
}
setInterval(updateWorldTimes, 1000);
updateWorldTimes();

// Kronometre
let timerInterval, seconds = 0, running = false;
function start() {
  if (!running) {
    running = true;
    timerInterval = setInterval(() => {
      seconds++;
      const min = String(Math.floor(seconds / 60)).padStart(2, "0");
      const sec = String(seconds % 60).padStart(2, "0");
      document.getElementById("timer").textContent = `${min}:${sec}`;
    }, 1000);
  }
}
function stop() { running = false; clearInterval(timerInterval); }
function reset() {
  running = false;
  clearInterval(timerInterval);
  seconds = 0;
  document.getElementById("timer").textContent = "00:00";
}

// Geri Sayım
let countdownInterval;
function startCountdown() {
  let time = parseInt(document.getElementById("countdownInput").value);
  const display = document.getElementById("countdownDisplay");
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    display.textContent = time;
    if (time <= 0) { clearInterval(countdownInterval); alert("⏰ Süre doldu!"); }
    time--;
  }, 1000);
}

// Alarm
let alarmTime = null;
function setAlarm() {
  const input = document.getElementById("alarmTime").value;
  if (!input) return alert("Lütfen bir saat seçin!");
  alarmTime = input;
  document.getElementById("alarmStatus").textContent = `Alarm kuruldu: ${input}`;
}
setInterval(() => {
  const now = new Date();
  const current = now.toTimeString().slice(0, 5);
  if (alarmTime === current) {
    alert("🔔 Alarm çalıyor!");
    alarmTime = null;
  }
}, 1000);

// Tema
function setTheme(theme) {
  document.body.className = theme;
  localStorage.setItem("theme", theme);
}
(function loadTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) document.body.className = saved;
})();
