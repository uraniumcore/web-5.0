// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

$("document").ready(function() {
    // Load components
    $("#header").load("./components/nav.html", function() {
        // After nav is loaded, initialize theme toggle
        $("#theme-toggle").on('click', toggleTheme);
    });
    $("#footer").load("./components/footer.html");
    
    // Initialize theme
    initTheme();
});