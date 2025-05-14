function dijkstra(grid, start, goal) {
    const width = grid[0].length;
    const height = grid.length;

    const directions = [
        { x: 0, y: -1 }, // up
        { x: 1, y: 0 },  // right
        { x: 0, y: 1 },  // down
        { x: -1, y: 0 }, // left
    ];

    const inBounds = (x, y) => x >= 0 && x < width && y >= 0 && y < height;
    const isWalkable = (x, y) => grid[y][x] === 0;

    const dist = Array.from({ length: height }, () => Array(width).fill(Infinity));
    const prev = Array.from({ length: height }, () => Array(width).fill(null));

    const queue = [];
    dist[start.y][start.x] = 0;
    queue.push({ x: start.x, y: start.y, cost: 0 });

    while (queue.length > 0) {
        queue.sort((a, b) => a.cost - b.cost); // min-priority queue
        const current = queue.shift();

        if (current.x === goal.x && current.y === goal.y) {
            const path = [];
            let cx = goal.x, cy = goal.y;
            while (prev[cy][cx]) {
                path.unshift({ x: cx, y: cy });
                const [px, py] = prev[cy][cx];
                cx = px;
                cy = py;
            }
            path.unshift(start);
            return path;
        }

        for (const d of directions) {
            const nx = current.x + d.x;
            const ny = current.y + d.y;
            if (inBounds(nx, ny) && isWalkable(nx, ny)) {
                const alt = dist[current.y][current.x] + 1;
                if (alt < dist[ny][nx]) {
                    dist[ny][nx] = alt;
                    prev[ny][nx] = [current.x, current.y];
                    queue.push({ x: nx, y: ny, cost: alt });
                }
            }
        }
    }

    return null; // no path found
}

function runTest(testName, grid, start, goal, expectedPath, algorithm) {
    const result = algorithm(grid, start, goal);
    const expectedStr = expectedPath.map(p => `(${p.x},${p.y})`);
    const actualPath = result?.map(p => `(${p.x},${p.y})`) ?? 'null';
    const passed = JSON.stringify(actualPath) === JSON.stringify(expectedStr);

    console.log(`Test:     ${testName}`);
    console.log(`Expected: ${expectedStr}`);
    console.log(`Actual:   ${actualPath}`);
    console.log(`Result:   ${passed ? "✅ PASS" : "❌ FAIL"}\n`);
}

const simpleGrid = [
    [0, 0, 0],
    [1, 1, 0],
    [0, 0, 0],
];

runTest(
    "Dijkstra: Simple 3x3 path",
    simpleGrid,
    { x: 0, y: 0 },
    { x: 2, y: 2 },
    [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 2, y: 1 },
        { x: 2, y: 2 }
    ],
    dijkstra
);

// Add more tests...
