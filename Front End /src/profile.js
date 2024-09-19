// profile.js

document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    loadAdminProfile();
    initializeFormSubmissions();
    loadActivityLog();
    initializeTabs();
    initializeAvatarUpload();
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
    fetch('http://localhost:8080/api/users/profile', {
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

        document.getElementById('adminName').textContent = data.username;
        document.getElementById('fullName').value = data.username;
        document.getElementById('email').value = data.email;
        document.getElementById('phone').value = data.phone || '';

        const avatarImg = document.getElementById('adminAvatar');
        if (data.id) {
            avatarImg.src = `http://localhost:8080/api/users/avatar/${data.id}`;
            avatarImg.onerror = function() {
                this.src = '../assets/default-avatar.png';
            };
        } else {
            avatarImg.src = '../assets/default-avatar.png';
        }

        // Load preferences
        document.getElementById('defaultDashboardView').value = data.defaultDashboardView || 'summary';
        document.getElementById('notificationPreference').value = data.notificationPreference || 'email';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function initializeFormSubmissions() {
    document.getElementById('personalInfoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Simulate saving personal info
        fetch('http://localhost:8080/api/users/update-profile', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert('Personal information updated successfully!');
                loadActivityLog();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to update personal information. Please try again.');
        });
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
        fetch('http://localhost:8080/api/users/change-password', {
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
        const defaultDashboardView = document.getElementById('defaultDashboardView').value;
        const notificationPreference = document.getElementById('notificationPreference').value;

        fetch('http://localhost:8080/api/users/update-preferences', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ defaultDashboardView, notificationPreference })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert('Preferences updated successfully!');
                loadActivityLog();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to update preferences. Please try again.');
        });
    });
}

function loadActivityLog() {
    console.log('Fetching activity log...');
    fetch('http://localhost:8080/api/users/activity-log', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(activities => {
        console.log('Received activities:', activities);
        const activityLog = document.getElementById('activityLog');
        activityLog.innerHTML = '';
        if (activities.length === 0) {
            activityLog.innerHTML = '<p>No activities logged yet.</p>';
        } else {
            activities.forEach(activity => {
                const entry = document.createElement('div');
                entry.className = 'activity-log-entry';
                const date = new Date(activity.timestamp);
                entry.innerHTML = `<strong>${activity.action}</strong> - ${date.toLocaleString()}`;
                activityLog.appendChild(entry);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching activity log:', error);
        document.getElementById('activityLog').innerHTML = '<p>Error loading activity log.</p>';
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

function initializeAvatarUpload() {
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarUpload = document.getElementById('avatarUpload');
    const avatarPreview = document.getElementById('adminAvatar');

    changeAvatarBtn.addEventListener('click', function() {
        avatarUpload.click();
    });

    avatarUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Preview the image
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarPreview.src = e.target.result;
            }
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('avatar', file);

            fetch('http://localhost:8080/api/users/upload-avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Avatar uploaded successfully!');
                    loadAdminProfile();
                    loadActivityLog();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to upload avatar. Please try again.');
            });
        }
    });
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    // Add logout logic here
    console.log('Logout clicked');
});