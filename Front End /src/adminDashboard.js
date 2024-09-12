// File: adminDashboard.js

document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeSidebar();
    initializeLogout();
    initializeDashboard();
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

function initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Add logout logic here
            alert('Logout functionality to be implemented');
        });
    } else {
        console.error('Logout button not found');
    }
}

function initializeDashboard() {
    initializeSummaryCards();
    initializeCharts();
    initializeCalendar();
    fetchDashboardData();
}

function initializeSummaryCards() {
    const summaryCards = {
        totalStudents: document.querySelector('#total-students p'),
        totalFaculty: document.querySelector('#total-faculty p'),
        coursesOffered: document.querySelector('#courses-offered p')
    };

    if (summaryCards.totalStudents && summaryCards.totalFaculty && summaryCards.coursesOffered) {
        summaryCards.totalStudents.textContent = 'No data available';
        summaryCards.totalFaculty.textContent = 'No data available';
        summaryCards.coursesOffered.textContent = 'No data available';
    } else {
        console.error('Summary card elements not found');
    }
}

function initializeCharts() {
    initializeDepartmentChart();
    initializeGenderChart();
    initializeEnrollmentTrendChart();
}

function initializeDepartmentChart() {
    const departmentCtx = document.getElementById('department-chart');
    if (departmentCtx) {
        window.departmentChart = new Chart(departmentCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['BCS', 'BHM', 'BBA'],
                datasets: [{
                    label: 'Students by Department',
                    data: [0, 0, 0],
                    backgroundColor: ['#3498db', '#2ecc71', '#f1c40f']
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Students by Department'
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else {
        console.error('Department chart canvas element not found');
    }
}

function initializeGenderChart() {
    const genderCtx = document.getElementById('gender-chart');
    if (genderCtx) {
        window.genderChart = new Chart(genderCtx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Male', 'Female'],
                datasets: [{
                    data: [0, 0],
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
    } else {
        console.error('Gender chart canvas element not found');
    }
}

function initializeEnrollmentTrendChart() {
    const enrollmentTrendCtx = document.getElementById('enrollment-trend-chart');
    if (enrollmentTrendCtx) {
        window.enrollmentTrendChart = new Chart(enrollmentTrendCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['2020', '2021', '2022', '2023', '2024'],
                datasets: [{
                    label: 'Student Enrollment',
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: '#9b59b6'
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Student Enrollment Trend'
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else {
        console.error('Enrollment trend chart canvas element not found');
    }
}

function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: [
                { title: 'Fall Semester Orientation', date: '2024-09-15' },
                { title: 'Alumni Networking Event', date: '2024-10-05' },
                { title: 'Mid-semester Examinations Begin', date: '2024-11-20' }
            ],
            eventClick: function(info) {
                alert('Event: ' + info.event.title);
            }
        });
        calendar.render();
        updateUpcomingEvents(calendar.getEvents());
    } else {
        console.error('Calendar element not found');
    }
}

function updateUpcomingEvents(events) {
    const eventsList = document.getElementById('events-list');
    if (eventsList) {
        eventsList.innerHTML = '';
        const now = new Date();
        const upcomingEvents = events
            .filter(event => event.start >= now)
            .sort((a, b) => a.start - b.start)
            .slice(0, 5);

        upcomingEvents.forEach(event => {
            const li = document.createElement('li');
            li.textContent = `${event.title} - ${event.start.toLocaleDateString()}`;
            eventsList.appendChild(li);
        });
    } else {
        console.error('Events list element not found');
    }
}

function showLoadingIndicators() {
    const loadingElements = document.querySelectorAll('.loading-indicator');
    loadingElements.forEach(el => el.style.display = 'block');
}

function hideLoadingIndicators() {
    const loadingElements = document.querySelectorAll('.loading-indicator');
    loadingElements.forEach(el => el.style.display = 'none');
}

function fetchDashboardData() {
    showLoadingIndicators();

    // Simulating API call with setTimeout
    setTimeout(() => {
        const mockData = {
            totalStudents: 793,
            totalFaculty: 3,
            coursesOffered: 50,
            departmentData: {
                BCS: 332,
                BHM: 421,
                BBA: 40
            },
            genderData: {
                male: 555,
                female: 238
            },
            enrollmentTrend: {
                '2020': 650,
                '2021': 700,
                '2022': 750,
                '2023': 780,
                '2024': 793
            }
        };
        updateDashboardWithData(mockData);
        hideLoadingIndicators();
    }, 1000);

    // When you're ready to fetch real data, use this:
    /*
    fetch('http://your-api-endpoint/dashboard-data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            updateDashboardWithData(data);
        })
        .catch(error => {
            console.error('Error fetching dashboard data:', error);
            // Keep the "No data available" display if fetch fails
        })
        .finally(() => {
            hideLoadingIndicators();
        });
    */
}

function updateDashboardWithData(data) {
    updateSummaryCards(data);
    updateCharts(data);
}

function updateSummaryCards(data) {
    const summaryCards = {
        totalStudents: document.querySelector('#total-students p'),
        totalFaculty: document.querySelector('#total-faculty p'),
        coursesOffered: document.querySelector('#courses-offered p')
    };

    if (summaryCards.totalStudents && summaryCards.totalFaculty && summaryCards.coursesOffered) {
        summaryCards.totalStudents.textContent = data.totalStudents || 'No data available';
        summaryCards.totalFaculty.textContent = data.totalFaculty || 'No data available';
        summaryCards.coursesOffered.textContent = data.coursesOffered || 'No data available';
    } else {
        console.error('Summary card elements not found');
    }
}

function updateCharts(data) {
    if (window.departmentChart && data.departmentData) {
        window.departmentChart.data.datasets[0].data = [
            data.departmentData.BCS || 332,
            data.departmentData.BHM || 421,
            data.departmentData.BBA || 40
        ];
        window.departmentChart.update();
    }

    if (window.genderChart && data.genderData) {
        window.genderChart.data.datasets[0].data = [
            data.genderData.male || 555,
            data.genderData.female || 238
        ];
        window.genderChart.update();
    }

    if (window.enrollmentTrendChart && data.enrollmentTrend) {
        window.enrollmentTrendChart.data.datasets[0].data = [
            data.enrollmentTrend['2020'] || 650,
            data.enrollmentTrend['2021'] || 700,
            data.enrollmentTrend['2022'] || 750,
            data.enrollmentTrend['2023'] || 780,
            data.enrollmentTrend['2024'] || 720
        ];
        window.enrollmentTrendChart.update();
    }
}