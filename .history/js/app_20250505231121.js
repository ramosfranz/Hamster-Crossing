import { initializeGrid } from './gridManager.js';
import { setupEventListeners, renderGrids } from './domManager.js';
import { setupSettingsEventListeners } from './settings.js';

export function init() {
    initializeGrid();
    renderGrids();
    setupEventListeners();
    setupSettingsEventListeners();
}

document.addEventListener('DOMContentLoaded', init);