import { getNeighbors, sleep } from '../utils.js';
import { getGrid, rows, cols, start, getGoal} from '../gridManager.js';
import { drawPathWithHead } from '../visualizer.js';

export async function animateBellmanFord(ctx, timerElement) {
    const grid = getGrid();
    const goal = getGoal();
    const canvas = ctx.canvas;
    const cellSize = canvas.width / cols;
    const neighbors = getNeighbors(grid, cols, rows);
    const waitSecondsSearch = 100;

    const dist = Array(rows).fill().map(() => Array(cols).fill(Infinity));
    const cameFrom = {};
    dist[start.y][start.x] = 0;

    const edges = [];
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (grid[y][x].wall) continue;
            for (const neighbor of neighbors({x, y})) {
                edges.push({
                    from: {x, y},
                    to: {x: neighbor.x, y: neighbor.y},
                    weight: grid[neighbor.y][neighbor.x].weight
                });
            }
        }
    }

    const startTime = performance.now();
    let pathFoundTime = null;

    for (let i = 0; i < rows * cols - 1; i++) {
        let updated = false;

        for (const edge of edges) {
            const {from, to, weight} = edge;
            if (dist[from.y][from.x] + weight < dist[to.y][to.x]) {
                dist[to.y][to.x] = dist[from.y][from.x] + weight;
                cameFrom[`${to.x},${to.y}`] = from;
                updated = true;

                // Draw exploration color
                ctx.fillStyle = "rgba(238, 130, 238, 0.5)";
                ctx.fillRect(to.x * cellSize, to.y * cellSize, cellSize, cellSize);
                
                // Immediately redraw goal if affected
                if (to.x === goal.x && to.y === goal.y) {
                    ctx.fillStyle = "lightgreen";
                    ctx.fillRect(to.x * cellSize, to.y * cellSize, cellSize, cellSize);
                    ctx.strokeStyle = "gray";
                    ctx.strokeRect(to.x * cellSize, to.y * cellSize, cellSize, cellSize);
                }

                await sleep(waitSecondsSearch);

                if (to.x === goal.x && to.y === goal.y && !pathFoundTime) {
                    pathFoundTime = performance.now() - startTime;
                }
            }
        }

        timerElement.textContent = `Total time: ${Math.round(performance.now() - startTime)}ms | Path found: ${
            pathFoundTime ? Math.round(pathFoundTime) + "ms" : "searching..."
        }`;

        if (!updated) break;
    }

    if (dist[goal.y][goal.x] !== Infinity) {
        await drawPathWithHead(ctx, cameFrom, goal, "lightgreen", "green");
        
        // Final redraw of goal to ensure it's on top of the path
        ctx.fillStyle = "lightgreen";
        ctx.fillRect(goal.x * cellSize, goal.y * cellSize, cellSize, cellSize);
        ctx.strokeStyle = "gray";
        ctx.strokeRect(goal.x * cellSize, goal.y * cellSize, cellSize, cellSize);
    } else {
        timerElement.textContent = `Total time: ${Math.round(performance.now() - startTime)}ms | Path found: No path`;
    }
}