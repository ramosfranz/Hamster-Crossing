import { settings, setSearchInProgress, resetTimers, timers, searchInProgress} from './stateManager.js';
import { initializeGrid, generateRandomGrid, addRandomWeights, setGoal, getGrid, start, getGoal, getStart, rows, cols } from './gridManager.js';
import { animateAStar } from './algorithms/aStar.js';
import { animateDijkstra } from './algorithms/dijkstra.js';
import { animateBFS } from './algorithms/bfs.js';
import { animateDFS } from './algorithms/dfs.js';
import { animateBellmanFord } from './algorithms/bellmanFord.js';
import { registerCanvas, drawGrid, ctx, canvases } from './visualizer.js';
import { algorithms } from './settings.js';

const domElements = {
    gridsContainer: document.getElementById('grids-container'),
    runButton: document.getElementById('runButton'),
    generateButton: document.getElementById('generateButton'),
    clearButton: document.getElementById('clearButton'),
    addWeightsButton: document.getElementById('addWeightsButton'),
    stopButton: document.getElementById('stopButton'),
    warning: document.getElementById('warning')
};

export function setupEventListeners() {
    domElements.runButton.addEventListener('click', runAlgorithms);
    domElements.generateButton.addEventListener('click', () => {
        setupCanvasEventListeners();
        generateRandomGrid();
});
    domElements.addWeightsButton.addEventListener('click', addRandomWeights);
    domElements.stopButton.addEventListener('click', stopSearching);
    domElements.clearButton.addEventListener('click', () => {
        // Reset the grid
        initializeGrid();
        
        // Clear and re-render the canvases
        renderGrids();
        
        // Ensure fresh event listeners
        setTimeout(() => {
            setupCanvasEventListeners();
            drawGrid();
        }, 0);
    });

   /* domElements.settingsButton.addEventListener('click', () => {
        domElements.settingsPopup.style.display = 'block';
        updateSettingsUI();
    });

    domElements.closePopup.addEventListener('click', () => {
        domElements.settingsPopup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === domElements.settingsPopup) {
            domElements.settingsPopup.style.display = 'none';
        }
    }); */

    window.addEventListener('resize', () => {
        drawGrid();
        setupCanvasEventListeners();
    });
}
export function renderGrids() {
    domElements.gridsContainer.innerHTML = '';
    resetTimers();
    
    const containerWidth = domElements.gridsContainer.offsetWidth;
    const gridCount = settings.gridCount;
    const maxCanvasSize = Math.min(400, (containerWidth - 30 * (gridCount - 1)) / gridCount;

    // Clear existing canvas references
    Object.keys(canvases).forEach(key => delete canvases[key]);
    Object.keys(ctx).forEach(key => delete ctx[key]);

    for (let i = 0; i < settings.gridCount; i++) {
        const algorithmId = settings.gridAlgorithms[i] || 'aStar';
        const gridId = `${algorithmId}_${i}`;
        
        const gridDiv = document.createElement('div');
        gridDiv.className = 'canvas-container';
        
        const algorithm = algorithms.find(a => a.id === algorithmId) || { name: 'Unknown' };  
        const heading = document.createElement('h3');
        heading.textContent = `${algorithm.name} (Grid ${String.fromCharCode(65 + i)})`;
        
        const canvas = document.createElement('canvas');
        canvas.id = gridId;
        canvas.width = maxCanvasSize;
        canvas.height = maxCanvasSize;
        
        const timer = document.createElement('div');
        timer.className = 'timer';
        timer.id = `${gridId}_timer`;
        timer.textContent = 'Total time: 0ms | Path found: -';
        
        gridDiv.appendChild(heading);
        gridDiv.appendChild(canvas);
        gridDiv.appendChild(timer);
        domElements.gridsContainer.appendChild(gridDiv);
        
        registerCanvas(gridId, canvas);
        timers[gridId] = timer;
    }

    // Use setTimeout to ensure DOM is fully updated
    setTimeout(() => {
        setupCanvasEventListeners();
        drawGrid();
    }, 0);
}

window.addEventListener('resize', () => {
    renderGrids();
});

function setupCanvasEventListeners() {
    // First remove all existing listeners
    for (const algorithmId in canvases) {
        const canvas = canvases[algorithmId];
        // Clone the canvas to remove all event listeners
        const newCanvas = canvas.cloneNode(true);
        canvas.parentNode.replaceChild(newCanvas, canvas);
        canvases[algorithmId] = newCanvas;
        ctx[algorithmId] = newCanvas.getContext('2d');
    }

    // Then add fresh listeners
    for (const algorithmId in canvases) {
        const canvas = canvases[algorithmId];
        canvas.addEventListener('click', (event) => handleCanvasClick(event, algorithmId));
        canvas.addEventListener('mousedown', (event) => handleCanvasMouseDown(event, algorithmId));
        canvas.addEventListener('mousemove', (event) => handleCanvasMouseMove(event, algorithmId));
        canvas.addEventListener('mouseup', handleCanvasMouseUp);
    }
}

function handleCanvasClick(event, ctxKey) {
    if (searchInProgress) return;
    const canvas = canvases[ctxKey];
    const rect = canvas.getBoundingClientRect();
    const cellSize = canvas.width / cols; // Add this line
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    const grid = getGrid();
    const goal = getGoal();

    if ((x === start.x && y === start.y) || (x === goal.x && y === goal.y)) return;

    grid[y][x].wall = !grid[y][x].wall;
    if (grid[y][x].wall) {
        grid[y][x].weight = 1;
    }
    drawGrid();
}
let draggingGoal = false;
function handleCanvasMouseDown(event, ctxKey) {
    if (searchInProgress) return;
    const canvas = canvases[ctxKey];
    const rect = canvas.getBoundingClientRect();
    const cellSize = canvas.width / cols; // Add this line
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    const goal = getGoal();

    if (x === goal.x && y === goal.y) {
        draggingGoal = true;
    }
}

function handleCanvasMouseMove(event, ctxKey) {
    if (!draggingGoal || searchInProgress) return;
    const canvas = canvases[ctxKey];
    const rect = canvas.getBoundingClientRect();
    const cellSize = canvas.width / cols;
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    const grid = getGrid();
    const start = getStart(); // Should come from gridManager
    
    // Add this check for grid boundaries
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
        const currentCell = grid[y][x];
        if (!currentCell.wall && (x !== start.x || y !== start.y)) {
            // Clear old goal cell
            const oldGoal = getGoal();
            grid[oldGoal.y][oldGoal.x] = {
                ...grid[oldGoal.y][oldGoal.x],
                wall: false,
                weight: 1
            };
            
            // Update to new goal
            setGoal({ x, y });
            
            // Mark new goal cell
            grid[y][x] = {
                ...grid[y][x],
                wall: false,
                weight: 1
            };
            
            drawGrid();
        }
    }
}
function handleCanvasMouseUp() {
    draggingGoal = false;
}


async function runAlgorithms() {
    setSearchInProgress(true);
    resetTimers();
    
    const promises = [];
    for (let i = 0; i < settings.gridCount; i++) {
        const algorithmId = settings.gridAlgorithms[i];
        const gridId = `${algorithmId}_${i}`;
        
        // Ensure we have valid context and timer
        const canvasContext = ctx[gridId];
        const timerElement = timers[gridId];
        
        if (!canvasContext || !timerElement) continue;

        switch(algorithmId) {
            case 'aStar':
                promises.push(animateAStar(canvasContext, timerElement));
                break;
            case 'dijkstra':
                promises.push(animateDijkstra(canvasContext, timerElement));
                break;
            case 'bfs':
                promises.push(animateBFS(canvasContext, timerElement));
                break;
            case 'dfs':
                promises.push(animateDFS(canvasContext, timerElement));
                break;
            case 'bellmanFord':
                promises.push(animateBellmanFord(canvasContext, timerElement));
                break;
        }
    }
    
    await Promise.all(promises);
    setSearchInProgress(false);
}

function stopSearching() {
    setSearchInProgress(false);
    drawGrid();
}
