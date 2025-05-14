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
    slider: document.querySelector('.theme-slider')
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
    updateHamsterDropdown();
    domElements.gridCountInput.value = settings.gridCount;
    updateGridSettingsUI();
}

function updateHamsterDropdown() {
    // Clear existing options
    domElements.hamsterDropdown.innerHTML = '';
    
    // Add options for each hamster in ThemeManager
    for (const hamsterId in ThemeManager.hamsterAssets) {
        const option = document.createElement('option');
        option.value = hamsterId;
        
        // Format the hamster name to look nicer (capitalize first letter)
        const hamsterName = hamsterId.charAt(0).toUpperCase() + hamsterId.slice(1);
        option.textContent = hamsterName;
        
        domElements.hamsterDropdown.appendChild(option);
    }
    
    // Set the current selection
    domElements.hamsterDropdown.value = settings.hamster || ThemeManager.selectedHamster;
}

function updateGridSettingsUI() {
    const count = parseInt(domElements.gridCountInput.value);
    domElements.gridSettings.innerHTML = '';
    document.querySelector('.grid-count-value').textContent = count;

    const row1 = document.createElement('div');
    row1.className = 'grid-selection-row';
    const row2 = document.createElement('div');
    row2.className = 'grid-selection-row';

    // Track which algorithms are already selected
    const usedAlgorithms = [];
    for (let i = 0; i < count; i++) {
        if (settings.gridAlgorithms[i]) {
            usedAlgorithms.push(settings.gridAlgorithms[i]);
        }
    }

    // Create dropdowns for each grid
    for (let i = 0; i < 5; i++) {
        const gridDiv = document.createElement('div');
        gridDiv.className = `grid-selection-item ${i >= count ? 'disabled' : ''}`;
        
        const label = document.createElement('label');
        label.textContent = `Grid ${String.fromCharCode(65 + i)}:`;
        
        const select = document.createElement('select');
        select.id = `gridAlgorithm${i}`;
        select.disabled = i >= count;
        select.dataset.gridIndex = i;

        // Add all algorithm options
        algorithms.forEach(algorithm => {
            const option = document.createElement('option');
            option.value = algorithm.id;
            option.textContent = algorithm.name;
            
            // Disable this option if it's already used by another grid
            // BUT make an exception for the algorithm currently assigned to this grid
            const isCurrentlySelected = settings.gridAlgorithms[i] === algorithm.id;
            const isUsedByOthers = usedAlgorithms.includes(algorithm.id) && !isCurrentlySelected;
            
            if (isUsedByOthers) {
                option.disabled = true;
                option.textContent += ' (already in use)';
            }
            
            select.appendChild(option);
        });
        
        // Set current value if available
        if (settings.gridAlgorithms[i]) {
            select.value = settings.gridAlgorithms[i];
        }
        
        // Add change event to update other dropdowns when this one changes
        select.addEventListener('change', updateAlgorithmDropdowns);
        
        gridDiv.appendChild(label);
        gridDiv.appendChild(select);

        if (i < 3) row1.appendChild(gridDiv);
        else row2.appendChild(gridDiv);
    }

    domElements.gridSettings.appendChild(row1);
    domElements.gridSettings.appendChild(row2);
}

function updateAlgorithmDropdowns(event) {
    const changedSelect = event.target;
    const changedSelectIndex = parseInt(changedSelect.dataset.gridIndex);
    const selectedAlgorithm = changedSelect.value;
    const count = parseInt(domElements.gridCountInput.value);
    
    // Get all active algorithm values after this change
    const currentSelections = [];
    for (let i = 0; i < count; i++) {
        const select = document.getElementById(`gridAlgorithm${i}`);
        if (select && !select.disabled) {
            currentSelections.push(select.value);
        }
    }
    
    // Update all other dropdowns
    for (let i = 0; i < count; i++) {
        if (i === changedSelectIndex) continue; // Skip the dropdown that was just changed
        
        const select = document.getElementById(`gridAlgorithm${i}`);
        if (!select) continue;
        
        const currentValue = select.value;
        
        // Re-populate the options
        const oldOptions = Array.from(select.options);
        
        algorithms.forEach((algorithm, index) => {
            const option = oldOptions[index];
            const isCurrentlySelected = currentValue === algorithm.id;
            const isUsedByOthers = currentSelections.includes(algorithm.id) && !isCurrentlySelected;
            
            option.disabled = isUsedByOthers;
            option.textContent = isUsedByOthers ? 
                `${algorithm.name} (already in use)` : 
                algorithm.name;
        });
    }
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
        
        // Save settings to localStorage
        saveSettings();

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
        const volume = parseInt(e.target.value);
        audioManager.setVolume(volume);
        
        // Save volume immediately to localStorage
        settings.volume = volume;
        saveSettings();
        
        console.log("Volume changed and saved:", volume);
    });
}

// Save settings to localStorage
function saveSettings() {
    if (settings.save && typeof settings.save === 'function') {
        settings.save();
        console.log("Settings saved to localStorage");
    } else {
        // Fallback if settings.save isn't available
        try {
            localStorage.setItem('hamsterMazeSettings', JSON.stringify({
                volume: settings.volume,
                hamster: settings.hamster,
                gridCount: settings.gridCount,
                gridAlgorithms: settings.gridAlgorithms
            }));
            console.log("Settings saved via fallback method");
        } catch (error) {
            console.error("Failed to save settings:", error);
        }
    }
}

// Initialize settings from localStorage on page load
function initializeSettings() {
    try {
        // Try to load settings from localStorage
        const savedSettings = localStorage.getItem('hamsterMazeSettings');
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            
            // Update settings object with saved values
            if (parsed.volume !== undefined) settings.volume = parsed.volume;
            if (parsed.hamster !== undefined) settings.hamster = parsed.hamster;
            if (parsed.gridCount !== undefined) settings.gridCount = parsed.gridCount;
            if (parsed.gridAlgorithms !== undefined) settings.gridAlgorithms = parsed.gridAlgorithms;
            
            console.log("Settings loaded from localStorage:", parsed);
            
            // Apply volume setting immediately
            audioManager.setVolume(settings.volume);
            
            // Apply hamster theme immediately
            if (parsed.hamster) {
                ThemeManager.selectedHamster = parsed.hamster;
            }
        } else {
            console.log("No saved settings found, using defaults");
        }
    } catch (error) {
        console.error("Error loading settings:", error);
    }
}

export function setupSettingsEventListeners() {
    // Initialize settings from localStorage
    initializeSettings();
    
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

    domElements.hamsterDropdown.addEventListener('change', () => {
        // Preview theme change immediately
        const selectedHamster = domElements.hamsterDropdown.value;
        ThemeManager.selectedHamster = selectedHamster;
        console.log("Hamster preview changed to:", selectedHamster);
    });

    setupVolumeControls();

    window.addEventListener('click', (event) => {
        if (event.target === domElements.settingsPopup) {
            console.log("Clicked outside popup");
            domElements.settingsPopup.style.display = 'none';
        }
    });
}