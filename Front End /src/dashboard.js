document.getElementById('faculty').addEventListener('change', async function() {
    const faculty = this.value;

    // Fetch and update the charts
    const graduationYearData = await fetchData(`/api/visualization/graduationYear/${faculty}`);
    updateChart('graduationYearChart', graduationYearData);

    const jobRoleData = await fetchData(`/api/visualization/jobRole/${faculty}`);
    updateChart('jobRoleChart', jobRoleData);

    const currentEmployerData = await fetchData(`/api/visualization/currentEmployer/${faculty}`);
    updateChart('currentEmployerChart', currentEmployerData);

    const skillsObtainedData = await fetchData(`/api/visualization/skillsObtained/${faculty}`);
    updateChart('skillsObtainedChart', skillsObtainedData);

    // Add more fetch and update calls for additional charts
});

async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function updateChart(chartId, data) {
    const ctx = document.getElementById(chartId).getContext('2d');
    new Chart(ctx, {
        type: 'bar', // Use 'bar', 'pie', 'line' based on the data
        data: {
            labels: data.labels,
            datasets: [{
                label: data.label,
                data: data.values,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
