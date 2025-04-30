document.addEventListener("DOMContentLoaded", function () {
  const hamsterChoices = document.querySelectorAll(".hamsterChoice");
  const hamsterPics = document.querySelectorAll(".hcPic");
  const root = document.documentElement;
  const chooseBtn = document.getElementById("chooseHamster");
  const rollBtn = document.getElementById("rollButton");

  // Retrieve unlocked characters "state"
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

  // Popup elements
  const openBtn = document.getElementById("openPopup");
  const closeBtn = document.getElementById("closePopup");
  const popup = document.getElementById("popup");

  // Result popup elements
  const closeResultPopupBtn = document.getElementById("closeResultPopup");
  const resultPopup = document.getElementById("resultPopup");

  // Open the hamster selection popup
  if (openBtn && popup) {
    openBtn.addEventListener("click", () => {
      popup.classList.add("open");
    });
  }

  // Close the hamster selection popup
  if (closeBtn && popup) {
    closeBtn.addEventListener("click", () => {
      popup.classList.remove("open");
    });
  }

  // Close the result popup
  if (closeResultPopupBtn && resultPopup) {
    closeResultPopupBtn.addEventListener("click", () => {
      resultPopup.style.display = "none";
    });
  }

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

  // Gacha / roll function - Migrated from menu.js
  if (rollBtn) {
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
  }

  // For chooseHamster functionality
  if (chooseBtn) {
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
  }
});