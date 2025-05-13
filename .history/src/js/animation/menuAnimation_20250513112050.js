// Get both hamster elements
const hamu = document.getElementById('hamster');
const berry = document.getElementById('berry'); // We'll add this element to the HTML
const merry = document.getElementById('merry');
const mint = document.getElementById('mint');

// Animation frames for each hamster
const hamuFrames = [
    'public/hamster_falling/hamu_fall1.png',
    'public/hamster_falling/hamu_fall2.png'
];

const berryFrames = [
    'public/hamster_falling/berry_fall1.png',
    'public/hamster_falling/berry_fall2.png'
];

const merryFrames = [
    'public/hamster_falling/merry_fall1.png',
    'public/hamster_falling/merry_fall2.png'
];

const mintFrames = [
    'public/hamster_falling/mint_fall1.png',
    'public/hamster_falling/mint_fall2.png'
];


let currentFrame = 0;

// Animate frames every 250ms for both hamsters
setInterval(() => {
    currentFrame = (currentFrame + 1) % hamuFrames.length;
    hamu.src = hamuFrames[currentFrame];
    berry.src = berryFrames[currentFrame];
    merry.src = merryFrames[currentFrame];
    mint.src = mintFrames[currentFrame];
}, 250);

// Randomize start time for each hamster's animation
window.addEventListener('DOMContentLoaded', () => {
    // Random delay for Berry's animation (between 0 and 6 seconds)
    const berryDelay = Math.random() * 6000;
    const merryDelay = Math.random() * 3000;
    const mintDelay = Math.random() * 4000;
    // Set initial state for Berry
    berry.style.animationDelay = `${berryDelay}ms`;
    merry.style.animationDelay = `${merryDelay}ms`;
    mint.style.animationDelay = `${mintDelay}ms`;
});

// Sound effects handler for menu buttons
function setupButtonSounds() {
    // Sound effects
    const clickSound = new Audio('assets/sounds/click_SFX.mp3');
    const confirmSound = new Audio('assets/sounds/confirm_SFX.mp3');
    
    // Get button elements
    const openPopupButton = document.getElementById('openPopup');
    const startGameButton = document.querySelector('button[onclick="window.location.href=\'game.html\'"]');
    const aboutButton = document.getElementById('aboutButton');
    
    // Add event listeners for click sounds
    if (openPopupButton) {
        openPopupButton.addEventListener('click', () => {
            clickSound.currentTime = 0; // Reset sound to start
            clickSound.play();
        });
    }
    
    if (aboutButton) {
        aboutButton.addEventListener('click', () => {
            clickSound.currentTime = 0;
            clickSound.play();
        });
    }
    
    // Add event listener for confirm sound (Start Game button)
    if (startGameButton) {
        startGameButton.addEventListener('click', (event) => {
            // Play the sound
            confirmSound.currentTime = 0;
            
            // Prevent the default navigation
            event.preventDefault();
            
            // Play the sound and wait for it to finish before navigating
            confirmSound.play();
            
            // Navigate after a short delay to ensure sound plays
            setTimeout(() => {
                window.location.href = 'game.html';
            }, 300); // Short delay to allow sound to play
        });
    }
}

// Initialize sounds when DOM is loaded
document.addEventListener('DOMContentLoaded', setupButtonSounds);