// Hamster falling animation script
document.addEventListener('DOMContentLoaded', function() {
    const hamster = document.getElementById('hamster');
    
    // Set initial position off-screen at the top
    hamster.style.top = '-64px';
    
    // Function to animate the falling hamster
    function animateHamsterFall() {
        // Reset position to top of screen
        hamster.style.top = '-64px';
        
        // Random horizontal position (10% to 90% of screen width)
        const randomXPosition = 10 + Math.random() * 80;
        hamster.style.left = `${randomXPosition}%`;
        
        // Make sure the hamster is visible
        hamster.style.display = 'block';
        
        // Create the animation
        let startTime = null;
        const duration = 2000; // 2 seconds to fall
        
        // Frame counter for sprite animation
        let frameCount = 0;
        const framesPerRow = 2; // Assuming 2 frames in sprite sheet
        const frameSize = 64; // 64px per frame
        
        function fall(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Calculate vertical position
            const screenHeight = window.innerHeight;
            const newY = progress * (screenHeight + 64); // +64 to ensure it goes completely off-screen
            hamster.style.top = `${newY}px`;
            
            // Update sprite frame every 100ms
            if (elapsed % 200 < 16) { // Switch frame roughly every 200ms
                frameCount = (frameCount + 1) % framesPerRow;
                hamster.src = `public/hamster_falling/hamu_fall${frameCount + 1}.png`;
            }
            
            // Continue animation if not complete
            if (progress < 1) {
                requestAnimationFrame(fall);
            } else {
                // Hide the hamster when it goes off-screen
                hamster.style.display = 'none';
            }
        }
        
        // Start the animation
        requestAnimationFrame(fall);
    }
    
    // Run the animation immediately once and then every 5 seconds
    animateHamsterFall();
    setInterval(animateHamsterFall, 5000);
});