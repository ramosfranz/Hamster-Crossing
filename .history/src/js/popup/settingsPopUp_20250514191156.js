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
    domElements.hamsterDropdown.value = settings.hamster;
    domElements.gridCountInput.value = settings.gridCount;
    updateGridSettingsUI();
    updateHamsterDropdown(); 
}


// Add this new function to update the hamster dropdown
function updateHamsterDropdown() {
    // Clear existing options
    domElements.hamsterDropdown.innerHTML = '';
    
    // Get unlocked status from sessionStorage
    const hamuStarUnlocked = JSON.parse(sessionStorage.getItem("hamuStarUnlocked")) || false;
    const chiikawaUnlocked = JSON.parse(sessionStorage.getItem("chiikawaUnlocked")) || false;
    
    // Always available hamsters
    const baseHamsters = [
        { id: 'hamu', name: 'Hamu' },
        { id: 'merry', name: 'Merry' },
        { id: 'berry', name: 'Berry' },
        { id: 'mint', name: 'Mint' }
    ];
    
    // Special hamsters that might be unlocked
    const specialHamsters = [];
    if (hamuStarUnlocked) {
        specialHamsters.push({ id: 'hamuStar', name: 'Hamu STAR' });
    }
    if (chiikawaUnlocked) {
        specialHamsters.push({ id: 'chiikawa', name: 'Chiikawa' });
    }
    
    // Combine all available hamsters
    const availableHamsters = [...baseHamsters, ...specialHamsters];
    
    // Populate dropdown
    availableHamsters.forEach(hamster => {
        const option = document.createElement('option');
        option.value = hamster.id;
        option.textContent = hamster.name;
        domElements.hamsterDropdown.appendChild(option);
    });
    
    // Set current selection
    if (settings.hamster) {
        domElements.hamsterDropdown.value = settings.hamster;
    }
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

function reinitializeGameCanvas() {
    // 1. Clear all existing canvases
    const canvasContainer = document.querySelector('.canvas-container');
    if (canvasContainer) {
        canvasContainer.innerHTML = ''; // Clear all children
    }
    
    // 2. Recreate all necessary canvases
    // (This should mirror your initial canvas creation code)
    createGameCanvases();
    
    // 3. Reinitialize all game elements
    initializeGameElements();
    
    // 4. Redraw everything
    renderAll();
}

function applyNewSettings() {
    console.log("Applying new settings...");
    
    try {
        // Update volume
        settings.volume = parseInt(domElements.volumeSlider.value);
        console.log("New volume:", settings.volume);
        
        // Update hamster - validate it's still available
        const selectedHamster = domElements.hamsterDropdown.value;
        const availableOptions = Array.from(domElements.hamsterDropdown.options).map(opt => opt.value);
        if (availableOptions.includes(selectedHamster)) {
            settings.hamster = selectedHamster;
            console.log("New hamster:", settings.hamster);
        } else {
            settings.hamster = 'hamu';
            console.warn("Selected hamster no longer available, falling back to default");
        }
        
        // Update grid settings
        settings.gridCount = parseInt(domElements.gridCountInput.value);
        console.log("New grid count:", settings.gridCount);
        
        settings.gridAlgorithms = [];
        for (let i = 0; i < settings.gridCount; i++) {
            const select = document.getElementById(`gridAlgorithm${i}`);
            if (select) {
                settings.gridAlgorithms.push(select.value);
                console.log(`Grid ${i} algorithm:`, select.value);
            }
        }

    
        // Apply hamster theme - this should trigger a full reinitialization
        ThemeManager.selectedHamster = settings.hamster;
        console.log("Hamster theme updated");
        
         // Apply audio settings
        audioManager.setVolume(settings.volume);
        console.log("Audio volume updated");
        reinitializeGameCanvas()

        // Save settings
        if (settings.save && typeof settings.save === 'function') {
            settings.save();
            console.log("Settings saved");
        } else {
            console.warn("settings.save() not available");
        }


        
        // Close the popup
        domElements.settingsPopup.style.display = 'none';
        console.log("Settings applied successfully");
    } catch (error) {
        console.error("Error applying settings:", error);
    }
}
document.addEventListener('themeChanged', () => {
    updateHamsterDropdown();
});

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