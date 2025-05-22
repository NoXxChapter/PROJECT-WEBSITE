// WEBTITTLE
document.addEventListener("DOMContentLoaded", function() {
    const musicToggle = document.getElementById("musicToggle");
    const musicPlayer = document.getElementById("musicPlayer");
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

    // ad button function
    const adButton = document.getElementById('adToggle');
    const adIcon = document.getElementById('adIcon');
    let isAdPlaying = false;

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

var board = [];
var rows = 24;
var columns = 24;

let originTile = null;
let destinyTile = null;

let isMouseDown = false;

window.onload = function() {
    initBoard();
}

function initBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = ""; 

    // if left-mouse is holding 
    boardDiv.onmousedown = function(e) {
        if (e.button === 0) isMouseDown = true; // is holding
    };
    boardDiv.onmouseup = function(e) {
        if (e.button === 0) isMouseDown = false;// not holding
    };
    boardDiv.onmouseleave = function() {        // release hold
        isMouseDown = false;
    };

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");

            tile.id = r.toString() + "-" + c.toString();    // "0-0", "1-1"
            tile.className = "tile";

            // Mouse event for assigning start and end
            tile.onmousedown = function(e) {
                // Middle mouse (button 1) for origin
                if (e.button === 1) {
                    if (originTile) originTile.classList.remove("origin");
                    tile.classList.remove("destiny"); // Prevent start and end on same tile
                    tile.classList.add("origin");
                    originTile = tile;
                    e.preventDefault();
                }
                // Right mouse (button 2) for destiny
                if (e.button === 2) {
                    if (destinyTile) destinyTile.classList.remove("destiny");
                    tile.classList.remove("origin"); // Prevent start and end on same tile
                    tile.classList.add("destiny");
                    destinyTile = tile;
                    e.preventDefault();
                }
                // Left mouse (button 0) for obstacle
                if (e.button === 0) {
                    // Prevent assigning obstacle to origin or destiny
                    if (!tile.classList.contains("origin") && !tile.classList.contains("destiny")) {
                        tile.classList.add("obstacle");
                    }
                    e.preventDefault();
                }
            };
            
            tile.onmouseover = function(e) {
                // Paint obstacle on drag with left mouse
                if (isMouseDown && !tile.classList.contains("origin") && !tile.classList.contains("destiny")) {
                    tile.classList.add("obstacle");
                }
            };

            tile.oncontextmenu = function(e) { e.preventDefault(); };   // prevent mouse-right pop-up window menu

            boardDiv.appendChild(tile);
        }
    }
}

function getTileID(tile) {
        return tile.id.split('-').map(Number);
    }



// --- BFS Animation ---
async function animateBFS() {
    // Build grid representation
    const grid = [];
    for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < columns; c++) {
            const tile = document.getElementById(`${r}-${c}`);
            grid[r][c] = {
                tile,
                visited: false,
                prev: null,
                isObstacle: tile.classList.contains('obstacle')
            };
        }
    }

    if (!originTile || !destinyTile) return;

    const [startR, startC] = getTileID(originTile);
    const [endR, endC] = getTileID(destinyTile);

    const queue = [[startR, startC]];
    grid[startR][startC].visited = true;

    let found = false;

    // Directions: up, down, left, right
    const dr = [-1, 1, 0, 0];
    const dc = [0, 0, -1, 1];

    while (queue.length && !found) {
        const [r, c] = queue.shift();
        for (let d = 0; d < 4; d++) {
            const nr = r + dr[d], nc = c + dc[d];
            if (
                nr >= 0 && nr < rows &&
                nc >= 0 && nc < columns &&
                !grid[nr][nc].visited &&
                !grid[nr][nc].isObstacle
            ) {
                grid[nr][nc].visited = true;
                grid[nr][nc].prev = [r, c];
                // Animate visiting
                if (grid[nr][nc].tile !== destinyTile && grid[nr][nc].tile !== originTile)
                    grid[nr][nc].tile.style.backgroundColor = "#e75480"; // deep pink
                await new Promise(res => setTimeout(res, 15));
                if (nr === endR && nc === endC) {
                    found = true;
                    break;
                }
                queue.push([nr, nc]);
            }
        }
    }

    // Reconstruct path
    if (found) {
        let path = [];
        let cur = [endR, endC];
        while (cur && (cur[0] !== startR || cur[1] !== startC)) {
            path.push(cur);
            cur = grid[cur[0]][cur[1]].prev;
        }
        // Animate path
        for (let i = path.length - 1; i >= 0; i--) {
            const [r, c] = path[i];
            const tile = grid[r][c].tile;
            if (tile !== originTile && tile !== destinyTile) {
                tile.classList.add("path"); 
                await new Promise(res => setTimeout(res, 30));
            }
        }
    }
}

function clearBoard() {
    initBoard();
    originTile = null;
    destinyTile = null;
}


window.animateBFS = animateBFS;
window.clear = clear;