import ThemeManager from './themeManager.js';
import { settings } from '../manager/stateManager.js';

class AudioManager {
    constructor() {
        // Initialize audio element
        this.bgMusic = new Audio();
        this.bgMusic.loop = true;
        this.volume = settings.volume || 50;
        this.bgMusic.volume = this.volume / 100;
        this.isPlaying = settings.musicEnabled !== false; // Default to true if not set
        
        // Load the current theme's music
        this.loadThemeMusic();
        
        // Listen for theme changes
        document.addEventListener('themeChanged', () => {
            const wasPlaying = this.isPlaying;
            this.stopMusic();
            this.loadThemeMusic();
            if (wasPlaying) {
                this.playMusic();
            }
        });

        // If music should be playing by default, start it
        if (this.isPlaying) {
            this.playMusic();
        }
    }
    
    loadThemeMusic() {
        // Get the music path from the current hamster theme
        const hamsterTheme = ThemeManager.getHamsterAssets(settings.hamster);
        if (hamsterTheme && hamsterTheme.music) {
            this.bgMusic.src = hamsterTheme.music;
            console.log("Loaded music:", hamsterTheme.music);
        } else {
            console.warn("No music defined for current theme");
        }
    }
    
    playMusic() {
        if (!this.isPlaying && this.bgMusic.src) {
            this.bgMusic.play()
                .then(() => {
                    this.isPlaying = true;
                    settings.musicEnabled = true;
                })
                .catch(error => {
                    console.error("Error playing music:", error);
                });
        }
    }
    
    stopMusic() {
        if (this.bgMusic.src) {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
            this.isPlaying = false;
            settings.musicEnabled = false;
        }
    }
    
    setVolume(value) {
        this.volume = value;
        this.bgMusic.volume = value / 100;
        settings.volume = value;
    }
    
    toggleMusic() {
        if (this.isPlaying) {
            this.stopMusic();
        } else {
            this.playMusic();
        }
        return this.isPlaying;
    }

    updateFromSettings() {
        // Update volume from settings
        this.setVolume(settings.volume);
        
        // Update play state if needed
        if (settings.musicEnabled && !this.isPlaying) {
            this.playMusic();
        } else if (!settings.musicEnabled && this.isPlaying) {
            this.stopMusic();
        }
    }
}

// Create a singleton instance
const audioManager = new AudioManager();

export default audioManager;