import { getNeighbors, sleep } from '../utils.js';
import { getGrid, rows, cols, start, getGoal } from '../gridManager.js';
import { drawPathWithHead } from '../visualizer.js';

export async function animateDijkstra(ctx, timerElement) {
    const grid = getGrid();
    const goal = getGoal();
    const canvas = ctx.canvas;
    const cellSize = canvas.width / cols;
    const neighbors = getNeighbors(grid, cols, rows);
    const waitSecondsSearch = 100;

    const openSet = [start];
    const cameFrom = {};
    const dist = Array(rows).fill().map(() => Array(cols).fill(Infinity));
    dist[start.y][start.x] = 0;

    const startTime = performance.now();
    let pathFoundTime = null;

    while (openSet.length > 0) {
        openSet.sort((a, b) => dist[a.y][a.x] - dist[b.y][b.x]);
        const current = openSet.shift();

        if (current.x === goal.x && current.y === goal.y) {
            pathFoundTime = performance.now() - startTime;
            timerElement.textContent = `Total time: ${Math.round(performance.now() - startTime)}ms | Path found: Yes`;
            await drawPathWithHead(ctx, cameFrom, current, "orange", "red");
            return;
        }

        ctx.fillStyle = "rgba(240, 128, 128, 0.5)";
        ctx.fillRect(current.x * cellSize, current.y * cellSize, cellSize, cellSize);
        await sleep(waitSecondsSearch);

        for (const neighbor of neighbors(current)) {
            const newDist = dist[current.y][current.x] + grid[neighbor.y][neighbor.x].weight;
            if (newDist < dist[neighbor.y][neighbor.x]) {
                cameFrom[`${neighbor.x},${neighbor.y}`] = current;
                dist[neighbor.y][neighbor.x] = newDist;
                
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