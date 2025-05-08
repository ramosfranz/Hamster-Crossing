import { initializeGrid } from './gridManager.js';
import { renderGrids, setupEventListeners} from './domManager.js';
import { drawGrid, initializeVisualizer } from './visualizer.js';

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    initializeGrid();
    initializeVisualizer();
    renderGrids();
    drawGrid();
    
    window.addEventListener('resize', () => {
        drawGrid();
    });
});