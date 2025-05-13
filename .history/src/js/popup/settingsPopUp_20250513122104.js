import { settings } from '../manager/stateManager.js';
import { renderGrids } from '../manager/domManager.js';
import ThemeManager from '../js/themeManager.js';
import audioManager from '../js/AudioManager.js';

const domElements = {
    settingsButton: document.getElementById('settingsButton'),
    settingsPopup: document.getElementById('settingsPopup'),
    closePopup: document.querySelector('.close-popup'),
    applySettings: document.getElementById('applySettings'),
    gridCountInput: document.getElementById('gridCount'),
    gridSettings: document.getElementById('gridSettings'),
    volumeSlider: document.getElementById('volumeSlider'),
    hamsterDropdown: document.getElementById('hamsterDropdown'),
};

export const algorithms = [
    { id: 'aStar', name: 'A*' },
    { id: 'dijkstra', name: "Dijkstra" },
    { id: 'bfs', name: 'Breadth-First Search' },
    { id: 'dfs', name: 'Depth-First Search' },
    { id: 'bellmanFord', name: 'Bellman-Ford' }
];

function updateSettingsUI() {
    domElements.volumeSlider.value = settings.volume;
    domElements.hamsterDropdown.value = settings.hamster;
    domElements.gridCountInput.value = settings.gridCount;
    updateGridSettingsUI();
}

function updateGridSettingsUI() {
    const count = parseInt(domElements.gridCountInput.value);
    domElements.gridSettings.innerHTML = '';
    document.querySelector('.grid-count-value').textContent = count;

    const row1 = document.createElement('div');
    row1.className = 'grid-selection-row';
    const row2 = document.createElement('div');
    row2.className = 'grid-selection-row';

    for (let i = 0; i < 5; i++) {
        const gridDiv = document.createElement('div');
        gridDiv.className = `grid-selection-item ${i >= count ? 'disabled' : ''}`;
        
        const label = document.createElement('label');
        label.textContent = `Grid ${String.fromCharCode(65 + i)}:`;
        
        const select = document.createElement('select');
        select.id = `gridAlgorithm${i}`;
        select.disabled = i >= count;

        algorithms.forEach(algorithm => {
            const option = document.createElement('option');
            option.value = algorithm.id;
            option.textContent = algorithm.name;
            select.appendChild(option);
        });
        
        if (settings.gridAlgorithms[i]) select.value = settings.gridAlgorithms[i];
        
        gridDiv.appendChild(label);
        gridDiv.appendChild(select);

        if (i < 3) row1.appendChild(gridDiv);
        else row2.appendChild(gridDiv);
    }

    domElements.gridSettings.appendChild(row1);
    domElements.gridSettings.appendChild(row2);
}

function applyNewSettings() {
    settings.volume = parseInt(domElements.volumeSlider.value);
    settings.hamster = domElements.hamsterDropdown.value;
    settings.gridCount = parseInt(domElements.gridCountInput.value);
    
    settings.gridAlgorithms = [];
    for (let i = 0; i < settings.gridCount; i++) {
        const select = document.getElementById(`gridAlgorithm${i}`);
        if (select) settings.gridAlgorithms.push(select.value);
    }

      // Apply new settings to audio manager
    audioManager.updateFromSettings();
    
    // Apply hamster theme
    ThemeManager.selectedHamster = settings.hamster;
    
    // Save settings to localStorage
    if (settings.save) {
        settings.save();
    }

    renderGrids();
    domElements.settingsPopup.style.display = 'none';
}

// Add event listener for volume changes
function setupVolumeControls() {
    domElements.volumeSlider.addEventListener('input', (e) => {
        audioManager.setVolume(parseInt(e.target.value));
    });
}


export function setupSettingsEventListeners() {
    domElements.settingsButton.addEventListener('click', () => {
        domElements.settingsPopup.style.display = 'block';
        updateSettingsUI();
    });

    domElements.closePopup.addEventListener('click', () => {
        domElements.settingsPopup.style.display = 'none';
    });

    domElements.applySettings.addEventListener('click', applyNewSettings);
    domElements.gridCountInput.addEventListener('change', updateGridSettingsUI);

    window.addEventListener('click', (event) => {
        if (event.target === domElements.settingsPopup) {
            domElements.settingsPopup.style.display = 'none';
        }
    });
}