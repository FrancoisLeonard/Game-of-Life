
import Grid from "./grid.js";

let grid = new Grid(25, 25, 25);

grid.init();
grid.initCanvas();

let isRunning = false;
let isDisplayingPattern = false;

let lastTime = 0;

let fps = 2; // Target frames per second
let interval = 1000 / fps; // Time interval in milliseconds

document.getElementById("speedSlider").value = fps;
document.getElementById('speedValue').innerHTML = fps

let currentPattern;

//-----------------------------------------------------------------------------

function step(timestamp) {

  if (isRunning) {
    const deltaTime = timestamp - lastTime;

    if (deltaTime > interval) {

      grid.update();

      if (isDisplayingPattern) {
        grid.showPattern(lastCell[0], lastCell[1], currentPattern);
      }

      // Update lastTime to current timestamp
      lastTime = timestamp - (deltaTime % interval);
    }

    // Call the gameLoop again on the next frame
    requestAnimationFrame(step);
  }
}

//-----------------------------------------------------------------------------

// Mouse control

const MouseState = {
  toggleMouseUp: 0,
  toggleMouseDown: 1,
  showPattern: 2
};

let mouseState = MouseState.toggleMouseUp;

let lastCell = [];

function getCellUnderMouse(e) {
  const cell = [];
  cell[0] = parseInt((e.layerX - gridCanvas.offsetLeft) / grid.cellSize);
  cell[1] = parseInt((e.layerY - gridCanvas.offsetTop) / grid.cellSize);
  return cell;
}

gridCanvas.onmouseup = function (e) {

  if (mouseState == MouseState.toggleMouseDown) {
    mouseState = MouseState.toggleMouseUp;
  }

};

gridCanvas.onmousedown = function (e) {

  //console.log("down: " + mouseState + " " + lastCell);

  if (mouseState == MouseState.toggleMouseUp) {
    const cell = getCellUnderMouse(e);
    grid.toggleCell(cell[0], cell[1]);
    mouseState = MouseState.toggleMouseDown;
    lastCell = cell;
  }

  //console.log("down: " + mouseState + " " + lastCell);

};

gridCanvas.onmousemove = function (e) {

  //console.log(mouseState);

  if (mouseState == MouseState.toggleMouseDown) {
    const cell = getCellUnderMouse(e);

    if (cell[0] != lastCell[0] || cell[1] != lastCell[1]) {
      grid.toggleCell(cell[0], cell[1]);
      lastCell = cell;
      //console.log("move: (" + lastCell + ") -> (" + cell + ")");
    }
  }
  else if (mouseState == MouseState.showPattern) {
    const cell = getCellUnderMouse(e);

    if (cell[0] != lastCell[0] || cell[1] != lastCell[1]) {
      grid.showPattern(cell[0], cell[1], currentPattern);
      lastCell = cell;
    }
  }
};

gridCanvas.onmouseover = function (e) {
  if (mouseState == MouseState.showPattern) {
    isDisplayingPattern = true;
    const cell = getCellUnderMouse(e);
    grid.showPattern(cell[0], cell[1], currentPattern);
  }
};

gridCanvas.onmouseout = function (e) {

  if (mouseState == MouseState.toggleMouseDown) {
    mouseState = MouseState.toggleMouseUp;
  }
  if (mouseState == MouseState.showPattern) {
    isDisplayingPattern = false;
  }
  grid.draw();

};

gridCanvas.onclick = function (e) {

  if (mouseState == MouseState.showPattern) {
    const cell = getCellUnderMouse(e);
    grid.placePatternOnGrid(cell[0], cell[1], currentPattern);
  }

};

//gridCanvas.ondbclick = function(e) {
//  console.log('ondbclick');
//  console.log(e);
//};

//-----------------------------------------------------------------------------

// Buttons and other controls

const runButton = document.getElementById('runButton');
runButton.addEventListener('click', () => {
  isRunning = !isRunning;
  if (isRunning) {
    document.getElementById("runButton").innerHTML = "Stop"
    requestAnimationFrame(step);
  }
  else {
    document.getElementById("runButton").innerHTML = "Run"
  }
});

const stepButton = document.getElementById('stepButton');
stepButton.addEventListener('click', () => {
  grid.update();
});

const clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', () => {
  grid.reset();
});

speedSlider.oninput = function () {
  fps = document.getElementById("speedSlider").value;
  interval = 1000 / fps;
  document.getElementById('speedValue').innerHTML = fps;
  //console.log("fps: " + fps);
}

const Patterns = {
  glider: [[0, 1, 0], [0, 0, 1], [1, 1, 1]],
  lwss: [[0, 0, 1, 1, 0], [1, 1, 0, 1, 1], [1, 1, 1, 1, 0], [0, 1, 1, 0, 0]], // Light-weight spaceship
  mwss: [[0, 1, 1, 1, 0, 0], [1, 1, 1, 1, 1, 0], [1, 1, 1, 0, 1, 1], [0, 0, 0, 1, 1, 0]], // Medium-weight spaceship
  hwss: [[0, 1, 1, 1, 1, 0, 0], [1, 1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 0, 1, 1], [0, 0, 0, 0, 1, 1, 0]] // Heavy-weight spaceship
};

function patternButtonPressed() {
  if (mouseState == MouseState.showPattern) {
    mouseState = MouseState.toggleMouseUp;
    isDisplayingPattern = false;
  }
  else {
    mouseState = MouseState.showPattern;
    isDisplayingPattern = true;
  }

  grid.draw();
};

const pattern1Button = document.getElementById('pattern1Button');
pattern1Button.addEventListener('click', () => {
  patternButtonPressed();
  currentPattern = Patterns.glider;
});

const pattern2Button = document.getElementById('pattern2Button');
pattern2Button.addEventListener('click', () => {
  patternButtonPressed();
  currentPattern = Patterns.lwss;
});

const pattern3Button = document.getElementById('pattern3Button');
pattern3Button.addEventListener('click', () => {
  patternButtonPressed();
  currentPattern = Patterns.mwss;
});

const pattern4Button = document.getElementById('pattern4Button');
pattern4Button.addEventListener('click', () => {
  patternButtonPressed();
  currentPattern = Patterns.hwss;
});
