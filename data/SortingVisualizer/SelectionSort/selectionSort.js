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



let n = 15; // Number of squares
const array=[];
let animationSpeed = 1600 / 4; // default in milliseconds

let comparisonCount = 0;
let swapCount = 0;

init();

function init() {
  // Get value from input box if it exists
  let input = document.getElementById("array-size");
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

  // show unsorted array
  showSquares(array, "unsortedArray"); 
}

// Speed slider
document.addEventListener('DOMContentLoaded', () => {
    const speedSlider = document.getElementById('speedSlider');
    if (speedSlider) {
      speedSlider.addEventListener('input', function() {
        // Invert: right = fast (low delay), left = slow (high delay)
        const min = Number(this.min);
        const max = Number(this.max);
        animationSpeed = (max + min - Number(this.value)) / 4;
      });
    }
});


function play() {
  comparisonCount = 0;
  swapCount = 0;
  updateStats();
  animateSelectionSort();
}

function updateStats() {
  document.getElementById("comparison-count").textContent = comparisonCount;
  document.getElementById("swap-count").textContent = swapCount;
}

async function animateSelectionSort() {
  let arr = array.slice();  // copy the original array
  let sortedIndices = [];

  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {

      comparisonCount++; // Count each comparison
      updateStats();

      showSquares(arr, "unsortedArray", j, min, sortedIndices);
      await new Promise(res => setTimeout(res, animationSpeed));
      if (arr[j] < arr[min]) {
        min = j;
      }
    }

    // Swap and animate
    if (min !== i) {
      [arr[i], arr[min]] = [arr[min], arr[i]];
      swapCount++; // Count each swap
      updateStats();
    }

    showSquares(arr, "unsortedArray", i, min, sortedIndices);
    await new Promise(res => setTimeout(res, animationSpeed));

    // Mark this index as sorted
    sortedIndices.push(i);
    showSquares(arr, "unsortedArray", null, null, sortedIndices);
    await new Promise(res => setTimeout(res, animationSpeed));
  }
}


// show array under squares format
function showSquares(arr, containerId, index = null, minIndex = null, sortedIndices = []) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  for (let i = 0; i < arr.length; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.id = i.toString();
    square.style.height = (100 / n) * 10 + "px";
    square.style.width = (100 / n) * 10 + "px";
    square.textContent = (arr[i] * 100).toFixed(0);

    if (i === minIndex) {
      square.classList.add("min-element");
    }
    if (index === i) {
      square.classList.add("reading");
    }
    if (sortedIndices.includes(i)) {
      square.classList.add("sorted-green");
    }
    container.appendChild(square);
  }
}