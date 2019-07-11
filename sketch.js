function setup() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  createCanvas(canvasWidth, canvasHeight);
  background(51);
  size = 20;
  playArea = new PlayArea(20);
  playArea.createMap(size);
  playArea.mapTiles[floor(random(playArea.mapTiles.length))].start = true;
  playArea.createWalkMap();
  
  walkers = [];
  for (let i = 0; i < 100; i++) {
    walker = new RandomWalker(playArea.mapTiles[floor(random(playArea.mapTiles.length))], playArea.mapTiles);
    // walker = new RandomWalker(playArea.mapTiles[floor(playArea.mapTiles.length/2)], playArea.mapTiles);
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
      let nextLocation = [this.tile.cubeX + direction[0], this.tile.cubeY + direction[1], this.tile.cubeZ + direction[2]]
      let nextLocationTile = [this.tile.cubeX + direction[0], this.tile.cubeY + direction[1], this.tile.cubeZ + direction[2]];
      //console.log(nextLocationTile);
      neighbors[i] = (nextLocationTile);
    }
    //console.log(neighbors);
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
    let speed = 3;
    let dir = createVector(this.tile.x - this.x, this.tile.y - this.y).normalize();
    if (abs(this.x - this.tile.x) <= speed && abs(this.y - this.tile.y) <= speed){
      let next = this.getLowestNeighbor();
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


class MapTile {
  constructor(x, y, size, tileX, tileY) {
    this.value = 0;
    this.x = x;
    this.y = y;
    this.gridPos = [tileX, tileY];
    this.w = sqrt(3) * size;
    this.h = 2 * size;
    this.start = false;
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
    drawMapTile(this.x, this.y, this.w, this.h, this.value, this.gridPos[0], this.gridPos[1]);
  }
}

function drawMapTile(x, y, w, h, value, gridX, gridY) {
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
        text(gridX + ", " + gridY, -15, 0);
        // text(this.cubeX + "   " + this.cubeZ + "\n" + this.cubeY, 0, 0);
	  pop();
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

      createWalkMap() {
        for (let i = 0; i < playArea.mapTiles.length; i++) {
          playArea.mapTiles[i].value = i;
        }
        let base = playArea.mapTiles[0];
       
        for (let i = 0; i < playArea.mapTiles.length; i++) {
          if (playArea.mapTiles[i].start == true) {
            base = playArea.mapTiles[i];
          }
        }
        //console.log(base);
        base.value = 0;
        let n = base.getNeighbors;

        console.log(n);
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
