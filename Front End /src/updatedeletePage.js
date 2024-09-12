// updatedelete.js

const API_BASE_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeSidebar();
    initializeSearchFunctionality();
});
let currentStudentId;

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

function initializeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const content = document.querySelector('.content');

    if (sidebarToggle && sidebar && content) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            content.classList.toggle('expanded');
        });
    } else {
        console.error('Sidebar elements not found');
    }
}

function initializeSearchFunctionality() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value;
    showLoadingAnimation();

    fetch(`${API_BASE_URL}/api/students/search?query=${searchTerm}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('searchResults').innerHTML = `<p>An error occurred while searching: ${error.message}</p>`;
        })
        .finally(() => {
            hideLoadingAnimation();
        });
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    if (results.length === 0) {
        searchResults.innerHTML = '<p>No results found.</p>';
        return;
    }

    results.forEach(student => {
        const studentCard = document.createElement('div');
        studentCard.className = 'student-card';
        studentCard.innerHTML = `
            <div class="student-info">
                <h3>${student.firstName} ${student.lastName}</h3>
                <p><i class="fas fa-envelope"></i> ${student.email}</p>
                <p><i class="fas fa-graduation-cap"></i> ${student.bachelorSubject || 'N/A'}</p>
            </div>
            <button onclick="viewStudentDetails('${student._id}')" class="view-more-btn">View More</button>
        `;
        searchResults.appendChild(studentCard);
    });
}

function viewStudentDetails(studentId) {
    currentStudentId = studentId;  // Store the current student ID
    showLoadingAnimation();
    fetch(`${API_BASE_URL}/api/students/${studentId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(student => {
            document.getElementById('searchResults').style.display = 'none';
            document.getElementById('updateSection').style.display = 'block';
            populateUpdateForm(student);
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('Failed to fetch student details. Please try again.', 'error');
        })
        .finally(() => {
            hideLoadingAnimation();
        });
}

let currentStep = 0;
const steps = document.getElementsByClassName('form-step');

function navigateForm(direction) {
    currentStep += direction;
    if (currentStep < 0) currentStep = 0;
    if (currentStep >= steps.length) currentStep = steps.length - 1;

    Array.from(steps).forEach((step, index) => {
        step.style.display = index === currentStep ? 'block' : 'none';
    });

    document.getElementById('prevBtn').style.display = currentStep === 0 ? 'none' : 'inline-block';

    if (currentStep === steps.length - 1) {
        document.getElementById('nextBtn').innerHTML = 'Update';
        document.getElementById('nextBtn').onclick = function() {
            updateStudent(currentStudentId);
        };
    } else {
        document.getElementById('nextBtn').innerHTML = 'Next';
        document.getElementById('nextBtn').onclick = function() {
            navigateForm(1);
        };
    }
}

function populateUpdateForm(student) {
    const updateSection = document.getElementById('updateSection');
    updateSection.innerHTML = `
        <h2>Update Student Information</h2>
        <form id="updateForm" class="multi-step-form">
            <div class="form-step active">
                <h3>Basic Information</h3>
                <div class="input-group">
                    <label for="firstName">First Name</label>
                    <input type="text" id="firstName" name="firstName" value="${student.firstName}" required>
                </div>
                <div class="input-group">
                    <label for="lastName">Last Name</label>
                    <input type="text" id="lastName" name="lastName" value="${student.lastName}" required>
                </div>
                <div class="input-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" value="${student.email}" required>
                </div>
            </div>
            <div class="form-step">
                <h3>Certifications</h3>
                <div id="certificationsContainer"></div>
                <button type="button" class="add-more-btn" onclick="addCertification()">Add Certification</button>
            </div>
            <div class="form-step">
                <h3>Employment History</h3>
                <div id="employmentsContainer"></div>
                <button type="button" class="add-more-btn" onclick="addEmployment()">Add Employment</button>
            </div>
            <div class="form-step">
                <h3>Projects</h3>
                <div id="projectsContainer"></div>
                <button type="button" class="add-more-btn" onclick="addProject()">Add Project</button>
            </div>
            <div class="form-navigation">
                <button type="button" id="prevBtn" onclick="navigateForm(-1)">Previous</button>
                <button type="button" id="nextBtn" onclick="navigateForm(1)">Next</button>
            </div>
        </form>
        <div class="action-buttons">
            <button type="button" class="btn-update" onclick="updateStudent('${student._id}')">Update</button>
            <button type="button" class="btn-delete" onclick="showDeleteConfirmation('${student._id}')">Delete</button>
            <button type="button" class="btn-back" onclick="backToSearch()">Back to Search</button>
        </div>
    `;

    populateCertifications(student.certifications || []);
    populateEmployments(student.employments || []);
    populateProjects(student.projects || []);
    currentStep = 0;
    navigateForm(0);
}

function populateCertifications(certifications) {
    const container = document.getElementById('certificationsContainer');
    container.innerHTML = '';
    certifications.forEach((cert, index) => {
        addCertification(cert, index);
    });
}

function addCertification(cert = {}, index = Date.now()) {
    const container = document.getElementById('certificationsContainer');
    const certHtml = `
        <div class="certification-item">
            <input type="text" name="certifications[${index}][name]" value="${cert.name || ''}" placeholder="Certification Name" required>
            <input type="text" name="certifications[${index}][authority]" value="${cert.authority || ''}" placeholder="Issuing Authority" required>
            <input type="date" name="certifications[${index}][date]" value="${cert.date || ''}" required>
            <button type="button" onclick="removeCertification(this)">Remove</button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', certHtml);
}

function removeCertification(button) {
    button.closest('.certification-item').remove();
}

function populateEmployments(employments) {
    const container = document.getElementById('employmentsContainer');
    container.innerHTML = '';
    employments.forEach((emp, index) => {
        addEmployment(emp, index);
    });
}

function addEmployment(emp = {}, index = Date.now()) {
    const container = document.getElementById('employmentsContainer');
    const empHtml = `
        <div class="employment-item">
            <input type="text" name="employments[${index}][employerName]" value="${emp.employerName || ''}" placeholder="Employer Name" required>
            <input type="text" name="employments[${index}][currentField]" value="${emp.currentField || ''}" placeholder="Current Field">
            <label>
                <input type="checkbox" name="employments[${index}][currentEmployer]" ${emp.currentEmployer ? 'checked' : ''}>
                Current Employer
            </label>
            <button type="button" onclick="removeEmployment(this)">Remove</button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', empHtml);
}

function processEmployments() {
    const employments = [];
    const empContainer = document.getElementById('employmentsContainer');
    const empItems = empContainer.getElementsByClassName('employment-item');
    for (let item of empItems) {
        employments.push({
            employerName: item.querySelector('input[name$="[employerName]"]').value,
            currentField: item.querySelector('input[name$="[currentField]"]').value,
            currentEmployer: item.querySelector('input[name$="[currentEmployer]"]').checked
        });
    }
    return employments;
}

function removeEmployment(button) {
    button.closest('.employment-item').remove();
}

function populateProjects(projects) {
    const container = document.getElementById('projectsContainer');
    container.innerHTML = '';
    projects.forEach((proj, index) => {
        addProject(proj, index);
    });
}

function addProject(proj = {}, index = Date.now()) {
    const container = document.getElementById('projectsContainer');
    const projHtml = `
        <div class="project-item">
            <input type="text" name="projects[${index}][projectName]" value="${proj.projectName || ''}" placeholder="Project Name" required>
            <textarea name="projects[${index}][description]" placeholder="Project Description">${proj.description || ''}</textarea>
            <button type="button" onclick="removeProject(this)">Remove</button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', projHtml);
}
function removeProject(button) {
    button.closest('.project-item').remove();
}

function updateStudent() {
    const formData = new FormData(document.getElementById('updateForm'));
    const studentData = Object.fromEntries(formData.entries());

    studentData.certifications = processCertifications();
    studentData.employments = processEmployments();
    studentData.projects = processProjects();

    console.log('Updating student with data:', studentData);

    showLoadingAnimation();
    fetch(`${API_BASE_URL}/api/students/${currentStudentId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(updatedStudent => {
            console.log('Server response:', updatedStudent);
            showMessage(`Student ${updatedStudent.firstName} ${updatedStudent.lastName} has been updated successfully.`);
            viewStudentDetails(currentStudentId);
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage(`Failed to update student: ${error.message}`, 'error');
        })
        .finally(() => {
            hideLoadingAnimation();
        });
    console.log('Updating student with data:', studentData);
}


function processProjects() {
    const projects = [];
    const projContainer = document.getElementById('projectsContainer');
    const projItems = projContainer.getElementsByClassName('project-item');
    for (let item of projItems) {
        projects.push({
            projectName: item.querySelector('input[name$="[projectName]"]').value,
            description: item.querySelector('textarea[name$="[description]"]').value
        });
    }
    return projects;
}

function processCertifications() {
    const certifications = [];
    const certContainer = document.getElementById('certificationsContainer');
    const certItems = certContainer.getElementsByClassName('certification-item');
    for (let item of certItems) {
        certifications.push({
            certificationName: item.querySelector('input[name$="[name]"]').value,
            issuingAuthority: item.querySelector('input[name$="[authority]"]').value,
            dateObtained: item.querySelector('input[name$="[date]"]').value
        });
    }
    return certifications;
}

function showDeleteConfirmation(studentId) {
    const deleteSection = document.getElementById('deleteSection');
    deleteSection.style.display = 'block';
    deleteSection.innerHTML = `
        <div class="confirmation-modal">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this student? This action cannot be undone.</p>
            <div class="action-buttons">
                <button onclick="deleteStudent('${studentId}')" class="btn-delete">Yes, Delete</button>
                <button onclick="cancelDelete()" class="btn-cancel">Cancel</button>
            </div>
        </div>
    `;
}

function deleteStudent(studentId) {
    showLoadingAnimation();
    fetch(`${API_BASE_URL}/api/students/${studentId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            showMessage(data.message || 'Student has been deleted successfully.');
            backToSearch();
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage(`Failed to delete student: ${error.message}`, 'error');
        })
        .finally(() => {
            hideLoadingAnimation();
        });
}

function cancelDelete() {
    document.getElementById('deleteSection').style.display = 'none';
}

function backToSearch() {
    document.getElementById('searchResults').style.display = 'grid';
    document.getElementById('updateSection').style.display = 'none';
    document.getElementById('deleteSection').style.display = 'none';
    document.getElementById('messageBox').style.display = 'none';
}

function showMessage(message, type = 'success') {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 5000);
}

function showLoadingAnimation() {
    document.getElementById('loadingAnimation').style.display = 'flex';
}

function hideLoadingAnimation() {
    document.getElementById('loadingAnimation').style.display = 'none';
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});