function updateClock() {
  document.getElementById("time").textContent =
    new Date().toLocaleTimeString("tr-TR");
}
setInterval(updateClock, 1000);
updateClock();

let chronoStartTime = 0, chronoInterval, chronoRunning = false;
const display = document.getElementById("chrono-display");

startChrono.onclick = () => {
  if (!chronoRunning) {
    chronoStartTime = Date.now() - (chronoStartTime || 0);
    chronoInterval = setInterval(() => {
      const e = Date.now() - chronoStartTime;
      const ms = String(e % 1000).padStart(3, "0");
      const s = String(Math.floor(e / 1000) % 60).padStart(2, "0");
      const m = String(Math.floor(e / 60000) % 60).padStart(2, "0");
      const h = String(Math.floor(e / 3600000)).padStart(2, "0");
      display.textContent = `${h}:${m}:${s}.${ms}`;
    }, 10);
    chronoRunning = true;
  }
};
stopChrono.onclick = () => { clearInterval(chronoInterval); chronoRunning = false; };
resetChrono.onclick = () => { clearInterval(chronoInterval); chronoRunning = false; chronoStartTime = 0; display.textContent = "00:00:00.000"; };

let countdownInterval, remaining = 0;
const countDisplay = document.getElementById("countDisplay");

startCount.onclick = () => {
  const mins = +countMinutes.value || 0;
  const secs = +countSeconds.value || 0;
  remaining = mins * 60 + secs;

  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    const m = String(Math.floor(remaining / 60)).padStart(2, "0");
    const s = String(remaining % 60).padStart(2, "0");
    countDisplay.textContent = `${m}:${s}`;
    if (remaining-- <= 0) {
      clearInterval(countdownInterval);
      countDisplay.textContent = "00:00";
    }
  }, 1000);
};

stopCount.onclick = () => clearInterval(countdownInterval);
resetCount.onclick = () => { clearInterval(countdownInterval); countDisplay.textContent = "00:00"; };

const noteArea = document.getElementById("noteArea");
noteArea.value = localStorage.getItem("note") || "";
saveNote.onclick = () => {
  localStorage.setItem("note", noteArea.value);
  alert("Not kaydedildi! ✔");
};
