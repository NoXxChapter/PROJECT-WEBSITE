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
});
// -- end of ad button function --
