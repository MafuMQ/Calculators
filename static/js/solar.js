// Solar Calculator JavaScript
let cachedData = null;
let cachedGraphs = { cumulative: {}, cost: {} };

function fetchAndRender(modeCumulative, modeCost, force = false) {
    // Get all inputs
    const panelCost = document.getElementById('panel_cost').value;
    const panelWattage = document.getElementById('panel_wattage').value;
    const currentCost = document.getElementById('current_cost').value;
    const dailyEnergy = document.getElementById('daily_energy').value;
    const peakPower = document.getElementById('peak_power').value;
    
    // Validate
    if (!panelCost || !panelWattage || !currentCost || !dailyEnergy || !peakPower) {
        showError('Please fill in all fields.');
        return;
    }
    
    // Reset UI
    document.getElementById('results').style.display = 'none';
    document.getElementById('error-message').style.display = 'none';
    
    // If cached and not force, just switch graphs
    if (cachedData && cachedGraphs.cumulative[modeCumulative] && cachedGraphs.cost[modeCost]) {
        renderGraphs(cachedData, modeCumulative, modeCost);
        return;
    }
    
    // Send to Flask backend for both modes
    Promise.all([
        fetch('/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                panel_cost: panelCost,
                panel_wattage: panelWattage,
                current_cost: currentCost,
                daily_energy: dailyEnergy,
                peak_power: peakPower,
                mode: modeCumulative
            })
        }).then(res => res.json()),
        fetch('/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                panel_cost: panelCost,
                panel_wattage: panelWattage,
                current_cost: currentCost,
                daily_energy: dailyEnergy,
                peak_power: peakPower,
                mode: modeCost
            })
        }).then(res => res.json())
    ]).then(([dataCumulative, dataCost]) => {
        if (dataCumulative.success && dataCost.success) {
            cachedData = dataCumulative;
            cachedGraphs.cumulative[modeCumulative] = {
                graph_cumulative: dataCumulative.graph_cumulative
            };
            cachedGraphs.cost[modeCost] = {
                graph_cost: dataCost.graph_cost
            };
            renderGraphs(dataCumulative, modeCumulative, modeCost);
        } else {
            showError(dataCumulative.error || dataCost.error);
        }
    }).catch(err => {
        console.error('Error:', err);
        showError('An unexpected error occurred. Please check your inputs.');
    });
}

function renderGraphs(data, modeCumulative, modeCost) {
    document.getElementById('capacity-result').textContent = 
        data.required_capacity_w.toLocaleString(undefined, {maximumFractionDigits: 0}) + ' W';
    document.getElementById('investment-result').textContent = 'R' + 
        data.total_solar_cost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('savings-result').textContent = 'R' + 
        data.annual_savings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('payback-result').textContent = 
        data.payback_period === 'Never' ? 'Never' : data.payback_period + ' years';
    
    // Render both graphs
    const graphCumulative = JSON.parse(cachedGraphs.cumulative[modeCumulative].graph_cumulative);
    const graphCost = JSON.parse(cachedGraphs.cost[modeCost].graph_cost);
    
    Plotly.purge('graph-cumulative-container');
    Plotly.purge('graph-cost-container');
    Plotly.newPlot('graph-cumulative-container', graphCumulative.data, graphCumulative.layout, {responsive: true});
    Plotly.Plots.resize(document.getElementById('graph-cumulative-container'));
    Plotly.newPlot('graph-cost-container', graphCost.data, graphCost.layout, {responsive: true});
    Plotly.Plots.resize(document.getElementById('graph-cost-container'));
    
    document.getElementById('results').style.display = 'block';
    document.getElementById('graph-cumulative-container').scrollIntoView({behavior: 'smooth', block: 'start'});
}

function showError(msg) {
    const el = document.getElementById('error-message');
    el.textContent = msg;
    el.style.display = 'block';
}

// Event Listeners
document.getElementById('calculate-btn').addEventListener('click', function() {
    const modeCumulative = document.getElementById('mode-toggle-cumulative').value;
    const modeCost = document.getElementById('mode-toggle-cost').value;
    cachedData = null;
    cachedGraphs = { cumulative: {}, cost: {} };
    fetchAndRender(modeCumulative, modeCost, true);
});

document.getElementById('mode-toggle-cumulative').addEventListener('change', function() {
    const modeCumulative = this.value;
    const modeCost = document.getElementById('mode-toggle-cost').value;
    if (cachedData && cachedGraphs.cumulative[modeCumulative] && cachedGraphs.cost[modeCost]) {
        renderGraphs(cachedData, modeCumulative, modeCost);
    } else {
        fetchAndRender(modeCumulative, modeCost);
    }
});

document.getElementById('mode-toggle-cost').addEventListener('change', function() {
    const modeCost = this.value;
    const modeCumulative = document.getElementById('mode-toggle-cumulative').value;
    if (cachedData && cachedGraphs.cumulative[modeCumulative] && cachedGraphs.cost[modeCost]) {
        renderGraphs(cachedData, modeCumulative, modeCost);
    } else {
        fetchAndRender(modeCumulative, modeCost);
    }
});
