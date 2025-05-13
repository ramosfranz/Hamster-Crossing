const root = document.documentElement;
const hamsterChoices = document.querySelectorAll(".hamsterChoice");
const hamsterPics = document.querySelectorAll(".hcPic");
const chooseBtn = document.getElementById("chooseHamster");
const rollBtn = document.getElementById("rollButton");
const closeBtn = document.getElementById("closePopup");
const popup = document.getElementById("popup");
const openBtn = document.getElementById("openPopup");

// Initialize unlocked characters from session storage
let hamuStarUnlocked = JSON.parse(sessionStorage.getItem("hamuStarUnlocked")) || false;
let chiikawaUnlocked = JSON.parse(sessionStorage.getItem("chiikawaUnlocked")) || false;

// Initialize selected hamster
window.selectedHamster = localStorage.getItem("selectedHamster") || "hamu";

// Trigger the choose your hamster pop-up
openBtn.addEventListener("click", () => {
    popup.classList.add("open");
    // Update UI based on unlocked characters
    updateHamsterUI();
});

// Close the choose your hamster pop-up
closeBtn.addEventListener("click", () => {
    popup.classList.remove("open");
});

// When choosing the hamster, set the unselected ones to "less saturation"
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
        
        // Unlocked characters cannot be chosen 
        if ((selected === "hamuStar" && !hamuStarUnlocked) || (selected === "chiikawa" && !chiikawaUnlocked)) {
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

    // If the two special hamsters are obtained, then roll button is disabled
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
    
        // How the rolls are determined and updated according to the roll results
        if (result < 0.33) {
            resultMessage.textContent = "You have obtained a sunflower seed!";
            resultImage.style.display = "none";
        } else if (result < 0.66) {
            resultMessage.textContent = "You unlocked Hamu STAR!";
            resultImage.src = "assets/images/selection_sprites/HS_hamu STAR.png";
            resultImage.style.display = "block";
            document.getElementById("hs_hamuStar").src = "assets/images/selection_sprites/HS_hamu STAR.png";
            document.getElementById("hs_hamuStar").alt = "Hamu STAR"; 
            document.getElementById("hamuStarName").textContent = "Hamu STAR"; 
            hamuStarUnlocked = true;
            sessionStorage.setItem("hamuStarUnlocked", JSON.stringify(true));
        } else {
            resultMessage.textContent = "You unlocked Chiikawa!";
            resultImage.src = "assets/images/selection_sprites/HS_chikawa.png";
            resultImage.style.display = "block";
            document.getElementById("hs_chiikawa").src = "assets/images/selection_sprites/HS_chikawa.png";
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

// Close the result pop-up
const closeResultPopupBtn = document.getElementById("closeResultPopup");
closeResultPopupBtn.addEventListener("click", () => {
    document.getElementById("resultPopup").style.display = "none";
});


// Change assets of pathfinding pages depending on the chosen hamster
chooseBtn.addEventListener("click", () => {
    // For debugging / verifying the unlock states
    console.log("Checking unlock states for popup...");
    console.log("HamuStarUnlocked:", hamuStarUnlocked);
    console.log("ChiikawaUnlocked:", chiikawaUnlocked);
    
    // Retrieve selected hamster
    const selectedHamster = localStorage.getItem("selectedHamster") || window.selectedHamster;

    if (!selectedHamster) {
        console.warn("No hamster selected. Using default assets.");
        return;
    }

    // Apply assets according to the selected hamster
    const assets = getHamsterAssets(selectedHamster);
    console.log("Applying assets for selected hamster:", selectedHamster, assets);
    
    // Store the selection in local storage for the game page to use
    localStorage.setItem("hamsterAssets", JSON.stringify(assets));
    
    // Close the popup after selection is confirmed
    popup.classList.remove("open");
    
    // Notify the user that their selection is saved
    alert(`You've selected ${selectedHamster}! Click 'Start the Game' to begin.`);
});

// Apply the hamster character when the game starts
document.querySelector('button[onclick="window.location.href=\'game.html\'"]').addEventListener("click", function() {
    const selectedHamster = localStorage.getItem("selectedHamster") || "hamu";
    if (!selectedHamster) {
        alert("Please select a hamster before starting the game!");
        return false;
    }
});