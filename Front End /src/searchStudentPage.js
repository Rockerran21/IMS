const API_BASE_URL = 'http://localhost:8080';
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeSidebar();
    initializeSearchFunctionality();
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
    const departmentFilter = document.getElementById('departmentFilter');
    const semesterFilter = document.getElementById('semesterFilter');
    const admissionDateFilter = document.getElementById('admissionDateFilter');
    const skillsFilter = document.getElementById('skillsFilter');
    const autoSuggest = document.getElementById('autoSuggest');

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    searchInput.addEventListener('input', handleAutoSuggest);
    autoSuggest.addEventListener('click', handleAutoSuggestClick);
}

function handleAutoSuggest() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const autoSuggest = document.getElementById('autoSuggest');

    if (searchTerm.length < 2) {
        autoSuggest.innerHTML = '';
        return;
    }

    // Simulating a database of student names
    const allStudents = [
        "John Doe", "Jane Smith", "Michael Johnson", "Emily Brown", "David Lee",
        "Sarah Wilson", "Robert Taylor", "Jennifer Davis", "William Anderson", "Lisa Thomas",
        "James Jackson", "Mary White", "Richard Harris", "Patricia Martin", "Charles Thompson",
        "Linda Garcia", "Daniel Martinez", "Elizabeth Robinson", "Joseph Clark", "Margaret Rodriguez",
        "Thomas Lewis", "Barbara Walker", "Christopher Hall", "Susan Allen", "Paul Young",
        "Karen King", "Mark Wright", "Nancy Scott", "George Green", "Karen Adams"
    ];

    const suggestions = allStudents.filter(name =>
        name.toLowerCase().startsWith(searchTerm)
    ).slice(0, 5);

    autoSuggest.innerHTML = suggestions.map(name => `<li>${name}</li>`).join('');
}

function handleAutoSuggestClick(e) {
    if (e.target.tagName === 'LI') {
        document.getElementById('searchInput').value = e.target.textContent;
        document.getElementById('autoSuggest').innerHTML = '';
        performSearch();
    }
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value;
    const department = document.getElementById('departmentFilter').value;
    const semester = document.getElementById('semesterFilter').value;
    const admissionDate = document.getElementById('admissionDateFilter').value;
    const skills = document.getElementById('skillsFilter').value;

    showLoadingAnimation();

    const queryParams = new URLSearchParams({
        query: searchTerm,
        department: department,
        semester: semester,
        admissionDate: admissionDate,
        skills: skills
    });

    const url = `${API_BASE_URL}/api/students/search?${queryParams}`;
    console.log('Fetching from URL:', url); // Log the URL being fetched

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log('Response status:', response.status); // Log the response status
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Received data:', data); // Log the received data
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
            <h3>${student.firstName} ${student.lastName}</h3>
            <p>Email: ${student.email}</p>
            <p>Department: ${student.bachelorSubject || 'N/A'}</p>
            <p>Skills: ${student.skills ? student.skills.map(skill => skill.skillName).join(', ') : 'N/A'}</p>
            <a href="studentDetailsPage.html?id=${student._id}" class="see-more">See More</a>
        `;
        searchResults.appendChild(studentCard);
    });
}

function showLoadingAnimation() {
    document.getElementById('loadingAnimation').style.display = 'block';
}

function hideLoadingAnimation() {
    document.getElementById('loadingAnimation').style.display = 'none';
}