import { initializeGrid } from './gridManager.js';
import { setupEventListeners, renderGrids } from './domManager.js';
import { setupSettingsEventListeners } from './settings.js';

export function init() {
    initializeGrid();
    setupSettingsEventListeners();
    renderGrids();
    setupEventListeners();
}

document.addEventListener('DOMContentLoaded', init);