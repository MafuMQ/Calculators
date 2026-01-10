// Fixed Deposit Calculator JavaScript
// Get Elements
const principalInput = document.getElementById('principal');
const rateInput = document.getElementById('rate');
const tenureInput = document.getElementById('tenure');
const frequencySelect = document.getElementById('frequency');
const payoutModeSelect = document.getElementById('payoutMode');
const currencySelect = document.getElementById('currency');

const principalDisplay = document.getElementById('principalDisplay');
const rateDisplay = document.getElementById('rateDisplay');
const tenureDisplay = document.getElementById('tenureDisplay');
const maturityAmountDisplay = document.getElementById('maturityAmount');
const interestEarnedDisplay = document.getElementById('interestEarned');
const effectiveRateDisplay = document.getElementById('effectiveRate');
const minPrincipalLabel = document.getElementById('minPrincipalLabel');
const maxPrincipalLabel = document.getElementById('maxPrincipalLabel');
const breakdownPrincipal = document.getElementById('breakdownPrincipal');
const breakdownInterest = document.getElementById('breakdownInterest');
const breakdownPrincipalAmount = document.getElementById('breakdownPrincipalAmount');
const breakdownInterestAmount = document.getElementById('breakdownInterestAmount');

// Store actual values (can exceed slider max)
let actualValues = {
    principal: null,
    rate: null,
    tenure: null
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
        maximumFractionDigits: 2
    });
}

function calculate() {
    // Get values - use actual values if set, otherwise use slider values
    const principal = actualValues.principal !== null ? actualValues.principal : parseFloat(principalInput.value);
    const rate = actualValues.rate !== null ? actualValues.rate : parseFloat(rateInput.value);
    const tenure = actualValues.tenure !== null ? actualValues.tenure : parseFloat(tenureInput.value);
    const frequency = parseFloat(frequencySelect.value);
    const currency = (currencySelect && currencySelect.value) ? currencySelect.value : 'ZAR';
    const currencyFormat = getFormatter(currency);

    // Update Labels
    principalDisplay.textContent = currencyFormat.format(principal);
    rateDisplay.textContent = rate.toFixed(1) + '%';
    tenureDisplay.textContent = tenure + (tenure === 1 ? " Year" : " Years");

    // Update min/max range labels to reflect currency
    if (minPrincipalLabel && maxPrincipalLabel) {
        const min = parseInt(principalInput.min, 10);
        const max = parseInt(principalInput.max, 10);
        minPrincipalLabel.textContent = currencyFormat.format(min);
        maxPrincipalLabel.textContent = currencyFormat.format(max);
    }

    // Determine payout mode
    const payoutMode = (payoutModeSelect && payoutModeSelect.value) ? payoutModeSelect.value : 'reinvest';

    const rateDecimal = rate / 100;
    
    // Get elements for dynamic labeling
    const resultLabel = document.querySelector('.result-label');

    if (payoutMode === 'reinvest') {
        // Calculate Compound Interest: A = P(1 + r/n)^(nt)
        const maturityAmount = principal * Math.pow(1 + (rateDecimal / frequency), frequency * tenure);
        const interestEarned = maturityAmount - principal;

        // Calculate Effective Annual Rate: (1 + r/n)^n - 1
        const effectiveRate = (Math.pow(1 + (rateDecimal / frequency), frequency) - 1) * 100;

        // Update main result to show Maturity Amount
        if (resultLabel) resultLabel.textContent = 'Maturity Amount';
        maturityAmountDisplay.textContent = currencyFormat.format(maturityAmount);
        interestEarnedDisplay.textContent = currencyFormat.format(interestEarned);
        effectiveRateDisplay.textContent = effectiveRate.toFixed(2) + '%';

        // Update Breakdown Bar (based on maturity)
        const principalPercentage = (principal / maturityAmount) * 100;
        const interestPercentage = (interestEarned / maturityAmount) * 100;
        
        breakdownPrincipal.style.width = principalPercentage.toFixed(1) + '%';
        breakdownInterest.style.width = interestPercentage.toFixed(1) + '%';
        
        breakdownPrincipalAmount.textContent = currencyFormat.format(principal);
        breakdownInterestAmount.textContent = currencyFormat.format(interestEarned);

    } else {
        // Payout mode: compute periodic payout (interest paid out each period, principal returned at end)
        let payoutFreq = 1;
        let payoutLabel = 'Annual';
        if (payoutMode === 'monthly') {
            payoutFreq = 12;
            payoutLabel = 'Monthly';
        } else if (payoutMode === 'quarterly') {
            payoutFreq = 4;
            payoutLabel = 'Quarterly';
        } else if (payoutMode === 'annually') {
            payoutFreq = 1;
            payoutLabel = 'Annual';
        }

        // periodic payout = principal * (r / payoutFreq)
        const periodicPayout = principal * (rateDecimal / payoutFreq);
        const totalPeriods = payoutFreq * tenure;
        const totalInterest = periodicPayout * totalPeriods;

        // Update main result to show Periodic Payout
        if (resultLabel) resultLabel.textContent = payoutLabel + ' Payout';
        maturityAmountDisplay.textContent = currencyFormat.format(periodicPayout);
        interestEarnedDisplay.textContent = currencyFormat.format(totalInterest);
        effectiveRateDisplay.textContent = rate.toFixed(2) + '%';

        // Update Breakdown Bar (principal vs interest total paid)
        const totalReceived = principal + totalInterest;
        const principalPercentage = (principal / totalReceived) * 100;
        const interestPercentage = (totalInterest / totalReceived) * 100;

        breakdownPrincipal.style.width = principalPercentage.toFixed(1) + '%';
        breakdownInterest.style.width = interestPercentage.toFixed(1) + '%';

        breakdownPrincipalAmount.textContent = currencyFormat.format(principal);
        breakdownInterestAmount.textContent = currencyFormat.format(totalInterest);
    }
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
makeEditable(principalDisplay, principalInput, (val) => {
    // Remove currency symbols, spaces, and commas
    return parseFloat(val.replace(/[^0-9.-]/g, ''));
}, 'principal');

makeEditable(rateDisplay, rateInput, (val) => {
    // Remove % symbol and parse as float
    return parseFloat(val.replace(/[^0-9.-]/g, ''));
}, 'rate');

makeEditable(tenureDisplay, tenureInput, (val) => {
    // Extract number from "X Years" or just "X"
    return parseInt(val.replace(/[^0-9]/g, ''), 10);
}, 'tenure');

// Add Event Listeners - clear actual value when slider is moved
principalInput.addEventListener('input', () => {
    actualValues.principal = null;
    calculate();
});
rateInput.addEventListener('input', () => {
    actualValues.rate = null;
    calculate();
});
tenureInput.addEventListener('input', () => {
    actualValues.tenure = null;
    calculate();
});
frequencySelect.addEventListener('change', calculate);
if (currencySelect) {
    currencySelect.addEventListener('change', calculate);
}
if (payoutModeSelect) {
    payoutModeSelect.addEventListener('change', calculate);
}

// Initial Run
calculate();
