document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
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

    // Initialize dashboard
    initializeDashboard();
});

function initializeDashboard() {
    fetchDashboardData();
    initializeCharts();
    initializeCalendar();
}

function fetchDashboardData() {
    fetch('http://localhost:8080/api/dashboards/dashboard-data')
        .then(response => response.json())
        .then(data => {
            document.querySelector('#total-students p').textContent = data.totalStudents;
            document.querySelector('#total-faculty p').textContent = data.totalFaculty;
            document.querySelector('#courses-offered p').textContent = data.coursesOffered;
            updateCharts(data);
        })
        .catch(error => console.error('Error fetching dashboard data:', error));
}

function initializeCharts() {
    const departmentCtx = document.getElementById('department-chart').getContext('2d');
    window.departmentChart = new Chart(departmentCtx, {
        type: 'bar',
        data: {
            labels: ['BCS', 'BHM', 'BBA'],
            datasets: [{
                label: 'Students by Department',
                data: [332, 421, 40],
                backgroundColor: ['#3498db', '#2ecc71', '#f1c40f']
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Students by Department'
            }
        }
    });

    const genderCtx = document.getElementById('gender-chart').getContext('2d');
    window.genderChart = new Chart(genderCtx, {
        type: 'pie',
        data: {
            labels: ['Male', 'Female'],
            datasets: [{
                data: [555, 238],
                backgroundColor: ['#3498db', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Gender Distribution'
            }
        }
    });
}

function updateCharts(data) {
    window.departmentChart.data.datasets[0].data = [
        data.departmentData.BCS,
        data.departmentData.BHM,
        data.departmentData.BBA
    ];
    window.departmentChart.update();

    window.genderChart.data.datasets[0].data = [
        data.genderData.male,
        data.genderData.female
    ];
    window.genderChart.update();
}

function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: [
            { title: 'Fall Semester Orientation', date: '2024-09-15' },
            { title: 'Alumni Networking Event', date: '2024-10-05' },
            { title: 'Mid-semester Examinations Begin', date: '2024-11-20' }
        ]
    });
    calendar.render();
}