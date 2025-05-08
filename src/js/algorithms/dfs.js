import { heuristic, getNeighbors, sleep } from './utils.js';
import { getGrid, rows, cols, start, getGoal } from '../manager/gridManager.js';
import { drawPathWithHead } from '../animation/visualizer.js';

export async function animateDFS(ctx, timerElement) {
    const grid = getGrid();
    const goal = getGoal();
    const canvas = ctx.canvas;
    const cellSize = canvas.width / cols;
    const neighbors = getNeighbors(grid, cols, rows);
    const waitSecondsSearch = 100;

    const stack = [start];
    const cameFrom = {};
    const visited = Array(rows).fill().map(() => Array(cols).fill(false));
    visited[start.y][start.x] = true;

    const startTime = performance.now();
    let pathFoundTime = null;

    while (stack.length > 0) {
        const current = stack.pop();

        if (current.x === goal.x && current.y === goal.y) {
            pathFoundTime = performance.now() - startTime;
            timerElement.textContent = `Total time: ${Math.round(performance.now() - startTime)}ms | Path found: Yes`;
            await drawPathWithHead(ctx, cameFrom, current, "red", "purple");
            return;
        }

        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.fillRect(current.x * cellSize, current.y * cellSize, cellSize, cellSize);
        await sleep(waitSecondsSearch);

        for (const neighbor of neighbors(current)) {
            if (!visited[neighbor.y][neighbor.x]) {
                visited[neighbor.y][neighbor.x] = true;
                cameFrom[`${neighbor.x},${neighbor.y}`] = current;
                stack.push(neighbor);
            }
        }

        timerElement.textContent = `Total time: ${Math.round(performance.now() - startTime)}ms | Path found: ${
            pathFoundTime ? Math.round(pathFoundTime) + "ms" : "searching..."
        }`;
    }

    timerElement.textContent = `Total time: ${Math.round(performance.now() - startTime)}ms | Path found: No path`;
}