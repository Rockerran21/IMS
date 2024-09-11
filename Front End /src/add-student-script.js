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

    // Sidebar toggle functionality
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const content = document.querySelector('.content');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        content.classList.toggle('expanded');
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    // Multi-step form functionality
    const form = document.getElementById('addStudentForm');
    const steps = Array.from(form.querySelectorAll('.form-step'));
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const progressBar = document.querySelector('.progress');
    let currentStep = 0;

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        prevBtn.style.display = stepIndex === 0 ? 'none' : 'inline-block';
        nextBtn.textContent = stepIndex === steps.length - 1 ? 'Submit' : 'Next';
        updateProgressBar();
    }

    function updateProgressBar() {
        const progress = ((currentStep + 1) / steps.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        } else {
            submitForm();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // Toggle sections functionality
    const toggles = {
        hasEmployment: document.getElementById('hasEmployment'),
        hasCertifications: document.getElementById('hasCertifications'),
        hasProjects: document.getElementById('hasProjects')
    };

    const sections = {
        employmentSection: document.getElementById('employmentSection'),
        certificationsSection: document.getElementById('certificationsSection'),
        projectsSection: document.getElementById('projectsSection')
    };

    Object.keys(toggles).forEach(key => {
        const toggle = toggles[key];
        const section = sections[key.replace('has', '') + 'Section'];

        if (toggle && section) {
            toggle.addEventListener('change', function() {
                section.style.display = this.checked ? 'block' : 'none';
            });
        } else {
            console.warn(`Toggle or section for ${key} not found. Toggle: ${toggle}, Section: ${section}`);
        }
    });

    // Add certification functionality
    const addCertificationBtn = document.getElementById('addCertification');
    const certificationsList = document.getElementById('certificationsList');
    let certificationCount = 0;

    addCertificationBtn.addEventListener('click', () => {
        const certificationHtml = `
            <div class="certification-item">
                <input type="text" name="certifications[${certificationCount}][name]" placeholder="Certification Name" required>
                <input type="text" name="certifications[${certificationCount}][authority]" placeholder="Issuing Authority" required>
                <input type="date" name="certifications[${certificationCount}][date]" required>
                <button type="button" class="remove-certification btn-secondary">Remove</button>
            </div>
        `;
        certificationsList.insertAdjacentHTML('beforeend', certificationHtml);
        certificationCount++;
    });

    certificationsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-certification')) {
            e.target.closest('.certification-item').remove();
        }
    });

    // Add project functionality
    const addProjectBtn = document.getElementById('addProject');
    const projectsList = document.getElementById('projectsList');
    let projectCount = 0;

    addProjectBtn.addEventListener('click', () => {
        const projectHtml = `
            <div class="project-item">
                <input type="text" name="projects[${projectCount}][name]" placeholder="Project Name" required>
                <textarea name="projects[${projectCount}][description]" placeholder="Project Description" required></textarea>
                <button type="button" class="remove-project btn-secondary">Remove</button>
            </div>
        `;
        projectsList.insertAdjacentHTML('beforeend', projectHtml);
        projectCount++;
    });

    projectsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-project')) {
            e.target.closest('.project-item').remove();
        }
    });

    // Photo upload preview
    const photoInput = document.getElementById('profilePhoto');
    const photoPreview = document.getElementById('photoPreview');

    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                photoPreview.innerHTML = `<img src="${e.target.result}" alt="Profile Photo Preview">`;
            }
            reader.readAsDataURL(file);
        }
    });

    // Form submission
    async function submitForm() {
        const formData = new FormData(form);

        // Convert FormData to a plain object
        const studentData = Object.fromEntries(formData.entries());

        // Combine firstName and lastName to create studentName
        const studentName = `${studentData.firstName.trim()} ${studentData.lastName.trim()}`;

        // Handle certifications
        studentData.certifications = [];
        for (let i = 0; i < certificationCount; i++) {
            if (formData.get(`certifications[${i}][name]`)) {
                studentData.certifications.push({
                    certificationName: formData.get(`certifications[${i}][name]`),
                    authority: formData.get(`certifications[${i}][authority]`),
                    date: formData.get(`certifications[${i}][date]`)
                });
            }
        }

        // Handle projects
        studentData.projects = [];
        for (let i = 0; i < projectCount; i++) {
            if (formData.get(`projects[${i}][name]`)) {
                studentData.projects.push({
                    projectName: formData.get(`projects[${i}][name]`),
                    description: formData.get(`projects[${i}][description]`)
                });
            }
        }

        // Handle employment
        studentData.employments = [];
        if (toggles.hasEmployment.checked) {
            studentData.employments.push({
                employerName: formData.get('currentEmployer'),
                jobTitle: formData.get('jobTitle'),
                currentEmployer: true
            });
        }

        // Remove unchecked optional sections
        if (!toggles.hasCertifications.checked) delete studentData.certifications;
        if (!toggles.hasProjects.checked) delete studentData.projects;
        if (!toggles.hasEmployment.checked) delete studentData.employments;

        console.log('Submitting student data:', studentData);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(studentData)
            });

            if (!response.ok) {
                throw new Error('Failed to create student');
            }

            const result = await response.json();
            console.log('Server response:', result);

            // Handle photo upload if a file was selected
            const photoFile = formData.get('profilePhoto');
            let photoURL = '';
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
                    console.warn('Failed to upload photo');
                } else {
                    const photoResult = await photoResponse.json();
                    photoURL = photoResult.photoUrl;  // Assuming your API returns the photo URL
                }
            }

            // Hide the form and display the success message
            form.style.display = 'none';
            const successMessage = document.getElementById('successMessage');
            successMessage.style.display = 'block';

            const successText = document.getElementById('successText');
            const studentSuccessMessage = document.getElementById('studentSuccessMessage');
            const studentPhotoPreview = document.getElementById('studentPhotoPreview');

            studentSuccessMessage.textContent = `${studentName} has been added to the records.`;
            studentPhotoPreview.src = photoURL ? photoURL : 'path/to/default-avatar.png';  // Show a default image if no photo uploaded
            successText.textContent = 'The student was successfully added to the system.';

            // Option to add another student
            const addAnotherStudent = document.getElementById('addAnotherStudent');
            addAnotherStudent.addEventListener('click', () => {
                form.reset();
                successMessage.style.display = 'none';
                form.style.display = 'block';
                currentStep = 0;
                showStep(currentStep);
                photoPreview.innerHTML = '';  // Clear the image preview for the next student
            });

        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to add student. Please try again.');
        }
    }

    // Initialize the form
    showStep(currentStep);
});