let count = 0;
let delay = 150;
let towers = [];
const size = 40;
playArea = new PlayArea(size/2);
let walkers = [];
let bananas = [];
let spritesheet;
let bananasprite;
let babysprite;
let toPlace;
let toSell;
let cash = 100;
let level = 0;
let wave = [];
let spawnPoint;
let harambeHeath = 5;
let paused = true;

function preload() {
  spritesheet = loadImage("Sprites/MonkeySprite.png");
  bananasprite = loadImage("Sprites/BananaSprite.png");
  babysprite = loadImage("Sprites/BabyCrawl.png");
}

function setup() {
  frameRate(100);
  canvasWidth = 1280;
  canvasHeight = 720;
  let cnv = createCanvas(canvasWidth, canvasHeight);
  cnv.parent('sketch-holder');
  background(51);
  playArea.createMap(size);
  let start = playArea.mapTiles[170];
  start.start = true;
  spawnPoint = playArea.mapTiles[16]
  spawnPoint.spawnPoint = true;
  playArea.createWalkMap();
}



function draw() {
  background(51);
  if (wave.length == 0 && walkers.length == 0){
    level++;
    loadWave(30 * level);
    console.log("level: " + level);
  }
  if (paused) {
    text("press space to play",canvasWidth/2,canvasHeight/2);
  
  } else {
    count++;
    if (count % delay == 0 && wave.length !=0){
      let walker = wave.pop();
      walkers.push(walker);
    }
    
    playArea.mouseOver();
    playArea.show();

    
    
    for (let i = 0; i < towers.length; i++) {
      towers[i].target(walkers);
      towers[i].update();
      towers[i].show()
    }


    for (let i = 0; i < bananas.length; i++) {
      if (bananas[i].dead || bananas[i].target.dead) {
        bananas.splice(i, 1);
      } else {
        bananas[i].update();
        bananas[i].show();
      }
    }

    for (let i = 0; i < walkers.length; i++) {
      if (walkers[i].dead == true) {
        walkers.splice(i, 1);
        cash += 10;
        console.log("enemy killed! cash: $" + cash);
      } else if (walkers[i].reachedGoal) {
        walkers.splice(i,1);
        harambeHeath--;
        console.log("enemy reached harambe!");
        console.log("Harambe health: " + harambeHeath);
      }
      if (walkers.length > 0) {
        walkers[i].move();
        walkers[i].show();
      }
    }
  fill(255);
  stroke(0);
  textSize(23);
  text("Cash: $"+cash,canvasWidth/2,canvasHeight);
  text("Wave: " + level, canvasWidth-120, 19);

  }
}

function pause() {
  paused = !paused;
}

function loadWave(health) {
  for (let i = 0; i < level * 3; i++) {
    walker = new RandomWalker(spawnPoint, playArea.mapTiles, health);
    wave.push(walker);
  }
}

function mouseClicked() {
  let tile = getTile(mouseX, mouseY);
  if(toPlace && !tile.hasTower && cash >= 25){
    placeTower(tile);
    toPlace = false;
    cash -= 25;
    console.log("tower bought! cash: $" + cash);
  } 
  if (toSell && tile.hasTower) {
    sellTower(tile);
    toSell = false;
    cash += 15;
    console.log("tower sold! cash: $" + cash)
  }
}

function placeTower(tile) {
  tower = new Tower(tile);
  towers.push(tower);
  tile.hasTower = true;
  tile.reachable = false;
  playArea.createWalkMap();
  if(playArea.mapTiles[16].value == null) {
    towers.pop();
    tile.hasTower = false;
    tile.highlight = false;
    tile.reachable = true;
    playArea.createWalkMap();
    cash += 25;
  } else {
    for (let i = 0; i < walkers.length; i++) {
      if (walkers[i].tile.value === null) {
        towers.pop();
        tile.hasTower = false;
        tile.highlight = false;
        tile.reachable = true;
        playArea.createWalkMap();
        cash += 25;
        break;
      }
    }
  }
}

