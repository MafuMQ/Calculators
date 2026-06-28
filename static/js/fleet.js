// Fleet Calculator JavaScript

const inputs = {
    distance: document.getElementById('distance'),
    duration: document.getElementById('duration'),
    efficiency: document.getElementById('efficiency'),
    fuel_price: document.getElementById('fuel_price'),
    driver_pay: document.getElementById('driver_pay'),
    car_payment: document.getElementById('car_payment'),
    hours_day: document.getElementById('hours_day'),
    days_week: document.getElementById('days_week')
};

const driver_pay_period = document.getElementById('driver_pay_period');

const displays = {
    distance: document.getElementById('distanceDisplay'),
    duration: document.getElementById('durationDisplay'),
    efficiency: document.getElementById('efficiencyDisplay'),
    fuel_price: document.getElementById('fuelPriceDisplay'),
    driver_pay: document.getElementById('driverPayDisplay'),
    car_payment: document.getElementById('carPaymentDisplay'),
    hours_day: document.getElementById('hoursDayDisplay'),
    days_week: document.getElementById('daysWeekDisplay')
};

// Store actual values (can exceed slider max)
let actualValues = {
    distance: null,
    duration: null,
    efficiency: null,
    fuel_price: null,
    driver_pay: null,
    car_payment: null,
    hours_day: null,
    days_week: null
};

// Return an Intl.NumberFormat for ZAR
const zarFormatter = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
});

function getVal(key) {
    return actualValues[key] !== null ? actualValues[key] : parseFloat(inputs[key].value);
}

function updateDisplays() {
    displays.distance.textContent = getVal('distance').toLocaleString() + " km";
    displays.duration.textContent = getVal('duration').toLocaleString() + " min";
    displays.efficiency.textContent = getVal('efficiency').toLocaleString() + " L/100km";
    displays.fuel_price.textContent = zarFormatter.format(getVal('fuel_price'));
    displays.driver_pay.textContent = zarFormatter.format(getVal('driver_pay'));
    displays.car_payment.textContent = zarFormatter.format(getVal('car_payment'));
    displays.hours_day.textContent = getVal('hours_day').toLocaleString() + " hours";
    displays.days_week.textContent = getVal('days_week').toLocaleString() + " days";
}

function fetchAndRender() {
    updateDisplays();

    const payload = {
        distance: getVal('distance'),
        duration: getVal('duration'),
        efficiency: getVal('efficiency'),
        fuel_price: getVal('fuel_price'),
        driver_pay: getVal('driver_pay'),
        driver_pay_period: driver_pay_period.value,
        car_payment: getVal('car_payment'),
        hours_day: getVal('hours_day'),
        days_week: getVal('days_week')
    };
    
    // Validate numeric fields specifically to avoid isNaN("per_hour")
    const numericFields = [
        payload.distance, payload.duration, payload.efficiency,
        payload.fuel_price, payload.driver_pay, payload.car_payment,
        payload.hours_day, payload.days_week
    ];
    
    if (numericFields.some(v => v === '' || isNaN(v)) || !payload.driver_pay_period) {
        showError('Please fill in all fields correctly.');
        return;
    }
    
    // Hide error
    document.getElementById('error-message').style.display = 'none';
    
    fetch('/calculate-fleet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload)
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
    Plotly.react('graph-pie-container', graphPie.data, graphPie.layout, {responsive: true});
}

function showError(msg) {
    const el = document.getElementById('error-message');
    el.textContent = msg;
    el.style.display = 'block';
}

// Function to make a display element editable
function makeEditable(displayElement, rangeInput, parseFunc, valueKey) {
    displayElement.style.cursor = 'pointer';
    displayElement.title = 'Click to edit';
    
    displayElement.addEventListener('click', function() {
        const currentValue = actualValues[valueKey] !== null ? actualValues[valueKey] : rangeInput.value;
        const originalText = displayElement.textContent;
        
        // Create input element
        const input = document.createElement('input');
        input.type = 'text';
        input.value = Number.isInteger(parseFloat(currentValue)) ? parseInt(currentValue) : parseFloat(currentValue).toFixed(2);
        input.style.width = '100%';
        input.style.padding = '4px';
        input.style.fontSize = 'inherit';
        input.style.fontWeight = 'inherit';
        input.style.border = '2px solid #2563eb';
        input.style.borderRadius = '4px';
        input.style.textAlign = 'center';
        
        // Replace display with input
        displayElement.textContent = '';
        displayElement.appendChild(input);
        input.focus();
        input.select();
        
        // Handle when user finishes editing
        function finishEdit() {
            const newValue = parseFunc(input.value);
            const min = parseFloat(rangeInput.min);
            
            if (!isNaN(newValue) && newValue >= min) {
                // Store the actual value
                actualValues[valueKey] = newValue;
                
                // Update slider to min(newValue, max) for visual feedback
                if (newValue > parseFloat(rangeInput.max)) {
                    rangeInput.value = rangeInput.max;
                } else {
                    rangeInput.value = newValue;
                }
                
                fetchAndRender();
            } else {
                // Invalid input, revert
                displayElement.textContent = originalText;
            }
            
            // Remove input and restore display
            if (displayElement.contains(input)) {
                displayElement.removeChild(input);
            }
        }
        
        input.addEventListener('blur', finishEdit);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                finishEdit();
            }
        });
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                displayElement.textContent = originalText;
                if (displayElement.contains(input)) {
                    displayElement.removeChild(input);
                }
            }
        });
    });
}

// Parse functions
const parseNumber = val => parseFloat(val.replace(/[^0-9.-]/g, ''));

// Apply makeEditable to all numeric inputs
Object.keys(displays).forEach(key => {
    makeEditable(displays[key], inputs[key], parseNumber, key);
});

// Event Listeners for real-time updates on slider change
Object.keys(inputs).forEach(key => {
    inputs[key].addEventListener('input', () => {
        actualValues[key] = null;
        fetchAndRender();
    });
});

// Select dropdown change
driver_pay_period.addEventListener('change', fetchAndRender);

// Initial render when the page loads
document.addEventListener('DOMContentLoaded', fetchAndRender);
