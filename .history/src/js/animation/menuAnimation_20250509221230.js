// Add this script to handle frame animation
document.addEventListener('DOMContentLoaded', () => {
    const hamster = document.getElementById('hamster');
    const frames = [
      'public/hamster_falling/hamu_fall1.png',
      'public/hamster_falling/hamu_fall2.png'
    ];
    let currentFrame = 0;
    
    setInterval(() => {
      currentFrame = (currentFrame + 1) % frames.length;
      hamster.src = frames[currentFrame];
    }, 250);
  });