document.addEventListener('DOMContentLoaded', function() {
    const studentId = new URLSearchParams(window.location.search).get('id');
    if (studentId) {
        fetchStudentDetails(studentId);
    } else {
        console.error('No student ID provided');
    }
});

function fetchStudentDetails(studentId) {
    const apiUrl = `http://localhost:8080/api/students/${studentId}`;
    const token = localStorage.getItem('token');

    fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
            });
        }
        return response.json();
    })
    .then(student => {
        console.log('Fetched student data:', student); // Add this line for debugging
        displayStudentDetails(student);
    })
    .catch(error => {
        console.error('Error fetching student details:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        document.getElementById('content').innerHTML = `
            <p>Error loading student details: ${error.message}</p>
            <p>Please check the console for more information and try again later.</p>
        `;
    });
}
function displayStudentDetails(student) {
    console.log('Received student data:', student); // Add this line for debugging

    document.getElementById('studentName').textContent = `${student.firstName} ${student.lastName}`;
    document.getElementById('studentEmail').textContent = student.email;
    document.getElementById('studentDepartment').textContent = student.bachelorSubject || 'N/A';
    document.getElementById('studentGender').textContent = student.gender || 'Not specified';

    const studentPhoto = document.getElementById('studentPhoto');
    const token = localStorage.getItem('token');
    studentPhoto.src = `http://localhost:8080/api/students/${student._id}/photo`;
    studentPhoto.alt = `${student.firstName} ${student.lastName}'s photo`;
    studentPhoto.onerror = function(e) {
        console.error('Error loading student photo:', e);
        console.error('Failed URL:', this.src);
        fetch(this.src, {
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
            console.error('Fetch error:', error);
            this.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgB730p0ChSl_CNr5N6n05AGzEtEAhFypOFg&s';
        });
    };

    displayPersonalInfo(student);
    displayAcademicInfo(student);
    displaySkills(student.skills);
    displayCertifications(student.certifications);
    displayEmployments(student.employments);
    displayProjects(student.projects);
}

function displayPersonalInfo(student) {
    const personalInfo = document.getElementById('personalInfo');
    personalInfo.innerHTML = `
        <div class="info-item"><strong>First Name:</strong> ${student.firstName}</div>
        <div class="info-item"><strong>Last Name:</strong> ${student.lastName}</div>
        <div class="info-item"><strong>Email:</strong> ${student.email}</div>
    `;
}

function displayAcademicInfo(student) {
    const academicInfo = document.getElementById('academicInfo');
    academicInfo.innerHTML = `
        <div class="info-item"><strong>Bachelor Subject:</strong> ${student.bachelorSubject || 'N/A'}</div>
        <div class="info-item"><strong>High School:</strong> ${student.highSchool || 'N/A'}</div>
        <div class="info-item"><strong>Grade 10 School:</strong> ${student.grade10School || 'N/A'}</div>
    `;
}

function displaySkills(skills) {
    const skillsContainer = document.getElementById('skills');
    if (skills && skills.length > 0) {
        const skillsHtml = skills.map(skill => `<span class="skill-tag">${skill.skillName}</span>`).join('');
        skillsContainer.innerHTML = `<div class="skills-list">${skillsHtml}</div>`;
    } else {
        skillsContainer.innerHTML = '<p>No skills listed.</p>';
    }
}

function displayCertifications(certifications) {
    const certificationsContainer = document.getElementById('certifications');
    console.log('Certifications:', certifications);
    if (certifications && certifications.length > 0) {
        const certificationsHtml = certifications.map(cert => `
            <div class="certification-item">
                <span class="certification-tag">${cert.certificationName}</span>
                <div><strong>Issuer:</strong> ${cert.issuingAuthority}</div>
                <div><strong>Date:</strong> ${new Date(cert.dateObtained).toLocaleDateString()}</div>
            </div>
        `).join('');
        console.log('Certifications HTML:', certificationsHtml);
        certificationsContainer.innerHTML = certificationsHtml;
    } else {
        certificationsContainer.innerHTML = '<p>No certifications listed.</p>';
    }
}

function displayEmployments(employments) {
    const employmentsContainer = document.getElementById('employments');
    if (employments && employments.length > 0) {
        const employmentsHtml = employments.map(emp => `
            <div class="employment-item">
                <h4>${emp.currentField || 'N/A'} at ${emp.employerName}</h4>
                <div><strong>Current Employer:</strong> ${emp.currentEmployer ? 'Yes' : 'No'}</div>
            </div>
        `).join('');
        employmentsContainer.innerHTML = employmentsHtml;
    } else {
        employmentsContainer.innerHTML = '<p>No employment history listed.</p>';
    }
}

function displayProjects(projects) {
    const projectsContainer = document.getElementById('projectsContainer');
    if (projects && projects.length > 0) {
        const projectsList = projects.map(project => `
            <div class="project-item">
                <h4>${project.projectName}</h4>
                <p>${project.description || 'No description available.'}</p>
            </div>
        `).join('');
        projectsContainer.innerHTML = projectsList;
    } else {
        projectsContainer.innerHTML = '<p>No projects available.</p>';
    }
}