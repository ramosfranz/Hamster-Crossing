import { rows, cols, getGrid, getGoal, getStart } from './gridManager.js';
import { sleep } from './utils.js';
import { isHamsterAtGoal } from './gridManager.js';
import { 
    seedImagesLoaded,
    drawSeedGoal,
    startSeedAnimation,
    stopSeedAnimation,
    loadSeedImages,
    redrawSeedOverPath
} from './animation/seedAnimation.js';

export const canvases = {};
export const ctx = {};
const visitedCells = [];
export const GROUND_SPRITE_WIDTH = 40;
export const GROUND_SPRITE_HEIGHT = 40;
const HAMSTER_SPRITE_WIDTH = 69;
const HAMSTER_SPRITE_HEIGHT = 82;
const ANIMATION_FRAMES = 2;

// Sprite sheets
export const spriteSheet = new Image();
spriteSheet.src = 'assets/images/sprites/hamu_ground.png';

const hamsterSpriteSheet = new Image();
hamsterSpriteSheet.src = 'assets/images/sprites/hamu_sprite.png';

// Animation frames
const SPRITE_MAP = {
    front: { transition: [0, 0], animation: [[0, 1], [0, 2]] },
    back: { transition: [0, 3], animation: [[0, 4], [0, 5]] },
    left: { transition: [1, 0], animation: [[1, 1], [1, 2]] },
    right: { transition: [1, 3], animation: [[1, 4], [1, 5]] }
};

export function registerCanvas(gridId, canvas) {
    canvases[gridId] = canvas;
    ctx[gridId] = canvas.getContext('2d');
}

export function drawGrid() {
    const grid = getGrid();
    const startPos = getStart();
    const goalPos = getGoal();

    if (!grid || !grid.length) {
        console.error("Grid is not properly initialized");
        return;
    }

    for (const algorithmId in ctx) {
        const currentCtx = ctx[algorithmId];
        const canvas = canvases[algorithmId];
        const cellSize = Math.min(canvas.width / cols, canvas.height / rows);

        // Clear canvas first
        currentCtx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid cells
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = grid[y][x];
                let sx, sy;

                if (cell.wall) {
                    // Wall sprites
                    if (x === 0 && y === 0) {
                        sx = 3 * GROUND_SPRITE_WIDTH;
                        sy = 0;
                    } else if (x === cols - 1 && y === rows - 1) {
                        sx = 5 * GROUND_SPRITE_WIDTH;
                        sy = 2 * GROUND_SPRITE_HEIGHT;
                    } else if (x === 0) {
                        sx = 3 * GROUND_SPRITE_WIDTH;
                        sy = GROUND_SPRITE_HEIGHT;
                    } else if (y === 0) {
                        sx = 4 * GROUND_SPRITE_WIDTH;
                        sy = 0;
                    } else if (y === rows - 1) {
                        sx = 4 * GROUND_SPRITE_WIDTH;
                        sy = 2 * GROUND_SPRITE_HEIGHT;
                    } else if (x === cols - 1) {
                        sx = 5 * GROUND_SPRITE_WIDTH;
                        sy = GROUND_SPRITE_HEIGHT;
                    } else {
                        sx = 4 * GROUND_SPRITE_WIDTH;
                        sy = GROUND_SPRITE_HEIGHT;
                    }
                } else {
                    // Ground sprites
                    if (x === 0 && y === 0) {
                        sx = 0;
                        sy = 0;
                    } else if (x === cols - 1 && y === rows - 1) {
                        sx = 2 * GROUND_SPRITE_WIDTH;
                        sy = 2 * GROUND_SPRITE_HEIGHT;
                    } else if (x === 0) {
                        sx = 0;
                        sy = GROUND_SPRITE_HEIGHT;
                    } else if (y === 0) {
                        sx = GROUND_SPRITE_WIDTH;
                        sy = 0;
                    } else if (x === cols - 1) {
                        sx = 2 * GROUND_SPRITE_WIDTH;
                        sy = GROUND_SPRITE_HEIGHT;
                    } else if (y === rows - 1) {
                        sx = GROUND_SPRITE_WIDTH;
                        sy = 2 * GROUND_SPRITE_HEIGHT;
                    } else {
                        sx = GROUND_SPRITE_WIDTH;
                        sy = GROUND_SPRITE_HEIGHT;
                    }
                }

                currentCtx.drawImage(
                    spriteSheet,
                    sx, sy, GROUND_SPRITE_WIDTH, GROUND_SPRITE_HEIGHT,
                    x * cellSize, y * cellSize, cellSize, cellSize
                );

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

        // Draw hamster
        if (hamsterSpriteSheet.complete) {
            const scaleFactor = Math.min(cellSize / HAMSTER_SPRITE_HEIGHT, cellSize / HAMSTER_SPRITE_WIDTH) * 0.8;
            const scaledWidth = HAMSTER_SPRITE_WIDTH * scaleFactor;
            const scaledHeight = HAMSTER_SPRITE_HEIGHT * scaleFactor;

            currentCtx.drawImage(
                hamsterSpriteSheet,
                0, 0, HAMSTER_SPRITE_WIDTH, HAMSTER_SPRITE_HEIGHT,
                startPos.x * cellSize + (cellSize - scaledWidth) / 2,
                startPos.y * cellSize + (cellSize - scaledHeight) / 2,
                scaledWidth,
                scaledHeight
            );
        }
    }

    // Draw seeds for all canvases
    for (const algorithmId in ctx) {
        const currentCtx = ctx[algorithmId];
        const canvas = canvases[algorithmId];
        const cellSize = Math.min(canvas.width / cols, canvas.height / rows);
        
        // Only draw the seed during initial grid drawing if we're not animating
        if (seedImagesLoaded) {
            drawSeedGoal(currentCtx, goalPos, cellSize);
        }
    }
}

