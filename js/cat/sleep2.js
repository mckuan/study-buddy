const sleep2Helper = {
    intro: (body, color) => [
        `./assets/${body}/${color}/sleep2/f1.png`,
        `./assets/${body}/${color}/sleep2/f2.png`,
        `./assets/${body}/${color}/sleep2/f3.png`,
        `./assets/${body}/${color}/sleep2/f4.png`,
        `./assets/${body}/${color}/sleep2/f5.png`,
    ],
    frames: (body, color) => [
        `./assets/${body}/${color}/sleep2/f6.png`,
        `./assets/${body}/${color}/sleep2/f7.png`,
        `./assets/${body}/${color}/sleep2/f8.png`,
        `./assets/${body}/${color}/sleep2/f9.png`,
    ],
    outro: (body, color) => [
        `./assets/${body}/${color}/sleep2/f10.png`,
        `./assets/${body}/${color}/sleep2/f11.png`,
        `./assets/${body}/${color}/sleep2/f12.png`,
        `./assets/${body}/${color}/sleep2/f13.png`,
        `./assets/${body}/${color}/sleep2/f14.png`,
        `./assets/${body}/${color}/sleep2/f15.png`,
    ],
    
    fps: 220,
    //3-8min
    minTime: 180000,
    maxTime: 480000,
    
}

const sleep2 = {
    intro: (body, color) =>[],
    frames: sleep2Helper,
    outro: (body, color) =>[],

    fps: 180,
    minTime: 900000,
    maxTime: 1800000,
    position: {right: '223px', top: '73.5px'},
    size: {width: '220px', height: '220px'},
    rotation: -5,
    collarposition: {right: '223px', top: '73.5px'},
  
}
