class RandomWalker {
    constructor(mapTile, mapTiles, health) {
      this.tile = mapTile;
      this.mapTiles = mapTiles;
      this.x = mapTile.x;
      this.y = mapTile.y;
      this.dead = false;
      this.reachedGoal = false;
      this.health = health;
    }

    getLowestNeighbors() {
      let neighbors = this.getNeighbors();
      let lowValue = 1000000;
      let lowestNeigbors = [];
      for (let i = 0; i < neighbors.length; i++){
        if (neighbors[i].value < lowValue) {
          lowValue = neighbors[i].value;
        }
      }
      for (let i = 0; i < neighbors.length; i++){
        if (neighbors[i].value === lowValue) {
          lowestNeigbors.push(neighbors[i]);
        }
      }
      return lowestNeigbors;
    }


    dealDamage(amt) {
      if (this.health > 0) this.health -= amt;
      // if (this.health <= 0) this.dead = true;
  }
  
    getNeighbors() {
      let neighbors = [];
      let cube_directions = [
        [1, -1, 0], [1, 0, -1], [0, 1, -1],
        [-1, 1, 0], [-1, 0, 1], [0, -1, 1]
      ];
      for (let i = 0; i < 6; i++) {
        let direction = cube_directions[i];
        let nextLocation = [this.tile.cubeX + direction[0], this.tile.cubeY + direction[1], this.tile.cubeZ + direction[2]];
        for (let i = 0; i < this.mapTiles.length; i++) {
          if (this.mapTiles[i].cubeX === nextLocation[0] && this.mapTiles[i].cubeY === nextLocation[1] && this.mapTiles[i].cubeZ === nextLocation[2]) {
            if (this.mapTiles[i].reachable) {
              neighbors.push(this.mapTiles[i]);
            }
          }
        }
      }
      return neighbors;
    }
  
    getRandomNeighbor() {
      let cube_directions = [
        [1, -1, 0], [1, 0, -1], [0, 1, -1],
        [-1, 1, 0], [-1, 0, 1], [0, -1, 1]
      ];
      let direction = cube_directions[floor(random(cube_directions.length))];
      let nextLocation = [this.tile.cubeX + direction[0], this.tile.cubeY + direction[1], this.tile.cubeZ + direction[2]]
      for (let i = 0; i < this.mapTiles.length; i++) {
        if (this.mapTiles[i].cubeX === nextLocation[0] && this.mapTiles[i].cubeY === nextLocation[1] && this.mapTiles[i].cubeZ === nextLocation[2]) {
          if (this.mapTiles[i].reachable) {
            return this.mapTiles[i];
          }
        }
      }
      return this.tile;
    }
  
    move() {
      let speed = 1;
      if (this.tile.start == true && abs(this.x - this.tile.x) <= speed && abs(this.y - this.tile.y) <= speed) {
        this.reachedGoal = true;
      } 
      if (this.health <= 0) {
        this.dead = true;
      }
      let dir = createVector(this.tile.x - this.x, this.tile.y - this.y).normalize();
      if (abs(this.x - this.tile.x) <= speed && abs(this.y - this.tile.y) <= speed){
        // let next = this.getLowestNeighbor();
        let neighbors = this.getLowestNeighbors();
        let next = neighbors[floor(random(neighbors.length))];
        this.tile = next;
      } else {
        this.x += dir.x * speed;
        this.y += dir.y * speed;
      }
    }
  
    show() {
      //stroke(51);
      //fill(244);
      //ellipse(this.x, this.y, 32, 32);
      let dimW = 6 ;
      let dimH = 4 ;
      frameRate(30);
      let W = babysprite.width/dimW;
      let H = babysprite.height/dimH;
      let x = frameCount % dimW * W;
      let img = babysprite.get(x,0,30,30);
      img.resize(64,64);
      image(img, this.x - 32, this.y - 32);
      fill(255,0,0);
      textSize(10);
      textAlign(CENTER);
      text(this.health,this.x,this.y);
    }
  
  }
