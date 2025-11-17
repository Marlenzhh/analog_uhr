// DOM-Elemente (mit Fehlerbehandlung)
const hourHand = document.querySelector('.hour-hand');
const minHand = document.querySelector('.min-hand');
const secondHand = document.querySelector('.second-hand');
const clockFace = document.querySelector('.outer-clock-face') || document.querySelector('.clock');

// Überprüfe, ob alle notwendigen Elemente vorhanden sind
if (!hourHand || !minHand || !secondHand || !clockFace) {
  console.error('Analog Clock: erforderliche DOM-Elemente nicht gefunden.');
}

let ticksCreated = false; // Flag um sicherzustellen, dass Ticks nur einmalig erstellt werden

/**
 * Erstellt 12 Markierungen (Ticks) am Rand des Ziffernblatts
 */
function createTicksAtRim() {
  if (!clockFace || ticksCreated) return;

  const rect = clockFace.getBoundingClientRect();
  const radius = Math.min(rect.width, rect.height) / 2;
  const padding = 5; // Abstand vom äusseren Rand
  const outward = Math.max(0, radius - padding);

  for (let i = 0; i < 12; i++) {
    const tick = document.createElement('div');
    tick.className = 'tick' + (i % 3 === 0 ? ' long' : '');
    const angle = i * 30;
    tick.style.transform = `rotate(${angle}deg) translateY(-${outward}px)`;
    clockFace.appendChild(tick);
  }

  ticksCreated = true;
}

/**
 * Aktualisiert die Position der Zeiger basierend auf der aktuellen Systemzeit
 */
function updateClock() {
  const now = new Date();

  // Sekunden
  const seconds = now.getSeconds() 
  const secondsDeg = (seconds / 60) * 360;
  if (secondHand) secondHand.style.transform = `rotate(${secondsDeg}deg)`;

  // Minuten (mit Sekunden-Glätte)
  const minutes = now.getMinutes() + seconds / 60;
  const minutesDeg = (minutes / 60) * 360;
  if (minHand) minHand.style.transform = `rotate(${minutesDeg}deg)`;

  // Stunden (mit Minuten-Glätte)
  const hours = now.getHours() % 12 + minutes / 60;
  const hoursDeg = (hours / 12) * 360;
  if (hourHand) hourHand.style.transform = `rotate(${hoursDeg}deg)`;
}

/**
 * Initialisiert die Uhr und startet das Update
 */
function initClock() {
  createTicksAtRim();
  updateClock();

  // Verwende requestAnimationFrame für glatte Animation
  let animationId = null;
  
  function animationLoop() {
    updateClock();
    animationId = requestAnimationFrame(animationLoop);
  }

  // Starte Animation
  animationId = requestAnimationFrame(animationLoop);

  // Pause bei verstecktem Tab um CPU zu sparen
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animationId = requestAnimationFrame(animationLoop);
    }
  });
}

// Starte die Uhr wenn das DOM bereit ist
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initClock);
} else {
  initClock();
}

