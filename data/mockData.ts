
import { Customer, Supplier, Product, Sale, Purchase, Expense, JournalEntry, Account, User, Department, UserRole } from '../types';

export const MOCK_DEPARTMENTS: Department[] = [
    { id: 'DEPT-01', name: 'Sales' },
    { id: 'DEPT-02', name: 'Purchases' },
    { id: 'DEPT-03', name: 'Accounting' },
    { id: 'DEPT-04', name: 'Management' },
    { id: 'DEPT-05', name: 'System Administration' },
];

export const MOCK_USERS: User[] = [
    { id: 'USER-01', name: 'Alice (Super Admin)', email: 'alice@example.com', role: UserRole.SUPER_ADMIN, departmentId: 'DEPT-05', isActive: true },
    { id: 'USER-02', name: 'Bob (Admin)', email: 'bob@example.com', role: UserRole.ADMIN, departmentId: 'DEPT-05', isActive: true },
    { id: 'USER-03', name: 'Charlie (Sales Manager)', email: 'charlie@example.com', role: UserRole.SALES_MANAGER, departmentId: 'DEPT-01', isActive: true },
    { id: 'USER-04', name: 'David (Sales Staff)', email: 'david@example.com', role: UserRole.SALES_STAFF, departmentId: 'DEPT-01', isActive: true },
    { id: 'USER-05', name: 'Eve (Purchase Manager)', email: 'eve@example.com', role: UserRole.PURCHASE_MANAGER, departmentId: 'DEPT-02', isActive: true },
    { id: 'USER-06', name: 'Frank (Purchase Staff)', email: 'frank@example.com', role: UserRole.PURCHASE_STAFF, departmentId: 'DEPT-02', isActive: true },
    { id: 'USER-07', name: 'Grace (Accounts Manager)', email: 'grace@example.com', role: UserRole.ACCOUNTS_MANAGER, departmentId: 'DEPT-03', isActive: true },
    { id: 'USER-08', name: 'Heidi (GL Staff)', email: 'heidi@example.com', role: UserRole.GENERAL_LEDGER_STAFF, departmentId: 'DEPT-03', isActive: true },
];


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
  { id: 'CUST-001', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', address: '123 Main St', status: 'active' },
  { id: 'CUST-002', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321', address: '456 Oak Ave', status: 'active' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'SUP-001', name: 'Global Supplies Inc.', email: 'contact@globalsupplies.com', phone: '555-123-4567', address: '789 Industrial Park', status: 'active' },
  { id: 'SUP-002', name: 'Component Masters', email: 'sales@componentmasters.com', phone: '555-987-6543', address: '101 Tech Way', status: 'active' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'PROD-001', name: 'Laptop Pro 15"', sku: 'LP15', category: 'Electronics', unit: 'pcs', description: 'A powerful 15-inch laptop.', purchasePrice: 800, salePrice: 1200, stock: 50, status: 'active' },
  { id: 'PROD-002', name: 'Wireless Mouse', sku: 'WM01', category: 'Accessories', unit: 'pcs', description: 'Ergonomic wireless mouse.', purchasePrice: 15, salePrice: 30, stock: 200, status: 'active' },
  { id: 'PROD-003', name: 'Mechanical Keyboard', sku: 'MK02', category: 'Accessories', unit: 'pcs', description: 'RGB Mechanical Keyboard.', purchasePrice: 60, salePrice: 100, stock: 100, status: 'active' },
  { id: 'PROD-004', name: '27" 4K Monitor', sku: 'MON27', category: 'Electronics', unit: 'pcs', description: 'A 27-inch 4K UHD Monitor.', purchasePrice: 250, salePrice: 400, stock: 8, status: 'active' },
];

export const MOCK_SALES: Sale[] = [
  {
    id: 'SALE-001', invoiceNumber: 'INV-2023-001', customerId: 'CUST-001', date: '2023-10-01',
    items: [{ productId: 'PROD-001', quantity: 1, price: 1200 }],
    total: 1200, status: 'approved', createdBy: 'USER-04'
  },
  {
    id: 'SALE-002', invoiceNumber: 'INV-2023-002', customerId: 'CUST-002', date: '2023-10-15',
    items: [
      { productId: 'PROD-002', quantity: 2, price: 30 },
      { productId: 'PROD-003', quantity: 1, price: 100 }
    ],
    total: 160, status: 'approved', createdBy: 'USER-04'
  }
];

export const MOCK_PURCHASES: Purchase[] = [
    {
        id: 'PUR-001', invoiceNumber: 'PINV-2023-001', supplierId: 'SUP-001', date: '2023-09-15',
        items: [{ productId: 'PROD-001', quantity: 20, price: 800 }],
        total: 16000, status: 'approved', createdBy: 'USER-06'
    },
    {
        id: 'PUR-002', invoiceNumber: 'PINV-2023-002', supplierId: 'SUP-002', date: '2023-09-20',
        items: [{ productId: 'PROD-002', quantity: 100, price: 15 }],
        total: 1500, status: 'approved', createdBy: 'USER-06'
    }
];

export const MOCK_EXPENSES: Expense[] = [
    { id: 'EXP-001', category: 'Rent', date: '2023-10-01', amount: 2000, description: 'Office Rent for October', status: 'approved', createdBy: 'USER-08' },
    { id: 'EXP-002', category: 'Utilities', date: '2023-10-05', amount: 350, description: 'Electricity and Water bill', status: 'approved', createdBy: 'USER-08' }
];

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
    {
        id: 'JE-001', date: '2023-10-31', description: 'Owner investment',
        lines: [
            { accountId: '101', debit: 5000, credit: 0 },
            { accountId: '301', debit: 0, credit: 5000 }
        ], status: 'approved', createdBy: 'USER-07'
    }
];
