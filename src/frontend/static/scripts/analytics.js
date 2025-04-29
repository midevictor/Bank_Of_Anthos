// Initialize charts when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Spending Pattern Chart
    const spendingCtx = document.getElementById('spendingChart').getContext('2d');
    new Chart(spendingCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Spending',
                data: [1200, 1900, 1500, 1800, 2000, 1700],
                backgroundColor: '#002d6e'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Budget Tracking Chart
    const budgetCtx = document.getElementById('budgetChart').getContext('2d');
    new Chart(budgetCtx, {
        type: 'doughnut',
        data: {
            labels: ['Spent', 'Remaining'],
            datasets: [{
                data: [70, 30],
                backgroundColor: ['#002d6e', '#246df0']
            }]
        },
        options: {
            responsive: true
        }
    });

    // Investment Portfolio Chart
    const investmentCtx = document.getElementById('investmentChart').getContext('2d');
    new Chart(investmentCtx, {
        type: 'pie',
        data: {
            labels: ['Stocks', 'Bonds', 'Real Estate', 'Cash'],
            datasets: [{
                data: [40, 30, 20, 10],
                backgroundColor: ['#002d6e', '#246df0', '#64748b', '#e2e8f0']
            }]
        },
        options: {
            responsive: true
        }
    });

    // Financial Trends Chart
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Income',
                data: [3000, 3200, 3400, 3300, 3600, 3800],
                borderColor: '#002d6e',
                tension: 0.1
            }, {
                label: 'Expenses',
                data: [2800, 2900, 2700, 3000, 2800, 2900],
                borderColor: '#246df0',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});