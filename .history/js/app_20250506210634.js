import { initializeGrid } from './gridManager.js';
import { setupEventListeners, renderGrids } from './domManager.js';
import { setupSettingsEventListeners } from './settings.js';
import { drawGrid, initializeVisualizer } from './visualizer.js';
import { loadSeedImages, startSeedAnimation } from './animation/seedAnimation.js';

export function init() {
   
    setupSettingsEventListeners();
    setupEventListeners();
    initializeVisualizer();
    renderGrids();
    drawGrid();
    
    loadSeedImages(() => {
        startSeedAnimation();
    });
    
    window.addEventListener('resize', () => {
        drawGrid();
    });
}

document.addEventListener('DOMContentLoaded', init);