const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const multiplierText = document.getElementById("multiplier");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.6;
}
resize();
window.addEventListener("resize", resize);

let startTime = null;
let crashed = false;
let multiplier = 1;
let smoke = [];

let crashPoint = generateCrash();

function generateCrash() {
  return Math.random() * 8 + 1.5;
}

/* ✈️ PLANE */
function drawPlane(x, y, tilt) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);

  ctx.fillStyle = "#ff2d2d";
  ctx.beginPath();
  ctx.moveTo(20, 0);        // nose
  ctx.lineTo(-4, -5);      // wing top
  ctx.lineTo(-12, -14);
  ctx.lineTo(-15, -5);
  ctx.lineTo(-22, 0);      // tail
  ctx.lineTo(-15, 5);
  ctx.lineTo(-12, 14);
  ctx.lineTo(-4, 5);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/* 💨 SMOKE */
function addSmoke(x, y) {
  smoke.push({
    x: x - 18,
    y: y,
    alpha: 0.6,
    size: 4
  });
}

function drawSmoke() {
  smoke.forEach(p => {
    ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    p.x -= 1.2;
    p.y += (Math.random() - 0.5);
    p.alpha -= 0.025;
  });

  smoke = smoke.filter(p => p.alpha > 0);
}

/* ➰ CURVE */
function drawCurve(x, y) {
  ctx.strokeStyle = "rgba(255,45,45,0.6)";
  ctx.lineWidth = 4;
  ctx.shadowColor = "#ff2d2d";
  ctx.shadowBlur = 10;

  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.quadraticCurveTo(
    canvas.width * 0.35,
    canvas.height - y * 0.4,
    x,
    y
  );
  ctx.stroke();
  ctx.shadowBlur = 0;
}

/* 💥 CRASH */
function crashFlash() {
  ctx.fillStyle = "rgba(255,45,45,0.35)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/* 🔁 RESET */
function resetGame() {
  startTime = null;
  multiplier = 1;
  crashed = false;
  smoke = [];
  crashPoint = generateCrash();
}

/* 🔄 LOOP */
function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const t = (timestamp - startTime) / 1000;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!crashed) {
    multiplier = Math.exp(t / 6);
    multiplierText.textContent = multiplier.toFixed(2) + "x";

    const x = 90 + t * 100;
    const y = canvas.height - t * 70;
    const tilt = -Math.PI / 7 - t * 0.02;

    drawCurve(x, y);
    addSmoke(x, y);
    drawSmoke();
    drawPlane(x, y, tilt);

    if (multiplier >= crashPoint) {
      crashed = true;
      crashFlash();
      setTimeout(resetGame, 1500);
    }
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
