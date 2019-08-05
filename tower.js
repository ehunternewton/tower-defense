class Tower {
    constructor(mapTile) {
        this.mapTile = mapTile;
        this.x = this.mapTile.x;
        this.y = this.mapTile.y;
        this.range = 6*size;
        this.cd = 0;
        this.cooldownMin = 60;
        this.cooldownMax = 120;
        this.damageMin = 5;
        this.damageMax = 15;
        this.angle = 0;
    }

    // show() {
    //     fill(0,0,255);  
    //     ellipse(this.x , this.y, 40, 40);
    //     // fill(0);
    //     // rect(0,-2,30,4);
    //     let img = spritesheet.get(0,0,65,75);
    //     image(img,this.x-30,this.y-35);
    //     this.follow = true;
    // }

    show() {
        push();
            translate(this.x, this.y);
            rotate(this.angle);
            fill(0,0,255);  
            // ellipse(0, 0, 40, 40);
            // rect(0,-3,30,3);
            let img = spritesheet.get(0,0,65,75);
            image(img,-30,-35);
        pop();
    }

    aim(x, y) {
        this.angle = atan2(y - this.y, x - this.x);
    }

    attack(e) {
        var damage = round(random(this.damageMin, this.damageMax));
        // e.dealDamage(damage);
        let b = new Banana(this.x, this.y, e, damage);
        // console.log(b);
        bananas.push(b);
    }

    onAim(e) {
        this.aim(e.x, e.y);
        // if (stopFiring) return;
        if (!this.canFire()) return;
        this.resetCooldown();
        this.attack(e);
        this.throwBanana(e);
        // Draw line to target
        // if (!this.drawLine) return;
        // stroke(200,200,0);
        // strokeWeight(3);
        // line(this.x, this.y, e.x, e.y);
        // strokeWeight(1);
        // stroke(244);    
    }

    throwBanana(e) {
        let dir = createVector(this.x, this.y, e.x, e.y);
        // stroke(0);
        // strokeWeight(10);
        // line(this.x, this.y, dir.x, dir.y);
    }

    target(entities) {
        entities = this.visible(entities);
        if (entities.length === 0) return;
        var e = entities[0];
        this.onAim(e);
    }

    visible(entities) {
        return getInRange(this.x, this.y, this.range, entities);
    }


    update() {
        if (this.cd > 0) this.cd--;
    }

    canFire() {
        return this.cd === 0;
    }

    resetCooldown() {
        var cooldown = round(random(this.cooldownMin, this.cooldownMax));
        this.cd = cooldown;
    }
}

function getInRange(cx, cy, radius, entities) {
    var results = [];
    for (var i = 0; i < entities.length; i++) {
        var e = entities[i];
        if (insideCircle(e.x, e.y, cx, cy, (radius + 1))) {
            results.push(e);
        }
    }
    return results;
}

function insideCircle(x, y, cx, cy, r) {
    return sq(x - cx) + sq(y - cy) < sq(r);
}
