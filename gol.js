

const gridSize = 25; // Number of rows and columns
const tileSize = 24; // Size of each square
let grid = [];
let numberOfLiveNeighbors = []
run = false;

const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');

let lastTime = 0;
let fps = 2; // Target frames per second
let interval = 1000 / fps; // Time interval in milliseconds

let pattern = [];


//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------

function initGrid() {
  for (let row = 0; row < gridSize; row++) {
    grid[row] = [];
    numberOfLiveNeighbors[row] = []
    for (let col = 0; col < gridSize; col++) {
      grid[row][col] = 0;
      numberOfLiveNeighbors[row][col] = 0
    }
  }
}

//-----------------------------------------------------------------------------

function initCanvas() {

  canvas.width = gridSize * tileSize;
  canvas.height = gridSize * tileSize;

  if (canvas.getContext) {
    ctx.strokeStyle = 'lightgrey'

    ctx.beginPath();
    for (let row = 0; row <= gridSize; row++) {
      ctx.moveTo(0, row * tileSize);
      ctx.lineTo(gridSize * tileSize, row * tileSize);
      ctx.fill();
    }
    for (let col = 0; col <= gridSize; col++) {
      ctx.moveTo(col * tileSize, 0);
      ctx.lineTo(col * tileSize, gridSize * tileSize);
      ctx.fill();
    }
    ctx.stroke();

    // red square
    // const x = Math.floor(Math.random() * gridSize);
    // const y = Math.floor(Math.random() * gridSize);
    // ctx.fillStyle = 'red';
    // ctx.fillRect( y*tileSize+1, x*tileSize+1, tileSize-2, tileSize-2 );
  }
}

//-----------------------------------------------------------------------------

function drawGrid() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col] == 0) {
        ctx.fillStyle = 'white';
      }
      else {
        ctx.fillStyle = 'black';
      }
      ctx.fillRect(row * tileSize + 1, col * tileSize + 1, tileSize - 2, tileSize - 2);
    }
  }
}


//-----------------------------------------------------------------------------

function step(timestamp) {

  if (run) {
    const deltaTime = timestamp - lastTime;

    if (deltaTime > interval) {

      updateGrid();

      // Update lastTime to current timestamp
      lastTime = timestamp - (deltaTime % interval);
    }

    // Call the gameLoop again on the next frame
    requestAnimationFrame(step);
  }
}

//-----------------------------------------------------------------------------

function updateGrid() {

  // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
  // Any live cell with two or three live neighbours lives on to the next generation.
  // Any live cell with more than three live neighbours dies, as if by overpopulation.

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      numberOfLiveNeighbors[row][col] = getLiveNeighbors(row, col);
    }
  }

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // dead cell
      if (grid[row][col] == 0) {
        if (numberOfLiveNeighbors[row][col] == 3) {
          grid[row][col] = 1;
        }
      }
      // live cell
      else {
        if (numberOfLiveNeighbors[row][col] < 2) {
          grid[row][col] = 0;
        }
        else if (numberOfLiveNeighbors[row][col] > 3) {
          grid[row][col] = 0;
        }
      }

      if (row == 0 && col == 3) {
        console.log(numberOfLiveNeighbors[row][col] + " live neighbors");
      }
    }
  }

  drawGrid();

  console.log('step');
}

const neighbors = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]

function getLiveNeighbors(row, col) {

  let liveNeighbors = 0;

  for (let i = 0; i < 8; i++) {
    let neighborRow = row + neighbors[i][0];
    let neighborCol = col + neighbors[i][1];
    if (neighborRow >= 0 && neighborRow < gridSize && neighborCol >= 0 && neighborCol < gridSize) {
      liveNeighbors += grid[neighborRow][neighborCol];
    }

    if (row == 0 && col == 3) {
      console.log("  Neighbor (" + neighborRow + "," + neighborCol + "),  " + liveNeighbors);
    }
  }

  return liveNeighbors;
}


//-----------------------------------------------------------------------------


function toggleTile(row, col) {

  if (grid[row][col] == 0) {
    ctx.fillStyle = 'black';
    ctx.fillRect(row * tileSize + 1, col * tileSize + 1, tileSize - 2, tileSize - 2);
    grid[row][col] = 1;
  }
  else {
    ctx.fillStyle = 'white';
    ctx.fillRect(row * tileSize + 1, col * tileSize + 1, tileSize - 2, tileSize - 2);
    grid[row][col] = 0;
  }

  console.log("(" + row + "," + col + ") -> " + grid[row][col]);
}

