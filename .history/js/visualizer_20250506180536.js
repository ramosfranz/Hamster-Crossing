import { rows, cols, getGrid, getGoal, getStart, start } from './gridManager.js';
import { sleep } from './utils.js';
import { seedImagesLoaded,   drawSeedGoal, startSeedAnimation, stopSeedAnimation, loadSeedImages } from './animation/seedAnimation.js';


export const canvases = {};
export const ctx = {};
const visitedCells = [];
const GROUND_SPRITE_WIDTH = 40;
const GROUND_SPRITE_HEIGHT = 40;
const HAMSTER_SPRITE_WIDTH = 69;
const HAMSTER_SPRITE_HEIGHT = 82;
const SEED_SPRITE_WIDTH = 26;
const SEED_SPRITE_HEIGHT = 48;
const ANIMATION_FRAMES = 2;
const SEED_ANIMATION_INTERVAL = 300;

// Sprite sheets
const spriteSheet = new Image();
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

// Seed animation
const seedImages = [];
let seedIndex = 0;
let seedAnimationInterval = null;
let seedImagesLoaded = false;

function loadSeedImages() {
    const seedFiles = [
        "assets/images/seed_animation/seed1.png",
        "assets/images/seed_animation/seed2.png",
        "assets/images/seed_animation/seed3.png"
    ];
    
    seedImages.length = 0;
    
    let loadedCount = 0;
    seedFiles.forEach(file => {
        const img = new Image();
        img.onload = () => {
            loadedCount++;
            if (loadedCount === seedFiles.length) {
                seedImagesLoaded = true;
                startSeedAnimation();
                drawGrid(); // Redraw after images load
            }
        };
        img.onerror = () => {
            loadedCount++;
        };
        img.src = file;
        seedImages.push(img);
    });
}

function drawSeedGoal(ctx, goal, cellSize) {
    const goalX = goal.x * cellSize;
    const goalY = goal.y * cellSize;
    
    // Draw ground tile first (use appropriate ground sprite coordinates)
    const groundSx =  GROUND_SPRITE_WIDTH; // Adjust based on your sprite sheet
    const groundSy =  GROUND_SPRITE_HEIGHT;
    ctx.drawImage(
        spriteSheet,
        groundSx, groundSy, GROUND_SPRITE_WIDTH, GROUND_SPRITE_HEIGHT,
        goalX, goalY, cellSize, cellSize
    );

    // Then draw seed (corrected drawImage parameters)
    const seedImage = seedImages[seedIndex];
    const scaleFactor = Math.min(
        (cellSize * 0.8) / SEED_SPRITE_WIDTH,
        (cellSize * 0.8) / SEED_SPRITE_HEIGHT
    );
    const scaledWidth = SEED_SPRITE_WIDTH * scaleFactor;
    const scaledHeight = SEED_SPRITE_HEIGHT * scaleFactor;

    ctx.drawImage(
        seedImage,
        0, 0, // Source X, Y (entire image)
        SEED_SPRITE_WIDTH, SEED_SPRITE_HEIGHT, // Source dimensions
        goalX + (cellSize - scaledWidth) / 2, // Destination X
        goalY + (cellSize - scaledHeight) / 2, // Destination Y
        scaledWidth, // Destination width
        scaledHeight // Destination height
    );
}


export function startSeedAnimation() {
    if (!seedImagesLoaded) {
        loadSeedImages();
        return;
    }
    
    stopSeedAnimation();
    
    seedAnimationInterval = setInterval(() => {
        seedIndex = (seedIndex + 1) % seedImages.length;
        drawGrid();
    }, SEED_ANIMATION_INTERVAL);
}

export function stopSeedAnimation() {
    if (seedAnimationInterval) {
        clearInterval(seedAnimationInterval);
        seedAnimationInterval = null;
    }
}

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

        // Draw seed at goal position
        
    }

    for (const algorithmId in ctx) {
        const currentCtx = ctx[algorithmId];
        const canvas = canvases[algorithmId];
        const cellSize = Math.min(canvas.width / cols, canvas.height / rows);
        
        if (seedImagesLoaded) {
            drawSeedGoal(currentCtx, goalPos, cellSize);
        }
    }
}

export async function drawPathWithHead(ctx, cameFrom, current, lineColor, headColor) {
    const path = [];
    const canvas = ctx.canvas;
    const cellSize = canvas.width / cols;
    const goalPos = getGoal();
    
    // Reconstruct path
    while (cameFrom[`${current.x},${current.y}`]) {
        path.push(current);
        current = cameFrom[`${current.x},${current.y}`];
    }
    path.reverse();

    let frameIndex = 0;
    for (let i = 0; i < path.length; i++) {
        const cell = path[i];
        if (cell.x === goalPos.x && cell.y === goalPos.y) continue;
        
        const direction = getMovementDirection(path, i, cell);
        const spriteFrame = getSpriteFrame(direction, i, frameIndex % ANIMATION_FRAMES);
        
        if (i > 0) {
            const prevCell = path[i - 1];
            if (!(prevCell.x === goalPos.x && prevCell.y === goalPos.y)) {
                ctx.fillStyle = lineColor;
                ctx.fillRect(prevCell.x * cellSize, prevCell.y * cellSize, cellSize, cellSize);
            }
        }

        ctx.fillStyle = lineColor;
        ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
        
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

function markVisited(ctx, row, col, cellSize) {
    ctx.save(); 
    ctx.globalAlpha = 0.3;       // semi-transparent
    ctx.fillStyle = 'yellow';   // or any highlight color
    ctx.fillRect(col*cellSize, row*cellSize, cellSize, cellSize);
    ctx.restore(); 
}

// Initialize everything when the page loads
export function initializeVisualizer() {
    loadSeedImages();
    drawGrid();
}
