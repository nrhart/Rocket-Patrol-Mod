// Spaceship Prefab
class FastFlappyBird extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing scene
        this.points = pointValue;   // store pointValue
        this.moveSpeed = game.settings.fastbirdSpeed;        // pixels per frame
    }

    update() {
        // move spaceship left
        this.x += this.moveSpeed;
        // wrap around from left edge to right edge
        if(this.x <= 0 - this.width) {
            this.reset();
        }
        if(this.x > game.config.width){
            this.x = 0 - this.width;
        }
    }

    // poistion reset
    reset() {
        this.x = game.config.width;
    }
}