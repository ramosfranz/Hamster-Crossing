import { getGoal, rows, cols } from '../gridManager.js';
import { ctx, canvases } from '../visualizer.js';
// Seed constants
export const SEED_SPRITE_WIDTH = 26;
export const SEED_SPRITE_HEIGHT = 48;
const SEED_ANIMATION_INTERVAL = 300;

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
    
    const goalPos = getGoal();
    
    for (const algorithmId in ctx) {
        const currentCtx = ctx[algorithmId];
        const canvas = canvases[algorithmId];
        const cellSize = Math.min(canvas.width / cols, canvas.height / rows);
        
        // Directly draw the seed image at the goal position
        drawSeedGoal(currentCtx, goalPos, cellSize);
    }
}