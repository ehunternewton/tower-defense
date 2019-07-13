function setup() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  // canvasWidth = 845;
  // canvasHeight = 543;
  createCanvas(canvasWidth, canvasHeight);
  background(51);
  size = 20;
  playArea = new PlayArea(20);
  playArea.createMap(size);
  playArea.mapTiles[floor(random(playArea.mapTiles.length))].start = true;
  // playArea.createWalkMap();
  createDistanceMap(playArea);
  
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

function createDistanceMap(playArea) {
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
  // let n = base.neighbors;
  // console.log(n[0]);
  let frontier = [];
  frontier.push(base);
  while (frontier.length != 0) {
    let current = frontier.shift();
    let nextTile = null;
    for (let i = 0; i < current.neighbors; i++) {
      let possibleNext = current.neighbors[i];
      for (let i = 0; i < playArea.mapTiles.length; i++) {
        if (playArea.mapTiles[i].cubeX === possibleNext.cubeX && playArea.mapTiles[i].cubeY === possibleNext.cubeY 
          && playArea.mapTiles[i].cubeZ === possibleNext.cubeZ) {
            nextTile = playArea.mapTiles[i];
            console.log('this happened');
          }
      }
      if (!current.neighbors.includes(possibleNext)) {
        frontier.push(nextTile);
        nextTile.value = current.value + 1;
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
  createDistanceMap(playArea);
}
