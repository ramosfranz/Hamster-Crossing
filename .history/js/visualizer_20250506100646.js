import { rows, cols, getGrid, getGoal, getStart, start} from './gridManager.js';
import { sleep } from './utils.js';  

export const canvases = {};
export const ctx = {};
const SPRITE_WIDTH = 40;
const SPRITE_HEIGHT = 40;
const spriteSheet = new Image();
spriteSheet.src = 'assets/images/sprites/hamu_ground.png'
characterspriteSheet.src = 'assets/images/sprites/hamu_sprite'
const SPRITE_MAP = {
    front: { transition: [0, 0], animation: [[0, 1], [0, 2]] },
    back: { transition: [0, 3], animation: [[0, 4], [0, 5]] },
    left: { transition: [1, 0], animation: [[1, 1], [1, 2]] },
    right: { transition: [1, 3], animation: [[1, 4], [1, 5]] }
};
const scaleFactor = Math.min(cellSize / SPRITE_HEIGHT, cellSize / SPRITE_WIDTH);
const scaledWidth = SPRITE_WIDTH * scaleFactor;
const scaledHeight = SPRITE_HEIGHT * scaleFactor;

export function registerCanvas(gridId, canvas) {
    canvases[gridId] = canvas;
    ctx[gridId] = canvas.getContext('2d');
}
export function drawGrid() {
    const grid = getGrid();
    const start = getStart();
    const goal = getGoal();

    // Draw on all registered canvases
    for (const algorithmId in ctx) {
        const currentCtx = ctx[algorithmId];
        const canvas = canvases[algorithmId];
        const cellSize = Math.min(canvas.width / cols, canvas.height / rows);
        if (!grid || !grid.length || !Object.keys(ctx).length) return;

        currentCtx.clearRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = grid[y][x];
                let sx, sy;

                if (cell.wall) {
                    // Wall sprites (columns 3-5)
                    if (x === 0 && y === 0) { 
                        sx = 3 * SPRITE_WIDTH;
                        sy = 0;
                    } else if (x === cols - 1 && y === rows - 1) {
                        sx = 5 * SPRITE_WIDTH;
                        sy = 2 * SPRITE_HEIGHT;
                    } else if (x === 0) {
                        sx = 3 * SPRITE_WIDTH;
                        sy = SPRITE_HEIGHT;
                    } else if (y === 0) { 
                        sx = 4 * SPRITE_WIDTH;
                        sy = 0;
                    } else if (y === rows - 1) {
                        sx = 4 * SPRITE_WIDTH;
                        sy = 2 * SPRITE_HEIGHT;
                    } else if (x === cols - 1) { 
                        sx = 5 * SPRITE_WIDTH;
                        sy = SPRITE_HEIGHT;
                    } else { 
                        sx = 4 * SPRITE_WIDTH;
                        sy = SPRITE_HEIGHT;
                    }
                } else {
                    // Ground sprites (columns 0-2)
                    if (x === 0 && y === 0) {
                        sx = 0;
                        sy = 0;
                    } else if (x === cols - 1 && y === rows - 1) { // Goal
                        sx = 2 * SPRITE_WIDTH;
                        sy = 2 * SPRITE_HEIGHT;
                    } else if (x === 0){
                        sx = 0;
                        sy = SPRITE_HEIGHT;
                    } else if (y === 0){
                        sx = SPRITE_WIDTH;
                        sy = 0;
                    } else if (x === cols - 1) {
                        sx = 2 * SPRITE_WIDTH
                        sy = SPRITE_HEIGHT
                    } else if (y === rows - 1) {
                        sx = SPRITE_WIDTH;
                        sy = 2 * SPRITE_HEIGHT;
                    } 
                    else {
                        sx = SPRITE_WIDTH
                        sy = SPRITE_HEIGHT
                    }
                }

                currentCtx.drawImage(
                    spriteSheet,
                    sx, sy, SPRITE_WIDTH, SPRITE_HEIGHT,
                    x * cellSize, y * cellSize, cellSize, cellSize
                );

                // Draw weight text if needed
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

