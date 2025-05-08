import { drawGrid } from './visualizer.js';

export const rows = 10;
export const cols = 10;
export const start = { x: 0, y: 0 };

let grid = [];
let goal = { x: cols - 1, y: rows - 1 };

export function getGrid() { return grid; }
export function getGoal() { return goal; }
export function getStart() { return start; }

export function setGoal(newGoal) {
    // Clear old goal cell
    const oldGoal = goal;
    grid[oldGoal.y][oldGoal.x] = {
        ...grid[oldGoal.y][oldGoal.x],
        wall: false,
        weight: 1
    };
    
    // Set new goal
    goal = newGoal;
    
    // Update new goal cell
    grid[newGoal.y][newGoal.x] = {
        ...grid[newGoal.y][newGoal.x],
        wall: false,
        weight: 1
    };
}


export function initializeGrid() {
    grid = [];
    for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
            row.push({ wall: false, weight: 1, x, y });
        }
        grid.push(row);
    }
    resetSpecialCells();
    drawGrid();
}

function resetSpecialCells() {
    grid[start.y][start.x] = { ...grid[start.y][start.x], wall: false, weight: 1 };
    grid[goal.y][goal.x] = { ...grid[goal.y][goal.x], wall: false, weight: 1 };
}

export function generateRandomGrid() {
    grid = [];
    for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
            row.push({ wall: Math.random() < 0.2, weight: 1, x, y });
        }
        grid.push(row);
    }
    placeRandomGoal();
    resetSpecialCells();
    drawGrid();
}

function placeRandomGoal() {
    let goalPlaced = false;
    while (!goalPlaced) {
        const randomX = Math.floor(Math.random() * cols);
        const randomY = Math.floor(Math.random() * rows);
        if ((randomX !== start.x || randomY !== start.y) && !grid[randomY][randomX].wall) {
            goal = { x: randomX, y: randomY };
            goalPlaced = true;
        }
    }
}

export function addRandomWeights() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if ((x === start.x && y === start.y) || (x === goal.x && y === goal.y) || grid[y][x].wall) continue;
            grid[y][x].weight = Math.floor(Math.random() * 5) + 1;
        }
    }
    drawGrid();
}

export function drawGrid() {
    const spriteWidth = 40;
    const spriteHeight = 40;
    const cellSize = Math.min(canvas.width / cols, canvas.height / rows);
    const grid = getGrid();

    // Clear all canvases
    for (const ctxKey in ctx) {
        ctx[ctxKey].clearRect(0, 0, canvas.width, canvas.height);
    }

    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            let sx, sy;

            if (cell.wall) {
                // Wall tile mapping (columns 3-5 in sprite sheet)
                const isLeftEdge = x === 0;
                const isRightEdge = x === cols - 1;
                const isTopEdge = y === 0;
                const isBottomEdge = y === rows - 1;

                // Rock edges (first and last columns, top/bottom rows)
                if (isLeftEdge || isRightEdge || isTopEdge || isBottomEdge) {
                    if (isTopEdge) {
                        sx = 3 * spriteWidth;  // Rock top edge
                        sy = 0;
                    } else if (isBottomEdge) {
                        sx = 3 * spriteWidth;  // Rock bottom edge
                        sy = 2 * spriteHeight;
                    } else if (isLeftEdge) {
                        sx = 3 * spriteWidth;  // Rock left edge
                        sy = 1 * spriteHeight;
                    } else if (isRightEdge) {
                        sx = 5 * spriteWidth;  // Rock right edge
                        sy = 1 * spriteHeight;
                    }
                } else {
                    // Inner walls - alternate between soil hole and flower
                    const isEven = (x + y) % 2 === 0;
                    sx = isEven ? 4 * spriteWidth : 5 * spriteWidth;
                    sy = 1 * spriteHeight;  // Middle row of sprite sheet
                }
            } else {
                // Ground tiles (columns 0-2 in sprite sheet)
                if (x === start.x && y === start.y) {
                    sx = 0;  // Start position
                    sy = 0;
                } else if (x === goal.x && y === goal.y) {
                    sx = 2 * spriteWidth;  // Goal position
                    sy = 2 * spriteHeight;
                } else {
                    // Basic grass pattern with variations
                    const variant = (x % 3) + (y % 3);
                    sx = (variant % 3) * spriteWidth;
                    sy = Math.floor(variant / 3) * spriteHeight;
                }
            }

            // Draw on all registered canvases
            for (const ctxKey in ctx) {
                ctx[ctxKey].drawImage(
                    spriteSheet,
                    sx, sy, spriteWidth, spriteHeight,
                    x * cellSize, y * cellSize, cellSize, cellSize
                );
            }
        });
    });
}