const songs = [
    {
        title: "Karuppu Theme",
        artist: "Suriya",
        album: "Karuppu",
        cover: "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=400&q=80",
        url: "https://res.cloudinary.com/ds4vrv89c/video/upload/v1778328913/AUD-20260509-WA0005_b28svr.mp3"
    },
    {
        title: "The Advocate's Justice",
        artist: "Suriya",
        album: "Karuppu",
        cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80",
        url: "https://res.cloudinary.com/ds4vrv89c/video/upload/v1778328913/AUD-20260509-WA0003_ikepek.mp3"
    },
    {
        title: "Courtroom Drama",
        artist: "Suriya",
        album: "Karuppu",
        cover: "https://images.unsplash.com/photo-1627461427505-181cb2657e4e?auto=format&fit=crop&w=400&q=80",
        url: "https://res.cloudinary.com/ds4vrv89c/video/upload/v1778328913/AUD-20260509-WA0004_aopgqm.mp3"
    },
    {
        title: "Darkness Rises",
        artist: "Suriya",
        album: "Karuppu",
        cover: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80",
        url: "https://res.cloudinary.com/ds4vrv89c/video/upload/v1778328912/AUD-20260509-WA0006_wjauyn.mp3"
    },
    {
        title: "Divine Judgment",
        artist: "Suriya",
        album: "Karuppu",
        cover: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=400&q=80",
        url: "https://res.cloudinary.com/ds4vrv89c/video/upload/v1778328910/AUD-20260508-WA0057_ha1tno.mp3"
    },
    {
        title: "Pavazhamalli",
        artist: "Sai Abhyankkar, Harini Ivaturi",
        album: "Pavazhamalli",
        cover: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=400&q=80",
        url: "https://open.spotify.com/track/4yur1GSBfuS1VADyUYocqd?si=LTHv_bRMSFywQRgCdlcUvA&context=spotify%3Aplaylist%3A37i9dQZF1DX4Im4BTs2WMg"
    }
];

let currentSongIndex = 0;
let audio = new Audio();
let isPlaying = false;

// DOM Elements
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');
const volumeBar = document.getElementById('volume-bar');
const volumeIcon = document.getElementById('volume-icon');

const currentTitle = document.getElementById('current-title');
const currentArtist = document.getElementById('current-artist');
const currentCover = document.getElementById('current-cover');
const songsList = document.getElementById('songs-list');

// Initialize
function init() {
    renderSongs();
    loadSong(currentSongIndex);
    
    // Auto-play next song
    audio.addEventListener('ended', nextSong);
    
    // Update progress
    audio.addEventListener('timeupdate', updateProgress);
    
    // Audio loaded metadata
    audio.addEventListener('loadedmetadata', () => {
        totalDurationEl.textContent = formatTime(audio.duration);
        progressBar.max = audio.duration;
    });
}

function renderSongs() {
    songsList.innerHTML = '';
    songs.forEach((song, index) => {
        // we'll fetch duration asynchronously or just display placeholder
        const div = document.createElement('div');
        div.className = `song-row ${index === currentSongIndex ? 'active' : ''}`;
        div.innerHTML = `
            <div class="song-number">
                <span>${index + 1}</span>
                <i class="fas fa-play play-icon"></i>
            </div>
            <div class="song-title-col">
                <img src="${song.cover}" alt="cover">
                <div>
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
            </div>
            <div class="song-album">${song.album}</div>
            <div class="song-duration">--:--</div>
        `;
        
        div.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
            updateActiveRow();
        });
        
        songsList.appendChild(div);
    });
}

function updateActiveRow() {
    document.querySelectorAll('.song-row').forEach((row, idx) => {
        if (idx === currentSongIndex) {
            row.classList.add('active');
            row.querySelector('.song-title').style.color = 'var(--accent-color)';
        } else {
            row.classList.remove('active');
            row.querySelector('.song-title').style.color = 'var(--text-primary)';
        }
    });
}

function loadSong(index) {
    const song = songs[index];
    audio.src = song.url;
    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;
    currentCover.src = song.cover;
    currentCover.style.display = 'block';
    updateActiveRow();
}

function playSong() {
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause-circle"></i>';
    audio.play();
}

function pauseSong() {
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play-circle"></i>';
    audio.pause();
}

function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function nextSong() {
    currentSongIndex++;
    if (currentSongIndex > songs.length - 1) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

function updateProgress() {
    const { duration, currentTime } = audio;
    if (duration) {
        progressBar.value = currentTime;
        currentTimeEl.textContent = formatTime(currentTime);
        // update range background
        const percent = (currentTime / duration) * 100;
        progressBar.style.background = `linear-gradient(to right, var(--text-primary) ${percent}%, #535353 ${percent}%)`;
    }
}

function setProgress(e) {
    const val = e.target.value;
    audio.currentTime = val;
}

function setVolume(e) {
    const val = e.target.value;
    audio.volume = val / 100;
    if (audio.volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (audio.volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

function formatTime(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
progressBar.addEventListener('input', setProgress);
volumeBar.addEventListener('input', setVolume);

// Handle progress bar hover styling
progressBar.addEventListener('mouseover', function() {
    if (audio.duration) {
        const percent = (this.value / this.max) * 100;
        this.style.background = `linear-gradient(to right, var(--accent-color) ${percent}%, #535353 ${percent}%)`;
    }
});

progressBar.addEventListener('mouseout', function() {
    if (audio.duration) {
        const percent = (this.value / this.max) * 100;
        this.style.background = `linear-gradient(to right, var(--text-primary) ${percent}%, #535353 ${percent}%)`;
    }
});

// Run
init();
