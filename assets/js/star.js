const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");
const audio = document.getElementById('bgMusic');
const startScreen = document.getElementById('startScreen');
let w, h;

function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
const wrapper = document.getElementById('rotateWrapper');
if (isMobile()) {
    wrapper.classList.add('rotate');
}


function resize() {
    const isRotated = wrapper.classList.contains('rotate');
    const cssW = isRotated ? window.innerHeight : window.innerWidth;
    const cssH = isRotated ? window.innerWidth : window.innerHeight;

    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';

    canvas.width = cssW * devicePixelRatio;
    canvas.height = cssH * devicePixelRatio;

    w = cssW;
    h = cssH;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}


window.addEventListener("resize", resize);
resize();

var size = 1.5;
if (isMobile()) {
    size = 1;
}

// Sao nền
const stars = [];
for (let i = 0; i < 200; i++) {
    stars.push({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * size,
    alpha: Math.random(),
    speed: Math.random() * 0.01 + 0.002
    });
}

// Sao lấp lánh vài màu đại đại
const colorSets = [
    { core: "rgba(180, 80, 255, 1)", glow: "rgba(255, 230, 255, 0.8)" },
    { core: "rgba(80, 255, 120, 1)", glow: "rgba(230, 255, 230, 0.8)" },
    { core: "rgba(100, 180, 255, 1)", glow: "rgba(230, 245, 255, 0.8)" },
    { core: "rgba(255, 255, 255, 1)", glow: "rgba(255, 255, 255, 0.9)" }
];

class TwinkleStar {
    constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;

    var sizeStar = 2;
    if (isMobile()) {
        sizeStar = 1;
    }

    this.size = Math.random() * sizeStar + 1;
    this.phase = Math.random() * Math.PI * 2;
    this.colors = colorSets[Math.floor(Math.random() * colorSets.length)];
    }
    draw(time) {
    const opacity = 0.5 + 0.5 * Math.sin(time * 2 + this.phase);
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(this.x, this.y);

    // Chấm sáng trung tâm
    ctx.fillStyle = this.colors.core;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Tia ngang
    ctx.strokeStyle = this.colors.glow;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-this.size * 3, 0);
    ctx.lineTo(this.size * 3, 0);
    ctx.stroke();

    // Tia dọc
    ctx.beginPath();
    ctx.moveTo(0, -this.size * 3);
    ctx.lineTo(0, this.size * 3);
    ctx.stroke();

    ctx.restore();
    }
}

const flickerColors = [
    "rgba(180, 80, 255, 1)",
    "rgba(80, 255, 120, 1)",
    "rgba(100, 180, 255, 1)",
    "rgba(255, 255, 255, 1)"
];

class FlickerStar {
    constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 1.5 + 1;
    this.phase = Math.random() * Math.PI * 2;
    this.color = flickerColors[Math.floor(Math.random() * flickerColors.length)];
    }
    draw(time) {
    const opacity = 0.5 + 0.5 * Math.sin(time * 2 + this.phase);
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
    }
}


var quantity = 25;
if (isMobile()) {
    quantity = 10;
}

const twinkleStars = Array.from({ length: quantity }, () => new TwinkleStar());
const flickerStars = Array.from({ length: quantity - 15 }, () => new FlickerStar());


// Sao băng
class ShootingStar {
    constructor() {
    this.reset();
    }
    reset() {
    this.angle = Math.random() * Math.PI;
    this.radius = Math.random() * (h / 4) + h / 6;
    this.speed = Math.random() * 0.002 + 0.003;
    this.size = Math.random() * 2 + 1;
    this.theta = 0;
    this.trail = [];
    }
    update() {
    this.theta -= this.speed;
    const x = w / 2 + Math.cos(this.angle + this.theta) * this.radius;
    const y = 0 + Math.sin(this.angle + this.theta) * this.radius;
    this.trail.push({ x, y });
    if (this.trail.length > 250) this.trail.shift();
    if (this.theta > Math.PI) this.reset();
    }
    draw() {
    const x = w / 2 + Math.cos(this.angle + this.theta) * this.radius;
    const y = 0 + Math.sin(this.angle + this.theta) * this.radius * 0.1;

    // Vệt sao băng
    for (let i = 0; i < this.trail.length; i++) {
        const p = this.trail[i];
        const alpha = i / this.trail.length;

        const grad = ctx.createLinearGradient(
        this.trail[0].x, this.trail[0].y,
        p.x, p.y
        );
        grad.addColorStop(0, `rgba(80, 160, 255, 0)`);
        grad.addColorStop(0.5, `rgba(255, 255, 255, ${alpha})`);
        grad.addColorStop(1, `rgba(90, 150, 255, ${alpha})`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, this.size * 0.3 * (i / this.trail.length), 0, Math.PI * 2);
        ctx.fill();
    }

    // Đầu sao sáng
    const grad = ctx.createRadialGradient(x, y, 0, x, y, 80);
    grad.addColorStop(0, "rgba(100, 150, 255, 0.8)");
    grad.addColorStop(1, "rgba(100, 150, 255, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, this.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    }
}


const shootingStars = Array.from({ length: 25 }, () => new ShootingStar());

const bgImage = new Image();
bgImage.src = "assets/images/BGR.png";
let bgTime = 0;
const bgScaleSpeed = 0.0005;
const bgScaleMin = 1;
const bgScaleMax = 1.1;

// Hàm vẽ chính
function animate(time) {

    bgTime += 16;

    const bgScale = bgScaleMin + (bgScaleMax - bgScaleMin) * (0.5 + 0.5 * Math.sin(bgTime * bgScaleSpeed));

    const bgW = w * bgScale;
    const bgH = h * bgScale;
    const bgX = (w - bgW) / 2;
    const bgY = (h - bgH) / 2;

    ctx.drawImage(bgImage, bgX, bgY, bgW, bgH);

    ctx.fillStyle = "rgba(0,0,20,0.3)";
    ctx.fillRect(0, 0, w, h);

    // Sao nền
    for (let s of stars) {
    s.alpha += s.speed;
    ctx.fillStyle = `rgba(100, 150, 255, ${0.5 + Math.sin(s.alpha) * 0.5})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    }

    // Sao nhiều màu
    for (let t of twinkleStars) {
    t.draw(time * 0.001);
    }

    for (let f of flickerStars) {
    f.draw(time * 0.001);
    }


    // Sao băng
    for (let ss of shootingStars) {
    ss.update();
    ss.draw();
    }

    requestAnimationFrame(animate);
}

startScreen.addEventListener('click', () => {
    audio.play().catch(err => {
    console.log("Audio play blocked:", err);
    });

    startScreen.classList.add('hidden');

    requestAnimationFrame(animate);
});


const changeBtn = document.getElementById("changeSoundBtn");
const audio1 = document.getElementById("bgMusic");
const source = document.getElementById("bgSource");

changeBtn.addEventListener("click", () => {
  source.src = "assets/audio/(8) HOÀNG DŨNG - GIỮ ANH CHO NGÀY HÔM QUA (feat. RHYMASTIC) - OFFICIAL MUSIC VIDEO - YouTube.mp3";
  audio1.load();
  audio1.play().catch(err => console.log("Audio play blocked:", err));
});
