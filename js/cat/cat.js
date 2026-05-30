// cat.js
 
const animations = [eat];
const catBody  = 'fuzzy';
const catColor = 'white';
const collar = document.querySelector('.collar');
 
let activeLayer  = null;
let catContainer = null;

 
// ─── resolve frames ──────────────────────────────────────────────────────────
 
function resolveFrames(frames) {
  if (typeof frames === 'function') return frames(catBody, catColor);
  return frames;
}
 
// ─── init ────────────────────────────────────────────────────────────────────
 
function initCat() {
  catContainer = document.createElement('div');
  catContainer.classList.add('cat-container');
 
  const img = document.createElement('img');
  img.classList.add('cat-frame');
  img.style.opacity = 1;
 
  catContainer.appendChild(img);
  document.querySelector('.content').appendChild(catContainer);
 
  activeLayer = img;
 
  scheduleNext();
}
 
// ─── position ────────────────────────────────────────────────────────────────
 
function applyPosition(anim) {
  catContainer.style.left      = anim.position.left   || '';
  catContainer.style.right     = anim.position.right  || '';
  catContainer.style.top       = anim.position.top    || '';
  catContainer.style.bottom    = anim.position.bottom || '';
  catContainer.style.transform = `rotate(${anim.rotation || 0}deg)`;
  catContainer.style.width     = anim.size.width;
  catContainer.style.height    = anim.size.height;

  collar.style.left      = anim.collarposition.left   || '';
  collar.style.right     = anim.collarposition.right  || '';
  collar.style.top       = anim.collarposition.top    || '';
  collar.style.bottom    = anim.collarposition.bottom || '';
}
 
// ─── frame playback ──────────────────────────────────────────────────────────
 
function playPhase(frames, fps) {
  return new Promise((resolve) => {
    frames = resolveFrames(frames);
    if (!frames || frames.length === 0) { resolve(); return; }
 
    activeLayer.src = frames[0];
    if (frames.length === 1) { setTimeout(resolve, fps); return; }
 
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % frames.length;
      activeLayer.src = frames[i];
 
      if (i === frames.length - 1) {
        clearInterval(interval);
        setTimeout(resolve, fps);
      }
    }, fps);
  });
}
 
function playLoopByTime(frames, fps, duration) {
  return new Promise((resolve) => {
    frames = resolveFrames(frames);
    if (!frames || frames.length === 0) { resolve(); return; }
 
    const end = Date.now() + duration;
    let i = 0;
    activeLayer.src = frames[0];
 
    const interval = setInterval(() => {
      i = (i + 1) % frames.length;
      activeLayer.src = frames[i];
 
      if (Date.now() >= end) {
        clearInterval(interval);
        resolve();
      }
    }, fps);
  });
}
 
// ─── animation runner ────────────────────────────────────────────────────────
 
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
 
async function playAnim(anim) {
  const duration = randomBetween(anim.minTime, anim.maxTime);
  const end = Date.now() + duration;
 
  await playPhase(anim.intro, anim.fps);
 
  while (Date.now() < end) {
    if (typeof anim.frames === 'function' || Array.isArray(anim.frames)) {
      await playLoopByTime(anim.frames, anim.fps, end - Date.now());
    } else {
      await playAnim(anim.frames);
    }
  }
 
  await playPhase(anim.outro, anim.fps);
}
 
// ─── scheduler ───────────────────────────────────────────────────────────────
 
async function scheduleNext() {
  while (true) {
    const anim = animations[Math.floor(Math.random() * animations.length)];
    applyPosition(anim);
    await playAnim(anim);
  }
}
 
document.addEventListener('DOMContentLoaded', () => {
  initCat();
});
 