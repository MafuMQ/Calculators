// Building Calculator JavaScript
// Get Elements
const costInput = document.getElementById('cost');
const unitsInput = document.getElementById('units');
const yearsInput = document.getElementById('years');

const costDisplay = document.getElementById('costDisplay');
const unitsDisplay = document.getElementById('unitsDisplay');
const yearsDisplay = document.getElementById('yearsDisplay');
const resultDisplay = document.getElementById('result');
const annualPerUnitDisplay = document.getElementById('annualPerUnit');
const totalMonthlyDisplay = document.getElementById('totalMonthly');

// Formatter for currency
const currencyFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
});

function calculate() {
    // Get values
    const cost = parseFloat(costInput.value);
    const units = parseFloat(unitsInput.value);
    const years = parseFloat(yearsInput.value);

    // Update Labels
    costDisplay.textContent = currencyFormat.format(cost);
    unitsDisplay.textContent = units.toLocaleString();
    yearsDisplay.textContent = years + (years === 1 ? " Year" : " Years");

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

// Add Event Listeners
costInput.addEventListener('input', calculate);
unitsInput.addEventListener('input', calculate);
yearsInput.addEventListener('input', calculate);

// Initial Run
calculate();
