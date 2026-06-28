// Fleet Calculator JavaScript

function fetchAndRender() {
    const inputs = {
        distance: document.getElementById('distance').value,
        duration: document.getElementById('duration').value,
        efficiency: document.getElementById('efficiency').value,
        fuel_price: document.getElementById('fuel_price').value,
        driver_pay: document.getElementById('driver_pay').value,
        driver_pay_period: document.getElementById('driver_pay_period').value,
        car_payment: document.getElementById('car_payment').value,
        hours_day: document.getElementById('hours_day').value,
        days_week: document.getElementById('days_week').value
    };
    
    // Validate
    if (Object.values(inputs).some(v => v === '' || v === null)) {
        showError('Please fill in all fields.');
        return;
    }
    
    // Hide error
    document.getElementById('error-message').style.display = 'none';
    
    fetch('/calculate-fleet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(inputs)
    }).then(res => res.json())
      .then(data => {
          if (data.success) {
              renderGraphs(data);
          } else {
              showError(data.error);
          }
      }).catch(err => {
          console.error('Error:', err);
          showError('An unexpected error occurred. Please check your inputs.');
      });
}

function renderGraphs(data) {
    document.getElementById('total-cost-text').textContent = data.total_text;
    
    const graphPie = JSON.parse(data.graph_pie);
    
    // Plotly.react is faster than newPlot for updating existing charts
    Plotly.react('graph-pie-container', graphPie.data, graphPie.layout, {responsive: true});
}

function showError(msg) {
    const el = document.getElementById('error-message');
    el.textContent = msg;
    el.style.display = 'block';
}

// Event Listeners for real-time updates
const inputIds = [
    'distance', 'duration', 'efficiency', 'fuel_price', 
    'driver_pay', 'driver_pay_period', 'car_payment', 'hours_day', 'days_week'
];

inputIds.forEach(id => {
    document.getElementById(id).addEventListener('input', fetchAndRender);
    document.getElementById(id).addEventListener('change', fetchAndRender);
});

// Initial render when the page loads
document.addEventListener('DOMContentLoaded', fetchAndRender);
