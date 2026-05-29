//sleep1

const sleep1Helper = {
    intro: [
        './assets/cat/normal-sleep1-animation/normal-sleep1-f1.png',
        './assets/cat/normal-sleep1-animation/normal-sleep1-f2.png',
        './assets/cat/normal-sleep1-animation/normal-sleep1-f3.png',
        './assets/cat/normal-sleep1-animation/normal-sleep1-f4.png',
        './assets/cat/normal-sleep1-animation/normal-sleep1-f5.png',
        './assets/cat/normal-sleep1-animation/normal-sleep1-f6.png',
        './assets/cat/normal-sleep1-animation/normal-sleep1-f7.png',
        './assets/cat/normal-sleep1-animation/normal-sleep1-f8.png',
        './assets/cat/normal-sleep1-animation/normal-sleep1-f9.png',

    ],
    frames: [
        './assets/cat/normal-sleep1-animation/normal-sleep1-f10.png',
        './assets/cat/normal-sleep1-animation/normal-sleep1-f11.png',
        './assets/cat/normal-sleep1-animation/normal-sleep1-f12.png',
        './assets/cat/normal-sleep1-animation/normal-sleep1-f13.png',
        './assets/cat/normal-sleep1-animation/normal-sleep1-f14.png',
    ],
    outro: [
        './assets/cat/normal-sleep1-animation/normal-sleep1-f15.png',
        './assets/cat/normal-sleep1-animation/normal-sleep1-f16.png',   
        './assets/cat/normal-sleep1-animation/normal-sleep1-f17.png',
        './assets/cat/normal-sleep1-animation/normal-sleep1-f18.png',
        './assets/cat/normal-sleep1-animation/normal-sleep1-f19.png',

    ],
    
    fps: 180,
    //3-8min
    minTime: 180000,
    maxTime: 480000,
    position: {left: '130px', top: '130px'},
    size: {width: '220px', height: '220px'}
    
}

const sleep1 = {
    intro: [],
    frames: sleep1Helper,
    outro: [],

    fps: 180,
    //15-30min
    minTime: 900000,
    maxTime: 1800000,
    position: {left: '130px', top: '130px'},
    size: {width: '220px', height: '220px'}
  
}
