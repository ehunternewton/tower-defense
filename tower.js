class Tower {
    constructor(mapTile) {
        this.mapTile = mapTile;
        this.x = this.mapTile.x;
        this.y = this.mapTile.y;
    }
    show() {
        fill(0,0,255);
        ellipse(this.x , this.y, 20, 20);
    }
}