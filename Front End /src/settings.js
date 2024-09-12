// settings.js

document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeSettingsButtons();
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

function initializeSettingsButtons() {
    document.getElementById('manageUsersBtn').addEventListener('click', () => openModal('User Management', 'Manage user accounts, roles, and permissions.'));
    document.getElementById('backupDbBtn').addEventListener('click', () => openModal('Backup Database', 'Create a backup of the current database.'));
    document.getElementById('restoreDbBtn').addEventListener('click', () => openModal('Restore Database', 'Restore the database from a previous backup.'));
    document.getElementById('configEmailBtn').addEventListener('click', () => openModal('Configure Email', 'Set up email server settings for system notifications.'));
    document.getElementById('changePasswordBtn').addEventListener('click', () => openModal('Change Admin Password', 'Update the admin account password.'));
    document.getElementById('twoFactorAuthBtn').addEventListener('click', () => openModal('Configure Two-Factor Auth', 'Set up two-factor authentication for enhanced security.'));
    document.getElementById('systemConfigBtn').addEventListener('click', () => openModal('System Configuration', 'Adjust system-wide settings and preferences.'));
    document.getElementById('viewLogsBtn').addEventListener('click', () => openModal('View System Logs', 'Access and analyze system logs for troubleshooting.'));
}

function openModal(title, content) {
    const modal = document.getElementById('settingsModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = title;
    modalBody.innerHTML = `
        <p>${content}</p>
        <button onclick="simulateAction('${title}')" class="settings-btn">Proceed</button>
    `;

    modal.style.display = 'block';

    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.style.display = 'none';

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

function simulateAction(action) {
    // Simulate action and show a success message
    setTimeout(() => {
        alert(`${action} completed successfully!`);
        document.getElementById('settingsModal').style.display = 'none';
    }, 1000);
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    // Add logout logic here
    console.log('Logout clicked');
});