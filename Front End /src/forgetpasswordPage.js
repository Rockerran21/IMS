document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeResetPasswordForm();
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

function initializeResetPasswordForm() {
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const messageDiv = document.getElementById('message');

    resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const token = document.getElementById('token').value;  // Assuming token is passed here

        if (password !== confirmPassword) {
            messageDiv.textContent = 'Passwords do not match!';
            messageDiv.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await response.json();

            if (response.ok) {
                messageDiv.textContent = 'Password reset successfully. Please log in with your new password.';
                messageDiv.style.color = 'green';
                // Optionally, redirect to login page after a few seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
            } else {
                throw new Error(data.error || 'Password reset failed.');
            }
        } catch (error) {
            messageDiv.textContent = error.message;
            messageDiv.style.color = 'red';
        }
    });
}
function getTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
}

document.getElementById('token').value = getTokenFromUrl();