export async function drawPathWithHead(ctx, cameFrom, current, lineColor, headColor) {
    isHamsterAtGoal = false; 
    const path = [];
    const canvas = ctx.canvas;
    const cellSize = Math.min(canvas.width / cols, canvas.height / rows);
    const goalPos = getGoal();
    
    // Reconstruct path
    while (cameFrom[`${current.x},${current.y}`]) {
        path.push(current);
        current = cameFrom[`${current.x},${current.y}`];
    }
    path.push(current); // Add the start position
    path.reverse();
    
    // Add goal cell to path if it's not already there
    const lastCell = path[path.length - 1];
    if (!(lastCell.x === goalPos.x && lastCell.y === goalPos.y)) {
        path.push(goalPos); // Ensure the path includes the goal
    }

    let frameIndex = 0;

    for (let i = 0; i < path.length; i++) {
        const cell = path[i];
        
        // Fill the cell with the path color
        ctx.fillStyle = lineColor;
        ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
        
        // If we're at a previous step in the path, redraw those cells to maintain path visibility
        for (let j = 0; j < i; j++) {
            const prevCell = path[j];
            ctx.fillStyle = lineColor;
            ctx.fillRect(prevCell.x * cellSize, prevCell.y * cellSize, cellSize, cellSize);
        }
        
        // Draw hamster on current cell
        const direction = getMovementDirection(path, i, cell);
        const spriteFrame = getSpriteFrame(direction, i, frameIndex % ANIMATION_FRAMES);
        
        if (hamsterSpriteSheet.complete) {
            const scaleFactor = Math.min(cellSize / HAMSTER_SPRITE_HEIGHT, cellSize / HAMSTER_SPRITE_WIDTH) * 0.8;
            const scaledWidth = HAMSTER_SPRITE_WIDTH * scaleFactor;
            const scaledHeight = HAMSTER_SPRITE_HEIGHT * scaleFactor;

            ctx.drawImage(
                hamsterSpriteSheet,
                spriteFrame[1] * HAMSTER_SPRITE_WIDTH,
                spriteFrame[0] * HAMSTER_SPRITE_HEIGHT,
                HAMSTER_SPRITE_WIDTH,
                HAMSTER_SPRITE_HEIGHT,
                cell.x * cellSize + (cellSize - scaledWidth) / 2,
                cell.y * cellSize + (cellSize - scaledHeight) / 2,
                scaledWidth,
                scaledHeight
            );
        }
        
        // If this is the goal, redraw the seed animation on top
        if (cell.x === goalPos.x && cell.y === goalPos.y) {
            // Wait before redrawing the seed to ensure the hamster is visible at the goal
            isHamsterAtGoal = true;
           // await sleep(100);
           // redrawSeedOverPath();
        } else {
            isHamsterAtGoal = false;
        }
        
        frameIndex++;
        await sleep(200);
    }
}

function getMovementDirection(path, index, cell) {
    if (index === 0) return "front";
    const prevCell = path[index - 1];
    if (cell.x > prevCell.x) return "right";
    if (cell.x < prevCell.x) return "left";
    if (cell.y > prevCell.y) return "front";
    return "back";
}

function getSpriteFrame(direction, index, frameIndex) {
    const spriteFrames = SPRITE_MAP[direction];
    return index === 0 ? spriteFrames.transition : spriteFrames.animation[frameIndex];
}


// Initialize visualizer
export function initializeVisualizer() {
    drawGrid();
    loadSeedImages(drawGrid);
}