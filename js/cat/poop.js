// idle.js

const poop = {
    intro: (body, color) =>[],
    frames: (body, color) =>[
        
        `./assets/${body}/${color}/poop/f1.png`,
        `./assets/${body}/${color}/poop/f2.png`,
        
    ],
    outro: (body, color) =>[],

    fps: 180,
    //3-5min
    minTime: 180000,
    maxTime: 300000,
    position: {left: '270px', top: '110px'},
    size: {width: '150px', height: '150px'},
    rotation: 5,
    collarposition: {left: '340px', top: '163px'},
    collarsize: {width: '20px', height: '10px'},

}
 
 