document.addEventListener("DOMContentLoaded", function () {
  const hamsterChoices = document.querySelectorAll(".hamsterChoice");
  const hamsterPics = document.querySelectorAll(".hcPic");
  const root = document.documentElement;
  const chooseBtn = document.getElementById("chooseHamster");

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

    // ----------------------------------------------------------------------------------
  });
  