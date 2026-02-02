const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const hint = document.getElementById("hint");
const final = document.getElementById("final");
const finalText = document.getElementById("final-text");
const choices = document.getElementById("choices");
const celebrate = document.getElementById("celebrate");
const celebrateText = document.getElementById("celebrate-text");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// -------- HEART SYSTEM --------
const hearts = [];
const heartImg = new Image();
heartImg.src = "heart.png";

class Heart {
  constructor(x, y, special = false) {
    this.x = x;
    this.y = y;
    this.size = special ? 64 : Math.random() * 24 + 16;
    this.vx = 0;
    this.vy = special ? -0.7 : -(Math.random() * 0.6 + 0.3);
    this.special = special;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < -150) this.y = h + 150;
  }

  draw() {
    ctx.drawImage(heartImg, this.x, this.y, this.size, this.size);

    if (this.special) {
      ctx.fillStyle = "white";
      ctx.font = "bold 14px Segoe UI";
      ctx.textAlign = "center";
      ctx.fillText("Israel", this.x + this.size / 2, this.y + this.size + 18);
    }
  }

  hit(px, py) {
    return (
      px >= this.x &&
      px <= this.x + this.size &&
      py >= this.y &&
      py <= this.y + this.size
    );
  }
}

// Background hearts
for (let i = 0; i < 120; i++) {
  hearts.push(new Heart(Math.random() * w, Math.random() * h));
}

// Special heart
const specialHeart = new Heart(w / 2 - 32, h + 200, true);
hearts.push(specialHeart);

let running = true;

// -------- LOOP --------
function animate() {
  if (!running) return;
  ctx.clearRect(0, 0, w, h);
  hearts.forEach(h => {
    h.update();
    h.draw();
  });
  requestAnimationFrame(animate);
}
animate();

// -------- INPUT --------
canvas.addEventListener("pointerdown", e => {
  const r = canvas.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;

  if (specialHeart.hit(x, y)) {
    triggerFinale();
  }
});

// -------- FINALE --------
function triggerFinale() {
  running = false;
  hint.style.display = "none";

  final.classList.remove("hidden");
  final.style.pointerEvents = "auto";

  typeText("Rita Israel… will you be my Valentine? 💖", () => {
    choices.classList.remove("hidden");
  });

  navigator.vibrate?.(300);
}

function typeText(text, cb) {
  let i = 0;
  finalText.textContent = "";
  const t = setInterval(() => {
    finalText.textContent += text[i++];
    if (i >= text.length) {
      clearInterval(t);
      cb && cb();
    }
  }, 50);
}

// -------- YES / ABS YES --------
function acceptValentine(type) {
  explodeHearts();
  final.classList.add("hidden");

  celebrate.classList.remove("hidden");
  celebrateText.textContent =
    type === "absolutely"
      ? "I KNEW IT 😏💖 You’re officially mine!"
      : "You just made me the happiest person ❤️";

  navigator.vibrate?.([100, 50, 100, 50, 200]);
}

// -------- EXPLOSION --------
function explodeHearts() {
  hearts.forEach(h => {
    h.vx = (Math.random() - 0.5) * 30;
    h.vy = (Math.random() - 0.5) * 30;
  });
}
