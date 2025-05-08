import { initializeGrid } from './gridManager.js';
import { setupEventListeners, renderGrids } from './domManager.js';
import { setupSettingsEventListeners } from './settings.js';
import { drawGrid, initializeVisualizer } from './visualizer.js';
import { startSeedAnimation, loadSeedImages } from './animation/seedAnimation.js';

export function init() {
    setupSettingsEventListeners();
    setupEventListeners();
    initializeGrid();
    initializeVisualizer();
    renderGrids();
    drawGrid();
    
    startSeedAnimation(drawGrid);

    window.addEventListener('resize', () => {
        drawGrid();
    });
}

document.addEventListener('DOMContentLoaded', init);