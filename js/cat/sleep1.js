//sleep1

const sleep1Helper = {
    intro: (body, color) => [
        `./assets/${body}/${color}/sleep1/f1.png`,
        `./assets/${body}/${color}/sleep1/f2.png`,
        `./assets/${body}/${color}/sleep1/f3.png`,
        `./assets/${body}/${color}/sleep1/f4.png`,
        `./assets/${body}/${color}/sleep1/f5.png`,
    ],
    frames: (body, color) => [
        `./assets/${body}/${color}/sleep1/f6.png`,
        `./assets/${body}/${color}/sleep1/f7.png`,
        `./assets/${body}/${color}/sleep1/f8.png`,
        `./assets/${body}/${color}/sleep1/f9.png`,
    ],
    outro: (body, color) => [
        `./assets/${body}/${color}/sleep1/f10.png`,
        `./assets/${body}/${color}/sleep1/f11.png`,
        `./assets/${body}/${color}/sleep1/f12.png`,
        `./assets/${body}/${color}/sleep1/f13.png`,
        `./assets/${body}/${color}/sleep1/f14.png`,
        `./assets/${body}/${color}/sleep1/f15.png`,
    ],
    
    fps: 180,
    //3-8min
    minTime: 180000,
    maxTime: 480000,
    
}

const sleep1 = {
    intro: (body, color) =>[],
    frames: sleep1Helper,
    outro: (body, color) =>[],

    fps: 180,
    //15-30min
    minTime: 900000,
    maxTime: 1800000,
    position: {left: '120px', top: '110px'},
    size: {width: '220px', height: '220px'},
    collarposition: {left: '230px', top: '190px'},
    collarsize: {width: '20px', height: '10px'},
  
}
