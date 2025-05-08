import { heuristic, getNeighbors, sleep } from '../utils.js';
import { getGrid, rows, cols, start, getGoal } from '../gridManager.js';
import { drawPathWithHead} from '../visualizer.js';

export async function animateAStar(ctx, timerElement) {
    const grid = getGrid();
    const goal = getGoal();
    const canvas = ctx.canvas;
    const cellSize = canvas.width / cols;
    const neighbors = getNeighbors(grid, cols, rows);
    const waitSecondsSearch = 100;
    
    const openSet = [start];
    const cameFrom = {};
    const gScore = Array(rows).fill().map(() => Array(cols).fill(Infinity));
    gScore[start.y][start.x] = 0;
    const fScore = Array(rows).fill().map(() => Array(cols).fill(Infinity));
    fScore[start.y][start.x] = heuristic(start, goal);

    const startTime = performance.now();
    let pathFoundTime = null;

    while (openSet.length > 0) {
        openSet.sort((a, b) => fScore[a.y][a.x] - fScore[b.y][b.x]);
        const current = openSet.shift();

        if (current.x === goal.x && current.y === goal.y) {
            pathFoundTime = performance.now() - startTime;
            timerElement.textContent = `Total time: ${Math.round(performance.now() - startTime)}ms | Path found: Yes`;
            await drawPathWithHead(ctx, cameFrom, current, "yellow", "orange");
            return;
        }

        ctx.fillStyle = "rgba(255, 255, 128, 0.5)";
        ctx.fillRect(current.x * cellSize, current.y * cellSize, cellSize, cellSize);
        await sleep(waitSecondsSearch);

        for (const neighbor of neighbors(current)) {
            const tentativeGScore = gScore[current.y][current.x] + grid[neighbor.y][neighbor.x].weight;
            if (tentativeGScore < gScore[neighbor.y][neighbor.x]) {
                cameFrom[`${neighbor.x},${neighbor.y}`] = current;
                gScore[neighbor.y][neighbor.x] = tentativeGScore;
                fScore[neighbor.y][neighbor.x] = tentativeGScore + heuristic(neighbor, goal);

                if (!openSet.some(n => n.x === neighbor.x && n.y === neighbor.y)) {
                    openSet.push(neighbor);
                }
            }
        }
        
        timerElement.textContent = `Total time: ${Math.round(performance.now() - startTime)}ms | Path found: ${
            pathFoundTime ? Math.round(pathFoundTime) + "ms" : "searching..."
        }`;
    }
    
    timerElement.textContent = `Total time: ${Math.round(performance.now() - startTime)}ms | Path found: No path`;
}