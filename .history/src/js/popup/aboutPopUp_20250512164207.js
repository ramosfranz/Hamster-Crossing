const aboutButton = document.getElementById("aboutButton");
const aboutPopup = document.createElement("div");
aboutPopup.className = "popup";
aboutPopup.id = "aboutPopup";

aboutPopup.innerHTML = `
    <div class="innerPopup">
    <button class="closePopup" id="closeAboutPopup"><i id="closeIcon" class="fa-solid fa-xmark"></button>
        <div class="popupHeader">
        </div>
        <div class="aboutContent">
            <h2>Welcome to Hamster Crossing!</h2>
            <p>Help your hamster find its way through various obstacles to reach the goal!</p>
            
            <h3>How to Play</h3>
            <p>Guide your hamster by planning a safe path through the level. Avoid obstacles and collect sunflower seeds for bonus points!</p>
            
            <h3>Special Characters</h3>
            <p>Use the gacha system to unlock special hamster characters with unique abilities:</p>
            <ul style="list-style-type: none; padding-left: 10px;">
                <li>• Hamu STAR - Extra speed</li>
                <li>• Chiikawa - Can collect more seeds</li>
            </ul>
            
            <h3>Controls</h3>
            <p>Click to set waypoints for your hamster to follow.</p>
        </div>
        <button class="popupBtn" id="closeAboutBtn">Close</button>
    </div>
`;

// Add the popup to the body
document.body.appendChild(aboutPopup);

// Get close buttons
const closeAboutPopupBtn = document.getElementById("closeAboutPopup");
const closeAboutBtn = document.getElementById("closeAboutBtn");

// Function to open the about popup
function openAboutPopup() {
    aboutPopup.classList.add("open");
    triggerHamsterAnimation(); // Trigger the falling hamster animation
}

// Function to close the about popup
function closeAboutPopup() {
    aboutPopup.classList.remove("open");
}

// Event listeners for opening and closing the about popup
aboutButton.addEventListener("click", openAboutPopup);
closeAboutPopupBtn.addEventListener("click", closeAboutPopup);
closeAboutBtn.addEventListener("click", closeAboutPopup);

// Add some additional styles for the about content
const style = document.createElement("style");
style.textContent = `
    .aboutContent {
        max-height: 60vh;
        overflow-y: auto;
        padding: 10px;
        margin-bottom: 20px;
        color: #8B4513;
        font-family: 'Jersey 20', sans-serif;
    }
    
    .aboutContent h2 {
        color: #8B4513;
        text-align: center;
        margin-bottom: 15px;
    }
    
    .aboutContent h3 {
        color: #8B4513;
        margin-top: 15px;
        margin-bottom: 5px;
    }
    
    .aboutContent p {
        margin-bottom: 10px;
        line-height: 1.5;
    }
    
    .aboutContent ul {
        margin-top: 5px;
        margin-bottom: 10px;
    }
`;
document.head.appendChild(style);

