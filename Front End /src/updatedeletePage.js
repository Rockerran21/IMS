const API_BASE_URL = 'http://localhost:8080';
const RESULTS_PER_PAGE = 9; 

document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeSidebar();
    initializeSearchFunctionality();
    initializeDatePickers();
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
    document.getElementById('searchResultsContainer').style.display = 'none';
    const searchTerm = document.getElementById('searchInput').value;
    
    // Check if filter elements exist before accessing their values
    const department = document.getElementById('departmentFilter')?.value || '';
    const semester = document.getElementById('semesterFilter')?.value || '';
    const admissionDate = document.getElementById('admissionDateFilter')?.value || '';
    const gender = document.getElementById('genderFilter')?.value || '';

    showLoadingAnimation();

    currentPage = 1;
    totalResults = 0;
    allResults = [];

    const queryParams = new URLSearchParams({
        query: searchTerm,
        department: department,
        semester: semester,
        admissionDate: admissionDate,
        gender: gender
    });

    const url = `${API_BASE_URL}/api/students/search?${queryParams}`;
    console.log('Fetching from URL:', url);

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Received data:', data);
        if (Array.isArray(data)) {
            allResults = data;
            totalResults = data.length;
            displaySearchResults();
        } else {
            console.error('Unexpected response format:', data);
            throw new Error('Unexpected response format');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('searchResults').innerHTML = `<p>An error occurred while searching: ${error.message}</p>`;
    })
    .finally(() => {
        hideLoadingAnimation();
    });
}

function displaySearchResults() {
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const searchResults = document.getElementById('searchResults');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (currentPage === 1) {
        searchResults.innerHTML = '';
        searchResultsContainer.style.display = 'block';
        window.scrollTo(0, searchResultsContainer.offsetTop);
    }

    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
    const endIndex = Math.min(startIndex + RESULTS_PER_PAGE, totalResults);
    const resultsToDisplay = allResults.slice(startIndex, endIndex);

    resultsToDisplay.forEach(student => {
        const studentCard = document.createElement('div');
        studentCard.className = 'student-card';
        studentCard.innerHTML = `
            <h3>${student.firstName} ${student.lastName}</h3>
            <p><i class="fas fa-envelope"></i> ${student.email}</p>
            <p><i class="fas fa-graduation-cap"></i> ${student.bachelorSubject || 'N/A'}</p>
            <p><i class="fas fa-venus-mars"></i> ${student.gender || 'N/A'}</p>
            <button onclick="viewStudentDetails('${student._id}')" class="see-more">Update/Delete</button>
        `;
        searchResults.appendChild(studentCard);
    });

    if (endIndex < totalResults) {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.onclick = loadMoreResults;
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

function loadMoreResults() {
    currentPage += 1;
    displaySearchResults();
}

function viewStudentDetails(studentId) {
    currentStudentId = studentId;
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
            document.querySelector('.search-and-filters').style.display = 'none';
            document.getElementById('searchResultsContainer').style.display = 'none';
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
                    <div>
                        <label for="firstName">First Name</label>
                        <input type="text" id="firstName" name="firstName" value="${student.firstName}" required>
                    </div>
                    <div>
                        <label for="lastName">Last Name</label>
                        <input type="text" id="lastName" name="lastName" value="${student.lastName}" required>
                    </div>
                    <div>
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" value="${student.email}" required>
                    </div>
                    <div>
                        <label for="gender">Gender</label>
                        <select id="gender" name="gender" required>
                            <option value="male" ${student.gender === 'male' ? 'selected' : ''}>Male</option>
                            <option value="female" ${student.gender === 'female' ? 'selected' : ''}>Female</option>
                            <option value="other" ${student.gender === 'other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <div>
                        <label for="bachelorSubject">Bachelor Subject</label>
                        <input type="text" id="bachelorSubject" name="bachelorSubject" value="${student.bachelorSubject || ''}" required>
                    </div>
                    <div>
                        <label for="currentSemester">Current Semester</label>
                        <input type="number" id="currentSemester" name="currentSemester" value="${student.currentSemester || ''}" required>
                    </div>
                    <div>
                        <label for="dateOfEnrollment">Admission Date</label>
                        <input type="text" id="dateOfEnrollment" name="dateOfEnrollment" class="date-picker" value="${student.dateOfEnrollment ? new Date(student.dateOfEnrollment).toISOString().split('T')[0] : ''}" required>
                    </div>
                </div>
                <div class="input-group profile-photo-section">
                    <div>
                        <label for="profilePhoto">Profile Photo</label>
                        <img id="profilePhotoPreview" alt="Profile Photo Preview">
                        <input type="file" id="profilePhoto" name="profilePhoto" accept="image/*" onchange="previewProfilePhoto(this)">
                    </div>
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
                <button type="button" id="prevBtn" class="btn-secondary" onclick="navigateForm(-1)">Previous</button>
                <button type="button" id="nextBtn" class="btn-primary" onclick="navigateForm(1)">Next</button>
            </div>
        </form>
        <div class="action-buttons">
            <button type="button" class="btn-primary" onclick="showUpdateConfirmation('${student._id}')">Update</button>
            <button type="button" class="btn-danger" onclick="showDeleteConfirmation('${student._id}')">Delete</button>
            <button type="button" class="btn-secondary" onclick="backToSearch()">Back to Search</button>
        </div>
    `;

    populateCertifications(student.certifications || []);
    populateEmployments(student.employments || []);
    populateProjects(student.projects || []);
    currentStep = 0;
    navigateForm(0);
    initializeDatePickers();
    loadStudentPhoto(student._id);
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
            <button type="button" class="btn-danger" onclick="removeCertification(this)">Remove</button>
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
            <input type="text" name="employments[${index}][title]" value="${emp.title || ''}" placeholder="Job Title" required>
            <input type="text" name="employments[${index}][currentField]" value="${emp.currentField || ''}" placeholder="Current Field">
            <label>
                <input type="checkbox" name="employments[${index}][currentEmployer]" ${emp.currentEmployer ? 'checked' : ''}>
                Current Employer
            </label>
            <button type="button" class="btn-danger" onclick="removeEmployment(this)">Remove</button>
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
            title: item.querySelector('input[name$="[title]"]').value || 'Not specified',
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
            <button type="button" class="btn-danger" onclick="removeProject(this)">Remove</button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', projHtml);
}

function removeProject(button) {
    button.closest('.project-item').remove();
}

function showUpdateConfirmation(studentId) {
    const modal = document.getElementById('updateConfirmModal');
    modal.style.display = 'block';
    
    document.getElementById('confirmUpdateBtn').onclick = function() {
        modal.style.display = 'none';
        updateStudent(studentId);
    };
    
    document.getElementById('cancelUpdateBtn').onclick = function() {
        modal.style.display = 'none';
    };
}

function updateStudent(studentId) {
    const form = document.getElementById('updateForm');
    const formData = new FormData(form);
    const updatedStudent = {};

    formData.forEach((value, key) => {
        if (value !== '') {
            updatedStudent[key] = value;
        }
    });

    showLoadingAnimation();

    fetch(`${API_BASE_URL}/api/students/${studentId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedStudent)
    })
    .then(response => response.json())
    .then(async (result) => {
        console.log('Success:', result);

        // Handle photo upload
        const photoFile = formData.get('profilePhoto');
        if (photoFile && photoFile.size > 0) {
            const photoFormData = new FormData();
            photoFormData.append('photoUpload', photoFile);

            await fetch(`${API_BASE_URL}/api/students/${studentId}/photo`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: photoFormData
            });
        }

        showSuccessMessage(`Student ${result.firstName} ${result.lastName} has been updated successfully.`);
    })
    .catch((error) => {
        console.error('Error:', error);
        showMessage('Failed to update student. Please try again.', 'error');
    })
    .finally(() => {
        hideLoadingAnimation();
    });
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
            dateObtained: item.querySelector('input[name$="[date]"]').value || new Date().toISOString().split('T')[0]
        });
    }
    return certifications;
}

