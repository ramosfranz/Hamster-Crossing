import { initializeGrid } from './gridManager.js';
import { renderGrids, setupEventListeners, setupCanvasEventListeners } from './domManager.js';
import { drawGrid } from './visualizer.js';

document.addEventListener('DOMContentLoaded', () => {
    // First create grid structure
    setupEventListeners();
    initializeGrid();
    
    // Then create and register canvases
    renderGrids();
    
    // Now setup interactions and draw
    setupEventListeners();
    drawGrid();
    
    window.addEventListener('resize', () => {
        drawGrid();
    });
});