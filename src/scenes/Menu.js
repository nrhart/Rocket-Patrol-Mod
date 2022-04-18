class Menu extends Phaser.Scene {
  constructor() {
      super("menuScene");
  }

  preload() {
      // load audio
      this.load.audio('sfx_select', './assets/point.mp3');
      this.load.audio('sfx_explosion', './assets/hit.mp3');
      this.load.audio('sfx_rocket', './assets/swoosh.mp3');
      this.load.image('starfield', './assets/pixelsky.png');
    }
    

  create() {
      this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
      // menu text configuration
      let menuConfig = {
          fontFamily: 'Courier',
          fontSize: '24px',
          backgroundColor: '#f5f242',
          color: '#843605',
          align: 'right',
          padding: {
              top: 5,
              bottom: 5,
          },
          fixedWidth: 0
      }
      

      // show menu text
      this.add.text(game.config.width/2, game.config.height/4 - borderUISize - borderPadding, 'FLAPPYBIRD: REVENGE OF THE PIPES', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2, 'P1 uses A & D to move and (W) to fire', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'P2 uses ←→ arrows to move and (↑) to fire', menuConfig).setOrigin(0.5);
      menuConfig.backgroundColor = '#7fad71';
      menuConfig.color = '#000';
      menuConfig.padding.top = 25;
      menuConfig.fontSize = '25.5px';
      
      this.add.text(game.config.width/2, game.config.height/2 + borderUISize*5 + borderPadding*5, 'Press ← / A for Novice or → / D for Expert', menuConfig).setOrigin(0.5);
 
      // define keys
      keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
      keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
      keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(keyLEFT) || Phaser.Input.Keyboard.JustDown(keyA) ) {
        // Novice mode
        game.settings = {
          spaceshipSpeed: 3,
          halftimeSpeed: 4, 
          gameTimer: 60000
        }
        this.sound.play('sfx_select');
        this.scene.start('playerScene');    
      }
      if (Phaser.Input.Keyboard.JustDown(keyRIGHT) || Phaser.Input.Keyboard.JustDown(keyD)) {
        // Expert mode
        game.settings = {
          spaceshipSpeed: 4,
          halftimeSpeed: 5,
          gameTimer: 45000,  
        }
        this.sound.play('sfx_select');
        this.scene.start('playerScene');    
      }
    }
}