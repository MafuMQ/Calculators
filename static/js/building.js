// Building Calculator JavaScript
// Get Elements
const costInput = document.getElementById('cost');
const unitsInput = document.getElementById('units');
const yearsInput = document.getElementById('years');
const currencySelect = document.getElementById('currency');

const costDisplay = document.getElementById('costDisplay');
const unitsDisplay = document.getElementById('unitsDisplay');
const yearsDisplay = document.getElementById('yearsDisplay');
const resultDisplay = document.getElementById('result');
const annualPerUnitDisplay = document.getElementById('annualPerUnit');
const totalMonthlyDisplay = document.getElementById('totalMonthly');
const minCostLabel = document.getElementById('minCostLabel');
const maxCostLabel = document.getElementById('maxCostLabel');

// Store actual values (can exceed slider max)
let actualValues = {
    cost: null,
    units: null,
    years: null
};

// Return an Intl.NumberFormat for the chosen currency
function getFormatter(currency) {
    let locale = 'en-US';
    switch (currency) {
        case 'ZAR': locale = 'en-ZA'; break;
        case 'EUR': locale = 'de-DE'; break;
        case 'GBP': locale = 'en-GB'; break;
        case 'USD': locale = 'en-US'; break;
        default: locale = 'en-US';
    }
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
    });
}

function calculate() {
    // Get values - use actual values if set, otherwise use slider values
    const cost = actualValues.cost !== null ? actualValues.cost : parseFloat(costInput.value);
    const units = actualValues.units !== null ? actualValues.units : parseFloat(unitsInput.value);
    const years = actualValues.years !== null ? actualValues.years : parseFloat(yearsInput.value);
    const currency = (currencySelect && currencySelect.value) ? currencySelect.value : 'ZAR';
    const currencyFormat = getFormatter(currency);

    // Update Labels
    costDisplay.textContent = currencyFormat.format(cost);
    unitsDisplay.textContent = units.toLocaleString();
    yearsDisplay.textContent = years + (years === 1 ? " Year" : " Years");

    // Update min/max range labels to reflect currency
    if (minCostLabel && maxCostLabel) {
        const min = parseInt(costInput.min, 10);
        const max = parseInt(costInput.max, 10);
        minCostLabel.textContent = currencyFormat.format(min);
        maxCostLabel.textContent = currencyFormat.format(max);
    }

    // Calculate Logic: Cost / (Units * Years * 12)
    const totalMonths = years * 12;
    const totalPayerMonths = units * totalMonths;
    
    let monthlyRent = 0;
    if (totalPayerMonths > 0) {
        monthlyRent = cost / totalPayerMonths;
    }

    // Calculate additional metrics
    const annualPerUnit = monthlyRent * 12;
    const totalMonthly = monthlyRent * units;

    // Update Results
    resultDisplay.textContent = currencyFormat.format(monthlyRent);
    annualPerUnitDisplay.textContent = currencyFormat.format(annualPerUnit);
    totalMonthlyDisplay.textContent = currencyFormat.format(totalMonthly);
}

// Function to make a display element editable
function makeEditable(displayElement, rangeInput, parseFunc, valueKey) {
    displayElement.style.cursor = 'pointer';
    displayElement.title = 'Click to edit';
    
    displayElement.addEventListener('click', function() {
        const currentValue = rangeInput.value;
        const originalText = displayElement.textContent;
        
        // Create input element
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentValue;
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
            
            // Allow manual input to exceed slider max, only validate minimum
            if (!isNaN(newValue) && newValue >= min) {
                // Store the actual value
                actualValues[valueKey] = newValue;
                
                // Update slider to min(newValue, max) for visual feedback
                if (newValue > parseFloat(rangeInput.max)) {
                    rangeInput.value = rangeInput.max;
                } else {
                    rangeInput.value = newValue;
                }
                
                calculate();
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

// Make value displays editable
makeEditable(costDisplay, costInput, (val) => {
    // Remove currency symbols, spaces, and commas
    return parseFloat(val.replace(/[^0-9.-]/g, ''));
}, 'cost');

makeEditable(unitsDisplay, unitsInput, (val) => {
    // Remove commas and parse as integer
    return parseInt(val.replace(/[^0-9]/g, ''), 10);
}, 'units');

makeEditable(yearsDisplay, yearsInput, (val) => {
    // Extract number from "X Years" or just "X"
    return parseInt(val.replace(/[^0-9]/g, ''), 10);
}, 'years');

// Add Event Listeners - clear actual value when slider is moved
costInput.addEventListener('input', () => {
    actualValues.cost = null;
    calculate();
});
unitsInput.addEventListener('input', () => {
    actualValues.units = null;
    calculate();
});
yearsInput.addEventListener('input', () => {
    actualValues.years = null;
    calculate();
});
if (currencySelect) {
    currencySelect.addEventListener('change', calculate);
}

// Initial Run
calculate();
