import { drawGrid } from './visualizer.js';

export const rows = 10;
export const cols = 10;
export const start = { x: 0, y: 0 };
let grid;
let goal = { x: cols - 1, y: rows - 1 };

export function getGrid() { return grid; }
export function getGoal() { return goal; }
export function getStart() { return start; }


// Initialize grid first
export function initializeGrid() {
    const newGrid = [];
    for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
            row.push({ 
                wall: false, 
                weight: 1, 
                x, 
                y 
            });
        }
        newGrid.push(row);
    }
    grid = newGrid;
    resetSpecialCells();
    return grid;
}

function resetSpecialCells() {
    grid[start.y][start.x] = { ...grid[start.y][start.x], wall: false, weight: 1 };
    grid[goal.y][goal.x] = { ...grid[goal.y][goal.x], wall: false, weight: 1 };
}

initializeGrid();

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

