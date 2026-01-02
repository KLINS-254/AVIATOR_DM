const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const multiplierText = document.getElementById("multiplier");

// Load plane image
const planeImg = new Image();
planeImg.src = "plane.png";  // replace with your plane image path

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

/* 💨 SMOKE PARTICLES */
function addSmoke(x, y) {
  smoke.push({ x: x - 18, y, alpha: 0.6, size: 4 });
}

function drawSmoke() {
  smoke.forEach(p => {
    ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    p.x -= 1;
    p.y += (Math.random() - 0.5);
    p.alpha -= 0.025;
  });
  smoke = smoke.filter(p => p.alpha > 0);
}

/* ➰ CURVE TRAIL */
function drawCurve(x, y) {
  ctx.strokeStyle = "rgba(255,45,45,0.6)";
  ctx.lineWidth = 4;
  ctx.shadowColor = "#ff2d2d";
  ctx.shadowBlur = 10;

  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.quadraticCurveTo(canvas.width * 0.35, canvas.height - y * 0.4, x, y);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

/* 💥 CRASH EFFECT */
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

/* ✈️ DRAW PLANE IMAGE */
function drawPlane(x, y, tilt) {
  const planeWidth = 40;
  const planeHeight = 40;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.drawImage(planeImg, -planeWidth / 2, -planeHeight / 2, planeWidth, planeHeight);
  ctx.restore();
}

/* 🔄 ANIMATION LOOP */
function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const t = (timestamp - startTime) / 1000;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!crashed) {
    multiplier = Math.exp(t / 6);
    multiplierText.textContent = multiplier.toFixed(2) + "x";

    const x = 90 + t * 100;
    const y = canvas.height - t * 70;
    const tilt = -Math.PI / 12; // slight tilt

    drawCurve(x, y);
    addSmoke(x, y);
    drawSmoke();

    if (planeImg.complete) drawPlane(x, y, tilt); // draw image when loaded

    if (multiplier >= crashPoint) {
      crashed = true;
      crashFlash();
      setTimeout(resetGame, 1500);
    }
  }

  requestAnimationFrame(animate);
}

planeImg.onload = () => {
  requestAnimationFrame(animate);
};
