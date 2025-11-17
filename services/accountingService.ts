
import { Sale, Purchase, Expense, JournalEntry, Account, TrialBalanceLine, LedgerEntry, Product, AccountType } from '../types';

interface AppState {
    sales: Sale[];
    purchases: Purchase[];
    expenses: Expense[];
    journalEntries: JournalEntry[];
    accounts: Account[];
    products: Product[];
}

/**
 * Generates a Trial Balance exclusively from the general ledger (journal entries).
 * This is the single source of truth for all account balances.
 */
export const generateTrialBalance = (state: AppState): TrialBalanceLine[] => {
    const balances: { [accountId: string]: { debit: number; credit: number } } = {};
    const { accounts, journalEntries } = state;

    // Initialize balances for all accounts
    accounts.forEach(acc => {
        balances[acc.id] = { debit: 0, credit: 0 };
    });

    // Process all journal entries to calculate balances
    journalEntries.forEach(je => {
        je.lines.forEach(line => {
            if (balances[line.accountId]) {
                balances[line.accountId].debit += line.debit;
                balances[line.accountId].credit += line.credit;
            }
        });
    });

    return accounts.map(acc => ({
        accountId: acc.id,
        accountName: acc.name,
        debit: balances[acc.id]?.debit || 0,
        credit: balances[acc.id]?.credit || 0,
    }));
};

/**
 * Generates a detailed ledger for a specific account by filtering the main journal.
 */
export const generateLedgerForAccount = (accountId: string, state: AppState): LedgerEntry[] => {
    const transactions: Omit<LedgerEntry, 'balance'>[] = [];
    const { journalEntries, accounts } = state;

    const selectedAccount = accounts.find(a => a.id === accountId);
    if (!selectedAccount) return [];

    // Filter journal entries for transactions affecting the selected account
    journalEntries.forEach(je => {
        je.lines.forEach(line => {
            if (line.accountId === accountId) {
                transactions.push({ date: je.date, description: je.description, debit: line.debit, credit: line.credit });
            }
        });
    });

    // Sort transactions chronologically
    transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate running balance
    let balance = 0;
    const isDebitNormal = ['Asset', 'Expense'].includes(selectedAccount.type);

    return transactions.map(tx => {
        if (isDebitNormal) {
            balance += tx.debit - tx.credit;
        } else {
            balance += tx.credit - tx.debit;
        }
        return { ...tx, balance };
    });
};

/**
 * Generates the Profit & Loss statement from the Trial Balance.
 */
export const generateProfitAndLoss = (state: AppState) => {
    const trialBalance = generateTrialBalance(state);
    const { accounts } = state;

    const getBalance = (accType: AccountType, tb: TrialBalanceLine[]) => {
        return tb.filter(line => accounts.find(a => a.id === line.accountId)?.type === accType)
                 .reduce((sum, line) => sum + (line.credit - line.debit), 0);
    };
    
    const getExpenseBalance = (tb: TrialBalanceLine[]) => {
        return tb.filter(line => accounts.find(a => a.id === line.accountId)?.type === 'Expense')
                 .reduce((sum, line) => sum + (line.debit - line.credit), 0);
    };
    
    const revenue = getBalance('Revenue', trialBalance);
    const cogsLine = trialBalance.find(line => line.accountId === '501'); // COGS account
    const cogs = cogsLine ? cogsLine.debit - cogsLine.credit : 0;
    
    const allExpenses = getExpenseBalance(trialBalance);
    const operatingExpenses = allExpenses - cogs;
    
    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - operatingExpenses;

    // For display, we can still list individual expense records
    const expenseRecords = state.expenses;

    return {
        revenue,
        cogs,
        grossProfit,
        expenses: expenseRecords, // For detailed listing
        totalExpenses: allExpenses, // From trial balance
        netProfit,
    };
};

/**
 * Generates the Balance Sheet from the Trial Balance and P&L.
 */
export const generateBalanceSheet = (state: AppState) => {
    const trialBalance = generateTrialBalance(state);
    const { accounts } = state;
    
    const getAccountGroup = (type: AccountType) => {
      const isDebitNormal = ['Asset', 'Expense'].includes(type);
      return trialBalance
        .filter(line => accounts.find(a => a.id === line.accountId)?.type === type)
        .map(line => ({ 
            name: line.accountName, 
            value: isDebitNormal ? line.debit - line.credit : line.credit - line.debit 
        }));
    };

    const assets = getAccountGroup('Asset');
    const liabilities = getAccountGroup('Liability');
    const equity = getAccountGroup('Equity');

    const { netProfit } = generateProfitAndLoss(state);
    equity.push({ name: "Retained Earnings (Current Period)", value: netProfit });

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

/**
 * Gets summary data for the dashboard.
 * Uses high-level records for totals and JE-based reports for financial metrics.
 */
export const getDashboardSummary = (state: AppState) => {
    const totalSales = state.sales.reduce((sum, s) => sum + s.total, 0);
    const totalPurchases = state.purchases.reduce((sum, p) => sum + p.total, 0);
    const totalExpensesRecords = state.expenses.reduce((sum, e) => sum + e.amount, 0);
    const { grossProfit, netProfit } = generateProfitAndLoss(state);
    
    const totalProducts = state.products.length;
    const lowStockProducts = state.products.filter(p => p.stock <= 10);

    return { totalSales, totalPurchases, totalExpenses: totalExpensesRecords, grossProfit, netProfit, totalProducts, lowStockProducts };
}

/**
 * Gets data formatted for charts.
 */
export const getChartData = (state: AppState) => {
    const salesByMonth: { [key: string]: number } = {};
    const purchasesByMonth: { [key: string]: number } = {};

    [...state.sales].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(s => {
        const month = new Date(s.date).toLocaleString('default', { month: 'short' });
        salesByMonth[month] = (salesByMonth[month] || 0) + s.total;
    });

    [...state.purchases].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(p => {
        const month = new Date(p.date).toLocaleString('default', { month: 'short' });
        purchasesByMonth[month] = (purchasesByMonth[month] || 0) + p.total;
    });

    const months = [...new Set([...Object.keys(salesByMonth), ...Object.keys(purchasesByMonth)])];
    
    const salesPurchasesData = months.map(month => ({
        name: month,
        sales: salesByMonth[month] || 0,
        purchases: purchasesByMonth[month] || 0
    }));

    const profitDataByMonth: { [key: string]: number } = {};
    const { accounts, journalEntries } = state;
    
    [...journalEntries].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(je => {
        const month = new Date(je.date).toLocaleString('default', { month: 'short' });
        if(!profitDataByMonth[month]) profitDataByMonth[month] = 0;
        
        je.lines.forEach(line => {
            const account = accounts.find(a => a.id === line.accountId);
            if(account?.type === 'Revenue') {
                profitDataByMonth[month] += line.credit - line.debit;
            } else if(account?.type === 'Expense') {
                profitDataByMonth[month] -= line.debit - line.credit;
            }
        });
    });

    const profitTrendData = Object.keys(profitDataByMonth).map(month => ({
        name: month,
        profit: profitDataByMonth[month]
    }));


    return { salesPurchasesData, profitTrendData };
}
