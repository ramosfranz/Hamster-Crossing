import { initializeGrid } from './gridManager.js';
import { setupEventListeners, renderGrids } from './domManager.js';
import { setupSettingsEventListeners } from './settings.js';
import { drawGrid, initializeVisualizer } from './visualizer.js';
import { loadSeedImages } from './animation/seedAnimation.js';

export function init() {
    setupSettingsEventListeners();
    loadSeedImages();
    setupEventListeners();
    initializeGrid();
    initializeVisualizer();
    renderGrids();
    drawGrid();
    
    window.addEventListener('resize', () => {
        drawGrid();
    });
}

document.addEventListener('DOMContentLoaded', init);