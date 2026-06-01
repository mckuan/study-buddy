//eat

const eat = {
    intro: (body, color) => [],
    frames: (body, color) => [
        `./assets/${body}/${color}/eat/f1.png`,
        `./assets/${body}/${color}/eat/f2.png`,
    ],
    outro: (body,color) => [],

    fps: 200,
    //10-15min 
    minTime: 600000,
    maxTime: 900000,
    position: {left: '230px', top: '111px'},
    size: {width: '224px', height: '220px'},
    collarposition: {left: '335px', top: '200px'},
    collarsize: {width: '20px', height: '10px'},
}
 
 