class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('pipe', './assets/pipe.png');
        this.load.image('landscape', './assets/pixelsky.png');
        this.load.image('bubbleheader', './assets/bubbleheader.png');
        
        // load spritesheet
        this.load.spritesheet('explosion', './assets/PopExplosion.png', {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 9});
        this.load.spritesheet('flappybird', './assets/flappybird.png', {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 2});
        this.load.spritesheet('fastflappybird', './assets/fastflappybird.png', {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 2});

        // load background audio
        this.load.audio('sfx_backgroundmusic', './assets/MSM.mp3');
    }

    create() {
        // place tile sprite
        this.landscape = this.add.tileSprite(0, 10, 640, 480, 'landscape').setOrigin(0, 0);
        // green UI background
        this.add.tileSprite(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 'bubbleheader').setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize+10, 0x4287f5).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x4287f5).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x4287f5).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x4287f5).setOrigin(0, 0);

        // add pipe (p1)
        this.p1Pipe = new Pipe(this, game.config.width/2 - 100, game.config.height - borderUISize - borderPadding, 'pipe').setOrigin(0.5, 0);
        if(game.player.select){
            this.p2Pipe = new Pipe2(this, game.config.width/2 + 100, game.config.height - borderUISize - borderPadding, 'pipe').setOrigin(0.5, 0);
        }

        // add spacebirds (x3)
        this.bird01 = new FlappyBird(this, game.config.width + borderUISize*6, borderUISize*4, 'flappybird', 0, 30).setOrigin(0, 0);
        this.bird02 = new FlappyBird(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'flappybird', 0, 20).setOrigin(0,0);
        this.bird03 = new FlappyBird(this, game.config.width, borderUISize*6 + borderPadding*4, 'flappybird', 0, 10).setOrigin(0,0);
        this.bird04 = new FastFlappyBird(this, game.config.width + borderUISize*6, borderUISize*3, 'fastfalppybird', 0, 40).setOrigin(0,0);
        this.bird04.flipX = true;
        
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

       this.anims.create({
            key: 'flap',
            frames: this.anims.generateFrameNumbers('flappybird', { start: 0, end: 2, first: 0}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'fastflap',
            frames: this.anims.generateFrameNumbers('fastflappybird', { start: 0, end: 2, first: 0}),
            frameRate: 10,
            repeat: -1
        });

        this.bird01.anims.play('flap');
        this.bird02.anims.play('flap');
        this.bird03.anims.play('flap');
        this.bird04.anims.play('fastflap');
        

        // initialize score
        this.p1Score = 0;
        this.p2Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Optima',
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
                this.add.text(game.config.width/2, game.config.height/2 + 128, 'Score: ' + this.p1Score, scoreConfig).setOrigin(0.5);
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

        this.sound.play('sfx_backgroundmusic');
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

        this.landscape.tilePositionX -= 3;  // update tile sprite

        if (!this.gameOver) {
            this.p1Pipe.update();             // update Pipe Sprite
            if(game.player.select){
                this.p2Pipe.update();
            }
            this.bird01.update();               // update spacebirds (x3)
            this.bird02.update();
            this.bird03.update();
            this.bird04.update();
        }

        if(this.halfTimer){
            this.bird01.halftime();
            this.bird02.halftime();
            this.bird03.halftime();
        }

        // check collisions P1
        if (this.checkCollision(this.p1Pipe, this.bird04)) {
            this.p1Pipe.reset();
            this.birdExplodeP1(this.bird04);
        }
        if(this.checkCollision(this.p1Pipe, this.bird03)) {
            this.p1Pipe.reset();
            this.birdExplodeP1(this.bird03);
        }
        if (this.checkCollision(this.p1Pipe, this.bird02)) {
            this.p1Pipe.reset();
            this.birdExplodeP1(this.bird02);
        }
        if (this.checkCollision(this.p1Pipe, this.bird01)) {
            this.p1Pipe.reset();
            this.birdExplodeP1(this.bird01);
        }

        // check collisions P2
        if(game.player.select){
            if (this.checkCollision(this.p2Pipe, this.bird04)) {
                this.p2Pipe.reset();
                this.birdExplodeP1(this.bird04);
            }
            if(this.checkCollision(this.p2Pipe, this.bird03)) {
                this.p2Pipe.reset();
                this.birdExplodeP2(this.bird03);
            }
            if (this.checkCollision(this.p2Pipe, this.bird02)) {
                this.p2Pipe.reset();
                this.birdExplodeP2(this.bird02);
            }
            if (this.checkCollision(this.p2Pipe, this.bird01)) {
                this.p2Pipe.reset();
                this.birdExplodeP2(this.bird01);
            }
        }
      }

    checkCollision(pipe, bird) {
        // simple AABB checking
        if (!bird.alpha == 0 && pipe.x < bird.x + bird.width && 
            pipe.x + pipe.width > bird.x && 
            pipe.y < bird.y + bird.height &&
            pipe.height + pipe.y > bird. y) {
                return true;
        } else {
            return false;
        }
    }

    birdExplodeP1(bird) {
        // temporarily hide bird
        bird.alpha = 0;
        // create explosion sprite at bird's position
        let boom = this.add.sprite(bird.x, bird.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          bird.reset();                         // reset bird position
          bird.alpha = 1;                       // make bird visible again
          boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += bird.points;
        this.scoreLeft.text = this.p1Score;
        
        this.sound.play('sfx_explosion')
      }

    birdExplodeP2(bird) {
        // temporarily hide bird
        bird.alpha = 0;
        // create explosion sprite at bird's position
        let boom = this.add.sprite(bird.x, bird.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          bird.reset();
          bird.alpha = 1;                       // make bird visible again
          boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p2Score += bird.points;
        this.scoreRight.text = this.p2Score;
        
        this.sound.play('sfx_explosion')
      }
      
}