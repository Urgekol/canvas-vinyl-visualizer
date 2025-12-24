const canvas = document.getElementById("discCanvas");
const ctx = canvas.getContext("2d");

const songInput = document.getElementById("songName");
const singerInput = document.getElementById("singerName");
const durationInput = document.getElementById("duration");
const downloadBtn = document.getElementById("downloadBtn");

let songText = "Your Song Title";
let singerText = "Artist Name";


let lastValidSong = "";
let lastValidSinger = "";

songInput.addEventListener("input", () => {

  const raw = songInput.value;

  const words = raw.split(/\s+/);

  const invalidWord = words.find(w => w.length > 8);

  if (!invalidWord) 
  {
    lastValidSong = raw.trim();
    songText = lastValidSong || "Your Song Title";

    return;
  }

  if (raw.endsWith(" ")) 
  {
    lastValidSong = raw.trim();
    songText = lastValidSong || "Your Song Title";

    return;
  }

  songInput.value = lastValidSong;
});


singerInput.addEventListener("input", () => {

  const raw = singerInput.value;

  const words = raw.split(/\s+/);

  const invalidWord = words.find(w => w.length > 8);

  if (!invalidWord) 
  {
    lastValidSinger = raw.trim();
    singerText = lastValidSinger || "Your Song Title";

    return;
  }

  if (raw.endsWith(" ")) 
  {
    lastValidSinger = raw.trim();
    singerText = lastValidSinger || "Your Song Title";

    return;
  }

  singerInput.value = lastValidSinger;
});


// disc image
const discImage = new Image();
discImage.src = "disc.png";

// background image (default)
const bgImage = new Image();
bgImage.src = "layout1.jpeg";

const centerX = canvas.width / 2;
const centerY = 650;
const discSize = 700;

let angle = 0;

const minSec = 60;
const maxSec = 89;
const currentSec = Math.floor(Math.random() * (maxSec - minSec + 1)) + minSec;

const totalTrackSec = 240;
const remainingSec = Math.max(totalTrackSec - currentSec, 0);

const fakeProgress = Math.min(currentSec / totalTrackSec, 1);

const CREAM = "#f5e9d7";


function fmtTime(sec) 
{
  const m = Math.floor(sec / 60);
  const s = sec % 60;

  return `${m}:${s.toString().padStart(2, "0")}`;
}


function getPlayerMetrics() 
{
  const panelHeight = 190;

  let panelTop = centerY + discSize / 2 + 80;

  if (panelTop < centerY) 
  {
    panelTop = centerY;
  }

  if (panelTop + panelHeight > canvas.height) 
  {
    panelTop = canvas.height - panelHeight;
  }

  return { panelTop, panelHeight };
}


