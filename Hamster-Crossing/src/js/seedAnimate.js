// Seed animation constants and variables
const seedImages = [];
let seedIndex = 0;
let seedVisible = true;
let seedAnimationInterval;
let seedAnimationFrameId;

/**
 * Loads seed animation image files 
 */
function loadSeedImages() {
    const seedFiles = ["assets/images/seed_animation/seed1.png", "assets/images/seed_animation/seed2.png", "assets/images/seed_animation/seed3.png"];
    seedImages.length = 0;
    for (let file of seedFiles) {
        const img = new Image();
        img.src = file;
        seedImages.push(img);
    }
}

/**
 * Animates the seed by cycling through frames and drawing at goal position
 */
function animateSeed() {
    if (!seedVisible) return;
    seedIndex = (seedIndex + 1) % seedImages.length;
    const seedImage = seedImages[seedIndex];
    const goalX = goal.x * cellSize;
    const goalY = goal.y * cellSize;

    const spriteWidth = 40, spriteHeight = 40, grassSx = 40, grassSy = 40;
    const seedScaleFactor = Math.min(cellSize / 48, cellSize / 26);
    const scaledWidth = 26 * seedScaleFactor;
    const scaledHeight = 48 * seedScaleFactor;

    aStarCtx.clearRect(goalX, goalY, cellSize, cellSize);
    dijkstraCtx.clearRect(goalX, goalY, cellSize, cellSize);

    aStarCtx.drawImage(spriteSheet, grassSx, grassSy, spriteWidth, spriteHeight, goalX, goalY, cellSize, cellSize);
    dijkstraCtx.drawImage(spriteSheet, grassSx, grassSy, spriteWidth, spriteHeight, goalX, goalY, cellSize, cellSize);

    aStarCtx.drawImage(seedImage, goalX + (cellSize - scaledWidth) / 2, goalY + (cellSize - scaledHeight) / 2, scaledWidth, scaledHeight);
    dijkstraCtx.drawImage(seedImage, goalX + (cellSize - scaledWidth) / 2, goalY + (cellSize - scaledHeight) / 2, scaledWidth, scaledHeight);
}

/**
 * Starts the seed animation interval
 */
function startSeedAnimation() {
    loadSeedImages();
    seedVisible = true;
    seedAnimationInterval = setInterval(animateSeed, 300);
}

/**
 * Stops the seed animation interval
 */
function stopSeedAnimation() {
    clearInterval(seedAnimationInterval);
    seedVisible = false;
}

/**
 * Restarts the seed animation after it's been stopped
 */
function restartSeedAnimation() {
    if (!goal) return;

    // Clear any existing animation frames to avoid multiple loops
    cancelAnimationFrame(seedAnimationFrameId);

    // Restart the seed animation
    animateSeed();
}

/**
 * Draws the seed goal at the specified position
 * @param {Object} goalPos - The goal position with x and y coordinates
 */
function drawSeedGoal(goalPos) {
    const goalX = goalPos.x * cellSize;
    const goalY = goalPos.y * cellSize;

    const spriteWidth = 40, spriteHeight = 40, grassSx = 40, grassSy = 40;
    const seedScaleFactor = Math.min(cellSize / 48, cellSize / 26);
    const scaledWidth = 26 * seedScaleFactor;
    const scaledHeight = 48 * seedScaleFactor;

    // Clear the area where the seed will be drawn
    aStarCtx.clearRect(goalX, goalY, cellSize, cellSize);
    dijkstraCtx.clearRect(goalX, goalY, cellSize, cellSize);

    // Redraw the background tile (grass)
    aStarCtx.drawImage(spriteSheet, grassSx, grassSy, spriteWidth, spriteHeight, goalX, goalY, cellSize, cellSize);
    dijkstraCtx.drawImage(spriteSheet, grassSx, grassSy, spriteWidth, spriteHeight, goalX, goalY, cellSize, cellSize);

    // Draw the seed at the goal's position
    const seedImage = seedImages[seedIndex];
    aStarCtx.drawImage(seedImage, goalX + (cellSize - scaledWidth) / 2, goalY + (cellSize - scaledHeight) / 2, scaledWidth, scaledHeight);
    dijkstraCtx.drawImage(seedImage, goalX + (cellSize - scaledWidth) / 2, goalY + (cellSize - scaledHeight) / 2, scaledWidth, scaledHeight);

    animateSeed(); // Directly trigger the animation
}