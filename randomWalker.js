class RandomWalker {
    constructor(mapTile, mapTiles) {
      this.tile = mapTile;
      this.mapTiles = mapTiles;
      this.x = mapTile.x;
      this.y = mapTile.y;
    }
  
    getLowestNeighbor() {
      let cube_directions = [
        [1, -1, 0], [1, 0, -1], [0, 1, -1],
        [-1, 1, 0], [-1, 0, 1], [0, -1, 1]
      ];
      let nextTile = this.getRandomNeighbor();
  
      for (let i = 0; i < cube_directions.length; i++) {
        let direction = cube_directions[i];
        let nextLocation = [this.tile.cubeX + direction[0], this.tile.cubeY + direction[1], this.tile.cubeZ + direction[2]]
        let possibleNextTile = [this.tile.cubeX + direction[0], this.tile.cubeY + direction[1], this.tile.cubeZ + direction[2]];
        for (let i = 0; i < this.mapTiles.length; i++) {
          if (this.mapTiles[i].cubeX === nextLocation[0] && this.mapTiles[i].cubeY === nextLocation[1] && this.mapTiles[i].cubeZ === nextLocation[2]) {
            if (this.mapTiles[i].reachable) {
              let possibleNextTile =  this.mapTiles[i];
              
              if (possibleNextTile.value < nextTile.value) {
                nextTile = possibleNextTile;
              }
            }
          }
        }
      }
      if (nextTile.reachable) {
        return nextTile;
      } else {
        return this.tile;
      }
    }
  
    getNeighbors() {
      let neighbors = [];
      let cube_directions = [
        [1, -1, 0], [1, 0, -1], [0, 1, -1],
        [-1, 1, 0], [-1, 0, 1], [0, -1, 1]
      ];
      for (let i = 0; i < 6; i++) {
        console.log(i);
        let direction = cube_directions[i];
        let nextLocation = [this.tile.cubeX + direction[0], this.tile.cubeY + direction[1], this.tile.cubeZ + direction[2]];
        for (let i = 0; i < this.mapTiles.length; i++) {
          if (this.mapTiles[i].cubeX === nextLocation[0] && this.mapTiles[i].cubeY === nextLocation[1] && this.mapTiles[i].cubeZ === nextLocation[2]) {
            if (this.mapTiles[i].reachable) {
              neighbors.push(this.mapTiles[i]);
            }
          }
        }
        //console.log(nextLocationTile);
      }
      console.log(neighbors);
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
      let dir = createVector(this.tile.x - this.x, this.tile.y - this.y).normalize();
      if (abs(this.x - this.tile.x) <= speed && abs(this.y - this.tile.y) <= speed){
        let next = this.getLowestNeighbor();
        //console.log(next);
        this.tile = next;
        //let dir = createVector(this.tile.x - this.x, this.tile.y - this.y);
        //console.log('this happened');
      } else {
        this.x += dir.x * speed;
        this.y += dir.y * speed;
        //console.log('this also happened');
      }
    }
  
    show() {
      stroke(51);
      fill(255);
      ellipse(this.x, this.y, 16, 16);
    }
  
  }