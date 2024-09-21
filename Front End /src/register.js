document.addEventListener('DOMContentLoaded', function() {
    // Particles.js configuration
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

    // Form submission handling
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const registerData = Object.fromEntries(formData.entries());

        // Basic client-side validation
        if (registerData.password !== registerData.confirmPassword) {
            messageDiv.textContent = 'Passwords do not match';
            messageDiv.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            const data = await response.json();

            if (response.ok) {
                messageDiv.textContent = 'Registration successful! You can now log in.';
                messageDiv.style.color = 'green';
                // Optionally redirect to login page after a delay
                // setTimeout(() => { window.location.href = 'login.html'; }, 3000);
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            messageDiv.textContent = error.message;
            messageDiv.style.color = 'red';
        }
    });

    // Animate welcome text
    const welcomeText = document.querySelector('.welcome-text');
    const text = welcomeText.textContent;
    welcomeText.textContent = '';
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.style.animationDelay = `${i * 0.05}s`;
        welcomeText.appendChild(span);
    }
});