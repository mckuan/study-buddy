const sleep2Helper = {
    intro: [
        './assets/cat/normal-sleep2-animation/normal-sleep2-f1.png',
        './assets/cat/normal-sleep2-animation/normal-sleep2-f2.png',
        './assets/cat/normal-sleep2-animation/normal-sleep2-f3.png',
        './assets/cat/normal-sleep2-animation/normal-sleep2-f4.png',
        './assets/cat/normal-sleep2-animation/normal-sleep2-f5.png', 

    ],
    frames: [
        './assets/cat/normal-sleep2-animation/normal-sleep2-f6.png',
        './assets/cat/normal-sleep2-animation/normal-sleep2-f7.png',
        './assets/cat/normal-sleep2-animation/normal-sleep2-f8.png',
        './assets/cat/normal-sleep2-animation/normal-sleep2-f9.png',
    ],
    outro: [
        './assets/cat/normal-sleep2-animation/normal-sleep2-f10.png',
        './assets/cat/normal-sleep2-animation/normal-sleep2-f11.png',
        './assets/cat/normal-sleep2-animation/normal-sleep2-f12.png',
        './assets/cat/normal-sleep2-animation/normal-sleep2-f13.png',
        './assets/cat/normal-sleep2-animation/normal-sleep2-f14.png',
        './assets/cat/normal-sleep2-animation/normal-sleep2-f15.png',
    ],
    
    fps: 220,
    //3-8min
    minTime: 180000,
    maxTime: 480000,
    position: {right: '235px', top: '93px'},
    size: {width: '220px', height: '220px'}
    
}

const sleep2 = {
    intro: [],
    frames: sleep2Helper,
    outro: [],

    fps: 180,
    minTime: 900000,
    maxTime: 1800000,
    position: {right: '235px', top: '93px'},
    size: {width: '220px', height: '220px'},
    rotation: -5 
  
}
