document.addEventListener('DOMContentLoaded', () => {
    const addInvestmentBtn = document.getElementById('add-investment-btn');
    const investmentForm = document.getElementById('investment-form');
    const submitInvestmentBtn = document.getElementById('submit-investment');
    const investmentList = document.getElementById('investment-list');
    const totalValueElem = document.getElementById('total-value');
    let investments = JSON.parse(localStorage.getItem('investments')) || [];

    // Initialize portfolio
    displayInvestments();
    updateTotalPortfolioValue();
    renderChart();

    // Toggle investment form
    addInvestmentBtn.addEventListener('click', () => {
        investmentForm.style.display = 'block';
    });

    // Add investment
    submitInvestmentBtn.addEventListener('click', () => {
        const assetName = document.getElementById('asset-name').value;
        const investedAmount = parseFloat(document.getElementById('invested-amount').value);
        const currentValue = parseFloat(document.getElementById('current-value').value);

        if (assetName && investedAmount > 0 && currentValue > 0) {
            const investment = { assetName, investedAmount, currentValue };
            investments.push(investment);
            saveInvestments();
            displayInvestments();
            updateTotalPortfolioValue();
            renderChart();
            investmentForm.style.display = 'none';
        }
    });

    // Remove investment
    investmentList.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-btn')) {
            const index = event.target.dataset.index;
            investments.splice(index, 1);
            saveInvestments();
            displayInvestments();
            updateTotalPortfolioValue();
            renderChart();
        }
    });

    // Display investments in list
    function displayInvestments() {
        investmentList.innerHTML = '';
        investments.forEach((investment, index) => {
            const { assetName, investedAmount, currentValue } = investment;
            const percentageChange = ((currentValue - investedAmount) / investedAmount * 100).toFixed(2);
            const investmentElem = document.createElement('li');
            investmentElem.innerHTML = `
                ${assetName} - Invested: $${investedAmount}, Current: $${currentValue}, Change: ${percentageChange}%
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            investmentList.appendChild(investmentElem);
        });
    }

    // Update total portfolio value
    function updateTotalPortfolioValue() {
        const totalValue = investments.reduce((total, investment) => total + investment.currentValue, 0);
        totalValueElem.textContent = totalValue.toFixed(2);
    }

    // Save investments to localStorage
    function saveInvestments() {
        localStorage.setItem('investments', JSON.stringify(investments));
    }

    // Render chart
    function renderChart() {
        const ctx = document.getElementById('portfolio-chart').getContext('2d');
        const labels = investments.map(investment => investment.assetName);
        const data = investments.map(investment => investment.currentValue);

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    label: 'Portfolio Distribution',
                    data,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ],
                }]
            },
        });
    }
});
