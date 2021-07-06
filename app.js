const ROWS = 10;
const COLS = 10;
const REPRODUCTION_TIME = 100;

const grid = new Array(ROWS);
const nextGrid = new Array(ROWS);
const gridDOM = new Array(ROWS);
const controls = {
    startButton : document.querySelector('#start')
}
let isPlaying = false;
let timer;

//initialize 3 arrays ROWS * COLS
function initializeGrids() {
    for (let i = 0; i < ROWS; i++) {
        grid[i] = new Array(COLS);
        nextGrid[i] = new Array(COLS);
        gridDOM[i] = new Array(COLS);
    }
}

//set elements of 2 arrays to 0
function resetGrids() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

//set next generation
function copyAndResetGrid() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

// Initialize
function initialize() {
    createTable();
    initializeGrids();
    resetGrids();
    setupControlButtons();
}

// Create table view of game
function createTable() {
    const gridContainer = document.querySelector('#gridContainer');
    const table = document.createElement("table");
    
    for (let i = 0; i < ROWS; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < COLS; j++) {
            const cell = document.createElement("td");
            gridDOM[i][j] = cell;
            cell.setAttribute("id", `_${ i }_${ j }`);
            cell.setAttribute("class", "dead");
            cell.addEventListener('click', cellClickHandler);
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}

function cellClickHandler() {
    let rowcol = this.id.split("_");
    let row = rowcol[0];
    let col = rowcol[1];
    
    let classes = this.getAttribute("class");
    if(classes.indexOf("live") > -1) {
        this.setAttribute("class", "dead");
        grid[row][col] = 0;
    } else {
        this.setAttribute("class", "live");
        grid[row][col] = 1;
    }       
}

function updateView() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            let cell = document.getElementById(`_${ i }_${ j }`);
            if (grid[i][j] == 0) {
                cell.setAttribute("class", "dead");
            } else {
                cell.setAttribute("class", "live");
            }
        }
    }
}

//add listeners to buttons
function setupControlButtons() {
    // button to start
    controls.startButton.addEventListener('click', startButtonHandler);
    
    // button to clear
    document.querySelector('#clear').addEventListener('click', clearButtonHandler);

    // button to set random initial state
    document.querySelector('#random').addEventListener('click', randomButtonHandler);
}

// clear the grid
function clearButtonHandler() {
    
    isPlaying = false;
    controls.startButton.innerHTML = "Start";    
    clearTimeout(timer);
    
    let cellsList = document.getElementsByClassName("live");
    // convert to array first, otherwise, you're working on a live node list
    // and the update doesn't work!
    let cells = [];
    for (let i = 0; i < cellsList.length; i++) {
        cells.push(cellsList[i]);
    }
    
    for (let i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "dead");
    }
    resetGrids;
}

function randomButtonHandler() {
    if (isPlaying) return;
    clearButtonHandler();
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            let isLive = Math.round(Math.random());
            if (isLive == 1) {
                let cell = document.getElementById(`_${ i }_${ j }`);
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
            }
        }
    }
}

// start/pause/continue the game
function startButtonHandler() {
    isPlaying = !isPlaying;

    if (!isPlaying) {
        this.textContent = "Continue";
        clearTimeout(timer);
    } else {
        this.textContent = "Pause";
        play();
    }
}

// run the life game
function play() {
    computeNextGen();
    
    if (isPlaying) {
        timer = setTimeout(play, REPRODUCTION_TIME);
    }
}

//check rules, reset, update view
function computeNextGen() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            applyRules(i, j);
        }
    }
    
    // copy NextGrid to grid, and reset nextGrid
    copyAndResetGrid();
    // copy all 1 values to "live" in the table
    updateView();
}

// RULES
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
function applyRules(row, col) {
    const numNeighbors = countNeighbors(row, col);

    if (numNeighbors < 2 || numNeighbors > 3) {
        nextGrid[row][col] = 0;
        return;
    }

    if (numNeighbors == 3) {
        nextGrid[row][col] = 1;
        return;
    }

    if(grid[row][col] == 1 && numNeighbors == 2){
        nextGrid[row][col] = 1;
    }
}

//if neighbour exist, return 1, else 0
function checkNeighbour(row, col){
    if(row - 1 < 0 
        || col - 1 < 0
        || col + 1 > COLS
        || row + 1 > ROWS) return 0;

    return grid[row][col];
}

// return count of neighbours
function countNeighbors(row, col) {
    let count = 0;

    count += checkNeighbour[row - 1][col - 1];
    count += checkNeighbour[row - 1][col];
    count += checkNeighbour[row - 1][col + 1];
    count += checkNeighbour[row][col - 1];
    count += checkNeighbour[row][col + 1];
    count += checkNeighbour[row + 1][col - 1];
    count += checkNeighbour[row + 1][col];
    count += checkNeighbour[row + 1][col + 1];
    
    return count;
}

// Start everything
initialize();