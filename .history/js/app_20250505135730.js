import { initializeGrid } from './gridManager.js';
import { setupEventListeners, renderGrids } from './domManager.js';
import { setupSettingsEventListeners } from './settings.js';

export function init() {
    setupEventListeners();
    renderGrids();
    initializeGrid();
}

document.addEventListener('DOMContentLoaded', init);