export const settings = {
    volume: 50,
    hamster: 'hamster1',
    gridCount: 2,
    gridAlgorithms: ['aStar', 'dijkstra'],

    save() {
        const { volume, hamster, gridCount, gridAlgorithms } = this;
        localStorage.setItem('userSettings', JSON.stringify({ volume, hamster, gridCount, gridAlgorithms }));
    },

    load() {
        const saved = JSON.parse(localStorage.getItem('userSettings'));
        if (saved) {
            this.volume = saved.volume ?? this.volume;
        }
    }
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