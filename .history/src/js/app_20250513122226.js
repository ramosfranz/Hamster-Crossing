import { initializeGrid } from './manager/gridManager.js';
import { setupEventListeners, renderGrids } from './manager/domManager.js';
import { setupSettingsEventListeners } from './popup/settingsPopUp.js';
import { drawGrid, initializeVisualizer } from './animation/visualizer.js';
import { loadSeedImages, startSeedAnimation } from './animation/seedAnimation.js';
import audioManager from './manager/audioManager.js';

export function init() {
    loadSeedImages(() => {
        startSeedAnimation();
    });
    setupSettingsEventListeners();
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