function drawBackground() 
{
  if (bgImage.complete && bgImage.naturalWidth > 0) 
  {
    const imgW = bgImage.naturalWidth;
    const imgH = bgImage.naturalHeight;

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = imgW / imgH;

    let drawW;
    let drawH;

    if (imgRatio > canvasRatio) 
    {
      drawH = canvas.height;
      drawW = imgRatio * drawH;
    } 
    else 
    {
      drawW = canvas.width;
      drawH = drawW / imgRatio;
    }

    const offsetX = (canvas.width - drawW) / 2;
    const offsetY = (canvas.height - drawH) / 2;

    ctx.drawImage(bgImage, offsetX, offsetY, drawW, drawH);
  } 
  else 
  {
    ctx.fillStyle = "#1f2933";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}


function roundRectPath(x, y, w, h, r) 
{
  r = Math.min(r, w / 2, h / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}


function drawOuterFrame() 
{
  const paddingX = 80;
  const paddingY = 120;
  const width = canvas.width - paddingX * 2;
  const height = canvas.height - paddingY * 2;
  const radius = 60;

  ctx.save();

  roundRectPath(paddingX, paddingY, width, height, radius);
  ctx.strokeStyle = "rgba(245, 233, 215, 0.9)";
  ctx.lineWidth = 6;

  ctx.stroke();
  ctx.restore();
}


function drawPlayerUI() 
{
  const { panelTop, panelHeight } = getPlayerMetrics();

  const barY = panelTop + 28;
  const left = 140;
  const right = canvas.width - 140;

  ctx.save();

  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(245, 233, 215, 0.4)";
  ctx.lineWidth = 6;

  ctx.beginPath();
  ctx.moveTo(left, barY);
  ctx.lineTo(right, barY);
  ctx.stroke();

  const px = left + (right - left) * fakeProgress;
  ctx.strokeStyle = CREAM;

  ctx.beginPath();
  ctx.moveTo(left, barY);
  ctx.lineTo(px, barY);
  ctx.stroke();

  ctx.fillStyle = CREAM;
  ctx.font = "18px Arial";
  ctx.textBaseline = "top";

  ctx.textAlign = "left";
  ctx.fillText(fmtTime(currentSec), left, barY + 10);

  ctx.textAlign = "right";
  ctx.fillText(`-${fmtTime(remainingSec)}`, right, barY + 10);

  const rowY = panelTop + panelHeight - 60;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = CREAM;

  const solid40 = "900 40px 'Font Awesome 6 Free'";
  const solid64 = "900 64px 'Font Awesome 6 Free'";

  ctx.font = solid40;
  ctx.fillText("\uf074", 150, rowY);

  ctx.font = solid40;
  ctx.fillText("\uf048", canvas.width / 2 - 120, rowY);

  ctx.font = solid64;
  ctx.fillText("\uf04b", canvas.width / 2, rowY);

  ctx.font = solid40;
  ctx.fillText("\uf051", canvas.width / 2 + 120, rowY);

  ctx.font = solid40;
  ctx.fillText("\uf363", canvas.width - 150, rowY);

  ctx.restore();
}


function fitSingleLine(ctx, text, maxWidth, baseSize, minSize, fontFamily, weight = "") 
{
  let size = baseSize;

  while (size > minSize) 
  {
    ctx.font = `${weight}${size}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth) 
    {
      return { size, wrapped: false };
    }
    size--;
  }

  return { size: minSize, wrapped: true };
}


function wrapToTwoLines(ctx, text, maxWidth, font) 
{
  ctx.font = font; // THIS LINE IS THE FIX

  const words = text.split(" ");
  let line1 = "";
  let line2 = "";

  for (let i = 0; i < words.length; i++) 
  {
    const test = line1 ? line1 + " " + words[i] : words[i];

    if (ctx.measureText(test).width <= maxWidth) 
    {
      line1 = test;
    } 
    else 
    {
      line2 = words.slice(i).join(" ");
      break;
    }
  }

  return [line1, line2];
}



function drawFrame() 
{
  drawBackground();

  drawPlayerUI();

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);

  if (discImage.complete && discImage.naturalWidth > 0) 
  {
    ctx.drawImage(
      discImage,
      -discSize / 2,
      -discSize / 2,
      discSize,
      discSize
    );
  }

  ctx.fillStyle = "#111827";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const maxTextWidth_song = discSize * 0.3;
  const maxTextWidth_singer = discSize * 0.25;

  /* SONG NAME */
  const songFit = fitSingleLine(
    ctx,
    songText,
    maxTextWidth_song,
    28,
    20,
    "'Knewave'"
  );

  if (!songFit.wrapped) 
  {
    ctx.font = `${songFit.size}px 'Knewave'`;
    ctx.fillText(songText, 0, -20);
  } 
  else 
  {
    ctx.font = "20px 'Knewave'";
    const [l1, l2] = wrapToTwoLines(
      ctx,
      songText,
      maxTextWidth_song,
      "20px 'Knewave'"
    );

    ctx.fillText(l1, 0, -34);
    ctx.fillText(l2, 0, -8);
  }

  /* SINGER NAME */
  const singerFit = fitSingleLine(
    ctx,
    singerText,
    maxTextWidth_singer,
    25,
    18,
    "'Roboto Condensed'",
    "600 "
  );

  if (!singerFit.wrapped) 
  {
    ctx.font = `600 ${singerFit.size}px 'Roboto Condensed'`;
    ctx.fillText(singerText, 0, 40);
  } 
  else 
  {
    ctx.font = "600 18px 'Roboto Condensed'";
    const [l1, l2] = wrapToTwoLines(
      ctx,
      singerText,
      maxTextWidth_singer,
      "600 18px 'Roboto Condensed'"
    );

    ctx.fillText(l1, 0, 30);
    ctx.fillText(l2, 0, 55);
  }
  ctx.restore();

  drawOuterFrame();
}


function animate() 
{
  angle += 0.02;

  drawFrame();
  requestAnimationFrame(animate);
}

Promise.all([
  document.fonts.load("900 40px 'Font Awesome 6 Free'"),
  document.fonts.load("32px 'Knewave'"),
  document.fonts.load("25px 'Roboto Condensed'"),

  new Promise(res => {

    if (discImage.complete && discImage.naturalWidth > 0)
      res();
    else
      discImage.onload = res;
  }),

  new Promise(res => {

    if (bgImage.complete && bgImage.naturalWidth > 0)
      res();
    else
      bgImage.onload = res;
  })
]).then(() => {
  animate();
});


// recording logic
async function startRecording() 
{
  const duration = Math.min(60, Math.max(1, Number(durationInput.value) || 8));
  const stream = canvas.captureStream(30);

  const options =
    MediaRecorder.isTypeSupported &&
    MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? { mimeType: "video/webm;codecs=vp9" }
      : { mimeType: "video/webm" };

  const recorder = new MediaRecorder(stream, options);
  const chunks = [];

  recorder.ondataavailable = e => {

    if (e.data && e.data.size > 0)
      chunks.push(e.data);
  };

  recorder.onstop = () => {

    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "story-recording.webm";

    a.click();

    URL.revokeObjectURL(url);
    downloadBtn.disabled = false;
  };

  downloadBtn.disabled = true;
  recorder.start();

  setTimeout(() => recorder.stop(), duration * 1000);
}


downloadBtn.addEventListener("click", startRecording);

/*  Horizontal slider logic  */

const track = document.querySelector(".slider-track");
const items = Array.from(document.querySelectorAll(".slider-track li"));
const leftBtn = document.getElementById("wallLeft");
const rightBtn = document.getElementById("wallRight");

let currentIndex = 0;
let itemWidth = 0;
let visibleCount = 4;


const sliderContainer = document.querySelector(".slider-container");


function calculateSliderMetrics() 
{
  if (items.length === 0 || !sliderContainer)
    return;

  const rect = items[0].getBoundingClientRect();
  itemWidth = rect.width;

  const containerWidth = sliderContainer.getBoundingClientRect().width;
  visibleCount = Math.max(1, Math.floor(containerWidth / itemWidth));
}


function updateArrowState() 
{
  const maxIndex = Math.max(0, items.length - visibleCount);

  if (currentIndex <= 0) 
  {
    currentIndex = 0;
    leftBtn.classList.add("disabled");
  } 
  else 
  {
    leftBtn.classList.remove("disabled");
  }

  if (currentIndex >= maxIndex) 
  {
    currentIndex = maxIndex;
    rightBtn.classList.add("disabled");
  } 
  else 
  {
    rightBtn.classList.remove("disabled");
  }
}


function updateSlider() 
{
  track.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
  updateArrowState();
}


if (leftBtn && rightBtn) 
{
  leftBtn.addEventListener("click", () => {

    currentIndex = Math.max(0, currentIndex - 1);
    updateSlider();
  });

  rightBtn.addEventListener("click", () => {

    const maxIndex = Math.max(0, items.length - visibleCount);
    currentIndex = Math.min(maxIndex, currentIndex + 1);
    updateSlider();
  });

  window.addEventListener("load", () => {

    calculateSliderMetrics();
    updateSlider();
  });

  window.addEventListener("resize", () => {

    calculateSliderMetrics();
    updateSlider();
  });
}


/*  Clickable wallpapers  */

const sliderImages = document.querySelectorAll(".slider-track img");

sliderImages.forEach(img => {
  img.addEventListener("click", () => {

    const src = img.getAttribute("src");
    if (src) 
    {
      bgImage.src = src;
    }
  });
});


/*  Upload Background Image  */

const uploadInput = document.getElementById("uploadInput");

uploadInput.addEventListener("change", function () {
  const file = this.files[0];

  if (!file)
    return;

  const reader = new FileReader();

  reader.onload = function (e) {

    const tempImg = new Image();
    tempImg.onload = () => {

      bgImage.src = e.target.result;  // replace canvas background
    };

    tempImg.src = e.target.result;
  };
  reader.readAsDataURL(file);
});
