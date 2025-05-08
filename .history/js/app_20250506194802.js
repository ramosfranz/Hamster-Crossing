import { initializeGrid } from './gridManager.js';
import { setupEventListeners, renderGrids } from './domManager.js';
import { setupSettingsEventListeners } from './settings.js';
import { drawGrid, initializeVisualizer } from './visualizer.js';
import { loadSeedImages, startSeedAnimation } from './animation/seedAnimation.js';

export function init() {
    setupSettingsEventListeners();
    setupEventListeners();
    initializeGrid();
    initializeVisualizer();
    renderGrids();
    drawGrid();
    
    // Start seed animation with the redraw callback after everything is initialized
    setTimeout(() => {
        startSeedAnimation(drawGrid);
    }, 500); // Short delay to ensure everything is initialized
    
    window.addEventListener('resize', () => {
        drawGrid();
    });
}

document.addEventListener('DOMContentLoaded', init);