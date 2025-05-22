document.addEventListener('DOMContentLoaded', () => {
    const musicButton = document.getElementById('musicToggle');
    const musicPlayer = document.getElementById('musicPlayer');
    let isPlaying = false;

    let input = document.getElementById("array-size");
    if (input) {
        input.addEventListener("input", () => {
            init();
        });
    }

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
});
// -- end of ad button function --



let n = 80;
const array = [];
let animationSpeed = 1600 / 12;
let isMuted = true; // Default: muted

let comparisonCount = 0;
let swapCount = 0; // For Merge Sort, "swap" is usually "overwrite"


init();

function init() {
    // Get value from input box if it exists
    const input = document.getElementById("array-size");
    if (input) {
        const val = parseInt(input.value, 10);
        if (!isNaN(val) && val >= 5 && val <= 100) {
            n = val;
        }
    }
    array.length = 0; // Clear the array
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    showBars();
}

function play() {
    comparisonCount = 0;
    swapCount = 0;
    updateStats();
    const moves = [];
    mergesort(array.slice(), 0, moves); // Use a copy for sorting, record moves
    animate(moves);
}

function updateStats() {
    document.getElementById("comparison-count").textContent = comparisonCount;
    document.getElementById("swap-count").textContent = swapCount;
}


function toggleMute() {
  isMuted = !isMuted;
  const muteBtn = document.getElementById('muteButton');
  if (isMuted) {
    muteBtn.style.backgroundColor = "gray";
    muteBtn.textContent = "MUTE";
  } else {
    muteBtn.style.backgroundColor = "lightgray";
    muteBtn.textContent = "UNMUTE";
  }
}

// Speed slider
document.addEventListener('DOMContentLoaded', () => {
    const speedSlider = document.getElementById('speedSlider');
    if (speedSlider) {
      speedSlider.addEventListener('input', function() {
        // Invert: right = fast (low delay), left = slow (high delay)
        const min = Number(this.min);
        const max = Number(this.max);
        animationSpeed = (max + min - Number(this.value)) / 12;
      });
    }
});

// Merge Sort with move recording
function mergesort(arr, start, moves) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergesort(arr.slice(0, mid), start, moves);
    const right = mergesort(arr.slice(mid), start + mid, moves);
    return merge(left, right, start, moves);
}

function merge(left, right, start, moves) {
    let result = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
        // Record comparison
        moves.push({ type: "compare", indices: [start + i, start + left.length + j] });
        if (left[i] <= right[j]) {
            // Record overwrite
            moves.push({ type: "overwrite", index: start + i + j, value: left[i] });
            result.push(left[i++]);
        } else {
            moves.push({ type: "overwrite", index: start + i + j, value: right[j] });
            result.push(right[j++]);
        }
    }
    while (i < left.length) {
        moves.push({ type: "overwrite", index: start + i + j, value: left[i] });
        result.push(left[i++]);
    }
    while (j < right.length) {
        moves.push({ type: "overwrite", index: start + i + j, value: right[j] });
        result.push(right[j++]);
    }
    return result;
}

// Animate the moves
function animate(moves) {
    if (moves.length === 0) {
        showBars();
        return;
    }
    const move = moves.shift();

    if (move.type === "compare") {

        comparisonCount++;

        showBars({ compare: move.indices });
        // Play a note for each compared index
        move.indices.forEach(idx => playNote(200 + array[idx] * 500));
    } else if (move.type === "overwrite") {

        swapCount++;

        array[move.index] = move.value;
        showBars({ overwrite: move.index });
        // Play a note for the overwritten value
        playNote(200 + move.value * 500);
    }

    updateStats();

    setTimeout(() => animate(moves), animationSpeed);
}

// Show bars with highlights
function showBars(currentMove = {}) {
    const visual = document.getElementById("visual");
    visual.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.classList.add("bar");
        if (currentMove.compare && currentMove.compare.includes(i)) {
            bar.classList.add("compare");
        }
        if (currentMove.overwrite === i) {
            bar.classList.add("overwrite");
        }
        visual.appendChild(bar);
    }
}

let audioCtx;
function playNote(freq) {
    if (isMuted) return;
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const dur = 0.09; // short for a pop
    const fadeIn = 0.01;
    const fadeOut = 0.03;

    // Main oscillator
    const osc = audioCtx.createOscillator();
    osc.type = "triangle"; // triangle is "bubblier" than sine

    // Quick pitch drop for bubble pop
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(freq * 0.6, audioCtx.currentTime + dur);

    // Envelope
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + fadeIn); // pop volume
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur - fadeOut);

    osc.start();
    osc.stop(audioCtx.currentTime + dur);
}