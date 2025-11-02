$(document).ready(function() {
    let isPlaying = false;
    let currentTime = 0;
    let duration = 225;
    let volume = 70;
    let isShuffled = false;
    let isRepeating = false;

    const tracks = [
        { title: 'Summer Vibes', artist: 'The Melody Makers', duration: '3:45' },
        { title: 'Night Drive', artist: 'Echo Valley', duration: '4:12' },
        { title: 'Morning Coffee', artist: 'Jazz Collective', duration: '3:28' },
        { title: 'Sunset Boulevard', artist: 'Wave Riders', duration: '3:56' }
    ];
    let currentTrack = 0;

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    function updateProgress() {
        if (isPlaying && currentTime < duration) {
            currentTime += 0.1;
            const percentage = (currentTime / duration) * 100;
            $('#progressBar').val(percentage);
            $('.time-current').text(formatTime(currentTime));
        }
    }

    $('#playBtn').click(function() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            $(this).html('<i class="fas fa-pause"></i>');
            $(this).addClass('playing');
            $('.album-cover i').addClass('fa-spin');
            setInterval(updateProgress, 100);
        } else {
            $(this).html('<i class="fas fa-play"></i>');
            $(this).removeClass('playing');
            $('.album-cover i').removeClass('fa-spin');
        }
    });

    $('#progressBar').on('input', function() {
        const percentage = $(this).val();
        currentTime = (percentage / 100) * duration;
        $('.time-current').text(formatTime(currentTime));
    });

    $('#volumeSlider').on('input', function() {
        volume = $(this).val();
        if (volume == 0) {
            $('.volume-control i:first').removeClass('fa-volume-down').addClass('fa-volume-mute');
        } else {
            $('.volume-control i:first').removeClass('fa-volume-mute').addClass('fa-volume-down');
        }
    });

    $('#prevBtn').click(function() {
        if (currentTrack > 0) {
            currentTrack--;
            loadTrack(currentTrack);
        }
        $(this).css('transform', 'scale(0.9)');
        setTimeout(() => $(this).css('transform', 'scale(1)'), 100);
    });

    $('#nextBtn').click(function() {
        if (currentTrack < tracks.length - 1) {
            currentTrack++;
            loadTrack(currentTrack);
        }
        $(this).css('transform', 'scale(0.9)');
        setTimeout(() => $(this).css('transform', 'scale(1)'), 100);
    });

    $('#shuffleBtn').click(function() {
        isShuffled = !isShuffled;
        $(this).toggleClass('active');
        if (isShuffled) {
            $(this).css('color', 'var(--primary-color)');
        } else {
            $(this).css('color', '');
        }
    });

    $('#repeatBtn').click(function() {
        isRepeating = !isRepeating;
        $(this).toggleClass('active');
        if (isRepeating) {
            $(this).css('color', 'var(--primary-color)');
        } else {
            $(this).css('color', '');
        }
    });

    function loadTrack(index) {
        const track = tracks[index];
        $('#trackTitle').text(track.title);
        $('#trackArtist').text(track.artist);
        $('.time-total').text(track.duration);
        currentTime = 0;
        $('#progressBar').val(0);
        $('.time-current').text('0:00');

        $('.queue-item').removeClass('active');
        $('.queue-item').eq(index).addClass('active');

        $('.track-info').hide().fadeIn(500);
    }

    $('.queue-item').click(function() {
    const trackNumber = parseInt($(this).find('.queue-number').text());
    const index = trackNumber - 1;
    
    currentTrack = index;
    loadTrack(index);
    
    if (!isPlaying) {
        $('#playBtn').click();
    }
});


    $('.control-btn').hover(
        function() {
            $(this).css('transform', 'scale(1.1)');
        },
        function() {
            $(this).css('transform', 'scale(1)');
        }
    );

    $('.time-current').text('0:00');
    $('.time-total').text('3:45');

    console.log('Music Player initialized!');
});