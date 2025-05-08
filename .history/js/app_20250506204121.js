import { initializeGrid } from './gridManager.js';
import { setupEventListeners, renderGrids } from './domManager.js';
import { setupSettingsEventListeners } from './settings.js';
import { drawGrid } from './visualizer.js';
import { loadSeedImages, startSeedAnimation } from './animation/seedAnimation.js';

export function init() {
    loadSeedImages(() => {
        startSeedAnimation();
    });
    setupSettingsEventListeners();
    setupEventListeners();
    initializeGrid();
    renderGrids();
    drawGrid();
    
    
    window.addEventListener('resize', () => {
        drawGrid();
    });
}

document.addEventListener('DOMContentLoaded', init);