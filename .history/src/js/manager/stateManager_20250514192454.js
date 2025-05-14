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
            this.hamster = saved.hamster ?? this.hamster;
            this.gridCount = saved.gridCount ?? this.gridCount;
            this.gridAlgorithms = saved.gridAlgorithms ?? this.gridAlgorithms;
        }
    }
};
