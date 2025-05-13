import ThemeManager from './themeManager.js';
import { settings } from '../manager/stateManager.js';

class AudioManager {
    constructor() {
        // Initialize audio element
        this.bgMusic = new Audio();
        this.bgMusic.loop = true;
        
        // Get volume from settings or use default
        this.volume = settings.volume !== undefined ? settings.volume : 50;
        this.bgMusic.volume = this.volume / 100;
        
        // Music plays when volume > 0, stops when volume = 0
        this.isPlaying = this.volume > 0;
        
        // Load the current theme's music
        this.loadThemeMusic();
        
        // Listen for theme changes
        document.addEventListener('themeChanged', () => {
            const wasPlaying = this.isPlaying;
            this.stopMusic();
            this.loadThemeMusic();
            if (wasPlaying && this.volume > 0) {
                this.playMusic();
            }
        });

        // If volume is not zero, start playing
        if (this.volume > 0) {
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
        if (!this.isPlaying && this.bgMusic.src && this.volume > 0) {
            this.bgMusic.play()
                .then(() => {
                    this.isPlaying = true;
                })
                .catch(error => {
                    console.error("Error playing music:", error);
                });
        }
    }
    
    stopMusic() {
        if (this.bgMusic.src && this.isPlaying) {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
            this.isPlaying = false;
        }
    }
    
    setVolume(value) {
        this.volume = value;
        this.bgMusic.volume = value / 100;
        settings.volume = value;
        
        // If volume is set to 0, stop music
        if (value === 0 && this.isPlaying) {
            this.stopMusic();
        }
        // If volume is increased from 0, start music
        else if (value > 0 && !this.isPlaying) {
            this.playMusic();
        }
    }
    
    updateFromSettings() {
        // Update volume from settings
        this.setVolume(settings.volume);
    }
}

// Create a singleton instance
const audioManager = new AudioManager();

export default audioManager;