document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");
    const aboutSection = document.getElementById("about");
    const hamster = document.getElementById("hamster");
    const root = document.documentElement;
    const hamsterChoices = document.querySelectorAll(".hamsterChoice");
    const hamsterPics = document.querySelectorAll(".hcPic");
    const chooseBtn = document.getElementById("chooseHamster");
    const rollBtn = document.getElementById("rollButton");
  
    // Retreive unlocked characters "state"
    if (sessionStorage.getItem("hamuStarUnlocked") === null) {
      sessionStorage.setItem("hamuStarUnlocked", JSON.stringify(false));
    }
    if (sessionStorage.getItem("chiikawaUnlocked") === null) {
      sessionStorage.setItem("chiikawaUnlocked", JSON.stringify(false));
    }
    let hamuStarUnlocked = JSON.parse(sessionStorage.getItem("hamuStarUnlocked"));
    let chiikawaUnlocked = JSON.parse(sessionStorage.getItem("chiikawaUnlocked"));
    console.log("Session states (start of new session):", {
      hamuStarUnlocked,
      chiikawaUnlocked,
    });
    let selectedHamster = localStorage.getItem("selectedHamster") || null;
  
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
  
    // Hamster choice selection: remove "low-saturation" class from the selected image
    hamsterChoices.forEach((choice) => {
      choice.addEventListener("click", () => {
        hamsterPics.forEach((pic) => {
          pic.classList.remove("low-saturation");
        });
        hamsterPics.forEach((pic) => {
          if (pic !== choice.querySelector(".hcPic")) {
            pic.classList.add("low-saturation");
          }
        });
  
        // Update the selected hamster
        const selected = choice.querySelector("img").id.replace("hs_", "");
        window.selectedHamster = selected;
  
        // Unlocked characters cannot be chosen if not unlocked
        if (
          (selected === "hamuStar" && !hamuStarUnlocked) ||
          (selected === "chiikawa" && !chiikawaUnlocked)
        ) {
          chooseBtn.disabled = true;
          chooseBtn.textContent = "Choose ???";
        } else {
          localStorage.setItem("selectedHamster", selected);
          chooseBtn.textContent = `Choose ${selected}`;
          chooseBtn.disabled = false;
        }
        console.log("Selected hamster updated to:", selected);
      });
    });
  
    // Update the hamster selection choices based on the session storage
    function updateHamsterUI() {
      if (hamuStarUnlocked) {
        document.getElementById("hs_hamuStar").src =
          "assets/images/selection_sprites/HS_hamu STAR.png";
        document.getElementById("hs_hamuStar").alt = "Hamu STAR";
        document.getElementById("hamuStarName").textContent = "Hamu STAR";
        hamuStarUnlocked = true;
        sessionStorage.setItem("hamuStarUnlocked", JSON.stringify(true));
      }
      if (chiikawaUnlocked) {
        document.getElementById("hs_chiikawa").src =
          "assets/images/selection_sprites/HS_chiikawa.png";
        document.getElementById("hs_chiikawa").alt = "Chiikawa";
        document.getElementById("chiikawaName").textContent = "Chiikawa";
        chiikawaUnlocked = true;
        sessionStorage.setItem("chiikawaUnlocked", JSON.stringify(true));
      }
    }
    updateHamsterUI();
  
    // Gacha / roll function
    rollBtn.addEventListener("click", () => {
      console.log("Rolling...");
  
      // Disable roll if all characters are unlocked
      if (hamuStarUnlocked && chiikawaUnlocked) {
        rollBtn.textContent = "You already have obtained all characters";
        rollBtn.disabled = true;
        return;
      }
      // Update images based on the unlocked state
      if (hamuStarUnlocked) {
        document.getElementById("hs_hamuStar").src =
          "assets/images/selection_sprites/HS_hamu STAR.png";
        document.getElementById("hs_hamuStar").alt = "Hamu STAR";
        document.getElementById("hamuStarName").textContent = "Hamu STAR";
        hamuStarUnlocked = true;
        sessionStorage.setItem("hamuStarUnlocked", JSON.stringify(true));
      }
      if (chiikawaUnlocked) {
        document.getElementById("hs_chiikawa").src =
          "assets/images/selection_sprites/HS_chiikawa.png";
        document.getElementById("hs_chiikawa").alt = "Chiikawa";
        document.getElementById("chiikawaName").textContent = "Chiikawa";
        chiikawaUnlocked = true;
        sessionStorage.setItem("chiikawaUnlocked", JSON.stringify(true));
      }
  
      rollBtn.disabled = true;
      chooseBtn.disabled = true;
      rollBtn.textContent = "Rolling...";
  
      setTimeout(() => {
        const result = Math.random();
        const resultPopup = document.getElementById("resultPopup");
        const resultMessage = document.getElementById("resultMessage");
        const resultImage = document.getElementById("resultImage");
  
        resultPopup.style.display = "flex";
  
        // Determine the result based on the random value
        if (result < 0.33) {
          resultMessage.textContent = "You have obtained a sunflower seed!";
          resultImage.style.display = "none";
        } else if (result < 0.66) {
          resultMessage.textContent = "You unlocked Hamu STAR!";
          resultImage.src = "assets/images/selection_sprites/HS_hamu STAR.png";
          resultImage.style.display = "block";
          document.getElementById("hs_hamuStar").src =
            "assets/images/selection_sprites/HS_hamu STAR.png";
          document.getElementById("hs_hamuStar").alt = "Hamu STAR";
          document.getElementById("hamuStarName").textContent = "Hamu STAR";
          hamuStarUnlocked = true;
          sessionStorage.setItem("hamuStarUnlocked", JSON.stringify(true));
        } else {
          resultMessage.textContent = "You unlocked Chiikawa!";
          resultImage.src = "assets/images/selection_sprites/HS_chiikawa.png";
          resultImage.style.display = "block";
          document.getElementById("hs_chiikawa").src =
            "assets/images/selection_sprites/HS_chiikawa.png";
          document.getElementById("hs_chiikawa").alt = "Chiikawa";
          document.getElementById("chiikawaName").textContent = "Chiikawa";
          chiikawaUnlocked = true;
          sessionStorage.setItem("chiikawaUnlocked", JSON.stringify(true));
        }
  
        rollBtn.disabled = false;
        chooseBtn.disabled = false;
        rollBtn.textContent = "Roll";
  
        // For verification
        console.log("Roll results saved:", {
          hamuStarUnlocked,
          chiikawaUnlocked,
        });
      }, 2000);
    });
  
    chooseBtn.disabled = true;
  
    // Change assets of pathfinding pages depending on the chosen hamster
    chooseBtn.addEventListener("click", () => {
      console.log("Checking unlock states for popup...");
      console.log("HamuStarUnlocked:", hamuStarUnlocked);
      console.log("ChiikawaUnlocked:", chiikawaUnlocked);
      if (hamuStarUnlocked) {
        console.log("Hamu Star is unlocked.");
      }
      if (chiikawaUnlocked) {
        console.log("Chiikawa is unlocked.");
      }
  
      // Retrieve selected hamster
      const selectedHamster = localStorage.getItem("selectedHamster") || window.selectedHamster;
  
      if (!selectedHamster) {
        console.warn("No hamster selected. Using default assets.");
        return;
      }
  
      // Apply assets according to the selected hamster via your getHamsterAssets() helper
      const assets = getHamsterAssets();
      console.log("Applying assets for selected hamster:", selectedHamster, assets);
      spriteSheet.src = assets.ground;
      hamsterImage.src = assets.character;
      hamsterSpriteSheet.src = assets.sprite;
      const hueValue = assets.trailHue || 0;
      console.log("Hue value used:", hueValue);
      console.log("Assets applied successfully.");
    });
  });
  