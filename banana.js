class Banana {
    constructor(x, y, e, damage) {
        this.x = x;
        this.y = y;
        this.target = e;
        this.rotationAngle = 0;
        this.speed = 12;
        this.damage = damage;
        this.dead = false;
    }

    update() {
        let dir = createVector(this.target.x - this.x, this.target.y - this.y);
        dir.normalize();
        this.x += dir.x * this.speed;
        this.y += dir.y * this.speed; 
        this.rotationAngle += PI/12;
        if((abs(this.x - this.target.x) <= this.speed) && (abs(this.y - this.target.y) <= this.speed)) {
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
            let dimW = 6 ;
            let W = bananasprite.width/dimW;
            let x = frameCount  % dimW * W;
            let img = bananasprite.get(0,0,65,75);
            img.resize(35,35)
            // image(img,-30,-35);
            /*rect(-3,0,6,20);
            ellipse(0, 0, 10, 30);
            fill(158, 122, 13);
            ellipse(2,2,2,2);
            ellipse(-2,-3,2,2);
            ellipse(2,-6,2,2);
            ellipse(-2,-6,2,2);
            ellipse(0,9,2,2);*/
        pop();
    }
}