$(document).ready(function() {
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();

        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const subject = $('#subject').val();
        const message = $('#message').val().trim();

        if (name === '' || email === '' || subject === '' || message === '') {
            alert('Please fill in all fields');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        const submitBtn = $(this).find('button[type="submit"]');
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Sending...');
        submitBtn.prop('disabled', true);

        setTimeout(function() {
            $('#successMessage').fadeIn(500);

            $('#contactForm')[0].reset();

            submitBtn.html('<i class="fas fa-paper-plane"></i> Send Message');
            submitBtn.prop('disabled', false);

            setTimeout(function() {
                $('#successMessage').fadeOut(500);
            }, 5000);
            console.log('Form submitted:', {
                name: name,
                email: email,
                subject: subject,
                message: message,
                timestamp: new Date().toISOString()
            });
        }, 1500);
    });

    $('.form-control').on('focus', function() {
        $(this).parent().addClass('focused');
    });

    $('.form-control').on('blur', function() {
        $(this).parent().removeClass('focused');
    });

    $('#message').on('input', function() {
        const currentLength = $(this).val().length;
        const maxLength = 500;

        if (!$('#charCount').length) {
            $(this).after('<small id="charCount" class="form-text text-muted"></small>');
        }

        $('#charCount').text(currentLength + ' / ' + maxLength + ' characters');

        if (currentLength > maxLength) {
            $(this).val($(this).val().substring(0, maxLength));
        }
    });

    $(window).on('scroll', function() {
        $('.contact-box').each(function() {
            const boxTop = $(this).offset().top;
            const scrollTop = $(window).scrollTop();
            const windowHeight = $(window).height();

            if (scrollTop + windowHeight > boxTop + 50) {
                $(this).css({
                    'opacity': '1',
                    'transform': 'translateY(0)',
                    'transition': 'all 0.6s ease'
                });
            }
        });
    });

    $('.social-link').hover(
        function() {
            $(this).css({
                'transform': 'scale(1.2) rotate(5deg)',
                'box-shadow': '0 5px 15px rgba(29, 185, 84, 0.4)'
            });
        },
        function() {
            $(this).css({
                'transform': 'scale(1) rotate(0deg)',
                'box-shadow': 'none'
            });
        }
    );

    $('.contact-box').css({
        'opacity': '0',
        'transform': 'translateY(20px)'
    });

    console.log('Contact page initialized!');
});