// moved to js/playlists.js
// Playlist data array


const playlists = [
    {
        title: "Hot Hits",
        icon: "fire",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        songs: 4,
        duration: "2h 35m",
        tracks: [1, 2, 3, 4]
    },
    {
        title: "Love Songs",
        icon: "heart",
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        songs: 2,
        duration: "1h 58m",
        tracks: [2, 5]
    },
    {
        title: "Workout Mix",
        icon: "running",
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        songs: 2,
        duration: "1h 42m",
        tracks: [3, 6]
    },
    {
        title: "Chill Vibes",
        icon: "moon",
        gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        songs: 2,
        duration: "2h 12m",
        tracks: [4, 7]
    },
    {
        title: "Morning Acoustic",
        icon: "coffee",
        gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        songs: 2,
        duration: "1h 28m",
        tracks: [3, 8]
    },
    {
        title: "Road Trip",
        icon: "car",
        gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
        songs: 3,
        duration: "3h 15m",
        tracks: [1, 2, 6]
    },
    {
        title: "Party Mode",
        icon: "cocktail",
        gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        songs: 2,
        duration: "3h 45m",
        tracks: [5, 6]
    },
    {
        title: "Focus & Study",
        icon: "book",
        gradient: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
        songs: 2,
        duration: "2h 48m",
        tracks: [7, 8]
    }
];

// Function to create a playlist card HTML
function createPlaylistCard(playlist, idx) {
    return `
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="playlist-card" data-playlist-index="${idx}">
                <div class="playlist-img" style="background: ${playlist.gradient}">
                    <i class="fas fa-${playlist.icon}"></i>
                    <div class="playlist-overlay">
                        <button class="play-overlay-btn" data-playlist-index="${idx}">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <h5>${playlist.title}</h5>
                <p class="playlist-stats">${playlist.songs} songs • ${playlist.duration}</p>
            </div>
        </div>
    `;
}

// Function to render all playlists
function renderPlaylists() {
    const playlistsContainer = document.getElementById('playlists-container');
    playlistsContainer.innerHTML = playlists.map((playlist, idx) => createPlaylistCard(playlist, idx)).join('');
    
    // Add click event listeners to play buttons
    document.querySelectorAll('.play-overlay-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const idx = btn.getAttribute('data-playlist-index');
            const playlist = playlists[idx];
            // Save only the array of track ids
            localStorage.setItem('musicflow_queue', JSON.stringify(playlist.tracks));
            window.location.href = 'player.html';
        });
    });
}

// Generate a random gradient
function getRandomGradient() {
    const gradients = [
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
        "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)"
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
}

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    renderPlaylists();
    
    // Get the modal
    const modal = new bootstrap.Modal(document.getElementById('createPlaylistModal'));
    
    // Handle create new playlist button
    document.getElementById('create-playlist-btn').addEventListener('click', () => {
        modal.show();
    });
    
    // Handle icon selection
    const iconButtons = document.querySelectorAll('.icon-btn');
    iconButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove selected class from all buttons
            iconButtons.forEach(b => b.classList.remove('selected'));
            // Add selected class to clicked button
            btn.classList.add('selected');
            // Update hidden input
            document.getElementById('selectedIcon').value = btn.dataset.icon;
        });
    });
    
    // Handle form submission
    document.getElementById('savePlaylist').addEventListener('click', () => {
        const playlistName = document.getElementById('playlistName').value;
        const selectedIcon = document.getElementById('selectedIcon').value;
        
        if (!playlistName || !selectedIcon) {
            alert('Please fill in all fields');
            return;
        }
        
        // Create new playlist object
        const newPlaylist = {
            title: playlistName,
            icon: selectedIcon,
            gradient: getRandomGradient(),
            songs: 0,
            duration: "0m"
        };
        
        // Add to playlists array
        playlists.push(newPlaylist);
        
        // Re-render playlists
        renderPlaylists();
        
        // Reset form
        document.getElementById('playlistName').value = '';
        document.getElementById('selectedIcon').value = '';
        iconButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Close modal
        modal.hide();
    });
});