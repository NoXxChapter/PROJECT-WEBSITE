// WEBTITTLE
document.addEventListener('DOMContentLoaded', () => {
    const musicButton = document.getElementById('musicToggle');
    const musicPlayer = document.getElementById('musicPlayer');
    document.getElementById("undo-button").onclick = undo;
    let isPlaying = false;

musicToggle.addEventListener("click", function() {
        if (!isPlaying) {
            musicPlayer.play();
            isPlaying = true;
            musicToggle.innerHTML = '<i class="bi bi-pause-circle"></i> Pause';
            musicToggle.style.backgroundColor = "gray"; // Change to dark color
        } else {
            musicPlayer.pause();
            isPlaying = false;
            musicToggle.innerHTML = '<i class="bi bi-music-note-beamed"></i> Music';
            musicToggle.style.backgroundColor = "whitesmoke"; // Change to light color
        }
    });

    // Optional: Reset button text if music ends
    musicPlayer.addEventListener("ended", function() {
        isPlaying = false;
        musicToggle.innerHTML = '<i class="bi bi-music-note-beamed"></i> Music';
        musicToggle.style.backgroundColor = "whitesmoke";
    });

    adButton.addEventListener('click', () => {
        if (isAdPlaying) {
            // play
            adIcon.classList.remove("bi-badge-ad");
            adIcon.classList.add("bi-badge-ad-fill");
            adButton.style.backgroundColor = "gray"; // Change to light color
            console.log('Ad paused');
        } else {
            // pause
            adIcon.classList.remove("bi-badge-ad-fill");
            adIcon.classList.add("bi-badge-ad");
            adButton.style.backgroundColor = "whitesmoke"; // Change to dark color
            console.log('Ad played');
        }
        isAdPlaying = !isAdPlaying;
    });
});
// -- end of ad button function --
// -- WEBTITTLE END --

let history = [];

var board = [];
var rows = 12;
var columns = 12;

var minesCount = Math.floor((rows * columns) / 10);
var minesLocation = [];  // "2-2", "3-4", "2-1"

var tilesClicked = 0;   // goal to click all tiles except the ones containing mines
var flagEnable = false;

var gameOver = false;



window.onload = function() {
    startGame();
}

function saveState() {
    // Deep copy board state 
    const boardState = board.map(row => row.map(tile => ({
        text: tile.innerText,
        classes: Array.from(tile.classList),
        bg: tile.style.backgroundColor
    })));
    history.push({
        board: boardState,
        minesLocation: [...minesLocation],
        tilesClicked,
        flagEnable,
        gameOver
    });
}

function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMine();

    // populate our board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // <div id="0-0"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();

            tile.addEventListener("click", clickTile);

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}

function setMine() {
    let minesLeft = minesCount;

    while(minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function setFlag() {
    if (flagEnable) {
        flagEnable = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnable = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")){
        return;
    }

    saveState();

    let tile = this;    // this refer to tile that clicked

    if (flagEnable) {
        if (tile.innerText == "") { // tile not be clicked yet
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {   // tile already clicked
            tile.innerText = "";
        }

        return;
    }

    if (minesLocation.includes(tile.id)) {
        revealMines();
        gameOver = true;
        setTimeout(() => {
            alert("YOU DIE");
        }, 100); // slight delay to allow UI update
        return;
    }

    let coords =  tile.id.split("-"); // "0-0" --> ["0" "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    checkMine(r, c);

}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }

    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;  

    // check amount of mines around tile
    let minesFound = 0;

    // top 3
    minesFound += checkTile(r-1, c-1);  // top-left
    minesFound += checkTile(r-1, c  );  // top
    minesFound += checkTile(r-1, c+1);  // top-right

    // left & right
    minesFound += checkTile(r, c+1);    // right
    minesFound += checkTile(r, c-1);    // left

    // 3 bottom
    minesFound += checkTile(r+1, c-1);  // bottom-left
    minesFound += checkTile(r+1, c  );  // bottom
    minesFound += checkTile(r+1, c+1);  // bottom-right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    // if not found mines around then ask its neighbors
    else {
        // recursive
        checkMine(r-1, c-1);    // top-left
        checkMine(r-1, c);      // top
        checkMine(r-1, c+1);    // top-right

        checkMine(r, c-1);      // left
        checkMine(r, c+1);      // right
        
        checkMine(r+1, c-1);    // bottom-left
        checkMine(r+1, c);      // bottom
        checkMine(r+1, c+1);    // bottom-right
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
        setTimeout(() => {
            alert("Congratulations! You win!");
        }, 100);
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }


    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }

    return 0;
}

function undo() {
    const undoBtn = document.getElementById("undo-button");
    // Change color to indicate action
    undoBtn.style.backgroundColor = "#ffc107"; // yellow

    if (history.length === 0) {
        setTimeout(() => {
            undoBtn.style.backgroundColor = ""; // revert to default
        }, 150);
        return;
    }
    // Restore previous state
    const prev = history.pop();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const tile = board[r][c];
            tile.innerText = prev.board[r][c].text;
            tile.className = prev.board[r][c].classes.join(" ");
            tile.style.backgroundColor = prev.board[r][c].bg;
        }
    }
    minesLocation = [...prev.minesLocation];
    tilesClicked = prev.tilesClicked;
    flagEnable = prev.flagEnable;
    gameOver = prev.gameOver;
    // Update flag button color if needed
    document.getElementById("flag-button").style.backgroundColor = flagEnable ? "darkgray" : "lightgray";
    // Update mines count display
    document.getElementById("mines-count").innerText = gameOver && tilesClicked === rows * columns - minesCount ? "Cleared" : minesCount;

    // Revert undo button color after short delay
    setTimeout(() => {
        undoBtn.style.backgroundColor = "";
    }, 150);
}