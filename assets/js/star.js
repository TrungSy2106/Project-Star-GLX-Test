const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");
const audio = document.getElementById('bgMusic');
const startScreen = document.getElementById('startScreen');
let w, h;
let isZooming = false;
let zoomProgress = 0;
const zoomDuration = 3500;
let zoomStartTime = null;

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
    { core: "rgba(138, 43, 226, 1)", glow: "rgba(255, 230, 255, 0.8)" },
    { core: "rgba(80, 255, 120, 1)", glow: "rgba(230, 255, 230, 0.8)" },
    { core: "rgba(0, 191, 255, 1)", glow: "rgba(230, 245, 255, 0.8)" },
    { core: "rgba(255, 255, 255, 1)", glow: "rgba(255, 255, 255, 0.9)" },
    { core: "rgba(255, 255, 255, 1)", glow: "rgba(255, 255, 255, 0.9)" },
    { core: "rgba(255, 255, 255, 1)", glow: "rgba(255, 255, 255, 0.9)" },
];

class TwinkleStar {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;

        var sizeStar = 2.5;
        if (isMobile()) {
            sizeStar = 1;
        }

        this.size = Math.random() * sizeStar + 1;
        this.phase = Math.random() * Math.PI * 2;
        this.colors = colorSets[Math.floor(Math.random() * colorSets.length)];
        
        this.pulseSpeed = Math.random() * 0.5 + 0.5;
        this.minScale = 0.3 + Math.random() * 0.3; // 30-60%
        this.maxScale = 0.6 + Math.random() * 0.5; // 60-100%
    }
    
    draw(time) {
        const opacity = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * 2 * this.pulseSpeed + this.phase));
        
        const scaleMultiplier = this.minScale + (this.maxScale - this.minScale) * (0.5 + 0.5 * Math.sin(time * 7 * this.pulseSpeed + this.phase));
        const currentSize = this.size * scaleMultiplier;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(this.x, this.y);

        // Chấm sáng trung tâm
        ctx.fillStyle = this.colors.core;
        ctx.beginPath();
        ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
        ctx.fill();

        // Tia ngang
        ctx.strokeStyle = this.colors.glow;
        ctx.lineWidth = Math.max(0.5, currentSize * 0.3);
        ctx.beginPath();
        ctx.moveTo(-currentSize * 3, 0);
        ctx.lineTo(currentSize * 3, 0);
        ctx.stroke();

        // Tia dọc
        ctx.beginPath();
        ctx.moveTo(0, -currentSize * 3);
        ctx.lineTo(0, currentSize * 3);
        ctx.stroke();

        ctx.restore();
    }
}

