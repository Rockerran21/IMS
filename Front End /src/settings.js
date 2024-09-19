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
    const buttons = {
        userSearch: { id: 'userSearchBtn', title: 'Search Users', function: searchUsers },
        backupDb: { id: 'backupDbBtn', title: 'Backup Database', function: performBackup },
        restoreDb: { id: 'restoreDbBtn', title: 'Restore Database', function: performRestore },
        configEmail: { id: 'configEmailBtn', title: 'Configure Email', function: configureEmail },
        changePassword: { id: 'changePasswordBtn', title: 'Change Admin Password', function: changeAdminPassword },
        twoFactorAuth: { id: 'twoFactorAuthBtn', title: 'Configure Two-Factor Auth', function: configureTwoFactor },
        systemConfig: { id: 'systemConfigBtn', title: 'System Configuration', function: systemConfiguration },
        viewLogs: { id: 'viewLogsBtn', title: 'View System Logs', function: viewSystemLogs }
    };

    for (const [key, buttonInfo] of Object.entries(buttons)) {
        const button = document.getElementById(buttonInfo.id);
        if (button) {
            button.addEventListener('click', () => {
                if (key === 'userSearch') {
                    buttonInfo.function();
                } else {
                    openModal(buttonInfo.title, buttonInfo.function);
                }
            });
        } else {
            console.warn(`Button with ID '${buttonInfo.id}' not found`);
        }
    }
}

function openModal(title, contentFunction) {
    const modal = document.getElementById('settingsModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = title;
    modalBody.innerHTML = '';

    if (title === 'Manage Users') {
        manageUsers(modalBody);
    } else {
        contentFunction(modalBody);
    }

    modal.classList.add('active');

    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.classList.remove('active');

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.classList.remove('active');
        }
    };
}

function manageUsers(modalBody) {
    modalBody.innerHTML = `
        <div class="settings-form">
            <div id="userSearchResults" class="user-list"></div>
        </div>
    `;
    document.getElementById('userSearchBtn').addEventListener('click', searchUsers);
}

function searchUsers() {
    const searchTerm = document.getElementById('userSearchInput').value;
    const token = localStorage.getItem('token');
    
    showLoadingAnimation();

    fetch(`http://localhost:8080/api/settings/users/search?query=${searchTerm}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('User search endpoint not found. Please ensure the backend is properly configured.');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const userList = document.getElementById('userSearchResults');
        if (Array.isArray(data) && data.length > 0) {
            userList.innerHTML = data.map(user => `
                <div class="user-item" data-username="${user.username}">
                    <div class="user-info">
                        <strong>${user.username}</strong> (${user.email}) - ${user.role}
                    </div>
                    <div class="user-actions">
                        <button onclick="editUser('${user._id}')" class="edit-btn">Edit</button>
                        <button onclick="deleteUser('${user._id}')" class="delete-btn">Delete</button>
                    </div>
                </div>
            `).join('');
        } else {
            userList.innerHTML = '<p>No users found.</p>';
        }
    })
    .catch(error => {
        console.error('Error searching users:', error);
        document.getElementById('userSearchResults').innerHTML = `<p>An error occurred while searching: ${error.message}</p>`;
    })
    .finally(() => {
        hideLoadingAnimation();
    });
}

function editUser(userId) {
    // Implement edit user functionality
    console.log('Edit user:', userId);
    // Fetch user details and show edit form
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:8080/api/settings/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            searchUsers(); // Refresh the user list
        })
        .catch(error => console.error('Error deleting user:', error));
    }
}

function showAddUserForm() {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <form id="addUserForm" class="settings-form">
            <input type="text" id="newUsername" placeholder="Username" required>
            <input type="email" id="newEmail" placeholder="Email" required>
            <input type="password" id="newPassword" placeholder="Password" required>
            <select id="newRole" required>
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
            </select>
            <button type="submit" class="settings-btn">Add User</button>
        </form>
    `;
    document.getElementById('addUserForm').addEventListener('submit', addUser);
}

function addUser(event) {
    event.preventDefault();
    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newRole').value;
    const token = localStorage.getItem('token');

    fetch('http://localhost:8080/api/settings/users', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, email, password, role })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        manageUsers(document.getElementById('modalBody'));
    })
    .catch(error => console.error('Error adding user:', error));
}

function backupDatabase(modalBody) {
    modalBody.innerHTML = `
        <div class="settings-form">
            <h3>Backup Database</h3>
            <p>Click the button below to create a backup of the current database.</p>
            <button onclick="performBackup()" class="settings-btn">Start Backup</button>
        </div>
    `;
}

function restoreDatabase(modalBody) {
    modalBody.innerHTML = `
        <div class="settings-form">
            <h3>Restore Database</h3>
            <p>Select a backup file to restore the database.</p>
            <input type="file" id="backupFile" accept=".gz">
            <button onclick="performRestore()" class="settings-btn">Restore Database</button>
        </div>
    `;
}

function configureEmail(modalBody) {
    modalBody.innerHTML = `
        <div class="settings-form">
            <h3>Email Configuration</h3>
            <form id="emailConfigForm">
                <label for="smtpServer">SMTP Server:</label>
                <input type="text" id="smtpServer" required>
                <label for="smtpPort">SMTP Port:</label>
                <input type="number" id="smtpPort" required>
                <label for="emailUsername">Username:</label>
                <input type="text" id="emailUsername" required>
                <label for="emailPassword">Password:</label>
                <input type="password" id="emailPassword" required>
                <button type="submit" class="settings-btn">Save Configuration</button>
            </form>
        </div>
    `;
    document.getElementById('emailConfigForm').addEventListener('submit', saveEmailConfig);
}

