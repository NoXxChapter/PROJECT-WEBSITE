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



let n = 15; // Number of bars
const array=[];
let animationSpeed = 1600 / 12; // default in milliseconds

let swapCount = 0;
let comparisonCount = 0;

init();

let audioCtx = null;
let isMuted = true; // Default is muted

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

function playNote(freq) {
  if (isMuted) return; // Do nothing if muted
  if (audioCtx == null) {
    audioCtx = new (
      AudioContext 
      || webkitAudioContext
      || window.webkitAudioContext
    )();
  }

  const dur = 0.1; // Duration in seconds
  const fadeTime = 0.02; // Fade-in and fade-out duration in seconds
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.frequency.value = freq;

  // Connect oscillator to gain node and gain node to audio context destination
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // Set initial gain to 0 (silent)
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

  // Fade in
  gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + fadeTime);

  // Fade out
  gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur - fadeTime);

  // Start and stop the oscillator
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
}

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


// BUBBLE SORT
function bubbleSort(arr) {
  const moves = [];
  const array = [...arr]; // Create a copy of the array to avoid modifying the original

  do {
    var swapped = false;
    for (let i = 1; i < array.length; i++) { // Start from index 1
      moves.push({ indices: [i - 1, i], type: "comp" }); // Store the indices of the elements to be compared
      if (array[i - 1] > array[i]) {
        swapped = true;

        moves.push({ indices: [i - 1, i], type: "swap" }); // Store the indices of the elements to be swapped

        [array[i - 1], array[i]] = [array[i], array[i - 1]];
      }
    }
  } while (swapped);

  return moves;
}


function play() {
  swapCount = 0;
  comparisonCount = 0;
  updateStats();
  const moves = bubbleSort(array);
  animate(moves);
}


function animate(moves) {
  if (moves.length === 0) {
    showBars(); // Show the final sorted array
    return;
  }

  const currentMove = moves.shift();
  const [i, j] = currentMove.indices;

  if (currentMove.type === "swap") {
    [array[i], array[j]] = [array[j], array[i]]; // Modify the global array
    swapCount++;
  }
  if (currentMove.type === "comp") {
    comparisonCount++;
  }

  updateStats();

  // PLAY NOTE
  playNote(200 + array[i] * 500); // Play a note based on the height of the bar
  playNote(200 + array[j] * 500); // Play a note based on the height of the bar

  showBars(currentMove);

  setTimeout(() => {
    animate(moves); // Continue animation
  }, animationSpeed);
}


function showBars(currentMove) {
  visual.innerHTML = ""; // Clear the visual container

  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.classList.add("bar");

    if (currentMove && currentMove.indices.includes(i)) {
      bar.style.backgroundColor =
        currentMove.type === "swap" ? "yellow" : "white"; // Highlight the swapped bars
    }

    visual.appendChild(bar);
  }
}

function updateStats() {
  document.getElementById("comparison-count").textContent = comparisonCount;
  document.getElementById("swap-count").textContent = swapCount;
}


// -- end of bubble sort --