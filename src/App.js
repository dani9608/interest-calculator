import React, { useState } from 'react';
import './App.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  // State variables for loan calculation
  const [loanAmount, setLoanAmount] = useState(1000); // Default loan amount
  const [interestRate, setInterestRate] = useState(5); // Default interest rate
  const [loanTerm, setLoanTerm] = useState(3); // Default loan term in years
  const [downPayment, setDownPayment] = useState(0); // Default down payment
  const [results, setResults] = useState(null); // To store results of the calculation
  const [yearlyBreakdown, setYearlyBreakdown] = useState([]); // To store yearly payment breakdown

  // Function to calculate interest and payment details
  const calculateInterest = () => {
    // Validate input fields
    if (!loanAmount || !interestRate || !loanTerm) {
      alert("Please fill in all fields.");
      return;
    }
    
    const principal = loanAmount - downPayment; // Calculate principal after down payment
    if (principal < 0) {
      alert("Down payment cannot exceed loan amount.");
      return;
    }
    
    const yearlyInterestRate = interestRate / 100; // Convert interest rate to decimal
    const totalInterest = principal * yearlyInterestRate * loanTerm; // Calculate total interest
    const totalPaid = principal + totalInterest; // Calculate total amount paid

    // Prepare yearly breakdown of payments
    const breakdown = [];
    let remainingPrincipal = principal;
    for (let year = 1; year <= loanTerm; year++) {
      const interestForYear = remainingPrincipal * yearlyInterestRate; // Calculate interest for the year
      const totalForYear = (principal / loanTerm) + interestForYear; // Total paid for that year
      breakdown.push({
        year: year,
        totalPaid: totalForYear.toFixed(2), // Format total paid for the year
        interest: interestForYear.toFixed(2), // Format interest for the year
      });
      remainingPrincipal -= (principal / loanTerm); // Reduce remaining principal
    }

    setYearlyBreakdown(breakdown); // Update yearly breakdown state
    setResults({
      totalInterest: totalInterest.toFixed(2), // Update total interest state
      totalPaid: totalPaid.toFixed(2), // Update total paid state
    });
  };

  // Prepare data for the chart
  const chartData = {
    labels: yearlyBreakdown.map(data => `Year ${data.year}`), // Create labels for each year
    datasets: [
      {
        label: 'Total Paid',
        data: yearlyBreakdown.map(data => parseFloat(data.totalPaid)), // Total paid data for the chart
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color for the total paid bar
      },
      {
        label: 'Interest Paid',
        data: yearlyBreakdown.map(data => parseFloat(data.interest)), // Interest paid data for the chart
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Color for the interest paid bar
      },
    ],
  };

  return (
    <div className="container">
      <h1 className="title">Interest Rate Calculator</h1>

      <div className="card">
        {/* Input Fields */}
        <label>Loan Amount ($)</label>
        <input
          type="text"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          placeholder="Enter loan amount"
        />

        <label>Interest Rate (%)</label>
        <input
          type="text"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          placeholder="Enter interest rate"
        />

        <label>Loan Term (Years)</label>
        <input
          type="range"
          min="1"
          max="30"
          step="1"
          value={loanTerm}
          onChange={(e) => setLoanTerm(e.target.value)}
        />
        <div className="range-label">{loanTerm} Year(s)</div> {/* Display selected loan term */}

        <label>Principal (Down Payment) ($)</label>
        <input
          type="text"
          value={downPayment}
          onChange={(e) => setDownPayment(e.target.value)}
          placeholder="Enter down payment"
        />

        <button onClick={calculateInterest}>Calculate</button> {/* Calculate button */}

        {/* Results Section */}
        {results && (
          <div className={`result animate-fade-in`}>
            <h2>Results</h2>
            <p>Total Interest Paid: ${results.totalInterest}</p>
            <p>Total Amount Paid: ${results.totalPaid}</p>
          </div>
        )}

        {/* Yearly Breakdown Section */}
        {yearlyBreakdown.length > 0 && (
          <div className={`result animate-fade-in`}>
            <h2>Yearly Breakdown</h2>
            <ul>
              {yearlyBreakdown.map((data) => (
                <li key={data.year}>
                  Year {data.year}: Total Paid: ${data.totalPaid}, Interest: ${data.interest}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Chart Section */}
        {yearlyBreakdown.length > 0 && (
          <div className={`chart-container animate-fade-in`}>
            <Bar data={chartData} /> {/* Render chart with the prepared data */}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
