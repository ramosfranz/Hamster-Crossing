import ThemeManager from '../manager/themeManager.js';

const root = document.documentElement;
const hamsterChoices = document.querySelectorAll(".hamsterChoice");
const hamsterPics = document.querySelectorAll(".hcPic");
const chooseBtn = document.getElementById("chooseHamster");
const rollBtn = document.getElementById("rollButton");
const closeBtn = document.getElementById("closePopup");
const popup = document.getElementById("popup");
const openBtn = document.getElementById("openPopup");

let hamuStarUnlocked = JSON.parse(sessionStorage.getItem("hamuStarUnlocked")) || false;
let chiikawaUnlocked = JSON.parse(sessionStorage.getItem("chiikawaUnlocked")) || false;

const previouslySelected = sessionStorage.getItem("selectedHamster");
if (previouslySelected) {
    ThemeManager.selectedHamster = previouslySelected;
}

// Function to reset the saturation of all hamster pics
function resetSaturation() {
    hamsterPics.forEach((pic) => {
        pic.classList.remove("low-saturation");
    });
    // Also reset the choose button state
    chooseBtn.disabled = true;
    chooseBtn.textContent = "Choose a hamster";
}

// Function to update the visual selection indicator
function updateSelectionIndicator() {
    // First remove all selection indicators
    hamsterChoices.forEach(choice => {
        choice.classList.remove('selected');
    });
    
    // If there's a selected hamster, mark it
    if (ThemeManager.selectedHamster) {
        const selectedElement = document.getElementById(`hs_${ThemeManager.selectedHamster}`);
        if (selectedElement) {
            selectedElement.closest('.hamsterChoice').classList.add('selected');
        }
    }
}


// Trigger the choose your hamster pop-up
openBtn.addEventListener("click", () => {
    popup.classList.add("open");
    resetSaturation();
    // Update UI based on unlocked characters
    updateHamsterUI();
    updateSelectionIndicator();
});

// Close the choose your hamster pop-up
closeBtn.addEventListener("click", () => {
    popup.classList.remove("open");
    resetSaturation();
});

/// Update the hamster choice click handler
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
        
        const selected = choice.querySelector("img").id.replace("hs_", "");
        
         if ((selected === "hamuStar" && !hamuStarUnlocked) || 
            (selected === "chiikawa" && !chiikawaUnlocked)) {
            chooseBtn.disabled = true;
            chooseBtn.textContent = "Choose ???";
        } else {
            ThemeManager.selectedHamster = selected;
            chooseBtn.textContent = `Choose ${selected}`;
            chooseBtn.disabled = false;
        }
    });
});



// Update the hamster selection choices depending on the session storage
function updateHamsterUI() {
    if (hamuStarUnlocked) {
        document.getElementById("hs_hamuStar").src = "assets/images/selection_sprites/HS_hamu STAR.png";
        document.getElementById("hs_hamuStar").alt = "Hamu STAR"; 
        document.getElementById("hamuStarName").textContent = "Hamu STAR"; 
    }
    if (chiikawaUnlocked) {
        document.getElementById("hs_chiikawa").src = "assets/images/selection_sprites/HS_chikawa.png";
        document.getElementById("hs_chiikawa").alt = "Chiikawa"; 
        document.getElementById("chiikawaName").textContent = "Chiikawa"; 
    }
}

// Implement the hamster UI update
updateHamsterUI();

// Gacha / roll function
rollBtn.addEventListener("click", () => {
    console.log("Rolling...");
    console.log("Current unlock states:", {hamuStarUnlocked, chiikawaUnlocked});

    if (hamuStarUnlocked && chiikawaUnlocked) {
        rollBtn.textContent = "You already have obtained all characters";
        rollBtn.disabled = true;
        return;
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
    
        if (result < 0.33) {
            resultMessage.textContent = "You have obtained a sunflower seed!";
            resultImage.style.display = "none";
        } else if (result < 0.66) {
            hamuStarUnlocked = true;
            sessionStorage.setItem("hamuStarUnlocked", JSON.stringify(true));
            resultMessage.textContent = "You unlocked Hamu STAR!";
            resultImage.src = "assets/images/selection_sprites/HS_hamu STAR.png";
            resultImage.style.display = "block";
            updateHamsterUI();
        } else {
            chiikawaUnlocked = true;
            sessionStorage.setItem("chiikawaUnlocked", JSON.stringify(true));
            resultMessage.textContent = "You unlocked Chiikawa!";
            resultImage.src = "assets/images/selection_sprites/HS_chikawa.png";
            resultImage.style.display = "block";
            updateHamsterUI();
        }
  
        rollBtn.disabled = false;
        chooseBtn.disabled = !(hamuStarUnlocked && chiikawaUnlocked);
        rollBtn.textContent = "Roll";
        
        console.log("New unlock states:", {hamuStarUnlocked, chiikawaUnlocked});
    }, 2000);
});
  
chooseBtn.disabled = true;

// Close the result pop-up
const closeResultPopupBtn = document.getElementById("closeResultPopup");
closeResultPopupBtn.addEventListener("click", () => {
    document.getElementById("resultPopup").style.display = "none";
});


// Update the choose button click handler
chooseBtn.addEventListener("click", () => {
   console.log("Selected hamster:", ThemeManager.selectedHamster);
    const assets = ThemeManager.getHamsterAssets();
    
    if (!ThemeManager.selectedHamster) {
        console.warn("No hamster selected. Using default assets.");
        return;
    }

    // Get assets using themeManager's function
    console.log("Applying assets for selected hamster:", selectedHamster, assets);
    
    updateSelectionIndicator();
    sessionStorage.setItem("selectedHamster", ThemeManager.selectedHamster);

    // Close the popup after selection is confirmed
    popup.classList.remove("open");
    
    // Notify the user that their selection is saved
    alert(`You've selected ${selectedHamster}! Click 'Start the Game' to begin.`);
});

// Update game start button
document.querySelector('button[onclick="window.location.href=\'game.html\'"]').addEventListener("click", function(e) {
    e.preventDefault();
    
    if (!ThemeManager.selectedHamster || 
        (ThemeManager.selectedHamster === "hamuStar" && !hamuStarUnlocked) || 
        (ThemeManager.selectedHamster === "chiikawa" && !chiikawaUnlocked)) {
        alert("Please select a valid hamster before starting the game!");
        return false;
    }
    
    window.location.href = 'game.html';
});

// Listen for theme changes if needed
document.addEventListener('themeChanged', (e) => {
    console.log('Theme changed to:', e.detail.hamster);
});