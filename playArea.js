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

      // createWalkMap() {
      //   for (let i = 0; i < playArea.mapTiles.length; i++) {
      //     playArea.mapTiles[i].value = i;
      //   }
      //   let base = playArea.mapTiles[0];
       
      //   for (let i = 0; i < playArea.mapTiles.length; i++) {
      //     if (playArea.mapTiles[i].start == true) {
      //       base = playArea.mapTiles[i];
      //     }
      //   }
      //   //console.log(base);
      //   base.value = 0;
      //   // let n = base.neighbors;
      //   // console.log(n[0]);
      //   let frontier = [];
      //   frontier.push(base);
      //   while (frontier.length != 0) {
      //     let current = frontier.shift();
      //     for (let i = 0; i < current.neighbors; i++) {
      //       let next = current.neighbors[i];
      //       if (!current.neighbors.includes(next)) {
      //         frontier.push(next);
      //         next.value = current.value + 1;
      //       }
      //     }
      //   }
      // }

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