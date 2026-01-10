# Cost Recovery Calculators

## Project Overview
A comprehensive web application featuring multiple financial calculators to help users make informed decisions about investments and cost recovery. The platform currently includes:

1. **Solar Break-Even Calculator** - Determines the financial feasibility and payback period for solar panel installations
2. **Building Cost Recovery Calculator** - Calculates monthly rent per unit needed to recover construction costs

## Features
- **Modern, Responsive UI** - Works seamlessly on desktop and mobile devices
- **Multiple Calculators** - Unified platform with navigation between different tools
- **Interactive Visualizations** - Real-time graphs and charts (Solar Calculator)
- **Instant Calculations** - Dynamic sliders with immediate results
- **Professional Navigation** - Easy access to all calculators from a central hub

## Usage Instructions
To run the application, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/MafuMQ/solar-break-even.git
   cd solar-break-even
   ```
2. **Install Dependencies**:
   Ensure that you have Python installed (preferably version 3.6 or higher). Install the required dependencies using pip:
   ```bash
   pip install -r requirements.txt
   ```
3. **Run the Application**:
   Start the web application by running:
   ```bash
   python app.py
   ```
4. **Access the App**:
   Open your web browser and navigate to `http://127.0.0.1:5000` to access the calculator hub.

## Available Calculators

### Solar Break-Even Calculator (`/solar`)
Analyzes the financial viability of solar panel installations by calculating:
- Required system capacity based on peak power needs
- Total installation costs
- Annual energy savings
- Break-even point in years
- Cumulative cost comparisons (grid vs. solar)
- Monthly or annual cost analysis modes

**Key Inputs:**
- Panel cost and wattage
- Current electricity cost per kWh
- Daily energy consumption
- Peak power requirements

### Building Cost Recovery Calculator (`/building`)
Determines the monthly rental income needed per unit to recover building construction costs over time.

**Key Inputs:**
- Total building cost ($1M - $200M)
- Number of units (1 - 1,000)
- Recovery period (1 - 50 years)

**Outputs:**
- Monthly rent per unit
- Annual rent per unit
- Total monthly revenue

*Note: Calculations exclude interest, taxes, maintenance, and operating costs*

## Dependencies
- Flask - Web framework
- Plotly - Interactive visualizations (Solar Calculator)
- Python 3.6+

Ensure you have these libraries installed by following the **Install Dependencies** section above.

## Project Structure
```
solar-break-even/
├── app.py                          # Flask application with all routes
├── static/
│   ├── css/
│   │   ├── base.css               # Base styles (navigation, layout, common elements)
│   │   ├── calculator.css         # Shared calculator styles (forms, buttons, results)
│   │   ├── home.css               # Landing page specific styles
│   │   ├── solar.css              # Solar calculator specific styles
│   │   └── building.css           # Building calculator specific styles
│   └── js/
│       ├── solar.js               # Solar calculator functionality
│       └── building.js            # Building calculator functionality
├── templates/
│   ├── base.html                  # Base template with navigation
│   ├── home.html                  # Landing page with calculator cards
│   ├── solar_calculator.html      # Solar break-even calculator
│   └── building_calculator.html   # Building cost recovery calculator
├── requirements.txt               # Python dependencies
├── vercel.json                    # Deployment configuration
└── README.md                      # This file
```

## Adding New Calculators
To add a new calculator to the platform:

1. Create a new template in `templates/your_calculator.html` extending `base.html`
2. Add a route in `app.py`:
   ```python
   @app.route('/your-calculator')
   def your_calculator():
       return render_template('your_calculator.html')
   ```
3. Add a card for your calculator in `templates/home.html`
4. Update the navigation in `templates/base.html` if needed

## Example Scenario - Solar Calculator
Let's consider a scenario:
- **Panel Cost**: R1,500 per panel
- **Panel Wattage**: 400W
- **Daily Energy Consumption**: 30 kWh
- **Peak Power Requirement**: 5,000W
- **Current Electricity Cost**: R2.50/kWh

**Results:**
- Required Capacity: 5,000W (12.5 panels)
- Total Solar Cost: R18,750
- Annual Grid Cost: R27,375
- Break-even Point: 0.69 years (~8 months)

## Example Scenario - Building Calculator
Let's consider a scenario:
- **Building Cost**: $50,000,000
- **Total Units**: 200
- **Recovery Period**: 25 years

**Results:**
- Monthly Rent per Unit: $833
- Annual Rent per Unit: $10,000
- Total Monthly Revenue: $166,600

## Conclusion
This project provides a unified platform for various cost recovery calculations, helping users make informed financial decisions for solar investments, real estate projects, and more. The modular structure allows for easy expansion with additional calculators as needed.
