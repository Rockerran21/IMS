document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeForm();
    initializeDynamicFields();
    initializePhotoUpload();
    initializeSelectFields();
    initializeDatePickers();
});

function initializeDatePickers() {
    flatpickr('.date-picker', {
        dateFormat: 'Y-m-d',
    });
}

function initializeForm() {
    const form = document.getElementById('addStudentForm');
    form.addEventListener('submit', handleSubmit);

    const photoInput = document.getElementById('profilePhoto');
    photoInput.addEventListener('change', handlePhotoUpload);

    initializeSelectFields();
}

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
                        <input type="text" name="${type}[${index}][certificationName]" required>
                        <label>Certification Name</label>
                    </div>
                    <div class="form-group">
                        <input type="text" name="${type}[${index}][issuingAuthority]" required>
                        <label>Issuing Authority</label>
                    </div>
                    <div class="form-group">
                        <input type="text" name="${type}[${index}][dateObtained]" class="date-picker" required>
                        <label>Date Obtained</label>
                    </div>
                </div>
            `;
            break;
        case 'employments':
            html = `
                <div class="employment-item">
                    <div class="form-group">
                        <input type="text" name="${type}[${index}][employerName]" required placeholder=" ">
                        <label>Employer Name</label>
                    </div>
                    <div class="form-group">
                        <input type="text" name="${type}[${index}][title]" required placeholder=" ">
                        <label>Title</label>
                    </div>
                    <div class="form-group">
                        <select name="${type}[${index}][currentlyEmployed]" required>
                            <option value="" disabled selected hidden></option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                        <label>Currently Employed</label>
                    </div>
                </div>
            `;
            break;
        case 'projects':
            html = `
                <div class="project-item">
                    <div class="form-group">
                        <input type="text" name="${type}[${index}][projectName]" required>
                        <label>Project Name</label>
                    </div>
                    <div class="form-group">
                        <textarea name="${type}[${index}][description]" required></textarea>
                        <label>Description</label>
                    </div>
                </div>
            `;
            break;
    }

    container.insertAdjacentHTML('beforeend', html);

    if (type === 'certifications') {
        flatpickr(container.querySelectorAll('.date-picker'), {
            dateFormat: 'Y-m-d',
        });
    }
}

async function handleSubmit(e) {
    e.preventDefault();
    showLoadingAnimation();

    const formData = new FormData(e.target);
    const studentData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        gender: formData.get('gender'),
        bachelorSubject: formData.get('bachelorSubject'),
        dateOfEnrollment: formData.get('dateOfEnrollment'),
        currentSemester: formData.get('currentSemester'),
        highSchool: formData.get('highSchool'),
        grade10School: formData.get('grade10School'),
        certifications: [],
        employments: [],
        projects: []
    };

    const certificationItems = document.querySelectorAll('.certification-item');
    certificationItems.forEach((item, index) => {
        const certificationName = formData.get(`certifications[${index}][certificationName]`);
        if (certificationName) {
            studentData.certifications.push({
                certificationName: certificationName,
                issuingAuthority: formData.get(`certifications[${index}][issuingAuthority]`),
                dateObtained: formData.get(`certifications[${index}][dateObtained]`)
            });
        }
    });

    const employmentItems = document.querySelectorAll('.employment-item');
    employmentItems.forEach((item, index) => {
        const employerName = formData.get(`employments[${index}][employerName]`);
        if (employerName) {
            studentData.employments.push({
                employerName: employerName,
                title: formData.get(`employments[${index}][title]`),
                currentEmployer: formData.get(`employments[${index}][currentEmployer]`) === 'on'
            });
        }
    });

    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach((item, index) => {
        const projectName = formData.get(`projects[${index}][projectName]`);
        if (projectName) {
            studentData.projects.push({
                projectName: projectName,
                description: formData.get(`projects[${index}][description]`)
            });
        }
    });

    console.log('Submitting student data:', studentData);

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found. Please log in.');
        }

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

        showSuccessModal(studentData.firstName, photoFile);

        e.target.reset();
        document.getElementById('photoPreview').innerHTML = '';
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

function showLoadingAnimation() {
    document.getElementById('loadingAnimation').style.display = 'flex';
}

function hideLoadingAnimation() {
    document.getElementById('loadingAnimation').style.display = 'none';
}

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

function initializeSelectFields() {
    const selectElements = document.querySelectorAll('.form-group select');
    selectElements.forEach(select => {
        const parentFormGroup = select.parentElement;
        const checkValue = () => {
            if (select.value && select.value !== '') {
                parentFormGroup.classList.add('select-filled');
            } else {
                parentFormGroup.classList.remove('select-filled');
            }
        };
        select.addEventListener('change', checkValue);
        checkValue();
    });
}

function showSuccessModal(studentName, photoFile) {
    const modal = document.getElementById('successModal');
    const studentNamePlaceholder = document.getElementById('studentNamePlaceholder');
    const studentPhotoPreview = document.getElementById('studentPhotoPreview');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOkBtn = document.getElementById('modalOkBtn');

    studentNamePlaceholder.textContent = studentName;

    if (photoFile && photoFile.size > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            studentPhotoPreview.innerHTML = '';
            const img = document.createElement('img');
            img.src = e.target.result;
            studentPhotoPreview.appendChild(img);
        }
        reader.readAsDataURL(photoFile);
    } else {
        studentPhotoPreview.innerHTML = '<p>No photo available.</p>';
    }

    modal.style.display = 'block';

    const closeModal = () => {
        modal.style.display = 'none';
        studentPhotoPreview.innerHTML = '';
    };

    closeModalBtn.onclick = closeModal;
    modalOkBtn.onclick = closeModal;

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    };
}
