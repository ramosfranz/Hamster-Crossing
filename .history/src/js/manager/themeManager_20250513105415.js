class ThemeManager {
    
    
    static hamsterAssets = {
        hamu: {
        ground: "assets/images/sprites/hamu_ground.png",
        sprite: "assets/images/sprites/hamu_sprite.png",
        character: "assets/images/character_sprites/hamu_hamu.png",
        canvasBackground: "url('assets/images/backgrounds/fallbg.gif'), url('assets/images/backgrounds/bg_hamu.png')",
        pageBackground: "url('assets/images/backgrounds/bg_hamu.png')",
        music: "assets/sounds/hamu.mp3",
        
        outline: "#ff8e1c",
        shadow: "#d36102",
        gradient: "linear-gradient(to bottom, #f9a65a, #ffbc80)",
        hoverGradient: "linear-gradient(to bottom, #ffa9b8, #ff605f)",
        hoverOutline: "#ff1a14"
        },
            merry: {
        ground: "assets/images/sprites/merry_ground.png",
        sprite: "assets/images/sprites/merry_sprite.png",
        character: "assets/images/character_sprites/merry_hamu.png",
        canvasBackground: "url('assets/images/backgrounds/snowflabg.gif'), url('assets/images/backgrounds/bg_merry.png')",
        pageBackground: "url('assets/images/backgrounds/bg_merry1.png')",
        music: "assets/sounds/merry.mp3",

        //for buttons & title outlines CSS
        outline: "#44bf4d",
        shadow: "#83cf8a",
        gradient: "linear-gradient(to bottom, #64c76d, #aedbb2)",
        hoverGradient: "linear-gradient(to bottom, #d04360, #eb5877)",
        hoverOutline: "#89464e"
    },
    berry: {
        ground: "assets/images/sprites/berry_groundB.png",
        sprite: "assets/images/sprites/berry_sprite.png",
        character: "assets/images/character_sprites/berry_hamu.png",
        canvasBackground: "url('assets/images/backgrounds/heartbg.gif'), url('assets/images/backgrounds/bg_berry.png')",
        pageBackground: "url('assets/images/backgrounds/bg_berry.png')",
        music: "assets/sounds/berry.mp3",

        //for buttons & title outlines CSS
        outline: "#ed54a5",
        shadow: "#ed54a5",
        gradient: "linear-gradient(to bottom, #ff8bbd, #ffb8d7)",
        hoverGradient: "linear-gradient(to bottom, #ffa9b8, #ff605f)",
        hoverOutline: "#ff1a14"
    },
    mint: {
        ground: "assets/images/sprites/mint_ground.png",
        sprite: "assets/images/sprites/mint_sprite.png",
        character: "assets/images/character_sprites/mint_hamu.png",
        canvasBackground: "url('assets/images/backgrounds/heartmintbg.gif'), url('assets/images/backgrounds/bg_mint2.png')",
        pageBackground: "url('assets/images/backgrounds/bg_mint.png')",
        music: "assets/sounds/mint.mp3",

        //for buttons & title outlines CSS
        outline: "#379992",
        shadow: "#93d3d6",
        gradient: "linear-gradient(to bottom, #9dd8d9, #96cbcc)",
        hoverGradient: "linear-gradient(to bottom, #9cccf3, #c3e0f8)",
        hoverOutline: "#489dea"
    },
    hamuStar: {
        ground: "assets/images/sprites/hamuSTAR_ground.png",
        sprite: "assets/images/sprites/hamuSTAR_sprite.png",
        character: "assets/images/character_sprites/hamuSTAR_hamu.png",
        canvasBackground: "url('assets/images/backgrounds/bg_try.gif'), url('assets/images/backgrounds/bg_merry.png')",
        pageBackground: "url('assets/images/backgrounds/bg_merry.png')",
        music: "assets/sounds/hamustar.mp3",
        //for buttons & title outlines CSS
        outline: "#ff8e1c",
        shadow: "#d36102",
        gradient: "linear-gradient(to bottom, #f9a65a, #ffbc80)",
        hoverGradient: "linear-gradient(to bottom, #ffa9b8, #ff605f)",
        hoverOutline: "#ff1a14"
    },
    chiikawa: {
        ground: "assets/images/sprites/chiikawa_ground.png",
        sprite: "assets/images/sprites/chiikawa_sprite.png",
        character: "assets/images/character_sprites/chiikawa_hamu.png",
        canvasBackground: "url('assets/images/backgrounds/bg_tryA.gif'), url('assets/images/backgrounds/bg_merry.png')",
        pageBackground: "url('assets/images/backgrounds/bg_merry.png')",
        music: "assets/sounds/chiikawa.mp3",

        //for trail
        trailHue: "-127",

        //for buttons & title outlines CSS
        outline: "#9ea24a",
        shadow: "#d2db9f",
        gradient: "linear-gradient(to bottom, #c6cb9a, #b1d28a",
        hoverGradient: "linear-gradient(to bottom, #ffa9b8, #ff605f)",
        hoverOutline: "#ff1a14"
    },
    };

    static #selectedHamster = localStorage.getItem("selectedHamster") || "hamu";
    static spriteSheet = new Image();
    static hamsterImage = new Image();
    static hamsterSpriteSheet = new Image();
    static hueValue = null;

    static {
        // Initialize assets
        this.updateAssets();
        this.updateThemeVariables();
    }

    static get selectedHamster() {
        return this.#selectedHamster;
    }

    static set selectedHamster(hamsterKey) {
        if (this.hamsterAssets[hamsterKey]) {
            this.#selectedHamster = hamsterKey;
            localStorage.setItem("selectedHamster", hamsterKey);
            this.updateAssets();
            this.updateThemeVariables();
            this.dispatchThemeChangeEvent();
        }
    }

    static getHamsterAssets(hamsterKey = null) {
        const key = hamsterKey || this.#selectedHamster;
        return this.hamsterAssets[key] || this.hamsterAssets.hamu;
    }

    static updateAssets() {
        const assets = this.getHamsterAssets();
        this.spriteSheet.src = assets.ground;
        this.hamsterImage.src = assets.character;
        this.hamsterSpriteSheet.src = assets.sprite;
        this.hueValue = assets.trailHue;
        window.hamsterTheme = assets;
    }

    static updateThemeVariables() {
        const assets = this.getHamsterAssets();
        const root = document.documentElement;
        
        root.style.setProperty('--outline', assets.outline);
        root.style.setProperty('--shadow', assets.shadow);
        root.style.setProperty('--gradient', assets.gradient);
        root.style.setProperty('--hover-gradient', assets.hoverGradient);
        root.style.setProperty('--hover-outline', assets.hoverOutline);
        
        // Update canvas container background
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            canvasContainer.style.background = assets.canvasBackground;
        }
        
        // Only update the page background if we're on game.html
        const isGamePage = window.location.pathname.includes('game.html') || 
                          window.location.pathname.endsWith('/game') || 
                          window.location.pathname.endsWith('/game/');
        
        if (isGamePage) {
            document.body.style.backgroundImage = assets.canvasBackground;
            document.documentElement.style.backgroundImage = assets.canvasBackground;
        }
    }

    static dispatchThemeChangeEvent() {
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: {
                hamster: this.#selectedHamster,
                assets: this.getHamsterAssets()
            }
        }));
    }
}

export default ThemeManager;