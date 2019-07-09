function setup() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  createCanvas(canvasWidth, canvasHeight);
  background(51);
  size = 20;
  playArea = new PlayArea(20);
  playArea.createMap(size);
  playArea.mapTiles[floor(random(playArea.mapTiles.length))].start = true;
  walkers = [];
  for (let i = 0; i < 1; i++) {
    walker = new RandomWalker(playArea.mapTiles[floor(random(playArea.mapTiles.length))], playArea.mapTiles);
    walkers.push(walker);
  }
  // walker = new RandomWalker(playArea.mapTiles[10], playArea.mapTiles);
}

function draw() {
    playArea.mouseOver();
    playArea.show();
    for (let i = 0; i < walkers.length; i++) {
      walkers[i].move();
      walkers[i].show();
    }
}

class RandomWalker {
  constructor(mapTile, mapTiles) {
    this.tile = mapTile;
    this.mapTiles = mapTiles;
    this.x = mapTile.x;
    this.y = mapTile.y;
  }

  getRandomNeighbor() {
    let cube_directions = [
      [1, -1, 0], [1, 0, -1], [0, 1, -1], 
      [-1, 1, 0], [-1, 0, 1], [0, -1, 1]
    ]
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
    let dir = createVector(this.tile.x - this.x, this.tile.y - this.y).normalize();
    if (abs(this.x - this.tile.x) <= 1 && abs(this.y - this.tile.y) <= 1){
      let next = this.getRandomNeighbor();
      this.tile = next;
      //let dir = createVector(this.tile.x - this.x, this.tile.y - this.y);
      console.log('this happened');
    } else {
      this.x += dir.x;
      this.y += dir.y;
      console.log('this also happened');
    }
  }

  show() {
    stroke(51);
    fill(255);
    ellipse(this.x, this.y, 16, 16);
  }
  
}


class MapTile {
  constructor(x, y, size, tileX, tileY) {
    this.x = x;
    this.y = y;
    this.gridPos = [tileX, tileY];
    this.w = sqrt(3) * size;
    this.h = 2 * size;
    this.defend = false;
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
  
  show() {
    stroke(255);
    strokeWeight(2);
    if (this.start) {
      fill(0,255, 0);
    } else if (this.highlight) {
      fill(51,204,153);
    } else if(this.hover) {
      fill(153);
    }else {
      fill(204);
    }
    push();
      translate(this.x, this.y);
      beginShape();
      vertex(0, -this.h / 2);
      vertex(this.w / 2, -this.h / 4);
      vertex(this.w / 2, this.h / 4);
      vertex(0 , this.h / 2);
      vertex(-this.w / 2, this.h / 4);
      vertex(-this.w / 2, -this.h / 4);
      endShape(CLOSE);
        // textSize(10);
        // textAlign(CENTER);
        // fill(51);
        // text(this.gridPos[0] + ", " + this.gridPos[1], -15, 0);
        // text(this.cubeX + "   " + this.cubeZ + "\n" + this.cubeY, 0, 0);
	  pop();
  }
}

class PlayArea {
    constructor(size) {
        this.size = size;
        this.mapTiles = [];
    }

    createMap(size) {
        let w = sqrt(3) * size;
        let h = 2 * size;
        let tilesWide = canvasWidth / size;
        let tilesHigh = canvasHeight / size;
        for (let j = 0; j < tilesHigh; j++) {
          for (let i = 0; i < tilesWide; i++) {
            let centerX = i * w;
            let centerY = j * 3 * h / 4;
            if (centerX - w >= 0 && centerX + w < canvasWidth && 
                centerY - h / 2 >= 0 && centerY + h/2 < canvasHeight) {
              if(j % 2 == 0) {
                let mt = new MapTile(centerX + w / 2, centerY, size, i, j);
                mt.reachable = true;
                this.mapTiles.push(mt);
              } else {
                let mt = new MapTile(centerX, centerY, size, i, j);
                mt.reachable = true;
                this.mapTiles.push(mt);
              }
            }
            
          }
        }
      }

      show() {
      for (let i = 0; i < this.mapTiles.length; i++) {
        this.mapTiles[i].show();
      }
    } 

    mouseOver() {
        for (let i = 0; i < this.mapTiles.length; i++) {
            let radius = this.size*sqrt(3)/2 - 2;
            if (
                mouseX >= this.mapTiles[i].x - radius &&
                mouseX <= this.mapTiles[i].x + radius &&
                mouseY >= this.mapTiles[i].y - radius &&
                mouseY <= this.mapTiles[i].y + radius
            ) {
                this.mapTiles[i].hover = true;
            } else {
                this.mapTiles[i].hover = false;
            }
        }
    }

}

function mouseClicked() {
  // Check if mouse is inside a circle
  for (let i = 0; i < playArea.mapTiles.length; i++) {
    let tile = playArea.mapTiles[i];
    let d = dist(mouseX, mouseY, tile.x, tile.y);
    if (d < tile.w/2) {
      if (tile.highlight == false){
        tile.highlight = true;
        tile.reachable = false;
      } else if (tile.highlight == true) {
        tile.highlight = false;
        tile.reachable = true;
      }
      // console.log("grid coordinates: (" + tile.gridPos[0] + ", " + tile.gridPos[1] + ")" + "\n" + 
      // 'cube coordinates: (' + tile.cubeX + ', ' + tile.cubeY + ', ' + tile.cubeZ + ')');
    }
  }
}
