document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeCharts();
    fetchAnalyticsData();
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

function initializeCharts() {
    // Enrollment Trend Chart
    new Chart(document.getElementById('enrollmentTrendChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: ['2019', '2020', '2021', '2022', '2023'],
            datasets: [{
                label: 'Number of Students',
                data: [0, 0, 0, 0, 0],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Department Distribution Chart
    new Chart(document.getElementById('departmentDistributionChart').getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['BCS', 'BHM', 'BBA'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }]
        },
        options: {
            responsive: true
        }
    });

    // Gender Distribution Chart
    new Chart(document.getElementById('genderDistributionChart').getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Male', 'Female'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#36A2EB', '#FF6384']
            }]
        },
        options: {
            responsive: true
        }
    });

    // Top 5 Skills Chart
    new Chart(document.getElementById('topSkillsChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4', 'Skill 5'],
            datasets: [{
                label: 'Number of Students',
                data: [0, 0, 0, 0, 0],
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Certification Statistics Chart
    new Chart(document.getElementById('certificationStatsChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Cert 1', 'Cert 2', 'Cert 3', 'Cert 4', 'Cert 5'],
            datasets: [{
                label: 'Number of Students',
                data: [0, 0, 0, 0, 0],
                backgroundColor: 'rgba(153, 102, 255, 0.6)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function fetchAnalyticsData() {
    fetch('http://localhost:8080/api/analytics/analytics-data')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Analytics data received:', data);
            updateChartsWithData(data);
        })
        .catch(error => {
            console.error('Error fetching analytics data:', error);
        });
}

function updateChartsWithData(data) {
    // Update Enrollment Trend Chart
    const enrollmentChart = Chart.getChart('enrollmentTrendChart');
    enrollmentChart.data.labels = data.enrollmentTrend.map(item => item._id);
    enrollmentChart.data.datasets[0].data = data.enrollmentTrend.map(item => item.count);
    enrollmentChart.update();

    // Update Department Distribution Chart
    const departmentChart = Chart.getChart('departmentDistributionChart');
    departmentChart.data.labels = data.departmentDistribution.map(item => item._id);
    departmentChart.data.datasets[0].data = data.departmentDistribution.map(item => item.count);
    departmentChart.update();

    // Update Gender Distribution Chart
    const genderChart = Chart.getChart('genderDistributionChart');
    genderChart.data.labels = data.genderDistribution.map(item => item._id);
    genderChart.data.datasets[0].data = data.genderDistribution.map(item => item.count);
    genderChart.update();

    // Update Top 5 Skills Chart
    console.log('Updating skills chart with:', data.topSkills);
    const skillsChart = Chart.getChart('topSkillsChart');
    skillsChart.data.labels = data.topSkills.map(skill => skill._id);
    skillsChart.data.datasets[0].data = data.topSkills.map(skill => skill.count);
    skillsChart.update();

    // Update Certification Statistics Chart
    const certChart = Chart.getChart('certificationStatsChart');
    certChart.data.labels = data.certificationStats.map(cert => cert._id);
    certChart.data.datasets[0].data = data.certificationStats.map(cert => cert.count);
    certChart.update();

    // Update Employment Rate
    document.getElementById('employmentRate').textContent = `${data.employmentRate}%`;
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    // Add logout logic here
    console.log('Logout clicked');
});