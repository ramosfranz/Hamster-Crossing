import { initializeGrid } from './gridManager.js';
import { renderGrids, setupEventListeners } from './domManager.js';
import { drawGrid } from './visualizer.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize core components
    initializeGrid();
    renderGrids();
    setupEventListeners();
    drawGrid();
    
    // Additional game setup
    window.addEventListener('resize', () => {
        drawGrid();
    });
});