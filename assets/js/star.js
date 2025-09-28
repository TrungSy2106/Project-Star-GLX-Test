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
    { core: "rgba(138, 43, 226, 1)", glow: "rgba(138, 43, 226, 0.9)" },
    { core: "rgba(80, 255, 120, 1)", glow: "rgba(80, 255, 120, 0.9)" },
    { core: "rgba(0, 191, 255, 1)", glow: "rgba(0, 191, 255, 0.9)" },
    { core: "rgba(255, 255, 255, 1)", glow: "rgba(255, 255, 255, 0.9)" },
    { core: "rgba(255, 255, 255, 1)", glow: "rgba(255, 255, 255, 0.9)" },
    { core: "rgba(255, 255, 255, 1)", glow: "rgba(255, 255, 255, 0.9)" },
    { core: "rgba(255, 215, 0, 1)", glow: "rgba(255, 215, 0, 0.9)" }
];

class TwinkleStar {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;

        var sizeStar = 3;
        if (isMobile()) {
            sizeStar = 1;
        }

        this.size = Math.random() * sizeStar + 0.5;
        this.phase = Math.random() * Math.PI * 2;
        this.colors = colorSets[Math.floor(Math.random() * colorSets.length)];
        
        this.pulseSpeed = Math.random() * 0.5 + 0.35;
        this.minScale = 0.2 + Math.random() * 0.4; // 30-60%
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
        ctx.arc(0, 0, currentSize * 0.8, 0, Math.PI * 2);
        ctx.fill();

        const length = currentSize * 3;
        const width = currentSize * 0.8;

        // Hiệu ứng tỏa sáng nhẹ
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.colors.glow;
        
        ctx.fillStyle = this.colors.glow;

        // Tia lên
        ctx.beginPath();
        ctx.moveTo(-width/4, 0);
        ctx.lineTo(-width/2, -length/3);
        ctx.lineTo(0, -length);
        ctx.lineTo(width/2, -length/3);
        ctx.lineTo(width/4, 0); 
        ctx.closePath();
        ctx.fill();

        // Tia xuống
        ctx.beginPath();
        ctx.moveTo(-width/4, 0);
        ctx.lineTo(-width/2, length/3);
        ctx.lineTo(0, length);
        ctx.lineTo(width/2, length/3);
        ctx.lineTo(width/4, 0);
        ctx.closePath();
        ctx.fill();

        // Tia trái
        ctx.beginPath();
        ctx.moveTo(0, -width/4);
        ctx.lineTo(-length/3, -width/2);
        ctx.lineTo(-length, 0);
        ctx.lineTo(-length/3, width/2);
        ctx.lineTo(0, width/4);
        ctx.closePath();
        ctx.fill();

        // Tia phải
        ctx.beginPath();
        ctx.moveTo(0, -width/4);
        ctx.lineTo(length/3, -width/2);
        ctx.lineTo(length, 0);
        ctx.lineTo(length/3, width/2);
        ctx.lineTo(0, width/4);
        ctx.closePath();
        ctx.fill();

        // Tắt shadow
        ctx.shadowBlur = 0;

        ctx.restore();
    }
}

const flickerColors = [
    "rgba(210, 130, 255, 1)",
    "rgba(120, 220, 150, 1)",
    "rgba(0, 191, 255, 1)",
    "rgba(0, 191, 255, 1)",
    "rgba(0, 191, 255, 1)",
    "rgba(255, 255, 255, 1)",
    "rgba(255, 255, 255, 1)",
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
        const opacity = 0.5 + 0.5 * Math.sin(time * 3.5 + this.phase);
        ctx.save();
        ctx.globalAlpha = opacity;

        ctx.shadowBlur = 3;
        ctx.shadowColor = this.color;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.shadowBlur = 0;

        ctx.restore();
    }
}


var quantity = 30;
if (isMobile()) {
    quantity = 10;
}

const twinkleStars = Array.from({ length: quantity }, () => new TwinkleStar());
const flickerStars = Array.from({ length: quantity + 10 }, () => new FlickerStar());

var sizeSS = 1.5;
if (isMobile()) {
    sizeSS = 1;
}


