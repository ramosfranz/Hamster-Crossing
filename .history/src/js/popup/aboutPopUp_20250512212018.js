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
            <div class="algorithmsContainer">
                <div class="algorithmsList">
                    <div class="algorithmColumn" data-algorithm="aStar">
                        <img src="assets/images/book/aStar_book.png" class="bookIcons">
                        <span class="algorithmText">A*</span>
                    </div>
                    <div class="algorithmColumn" data-algorithm="dijkstra">
                        <img src="assets/images/book/aStar_book.png" class="bookIcons">
                        <span class="algorithmText">Dijkstra's</span>
                    </div>
                    <div class="algorithmColumn" data-algorithm="gridBased">
                        <img src="assets/images/book/aStar_book.png" class="bookIcons">
                        <span class="algorithmText">Grid-Based</span>
                    </div>
                    <div class="algorithmColumn" data-algorithm="bfs">
                        <img src="assets/images/book/aStar_book.png" class="bookIcons">
                        <span class="algorithmText">Breadth-First</span>
                    </div>
                    <div class="algorithmColumn" data-algorithm="waypoint">
                        <img src="assets/images/book/aStar_book.png" class="bookIcons">
                        <span class="algorithmText">Waypoint</span>
                    </div>
                </div>
                <div class="algorithmFullDescription">
                    <div class="descriptionContent">
                        <img src="assets/images/character_sprites/hamu_teach1.png" class="hamuTeachImage">
                        <p>Click an algorithm to learn more about its role in Hamster Crossing!</p>
                    </div>
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

// Descriptions for each algorithm
const algorithmDescriptions = {
    aStar: "A* (A-Star) is an advanced pathfinding algorithm that finds the most efficient route by calculating the best path based on both the distance traveled and estimated distance to the goal. In Hamster Crossing, A* helps the hamster navigate through complex levels by intelligently choosing the optimal path, considering both the current progress and the remaining distance to the destination.",
    dijkstra: "Dijkstra's Algorithm is a fundamental pathfinding technique that finds the shortest path between nodes in a graph. In Hamster Crossing, this algorithm ensures that the hamster takes the most efficient route, systematically exploring and analyzing different paths to minimize the total distance traveled.",
    gridBased: "Grid-Based Pathfinding breaks down the game world into a grid system, allowing precise movement and obstacle detection. Each level in Hamster Crossing is divided into a grid, where each cell can be analyzed for traversability, helping the hamster navigate around obstacles, collect seeds, and reach the goal with strategic precision.",
    bfs: "Breadth-First Search (BFS) is a traversal algorithm that explores all neighboring paths equally, checking routes layer by layer. In Hamster Crossing, BFS helps in discovering all possible short-distance paths, making it useful for understanding the immediate surroundings and finding alternative routes when the primary path is blocked.",
    waypoint: "Waypoint Navigation allows players to actively participate in the hamster's journey by setting specific points for navigation. This algorithm interprets the player's clicked waypoints, creating a custom path for the hamster to follow. It adds a strategic element to the game, letting players guide their hamster through levels with personalized routing."
};

// Hamu image animation variables
let currentHamuImage = 1;
const hamuImages = [
    'assets/images/character_sprites/hamu_teach1.png',
    'assets/images/character_sprites/hamu_teach2.png'
];

// Function to toggle Hamu image
function toggleHamuImage() {
    currentHamuImage = 1 - currentHamuImage; // Toggle between 0 and 1
    return hamuImages[currentHamuImage];
}

// Function to reset the description to default
function resetDescription() {
    const fullDescriptionEl = document.querySelector('.algorithmFullDescription');
    fullDescriptionEl.innerHTML = `
        <div class="descriptionContent">
            <img src="${toggleHamuImage()}" class="hamuTeachImage">
            <p>Click an algorithm to learn more about its role in Hamster Crossing!</p>
        </div>
    `;
}

// Add click event to algorithm columns
document.querySelectorAll('.algorithmColumn').forEach(column => {
    column.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent event from bubbling up

        // Remove active class from all columns
        document.querySelectorAll('.algorithmColumn').forEach(col => {
            col.classList.remove('active');
        });
        
        // Add active class to clicked column
        this.classList.add('active');

        // Update full description
        const algorithm = this.dataset.algorithm;
        const fullDescriptionEl = document.querySelector('.algorithmFullDescription');
        fullDescriptionEl.innerHTML = `
            <div class="descriptionContent">
                <img src="${toggleHamuImage()}" class="hamuTeachImage">
                <p>${algorithmDescriptions[algorithm]}</p>
            </div>
        `;
    });
});

// Add click event to the entire popup to deselect when clicking outside algorithm columns
aboutPopup.addEventListener('click', function(event) {
    // Check if the click was not on an algorithm column
    if (!event.target.closest('.algorithmColumn')) {
        // Remove active class from all columns
        document.querySelectorAll('.algorithmColumn').forEach(col => {
            col.classList.remove('active');
        });
        
        // Reset description to default
        resetDescription();
    }
});

// Add some additional styles for the about content
const style = document.createElement("style");
style.textContent = `
    .algorithmsContainer {
        display: flex;
        flex-direction: column;
    }

    .algorithmsList {
        display: flex;
        justify-content: space-evenly;
        flex-direction: row;
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
        position: relative;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .algorithmColumn:hover {
        background-color: rgba(139, 69, 19, 0.2);
    }
    
    .algorithmColumn.active {
        background-color: rgba(139, 69, 19, 0.3);
    }
    
    .algorithmText {
        margin-top: 10px;
        font-weight: bold;
        color: #8B4513;
    }

    .bookIcons {
        width: 50%;
        max-width: 80px;
        height: auto;
    }

    .algorithmFullDescription {
        margin-top: 15px;
        background-color: rgba(139, 69, 19, 0.1);
        padding: 15px;
        border-radius: 8px;
        color: #8B4513;
        line-height: 1.6;
    }

    .descriptionContent {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .hamuTeachImage {
        width: 200px;
        height: auto;
        object-fit: contain;
        transition: opacity 0.3s ease;
        animation: hamuBounce 0.5s ease;
    }

    @keyframes hamuBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    .descriptionContent p {
        flex-grow: 1;
        text-align: left;
    }
`;
document.head.appendChild(style);