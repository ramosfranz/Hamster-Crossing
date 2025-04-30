document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");
  const aboutSection = document.getElementById("about");
  const hamster = document.getElementById("hamster");
  const root = document.documentElement;

  // Add the background music
  const audioElement = document.createElement("audio");
  audioElement.setAttribute("autoplay", "autoplay");
  audioElement.setAttribute("loop", "loop");
  const sourceElement = document.createElement("source");
  sourceElement.src = "assets/sounds/main.mp3";
  sourceElement.type = "audio/mpeg";
  audioElement.appendChild(sourceElement);
  document.body.appendChild(audioElement);
  audioElement.volume = 0.3;
  console.log("Background music set to: assets/music/hamu.mp3");

  // About page squares - ensure they are of the same height
  const squares = document.querySelectorAll(".square");
  let maxHeight = 0;
  squares.forEach((square) => {
    const squareHeight = square.offsetHeight;
    if (squareHeight > maxHeight) {
      maxHeight = squareHeight + 20;
    }
  });
  squares.forEach((square) => {
    square.style.height = `${maxHeight}px`;
  });

  // Hamster falling animation
  function triggerHamsterAnimation() {
    hamster.style.animation = "none";
    void hamster.offsetWidth;
    hamster.style.animation =
      "hamsterFall 2s linear forwards, hamsterFrame 0.5s steps(2) infinite";
    hamster.style.animationPlayState = "running";
  }

  function checkAnimationTrigger() {
    const sectionTop = aboutSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (sectionTop <= windowHeight / 2) {
      triggerHamsterAnimation();
    }
  }

  document.getElementById("aboutButton").addEventListener("click", function () {
    triggerHamsterAnimation();
  });
  window.addEventListener("scroll", checkAnimationTrigger);
  hamster.style.animationPlayState = "paused";
});