import { rows, cols, getGrid, getGoal, getStart, start } from './gridManager.js';
import { sleep } from './utils.js';  

export const canvases = {};
export const ctx = {};
const SPRITE_WIDTH = 40;
const SPRITE_HEIGHT = 40;
const spriteSheet = new Image();
spriteSheet.src = 'assets/images/sprites/hamu_ground.png'


export function registerCanvas(gridId, canvas) {
    canvases[gridId] = canvas;
    ctx[gridId] = canvas.getContext('2d');
}

export function drawGrid() {
    const grid = getGrid();
    const start = getStart();
    const goal = getGoal();

    for (const algorithmId in ctx) {
        const currentCtx = ctx[algorithmId];
        const canvas = canvases[algorithmId];
        const cellSize = Math.min(canvas.width / cols, canvas.height / rows);

        currentCtx.clearRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = grid[y][x];
                let sx, sy;

                if (cell.wall) {
                    // Wall sprites
                    if (x === 0 && y === 0) {
                        sx = 3 * SPRITE_WIDTH;
                        sy = 0;
                    } else if (x === cols - 1 && y === 0) {
                        sx = 5 * SPRITE_WIDTH;
                        sy = 0;
                    } else if (x === 0 && y === rows - 1) {
                        sx = 3 * SPRITE_WIDTH;
                        sy = 2 * SPRITE_HEIGHT;
                    } else if (x === cols - 1 && y === rows - 1) {
                        sx = 5 * SPRITE_WIDTH;
                        sy = 2 * SPRITE_HEIGHT;
                    } else if (y === 0) {
                        sx = 4 * SPRITE_WIDTH;
                        sy = 0;
                    } else if (y === rows - 1) {
                        sx = 4 * SPRITE_WIDTH;
                        sy = 2 * SPRITE_HEIGHT;
                    } else if (x === 0) {
                        sx = 3 * SPRITE_WIDTH;
                        sy = SPRITE_HEIGHT;
                    } else if (x === cols - 1) {
                        sx = 5 * SPRITE_WIDTH;
                        sy = SPRITE_HEIGHT;
                    } else {
                        sx = 4 * SPRITE_WIDTH;
                        sy = SPRITE_HEIGHT;
                    }
                } else {
                    // Ground / start / goal
                    if (x === start.x && y === start.y) {
                        sx = 0;
                        sy = 0;
                    } else if (x === goal.x && y === goal.y) {
                        sx = 2 * SPRITE_WIDTH;
                        sy = 2 * SPRITE_HEIGHT;
                    } else {
                        const variation = (x % 3) + (y % 3);
                        sx = (variation % 3) * SPRITE_WIDTH;
                        sy = Math.floor(variation / 3) * SPRITE_HEIGHT;
                    }
                }

                // Draw sprite
                currentCtx.drawImage(
                    spriteSheet,
                    sx, sy, SPRITE_WIDTH, SPRITE_HEIGHT,
                    x * cellSize, y * cellSize, cellSize, cellSize
                );

                // Optional: stroke border
                currentCtx.strokeStyle = "gray";
                currentCtx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

                // Draw weight if applicable
                if (!cell.wall && cell.weight > 1) {
                    currentCtx.fillStyle = "black";
                    currentCtx.font = "12px Arial";
                    currentCtx.textAlign = "center";
                    currentCtx.textBaseline = "middle";
                    currentCtx.fillText(
                        cell.weight.toString(),
                        x * cellSize + cellSize / 2,
                        y * cellSize + cellSize / 2
                    );
                }
            }
        }
    }
}

export async function drawPathWithHead(ctx, cameFrom, current, lineColor, headColor) {
    const path = [];
    const canvas = ctx.canvas;
    const cellSize = canvas.width / cols;
    while (cameFrom[`${current.x},${current.y}`]) {
        path.push(current);
        current = cameFrom[`${current.x},${current.y}`];
    }
    path.reverse();

    for (let i = 0; i < path.length; i++) {
        const cell = path[i];
        
        if (i > 0) {
            ctx.fillStyle = lineColor;
            const prevCell = path[i - 1];
            ctx.fillRect(prevCell.x * cellSize, prevCell.y * cellSize, cellSize, cellSize);
        }

        ctx.fillStyle = lineColor;
        ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
        
        ctx.beginPath();
        ctx.arc(
            cell.x * cellSize + cellSize / 2,
            cell.y * cellSize + cellSize / 2,
            cellSize / 2.5,
            0,
            2 * Math.PI
        );
        ctx.fillStyle = headColor;
        ctx.fill();
        
        await sleep(200);
    }
}