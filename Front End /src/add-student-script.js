function initializePhotoUpload() {
    const uploadBtn = document.getElementById('uploadPhotoBtn');
    const fileInput = document.getElementById('profilePhoto');

    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', function() {
            fileInput.click();
        });

        fileInput.addEventListener('change', handlePhotoUpload);
    } else {
        console.error('Upload button or file input not found');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeForm();
    initializeDynamicFields();
    initializePhotoUpload();
});

function initializeTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    let currentTab = 0;

    function showTab(index) {
        tabs.forEach(tab => tab.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));
        tabs[index].classList.add('active');
        contents[index].classList.add('active');

        prevBtn.style.display = index === 0 ? 'none' : 'inline-block';
        if (index === tabs.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
        } else {
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        }
    }
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            currentTab = index;
            showTab(currentTab);
        });
    });

    prevBtn.addEventListener('click', () => {
        currentTab = Math.max(0, currentTab - 1);
        showTab(currentTab);
    });

    nextBtn.addEventListener('click', () => {
        currentTab = Math.min(tabs.length - 1, currentTab + 1);
        showTab(currentTab);
    });

    showTab(currentTab);
}

function initializeForm() {
    const form = document.getElementById('addStudentForm');
    form.addEventListener('submit', handleSubmit);

    const photoInput = document.getElementById('profilePhoto');
    photoInput.addEventListener('change', handlePhotoUpload);
}

function initializeDynamicFields() {
    document.getElementById('addCertification').addEventListener('click', () => addDynamicField('certifications'));
    document.getElementById('addEmployment').addEventListener('click', () => addDynamicField('employments'));
    document.getElementById('addProject').addEventListener('click', () => addDynamicField('projects'));
}

function addDynamicField(type) {
    const container = document.getElementById(`${type}Container`);
    const index = container.children.length;
    let html = '';

    switch(type) {
        case 'certifications':
            html = `
                <div class="certification-item">
                    <div class="form-group">
                        <input type="text" name="${type}[${index}].certificationName" required>
                        <label>Certification Name</label>
                    </div>
                    <div class="form-group">
                        <input type="text" name="${type}[${index}].issuingAuthority">
                        <label>Issuing Authority</label>
                    </div>
                    <div class="form-group">
                        <input type="date" name="${type}[${index}].dateObtained">
                        <label>Date Obtained</label>
                    </div>
                </div>
            `;
            break;
        case 'employments':
            html = `
                <div class="employment-item">
                    <div class="form-group">
                        <input type="text" name="${type}[${index}].employerName" required>
                        <label>Employer Name</label>
                    </div>
                    <div class="form-group">
                        <input type="checkbox" name="${type}[${index}].currentEmployer">
                        <label>Current Employer</label>
                    </div>
                    <div class="form-group">
                        <input type="text" name="${type}[${index}].currentField">
                        <label>Current Field</label>
                    </div>
                </div>
            `;
            break;
        case 'projects':
            html = `
                <div class="project-item">
                    <div class="form-group">
                        <input type="text" name="${type}[${index}].projectName" required>
                        <label>Project Name</label>
                    </div>
                    <div class="form-group">
                        <textarea name="${type}[${index}].description"></textarea>
                        <label>Description</label>
                    </div>
                </div>
            `;
            break;
    }

    container.insertAdjacentHTML('beforeend', html);
}

async function handleSubmit(e) {
    e.preventDefault();
    showLoadingAnimation();

    const formData = new FormData(e.target);
    const studentData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        bachelorSubject: formData.get('bachelorSubject'),
        highSchool: formData.get('highSchool'),
        grade10School: formData.get('grade10School'),
        certifications: [],
        employments: [],
        projects: []
    };

    // Process certifications
    const certifications = formData.getAll('certifications[0].certificationName').map((_, index) => ({
        certificationName: formData.get(`certifications[${index}].certificationName`),
        issuingAuthority: formData.get(`certifications[${index}].issuingAuthority`),
        dateObtained: formData.get(`certifications[${index}].dateObtained`)
    })).filter(cert => cert.certificationName);
    studentData.certifications = certifications;

    // Process employments
    const employments = formData.getAll('employments[0].employerName').map((_, index) => ({
        employerName: formData.get(`employments[${index}].employerName`),
        currentEmployer: formData.get(`employments[${index}].currentEmployer`) === 'on',
        currentField: formData.get(`employments[${index}].currentField`)
    })).filter(emp => emp.employerName);
    studentData.employments = employments;

    // Process projects
    const projects = formData.getAll('projects[0].projectName').map((_, index) => ({
        projectName: formData.get(`projects[${index}].projectName`),
        description: formData.get(`projects[${index}].description`)
    })).filter(proj => proj.projectName);
    studentData.projects = projects;

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found. Please log in.');
        }

        // First, create the student
        const response = await fetch('http://localhost:8080/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(studentData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add student');
        }

        const result = await response.json();

        // Now, upload the photo if one was selected
        const photoFile = formData.get('profilePhoto');
        if (photoFile && photoFile.size > 0) {
            const photoFormData = new FormData();
            photoFormData.append('photoUpload', photoFile);

            const photoResponse = await fetch(`http://localhost:8080/api/students/${result._id}/photo`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: photoFormData
            });

            if (!photoResponse.ok) {
                console.error('Failed to upload photo');
                throw new Error('Failed to upload photo');
            }
        }

        alert('Student added successfully!');
        e.target.reset();
        document.getElementById('photoPreview').innerHTML = '';
        // Reset dynamic fields
        ['certificationsContainer', 'employmentsContainer', 'projectsContainer'].forEach(containerId => {
            document.getElementById(containerId).innerHTML = '';
        });
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Failed to add student. Please try again.');
    } finally {
        hideLoadingAnimation();
    }
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('photoPreview');
    preview.innerHTML = '';

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '200px';
            img.style.maxHeight = '200px';
            preview.appendChild(img);
        }
        reader.readAsDataURL(file);
    }
}

function showLoadingAnimation() {
    document.getElementById('loadingAnimation').style.display = 'flex';
}

function hideLoadingAnimation() {
    document.getElementById('loadingAnimation').style.display = 'none';
}