const flickerColors = [
    "rgba(210, 130, 255, 1)",
    "rgba(120, 220, 150, 1)",
    "rgba(0, 255, 255, 1)",
    "rgba(255, 255, 255, 1)",
    "rgba(255, 255, 255, 1)",
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


var quantity = 30;
if (isMobile()) {
    quantity = 10;
}

const twinkleStars = Array.from({ length: quantity }, () => new TwinkleStar());
const flickerStars = Array.from({ length: quantity - 10 }, () => new FlickerStar());


// Sao băng
class ShootingStar {
    constructor() {
    this.reset();
    }
    reset() {
    this.angle = Math.random() * Math.PI;
    this.radius = Math.random() * (h / 2.5) + h / 5;
    this.speed = Math.random() * 0.001 + 0.001;
    this.size = Math.random() * 2 + 1.7;
    // this.theta = 0;
    // this.trail = [];
    this.theta = Math.random() * Math.PI * 2;
    this.trail = [];
    this.trailLength = 150; 
    this.debris = [];
    }
    update() {
    this.theta -= this.speed;
    const x = w / 2 + Math.cos(this.angle + this.theta) * this.radius;
    const y = -h / 8 + Math.sin(this.angle + this.theta) * this.radius*0.8;
    this.trail.push({ x, y });
    if (this.trail.length > 280) this.trail.shift();
    if (this.theta > Math.PI) this.reset();
    }
    draw() {
        const headColor      = { r: 240, g: 245, b: 255 };
        const vibrantBodyColor = { r: 150, g: 200, b: 255 };
        const tailColor      = { r: 71, g: 97, b: 230 };

        for (let i = 0; i < this.trail.length; i++) {
            const p = this.trail[i];
            const progress = i / this.trail.length;

            let r, g, b;
            const transitionPoint = 0.95;

            if (progress < transitionPoint) {
                const localProgress = progress / transitionPoint;
                
                const easedProgress = localProgress * localProgress;

                r = tailColor.r + (vibrantBodyColor.r - tailColor.r) * easedProgress;
                g = tailColor.g + (vibrantBodyColor.g - tailColor.g) * easedProgress;
                b = tailColor.b + (vibrantBodyColor.b - tailColor.b) * easedProgress;
            } else {
                const localProgress = (progress - transitionPoint) / (1 - transitionPoint);
                r = vibrantBodyColor.r + (headColor.r - vibrantBodyColor.r) * localProgress;
                g = vibrantBodyColor.g + (headColor.g - vibrantBodyColor.g) * localProgress;
                b = vibrantBodyColor.b + (headColor.b - vibrantBodyColor.b) * localProgress;
            }
            
            const alpha = progress * 0.95;
            const size = this.size * 0.3 * progress;

            ctx.fillStyle = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        const x = w / 2 + Math.cos(this.angle + this.theta) * this.radius;
        const y = 0 + Math.sin(this.angle + this.theta) * this.radius * 0.1;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, 80);
        grad.addColorStop(0, "rgba(100, 150, 255, 0.8)");
        grad.addColorStop(1, "rgba(100, 150, 255, 0)");
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
    }
}


const shootingStars = Array.from({ length: 30 }, () => new ShootingStar());

const bgImage = new Image();
bgImage.src = "assets/images/BGR.png";
let bgTime = 0;
const bgScaleSpeed = 0.00039;
const bgScaleMin = 1;
const bgScaleMax = 1.1;

// Hàm vẽ chính
function animate(time) {

    let currentScale = 1;
    if (isZooming) {
        const elapsed = time - zoomStartTime;
        zoomProgress = Math.min(elapsed / zoomDuration, 1);
        const easedProgress = 1 - Math.pow(1 - zoomProgress, 3);
        currentScale = 0.85 + (0.15 * easedProgress);
        if (zoomProgress >= 1) {
            isZooming = false;
            currentScale = 1;
        }
    }
    
    ctx.save();
    ctx.scale(currentScale, currentScale);
    const offsetX = (w * (1 - currentScale)) / (2 * currentScale);
    const offsetY = (h * (1 - currentScale)) / (2 * currentScale);
    ctx.translate(offsetX, offsetY);

    bgTime += 16;

    const bgScale = bgScaleMin + (bgScaleMax - bgScaleMin) * (0.5 + 0.5 * Math.sin(bgTime * bgScaleSpeed));

    const bgW = w * bgScale;
    const bgH = h * bgScale;
    const bgX = (w - bgW) / 2;
    const bgY = (h - bgH) / 2;

    ctx.drawImage(bgImage, bgX, bgY, bgW, bgH);

    ctx.fillStyle = "rgba(0,0,20,0.3)";
    ctx.fillRect(0, 0, w, h);

    
    // Sao băng
    for (let ss of shootingStars) {
    ss.update();
    ss.draw();
    }

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

    ctx.restore();

    requestAnimationFrame(animate);
}

startScreen.addEventListener('click', () => {
    audio.play().catch(err => {
    console.log("Audio play blocked:", err);
    });

    startScreen.classList.add('hidden');
    isZooming = true;
    zoomStartTime = performance.now();

    requestAnimationFrame(animate);
});


const audio1 = document.getElementById("bgMusic");
const source = document.getElementById("bgSource");

const tracks = [
  "assets/audio/Song.mp3",
  "assets/audio/Song2.mp3"
];

let current = 0;

document.getElementById("changeSoundBtn").addEventListener("click", () => {
  current = (current + 1) % tracks.length;

  source.src = tracks[current] + "?v=" + Date.now();
  audio1.load();
  audio1.play().catch(err => console.log("Audio play blocked:", err));
});