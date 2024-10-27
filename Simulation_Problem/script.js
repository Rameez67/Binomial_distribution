// Function to calculate the binomial probability
function binomialProbability(n, k, p) {
    function factorial(x) {
        if (x === 0) return 1;
        let f = 1;
        for (let i = 1; i <= x; i++) {
            f *= i;
        }
        return f;
    }

    let binomialCoefficient = factorial(n) / (factorial(k) * factorial(n - k));
    let probability = binomialCoefficient * Math.pow(p, k) * Math.pow(1 - p, n - k);
    return probability;
}

// Function to calculate and display the pass probability based on user input
function calculatePassAndFailProbability() {
    const totalSubjects = parseInt(document.getElementById('totalSubjects').value);
    const passRate = parseFloat(document.getElementById('passRate').value) / 100;
    const userPassedSubjects = parseInt(document.getElementById('passedSubjects').value); // Get user input for subjects passed

    // Check for valid inputs
    if (isNaN(totalSubjects) || isNaN(passRate) || isNaN(userPassedSubjects) || totalSubjects <= 0 || passRate <= 0 || passRate > 1 || userPassedSubjects < 0 || userPassedSubjects > totalSubjects) {
        alert("Please enter valid values for total subjects, pass rate, and passed subjects.");
        return;
    }

    const passProbabilities = [];
    let passMoreThanFail = 0;

    // Calculate the probabilities for passing more than failing
    for (let k = Math.ceil(totalSubjects / 2); k <= totalSubjects; k++) {
        let prob = binomialProbability(totalSubjects, k, passRate);
        passProbabilities.push(prob);
        passMoreThanFail += prob;
    }

    // Calculate user-passed subjects probability
    let userPassProbability = binomialProbability(totalSubjects, userPassedSubjects, passRate);

    // Update the result on the UI
    document.getElementById('passProbabilityResult').innerText = (passMoreThanFail * 100).toFixed(2) + '%';
    document.getElementById('userPassResult').innerText = `Probability of passing ${userPassedSubjects} subjects: ${(userPassProbability * 100).toFixed(2)}%`;

    // Render the graph
    renderGraph(passProbabilities, totalSubjects);
}

// Function to render the graph using Chart.js
function renderGraph(probabilities, totalSubjects) {
    const ctx = document.getElementById('probabilityChart').getContext('2d');

    // Check if the chart already exists, if so, destroy it before creating a new one
    if (window.probabilityChart && typeof window.probabilityChart.destroy === 'function') {
        window.probabilityChart.destroy();
    }

    // Create the new chart
    window.probabilityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: totalSubjects - Math.ceil(totalSubjects / 2) + 1 }, (_, i) => `Pass ${Math.ceil(totalSubjects / 2) + i}`),  // Adjust this based on pass subjects calculated
            datasets: [{
                label: 'Probability of Passing (%)',
                data: probabilities.map(p => (p * 100).toFixed(2)),  // Convert to percentages
                backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0'],  // Different colors for bars
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: 100  // Maximum set to 100% for percentage
                    }
                }]
            }
        }
    });
}

// Function to save the displayed result as an image
function saveScreenAsImage() {
    const canvas = document.getElementById('probabilityChart');
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'probability_chart.png'; // Download as PNG
    link.click();
}

// Function to save the entire page (results + chart) as a PDF
function saveScreenAsPDF() {
    const resultArea = document.getElementById('outputContainer');
    
    html2canvas(resultArea).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10);
        pdf.save('results.pdf');
    });
}

// Attach event listener to the calculate button
document.getElementById('calculateProbability').addEventListener('click', calculatePassAndFailProbability);

// Attach event listener to the save as image button
document.getElementById('saveImage').addEventListener('click', saveScreenAsImage);

// Attach event listener to the save as PDF button
document.getElementById('savePDF').addEventListener('click', saveScreenAsPDF);
