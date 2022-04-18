let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Player, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars, P2 Keys
let keyUP, keyR, keyONE, keyTWO, keyLEFT, keyRIGHT;

// P1 Keys
let keyW, keyA, keyD;


//Points Breakdown
//Speed up effect after half time (5)
//Display Game Timer (10)
//Selectable Two Player Mode (30)
//Theme, Sound, Art, UI Changes (60)