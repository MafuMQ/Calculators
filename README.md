# Cost Recovery Calculators

## Project Overview
A comprehensive web application featuring multiple financial calculators to help users make informed decisions about investments and cost recovery. The platform currently includes:

1. **Solar Break-Even Calculator** - Determines the financial feasibility and payback period for solar panel installations.
2. **Building Cost Recovery Calculator** - Calculates monthly rent per unit needed to recover construction costs.
3. **Fixed Deposit Calculator** - Computes maturity amounts and interest earned on fixed deposit investments.
4. **Fleet & Trip Cost Calculator** - Calculates trip costs based on fuel efficiency, driver pay, and vehicle financing.

## Features
- **Modern, Responsive UI** - Works seamlessly on desktop and mobile devices
- **Multiple Calculators** - Unified platform with navigation between different tools
- **Interactive Visualizations** - Real-time graphs and charts using Plotly.js
- **Instant Calculations** - Dynamic inputs with immediate real-time results
- **Professional Navigation** - Easy access to all calculators from a central home hub

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

### Building Cost Recovery Calculator (`/building`)
Determines the monthly rental income needed per unit to recover building construction costs over time.

### Fixed Deposit Calculator (`/fixed-deposit`)
Calculate maturity amount and interest earned on your fixed deposit investments with compound interest calculations.

### Fleet & Trip Cost Calculator (`/fleet`)
Calculates trip costs based on fuel efficiency, driver pay, and vehicle financing to better manage your fleet expenses.
- Real-time updates without needing to click calculate
- Interactive Cost Breakdown Pie Chart
- Dynamic driver pay rate calculation (Per Hour / Per Day / Per Month)

## Dependencies
- Flask - Web framework
- Plotly.js - Interactive visualizations
- Python 3.6+

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
│       ├── fleet.js               # Fleet & Trip calculator functionality
│       ├── solar.js               # Solar calculator functionality
│       └── building.js            # Building calculator functionality
├── templates/
│   ├── base.html                  # Base template with navigation
│   ├── home.html                  # Landing page with calculator cards
│   ├── solar_calculator.html      # Solar break-even calculator
│   ├── building_calculator.html   # Building cost recovery calculator
│   ├── fleet_calculator.html      # Fleet & Trip cost calculator
│   └── fixed_deposit_calculator.html # Fixed deposit calculator
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

## Conclusion
This project provides a unified platform for various cost recovery calculations, helping users make informed financial decisions for solar investments, real estate projects, and more. The modular structure allows for easy expansion with additional calculators as needed.