//-----------------------------------------------------------------------------

function showPattern(mouseRow, mouseCol) {

  const width = pattern[0].length
  const height = pattern.length
  const halfWidth = parseInt(width / 2);
  const halfHeight = parseInt(height / 2);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      if (pattern[j][i]) {
        let row = mouseRow - halfWidth + i;
        let col = mouseCol - halfHeight + j;
        ctx.fillStyle = 'grey';
        ctx.fillRect(row * tileSize + 1, col * tileSize + 1, tileSize - 2, tileSize - 2);
      }
    }
  }
}

function addPatterun(mouseRow, mouseCol) {

  const width = pattern[0].length
  const height = pattern.length
  const halfWidth = parseInt(width / 2);
  const halfHeight = parseInt(height / 2);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      if (pattern[j][i]) {
        let row = mouseRow - halfWidth + i;
        let col = mouseCol - halfHeight + j;
        ctx.fillStyle = 'black';
        ctx.fillRect(row * tileSize + 1, col * tileSize + 1, tileSize - 2, tileSize - 2);
        grid[row][col] = 1;
      }
    }
  }
}


//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------








//-----------------------------------------------------------------------------

initGrid();
initCanvas();

document.getElementById("speedSlider").value = fps;
document.getElementById('speedValue').innerHTML = fps

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------

const offsetX = gridCanvas.offsetLeft;
const offsetY = gridCanvas.offsetTop;
// let isMouseDown = false;
let lastRow, lastCol

const Mode = {
  toggleMouseUp: 0,
  toggleMouseDown: 1,
  placePattern: 2
};
let mode = Mode.toggleMouseUp;

gridCanvas.onmouseup = function (e) {
  if (mode == Mode.toggleMouseDown) {
     mode = Mode.toggleMouseUp;
  }
};

gridCanvas.onmousedown = function (e) {
  console.log(mode);
  if (mode == Mode.toggleMouseUp) {
    lastRow = parseInt((e.layerX - offsetX) / tileSize);
    lastCol = parseInt((e.layerY - offsetY) / tileSize);
    toggleTile(lastRow, lastCol);
    //isMouseDown = true;
    mode = Mode.toggleMouseDown;
  }
  console.log(mode);
};

gridCanvas.onmousemove = function (e) {
  console.log(mode);

  if (mode == Mode.toggleMouseDown) {
    let row = parseInt((e.layerX - offsetX) / tileSize);
    let col = parseInt((e.layerY - offsetY) / tileSize);
    console.log("moved to (" + row + "," + col + ")");

    if ((row != lastRow) || (col != lastCol)) {
      toggleTile(row, col);
      lastRow = row;
      lastCol = col;
      console.log("moved to (" + row + "," + col + ")");
    }
  }
  else if (mode == Mode.placePattern) {
    let row = parseInt((e.layerX - offsetX) / tileSize);
    let col = parseInt((e.layerY - offsetY) / tileSize);
    drawGrid();
    showPattern(row, col);
  }
};

// gridCanvas.onmouseover = function(e) {
// };

gridCanvas.onmouseout = function (e) {
  if( mode == Mode.toggleMouseDown ) {
    mode = Mode.toggleMouseUp;
  }
};

gridCanvas.onclick = function (e) {
  if (mode == Mode.placePattern) {
    let mouseRow = parseInt((e.layerX - offsetX) / tileSize);
    let mouseCol = parseInt((e.layerY - offsetY) / tileSize);
    addPatterun(mouseRow, mouseCol);
  }
};

//gridCanvas.ondbclick = function(e) {
//  console.log('ondbclick');
//  console.log(e);
//};


function runButton() {
  run = !run;
  if (run) {
    document.getElementById("runButton").innerHTML = "Stop"
  }
  else {
    document.getElementById("runButton").innerHTML = "Run"
  }
  requestAnimationFrame(step);
}

function stepButton() {
  updateGrid();
}

function clearButton() {
  initGrid();
  drawGrid();
}

speedSlider.oninput = function () {
  fps = document.getElementById("speedSlider").value;
  interval = 1000 / fps;
  document.getElementById('speedValue').innerHTML = fps;
  console.log("fps: " + fps);
}

function patternButton() {
  if( mode == Mode.placePattern ) {
    mode = Mode.toggleMouseUp;
  }
  else {
   pattern = [[0, 1, 0],
              [0, 0, 1],
              [1, 1, 1]];
    mode = Mode.placePattern;
  }
  drawGrid();
}
