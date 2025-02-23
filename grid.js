class Grid {

  static dead = 0;
  static alive = 1;
  static highlight = 2;

  //-----------------------------------------------------------------------------

  constructor(width, height, cellSize) {

    this.width = width;
    this.height = height;
    this.cellSize = cellSize;

    this.canvas = document.getElementById('gridCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.grid = [];
    this.liveNeibhbors = [];

    this.init();
    this.initCanvas();
  }

  //-----------------------------------------------------------------------------

  init() {

    for (let row = 0; row < this.width; row++) {

      this.grid[row] = [];
      this.liveNeibhbors[row] = [];

      for (let col = 0; col < this.height; col++) {
        this.grid[row][col] = Grid.dead;
        this.liveNeibhbors[row][col] = 0;
      }
    }
  }

  //-----------------------------------------------------------------------------

  reset() {

    for (let row = 0; row < this.width; row++) {
      for (let col = 0; col < this.height; col++) {
        this.grid[row][col] = Grid.dead;
      }
    }

    this.draw();
  }

  //-----------------------------------------------------------------------------

  initCanvas() {

    this.canvas.width = this.width * this.cellSize;
    this.canvas.height = this.height * this.cellSize;

    if (this.canvas.getContext) {
      this.ctx.strokeStyle = 'lightgrey'

      this.ctx.beginPath();

      for (let row = 0; row <= this.width; row++) {
        this.ctx.moveTo(0, row * this.cellSize);
        this.ctx.lineTo(this.width * this.cellSize, row * this.cellSize);
        this.ctx.fill();
      }

      for (let col = 0; col <= this.height; col++) {
        this.ctx.moveTo(col * this.cellSize, 0);
        this.ctx.lineTo(col * this.cellSize, this.height * this.cellSize);
        this.ctx.fill();
      }

      this.ctx.stroke();
    }
  }

  //-----------------------------------------------------------------------------

  drawCell(row, col, cellState) {

    if (cellState == Grid.dead) {
      this.ctx.fillStyle = 'white';
    }
    else if (cellState == Grid.alive) {
      this.ctx.fillStyle = 'black';
    }
    else if (cellState == Grid.highlight) {
      this.ctx.fillStyle = "rgba(65, 65, 65, 0.5)";
    }

    this.ctx.fillRect(row * this.cellSize + 1, col * this.cellSize + 1, this.cellSize - 2, this.cellSize - 2);
  }

  //-----------------------------------------------------------------------------

  draw() {
    for (let row = 0; row < this.width; row++) {
      for (let col = 0; col < this.height; col++) {
        this.drawCell(row, col, this.grid[row][col]);
      }
    }
  }

  //-----------------------------------------------------------------------------

  static neighborIndices = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

  getLiveNeighborCount(row, col) {

    let liveNeighbors = 0;

    for (let i = 0; i < 8; i++) {

      let neighborRow = row + Grid.neighborIndices[i][0];
      let neighborCol = col + Grid.neighborIndices[i][1];

      if (neighborRow >= 0 && neighborRow < this.width && neighborCol >= 0 && neighborCol < this.height) {
        if (this.grid[neighborRow][neighborCol] == Grid.alive) {
          liveNeighbors += 1;
        }
      }
    }

    return liveNeighbors;
  }

  //-----------------------------------------------------------------------------

  update() {

    // from Wikipedia:
    //   Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    //   Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    //   Any live cell with two or three live neighbours lives on to the next generation.
    //   Any live cell with more than three live neighbours dies, as if by overpopulation.

    for (let row = 0; row < this.width; row++) {
      for (let col = 0; col < this.height; col++) {
        this.liveNeibhbors[row][col] = this.getLiveNeighborCount(row, col);
      }
    }

    for (let row = 0; row < this.width; row++) {
      for (let col = 0; col < this.height; col++) {
        // dead cell
        if (this.grid[row][col] == Grid.dead) {
          if (this.liveNeibhbors[row][col] == 3) {
            this.grid[row][col] = Grid.alive;
          }
        }
        // live cell
        else {
          //console.log(" "+this.liveNeibhbors[row][col]+" nb,   " + this.liveNeibhbors );

          if (this.liveNeibhbors[row][col] < 2) {
            this.grid[row][col] = Grid.dead;
          }
          else if (this.liveNeibhbors[row][col] > 3) {
            this.grid[row][col] = Grid.dead;
          }
        }
      }
    }

    this.draw();
  }

  //-----------------------------------------------------------------------------

  toggleCell(row, col) {

    if (this.grid[row][col] == Grid.dead) {
      this.grid[row][col] = Grid.alive;
    }
    else {
      this.grid[row][col] = Grid.dead;
    }

    this.drawCell(row, col, this.grid[row][col]);

    console.log("(" + row + "," + col + ") -> " + this.grid[row][col]);
  }

  //-----------------------------------------------------------------------------

  showPattern(mouseRow, mouseCol, pattern) {
 
    const width = pattern[0].length;
    const height = pattern.length;
    const halfWidth = parseInt(width / 2);
    const halfHeight = parseInt(height / 2);

    this.draw();

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (pattern[j][i]) {
          let row = mouseRow - halfWidth + i;
          let col = mouseCol - halfHeight + j;
          this.drawCell( row, col, Grid.highlight );
        }
      }
    }
  }

  //-----------------------------------------------------------------------------

  placePatternOnGrid(mouseRow, mouseCol, pattern) {

    const width = pattern[0].length
    const height = pattern.length
    const halfWidth = parseInt(width / 2);
    const halfHeight = parseInt(height / 2);

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (pattern[j][i]) {
          let row = mouseRow - halfWidth + i;
          let col = mouseCol - halfHeight + j;
          this.drawCell( row, col, Grid.alive );
          this.grid[row][col] = 1;
        }
      }
    }
  }

  //-----------------------------------------------------------------------------

}

export default Grid;
