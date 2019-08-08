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
        for (let i = 0; i < this.mapTiles.length; i++) {
          this.mapTiles[i].mapTiles = this.mapTiles;
        }
      }

      createWalkMap() {
        // console.log('creating walk map');
        let newWalkMap = [];
        for (let i = 0; i < playArea.mapTiles.length; i++) {
          playArea.mapTiles[i].value = null;
        }
        let base = playArea.mapTiles[0];
       
        for (let i = 0; i < playArea.mapTiles.length; i++) {
          if (playArea.mapTiles[i].start == true) {
            base = playArea.mapTiles[i];
          }
        }
        base.value = 0;
        let frontier = [];
        frontier.push(base);
        while (frontier.length != 0) {
          let current = frontier.shift();
          for (let i = 0; i < current.neighbors.length; i++) {
            let next = current.neighbors[i];
            if (next.value == null && next.reachable) {
              next.value = current.value + 1;
              frontier.push(next);
            }
          }
        }
      }

      getVisitMap() {
        let visitable = [];
        for (let i = 0; i < this.mapTiles.length; i++) {
          if (this.mapTiles[i].value != null) {
            visitable.push(this.mapTiles[i]);
          }
        }
        return visitable;
      }
      

      show() {
      for (let i = 0; i < this.mapTiles.length; i++) {
        this.mapTiles[i].show();
      }
      for (let i = 0; i < this.mapTiles.length; i++) {
        if (this.mapTiles[i].hover) {
          stroke(255);
          fill('rgba(255,255,255, 0)');
          ellipse(this.mapTiles[i].x, this.mapTiles[i].y, 480,480);
        }
      }
    }

    mouseOver() {
        for (let i = 0; i < this.mapTiles.length; i++) {
            let radius = this.size*sqrt(3) - 6;
            if (
                mouseX >= this.mapTiles[i].x - radius &&
                mouseX <= this.mapTiles[i].x + radius &&
                mouseY >= this.mapTiles[i].y - radius &&
                mouseY <= this.mapTiles[i].y + radius &&
                toPlace
            ) {
                this.mapTiles[i].hover = true;
            } else {
                this.mapTiles[i].hover = false;
            }
            if (
              mouseX >= this.mapTiles[i].x - radius &&
              mouseX <= this.mapTiles[i].x + radius &&
              mouseY >= this.mapTiles[i].y - radius &&
              mouseY <= this.mapTiles[i].y + radius &&
              toSell && this.mapTiles[i].hasTower
          ) {
            this.mapTiles[i].highlight = true;
          } else {
            this.mapTiles[i].highlight = false;
          }
        }
    }

}