function changeAdminPassword(modalBody) {
    modalBody.innerHTML = `
        <div class="settings-form">
            <h3>Change Admin Password</h3>
            <form id="changePasswordForm">
                <label for="currentPassword">Current Password:</label>
                <input type="password" id="currentPassword" required>
                <label for="newPassword">New Password:</label>
                <input type="password" id="newPassword" required>
                <label for="confirmPassword">Confirm New Password:</label>
                <input type="password" id="confirmPassword" required>
                <button type="submit" class="settings-btn">Change Password</button>
            </form>
        </div>
    `;
    document.getElementById('changePasswordForm').addEventListener('submit', updateAdminPassword);
}

function configureTwoFactor(modalBody) {
    modalBody.innerHTML = `
        <div class="settings-form">
            <h3>Two-Factor Authentication</h3>
            <p>Scan the QR code with your authenticator app:</p>
            <img id="qrCodeImage" alt="2FA QR Code">
            <p>Enter the code from your authenticator app:</p>
            <input type="text" id="twoFactorCode">
            <button onclick="enableTwoFactor()" class="settings-btn">Enable Two-Factor Auth</button>
        </div>
    `;
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/api/settings/generate-2fa-qr', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('qrCodeImage').src = data.qrCodeUrl;
    })
    .catch(error => {
        console.error('Error fetching 2FA QR code:', error);
        modalBody.innerHTML += `<p style="color: red;">Error: ${error.message}</p>`;
    });
}

function enableTwoFactor() {
    const code = document.getElementById('twoFactorCode').value;
    fetch('http://localhost:8080/api/settings/enable-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Two-factor authentication enabled successfully');
        } else {
            alert('Failed to enable two-factor authentication. Please try again.');
        }
    })
    .catch(error => console.error('Error enabling 2FA:', error));
}

function systemConfiguration(modalBody) {
    modalBody.innerHTML = `
        <div class="settings-form">
            <h3>System Configuration</h3>
            <form id="systemConfigForm">
                <label for="siteName">Site Name:</label>
                <input type="text" id="siteName" required>
                <label for="maintenanceMode">Maintenance Mode:</label>
                <input type="checkbox" id="maintenanceMode">
                <label for="debugMode">Debug Mode:</label>
                <input type="checkbox" id="debugMode">
                <button type="submit" class="settings-btn">Save Configuration</button>
            </form>
        </div>
    `;
    document.getElementById('systemConfigForm').addEventListener('submit', saveSystemConfig);
}

function viewSystemLogs(modalBody) {
    modalBody.innerHTML = `
        <div class="settings-form">
            <h3>System Logs</h3>
            <div class="log-controls">
                <select id="logType" class="log-select">
                    <option value="all">All Logs</option>
                    <option value="error">Error Logs</option>
                    <option value="info">Info Logs</option>
                </select>
                <button onclick="fetchLogs()" class="settings-btn">Fetch Logs</button>
            </div>
            <div class="log-container">
                <pre id="logContent" class="log-content"></pre>
            </div>
        </div>
    `;
}

function fetchLogs() {
    const logType = document.getElementById('logType').value;
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/settings/system-logs?type=${logType}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const logContent = document.getElementById('logContent');
        logContent.innerHTML = '';
        if (typeof data.logs === 'string') {
            data.logs.split('\n').forEach(line => {
                const logEntry = document.createElement('div');
                if (line.includes('ERROR:')) {
                    logEntry.classList.add('log-error');
                } else if (line.includes('INFO:')) {
                    logEntry.classList.add('log-info');
                }
                logEntry.textContent = line;
                logContent.appendChild(logEntry);
            });
        } else {
            logContent.textContent = 'No logs available.';
        }
    })
    .catch(error => console.error('Error fetching logs:', error));
}

function performBackup() {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/api/settings/backup', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error performing backup:', error));
}

function performRestore() {
    const backupFile = document.getElementById('backupFile').files[0];
    if (!backupFile) {
        alert('Please select a backup file');
        return;
    }

    const formData = new FormData();
    formData.append('backupFile', backupFile);

    fetch('http://localhost:8080/api/settings/restore', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error restoring database:', error));
}

function saveEmailConfig(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const config = Object.fromEntries(formData.entries());

    fetch('http://localhost:8080/api/settings/email-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error saving email config:', error));
}

function updateAdminPassword(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const passwords = Object.fromEntries(formData.entries());

    if (passwords.newPassword !== passwords.confirmPassword) {
        alert("New passwords don't match");
        return;
    }

    fetch('http://localhost:8080/api/settings/change-admin-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword
        })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error changing admin password:', error));
}

function saveSystemConfig(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const config = Object.fromEntries(formData.entries());

    // Implement saving system configuration logic here
    console.log('System configuration:', config);
    alert('System configuration saved (to be implemented)');
}

function showLoadingAnimation() {
    document.getElementById('loadingAnimation').style.display = 'flex';
}

function hideLoadingAnimation() {
    document.getElementById('loadingAnimation').style.display = 'none';
}

// Add event listener for logout button
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    // Implement logout logic here
    alert('Logout functionality to be implemented');
});


