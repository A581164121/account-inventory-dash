import { Customer, Supplier, Product, Sale, Purchase, Expense, JournalEntry, Account, User, Department, UserRole } from '../types';

// IMPORTANT: This is a frontend simulation of password hashing.
// In a real application, you would use a library like bcrypt on the server.
// DO NOT use this approach in production.
const FAKE_SALT = 'a_very_salty_salt_string';
const fakeHash = (password: string): string => `bcrypt_sim_${password}_${FAKE_SALT}`;

// Fix: Added missing editHistory property to satisfy the Auditable interface.
const defaultAudit = {
    createdAt: new Date().toISOString(),
    createdBy: 'USER-01',
    isDeleted: false,
    editHistory: [],
};

export const MOCK_DEPARTMENTS: Department[] = [
    { id: 'DEPT-01', name: 'Sales' },
    { id: 'DEPT-02', name: 'Purchases' },
    { id: 'DEPT-03', name: 'Accounting' },
    { id: 'DEPT-04', name: 'Management' },
    { id: 'DEPT-05', name: 'System Administration' },
];

export const MOCK_USERS: User[] = [
    { id: 'USER-01', name: 'Alice (Super Admin)', email: 'alice@example.com', passwordHash: fakeHash('123456'), role: UserRole.SUPER_ADMIN, departmentId: 'DEPT-05', isActive: true, createdAt: '2023-01-01T10:00:00Z' },
    { id: 'USER-02', name: 'Bob (Admin)', email: 'bob@example.com', passwordHash: fakeHash('123456'), role: UserRole.ADMIN, departmentId: 'DEPT-05', isActive: true, createdAt: '2023-01-02T10:00:00Z' },
    { id: 'USER-03', name: 'Charlie (Sales Manager)', email: 'charlie@example.com', passwordHash: fakeHash('password'), role: UserRole.SALES_MANAGER, departmentId: 'DEPT-01', isActive: true, createdAt: '2023-01-03T10:00:00Z' },
    { id: 'USER-04', name: 'David (Sales Staff)', email: 'david@example.com', passwordHash: fakeHash('password'), role: UserRole.SALES_STAFF, departmentId: 'DEPT-01', isActive: true, createdAt: '2023-01-04T10:00:00Z' },
    { id: 'USER-05', name: 'Eve (Purchase Manager)', email: 'eve@example.com', passwordHash: fakeHash('password'), role: UserRole.PURCHASE_MANAGER, departmentId: 'DEPT-02', isActive: true, createdAt: '2023-01-05T10:00:00Z' },
    { id: 'USER-06', name: 'Frank (Purchase Staff)', email: 'frank@example.com', passwordHash: fakeHash('password'), role: UserRole.PURCHASE_STAFF, departmentId: 'DEPT-02', isActive: true, createdAt: '2023-01-06T10:00:00Z' },
    { id: 'USER-07', name: 'Grace (Accounts Manager)', email: 'grace@example.com', passwordHash: fakeHash('password'), role: UserRole.ACCOUNTS_MANAGER, departmentId: 'DEPT-03', isActive: true, createdAt: '2023-01-07T10:00:00Z' },
    { id: 'USER-08', name: 'Heidi (GL Staff)', email: 'heidi@example.com', passwordHash: fakeHash('password'), role: UserRole.GENERAL_LEDGER_STAFF, departmentId: 'DEPT-03', isActive: false, createdAt: '2023-01-08T10:00:00Z' },
    { id: 'USER-09', name: 'Muhammad Akbar', email: 'infolmakbar@gmail.com', passwordHash: fakeHash('123456'), role: UserRole.CUSTOM, departmentId: 'DEPT-01', isActive: true, createdAt: '2023-01-09T10:00:00Z' },
];


export const MOCK_ACCOUNTS: Account[] = [
    { id: '101', name: 'Cash', type: 'Asset' },
    { id: '102', name: 'Accounts Receivable', type: 'Asset' },
    { id: '103', name: 'Inventory', type: 'Asset' },
    { id: '104', name: 'Input Tax Credit', type: 'Asset' },
    { id: '201', name: 'Accounts Payable', type: 'Liability' },
    { id: '202', name: 'Sales Tax Payable', type: 'Liability' },
    { id: '301', name: 'Owner\'s Equity', type: 'Equity' },
    { id: '401', name: 'Sales Revenue', type: 'Revenue' },
    { id: '501', name: 'Cost of Goods Sold', type: 'Expense' },
    { id: '502', name: 'Rent Expense', type: 'Expense' },
    { id: '503', name: 'Utilities Expense', type: 'Expense' },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'CUST-001', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', address: '123 Main St', status: 'active', ...defaultAudit },
  { id: 'CUST-002', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321', address: '456 Oak Ave', status: 'active', ...defaultAudit },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'SUP-001', name: 'Global Supplies Inc.', email: 'contact@globalsupplies.com', phone: '555-123-4567', address: '789 Industrial Park', status: 'active', ...defaultAudit },
  { id: 'SUP-002', name: 'Component Masters', email: 'sales@componentmasters.com', phone: '555-987-6543', address: '101 Tech Way', status: 'active', ...defaultAudit },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'PROD-001', name: 'Laptop Pro 15"', sku: 'LP15', category: 'Electronics', unit: 'pcs', description: 'A powerful 15-inch laptop.', purchasePrice: 800, salePrice: 1200, stock: 50, status: 'active', ...defaultAudit },
  { id: 'PROD-002', name: 'Wireless Mouse', sku: 'WM01', category: 'Accessories', unit: 'pcs', description: 'Ergonomic wireless mouse.', purchasePrice: 15, salePrice: 30, stock: 200, status: 'active', ...defaultAudit },
  { id: 'PROD-003', name: 'Mechanical Keyboard', sku: 'MK02', category: 'Accessories', unit: 'pcs', description: 'RGB Mechanical Keyboard.', purchasePrice: 60, salePrice: 100, stock: 100, status: 'active', ...defaultAudit },
  { id: 'PROD-004', name: '27" 4K Monitor', sku: 'MON27', category: 'Electronics', unit: 'pcs', description: 'A 27-inch 4K UHD Monitor.', purchasePrice: 250, salePrice: 400, stock: 50, status: 'active', ...defaultAudit },
];

