// Get both hamster elements
const hamu = document.getElementById('hamster');
const berry = document.getElementById('berry'); // We'll add this element to the HTML
const merry = document.getElementById('merry');

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


let currentFrame = 0;

// Animate frames every 250ms for both hamsters
setInterval(() => {
    currentFrame = (currentFrame + 1) % hamuFrames.length;
    hamu.src = hamuFrames[currentFrame];
    berry.src = berryFrames[currentFrame];
    merry.src = merryFrames[currentFrame];
}, 250);

// Randomize start time for each hamster's animation
window.addEventListener('DOMContentLoaded', () => {
    // Random delay for Berry's animation (between 0 and 6 seconds)
    const berryDelay = Math.random() * 6000;
    const merryDelay = Math.random() * 3000;
    // Set initial state for Berry
    berry.style.animationDelay = `${berryDelay}ms`;
    merry.style.animationDelay = `${merryDelay}ms`;
});