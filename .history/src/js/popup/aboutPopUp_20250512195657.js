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
                    <img src="assets/images/book/aStar_book.png" class="bookIcons">
                    <span class="algorithmText">A*</span>
                </div>
                <div class="algorithmColumn">
                    <img src="assets/images/book/aStar_book.png" class="bookIcons">
                    <span class="algorithmText">A*</span>
                </div>
                <div class="algorithmColumn">
                    <img src="assets/images/book/aStar_book.png" class="bookIcons">
                    <span class="algorithmText">A*</span>
                </div>
                <div class="algorithmColumn">
                    <img src="assets/images/book/aStar_book.png" class="bookIcons">
                    <span class="algorithmText">A*</span>
                </div>
                <div class="algorithmColumn">
                    <img src="assets/images/book/aStar_book.png" class="bookIcons">
                    <span class="algorithmText">A*</span>
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
    .algorithmsList {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        gap: 10px;
        margin-top: 15px;
    }
    
    .algorithmColumn {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: rgba(139, 69, 19, 0.1);
        padding: 10px;
        border-radius: 8px;
        text-align: center;
    }
    
    .algorithmText {
        margin-top: 10px;
        font-weight: bold;
        color: #8B4513;
    }

    .bookIcons {
        width: 60%;
        max-width: 80px;
        height: auto;
    }
`;
document.head.appendChild(style);