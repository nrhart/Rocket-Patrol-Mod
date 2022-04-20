class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/pipe.png');
        //this.birb = this.load.spritesheet('spaceship', './assets/flappybirdy.png', {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 3});
        this.load.image('spaceship', './assets/flappybird.png');
        this.load.image('fastspaceship', './assets/fastflappybird.png');
        this.load.image('starfield', './assets/pixelsky.png');
        this.load.image('header', './assets/bubbleheader.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/PopExplosion.png', {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 9});
        this.load.audio('music', './assets/MSM.mp3');
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 10, 640, 480, 'starfield').setOrigin(0, 0);
        // green UI background
        this.add.tileSprite(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 'header').setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize+10, 0x4287f5).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x4287f5).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x4287f5).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x4287f5).setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2 - 100, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        if(game.player.select){
            this.p2Rocket = new Rocket2(this, game.config.width/2 + 100, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        }

        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        this.ship04 = new FastSpaceship(this, game.config.width + borderUISize*6, borderUISize*3, 'fastspaceship', 0, 40).setOrigin(0,0);
        this.ship04.flipX = true;
        
        // define keys
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

       /* this.anims.create({
            key: 'flap',
            frames: this.anims.generateFrameNumbers('spaceship', { start: 0, end: 3, first: 0}),
            frameRate: 30
        });
        */

        // initialize score
        this.p1Score = 0;
        this.p2Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#f5f242',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        if(game.player.select){
            this.scoreRight = this.add.text(borderUISize*10 + borderPadding*17, borderUISize + borderPadding*2, this.p2Score, scoreConfig);
        }

        //GAME OVER flag
        this.gameOver = false;
        this.halfTimer = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;

        // Display timer
        this.timeInSeconds = game.settings.gameTimer/1000;
        this.timeText = this.add.text(game.config.width/2, game.config.height/6.5, this.timeInSeconds, scoreConfig).setOrigin(0.5);
        this.timer = this.time.addEvent({ delay: 1000, callback: this.updateTimer, callbackScope: this, loop: true });
        
        // speed up text
        this.speeduptext = this.add.text(game.config.width/2, game.config.height/6.5, 'SPEED UP', scoreConfig).setOrigin(0.5);
        this.speeduptext.visible = false;

        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            if(game.player.select){
                if(this.p1Score > this.p2Score){
                    this.add.text(game.config.width/2, game.config.height/2 + 128, 'P1 Wins!', scoreConfig).setOrigin(0.5);
                } else if(this.p1Score < this.p2Score) {
                    this.add.text(game.config.width/2, game.config.height/2 + 128, 'P2 Wins!', scoreConfig).setOrigin(0.5);
                } else{
                    this.add.text(game.config.width/2, game.config.height/2 + 128, 'Draw', scoreConfig).setOrigin(0.5);
                }
            } else{
                this.add.text(game.config.width/2, game.config.height/2 + 128, 'Score:' + this.p1Score, scoreConfig).setOrigin(0.5);
            }
            this.gameOver = true;
        }, null, this);

        // remove timer after delay
        this.clock = this.time.delayedCall(game.settings.gameTimer/2, () => {
            this.speeduptext.visible = true;
            this.halfTimer = true;
            this.time.addEvent({
                delay: 2000,
                callback: ()=>{
                    this.speeduptext.visible = false;
                },
                loop: false
            });
        }, null, this);

        this.sound.play('music');
    }

    updateTimer() {
        //subtract a second
        this.timeInSeconds--;
        this.timeText.setText(this.timeInSeconds);
        if(this.timeInSeconds == 0){
            this.timer.destroy();
        }
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.game.sound.stopAll();
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.game.sound.stopAll();
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 3;  // update tile sprite

        if (!this.gameOver) {
            this.p1Rocket.update();             // update Rocket Sprite
            if(game.player.select){
                this.p2Rocket.update();
            }
            this.ship01.update();               // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
            //birb.anims.play('flap');
        }

        if(this.halfTimer){
            this.ship01.halftime();
            this.ship02.halftime();
            this.ship03.halftime();
        }

        // check collisions P1
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplodeP1(this.ship04);
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplodeP1(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplodeP1(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplodeP1(this.ship01);
        }

        // check collisions P2
        if(game.player.select){
            if (this.checkCollision(this.p2Rocket, this.ship04)) {
                this.p2Rocket.reset();
                this.shipExplodeP1(this.ship04);
            }
            if(this.checkCollision(this.p2Rocket, this.ship03)) {
                this.p2Rocket.reset();
                this.shipExplodeP2(this.ship03);
            }
            if (this.checkCollision(this.p2Rocket, this.ship02)) {
                this.p2Rocket.reset();
                this.shipExplodeP2(this.ship02);
            }
            if (this.checkCollision(this.p2Rocket, this.ship01)) {
                this.p2Rocket.reset();
                this.shipExplodeP2(this.ship01);
            }
        }
      }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (!ship.alpha == 0 && rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplodeP1(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        
        this.sound.play('sfx_explosion')
      }

    shipExplodeP2(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p2Score += ship.points;
        this.scoreRight.text = this.p2Score;
        
        this.sound.play('sfx_explosion')
      }
      
}