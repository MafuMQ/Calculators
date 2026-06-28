// Building Calculator JavaScript
// Get Elements
const costInput = document.getElementById('cost');
const unitsInput = document.getElementById('units');
const yearsInput = document.getElementById('years');
const costPerSqmInput = document.getElementById('costPerSqm');
const unitSizeInput = document.getElementById('unitSize');
const currencySelect = document.getElementById('currency');

const costDisplay = document.getElementById('costDisplay');
const unitsDisplay = document.getElementById('unitsDisplay');
const yearsDisplay = document.getElementById('yearsDisplay');
const costPerSqmDisplay = document.getElementById('costPerSqmDisplay');
const unitSizeDisplay = document.getElementById('unitSizeDisplay');
const resultDisplay = document.getElementById('result');
const annualPerUnitDisplay = document.getElementById('annualPerUnit');
const totalMonthlyDisplay = document.getElementById('totalMonthly');
const totalBuildingCostCard = document.getElementById('totalBuildingCostCard');
const minCostLabel = document.getElementById('minCostLabel');
const maxCostLabel = document.getElementById('maxCostLabel');
const minCostPerSqmLabel = document.getElementById('minCostPerSqmLabel');
const maxCostPerSqmLabel = document.getElementById('maxCostPerSqmLabel');

// Store actual values (can exceed slider max)
let actualValues = {
    cost: null,
    units: null,
    years: null,
    costPerSqm: null,
    unitSize: null
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

function calculate(source = null) {
    let cost = actualValues.cost !== null ? actualValues.cost : parseFloat(costInput.value);
    let units = actualValues.units !== null ? actualValues.units : parseFloat(unitsInput.value);
    let years = actualValues.years !== null ? actualValues.years : parseFloat(yearsInput.value);
    let costPerSqm = actualValues.costPerSqm !== null ? actualValues.costPerSqm : parseFloat(costPerSqmInput.value);
    let unitSize = actualValues.unitSize !== null ? actualValues.unitSize : parseFloat(unitSizeInput.value);

    // Sync logic between total cost and unit components
    if (source === 'cost') {
        if (units > 0 && unitSize > 0) {
            costPerSqm = cost / (units * unitSize);
            actualValues.costPerSqm = costPerSqm;
            costPerSqmInput.value = costPerSqm <= parseFloat(costPerSqmInput.max) ? costPerSqm : costPerSqmInput.max;
        }
    } else if (source === 'costPerSqm' || source === 'unitSize' || source === 'units' || source === 'init') {
        cost = costPerSqm * unitSize * units;
        actualValues.cost = cost;
        costInput.value = cost <= parseFloat(costInput.max) ? cost : costInput.max;
    }

    const currency = (currencySelect && currencySelect.value) ? currencySelect.value : 'ZAR';
    const currencyFormat = getFormatter(currency);

    // Update Labels
    costDisplay.textContent = currencyFormat.format(cost);
    unitsDisplay.textContent = units.toLocaleString();
    yearsDisplay.textContent = years + (years === 1 ? " Year" : " Years");
    costPerSqmDisplay.textContent = currencyFormat.format(costPerSqm);
    unitSizeDisplay.textContent = unitSize.toLocaleString() + " sqm";

    // Update min/max range labels to reflect currency
    if (minCostLabel && maxCostLabel) {
        minCostLabel.textContent = currencyFormat.format(parseInt(costInput.min, 10));
        maxCostLabel.textContent = currencyFormat.format(parseInt(costInput.max, 10));
    }
    if (minCostPerSqmLabel && maxCostPerSqmLabel) {
        minCostPerSqmLabel.textContent = currencyFormat.format(parseInt(costPerSqmInput.min, 10));
        maxCostPerSqmLabel.textContent = currencyFormat.format(parseInt(costPerSqmInput.max, 10));
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
    
    if (totalBuildingCostCard) {
        totalBuildingCostCard.textContent = currencyFormat.format(cost);
    }
}

// Function to make a display element editable
function makeEditable(displayElement, rangeInput, parseFunc, valueKey) {
    displayElement.style.cursor = 'pointer';
    displayElement.title = 'Click to edit';
    
    displayElement.addEventListener('click', function() {
        // Find current precise value or slider value
        const currentValue = actualValues[valueKey] !== null ? actualValues[valueKey] : rangeInput.value;
        const originalText = displayElement.textContent;
        
        // Create input element
        const input = document.createElement('input');
        input.type = 'text';
        // Format it nicely for editing or just raw number
        input.value = Math.round(currentValue);
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
                
                calculate(valueKey);
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
makeEditable(costDisplay, costInput, (val) => parseFloat(val.replace(/[^0-9.-]/g, '')), 'cost');
makeEditable(unitsDisplay, unitsInput, (val) => parseInt(val.replace(/[^0-9]/g, ''), 10), 'units');
makeEditable(yearsDisplay, yearsInput, (val) => parseInt(val.replace(/[^0-9]/g, ''), 10), 'years');
makeEditable(costPerSqmDisplay, costPerSqmInput, (val) => parseFloat(val.replace(/[^0-9.-]/g, '')), 'costPerSqm');
makeEditable(unitSizeDisplay, unitSizeInput, (val) => parseInt(val.replace(/[^0-9]/g, ''), 10), 'unitSize');

// Add Event Listeners - clear actual value when slider is moved
costInput.addEventListener('input', () => { actualValues.cost = null; calculate('cost'); });
unitsInput.addEventListener('input', () => { actualValues.units = null; calculate('units'); });
yearsInput.addEventListener('input', () => { actualValues.years = null; calculate('years'); });
costPerSqmInput.addEventListener('input', () => { actualValues.costPerSqm = null; calculate('costPerSqm'); });
unitSizeInput.addEventListener('input', () => { actualValues.unitSize = null; calculate('unitSize'); });

if (currencySelect) {
    currencySelect.addEventListener('change', () => calculate('currency'));
}

// Initial Run
calculate('init');
