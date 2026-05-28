const sleepFrames = [
  './assets/cat/normal-sleep1-animation/normal-sleep1-f1.png',
  './assets/cat/normal-sleep1-animation/normal-sleep1-f2.png',
  './assets/cat/normal-sleep1-animation/normal-sleep1-f3.png',
  './assets/cat/normal-sleep1-animation/normal-sleep1-f4.png',
  './assets/cat/normal-sleep1-animation/normal-sleep1-f5.png',
  './assets/cat/normal-sleep1-animation/normal-sleep1-f6.png',
  './assets/cat/normal-sleep1-animation/normal-sleep1-f7.png',
  './assets/cat/normal-sleep1-animation/normal-sleep1-f8.png',
  './assets/cat/normal-sleep1-animation/normal-sleep1-f9.png',
  './assets/cat/normal-sleep1-animation/normal-sleep1-f10.png',
  './assets/cat/normal-sleep1-animation/normal-sleep1-f11.png',
  './assets/cat/normal-sleep1-animation/normal-sleep1-f12.png',
  './assets/cat/normal-sleep1-animation/normal-sleep1-f13.png',
  './assets/cat/normal-sleep1-animation/normal-sleep1-f14.png',
  './assets/cat/normal-sleep1-animation/normal-sleep1-f15.png',
  './assets/cat/normal-sleep1-animation/normal-sleep1-f16.png',
  './assets/cat/normal-sleep1-animation/normal-sleep1-f17.png',
  './assets/cat/normal-sleep1-animation/normal-sleep1-f18.png',
  './assets/cat/normal-sleep1-animation/normal-sleep1-f19.png',
];

const SLEEP_LOOP_START = 9;  // f10
const SLEEP_LOOP_END = 13;   // f14
const SLEEP_LOOP_COUNT = 20;

function sleepSequence(loopCount = SLEEP_LOOP_COUNT) {
  const intro = sleepFrames.slice(0, SLEEP_LOOP_START);
  const loop = sleepFrames.slice(SLEEP_LOOP_START, SLEEP_LOOP_END + 1);
  const outro = sleepFrames.slice(SLEEP_LOOP_END + 1);
  return [...intro, ...Array(loopCount).fill(loop).flat(), ...outro];
}

function sleepPosition() {
  return { left: '40px', top: '150px', width: '180px', height: '180px' };
}