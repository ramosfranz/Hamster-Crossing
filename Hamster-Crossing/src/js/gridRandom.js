const rows = 10;
const cols = 10;
const cellSize = 40;
const waitSecondsSearch = 100;
const waitSecondsPath = 200;
const start = { x: 0, y: 0 };
let searchInProgress = false;
let goal = { x: cols - 1, y: rows - 1 };
let grid = [];


// initialize canvases
const aStarCanvas = document.getElementById("aStarCanvas");
const dijkstraCanvas = document.getElementById("dijkstraCanvas");
const aStarCtx = aStarCanvas.getContext("2d");
const dijkstraCtx = dijkstraCanvas.getContext("2d");

function initializeGrid() {
    grid = [];
    for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
            row.push({ wall: Math.random() < 0.2, x, y });
        }
        grid.push(row);
    }

    let goalPlaced = false;
    while (!goalPlaced) {
        const randomX = Math.floor(Math.random() * cols);
        const randomY = Math.floor(Math.random() * rows);
        if ((randomX !== start.x || randomY !== start.y) && !grid[randomY][randomX].wall) {
            goal = { x: randomX, y: randomY };
            goalPlaced = true;
        }
    }

    grid[start.y][start.x].wall = false;
    grid[goal.y][goal.x].wall = false;
    drawGrid();

    const hamsterWidth = 69, hamsterHeight = 82;
    const scaleFactor = Math.min(cellSize / hamsterHeight, cellSize / hamsterWidth);
    const scaledWidth = hamsterWidth * scaleFactor;
    const scaledHeight = hamsterHeight * scaleFactor;

    aStarCtx.drawImage(hamsterImage, start.x * cellSize + (cellSize - scaledWidth) / 2, start.y * cellSize + (cellSize - scaledHeight) / 2, scaledWidth, scaledHeight);
    dijkstraCtx.drawImage(hamsterImage, start.x * cellSize + (cellSize - scaledWidth) / 2, start.y * cellSize + (cellSize - scaledHeight) / 2, scaledWidth, scaledHeight);

    seedVisible = true;
    startSeedAnimation();
    updateWarningMessage();
}

// visuals of grid
function drawGrid() {
    aStarCtx.clearRect(0, 0, aStarCanvas.width, aStarCanvas.height);
    dijkstraCtx.clearRect(0, 0, dijkstraCanvas.width, dijkstraCanvas.height);

    const spriteWidth = 40;  // each sprite in the sheet is 40x40
    const spriteHeight = 40;

    for (const row of grid) {
        for (const cell of row) {
            let sx, sy; // source coordinates for the sprite

            if (cell.wall) {
                // handle obstacles (right 3x3 of the sprite sheet)
                if (cell.x === 0 && cell.y === 0) {
                    // Top-left corner of obstacles
                    sx = 3 * spriteWidth;
                    sy = 0;
                } else if (cell.x === cols - 1 && cell.y === rows - 1) {
                    // Bottom-right corner of obstacles
                    sx = 5 * spriteWidth;
                    sy = 2 * spriteHeight;
                } else if (cell.x === 0) {
                    // Left edge (but not corners)
                    sx = 3 * spriteWidth;
                    sy = spriteHeight;
                } else if (cell.y === 0) {
                    // Top edge (but not corners)
                    sx = 4 * spriteWidth;
                    sy = 0;
                } else if (cell.x === cols - 1) {
                    // Right edge (but not corners)
                    sx = 5 * spriteWidth;
                    sy = spriteHeight;
                } else if (cell.y === rows - 1) {
                    // Bottom edge (but not corners)
                    sx = 4 * spriteWidth;
                    sy = 2 * spriteHeight;
                } else {
                    // Middle obstacle tile
                    sx = 4 * spriteWidth;
                    sy = spriteHeight;
                }
            } else {
                // Handle grass (left 3x3 of the sprite sheet)
                if (cell.x === 0 && cell.y === 0) {
                    // Top-left corner of grass
                    sx = 0;
                    sy = 0;
                } else if (cell.x === cols - 1 && cell.y === rows - 1) {
                    // Bottom-right corner of grass
                    sx = 2 * spriteWidth;
                    sy = 2 * spriteHeight;
                } else if (cell.x === 0) {
                    // Left edge (but not corners)
                    sx = 0;
                    sy = spriteHeight;
                } else if (cell.y === 0) {
                    // Top edge (but not corners)
                    sx = spriteWidth;
                    sy = 0;
                } else if (cell.x === cols - 1) {
                    // Right edge (but not corners)
                    sx = 2 * spriteWidth;
                    sy = spriteHeight;
                } else if (cell.y === rows - 1) {
                    // Bottom edge (but not corners)
                    sx = spriteWidth;
                    sy = 2 * spriteHeight;
                } else {
                    // Middle grass tile
                    sx = spriteWidth;
                    sy = spriteHeight;
                }
            }

            // draw the sprite on the grid
            aStarCtx.drawImage(spriteSheet, sx, sy, spriteWidth, spriteHeight, cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
            dijkstraCtx.drawImage(spriteSheet, sx, sy, spriteWidth, spriteHeight, cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
        }
    }
}

// utility functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getNeighbors({ x, y }) {
    const neighbors = [];
    if (x > 0 && !grid[y][x - 1].wall) neighbors.push(grid[y][x - 1]);
    if (x < cols - 1 && !grid[y][x + 1].wall) neighbors.push(grid[y][x + 1]);
    if (y > 0 && !grid[y - 1][x].wall) neighbors.push(grid[y - 1][x]);
    if (y < rows - 1 && !grid[y + 1][x].wall) neighbors.push(grid[y + 1][x]);
    return neighbors;
}

window.onload = function() {
    initializeGrid();
};