// moved to js/player.js
$(document).ready(function () {
    let isPlaying = false;
    let currentTime = 0;
    let duration = 225;
    let volume = 70;
    let isShuffled = false;
    let isRepeating = false;
    let playInterval = null;

    // This is the "database" of all tracks
    const defaultTracks = [
        { id: 1, name: 'Want to', author: 'Playboi Carti', url: 'songs/wantto.m4a', duration: '2:31', cover: 'song_covers/prevail.jpg' },
        { id: 2, name: 'Asthma/Goku', author: 'Playboi Carti', url: 'songs/asthma.m4a', duration: '2:10', cover: 'song_covers/prevail.jpg' },
        { id: 3, name: 'Movie Time', author: 'Playboi Carti', url: 'songs/movietime.m4a', duration: '2:41', cover: 'song_covers/prevail.jpg' },
        { id: 4, name: 'Friends', author: 'Playboi Carti', url: 'songs/friends.m4a', duration: '2:45', cover: 'song_covers/prevail.jpg' },
        { id: 5, name: 'Stop Breathing', author: 'Playboi Carti', url: 'songs/stopbreathing.mp3', duration: '3:38', cover: 'song_covers/prevail.jpg' }
    ];

    // Load queue from localStorage (array of ids) or use all tracks
    let tracks = [];
    let currentTrack = 0;
    const queueData = localStorage.getItem('musicflow_queue');
    if (queueData) {
        try {
            const parsed = JSON.parse(queueData);
            if (Array.isArray(parsed) && typeof parsed[0] === 'number') {
                tracks = parsed.map(id => defaultTracks.find(t => t.id === id)).filter(Boolean);
            } else if (Array.isArray(parsed) && typeof parsed[0] === 'object') {
                tracks = parsed;
            } else {
                tracks = defaultTracks;
            }
        } catch (e) {
            tracks = defaultTracks;
        }
    } else {
        tracks = defaultTracks;
        localStorage.setItem('musicflow_queue', JSON.stringify(defaultTracks.map(t => t.id)));
    }

    function parseDuration(str) {
        const [min, sec] = str.split(':').map(Number);
        return min * 60 + sec;
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    function renderQueue() {
        const queueList = $('#queue-list');
        queueList.empty();
        if (!tracks.length) {
            queueList.append('<div class="text-muted">No songs in queue.</div>');
            return;
        }
        tracks.forEach((track, idx) => {
            queueList.append(`
                <div class="queue-item${idx === currentTrack ? ' active' : ''}" data-index="${idx}">
                    <div class="queue-number">${idx + 1}</div>
                    <div class="queue-info">
                        <div class="queue-title">${track.name}</div>
                        <div class="queue-artist">${track.author}</div>
                    </div>
                    <div class="queue-duration">${track.duration}</div>
                </div>
            `);
        });
    }

    // Add cover support (optional: add a 'cover' field to defaultTracks if you want images)
    function updateCover(track) {
        const coverImg = document.getElementById('coverImg');
        const coverIcon = document.getElementById('coverIcon');
        if (track.cover) {
            coverImg.src = track.cover;
            coverImg.style.display = '';
            coverIcon.style.display = 'none';
        } else {
            coverImg.style.display = 'none';
            coverIcon.style.display = '';
        }
    }

    // Audio element
    const audio = document.getElementById('audioPlayer');
    audio.volume = volume / 100;

    function loadTrack(index) {
        if (!tracks[index]) return;
        const track = tracks[index];
        $('#trackTitle').text(track.name);
        $('#trackArtist').text(track.author);
        $('.time-total').text(track.duration);
        duration = parseDuration(track.duration);
        currentTime = 0;
        $('#progressBar').val(0);
        $('.time-current').text('0:00');
        renderQueue();
        $('.track-info').hide().fadeIn(500);
        // Set audio src
        audio.src = track.url;
        audio.currentTime = 0;
        updateCover(track);
        // If playing, start playback
        if (isPlaying) {
            audio.play().catch(() => {
                isPlaying = false;
                $('#playBtn').html('<i class="fas fa-play"></i>').removeClass('playing');
                $('.album-cover i').removeClass('fa-spin');
            });
        }
    }

    // Play/Pause logic
    $('#playBtn').off('click').on('click', function () {
        if (!tracks.length) return;
        isPlaying = !isPlaying;
        if (isPlaying) {
            $(this).html('<i class="fas fa-pause"></i>');
            $(this).addClass('playing');
            $('.album-cover i').addClass('fa-spin');
            if (playInterval) clearInterval(playInterval);
            playInterval = setInterval(updateProgress, 100);
            audio.play().catch(() => {
                isPlaying = false;
                $(this).html('<i class="fas fa-play"></i>');
                $(this).removeClass('playing');
                $('.album-cover i').removeClass('fa-spin');
            });
        } else {
            $(this).html('<i class="fas fa-play"></i>');
            $(this).removeClass('playing');
            $('.album-cover i').removeClass('fa-spin');
            if (playInterval) clearInterval(playInterval);
            audio.pause();
        }
    });

    function updateProgress() {
        if (isPlaying && currentTime < duration) {
            currentTime = audio.currentTime;
            const percentage = (currentTime / duration) * 100;
            $('#progressBar').val(percentage);
            $('.time-current').text(formatTime(currentTime));
            if (currentTime >= duration) {
                clearInterval(playInterval);
                isPlaying = false;
                $('#playBtn').html('<i class="fas fa-play"></i>').removeClass('playing');
                $('.album-cover i').removeClass('fa-spin');
            }
        }
    }

    // Sync audio time with progress bar
    audio.ontimeupdate = function () {
        currentTime = audio.currentTime;
        const percentage = (currentTime / duration) * 100;
        $('#progressBar').val(percentage);
        $('.time-current').text(formatTime(currentTime));
    };

    // Seek
    $('#progressBar').on('input', function () {
        const percentage = $(this).val();
        currentTime = (percentage / 100) * duration;
        audio.currentTime = currentTime;
        $('.time-current').text(formatTime(currentTime));
    });

    // Volume
    $('#volumeSlider').on('input', function () {
        volume = $(this).val();
        audio.volume = volume / 100;
        if (volume == 0) {
            $('.volume-control i:first').removeClass('fa-volume-down').addClass('fa-volume-mute');
        } else {
            $('.volume-control i:first').removeClass('fa-volume-mute').addClass('fa-volume-down');
        }
    });

    // Next/Prev
    $('#prevBtn').off('click').on('click', function () {
        if (currentTrack > 0) {
            currentTrack--;
            loadTrack(currentTrack);
            if (isPlaying) audio.play();
        }
        $(this).css('transform', 'scale(0.9)');
        setTimeout(() => $(this).css('transform', 'scale(1)'), 100);
    });
    $('#nextBtn').off('click').on('click', function () {
        if (currentTrack < tracks.length - 1) {
            currentTrack++;
            loadTrack(currentTrack);
            if (isPlaying) audio.play();
        }
        $(this).css('transform', 'scale(0.9)');
        setTimeout(() => $(this).css('transform', 'scale(1)'), 100);
    });

    // Queue click
    $(document).off('click', '.queue-item').on('click', '.queue-item', function () {
        const index = parseInt($(this).attr('data-index'));
        currentTrack = index;
        loadTrack(index);
        if (!isPlaying) {
            $('#playBtn').click();
        }
    });

    // Shuffle and Repeat button logic
    function setButtonActive(btn, active) {
        if (active) {
            btn.addClass('active');
            btn.css('color', 'var(--primary-color)');
        } else {
            btn.removeClass('active');
            btn.css('color', '');
        }
    }

    function shuffleArray(array) {
        let arr = array.slice();
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Shuffle button
    $('#shuffleBtn').off('click').on('click', function () {
        isShuffled = !isShuffled;
        setButtonActive($(this), isShuffled);
        if (isShuffled) {
            // Shuffle queue and store in localStorage
            const shuffled = shuffleArray(tracks.map(t => t.id));
            localStorage.setItem('musicflow_queue_shuffle', JSON.stringify(shuffled));
            // Update tracks to shuffled
            tracks = shuffled.map(id => defaultTracks.find(t => t.id === id)).filter(Boolean);
            currentTrack = 0;
            loadTrack(currentTrack);
        } else {
            // Restore original queue
            const queueData = localStorage.getItem('musicflow_queue');
            if (queueData) {
                const parsed = JSON.parse(queueData);
                tracks = parsed.map(id => defaultTracks.find(t => t.id === id)).filter(Boolean);
                currentTrack = 0;
                loadTrack(currentTrack);
            }
        }
        renderQueue();
    });

    // Repeat button
    $('#repeatBtn').off('click').on('click', function () {
        isRepeating = !isRepeating;
        setButtonActive($(this), isRepeating);
    });

    // On page load, set button state
    setButtonActive($('#shuffleBtn'), isShuffled);
    setButtonActive($('#repeatBtn'), isRepeating);

    // Auto next track
    audio.onended = function () {
        if (currentTrack < tracks.length - 1) {
            currentTrack++;
            loadTrack(currentTrack);
            audio.play();
        } else if (isRepeating) {
            currentTrack = 0;
            loadTrack(currentTrack);
            audio.play();
        } else {
            isPlaying = false;
            $('#playBtn').html('<i class="fas fa-play"></i>').removeClass('playing');
            $('.album-cover i').removeClass('fa-spin');
        }
    };

    // Audio error handler
    audio.onerror = function () {
        isPlaying = false;
        $('#playBtn').html('<i class="fas fa-play"></i>').removeClass('playing');
        $('.album-cover i').removeClass('fa-spin');
        // Show error message in queue area
        $('#queue-list').prepend('<div class="alert alert-danger mt-2">Cannot load audio file: ' + (tracks[currentTrack] ? tracks[currentTrack].name : 'Unknown') + '</div>');
    };

    // Initial render
    renderQueue();
    loadTrack(currentTrack);
    $('.time-current').text('0:00');
    $('.time-total').text(tracks[0] ? tracks[0].duration : '0:00');
    console.log('Music Player initialized!');
});