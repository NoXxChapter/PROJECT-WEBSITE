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
  animateInsertionSort();
}

function updateStats() {
  document.getElementById("comparison-count").textContent = comparisonCount;
  document.getElementById("swap-count").textContent = swapCount;
}


async function animateInsertionSort() {
  let arr = array.slice();
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    let j = i;
    // Highlight the current element to insert
    showSquares(arr, j, j - 1, i - 1);
    await sleep(animationSpeed);

    while (j > 0 && arr[j - 1] > arr[j]) {
      comparisonCount++; // Count each comparison
      updateStats();

      // Highlight the swap
      showSquares(arr, j, j - 1, i - 1);
      await sleep(animationSpeed);

      swap(arr, j, j - 1);
      swapCount++; // Count each swap

      updateStats();

      j--;
      showSquares(arr, j, j - 1, i - 1);
      await sleep(animationSpeed);
    }
  }
  // Final state: all sorted
  showSquares(arr, null, null, n - 1);
}

function swap(arr, a, b) {
  const temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
  return arr;
}

function showSquares(arr, current = null, compare = null, sortedEnd = -1) {
  const container = document.getElementById("unsortedArray");
  container.innerHTML = "";

  for (let i = 0; i < arr.length; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.id = i.toString();
    square.style.height = (100 / n)*10 + "px";
    square.style.width  = (100 / n)*10 + "px";
    square.textContent = (arr[i] * 100).toFixed(0);

    if (i <= sortedEnd) {
      square.classList.add("sorted-green");
    }
    if (i == current) {
      square.classList.remove("sorted-green");
      square.classList.add("reading");
    }
    if (i == compare) {
      square.classList.remove("sorted-green");
      square.classList.add("compare");
    }
    container.appendChild(square);
  }
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}