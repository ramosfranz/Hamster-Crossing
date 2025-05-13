const hamster = document.getElementById('hamster');
const frames = [
    'public/hamster_falling/hamu_fall1.png',
    'public/hamster_falling/hamu_fall2.png'
];
let currentFrame = 0;

// Animate frames every 250ms (unaffected by fall delay)
setInterval(() => {
    currentFrame = (currentFrame + 1) % frames.length;
    hamster.src = frames[currentFrame];
}, 250);