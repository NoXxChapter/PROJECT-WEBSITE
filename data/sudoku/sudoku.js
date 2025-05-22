// -- WEBTITTLE START --
document.addEventListener('DOMContentLoaded', () => {
    const musicButton = document.getElementById('musicToggle');
    const musicPlayer = document.getElementById('musicPlayer');
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
    // -- end of music button function --


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

    const difficultyButtons = document.querySelectorAll('.difficulty-btn');

    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update difficulty based on the button clicked
            switch (button.id) {
                case 'easy':
                    difficulty = 30; // Fewer cells removed
                    break;
                case 'medium':
                    difficulty = 40; // Default difficulty
                    break;
                case 'hard':
                    difficulty = 60; // More cells removed
                    break;
                case 'hell':
                    difficulty = 75; // Maximum difficulty
                    break;
            }

            // Reset button colors
            difficultyButtons.forEach(btn => {
                btn.style.backgroundColor = 'whitesmoke';
            });

            // Highlight the selected button
            button.style.backgroundColor = 'gray';

            // Restart the game with the new difficulty
            restartGame();
        });
    });
});
// -- end of ad button function --

// -- WEBTITTLE END --

var board; 
var solution; 
let difficulty = 40; // Default difficulty (Medium)
let numSelected = null;


document.addEventListener('DOMContentLoaded', () => {
    const solveToggle = document.getElementById('solveButton');

    solveToggle.addEventListener('click', () => {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.getElementById(`${r}-${c}`);
                cell.innerText = solution[r][c];        // Fill the cell with the solution number
                cell.classList.remove("title-wrong");   // Remove "wrong" marker
                cell.classList.add("title-start");      // Mark it as part of the solution
            }
        }

        stopTimer(); // Stop the timer

        console.log("Board solved!");
    });
});

function generateSudoku() {
    // Generate a Sudoku puzzle and solution
    let board = Array.from({ length: 9 }, () => Array(9).fill(0));

    function isValid(board, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (board[row][x] == num || board[x][col] == num) return false;
        }

        // Check 3x3 subgrid
        let startRow = Math.floor(row / 3) * 3;
        let startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] == num) return false;
            }
        }

        return true;
    }

    function solve(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                // if tile is empty
                if (board[row][col] == 0) {
                    // pick number from 1 -- 9 to fill
                    for (let num = 1; num <= 9; num++) {
                        // check if tile can create conflict
                        if (isValid(board, row, col, num)) {
                            // if not then fill number
                            board[row][col] = num;
                            
                            // Backtrack
                            if (solve(board)) return true;  // recursive check if input number can lead to solve sudoku
                            board[row][col] = 0;            // if not then remove that number
                        }
                    }

                    return false; // no valid number found
                }
            }
        }
        return true; // solved
    }

    solve(board); // Call the solve function to fill the board
    return board;
}

const choice = document.getElementById("difficultyLevels");

function generatePuzzle(solvedBoard, difficulty = 40) {
    let puzzle = solvedBoard.map(row => [...row]); // Create a copy of the solved board
    let cellsToRemove = difficulty; // Number of cells to remove

    while (cellsToRemove > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);

        if (puzzle[row][col] != 0) {
            puzzle[row][col] = 0; // Remove the number
            cellsToRemove--;
        }
    }

    return puzzle; // Return the puzzle with removed cells
}

window.onload = function() {
    let solvedBoard = generateSudoku(); // Generate a solved Sudoku board
    let puzzleBoard = generatePuzzle(solvedBoard, choice); // Generate a puzzle with 40 cells removed

    difficulty = 81;    // Set the default difficulty level
                        // when launch game board is blank

    initializeGame(); // Initialize the game
};