// Sao băng
class ShootingStar {
    constructor() {
    this.reset();
    }
    reset() {
        this.angle = Math.random() * Math.PI;
        this.radius = Math.random() * (h / 2.8) + h / 4;
        this.speed = Math.random() * 0.001 + 0.001;
        this.size = Math.random() * 2 + sizeSS;
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
        const vibrantBodyColor = { r: 100, g: 200, b: 255 };
        const tailColor      = { r: 71, g: 97, b: 255 };

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


const shootingStars = Array.from({ length: 25 }, () => new ShootingStar());

const bgImage = new Image();
bgImage.src = "assets/images/BGR.png";
let bgTime = 0;
const bgScaleSpeed = 0.0003;
const bgScaleMin = 1;
const bgScaleMax = 1.1;

// Hàm vẽ chính
function animate(time) {

    let currentScale = 1;
    if (isZooming) {
        const elapsed = time - zoomStartTime;
        zoomProgress = Math.min(elapsed / zoomDuration, 1);
        const easedProgress = 1 - Math.pow(1 - zoomProgress, 3);
        currentScale = 0.87 + (0.13 * easedProgress);
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


// const audio1 = document.getElementById("bgMusic");
// const source = document.getElementById("bgSource");

// const tracks = [
//   "assets/audio/Song.mp3",
//   "assets/audio/Song2.mp3"
// ];

// let current = 0;

// document.getElementById("changeSoundBtn").addEventListener("click", () => {
//   current = (current + 1) % tracks.length;

//   source.src = tracks[current] + "?v=" + Date.now();
//   audio1.load();
//   audio1.play().catch(err => console.log("Audio play blocked:", err));
// });


const rawLyrics = `[00:00.00] Song
[00:26.73] See, sometimes it's rainy (Thấy đấy, có lúc trời mưa)
[00:32.11] Sometimes it's cloudy, that's what journey means (Có khi mây mù, đó chính là ý nghĩa của hành trình)
[00:38.43] Can't see, the scene ahead is blurry (Con đường phía trước mờ mịt chẳng thấy rõ)
[00:44.50] But we still must pursue the dream (Nhưng ta vẫn phải tiếp tục theo đuổi giấc mơ)
[00:51.52] Travel through the heights and shallows (Băng qua đỉnh cao và vực sâu)
[00:54.63] Put on a sturdy shell to face the hard perils (Khoác lên lớp vỏ cứng cáp để đối diện hiểm nguy)
[00:57.54] I hear about your last trace (Ta nghe thấy dấu vết cuối cùng của em)
[01:03.94] Love is shining bright in the deep night (Tình yêu vẫn sáng rực giữa đêm tối)
[01:07.01] Stand up to fight many times, then know what's wrong and right (Đứng lên chiến đấu nhiều lần mới hiểu thế nào đúng, thế nào sai)
[01:09.96] The scars will finally heal (ết thương rồi cũng sẽ lành.)
[01:15.68] Do not fear the road not taken, the unresolved problem (Đừng sợ con đường chưa ai đi, đừng ngại những vấn đề chưa có lời giải)
[01:22.36] Do not go, gentle into that good night (Đừng lặng lẽ buông xuôi vào đêm tối ấy)
[01:28.09] The day I want to seize comes with the greetings of the breeze (Ngày mà ta muốn nắm bắt, sẽ đến cùng làn gió chào đón)
[01:34.27] Will there be that day? Please tell me, tell me (Liệu có ngày đó không? Hãy nói cho ta biết…)
[01:42.93] (…)
[02:06.05] Travel through infinite dusks and dawns (Đi qua vô tận hoàng hôn và bình minh)
[02:09.19] Break through the strong tide to reach the other side (Phá vỡ sóng dữ để đến bờ bên kia)
[02:11.94] I hear about your last trace (Ta nghe thấy dấu vết cuối cùng của em)
[02:18.42] Some words are heavy when some words are light (Có lời nặng trĩu, có lời lại nhẹ tênh)
[02:21.52] We are like two meteors that miss each other (Ta và em như hai ngôi sao băng lỡ nhau trong đêm)
[02:24.38] We will finally reunite (Nhưng cuối cùng, ta sẽ gặp lại nhau)
[02:30.07] To catch up with the sunlight, with the brightest fire (Để đuổi kịp ánh mặt trời, ngọn lửa rực rỡ nhất)
[02:36.84] The memories softly touch my face (Ký ức dịu dàng khẽ chạm vào khuôn mặt ta)
[02:42.56] The freedom I want to seize takes me to an unknown place (Tự do mà ta khao khát sẽ dẫn ta đến nơi chưa biết)
[02:48.75] At the journey's end, we will meet (Ở cuối hành trình, chúng ta sẽ gặp nhau)
[02:55.04] To catch up with the sunlight, with the brightest fire (Để đuổi kịp ánh mặt trời, với ngọn lửa sáng nhất)
[03:01.60] Because of you, the story will go on (Vì có em, câu chuyện này sẽ còn tiếp diễn)
[03:07.36] The quest along the way, we will always appreciate (yeah) (Chặng hành trình này, ta sẽ luôn trân trọng)
[03:13.51] At the journey's end, we will meet (Ở cuối hành trình, chúng ta sẽ gặp lại nhau)
[03:20.57] We will meet again (ah) (Chúng ta sẽ nhất định gặp lại nhau)
[03:26.83] (…)`;

function parseLyrics(raw) {
  const lines = raw.split("\n");
  const parsed = [];
  const timeRegex = /\[(\d+):(\d+\.\d+)\]/;

  for (let line of lines) {
    const match = timeRegex.exec(line);
    if (match) {
      const min = parseInt(match[1]);
      const sec = parseFloat(match[2]);
      const time = min * 60 + sec;
      
      const fullText = line.replace(timeRegex, "").trim();
      let english = fullText;
      let vietnamese = "";
      
      const vnMatch = fullText.match(/^(.*?)\s*\((.+)\)$/);
      if (vnMatch) {
        english = vnMatch[1].trim();
        vietnamese = vnMatch[2].trim();
      }
      
      parsed.push({ time, english, vietnamese });
    }
  }
  return parsed;
}

const lyrics = parseLyrics(rawLyrics);

const lyricsContainer = document.createElement("div");
lyricsContainer.id = "lyricsContainer";
lyricsContainer.style.position = "absolute";
lyricsContainer.style.top = "50%";
lyricsContainer.style.left = "50%";
lyricsContainer.style.transform = "translate(-50%, -50%)";
lyricsContainer.style.textAlign = "center";
lyricsContainer.style.pointerEvents = "none";
lyricsContainer.style.width = "80%";
lyricsContainer.style.maxWidth = "800px";
lyricsContainer.style.zIndex = "1000";
document.body.appendChild(lyricsContainer);

const previousLyric = document.createElement("div");
previousLyric.className = "lyric-line previous";

const currentLyric = document.createElement("div");
currentLyric.className = "lyric-line current";

const nextLyric = document.createElement("div");
nextLyric.className = "lyric-line next";

lyricsContainer.appendChild(previousLyric);
lyricsContainer.appendChild(currentLyric);
lyricsContainer.appendChild(nextLyric);

const particlesContainer = document.createElement("div");
particlesContainer.id = "lyricsParticles";
particlesContainer.style.position = "absolute";
particlesContainer.style.top = "0";
particlesContainer.style.left = "0";
particlesContainer.style.width = "100%";
particlesContainer.style.height = "100%";
particlesContainer.style.pointerEvents = "none";
lyricsContainer.appendChild(particlesContainer);

const enhancedLyricsStyle = document.createElement("style");
enhancedLyricsStyle.textContent = `
.lyric-line {
  font-family: 'Tahoma', Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 10px 0;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  line-height: 1.4;
}

.lyric-line.previous {
  font-size: 18px;
  opacity: 0.4;
  transform: translateY(-20px) scale(0.9);
  background: linear-gradient(45deg, #6699ff, #99ccff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.lyric-line.current {
  font-size: 32px;
  opacity: 1;
  transform: translateY(0) scale(1);
  background: linear-gradient(45deg, 
    #ffffff 0%, 
    #66ccff 25%, 
    #99ddff 50%, 
    #ffffff 75%, 
    #b3e6ff 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmerGlow 3s ease-in-out infinite, textPulse 2s ease-in-out infinite;
  filter: drop-shadow(0 0 15px rgba(102, 204, 255, 0.6));
}

.lyric-line.next {
  font-size: 20px;
  opacity: 0.3;
  transform: translateY(20px) scale(0.85);
  background: linear-gradient(45deg, #99ccff, #b3d9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes shimmerGlow {
  0%, 100% { 
    background-position: 0% 50%;
    filter: drop-shadow(0 0 15px rgba(102, 204, 255, 0.6));
  }
  50% { 
    background-position: 100% 50%;
    filter: drop-shadow(0 0 25px rgba(102, 204, 255, 0.9));
  }
}

@keyframes textPulse {
  0%, 100% { 
    transform: translateY(0) scale(1);
  }
  50% { 
    transform: translateY(-2px) scale(1.02);
  }
}

.lyric-line.appear {
  animation: lyricAppear 0.8s ease-out;
}

@keyframes lyricAppear {
  0% { 
    opacity: 0; 
    transform: translateY(30px) scale(0.8) rotateX(90deg);
  }
  50% {
    transform: translateY(-5px) scale(1.05) rotateX(0deg);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1) rotateX(0deg);
  }
}

.lyric-line.disappear {
  animation: lyricDisappear 0.6s ease-in;
}

@keyframes lyricDisappear {
  0% { 
    opacity: 1; 
    transform: translateY(0) scale(1);
  }
  100% { 
    opacity: 0; 
    transform: translateY(-30px) scale(0.8);
  }
}

/* Particles */
.lyric-particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: radial-gradient(circle, rgba(102, 204, 255, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: particleFloat 3s ease-out forwards;
}

@keyframes particleFloat {
  0% { 
    opacity: 0; 
    transform: scale(0);
  }
  20% { 
    opacity: 1; 
    transform: scale(1);
  }
  100% { 
    opacity: 0; 
    transform: scale(0.5) translateY(-50px) translateX(var(--random-x, 0));
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .lyric-line.current {
    font-size: 24px;
  }
  .lyric-line.previous {
    font-size: 16px;
  }
  .lyric-line.next {
    font-size: 18px;
  }
}
`;
document.head.appendChild(enhancedLyricsStyle);

let currentLyricIndex = -1;
let isTransitioning = false;
let transitionTimeout = null;
let appearTimeout = null;

function createLyricParticles() {
  const container = document.getElementById('lyricsParticles');
  if (!container) return;
  
  for (let i = 0; i < 6; i++) {
    const particle = document.createElement('div');
    particle.className = 'lyric-particle';
    particle.style.left = (20 + Math.random() * 60) + '%';
    particle.style.top = (30 + Math.random() * 40) + '%';
    particle.style.setProperty('--random-x', (Math.random() - 0.5) * 100 + 'px');
    particle.style.animationDelay = Math.random() * 0.2 + 's';
    container.appendChild(particle);
    
    setTimeout(() => {
      if (particle && particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 3000);
  }
}

function updateLyricsDisplay(index) {
  if (!lyrics[index]) return;
  
  // Clear any pending transitions
  if (transitionTimeout) clearTimeout(transitionTimeout);
  if (appearTimeout) clearTimeout(appearTimeout);
  
  // Force stop current transition
  isTransitioning = false;
  currentLyric.classList.remove('appear', 'disappear');
  
  const prev = (index > 0 && lyrics[index - 1]) ? lyrics[index - 1] : null;
  const curr = lyrics[index];
  const next = (index < lyrics.length - 1 && lyrics[index + 1]) ? lyrics[index + 1] : null;
  
  // Immediate update for rapid changes
  previousLyric.textContent = prev ? prev.text : "";
  currentLyric.textContent = curr ? curr.text : "";
  nextLyric.textContent = next ? next.text : "";
  
  // Reset styles
  previousLyric.style.opacity = '';
  currentLyric.style.opacity = '';
  nextLyric.style.opacity = '';
  
  // Quick appear animation
  currentLyric.classList.add('appear');
  
  // Create particles with delay để tránh spam
  if (curr && curr.text && curr.text.trim() !== "") {
    setTimeout(() => createLyricParticles(), 100);
  }
  
  // Remove appear class
  appearTimeout = setTimeout(() => {
    currentLyric.classList.remove('appear');
  }, 600); // Shorter duration
}

function animateWordsIndividually(element) {
  // Skip word animation cho rapid changes
  return;
}

// ===== FIXED: Event listener cho rapid changes =====
let lastUpdateTime = 0;
const UPDATE_THROTTLE = 100; // Minimum 100ms between updates

audio.addEventListener("timeupdate", () => {
  const now = Date.now();
  
  // Throttle updates để tránh spam
  if (now - lastUpdateTime < UPDATE_THROTTLE) return;
  lastUpdateTime = now;
  
  const t = audio.currentTime;
  let foundIndex = -1;
  
  // Tìm lyrics hiện tại
  for (let i = 0; i < lyrics.length; i++) {
    if (lyrics[i] && typeof lyrics[i].time === 'number') {
      if (t >= lyrics[i].time && (i === lyrics.length - 1 || t < lyrics[i + 1].time)) {
        foundIndex = i;
        break;
      }
    }
  }
  
  // Update ngay lập tức khi có thay đổi
  if (foundIndex >= 0 && currentLyricIndex !== foundIndex) {
    currentLyricIndex = foundIndex;
    updateLyricsDisplay(foundIndex);
  }
});

// Simplified beat effects
let beatEffectInterval;
function addBeatEffects() {
  if (beatEffectInterval) clearInterval(beatEffectInterval);
  
  beatEffectInterval = setInterval(() => {
    if (audio.currentTime > 0 && !audio.paused) {
      try {
        if (twinkleStars && twinkleStars.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(twinkleStars.length, 10)); // Limit range
          const randomStar = twinkleStars[randomIndex];
          if (randomStar && typeof randomStar.size === 'number') {
            const originalSize = randomStar.size;
            randomStar.size *= 1.3;
            setTimeout(() => {
              if (randomStar) randomStar.size = originalSize;
            }, 200);
          }
        }
      } catch (e) {
        // Silent fail
      }
    }
  }, 700);
}

addBeatEffects();

const bilingualLyricsStyle = document.createElement("style");
bilingualLyricsStyle.textContent = `
.lyric-line {
  font-family: 'Tahoma', Helvetica, Arial, sans-serif;
  margin: 15px 0;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  line-height: 1.3;
}

.lyric-english {
  font-weight: 600;
  margin-bottom: 5px;
}

.lyric-vietnamese {
  font-weight: 400;
  opacity: 0.8;
  font-style: italic;
}

.lyric-line.previous .lyric-english {
  font-size: 16px;
  opacity: 0.4;
  transform: translateY(-20px) scale(0.9);
  background: linear-gradient(45deg, #6699ff, #99ccff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.lyric-line.previous .lyric-vietnamese {
  font-size: 13px;
  opacity: 0.3;
  color: #8bb3ff;
  display: none;
}

.lyric-line.current .lyric-english {
  font-size: 32px;
  opacity: 1;
  transform: translateY(0) scale(1);
  background: linear-gradient(45deg, 
    #ffffff 0%, 
    #66ccff 25%, 
    #99ddff 50%, 
    #ffffff 75%, 
    #b3e6ff 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmerGlow 3s ease-in-out infinite, textPulse 2s ease-in-out infinite;
  filter: drop-shadow(0 0 15px rgba(102, 204, 255, 0.6));
}

.lyric-line.current .lyric-vietnamese {
  font-size: 18px;
  opacity: 0.9;
  color: #b3d9ff;
  text-shadow: 0 0 8px rgba(102, 204, 255, 0.4);
}

.lyric-line.next .lyric-english {
  font-size: 18px;
  opacity: 0.3;
  transform: translateY(20px) scale(0.85);
  background: linear-gradient(45deg, #99ccff, #b3d9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.lyric-line.next .lyric-vietnamese {
  font-size: 14px;
  opacity: 0.25;
  color: #99ccff;
  display: none;
}

@keyframes shimmerGlow {
  0%, 100% { 
    background-position: 0% 50%;
    filter: drop-shadow(0 0 15px rgba(102, 204, 255, 0.6));
  }
  50% { 
    background-position: 100% 50%;
    filter: drop-shadow(0 0 25px rgba(102, 204, 255, 0.9));
  }
}

@keyframes textPulse {
  0%, 100% { 
    transform: translateY(0) scale(1);
  }
  50% { 
    transform: translateY(-2px) scale(1.02);
  }
}

.lyric-line.appear {
  animation: lyricAppear 0.8s ease-out;
}

@keyframes lyricAppear {
  0% { 
    opacity: 0; 
    transform: translateY(30px) scale(0.8);
  }
  50% {
    transform: translateY(-5px) scale(1.05);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1);
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .lyric-line.current .lyric-english {
    font-size: 24px;
  }
  .lyric-line.current .lyric-vietnamese {
    font-size: 16px;
  }
  .lyric-line.previous .lyric-english {
    font-size: 14px;
  }
  .lyric-line.previous .lyric-vietnamese {
    font-size: 11px;
  }
  .lyric-line.next .lyric-english {
    font-size: 16px;
  }
  .lyric-line.next .lyric-vietnamese {
    font-size: 12px;
  }
}
`;

// Replace existing CSS
const oldStyle = document.querySelector('style');
if (oldStyle) oldStyle.remove();
document.head.appendChild(bilingualLyricsStyle);

// ===== Update HTML structure =====
// Clear existing content
previousLyric.innerHTML = '';
currentLyric.innerHTML = '';
nextLyric.innerHTML = '';

// Add English & Vietnamese elements for each line
['previous', 'current', 'next'].forEach(type => {
  const container = type === 'previous' ? previousLyric : 
                  type === 'current' ? currentLyric : nextLyric;
  
  const englishDiv = document.createElement('div');
  englishDiv.className = 'lyric-english';
  
  const vietnameseDiv = document.createElement('div');
  vietnameseDiv.className = 'lyric-vietnamese';
  
  container.appendChild(englishDiv);
  container.appendChild(vietnameseDiv);
});

// ===== Update display function =====
function updateLyricsDisplay(index) {
  if (!lyrics[index]) return;
  
  // Clear any pending transitions
  if (transitionTimeout) clearTimeout(transitionTimeout);
  if (appearTimeout) clearTimeout(appearTimeout);
  
  currentLyric.classList.remove('appear', 'disappear');
  
  const prev = (index > 0 && lyrics[index - 1]) ? lyrics[index - 1] : null;
  const curr = lyrics[index];
  const next = (index < lyrics.length - 1 && lyrics[index + 1]) ? lyrics[index + 1] : null;
  
  // Update previous lyrics
  const prevEnglish = previousLyric.querySelector('.lyric-english');
  const prevVietnamese = previousLyric.querySelector('.lyric-vietnamese');
  prevEnglish.textContent = prev ? prev.english : "";
  prevVietnamese.textContent = prev ? prev.vietnamese : "";
  
  // Update current lyrics
  const currEnglish = currentLyric.querySelector('.lyric-english');
  const currVietnamese = currentLyric.querySelector('.lyric-vietnamese');
  currEnglish.textContent = curr ? curr.english : "";
  currVietnamese.textContent = curr ? curr.vietnamese : "";
  
  // Update next lyrics
  const nextEnglish = nextLyric.querySelector('.lyric-english');
  const nextVietnamese = nextLyric.querySelector('.lyric-vietnamese');
  nextEnglish.textContent = next ? next.english : "";
  nextVietnamese.textContent = next ? next.vietnamese : "";
  
  // Animation
  currentLyric.classList.add('appear');
  
  // Create particles
  if (curr && curr.english && curr.english.trim() !== "") {
    setTimeout(() => createLyricParticles(), 100);
  }
  
  // Remove appear class
  appearTimeout = setTimeout(() => {
    currentLyric.classList.remove('appear');
  }, 600);
}