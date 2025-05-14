import ThemeManager from './themeManager.js';
import { settings } from '../manager/stateManager.js';

class AudioManager {
    constructor() {
        this.bgMusic = new Audio();
        this.bgMusic.loop = true;
        this.volume = settings.volume ?? 50;
        this.bgMusic.volume = this.volume / 100;
        this.isPlaying = false;
        this.currentTheme = null;

        // Initialize with current theme
        this.loadThemeMusic();

        // Theme change handler
        document.addEventListener('themeChanged', () => {
            console.log("Theme changed - updating music");
            this.handleThemeChange();
        });

        // Initial playback attempt
        if (this.volume > 0) {
            this.attemptAutoplay();
        }
    }

    async handleThemeChange() {
        const wasPlaying = this.isPlaying;
        this.stopMusic();
        this.loadThemeMusic();
        
        if (wasPlaying) {
            await this.playMusic();
        }
    }

    loadThemeMusic() {
        const hamsterTheme = ThemeManager.getHamsterAssets();
        if (hamsterTheme?.music && hamsterTheme.music !== this.currentTheme) {
            console.log("Loading new theme music:", hamsterTheme.music);
            this.bgMusic.src = hamsterTheme.music;
            this.currentTheme = hamsterTheme.music;
            
            // Important: Preload the audio
            this.bgMusic.load();
        }
    }

    async attemptAutoplay() {
        try {
            await this.playMusic();
        } catch (error) {
            console.log("Autoplay blocked, will play after interaction");
            this.addPlayOnInteraction();
        }
    }

    addPlayOnInteraction() {
        const playHandler = () => {
            if (!this.isPlaying && this.volume > 0) {
                this.playMusic();
                document.removeEventListener('click', playHandler);
                document.removeEventListener('keydown', playHandler);
            }
        };
        
        document.addEventListener('click', playHandler, { once: true });
        document.addEventListener('keydown', playHandler, { once: true });
    }

    async playMusic() {
        if (!this.isPlaying && this.bgMusic.src && this.volume > 0) {
            try {
                await this.bgMusic.play();
                this.isPlaying = true;
                console.log("Music started playing");
            } catch (error) {
                console.error("Playback failed:", error);
                throw error;
            }
        }
    }

  stopMusic(resetTime = true) {
    if (this.isPlaying) {
        this.bgMusic.pause();
        if (resetTime) {
            this.bgMusic.currentTime = 0;
        }
        this.isPlaying = false;
        console.log("Music stopped");
    }
}

    setVolume(value) {
    this.volume = value;
    this.bgMusic.volume = value / 100;
    settings.volume = value;

    if (value === 0 && this.isPlaying) {
        this.stopMusic(false); // 🧠 Don't reset position on mute
    }
}

}

const audioManager = new AudioManager();
export default audioManager;