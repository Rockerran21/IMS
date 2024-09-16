// profile.js

document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    loadAdminProfile();
    initializeFormSubmissions();
    loadActivityLog();
    initializeTabs();
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

function loadAdminProfile() {
    fetch('http://localhost:8080/api/auth/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error fetching profile:', data.error);
                return;
            }

            // Populate the profile fields with the data
            document.getElementById('adminName').textContent = data.username;
            document.getElementById('fullName').value = data.username;
            document.getElementById('email').value = data.email;
            document.getElementById('phone').value = data.phone;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function initializeFormSubmissions() {
    document.getElementById('personalInfoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Simulate saving personal info
        alert('Personal information updated successfully!');
    });

    document.getElementById('securityForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const oldPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        // Send the request to change the password
        fetch('http://localhost:8080/api/auth/change-password', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ oldPassword, newPassword })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error); // Display error if old password is incorrect
                } else {
                    alert(data.message); // Display success message

                    // Log out the user after password change
                    localStorage.removeItem('token'); // Remove token from localStorage
                    window.location.href = 'login.html'; // Redirect to login page
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to change password. Please try again.');
            });
    });



    document.getElementById('preferencesForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Simulate saving preferences
        alert('Preferences updated successfully!');
    });
}

function loadActivityLog() {
    const activityLog = document.getElementById('activityLog');
    // Simulate loading activity log data
    const activities = [
        { action: 'Logged in', timestamp: '2024-09-13 08:30:00' },
        { action: 'Updated student record', timestamp: '2024-09-13 09:15:23' },
        { action: 'Generated monthly report', timestamp: '2024-09-13 11:45:10' },
        { action: 'Added new course', timestamp: '2024-09-13 14:20:45' }
    ];

    activities.forEach(activity => {
        const entry = document.createElement('div');
        entry.className = 'activity-log-entry';
        entry.innerHTML = `<strong>${activity.action}</strong> - ${activity.timestamp}`;
        activityLog.appendChild(entry);
    });
}

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

document.getElementById('changeAvatarBtn').addEventListener('click', function() {
    // Simulate avatar change
    alert('Avatar change functionality to be implemented');
});

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    // Add logout logic here
    console.log('Logout clicked');
});