// cat.js
 
const animations = [idle, sleep1, sleep2, play, poop, eat];
 
let activeLayer = null;
let inactiveLayer = null;
 
// ─── init ────────────────────────────────────────────────────────────────────
 
function initCat() {
  const container = document.createElement('div');
  container.classList.add('cat-container');
 
  const img1 = document.createElement('img');
  const img2 = document.createElement('img');
  img1.classList.add('cat-frame-1');
  img2.classList.add('cat-frame-2');
 
  img1.style.opacity = 1;
  img2.style.opacity = 0;
 
  container.appendChild(img1);
  container.appendChild(img2);
  document.querySelector('.frame').appendChild(container);
 
  activeLayer = img1;
  inactiveLayer = img2;
 
  scheduleNext();
}
 
// ─── position ────────────────────────────────────────────────────────────────
 
function applyPosition(anim) {
  const container = document.querySelector('.cat-container');
  container.style.left   = anim.position.left   || '';
  container.style.right   = anim.position.right   || '';
  container.style.top    = anim.position.top     || '';
  container.style.bottom = anim.position.bottom  || '';
  container.style.transform = `rotate(${anim.rotation || 0}deg)`;
  container.style.width  = anim.size.width;
  container.style.height = anim.size.height;
}
 
// ─── frame playback ──────────────────────────────────────────────────────────
 
// plays a frame array exactly once through
function playPhase(frames, fps) {
  return new Promise((resolve) => {
    if (!frames || frames.length === 0) { resolve(); return; }
 
    // seed the first frame immediately
    inactiveLayer.src = frames[0];
    inactiveLayer.style.opacity = 1;
    activeLayer.style.opacity = 0;
    [activeLayer, inactiveLayer] = [inactiveLayer, activeLayer];
 
    if (frames.length === 1) { resolve(); return; }
 
    let i = 0;
    const interval = setInterval(() => {
      const next = (i + 1) % frames.length;
 
      inactiveLayer.src = frames[next];
      activeLayer.style.transition = `opacity ${fps * 0.5}ms`;
      inactiveLayer.style.transition = `opacity ${fps * 0.5}ms`;
      activeLayer.style.opacity = 0;
      inactiveLayer.style.opacity = 1;
 
      [activeLayer, inactiveLayer] = [inactiveLayer, activeLayer];
      i = next;
 
      if (i === frames.length - 1) {
        clearInterval(interval);
        resolve();
      }
    }, fps);
  });
}
 
// loops a frame array for a set duration
function playLoopByTime(frames, fps, duration) {
  return new Promise((resolve) => {
    if (!frames || frames.length === 0) { resolve(); return; }
 
    inactiveLayer.src = frames[0];
    inactiveLayer.style.opacity = 1;
    activeLayer.style.opacity = 0;
    [activeLayer, inactiveLayer] = [inactiveLayer, activeLayer];
 
    const end = Date.now() + duration;
    let i = 0;
 
    const interval = setInterval(() => {
      const next = (i + 1) % frames.length;
 
      inactiveLayer.src = frames[next];
      activeLayer.style.transition = `opacity ${fps * 0.5}ms`;
      inactiveLayer.style.transition = `opacity ${fps * 0.5}ms`;
      activeLayer.style.opacity = 0;
      inactiveLayer.style.opacity = 1;
 
      [activeLayer, inactiveLayer] = [inactiveLayer, activeLayer];
      i = next;
 
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
  // no applyPosition here — only scheduleNext calls it on top-level anims
 
  const duration = randomBetween(anim.minTime, anim.maxTime);
  const end = Date.now() + duration;
 
  await playPhase(anim.intro, anim.fps);
 
  while (Date.now() < end) {
    if (Array.isArray(anim.frames)) {
      await playLoopByTime(anim.frames, anim.fps, end - Date.now());
    } else {
      await playAnim(anim.frames); // recurse into sleepInner
    }
  }
 
  await playPhase(anim.outro, anim.fps);
}
 
// ─── scheduler ───────────────────────────────────────────────────────────────
 
async function scheduleNext() {
  while (true) {
    const anim = animations[Math.floor(Math.random() * animations.length)];
    applyPosition(anim); // only called here, only on top-level anims
    await playAnim(anim);
  }
}
 
initCat();