import { Grid } from "./grid.js";
import { Patterns } from "./patterns.js";

const cellSize = 16;
const canvasCollumns = parseInt((1280) / cellSize);
const canvasRows = 48;

let grid = new Grid(canvasCollumns, canvasRows, cellSize);

let isRunning = false;
let isDisplayingPattern = false;

let lastTime = 0;
let fps = 4; // Target frames per second
let interval = 1000 / fps; // Time interval in milliseconds

document.getElementById("speedSlider").value = fps;
document.getElementById('speedValue').innerHTML = fps

let selectedPattern;

//-----------------------------------------------------------------------------

function step(timestamp) {

  if (isRunning) {
    const deltaTime = timestamp - lastTime;

    if (deltaTime > interval) {

      grid.update();

      if (isDisplayingPattern) {
        grid.showPattern(lastCell[0], lastCell[1], selectedPattern);
      }

      lastTime = timestamp - (deltaTime % interval);
    }

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
  if (mouseState == MouseState.toggleMouseUp) {
    mouseState = MouseState.toggleMouseDown;
    const cell = getCellUnderMouse(e);
    grid.toggleCell(cell[0], cell[1]);
    lastCell = cell;
  }
};

gridCanvas.onmousemove = function (e) {
  if (mouseState == MouseState.toggleMouseDown) {
    const cell = getCellUnderMouse(e);

    if (cell[0] != lastCell[0] || cell[1] != lastCell[1]) {
      grid.toggleCell(cell[0], cell[1]);
      lastCell = cell;
    }
  }
  else if (mouseState == MouseState.showPattern) {
    const cell = getCellUnderMouse(e);

    if (cell[0] != lastCell[0] || cell[1] != lastCell[1]) {
      grid.showPattern(cell[0], cell[1], selectedPattern);
      lastCell = cell;
    }
  }
};

gridCanvas.onmouseover = function (e) {
  if (mouseState == MouseState.showPattern) {
    isDisplayingPattern = true;
    const cell = getCellUnderMouse(e);
    grid.showPattern(cell[0], cell[1], selectedPattern);
  }
};

gridCanvas.onmouseout = function (e) {
  if (mouseState == MouseState.toggleMouseDown) {
    mouseState = MouseState.toggleMouseUp;
  }
  if (mouseState == MouseState.showPattern) {
    // prevent the pattern highlight to remain on the grid on the last mouse position
    isDisplayingPattern = false; 
    grid.draw();
  }
};

gridCanvas.onclick = function (e) {
  if (mouseState == MouseState.showPattern) {
    const cell = getCellUnderMouse(e);
    grid.placePatternOnGrid(cell[0], cell[1], selectedPattern);
  }
};

//-----------------------------------------------------------------------------

// Control Inputs

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
}

// Pattern Select

var patternsSelect = document.getElementById('patternsSelect');
patternsSelect.value = "default";

patternsSelect.addEventListener('change', () => {
  console.log('select: ' + patternsSelect.value);

  mouseState = MouseState.showPattern;

  switch (patternsSelect.value) {
    case "default":
      mouseState = MouseState.toggleMouseUp;
      break;
    case "sp1":
      selectedPattern = Patterns.glider;
      break;
    case "sp2":
      selectedPattern = Patterns.lwss;
      break;
    case "sp4":
      selectedPattern = Patterns.hwss;
      break;
    case "puf1":
      selectedPattern = Patterns.puffer1;
      break;
    case "puf2":
      selectedPattern = Patterns.puffer2;
      break;
    case "osc1":
      selectedPattern = Patterns.blinker;
      break;
    case "osc2":
      selectedPattern = Patterns.pentadecathlon;
      break;
    case "osc2":
      selectedPattern = Patterns.pentadecathlon_synthesis;
      break;
    case "osc3":
      selectedPattern = Patterns.pulsar;
      break;
    case "osc4":
      selectedPattern = Patterns.pre_pulsar;
      break;
    case "osc5":
      selectedPattern = Patterns.galaxy;
      break;
    case "osc6":
      selectedPattern = Patterns.clock;
      break;
    case "mtsl1":
      selectedPattern = Patterns.acorn;
      break;
    case "mtsl2":
      selectedPattern = Patterns.pi_heptomino;
      break;
    case "other1":
      selectedPattern = Patterns.line;
      break;
  }
});

// Cursor Button

const cursorButton = document.getElementById('cursorButton');
cursorButton.addEventListener('click', () => {
  mouseState = MouseState.toggleMouseUp;
  patternsSelect.value = "default";
});

// Rotation Buttons

const rotatePatternLeft = document.getElementById('rotateLeftBtn');
rotatePatternLeft.addEventListener('click', () => {
  if (mouseState == MouseState.showPattern) {
    const w = selectedPattern.length;
    const h = selectedPattern[0].length;

    console.log("rotate " + w + ", " + h);

    let newPattern = [];
    for (let i = 0; i < h; i++) {
      newPattern[i] = [];
    }

    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        newPattern[j][i] = selectedPattern[i][h - 1 - j];
      }
    }
    selectedPattern = newPattern;
  }
});

const rotatePatternRight = document.getElementById('rotateRightBtn');
rotatePatternRight.addEventListener('click', () => {

  if (mouseState == MouseState.showPattern) {
    const w = selectedPattern.length;
    const h = selectedPattern[0].length;

    console.log("rotate " + w + ", " + h);

    let newPattern = [];
    for (let i = 0; i < h; i++) {
      newPattern[i] = [];
    }

    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        newPattern[j][i] = selectedPattern[w - 1 - i][j];
      }
    }
    selectedPattern = newPattern;
  }
});


// Resize buttons

const plusBtn = document.getElementById('plusBtn');
plusBtn.addEventListener('click', () => {
  grid.scale(2);
});

const minusBtn = document.getElementById('minusBtn');
minusBtn.addEventListener('click', () => {
  grid.scale(0.5);
});