export const settings = {
    volume: 50,
    hamster: 'hamster1',
    gridCount: 2,
    gridAlgorithms: ['aStar', 'dijkstra']
};

export let searchInProgress = false;
export const timers = {};

export function setSearchInProgress(value) {
    searchInProgress = value;
}

export function resetTimers() {
    for (const key in timers) {
        timers[key].textContent = "Total time: 0ms | Path found: -";
    }
}