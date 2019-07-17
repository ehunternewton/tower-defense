let count = 0;
let delay = 150;
let towers = [];
const size = 40;
playArea = new PlayArea(size/2);
let walkers = [];

function setup() {
  canvasWidth = 1280;
  canvasHeight = 720;
  let cnv = createCanvas(canvasWidth, canvasHeight);
  cnv.parent('sketch-holder');
  background(51);
  playArea.createMap(size);
  let start = playArea.mapTiles[170];
  start.start = true;
  let spawnPoint = playArea.mapTiles[16]
  spawnPoint.spawnPoint = true;
  playArea.createWalkMap();
  // playArea.mapTiles = playArea.createWalkMap();
  
  // walkers = [];
  for (let i = 0; i < 1; i++) {
    walker = new RandomWalker(spawnPoint, playArea.mapTiles);
    walkers.push(walker);
  }
}



function draw() {
  count++;
  if (count % delay == 0){
    let walker = new RandomWalker(playArea.mapTiles[16], playArea.mapTiles);
    walkers.push(walker);
  }
  
  playArea.mouseOver();
  playArea.show();
  for (let i = 0; i < towers.length; i++) {
    // TODO:
    towers[i].target(walkers);
    towers[i].update();
    towers[i].show()
  }
  for (let i = 0; i < walkers.length; i++) {
    if (walkers[i].dead == true) {
      walkers.splice(i, 1);
    }
    if (walkers.length > 0) {
      walkers[i].move();
      walkers[i].show();
    }
  }
}

function mouseClicked() {
  let tile = getTile(mouseX, mouseY);
  if (tile.highlight == false){
    tile.highlight = true;
    tile.reachable = false;
  } else if (tile.highlight == true) {
    tile.highlight = false;
    tile.reachable = true;
  }
  if (!tile.hasTower) {
    tower = new Tower(tile);
    towers.push(tower);
    tile.hasTower = true;
  } else {
    for (let i = 0; i < towers.length; i++) {
      if (towers[i].mapTile == tile) {
        towers.splice(i, 1);
        tile.hasTower = false;
      }
    }
  }
  playArea.createWalkMap();
  for (let i = 0; i < walkers.length; i++) {
    if (walkers[i].tile.value === null || playArea.mapTiles[16].value === null || tile.value === 0) {
      towers.pop();
      tile.hasTower = false;
      tile.highlight = false;
      tile.reachable = true;
      playArea.createWalkMap();
      break;
    }
  }
}

function getTile(x, y) {
  for (let i = 0; i < playArea.mapTiles.length; i++) {
    let tile = playArea.mapTiles[i];
    let d = dist(x, y, tile.x, tile.y);
    if (d < playArea.size*sqrt(3)) {
      return tile;
    }
  }
}