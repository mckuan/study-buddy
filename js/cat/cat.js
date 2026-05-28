// cat.js
 
let currentFrame = 0;
let activeLayer = null;
let inactiveLayer = null;
let animationInterval = null;
 
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
 
  playAnimation(sleepSequence());
}
 
function playAnimation(sequence, fps = 150) {
  if (animationInterval) clearInterval(animationInterval);
  currentFrame = 0;
 
  activeLayer.src = sequence[0];
  inactiveLayer.src = sequence[1];
  activeLayer.style.opacity = 1;
  inactiveLayer.style.opacity = 0;
 
  animationInterval = setInterval(() => {
    const nextFrame = (currentFrame + 1) % sequence.length;
 
    inactiveLayer.src = sequence[nextFrame];
    activeLayer.style.transition = 'opacity 0.1s';
    inactiveLayer.style.transition = 'opacity 0.1s';
    activeLayer.style.opacity = 0;
    inactiveLayer.style.opacity = 1;
 
    [activeLayer, inactiveLayer] = [inactiveLayer, activeLayer];
    currentFrame = nextFrame;
  }, fps);
}
 
initCat();