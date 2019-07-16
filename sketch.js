function setup() {
  // canvasWidth = window.innerWidth;
  // canvasHeight = window.innerHeight;
  canvasWidth = 1280;
  canvasHeight = 720;
  // canvasWidth = 845;
  // canvasHeight = 543;
  let cnv = createCanvas(canvasWidth, canvasHeight);
  cnv.parent('sketch-holder');
  // cnv.style('display', 'block');
  background(51);
  const size = 40;
  playArea = new PlayArea(20);
  playArea.createMap(size);
  // let start = playArea.mapTiles[floor(random(playArea.mapTiles.length))];
  // let start = playArea.mapTiles[346];
  let start = playArea.mapTiles[170];
  start.start = true;
  // let spawnPoint = playArea.mapTiles[floor(random(playArea.mapTiles.length))];
  let spawnPoint = playArea.mapTiles[16]
  spawnPoint.spawnPoint = true;
  playArea.createWalkMap();
  //createDistanceMap(playArea);
  
  walkers = [];
  for (let i = 0; i < 1; i++) {
    // walker = new RandomWalker(playArea.mapTiles[floor(random(playArea.mapTiles.length))], playArea.mapTiles);
    walker = new RandomWalker(spawnPoint, playArea.mapTiles);
    walkers.push(walker);
  }
  // walker = new RandomWalker(playArea.mapTiles[10], playArea.mapTiles);
}


let count = 0;
let delay = 100;
let towers = [];
function draw() {
  count++;
  if (count % delay == 0){
    let walker = new RandomWalker(playArea.mapTiles[16], playArea.mapTiles);
    walkers.push(walker);
  }
  
  playArea.mouseOver();
  playArea.show();
  for (let i = 0; i < walkers.length; i++) {
    if (walkers[i].dead == true) {
      walkers.splice(i, 1);
    }
    walkers[i].move();
    walkers[i].show();
  }
  for (let i = 0; i < towers.length; i++) {
    towers[i].show()
  }
}

function mouseClicked() {
  // Check if mouse is inside a circle
  // for (let i = 0; i < playArea.mapTiles.length; i++) {
  //   let tile = playArea.mapTiles[i];
  //   let d = dist(mouseX, mouseY, tile.x, tile.y);
  //   if (d < tile.w/2) {
      // if (tile.highlight == false){
      //   tile.highlight = true;
      //   tile.reachable = false;
      // } else if (tile.highlight == true) {
      //   tile.highlight = false;
      //   tile.reachable = true;
      // }
      // tower = new Tower(tile.x, tile.y);
      // towers.push(tower);
  //     // console.log("grid coordinates: (" + tile.gridPos[0] + ", " + tile.gridPos[1] + ")" + "\n" +
  //     // 'cube coordinates: (' + tile.cubeX + ', ' + tile.cubeY + ', ' + tile.cubeZ + ')');
  //   }
  // }
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