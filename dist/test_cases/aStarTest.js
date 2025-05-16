// aStarTest.js

// ===== A* Algorithm =====
function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getNeighbours(node, grid) {
    const directions = [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 }
    ];
    const neighbours = [];

    for (const dir of directions) {
        const nx = node.x + dir.x;
        const ny = node.y + dir.y;

        if (nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length && grid[ny][nx] === 0) {
            neighbours.push({ x: nx, y: ny });
        }
    }

    return neighbours;
}

function aStar(grid, start, goal) {
    const openSet = [start];
    const cameFrom = {};
    const gScore = {};
    const fScore = {};

    const key = (p) => `${p.x},${p.y}`;
    gScore[key(start)] = 0;
    fScore[key(start)] = heuristic(start, goal);

    while (openSet.length > 0) {
        openSet.sort((a, b) => fScore[key(a)] - fScore[key(b)]);
        let current = openSet.shift();

        if (current.x === goal.x && current.y === goal.y) {
            const path = [current];
            while (key(current) in cameFrom) {
                current = cameFrom[key(current)];
                path.unshift(current);
            }
            return path;
        }

        for (const neighbour of getNeighbours(current, grid)) {
            const tentativeG = gScore[key(current)] + 1;
            if (tentativeG < (gScore[key(neighbour)] ?? Infinity)) {
                cameFrom[key(neighbour)] = current;
                gScore[key(neighbour)] = tentativeG;
                fScore[key(neighbour)] = tentativeG + heuristic(neighbour, goal);

                if (!openSet.some(p => p.x === neighbour.x && p.y === neighbour.y)) {
                    openSet.push(neighbour);
                }
            }
        }
    }

    return null; // No path found
}

// ===== Test Framework =====
function runTest(testName, grid, start, goal, expectedPath) {
    const result = aStar(grid, start, goal);
    const actualPath = result?.map(p => `(${p.x},${p.y})`) ?? 'null';
    const expectedStr = expectedPath?.map(p => `(${p.x},${p.y})`) ?? 'null';

    const passed = JSON.stringify(actualPath) === JSON.stringify(expectedStr);
    console.log(`Test: ${testName}`);
    console.log(`Expected: ${expectedStr}`);
    console.log(`Actual:   ${actualPath}`);
    console.log(`Result:   ${passed ? "✅ PASS" : "❌ FAIL"}\n`);
}

// ===== Run Test Cases =====
const simpleGrid = [
    [0, 0, 0],
    [1, 1, 0],
    [0, 0, 0],
];

runTest(
    "Simple 3x3 path",
    simpleGrid,
    { x: 0, y: 0 },
    { x: 2, y: 2 },
    [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 2, y: 1 },
        { x: 2, y: 2 }
    ]
);