function setGame() {
    // Number selection row
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;

        number.addEventListener("click", selectNumber); // Highlight number when selected

        number.classList.add("number"); // Add ".number" CSS class
        document.getElementById("digits").appendChild(number);
    }

    // Sudoku board (9x9 grid)
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let title = document.createElement("div");
            title.id = r.toString() + "-" + c.toString();

            // Populate the board with numbers or placeholders
            if (board[r][c] != "-") {
                title.innerText = board[r][c]; // Insert number from the puzzle board
                title.classList.add("title-start"); // Highlight pre-filled numbers
            }

            // Add grid borders
            if (r == 2 || r == 5) {
                title.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                title.classList.add("vertical-line");
            }

            title.addEventListener("click", selectTitle);

            title.classList.add("title"); // Add ".title" CSS class
            document.getElementById("board").append(title);
        }
    }
}

function checkWinCondition() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === '-' || board[r][c] != solution[r][c]) {
                return false; // Puzzle is not yet solved
            }
        }
    }
    return true; // Puzzle is solved
}


function selectNumber() {
    // toggle feature
    if (numSelected != null) {  // if there is a number clicked already
        numSelected.classList.remove("number-selected");   // remove highlight that number
    }

    numSelected = this;         // update 
    numSelected.classList.add("number-selected");   // highlight new clicked number       
}

function selectTitle() {
    if (numSelected){                   // if a number is selected

        // ISOLATE FIRST TEST CONDITION 
        // ---------------------
        // if (this.innerText != "" ){      // if title is already writen
        //     return;                     // nothing happens
        // }
        // ---------------------

        if (this.classList.contains("title-start")) {   // Do not allow changes to initial puzzle numbers
            return; 
        }

        // "0-0" "0-1" ... "3-1"
        let coords = this.id.split("-");    // ["0", "0"]
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        // Check if the puzzle is solved
        if (checkWinCondition()) {
            stopTimer(); // Stop the timer
            alert("Congratulations! You solved the puzzle!"); // Show success message
        } else {
            // If the number is incorrect, mark it as wrong
            if (solution[r][c] != numSelected.id) {
                this.classList.add("title-wrong"); // Add "wrong" marker
            } else {
                this.classList.remove("title-wrong"); // Remove "wrong" marker if corrected
            }
            this.innerText = numSelected.id;
        }
    }
}

function restartGame() {
    // Clear the board and digits
    document.getElementById('board').innerHTML = '';
    document.getElementById('digits').innerHTML = '';

    // Generate a new puzzle and solution
    let solvedBoard = generateSudoku();
    let puzzleBoard = generatePuzzle(solvedBoard, difficulty);

    // Update global variables
    board = puzzleBoard.map(row => row.map(cell => (cell === 0 ? '-' : cell.toString())));
    solution = solvedBoard.map(row => row.map(cell => cell.toString()));

    console.log('New Board:', board);
    console.log('New Solution:', solution);

    setGame(); // Reinitialize the game
    startTimer(); // Start the timer
}

function initializeGame() {
    // Clear the board and digits
    document.getElementById('board').innerHTML = '';
    document.getElementById('digits').innerHTML = '';

    // Generate a new puzzle and solution
    let solvedBoard = generateSudoku();
    let puzzleBoard = generatePuzzle(solvedBoard, difficulty);

    // Update global variables
    board = puzzleBoard.map(row => row.map(cell => (cell === 0 ? '-' : cell.toString())));
    solution = solvedBoard.map(row => row.map(cell => cell.toString()));
 
    console.log('New Create a blank board:', board);

    setGame(); // Reinitialize the game
}


// TIMER FUNCTION
let timerInterval; // Variable to store the timer interval
let secondsElapsed = 0; // Track the total seconds elapsed

function startTimer() {
    // Reset the timer
    clearInterval(timerInterval);
    secondsElapsed = 0;

    // Update the timer display every second
    timerInterval = setInterval(() => {
        secondsElapsed++;
        const minutes = Math.floor(secondsElapsed / 60);
        const seconds = secondsElapsed % 60;

        // Format the timer as MM:SS
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timer').innerText = formattedTime;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval); // Stop the timer
}