function sellTower(tile) {
  for (let i = 0; i < towers.length; i++) {
    if (towers[i].mapTile == tile) {
      towers.splice(i, 1);
      tile.hasTower = false;
      tile.reachable = true;
    }
  }
  playArea.createWalkMap();
  
}

// function placeTower(tile) {
//   if (tile.highlight == false){
//     tile.highlight = true;
//     tile.reachable = false;
//   } else if (tile.highlight == true) {
//     tile.highlight = false;
//     tile.reachable = true;
//   }
//   if (!tile.hasTower) {
//     tower = new Tower(tile);
//     towers.push(tower);
//     tile.hasTower = true;
//   } else {
//     for (let i = 0; i < towers.length; i++) {
//       if (towers[i].mapTile == tile) {
//         towers.splice(i, 1);
//         tile.hasTower = false;
//       }
//     }
//   }
//   playArea.createWalkMap();
//   if(playArea.mapTiles[16].value == null) {
//     towers.pop();
//     tile.hasTower = false;
//     tile.highlight = false;
//     tile.reachable = true;
//     playArea.createWalkMap();
//   } else {
//     for (let i = 0; i < walkers.length; i++) {
//       if (walkers[i].tile.value === null) {
//         towers.pop();
//         tile.hasTower = false;
//         tile.highlight = false;
//         tile.reachable = true;
//         playArea.createWalkMap();
//         break;
//       }
//     }
//   }
// }

function getTile(x, y) {
  for (let i = 0; i < playArea.mapTiles.length; i++) {
    let tile = playArea.mapTiles[i];
    let d = dist(x, y, tile.x, tile.y);
    if (d < playArea.size*sqrt(3)) {
      return tile;
    }
  }
}

function setPlace() {
  toPlace = true;
  toSell = false;
}

function setSell() {
  toSell = true;
  toPlace = false;
}

function keyPressed() {
  switch (keyCode) {
      case 83:
          //s
          setSell();
          break;
      case 84:
          // t
          setPlace();
          break;
      case 27:
          // Esc
          toPlace = false;
          toSell = false;
          break;
      case 32:
          // Space
          pause();
          break;
      case 49:
          // 1
          setPlace();
          break;
      case 50:
          // 2
          setPlace('laser');
          break;
      case 51:
          // 3
          setPlace('slow');
          break;
      case 52:
          // 4
          setPlace('sniper');
          break;
      case 53:
          // 5
          setPlace('rocket');
          break;
      case 54:
          // 6
          setPlace('bomb');
          break;
      case 55:
          // 7
          setPlace('tesla');
          break;
      case 70:
          // F
          showFPS = !showFPS;
          break;
      case 71:
          // G
          godMode = !godMode;
          break;
      case 72:
          // H
          healthBar = !healthBar;
          break;
      case 77:
          // M
          importMap(prompt('Input map string:'));
          break;
      case 80:
          // P
          showEffects = !showEffects;
          if (!showEffects) systems = [];
          break;
      case 81:
          // Q
          stopFiring = !stopFiring;
          break;
      case 82:
          // R
          resetGame();
          break;
      case 83:
          // S
          if (selected) sell(selected);
          break;
      case 85:
          // U
          if (selected && selected.upgrades.length > 0) {
              upgrade(selected.upgrades[0]);
          }
          break;
      case 86:
          // V
          muteSounds = !muteSounds;
          break;
      case 87:
          // W
          skipToNext = !skipToNext;
          break;
      case 88:
          // X
          copyToClipboard(exportMap());
          break;
      case 90:
          // Z
          ts = zoomDefault;
          resizeMax();
          resetGame();
          break;
      case 219:
          // Left bracket
          if (ts > 16) {
              ts -= tileZoom;
              resizeMax();
              resetGame();
          }
          break;
      case 221:
          // Right bracket
          if (ts < 40) {
              ts += tileZoom;
              resizeMax();
              resetGame();
          }
          break;
  }
}