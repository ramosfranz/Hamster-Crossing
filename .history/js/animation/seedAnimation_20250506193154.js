import { getGoal } from '../gridManager.js';
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
            if (loadedCount === seedFiles.length) {
                seedImagesLoaded = true;
                if (redrawCallback) redrawCallback();
            }
        };
        img.onerror = () => loadedCount++;
        img.src = file;
        seedImages.push(img);
    });
}

// Draw seed at goal position
export function drawSeedGoal(currentCtx, goalPos, cellSize) {
    const goalX = goalPos.x * cellSize;
    const goalY = goalPos.y * cellSize;

    // Draw seed image
    const seedImage = seedImages[seedIndex];
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

// Control seed animation
export function startSeedAnimation(redrawCallback) {
    if (!seedImagesLoaded) {
        loadSeedImages(redrawCallback);
        return;
    }
    
    stopSeedAnimation();
    seedAnimationInterval = setInterval(() => {
        seedIndex = (seedIndex + 1) % seedImages.length;
        if (redrawCallback) redrawCallback();
    }, SEED_ANIMATION_INTERVAL);
}

export function stopSeedAnimation() {
    if (seedAnimationInterval) {
        clearInterval(seedAnimationInterval);
        seedAnimationInterval = null;
    }
}