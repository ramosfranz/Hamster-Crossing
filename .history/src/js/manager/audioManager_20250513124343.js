import ThemeManager from './themeManager.js';
import { settings } from '../manager/stateManager.js';

class AudioManager {
    constructor() {
        this.bgMusic = new Audio();
        this.bgMusic.loop = true;
        this.volume = settings.volume ?? 50;
        this.bgMusic.volume = this.volume / 100;
        this.isPlaying = false;

        this.loadThemeMusic();

        // Attempt autoplay immediately (may fail due to browser policy)
        this.attemptAutoplay();

        // Fallback: If autoplay fails, start on first user interaction
        document.addEventListener('click', this.startOnInteraction.bind(this), { once: true });
        document.addEventListener('keydown', this.startOnInteraction.bind(this), { once: true });

        document.addEventListener('themeChanged', () => {
            const wasPlaying = this.isPlaying;
            this.stopMusic();
            this.loadThemeMusic();
            if (wasPlaying) this.playMusic();
        });
    }

    loadThemeMusic() {
        const hamsterTheme = ThemeManager.getHamsterAssets(settings.hamster);
        if (hamsterTheme?.music) {
            this.bgMusic.src = hamsterTheme.music;
        }
    }

    attemptAutoplay() {
        if (this.volume > 0) {
            this.playMusic()
                .catch(error => {
                    console.log("Autoplay blocked. Waiting for user interaction...");
                });
        }
    }

    startOnInteraction() {
        if (!this.isPlaying && this.volume > 0) {
            this.playMusic();
        }
    }

    async playMusic() {
        if (!this.isPlaying && this.bgMusic.src) {
            try {
                await this.bgMusic.play();
                this.isPlaying = true;
            } catch (error) {
                console.error("Audio play failed:", error);
                throw error; // Re-throw to handle in attemptAutoplay()
            }
        }
    }

    stopMusic() {
        if (this.isPlaying) {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
            this.isPlaying = false;
        }
    }

    setVolume(value) {
        this.volume = value;
        this.bgMusic.volume = value / 100;
        settings.volume = value;

        if (value === 0) {
            this.stopMusic();
        } else if (!this.isPlaying) {
            this.attemptAutoplay(); // Try playing again if volume was increased
        }
    }
}

const audioManager = new AudioManager();
export default audioManager;