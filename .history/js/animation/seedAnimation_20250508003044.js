import { getGoal, rows, cols,  getGrid } from '../gridManager.js';
import { ctx, canvases, spriteSheet, GROUND_SPRITE_WIDTH, GROUND_SPRITE_HEIGHT } from '../visualizer.js';

// Seed constants
export const SEED_SPRITE_WIDTH = 26;
export const SEED_SPRITE_HEIGHT = 48;
const SEED_ANIMATION_INTERVAL = 300;
export let goalReached = false;

// Seed animation variables
const seedImages = [];
export let seedIndex = 0;
let seedAnimationInterval = null;
export let seedImagesLoaded = false;

// Load seed images with a callback when done
export function loadSeedImages(redrawCallback) {
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
            console.log(`Loaded seed image: ${file}`);
            if (loadedCount === seedFiles.length) {
                console.log('All seed images loaded successfully!');
                seedImagesLoaded = true;
                if (redrawCallback) redrawCallback();
            }
        };
        img.onerror = (err) => {
            console.error(`Failed to load seed image: ${file}`, err);
            loadedCount++;
        };
        img.src = file;
        seedImages.push(img);
    });
}

export function setGoalReached(reached) {
    goalReached = reached;
    
    // If goal is reached and we want to ensure hamster is visible,
    // we can force a final redraw of all canvases from here
    if (reached) {
        const grid = getGrid();
                    const goalCell = grid[goalPos.y][goalPos.x];
                    
                    // First draw the ground under the hamster
                    let sx, sy;
                    if (goalCell.wall) {
                        sx = 4 * GROUND_SPRITE_WIDTH;
                        sy = GROUND_SPRITE_HEIGHT;
                    } else {
                        sx = GROUND_SPRITE_WIDTH;
                        sy = GROUND_SPRITE_HEIGHT;
                    }
                    
                    // Draw the ground tile at goal position (this happens before hamster)
                    ctx.drawImage(
                        spriteSheet,
                        sx, sy, GROUND_SPRITE_WIDTH, GROUND_SPRITE_HEIGHT,
                        goalPos.x * cellSize, goalPos.y * cellSize, cellSize, cellSize
                    );
                    
                    // Then re-draw the hamster at the goal position (this makes it appear on top)
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
        // Optional: force a final redraw that ensures hamster is on top
        // You could call a function to redraw just the goal cell with the hamster
    }
}

// Draw seed at goal position
export function drawSeedGoal(currentCtx, goalPos, cellSize) {
    if (!seedImagesLoaded || seedImages.length === 0) {
        return;
    }
    
    const goalX = goalPos.x * cellSize;
    const goalY = goalPos.y * cellSize;

    // Draw seed image
    const seedImage = seedImages[seedIndex];
    if (!seedImage) {
        return;
    }
    
    const scaleFactor = Math.min(
        (cellSize * 0.8) / SEED_SPRITE_WIDTH,
        (cellSize * 0.8) / SEED_SPRITE_HEIGHT
    );
    const scaledWidth = SEED_SPRITE_WIDTH * scaleFactor;
    const scaledHeight = SEED_SPRITE_HEIGHT * scaleFactor;

    currentCtx.drawImage(
        seedImage,
        0, 0, SEED_SPRITE_WIDTH, SEED_SPRITE_HEIGHT,
        goalX + (cellSize - scaledWidth) / 2,
        goalY + (cellSize - scaledHeight) / 2,
        scaledWidth,
        scaledHeight
    );
}

// Control seed animation - independent of grid redrawing
export function startSeedAnimation() {
    console.log('Starting seed animation');
    if (!seedImagesLoaded) {
        console.log('Seed images not loaded yet, loading now...');
        loadSeedImages(() => {
            console.log('Images loaded, now starting animation');
            startSeedAnimation();
        });
        return;
    }
    
    stopSeedAnimation();
    console.log('Setting up animation interval');
    seedAnimationInterval = setInterval(() => {
        seedIndex = (seedIndex + 1) % seedImages.length;
        redrawSeedOverPath();
    }, SEED_ANIMATION_INTERVAL);
}

export function stopSeedAnimation() {
    if (seedAnimationInterval) {
        console.log('Stopping seed animation');
        clearInterval(seedAnimationInterval);
        seedAnimationInterval = null;
    }
}

// Simplified function to ensure the seed is drawn over any path visualizations
export function redrawSeedOverPath() {
    if (!seedImagesLoaded) return;
    
    if (goalReached) return;

    const goalPos = getGoal();
    const grid = getGrid();
    
    for (const algorithmId in ctx) {
        const currentCtx = ctx[algorithmId];
        const canvas = canvases[algorithmId];
        const cellSize = Math.min(canvas.width / cols, canvas.height / rows);
        
        // Clear just the goal cell area first
        const cell = grid[goalPos.y][goalPos.x];
        
        // Redraw the ground tile at goal position
        let sx, sy;
        if (cell.wall) {
            // Use appropriate wall sprite based on position
            // (This should match your existing wall sprite selection logic)
            sx = 4 * GROUND_SPRITE_WIDTH;
            sy = GROUND_SPRITE_HEIGHT;
        } else {
            // Use appropriate ground sprite based on position
            // (This should match your existing ground sprite selection logic)
            sx = GROUND_SPRITE_WIDTH;
            sy = GROUND_SPRITE_HEIGHT;
        }
        
        // Redraw the ground tile
        currentCtx.drawImage(
            spriteSheet,
            sx, sy, GROUND_SPRITE_WIDTH, GROUND_SPRITE_HEIGHT,
            goalPos.x * cellSize, goalPos.y * cellSize, cellSize, cellSize
        );
        
        // Now draw the seed image at the goal position
        drawSeedGoal(currentCtx, goalPos, cellSize);
    }
}
