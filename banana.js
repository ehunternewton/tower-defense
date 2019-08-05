class Banana {
    constructor(x, y, e, damage) {
        this.x = x;
        this.y = y;
        this.target = e;
        this.rotationAngle = 0;
        this.speed = 6;
        this.damage = damage;
        this.dead = false;
    }

    update() {
        let dir = createVector(this.target.x - this.x, this.target.y - this.y);
        dir.normalize();
        this.x += dir.x * this.speed;
        this.y += dir.y * this.speed; 
        this.rotationAngle += PI/12;
        if((abs(this.x - this.target.x) <= 3) && (abs(this.y - this.target.y) <= 3)) {
            this.target.dealDamage(this.damage);
            this.dead = true;
        }
    }

    show() {
        fill(242,255,0);
        push();
            stroke(0);
            translate(this.x, this.y);
            rotate(this.rotationAngle);
            let img = bananasprite.get(0,0,65,75);
            img.resize(35,35)
            // image(img,-30,-35);
            ellipse(0, 0, 10, 30);
        pop();
    }
}