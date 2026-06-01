// idle.js
const idle = {
    intro: (body, color) =>[],
    frames: (body, color) => [
        `./assets/${body}/${color}/idle/f1.png`,
        `./assets/${body}/${color}/idle/f2.png`,
        `./assets/${body}/${color}/idle/f3.png`,
        `./assets/${body}/${color}/idle/f4.png`,
        `./assets/${body}/${color}/idle/f5.png`,
        `./assets/${body}/${color}/idle/f6.png`,
        `./assets/${body}/${color}/idle/f7.png`,
        `./assets/${body}/${color}/idle/f8.png`,
        `./assets/${body}/${color}/idle/f9.png`,
    ],
    outro: (body, color) =>[],

    fps: 180,
    //10-15min
    minTime: 600000,
    maxTime: 900000,
    position: {left: '170px', bottom: '65px'},
    size: {width: '150px', height: '150px'},
    collarposition: {left: '238px', top: '85px'},
    collarsize: {width: '13px', height: '10px'},
}
 

 