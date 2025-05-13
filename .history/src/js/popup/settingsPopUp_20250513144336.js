import { settings } from '../manager/stateManager.js';
import { renderGrids } from '../manager/domManager.js';
import ThemeManager from '../manager/themeManager.js';
import audioManager from '../manager/audioManager.js';

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

const slider = domElements.slider;

function updateSliderBackground() {
    const value = slider.value;
    const min = slider.min || 0;
    const max = slider.max || 100;
    const percentage = ((value - min) / (max - min)) * 100;

    slider.style.background = `linear-gradient(to right, var(--gradient) 0%, var(--gradient) ${percentage}%, rgba(255, 255, 255, 0.2) ${percentage}%, rgba(255, 255, 255, 0.2) 100%)`;
}

slider.addEventListener('input', updateSliderBackground);
updateSliderBackground(); // Initial call on load
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
    console.log("Applying new settings...");
    
    try {
        // Update volume
        settings.volume = parseInt(domElements.volumeSlider.value);
        console.log("New volume:", settings.volume);
        
        // Update hamster
        settings.hamster = domElements.hamsterDropdown.value;
        console.log("New hamster:", settings.hamster);
        
        // Update grid count
        settings.gridCount = parseInt(domElements.gridCountInput.value);
        console.log("New grid count:", settings.gridCount);
        
        // Update algorithms
        settings.gridAlgorithms = [];
        for (let i = 0; i < settings.gridCount; i++) {
            const select = document.getElementById(`gridAlgorithm${i}`);
            if (select) {
                settings.gridAlgorithms.push(select.value);
                console.log(`Grid ${i} algorithm:`, select.value);
            }
        }

        // Apply audio settings
        audioManager.setVolume(settings.volume); // Directly set volume
        console.log("Audio volume updated");
        
        // Apply hamster theme
        ThemeManager.selectedHamster = settings.hamster;
        console.log("Hamster theme updated");
        
        // Save settings if possible
        if (settings.save && typeof settings.save === 'function') {
            settings.save();
            console.log("Settings saved");
        } else {
            console.warn("settings.save() not available");
        }

        renderGrids();
        domElements.settingsPopup.style.display = 'none';
        console.log("Settings applied successfully");
    } catch (error) {
        console.error("Error applying settings:", error);
    }
}

// Add event listener for volume changes
function setupVolumeControls() {
    domElements.volumeSlider.addEventListener('input', (e) => {
        audioManager.setVolume(parseInt(e.target.value));
    });
}


export function setupSettingsEventListeners() {
    // Debug: Verify elements exist
    if (!domElements.applySettings) {
        console.error("Apply button not found!");
        return;
    }

    domElements.settingsButton.addEventListener('click', () => {
        console.log("Settings button clicked");
        domElements.settingsPopup.style.display = 'block';
        updateSettingsUI();
    });

    domElements.closePopup.addEventListener('click', () => {
        console.log("Close button clicked");
        domElements.settingsPopup.style.display = 'none';
    });

    domElements.applySettings.addEventListener('click', (e) => {
        console.log("Apply button clicked - event:", e);
        applyNewSettings();
    });

    domElements.gridCountInput.addEventListener('change', () => {
        console.log("Grid count changed");
        updateGridSettingsUI();
    });

    setupVolumeControls();

    window.addEventListener('click', (event) => {
        if (event.target === domElements.settingsPopup) {
            console.log("Clicked outside popup");
            domElements.settingsPopup.style.display = 'none';
        }
    });
}