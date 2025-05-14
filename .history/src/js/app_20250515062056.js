import { initializeGrid } from './manager/gridManager.js';
import { setupEventListeners, renderGrids, updateButtonText } from './manager/domManager.js';
import { setupSettingsEventListeners } from './popup/settingsPopUp.js';
import { drawGrid, initializeVisualizer } from './animation/visualizer.js';
import { loadSeedImages, startSeedAnimation } from './animation/seedAnimation.js';
import './manager/audioManager.js';
import './popup/aboutPopUp.js';

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
        updateButtonText();
    });
}

document.addEventListener('DOMContentLoaded', init);