export const MOCK_SALES: Sale[] = [
  {
    id: 'SALE-001', invoiceNumber: 'INV-2023-001', customerId: 'CUST-001', date: '2023-10-01',
    items: [{ productId: 'PROD-001', quantity: 1, price: 1200 }],
    subtotal: 1200, taxRate: 0, taxAmount: 0, total: 1200, 
    status: 'approved', createdBy: 'USER-04', createdAt: '2023-10-01T10:00:00Z', isDeleted: false,
    // Fix: Added missing properties to satisfy the Sale type.
    paymentMethod: 'Credit', departmentId: 'DEPT-01', editHistory: [],
  },
  {
    id: 'SALE-002', invoiceNumber: 'INV-2023-002', customerId: 'CUST-002', date: '2023-10-15',
    items: [
      { productId: 'PROD-002', quantity: 2, price: 30 },
      { productId: 'PROD-003', quantity: 1, price: 100 }
    ],
    subtotal: 160, taxRate: 0, taxAmount: 0, total: 160,
    status: 'approved', createdBy: 'USER-04', createdAt: '2023-10-15T10:00:00Z', isDeleted: false,
    // Fix: Added missing properties to satisfy the Sale type.
    paymentMethod: 'Cash', departmentId: 'DEPT-01', editHistory: [],
  }
];

export const MOCK_PURCHASES: Purchase[] = [
    {
        id: 'PUR-001', invoiceNumber: 'PINV-2023-001', supplierId: 'SUP-001', date: '2023-09-15',
        items: [{ productId: 'PROD-001', quantity: 20, price: 800 }],
        subtotal: 16000, taxRate: 0, taxAmount: 0, total: 16000,
        status: 'approved', createdBy: 'USER-06', createdAt: '2023-09-15T10:00:00Z', isDeleted: false,
        // Fix: Added missing properties to satisfy the Purchase type.
        paymentMethod: 'Credit', departmentId: 'DEPT-02', editHistory: [],
    },
    {
        id: 'PUR-002', invoiceNumber: 'PINV-2023-002', supplierId: 'SUP-002', date: '2023-09-20',
        items: [{ productId: 'PROD-002', quantity: 100, price: 15 }],
        subtotal: 1500, taxRate: 0, taxAmount: 0, total: 1500,
        status: 'approved', createdBy: 'USER-06', createdAt: '2023-09-20T10:00:00Z', isDeleted: false,
        // Fix: Added missing properties to satisfy the Purchase type.
        paymentMethod: 'Credit', departmentId: 'DEPT-02', editHistory: [],
    }
];

export const MOCK_EXPENSES: Expense[] = [
    { id: 'EXP-001', category: 'Rent', date: '2023-10-01', amount: 2000, description: 'Office Rent for October', status: 'approved', createdBy: 'USER-08', createdAt: '2023-10-01T11:00:00Z', isDeleted: false, departmentId: 'DEPT-03', editHistory: [] },
    { id: 'EXP-002', category: 'Utilities', date: '2023-10-05', amount: 350, description: 'Electricity and Water bill', status: 'approved', createdBy: 'USER-08', createdAt: '2023-10-05T11:00:00Z', isDeleted: false, departmentId: 'DEPT-03', editHistory: [] }
];

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
    {
        id: 'JE-001', date: '2023-10-31', description: 'Owner investment',
        lines: [
            { accountId: '101', debit: 5000, credit: 0 },
            { accountId: '301', debit: 0, credit: 5000 }
        ], status: 'approved', createdBy: 'USER-07', createdAt: '2023-10-31T12:00:00Z', isDeleted: false,
        // Fix: Added missing editHistory property to satisfy the JournalEntry type.
        editHistory: [],
    }
];

export const MOCK_DATA_MAP: Record<string, any[]> = {
    customers: MOCK_CUSTOMERS,
    suppliers: MOCK_SUPPLIERS,
    products: MOCK_PRODUCTS,
    sales: MOCK_SALES,
    purchases: MOCK_PURCHASES,
    expenses: MOCK_EXPENSES,
    journal_entries: MOCK_JOURNAL_ENTRIES,
    accounts: MOCK_ACCOUNTS,
    users: MOCK_USERS,
    departments: MOCK_DEPARTMENTS,
    activity_log: [],
    approval_requests: [],
};
