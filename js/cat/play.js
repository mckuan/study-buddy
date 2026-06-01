//play

const play = {
    intro: (body, color) =>[
    ],
    frames: (body, color) => [
        `./assets/${body}/${color}/play/f1.png`,
        `./assets/${body}/${color}/play/f2.png`,
        `./assets/${body}/${color}/play/f3.png`,
        `./assets/${body}/${color}/play/f4.png`,
        `./assets/${body}/${color}/play/f5.png`,
        `./assets/${body}/${color}/play/f6.png`,
        `./assets/${body}/${color}/play/f7.png`,
        `./assets/${body}/${color}/play/f8.png`,
        `./assets/${body}/${color}/play/f9.png`,
        `./assets/${body}/${color}/play/f10.png`,
        `./assets/${body}/${color}/play/f11.png`,
        `./assets/${body}/${color}/play/f12.png`,
        `./assets/${body}/${color}/play/f13.png`,
    ],
    outro: (body, color) =>[
        
    ],
    
    fps: 130,
    //5-15min
    minTime: 300000,
    maxTime: 900000,
    position: {left: '90px', top: '110px'},
    size: {width: '220px', height: '220px'},
    collarposition: {left: '200px', top: '200px'},
    collarsize: {width: '20px', height: '10px'},
    
}