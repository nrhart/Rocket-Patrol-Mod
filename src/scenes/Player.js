class Player extends Phaser.Scene {
    constructor() {
        super("playerScene");
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
            fontFamily: 'Copperplate',
            fontSize: '22px',
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
        
        this.add.text(game.config.width/2, game.config.height/2, 'Press (1) for one Player or (2) for two players', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#7fad71';
        menuConfig.color = '#000';
        menuConfig.padding.top = 25;
        menuConfig.fontSize = '25.5px';
        menuConfig.fontFamily = 'Courier';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize*5 + borderPadding*5, '                                          ', menuConfig).setOrigin(0.5);

   
        // define keys
        keyONE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        keyTWO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    }
  
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyONE)){
            game.player = {
                select: false
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene'); 
        }
        if (Phaser.Input.Keyboard.JustDown(keyTWO)){
            game.player = {
                select: true
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene'); 
        }
        
    }

  }