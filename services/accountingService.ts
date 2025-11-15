
import { Sale, Purchase, Expense, JournalEntry, Account, TrialBalanceLine, LedgerEntry, Product } from '../types';

interface AppState {
    sales: Sale[];
    purchases: Purchase[];
    expenses: Expense[];
    journalEntries: JournalEntry[];
    accounts: Account[];
    products: Product[];
}

// A simple in-memory representation of ledger balances
type LedgerBalances = { [accountId: string]: { debit: number; credit: number } };

function getProductCost(productId: string, products: Product[]): number {
    const product = products.find(p => p.id === productId);
    return product ? product.purchasePrice : 0;
}

export const generateTrialBalance = (state: AppState): TrialBalanceLine[] => {
    const balances: LedgerBalances = {};
    const { accounts, sales, purchases, expenses, journalEntries, products } = state;

    accounts.forEach(acc => {
        balances[acc.id] = { debit: 0, credit: 0 };
    });

    // Process Sales
    sales.forEach(sale => {
        balances['102'].debit += sale.total; // Dr Accounts Receivable
        balances['401'].credit += sale.total; // Cr Sales Revenue

        const cogs = sale.items.reduce((sum, item) => {
            return sum + (item.quantity * getProductCost(item.productId, products));
        }, 0);

        balances['501'].debit += cogs; // Dr COGS
        balances['103'].credit += cogs; // Cr Inventory
    });

    // Process Purchases
    purchases.forEach(purchase => {
        balances['103'].debit += purchase.total; // Dr Inventory
        balances['201'].credit += purchase.total; // Cr Accounts Payable
    });

    // Process Expenses
    expenses.forEach(expense => {
        // Find expense account or use a generic one
        const expenseAccount = accounts.find(a => a.name.toLowerCase().includes(expense.category.toLowerCase()) && a.type === 'Expense') || { id: '503' };
        balances[expenseAccount.id].debit += expense.amount; // Dr Expense Account
        balances['101'].credit += expense.amount; // Cr Cash
    });

    // Process Journal Entries
    journalEntries.forEach(je => {
        je.lines.forEach(line => {
            balances[line.accountId].debit += line.debit;
            balances[line.accountId].credit += line.credit;
        });
    });

    return accounts.map(acc => ({
        accountId: acc.id,
        accountName: acc.name,
        debit: balances[acc.id].debit,
        credit: balances[acc.id].credit,
    }));
};

// Other service functions can be added here
export const getDashboardSummary = (state: AppState) => {
    const totalSales = state.sales.reduce((sum, s) => sum + s.total, 0);
    const totalPurchases = state.purchases.reduce((sum, p) => sum + p.total, 0);
    const totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
    const cogs = state.sales.reduce((sum, sale) => {
        return sum + sale.items.reduce((itemSum, item) => {
             return itemSum + (item.quantity * getProductCost(item.productId, state.products));
        }, 0);
    }, 0);
    const grossProfit = totalSales - cogs;
    const netProfit = grossProfit - totalExpenses;
    const inventoryItemsCount = state.products.length;

    return { totalSales, totalPurchases, totalExpenses, grossProfit, netProfit, inventoryItemsCount };
}

export const getChartData = (state: AppState) => {
    const salesByMonth: { [key: string]: number } = {};
    const purchasesByMonth: { [key: string]: number } = {};

    state.sales.forEach(s => {
        const month = new Date(s.date).toLocaleString('default', { month: 'short' });
        salesByMonth[month] = (salesByMonth[month] || 0) + s.total;
    });

    state.purchases.forEach(p => {
        const month = new Date(p.date).toLocaleString('default', { month: 'short' });
        purchasesByMonth[month] = (purchasesByMonth[month] || 0) + p.total;
    });

    const months = [...new Set([...Object.keys(salesByMonth), ...Object.keys(purchasesByMonth)])];
    
    const salesPurchasesData = months.map(month => ({
        name: month,
        sales: salesByMonth[month] || 0,
        purchases: purchasesByMonth[month] || 0
    }));

    // Dummy profit trend data
     const profitTrendData = [
        { name: 'Jul', profit: 2000 },
        { name: 'Aug', profit: 2500 },
        { name: 'Sep', profit: 2200 },
        { name: 'Oct', profit: 3100 },
    ];

    return { salesPurchasesData, profitTrendData };
}

export const generateProfitAndLoss = (state: AppState) => {
    const summary = getDashboardSummary(state);
    const cogs = state.sales.reduce((sum, sale) => {
        return sum + sale.items.reduce((itemSum, item) => {
             return itemSum + (item.quantity * getProductCost(item.productId, state.products));
        }, 0);
    }, 0);

    return {
        revenue: summary.totalSales,
        cogs: cogs,
        grossProfit: summary.grossProfit,
        expenses: state.expenses,
        totalExpenses: summary.totalExpenses,
        netProfit: summary.netProfit,
    };
};

export const generateBalanceSheet = (state: AppState) => {
    const trialBalance = generateTrialBalance(state);
    const { accounts } = state;
    
    const assets = trialBalance.filter(line => accounts.find(a => a.id === line.accountId)?.type === 'Asset')
        .map(line => ({ name: line.accountName, value: line.debit - line.credit }));
    
    const liabilities = trialBalance.filter(line => accounts.find(a => a.id === line.accountId)?.type === 'Liability')
        .map(line => ({ name: line.accountName, value: line.credit - line.debit }));
        
    const equity = trialBalance.filter(line => accounts.find(a => a.id === line.accountId)?.type === 'Equity')
        .map(line => ({ name: line.accountName, value: line.credit - line.debit }));

    const { netProfit } = generateProfitAndLoss(state);
    equity.push({ name: "Retained Earnings (Net Profit)", value: netProfit });

    const totalAssets = assets.reduce((sum, item) => sum + item.value, 0);
    const totalLiabilitiesAndEquity = liabilities.reduce((sum, item) => sum + item.value, 0) + equity.reduce((sum, item) => sum + item.value, 0);

    return {
        assets,
        liabilities,
        equity,
        totalAssets,
        totalLiabilitiesAndEquity
    };
};
