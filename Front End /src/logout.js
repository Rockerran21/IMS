// logout.js

document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeLogoutButtons();
});

function initializeParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });
}

function initializeLogoutButtons() {
    const confirmLogoutBtn = document.getElementById('confirmLogout');
    const cancelLogoutBtn = document.getElementById('cancelLogout');

    confirmLogoutBtn.addEventListener('click', function() {
        // Perform logout actions here
        // For example, clear session storage or cookies
        localStorage.removeItem('token');

        // Redirect to login page
        window.location.href = 'login.html';
    });

    cancelLogoutBtn.addEventListener('click', function() {
        // Redirect back to the previous page or dashboard
        window.history.back();
    });
}