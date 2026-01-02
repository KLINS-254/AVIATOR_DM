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
let multiplier = 1.0;

let crashPoint = generateCrash();

function generateCrash() {
  return Math.random() * 8 + 1.5;
}

/* ✈️ DRAW RED PLANE */
function drawPlane(x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-Math.PI / 7);

  ctx.fillStyle = "#ff2d2d";
  ctx.beginPath();

  // Nose
  ctx.moveTo(18, 0);

  // Top wing
  ctx.lineTo(-6, -4);
  ctx.lineTo(-10, -10);

  // Tail
  ctx.lineTo(-12, -4);
  ctx.lineTo(-18, 0);
  ctx.lineTo(-12, 4);

  // Bottom wing
  ctx.lineTo(-10, 10);
  ctx.lineTo(-6, 4);

  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/* CURVED TRAIL */
function drawCurve(x, y) {
  ctx.strokeStyle = "rgba(255,45,45,0.6)";
  ctx.lineWidth = 4;
  ctx.shadowColor = "#ff2d2d";
  ctx.shadowBlur = 12;

  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.quadraticCurveTo(
    canvas.width * 0.35,
    canvas.height - y * 0.35,
    x,
    y
  );
  ctx.stroke();
  ctx.shadowBlur = 0;
}

/* CRASH FLASH */
function crashFlash() {
  ctx.fillStyle = "rgba(255,45,45,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function resetGame() {
  startTime = null;
  multiplier = 1.0;
  crashed = false;
  crashPoint = generateCrash();
}

function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const t = (timestamp - startTime) / 1000;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!crashed) {
    multiplier = Math.exp(t / 6);
    multiplierText.textContent = multiplier.toFixed(2) + "x";

    const x = 90 + t * 100;
    const y = canvas.height - t * 70;

    drawCurve(x, y);
    drawPlane(x, y);

    if (multiplier >= crashPoint) {
      crashed = true;
      crashFlash();
      setTimeout(resetGame, 1500);
    }
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
