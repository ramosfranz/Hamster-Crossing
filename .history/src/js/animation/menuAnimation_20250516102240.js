// Get both hamster elements
const hamu = document.getElementById('hamster');
const berry = document.getElementById('berry');
const merry = document.getElementById('merry');
const mint = document.getElementById('mint');
const bgMusic = document.getElementById("bgMusic");

// Animation frames for each hamster
const hamuFrames = [
    'assets/images/hamster_falling/hamu_fall1.png',
    'assets/images/hamster_falling/hamu_fall2.png'
];

const berryFrames = [
    'assets/images/hamster_falling/berry_fall1.png',
    'assets/images/hamster_falling/berry_fall2.png'
];

const merryFrames = [
    'assets/images/hamster_falling/merry_fall1.png',
    'assets/images/hamster_falling/merry_fall2.png'
];

const mintFrames = [
    'assets/images/hamster_falling/mint_fall1.png',
    '/assets/images/hamster_falling/mint_fall2.png'
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
    // Random delay for hamster animations (between 0 and 6 seconds)
    const berryDelay = Math.random() * 6000;
    const merryDelay = Math.random() * 3000;
    const mintDelay = Math.random() * 4000;
    // Set initial state for hamsters
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
    const startGameButton = document.querySelector('button.pixelButton:nth-child(2)');  // Select the second button
    const aboutButton = document.getElementById('aboutButton');
    
    console.log("Setting up button sounds");
    console.log("Open Popup Button:", openPopupButton);
    console.log("Start Game Button:", startGameButton);
    console.log("About Button:", aboutButton);
    
    // Add event listeners for click sounds
    if (openPopupButton) {
        openPopupButton.addEventListener('click', () => {
            console.log("Open popup clicked");
            clickSound.currentTime = 0; // Reset sound to start
            clickSound.play();
        });
    }
    
    if (aboutButton) {
        aboutButton.addEventListener('click', () => {
            console.log("About button clicked");
            clickSound.currentTime = 0;
            clickSound.play();
        });
    }
    
    // Add event listener for confirm sound (Start Game button)
    if (startGameButton) {
        startGameButton.addEventListener('click', (event) => {
            console.log("Start game button clicked");
            // Prevent the default navigation if using an onclick attribute
            event.preventDefault();
            
            // Play the sound
            clickSound.currentTime = 0;
            clickSound.play();
            
            // Navigate after a short delay to ensure sound plays
            setTimeout(() => {
                window.location.href = 'game.html';
            }, 300); // Short delay to allow sound to play
        });
    }
}
// Initialize sounds and bgMusic when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupButtonSounds();

    const bgMusic = document.getElementById("bgMusic");

    // Unmute and play background music on first user interaction
    function enableBgMusic() {
        if (bgMusic && bgMusic.muted) {
            bgMusic.muted = false;
            bgMusic.volume = 0.5;
            bgMusic.play();
            console.log("Background music enabled");
        }

        // Remove listener after first trigger to avoid repeated calls
        document.body.removeEventListener('click', enableBgMusic);
    }

    document.body.addEventListener("click", enableBgMusic);
});
