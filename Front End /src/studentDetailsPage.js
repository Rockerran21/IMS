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
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

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
    document.getElementById('studentName').textContent = `${student.firstName} ${student.lastName}`;
    document.getElementById('studentEmail').textContent = student.email;
    document.getElementById('studentDepartment').textContent = student.bachelorSubject;

    const studentPhoto = document.getElementById('studentPhoto');
    studentPhoto.src = `http://localhost:8080/api/students/${student._id}/photo`;
    studentPhoto.alt = `${student.firstName} ${student.lastName}'s photo`;
    studentPhoto.onerror = function() {
        this.src = 'https://media.istockphoto.com/id/610003972/vector/vector-businessman-black-silhouette-isolated.jpg?s=612x612&w=0&k=20&c=Iu6j0zFZBkswfq8VLVW8XmTLLxTLM63bfvI6uXdkacM=';
    };

    console.log('Student data:', student);

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
        <div class="info-item"><strong>Bachelor Subject:</strong> ${student.bachelorSubject}</div>
        <div class="info-item"><strong>High School:</strong> ${student.highSchool}</div>
        <div class="info-item"><strong>Grade 10 School:</strong> ${student.grade10School}</div>
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
    if (certifications && certifications.length > 0) {
        const certificationsHtml = certifications.map(cert => `
            <div class="certification-item">
                <span class="certification-tag">${cert.certificationName}</span>
                <div><strong>Issuer:</strong> ${cert.issuingOrganization}</div>
                <div><strong>Date:</strong> ${new Date(cert.dateObtained).toLocaleDateString()}</div>
            </div>
        `).join('');
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
                <h4>${emp.jobTitle} at ${emp.companyName}</h4>
                <div><strong>Duration:</strong> ${new Date(emp.startDate).toLocaleDateString()} - ${emp.endDate ? new Date(emp.endDate).toLocaleDateString() : 'Present'}</div>
                <div><strong>Description:</strong> ${emp.jobDescription}</div>
            </div>
        `).join('');
        employmentsContainer.innerHTML = employmentsHtml;
    } else {
        employmentsContainer.innerHTML = '<p>No employment history listed.</p>';
    }
}

function displayProjects(projects) {
    const projectsContainer = document.getElementById('projects');
    if (projects && projects.length > 0) {
        const projectsHtml = projects.map(project => `
            <div class="project-item">
                <h4>${project.projectName}</h4>
                <div><strong>Description:</strong> ${project.projectDescription}</div>
                <div><strong>Technologies:</strong> ${project.technologiesUsed.join(', ')}</div>
                <div><strong>Duration:</strong> ${new Date(project.startDate).toLocaleDateString()} - ${project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}</div>
            </div>
        `).join('');
        projectsContainer.innerHTML = projectsHtml;
    } else {
        projectsContainer.innerHTML = '<p>No projects listed.</p>';
    }
}