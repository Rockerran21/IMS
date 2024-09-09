// Frontend/src/visualization.js

let currentChart;

// Function to append messages to the console output in the HTML
function logToConsole(message) {
    const consoleOutput = document.getElementById('consoleOutput');
    consoleOutput.textContent += message + '\n';
}

async function renderChart(faculty) {
    try {
        logToConsole(`Fetching data for faculty: ${faculty}`);

        // Fetch data from the server
        const response = await fetch(`http://localhost:8080/api/visualization/graduationYear/${encodeURIComponent(faculty)}`);

        if (!response.ok) {
            const errorData = await response.json();
            logToConsole(`Error: ${errorData.message}`);
            console.error(`Error fetching data: ${errorData.message}`);
            return;
        }

        const data = await response.json();

        logToConsole(`Fetched data: ${JSON.stringify(data)}`);

        if (!data.labels || data.labels.length === 0) {
            logToConsole(`No data available to display for the selected faculty: ${faculty}`);
            console.error(`No data available to display for the selected faculty: ${faculty}`);
            return;
        }

        // Destroy the previous chart if it exists
        if (currentChart) {
            currentChart.destroy();
            logToConsole('Destroyed previous chart.');
        }

        // Get the canvas context
        const ctx = document.getElementById('graduationYearChart').getContext('2d');

        // Create a new chart instance
        currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: data.label,
                    data: data.values,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        precision: 0
                    }
                }
            }
        });

        logToConsole('Chart rendered successfully.');
    } catch (error) {
        logToConsole(`Error fetching or rendering chart data: ${error}`);
        console.error("Error fetching or rendering chart data:", error);
    }
}

// Event listener to render the chart when faculty is selected
document.getElementById('facultySelect').addEventListener('change', function () {
    const faculty = this.value;
    renderChart(faculty);
});

// Initial chart render for default faculty
document.addEventListener('DOMContentLoaded', () => {
    const defaultFaculty = document.getElementById('facultySelect').value;
    renderChart(defaultFaculty);
});
