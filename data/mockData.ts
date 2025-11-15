
import { Customer, Supplier, Product, Sale, Purchase, Expense, JournalEntry, Account, AccountType } from '../types';

export const MOCK_ACCOUNTS: Account[] = [
    { id: '101', name: 'Cash', type: 'Asset' },
    { id: '102', name: 'Accounts Receivable', type: 'Asset' },
    { id: '103', name: 'Inventory', type: 'Asset' },
    { id: '201', name: 'Accounts Payable', type: 'Liability' },
    { id: '301', name: 'Owner\'s Equity', type: 'Equity' },
    { id: '401', name: 'Sales Revenue', type: 'Revenue' },
    { id: '501', name: 'Cost of Goods Sold', type: 'Expense' },
    { id: '502', name: 'Rent Expense', type: 'Expense' },
    { id: '503', name: 'Utilities Expense', type: 'Expense' },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'CUST-001', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', address: '123 Main St' },
  { id: 'CUST-002', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321', address: '456 Oak Ave' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'SUP-001', name: 'Global Supplies Inc.', email: 'contact@globalsupplies.com', phone: '555-123-4567', address: '789 Industrial Park' },
  { id: 'SUP-002', name: 'Component Masters', email: 'sales@componentmasters.com', phone: '555-987-6543', address: '101 Tech Way' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'PROD-001', name: 'Laptop Pro 15"', sku: 'LP15', purchasePrice: 800, salePrice: 1200, stock: 50 },
  { id: 'PROD-002', name: 'Wireless Mouse', sku: 'WM01', purchasePrice: 15, salePrice: 30, stock: 200 },
  { id: 'PROD-003', name: 'Mechanical Keyboard', sku: 'MK02', purchasePrice: 60, salePrice: 100, stock: 100 },
];

export const MOCK_SALES: Sale[] = [
  {
    id: 'SALE-001', customerId: 'CUST-001', date: '2023-10-01',
    items: [{ productId: 'PROD-001', quantity: 1, price: 1200 }],
    total: 1200
  },
  {
    id: 'SALE-002', customerId: 'CUST-002', date: '2023-10-15',
    items: [
      { productId: 'PROD-002', quantity: 2, price: 30 },
      { productId: 'PROD-003', quantity: 1, price: 100 }
    ],
    total: 160
  }
];

export const MOCK_PURCHASES: Purchase[] = [
    {
        id: 'PUR-001', supplierId: 'SUP-001', date: '2023-09-15',
        items: [{ productId: 'PROD-001', quantity: 20, price: 800 }],
        total: 16000
    },
    {
        id: 'PUR-002', supplierId: 'SUP-002', date: '2023-09-20',
        items: [{ productId: 'PROD-002', quantity: 100, price: 15 }],
        total: 1500
    }
];

export const MOCK_EXPENSES: Expense[] = [
    { id: 'EXP-001', category: 'Rent', date: '2023-10-01', amount: 2000, description: 'Office Rent for October' },
    { id: 'EXP-002', category: 'Utilities', date: '2023-10-05', amount: 350, description: 'Electricity and Water bill' }
];

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
    {
        id: 'JE-001', date: '2023-10-31', description: 'Owner investment',
        lines: [
            { accountId: '101', debit: 5000, credit: 0 },
            { accountId: '301', debit: 0, credit: 5000 }
        ]
    }
];
