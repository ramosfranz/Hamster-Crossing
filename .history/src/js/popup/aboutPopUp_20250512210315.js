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
                <div class="algorithmColumn" data-algorithm="aStar">
                    <img src="assets/images/book/aStar_book.png" class="bookIcons">
                    <span class="algorithmText">A*</span>
                    <div class="algorithmDescription">
                        A* (A-Star) is an advanced pathfinding algorithm that finds the most efficient route by calculating the best path based on both the distance traveled and estimated distance to the goal.
                    </div>
                </div>
                <div class="algorithmColumn" data-algorithm="dijkstra">
                    <img src="assets/images/book/aStar_book.png" class="bookIcons">
                    <span class="algorithmText">Dijkstra's</span>
                    <div class="algorithmDescription">
                        Dijkstra's Algorithm finds the shortest path between nodes in a graph, systematically exploring the most promising routes to determine the most efficient path.
                    </div>
                </div>
                <div class="algorithmColumn" data-algorithm="gridBased">
                    <img src="assets/images/book/aStar_book.png" class="bookIcons">
                    <span class="algorithmText">Grid-Based</span>
                    <div class="algorithmDescription">
                        BFS breaks down the game world into a grid, allowing precise movement and obstacle detection by checking each grid cell.
                    </div>
                </div>
                <div class="algorithmColumn" data-algorithm="bfs">
                    <img src="assets/images/book/aStar_book.png" class="bookIcons">
                    <span class="algorithmText">Breadth-First</span>
                    <div class="algorithmDescription">
                        DFS explores all neighboring paths equally, systematically checking all possible routes in layers to find the shortest path.
                    </div>
                </div>
                <div class="algorithmColumn" data-algorithm="waypoint">
                    <img src="assets/images/book/aStar_book.png" class="bookIcons">
                    <span class="algorithmText">Waypoint</span>
                    <div class="algorithmDescription">
                        Bellman-Ford allows players to set specific points for the hamster to follow, creating a custom path through the level.
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

// Add click event to algorithm columns
document.querySelectorAll('.algorithmColumn').forEach(column => {
    column.addEventListener('click', function() {
        // Remove active class from all columns
        document.querySelectorAll('.algorithmColumn').forEach(col => {
            col.classList.remove('active');
        });
        
        // Add active class to clicked column
        this.classList.add('active');
    });
});

// Add some additional styles for the about content
const style = document.createElement("style");
style.textContent = `
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

    .algorithmDescription {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: rgba(139, 69, 19, 0.1);
        padding: 10px;
        border-radius: 0 0 8px 8px;
        z-index: 10;
        text-align: left;
        font-size: 0.8em;
        color: #8B4513;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .algorithmColumn.active .algorithmDescription {
        display: block;
    }
`;
document.head.appendChild(style);