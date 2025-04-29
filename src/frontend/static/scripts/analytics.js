// Helper functions to process transaction data
function processMonthlySpending(history) {
    const months = {};
    const currentDate = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        months[monthNames[d.getMonth()]] = { credits: 0, debits: 0 };
    }

    // Process transactions
    history.forEach(transaction => {
        const date = new Date(transaction.timestamp);
        const monthName = monthNames[date.getMonth()];
        if (months.hasOwnProperty(monthName)) {
            const amount = Math.abs(transaction.amount) / 100;
            if (transaction.type === 'credit') {
                months[monthName].credits += amount;
            } else if (transaction.type === 'debit') {
                months[monthName].debits += amount;
            }
        }
    });

    return {
        labels: Object.keys(months),
        data: Object.values(months).map(m => m.credits + m.debits)
    };
}

function processBudgetData(history) {
    const currentMonth = new Date().getMonth();
    let monthlyCredits = 0;
    let monthlyDebits = 0;

    history.forEach(transaction => {
        const date = new Date(transaction.timestamp);
        if (date.getMonth() === currentMonth) {
            const amount = Math.abs(transaction.amount) / 100;
            if (transaction.type === 'credit') {
                monthlyCredits += amount;
            } else if (transaction.type === 'debit') {
                monthlyDebits += amount;
            }
        }
    });

    return {
        spent: monthlyDebits,
        remaining: monthlyCredits - monthlyDebits
    };
}

function processTransactionTypes(history) {
    const types = {
        credits: 0,
        debits: 0,
        transfers: 0
    };

    history.forEach(transaction => {
        const amount = Math.abs(transaction.amount) / 100;
        if (transaction.toAccountNum === transaction.fromAccountNum) {
            types.transfers += amount;
        } else if (transaction.type === 'credit') {
            types.credits += amount;
        } else if (transaction.type === 'debit') {
            types.debits += amount;
        }
    });

    return Object.values(types);
}

function processFinancialTrends(history) {
    const trends = {};
    const currentDate = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = monthNames[d.getMonth()];
        trends[monthName] = { income: 0, expenses: 0 };
    }

    // Process transactions
    history.forEach(transaction => {
        const date = new Date(transaction.timestamp);
        const monthName = monthNames[date.getMonth()];
        if (trends.hasOwnProperty(monthName)) {
            const amount = Math.abs(transaction.amount) / 100;
            if (transaction.type === 'credit') {
                trends[monthName].income += amount;
            } else if (transaction.type === 'debit') {
                trends[monthName].expenses += amount;
            }
        }
    });

    return {
        labels: Object.keys(trends),
        income: Object.values(trends).map(t => t.income),
        expenses: Object.values(trends).map(t => t.expenses)
    };
}

// Initialize charts when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Process transaction history data
    const history = window.transactionHistory || [];
    
    // Process monthly spending data
    const monthlySpending = processMonthlySpending(history);
    
    // Process budget data
    const budgetData = processBudgetData(history);
    
    // Process financial trends
    const trends = processFinancialTrends(history);

    // Spending Pattern Chart
    const spendingCtx = document.getElementById('spendingChart').getContext('2d');
    new Chart(spendingCtx, {
        type: 'bar',
        data: {
            labels: monthlySpending.labels,
            datasets: [{
                label: 'Monthly Activity',
                data: monthlySpending.data,
                backgroundColor: '#002d6e'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
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
                data: [budgetData.spent, budgetData.remaining],
                backgroundColor: ['#002d6e', '#246df0']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return '$' + context.raw.toFixed(2);
                        }
                    }
                }
            }
        }
    });

    // Investment Portfolio Chart
    const investmentCtx = document.getElementById('investmentChart').getContext('2d');
    new Chart(investmentCtx, {
        type: 'pie',
        data: {
            labels: ['Credits (In)', 'Debits (Out)', 'Transfers'],
            datasets: [{
                data: processTransactionTypes(history),
                backgroundColor: ['#002d6e', '#246df0', '#64748b']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return '$' + context.raw.toFixed(2);
                        }
                    }
                }
            }
        }
    });

    // Financial Trends Chart
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: trends.labels,
            datasets: [{
                label: 'Income',
                data: trends.income,
                borderColor: '#002d6e',
                tension: 0.1
            }, {
                label: 'Expenses',
                data: trends.expenses,
                borderColor: '#246df0',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                }
            }
        }
    });
});