function showDeleteConfirmation(studentId) {
    const modal = document.getElementById('deleteConfirmModal');
    modal.style.display = 'block';
    
    document.getElementById('confirmDeleteBtn').onclick = function() {
        modal.style.display = 'none';
        deleteStudent(studentId);
    };
    
    document.getElementById('cancelDeleteBtn').onclick = function() {
        modal.style.display = 'none';
    };
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

function backToSearch() {
    const searchResults = document.getElementById('searchResults');
    const updateSection = document.getElementById('updateSection');
    const deleteSection = document.getElementById('deleteSection');
    const messageBox = document.getElementById('messageBox');

    if (searchResults) searchResults.style.display = 'grid';
    if (updateSection) updateSection.style.display = 'none';
    if (deleteSection) deleteSection.style.display = 'none';
    if (messageBox) messageBox.style.display = 'none';
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

function initializeDatePickers() {
    flatpickr('.date-picker', {
        dateFormat: 'Y-m-d',
    });
}

function showSuccessMessage(message) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.className = 'message-box success';
    messageBox.style.display = 'block';
    messageBox.style.position = 'fixed';
    messageBox.style.top = '50%';
    messageBox.style.left = '50%';
    messageBox.style.transform = 'translate(-50%, -50%)';
    messageBox.style.zIndex = '1000';
    
    setTimeout(() => {
        messageBox.style.display = 'none';
        backToSearch();
    }, 3000);
}

function previewProfilePhoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePhotoPreview').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function loadStudentPhoto(studentId) {
    const profilePhotoPreview = document.getElementById('profilePhotoPreview');
    const token = localStorage.getItem('token');
    
    profilePhotoPreview.src = `${API_BASE_URL}/api/students/${studentId}/photo`;
    profilePhotoPreview.onerror = function() {
        fetch(`${API_BASE_URL}/api/students/${studentId}/photo`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.blob();
        })
        .then(blob => {
            const objectURL = URL.createObjectURL(blob);
            this.src = objectURL;
        })
        .catch(error => {
            console.error('Error loading student photo:', error);
            this.src = '../assets/default-avatar.png';
        });
    };
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});