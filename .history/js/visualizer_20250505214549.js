import { rows, cols, getGrid, getGoal, getStart, start } from './gridManager.js';
import { sleep } from './utils.js';  

export const canvases = {};
export const ctx = {};
const SPRITE_WIDTH = 40;
const SPRITE_HEIGHT = 40;
const spriteSheet = new Image();
spriteSheet.src = 'assets\images\sprites\hamu_ground.png'


export function registerCanvas(gridId, canvas) {
    canvases[gridId] = canvas;
    ctx[gridId] = canvas.getContext('2d');
}

export function drawGrid() {
    const grid = getGrid();
    const goal = getGoal();
    
    for (const algorithmId in ctx) {
        const currentCtx = ctx[algorithmId];
        const canvas = canvases[algorithmId];
        const cellSize = canvas.width / cols;

        currentCtx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (const row of grid) {
            for (const cell of row) {
                if (cell.wall) {
                    currentCtx.fillStyle = "darkgray";
                } else if (cell.x === start.x && cell.y === start.y) {
                    currentCtx.fillStyle = "lightblue";
                } else if (cell.x === goal.x && cell.y === goal.y) {
                    currentCtx.fillStyle = "lightgreen";
                } else {
                    const intensity = 255 - (cell.weight - 1) * 40;
                    currentCtx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
                }
                
                currentCtx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
                currentCtx.strokeStyle = "gray";
                currentCtx.strokeRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);

                if (!cell.wall && cell.weight > 1) {
                    currentCtx.fillStyle = "black";
                    currentCtx.font = "12px Arial";
                    currentCtx.textAlign = "center";
                    currentCtx.textBaseline = "middle";
                    currentCtx.fillText(
                        cell.weight.toString(),
                        cell.x * cellSize + cellSize / 2,
                        cell.y * cellSize + cellSize / 2
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