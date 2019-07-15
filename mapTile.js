
class MapTile {
    constructor(x, y, size, tileX, tileY) {
      this.mapTiles = null;
      this.value = null;
      this.x = x;
      this.y = y;
      this.gridPos = [tileX, tileY];
      this.w = sqrt(3) * size;
      this.h = 2 * size;
      this.start = false;
      this.spawnPoint = false;
      this.highlight = false;
      this.hover = false;
      this.reachable = false;
    }
  
    get cubeX() {
      return this.gridPos[0] - (this.gridPos[1] + this.gridPos[1]%2) / 2;
    }
  
    get cubeZ() {
      return this.gridPos[1];
    }
  
    get cubeY() {
      return -this.cubeX - this.cubeZ;
    }
  
    get neighbors() {
      let neighbors = [];
      let cube_directions = [
        [1, -1, 0], [1, 0, -1], [0, 1, -1],
        [-1, 1, 0], [-1, 0, 1], [0, -1, 1]
      ];
      for (let i = 0; i < 6; i++) {
        let direction = cube_directions[i];
        let nextLocation = [this.cubeX + direction[0], this.cubeY + direction[1], this.cubeZ + direction[2]];
        for (let i = 0; i < this.mapTiles.length; i++) {
          if (this.mapTiles[i].cubeX === nextLocation[0] && this.mapTiles[i].cubeY === nextLocation[1] && this.mapTiles[i].cubeZ === nextLocation[2]) {
            if (this.mapTiles[i].reachable) {
              neighbors.push(this.mapTiles[i]);
            }
          }
        }
      }
      // console.log(neighbors);
      return neighbors;
    }
  
    show() {
      stroke(255);
      strokeWeight(2);
      if (this.start) {
        fill(0,255, 0);
      } else if (this.spawnPoint) {
        fill(255,0,0);
      }
      else if (this.highlight) {
        fill(51,204,153);
      } else if(this.hover) {
        fill(153);
      }else {
        fill(204);
      }
      drawMapTile(this.x, this.y, this.w, this.h, this.value, this.gridPos[0], this.gridPos[1], this.cubeX, this.cubeY, this.cubeZ);
    }
  }
  
  function drawMapTile(x, y, w, h, value, gridX, gridY, cubeX, cubeY, cubeZ) {
    push();
        translate(x, y);
        beginShape();
        vertex(0, -h / 2);
        vertex(w / 2, -h / 4);
        vertex(w / 2, h / 4);
        vertex(0 , h / 2);
        vertex(-w / 2, h / 4);
        vertex(-w / 2, -h / 4);
        endShape(CLOSE);
          textSize(10);
          textAlign(CENTER);
          fill(51);
          // text(value, 0,0);
          //text(gridX + ", " + gridY, -15, 0);
          // text(cubeX + "   " + cubeZ + "\n" + cubeY, 0, 0);
        pop();
  }