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
                            return '$' + (value / 100).toFixed(2);
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
                data: [budgetData.spent / 100, budgetData.remaining / 100],
                backgroundColor: ['#002d6e', '#246df0']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return '$' + (context.raw).toFixed(2);
                        }
                    }
                }
            }
        }
    });

    // Transaction Types Chart
    const investmentCtx = document.getElementById('investmentChart').getContext('2d');
    new Chart(investmentCtx, {
        type: 'pie',
        data: {
            labels: ['Deposits', 'Withdrawals', 'Transfers', 'Payments'],
            datasets: [{
                data: processTransactionTypes(history).map(val => val / 100),
                backgroundColor: ['#002d6e', '#246df0', '#64748b', '#e2e8f0']
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
                data: trends.income.map(val => val / 100),
                borderColor: '#002d6e',
                tension: 0.1
            }, {
                label: 'Expenses',
                data: trends.expenses.map(val => val / 100),
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
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.raw.toFixed(2);
                        }
                    }
                }
            }
        }
    });
});

function processMonthlySpending(history) {
    const months = {};
    const currentDate = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        months[monthNames[d.getMonth()]] = 0;
    }

    // Process transactions
    history.forEach(transaction => {
        const date = new Date(transaction.timestamp);
        const monthName = monthNames[date.getMonth()];
        if (months.hasOwnProperty(monthName)) {
            const amount = Math.abs(transaction.amount);
            months[monthName] += amount;
        }
    });

    return {
        labels: Object.keys(months),
        data: Object.values(months)
    };
}

function processBudgetData(history) {
    const monthlyBudget = 500000; // Budget amount in cents ($5000.00)
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let spent = 0;
    history.forEach(transaction => {
        if (transaction.type === 'DEBIT') {
            const date = new Date(transaction.timestamp);
            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                spent += Math.abs(transaction.amount);
            }
        }
    });

    return {
        spent: spent,
        remaining: Math.max(0, monthlyBudget - spent)
    };
}

function processTransactionTypes(history) {
    const totals = {
        deposits: 0,
        withdrawals: 0,
        transfers: 0,
        payments: 0
    };

    history.forEach(transaction => {
        const amount = Math.abs(transaction.amount);
        if (transaction.type === 'CREDIT') {
            if (transaction.label && transaction.label.toLowerCase().includes('transfer')) {
                totals.transfers += amount;
            } else {
                totals.deposits += amount;
            }
        } else if (transaction.type === 'DEBIT') {
            if (transaction.label && transaction.label.toLowerCase().includes('transfer')) {
                totals.transfers += amount;
            } else if (transaction.label && transaction.label.toLowerCase().includes('withdrawal')) {
                totals.withdrawals += amount;
            } else {
                totals.payments += amount;
            }
        }
    });

    return [totals.deposits, totals.withdrawals, totals.transfers, totals.payments];
}

function processFinancialTrends(history) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const income = new Array(12).fill(0);
    const expenses = new Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    history.forEach(transaction => {
        const date = new Date(transaction.timestamp);
        if (date.getFullYear() === currentYear) {
            const month = date.getMonth();
            const amount = Math.abs(transaction.amount);
            if (transaction.type === 'CREDIT') {
                income[month] += amount;
            } else {
                expenses[month] += amount;
            }
        }
    });

    return {
        labels: months,
        income: income,
        expenses: expenses
    };
}