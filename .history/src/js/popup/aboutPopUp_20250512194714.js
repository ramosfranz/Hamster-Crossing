const aboutButton = document.getElementById("aboutButton");
const aboutPopup = document.createElement("div");
aboutPopup.className = "popup";
aboutPopup.id = "aboutPopup";

aboutPopup.innerHTML = `
    <div class="innerPopup">
    <button class="closePopup" id="closeAboutPopup"><i id="closeIcon" class="fa-solid fa-xmark"></i></button>
        <div class="aboutContent">
            <p>Hamster Crossing uses a lot of pathfinding algorithms! </p>
            <h2>Algorithms Used in Hamster Crossing</h2>
            <div class="algorithmsList">
                <div class="algorithmColumn">
                    <span class="algorithmIcon">🗺️</span>
                    <span class="algorithmName">A* Pathfinding</span>
                </div>
                <div class="algorithmColumn">
                    <span class="algorithmIcon">🌐</span>
                    <span class="algorithmName">Dijkstra's Algorithm</span>
                </div>
                <div class="algorithmColumn">
                    <span class="algorithmIcon">🧩</span>
                    <span class="algorithmName">Grid-Based Pathfinding</span>
                </div>
                <div class="algorithmColumn">
                    <span class="algorithmIcon">🔍</span>
                    <span class="algorithmName">Breadth-First Search</span>
                </div>
                <div class="algorithmColumn">
                    <span class="algorithmIcon">🚦</span>
                    <span class="algorithmName">Waypoint Navigation</span>
                </div>
            </div>
        </div>
    </div>
`;

// Add the popup to the body
document.body.appendChild(aboutPopup);

// Get close buttons
const closeAboutPopupBtn = document.getElementById("closeAboutPopup");

// Function to open the about popup
function openAboutPopup() {
    aboutPopup.classList.add("open");
}

// Function to close the about popup
function closeAboutPopup() {
    aboutPopup.classList.remove("open");
}

// Event listeners for opening and closing the about popup
aboutButton.addEventListener("click", openAboutPopup);
closeAboutPopupBtn.addEventListener("click", closeAboutPopup);

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
    
    .algorithmsList {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 15px;
    }
    
    .algorithmRow {
        display: flex;
        align-items: center;
        background-color: rgba(139, 69, 19, 0.1);
        padding: 10px;
        border-radius: 8px;
    }
    
    .algorithmIcon {
        margin-right: 15px;
        font-size: 1.5em;
    }
    
    .algorithmName {
        flex-grow: 1;
        font-weight: bold;
        color: #8B4513;
    }

`;
document.head.appendChild(style);