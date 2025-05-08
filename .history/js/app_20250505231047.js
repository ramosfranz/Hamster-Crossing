import { initializeGrid } from './gridManager.js';
import { setupEventListeners, renderGrids } from './domManager.js';
import { setupSettingsEventListeners } from './settings.js';

export function init() {
    setupSettingsEventListeners();
    initializeGrid();
    renderGrids();
    setupEventListeners();
}

document.addEventListener('DOMContentLoaded', init);