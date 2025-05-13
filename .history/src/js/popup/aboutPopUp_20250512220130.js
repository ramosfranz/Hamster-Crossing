const aboutButton = document.getElementById("aboutButton");
const aboutPopup = document.createElement("div");
aboutPopup.className = "popup";
aboutPopup.id = "aboutPopup";

aboutPopup.innerHTML = `
    <div class="innerPopup">
    <button class="closePopup" id="closeAboutPopup"><i id="closeIcon" class="fa-solid fa-xmark"></i></button>
        <div class="aboutContent">
            <p>Hamster Crossing uses a lot of pathfinding algorithms! These are: </p>
            <div class="algorithmsContainer">
                <div class="algorithmsList">
                    <div class="algorithmColumn" data-algorithm="aStar">
                        <img src="assets/images/book/aStar_book.png" class="bookIcons">
                        <span class="algorithmText">A*</span>
                    </div>
                    <div class="algorithmColumn" data-algorithm="dijkstra">
                        <img src="assets/images/book/dijkstra_book.png" class="bookIcons">
                        <span class="algorithmText">Dijkstra's</span>
                    </div>
                    <div class="algorithmColumn" data-algorithm="bfs">
                        <img src="assets/images/book/bfs_book.png" class="bookIcons">
                        <span class="algorithmText">BFS</span>
                    </div>
                    <div class="algorithmColumn" data-algorithm="dfs">
                        <img src="assets/images/book/dfs_book.png" class="bookIcons">
                        <span class="algorithmText">DFS</span>
                    </div>
                    <div class="algorithmColumn" data-algorithm="bellmanFord">
                        <img src="assets/images/book/bellmanFord_book.png" class="bookIcons">
                        <span class="algorithmText">Bellman-Ford</span>
                    </div>
                </div>
                <div class="algorithmFullDescription">
                    <div class="descriptionContent">
                        <img src="assets/images/character_sprites/hamu_teach1.png" class="hamuTeachImage" id="hamuTeachImage">
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
    startHamuAnimation();
}

// Function to close the about popup
function closeAboutPopup() {
    aboutPopup.classList.remove("open");
    stopHamuAnimation();
}

// Event listeners for opening and closing the about popup
aboutButton.addEventListener("click", openAboutPopup);
closeAboutPopupBtn.addEventListener("click", closeAboutPopup);

// Descriptions for each algorithm
const algorithmDescriptions = {
    aStar: "A* (A-Star) is an advanced pathfinding algorithm that finds the most efficient route by calculating the best path based on both the distance traveled and estimated distance to the goal. In Hamster Crossing, A* helps the hamster navigate through complex levels by intelligently choosing the optimal path, considering both the current progress and the remaining distance to the destination.",
    dijkstra: "Dijkstra's Algorithm is a fundamental graph traversal technique that finds the shortest path between nodes in a weighted graph. In Hamster Crossing, this algorithm systematically explores paths, ensuring the hamster takes the most efficient route by minimizing the total path cost.",
    bfs: "Breadth-First Search (BFS) is a graph traversal algorithm that explores all neighbor nodes at the present depth before moving to nodes at the next depth level. In Hamster Crossing, BFS helps discover the shortest path in unweighted graphs by exploring paths layer by layer, making it ideal for finding the quickest route with the fewest turns.",
    dfs: "Depth-First Search (DFS) is a graph traversal algorithm that explores as far as possible along each branch before backtracking. In Hamster Crossing, DFS can be used for exploring complex maze-like levels, systematically investigating each possible path to its deepest point before trying alternative routes.",
    bellmanFord: "Bellman-Ford Algorithm is a graph algorithm that finds the shortest paths from a single source vertex to all other vertices in a weighted graph, even with negative edge weights. In Hamster Crossing, this algorithm provides a robust method for path finding that can handle more complex routing scenarios with varying path costs."
};

// Hamu image animation variables
let currentHamuImage = 0;
const hamuImages = [
    'assets/images/character_sprites/hamu_teach1.png',
    'assets/images/character_sprites/hamu_teach2.png'
];
let hamuAnimationInterval = null;
let hamuFrameInterval = null;

// Function to toggle Hamu image with bounce animation
function toggleHamuImage() {
    const hamuTeachImage = document.getElementById('hamuTeachImage');
    
    // Add bounce animation class
    hamuTeachImage.classList.add('bounce');
    
    // Rapid frame switching
    let frameCount = 0;
    hamuFrameInterval = setInterval(() => {
        currentHamuImage = 1 - currentHamuImage; // Toggle between 0 and 1
        hamuTeachImage.src = hamuImages[currentHamuImage];
        frameCount++;
        
        // Stop after 6 frame switches (300ms of rapid switching)
        if (frameCount >= 6) {
            clearInterval(hamuFrameInterval);
        }
    }, 50);
    
    // Remove bounce class after animation
    setTimeout(() => {
        hamuTeachImage.classList.remove('bounce');
    }, 500);
}

// Start Hamu animation
function startHamuAnimation() {
    // Clear any existing intervals to prevent multiple animations
    if (hamuAnimationInterval) {
        clearInterval(hamuAnimationInterval);
    }
    if (hamuFrameInterval) {
        clearInterval(hamuFrameInterval);
    }
    
    // Start new interval
    hamuAnimationInterval = setInterval(toggleHamuImage, 1000);
}

// Stop Hamu animation
function stopHamuAnimation() {
    if (hamuAnimationInterval) {
        clearInterval(hamuAnimationInterval);
        hamuAnimationInterval = null;
    }
    if (hamuFrameInterval) {
        clearInterval(hamuFrameInterval);
        hamuFrameInterval = null;
    }
}

// Function to reset the description to default
function resetDescription() {
    const fullDescriptionEl = document.querySelector('.algorithmFullDescription');
    fullDescriptionEl.innerHTML = `
        <div class="descriptionContent">
            <img src="assets/images/character_sprites/hamu_teach1.png" class="hamuTeachImage" id="hamuTeachImage">
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
                <img src="assets/images/character_sprites/hamu_teach1.png" class="hamuTeachImage" id="hamuTeachImage">
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
        background-color: hsla(331, 82.10%, 28.40%, 0.27);
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
    }

    .hamuTeachImage.bounce {
        animation: hamuBounce 0.5s ease;
    }

    @keyframes hamuBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }

    .descriptionContent p {
        flex-grow: 1;
        text-align: left;
    }
`;
document.head.appendChild(style);