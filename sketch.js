let count = 0;
let delay = 150;
const size = 40;
let playArea = new PlayArea(size/2);
let towers = [];
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
let startGame = false;
let gameOver = false;
let babySpeed = 1;


function preload() {
  spritesheet = loadImage("Sprites/MonkeySprite.png");
  bananasprite = loadImage("Sprites/BananaSprite.png");
  babysprite = loadImage("Sprites/BabyCrawl.png");
}

function setup() {
  frameRate(120);
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
function togglePause()
{
    if (!paused)
    {
        paused = true;
    } else if (paused)
    {
       paused= false;
    }

}


function draw() {
  // background(51);
  if (wave.length == 0 && walkers.length == 0){
    level++;
    if(level % 3 == 0) {
      babySpeed++;
      delay *=.8;
    }
    loadWave(30 * level, babySpeed);
    console.log("level: " + level);
  }
  if (startGame) {
    runGame();
  
  } else if (gameOver) {
    fill(51,204,153);
    textAlign(CENTER);
    stroke(0);
    textSize(46);
    text("GAMEOVER",canvasWidth/2,canvasHeight/2-30);
    textSize(23);
    text("you made it to wave " + level +"!\npress 'r' to play again", canvasWidth/2,canvasHeight/2+60);
  } else {
    playArea.show();
    fill(51,204,153);
    textAlign(CENTER);
    stroke(0);
    textSize(46);
    text("press enter to play",canvasWidth/2,canvasHeight/2-30);
    textSize(23);
    text("Instructions:\nstop the babies from reaching Harambe!\npress 't' then click a tile to build a tower,\npress 's' then click a tower to sell it", canvasWidth/2,canvasHeight/2+60);

  }
}

function resetGame(){
  count = 0;
  delay = 150;
  towers = [];
  walkers = [];
  bananas = [];
  cash = 100;
  level = 0;
  wave = [];
  harambeHeath = 5;
  startGame = false;
  gameOver = false;
  babySpeed = 1;
}

function runGame() {
  background(51);
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
      }
      else if (walkers[i].reachedGoal) {
        walkers.splice(i,1);
        harambeHeath--;
        console.log("enemy reached harambe!");
        console.log("Harambe health: " + harambeHeath);
      } 
    }
    for (let i = 0; i < walkers.length; i++){
      walkers[i].move();
      walkers[i].show();
    }
    fill(255);
    stroke(0);
    textSize(23);
    text("Cash: $"+cash,canvasWidth/2,canvasHeight);
    text("Wave: " + level, canvasWidth-120, 19);

    if (harambeHeath <= 0) {
      gameOver = true;
      startGame = false;
    }
    
}

function start() {
  startGame = true;
}

function loadWave(health, babySpeed) {
  for (let i = 0; i < level * 3; i++) {
    walker = new RandomWalker(spawnPoint, playArea.mapTiles, health, babySpeed);
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
      case 13:
          // Enter
          start();
          break;
      case 82:
          // R
          if (gameOver){
            resetGame();
          }
          break;
      case 80:
          // P
          togglePause();
            break;
  }
}