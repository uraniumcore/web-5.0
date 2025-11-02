$(document).ready(function() {
    $('.playlist-card').each(function(index) {
        $(this).css({
            'opacity': '0',
            'transform': 'translateY(20px)'
        });

        $(this).delay(index * 100).animate({
            'opacity': '1'
        }, 600, function() {
            $(this).css('transform', 'translateY(0)');
        });
    });

    $('.playlist-card').hover(
        function() {
            $(this).find('.playlist-img i').css({
                'transform': 'scale(1.2) rotate(10deg)',
                'transition': 'all 0.3s ease'
            });
        },
        function() {
            $(this).find('.playlist-img i').css({
                'transform': 'scale(1) rotate(0deg)'
            });
        }
    );

    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = $(this.getAttribute('href'));
        if(target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 70
            }, 1000);
        }
    });

    $('.nav-link').on('click', function() {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
    });

    $('#featuredCarousel').carousel({
        interval: 4000,
        pause: 'hover'
    });

    $('.hero-section .btn').hover(
        function() {
            $(this).css('box-shadow', '0 10px 25px rgba(29, 185, 84, 0.4)');
        },
        function() {
            $(this).css('box-shadow', 'none');
        }
    );

    $(window).scroll(function() {
        $('.section-title').each(function() {
            var position = $(this).offset().top;
            var scrollTop = $(window).scrollTop();
            var windowHeight = $(window).height();

            if (scrollTop + windowHeight > position + 100) {
                $(this).css({
                    'opacity': '1',
                    'transform': 'translateY(0)',
                    'transition': 'all 0.8s ease'
                });
            }
        });
    });

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    console.log('MusicFlow initialized successfully!');
});