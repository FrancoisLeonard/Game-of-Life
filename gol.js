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

var patternsSelect = document.getElementById('patternsSelect');
patternsSelect.value = "default";

// Cursor Button

const cursorButton = document.getElementById('cursorButton');
cursorButton.addEventListener('click', () => {
  mouseState = MouseState.toggleMouseUp;
  patternsSelect.value = "default";
});

// Pattern Select

const sel0 = document.getElementById('sel0');
sel0.addEventListener('click', () => {
  mouseState = MouseState.toggleMouseUp;
  patternsSelect.value = "default";
});

const sp1 = document.getElementById('sp1');
sp1.addEventListener('click', () => {
  mouseState = MouseState.showPattern;;
  selectedPattern = Patterns.glider;
});

const sp2 = document.getElementById('sp2');
sp2.addEventListener('click', () => {
  mouseState = MouseState.showPattern;
  selectedPattern = Patterns.lwss;
});

const sp4 = document.getElementById('sp4');
sp4.addEventListener('click', () => {
  mouseState = MouseState.showPattern;
  selectedPattern = Patterns.hwss;
});


const puf1 = document.getElementById('puf1');
puf1.addEventListener('click', () => {
  mouseState = MouseState.showPattern;;
  selectedPattern = Patterns.puffer1;
});

const puf2 = document.getElementById('puf2');
puf2.addEventListener('click', () => {
  mouseState = MouseState.showPattern;;
  selectedPattern = Patterns.puffer2;
});


const osc1 = document.getElementById('osc1');
osc1.addEventListener('click', () => {
  mouseState = MouseState.showPattern;;
  selectedPattern = Patterns.blinker;
});

const osc2 = document.getElementById('osc2');
osc2.addEventListener('click', () => {
  mouseState = MouseState.showPattern;;
  selectedPattern = Patterns.pentadecathlon;
});

const osc3 = document.getElementById('osc3');
osc3.addEventListener('click', () => {
  mouseState = MouseState.showPattern;;
  selectedPattern = Patterns.pentadecathlon_synthesis;
});

const osc4 = document.getElementById('osc4');
osc4.addEventListener('click', () => {
  mouseState = MouseState.showPattern;;
  selectedPattern = Patterns.pulsar;
});

const osc5 = document.getElementById('osc5');
osc5.addEventListener('click', () => {
  mouseState = MouseState.showPattern;;
  selectedPattern = Patterns.pre_pulsar;
});

const osc6 = document.getElementById('osc6');
osc6.addEventListener('click', () => {
  mouseState = MouseState.showPattern;;
  selectedPattern = Patterns.galaxy;
});

const osc7 = document.getElementById('osc7');
osc7.addEventListener('click', () => {
  mouseState = MouseState.showPattern;;
  selectedPattern = Patterns.clock;
});


const mtsl1 = document.getElementById('mtsl1');
mtsl1.addEventListener('click', () => {
  mouseState = MouseState.showPattern;;
  selectedPattern = Patterns.acorn;
});

const mtsl2 = document.getElementById('mtsl2');
mtsl2.addEventListener('click', () => {
  mouseState = MouseState.showPattern;;
  selectedPattern = Patterns.pi_heptomino;
});

const other1 = document.getElementById('other1');
other1.addEventListener('click', () => {
  mouseState = MouseState.showPattern;;
  selectedPattern = Patterns.line;
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