const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const multiplierText = document.getElementById("multiplier");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.6;
}
resize();
window.addEventListener("resize", resize);

let startTime;
let multiplier = 1.0;
let crashed = false;

// crash point (hidden)
const crashPoint = (Math.random() * 8 + 1.5).toFixed(2);

function drawPlane(x, y) {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 30, y + 15);
  ctx.lineTo(x - 30, y - 15);
  ctx.closePath();
  ctx.fill();
}

function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = (timestamp - startTime) / 1000;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!crashed) {
    multiplier = Math.exp(elapsed / 6);
    multiplierText.textContent = multiplier.toFixed(2) + "x";

    const x = 100 + elapsed * 90;
    const y = canvas.height - elapsed * 60;

    // curve
    ctx.strokeStyle = "rgba(255,0,0,0.4)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.quadraticCurveTo(
      canvas.width / 3,
      canvas.height - y / 2,
      x,
      y
    );
    ctx.stroke();

    drawPlane(x, y);

    if (multiplier >= crashPoint) {
      crashed = true;
      setTimeout(resetGame, 1500);
    }
  }

  requestAnimationFrame(animate);
}

function resetGame() {
  startTime = null;
  multiplier = 1.0;
  crashed = false;
}

requestAnimationFrame(animate);
