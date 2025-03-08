
const Cell = {
  dead: 0,
  alive: 1,
  highlight: 2
}

export class Grid {

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

    this.isPeriodic = true;
  }

  //-----------------------------------------------------------------------------

  init() {

    for (let row = 0; row < this.width; row++) {

      this.grid[row] = [];
      this.liveNeibhbors[row] = [];

      for (let col = 0; col < this.height; col++) {
        this.grid[row][col] = Cell.dead;
        this.liveNeibhbors[row][col] = 0;
      }
    }
  }

  //-----------------------------------------------------------------------------

  reset() {

    for (let row = 0; row < this.width; row++) {
      for (let col = 0; col < this.height; col++) {
        this.grid[row][col] = Cell.dead;
      }
    }

    this.draw();
  }

  //-----------------------------------------------------------------------------

  initCanvas() {

    // draw the grid lines

    this.canvas.width = this.width * this.cellSize;
    this.canvas.height = this.height * this.cellSize;

    if (this.canvas.getContext) {
      this.ctx.strokeStyle = 'lightgrey'

      this.ctx.beginPath();

      for (let row = 0; row <= this.height; row++) {
        this.ctx.moveTo(0, row * this.cellSize);
        this.ctx.lineTo(this.width * this.cellSize, row * this.cellSize);
        this.ctx.fill();
      }

      for (let col = 0; col <= this.width; col++) {
        this.ctx.moveTo(col * this.cellSize, 0);
        this.ctx.lineTo(col * this.cellSize, this.height * this.cellSize);
        this.ctx.fill();
      }

      this.ctx.stroke();
    }
  }

  //-----------------------------------------------------------------------------

  drawCell(row, col, cellState) {

    if (cellState == Cell.dead) {
      this.ctx.fillStyle = 'white';
    }
    else if (cellState == Cell.alive) {
      this.ctx.fillStyle = 'black';
    }
    else if (cellState == Cell.highlight) {
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

  mod(n, m) {
    // supports mod of negative numbers
    if (n < 0) return ((n % m) + m) % m;
    else return n % m;
  }

  //-----------------------------------------------------------------------------

  checkForBorders(cell) {
    if (this.isPeriodic) {
      cell[0] = this.mod(cell[0], this.width);
      cell[1] = this.mod(cell[1], this.height);
    }
    else {
      if (cell[0] < 0 || cell[0] >= this.width || cell[1] < 0 || cell[1] >= this.height) {
        return false;
      }
    }
    return true;
  }

  //-----------------------------------------------------------------------------

  static neighborIndices = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

  getLiveNeighborCount(row, col) {

    let liveNeighbors = 0;

    for (let i = 0; i < 8; i++) {

      let NeighborCell = [];
      NeighborCell[0] = row + Grid.neighborIndices[i][0];
      NeighborCell[1] = col + Grid.neighborIndices[i][1];

      if (this.checkForBorders(NeighborCell)) {
        if (this.grid[NeighborCell[0]][NeighborCell[1]] == Cell.alive) {
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
        if (this.grid[row][col] == Cell.dead) {
          if (this.liveNeibhbors[row][col] == 3) {
            this.grid[row][col] = Cell.alive;
          }
        }
        // live cell
        else {
          if (this.liveNeibhbors[row][col] < 2) {
            this.grid[row][col] = Cell.dead;
          }
          else if (this.liveNeibhbors[row][col] > 3) {
            this.grid[row][col] = Cell.dead;
          }
        }
      }
    }

    this.draw();
  }

  //-----------------------------------------------------------------------------

  toggleCell(row, col) {

    if (this.grid[row][col] == Cell.dead) {
      this.grid[row][col] = Cell.alive;
    }
    else {
      this.grid[row][col] = Cell.dead;
    }

    this.drawCell(row, col, this.grid[row][col]);
  }

  //-----------------------------------------------------------------------------

  showPattern(mouseRow, mouseCol, pattern) {

    const width = pattern[0].length;
    const height = pattern.length;
    const halfWidth = parseInt(width / 2);
    const halfHeight = parseInt(height / 2);

    this.draw(); // remove the last mouse position pattern

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (pattern[j][i]) {
          let cell = [];
          cell[0] = mouseRow - halfWidth + i;
          cell[1] = mouseCol - halfHeight + j;
          if (this.checkForBorders(cell)) {
            this.drawCell(cell[0], cell[1], Cell.highlight);
          }
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
          let cell = [];
          cell[0] = mouseRow - halfWidth + i;
          cell[1] = mouseCol - halfHeight + j;
          if (this.checkForBorders(cell)) {
            this.drawCell(cell[0], cell[1], Cell.alive);
            this.grid[cell[0]][cell[1]] = 1;
          }
        }
      }
    }
  }

  //-----------------------------------------------------------------------------

  scale(factor) {

    const newCellSize = parseInt(this.cellSize / factor);

    if (newCellSize > 2 && newCellSize < 128) {

      const oldGrid = this.grid.slice();
      const oldWidth = this.width;
      const oldHeight = this.height;

      this.cellSize = newCellSize;
      this.width = parseInt(this.width * factor);
      this.height = parseInt(this.height * factor);

      this.grid = [];
      this.liveNeibhbors = [];

      this.init();
      this.initCanvas();

      const offsetCols = parseInt((this.width - oldWidth) / 2);
      const offsetRows = parseInt((this.height - oldHeight) / 2);

      if (factor > 1) {
        for (let row = 0; row < oldHeight; row++) {
          for (let col = 0; col < oldWidth; col++) {
            this.grid[col + offsetCols][row + offsetRows] = oldGrid[col][row];
          }
        }
      }
      else {
        for (let row = 0; row < this.height; row++) {
          for (let col = 0; col < this.width; col++) {
            this.grid[col][row] = oldGrid[col - offsetCols][row - offsetRows];
          }
        }
      }

      this.draw();
    }
  }

  //-----------------------------------------------------------------------------

}