export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

export const getNeighbors = (grid, cols, rows) => ({ x, y }) => {
    const neighbors = [];
    if (x > 0 && !grid[y][x - 1].wall) neighbors.push(grid[y][x - 1]);
    if (x < cols - 1 && !grid[y][x + 1].wall) neighbors.push(grid[y][x + 1]);
    if (y > 0 && !grid[y - 1][x].wall) neighbors.push(grid[y - 1][x]);
    if (y < rows - 1 && !grid[y + 1][x].wall) neighbors.push(grid[y + 1][x]);
    return neighbors;
};

function hexToRgba(hex, alpha = 1) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
