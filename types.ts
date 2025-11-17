export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  SALES_MANAGER = 'Sales Manager',
  SALES_ASSISTANT = 'Sales Assistant',
  SALES_STAFF = 'Sales Staff',
  PURCHASE_MANAGER = 'Purchase Manager',
  PURCHASE_ASSISTANT = 'Purchase Assistant',
  PURCHASE_STAFF = 'Purchase Staff',
  ACCOUNTS_MANAGER = 'Accounts Manager',
  GENERAL_LEDGER_STAFF = 'General Ledger Staff',
  CUSTOM = 'Custom Role',
}

export interface ThemeColors {
  id: 'themeColors';
  primary: string;
  secondary: string;
}

export interface CompanyProfile {
  id: 'companyProfile';
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  salesTaxRate: number;
}

export interface LogoUrl {
    id: 'logoUrl';
    url: string | null;
}

export enum Permission {
  // General
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',
  ACCESS_ADMIN_PANEL = 'ACCESS_ADMIN_PANEL',

  // User Management
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_ROLES = 'MANAGE_ROLES',
  
  // Activity Log
  VIEW_ACTIVITY_LOG = 'VIEW_ACTIVITY_LOG',
  
  // Branding
  MANAGE_BRANDING = 'MANAGE_BRANDING',

  // Customers
  CREATE_CUSTOMER = 'CREATE_CUSTOMER',
  VIEW_CUSTOMER = 'VIEW_CUSTOMER',
  EDIT_CUSTOMER = 'EDIT_CUSTOMER',
  REQUEST_DELETE_CUSTOMER = 'REQUEST_DELETE_CUSTOMER',
  APPROVE_DELETE_CUSTOMER = 'APPROVE_DELETE_CUSTOMER',
  
  // Sales
  CREATE_SALE = 'CREATE_SALE',
  VIEW_SALE = 'VIEW_SALE',
  EDIT_SALE = 'EDIT_SALE',
  REQUEST_DELETE_SALE = 'REQUEST_DELETE_SALE',
  APPROVE_DELETE_SALE = 'APPROVE_DELETE_SALE',
  APPROVE_SALE_EDIT = 'APPROVE_SALE_EDIT',

  // Purchases
  CREATE_PURCHASE = 'CREATE_PURCHASE',
  VIEW_PURCHASE = 'VIEW_PURCHASE',
  EDIT_PURCHASE = 'EDIT_PURCHASE',
  REQUEST_DELETE_PURCHASE = 'REQUEST_DELETE_PURCHASE',
  APPROVE_DELETE_PURCHASE = 'APPROVE_DELETE_PURCHASE',
  APPROVE_PURCHASE = 'APPROVE_PURCHASE',

  // Journal Entries
  CREATE_JOURNAL_ENTRY = 'CREATE_JOURNAL_ENTRY',
  VIEW_JOURNAL_ENTRY = 'VIEW_JOURNAL_ENTRY',
  EDIT_JOURNAL_ENTRY = 'EDIT_JOURNAL_ENTRY',
  REQUEST_DELETE_JOURNAL_ENTRY = 'REQUEST_DELETE_JOURNAL_ENTRY',
  APPROVE_DELETE_JOURNAL_ENTRY = 'APPROVE_DELETE_JOURNAL_ENTRY',
  APPROVE_JOURNAL_ENTRY = 'APPROVE_JOURNAL_ENTRY',

  // Expenses
  CREATE_EXPENSE = 'CREATE_EXPENSE',
  VIEW_EXPENSE = 'VIEW_EXPENSE',
  EDIT_EXPENSE = 'EDIT_EXPENSE',
  REQUEST_DELETE_EXPENSE = 'REQUEST_DELETE_EXPENSE',
  APPROVE_DELETE_EXPENSE = 'APPROVE_DELETE_EXPENSE',
  
  // Data Management
  MANAGE_DATA_BACKUP = 'MANAGE_DATA_BACKUP',

  // Audit Trail
  VIEW_AUDIT_TRAIL = 'VIEW_AUDIT_TRAIL',
}

export interface Department {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Changed from password. In a real app, this would be a bcrypt hash.
  role: UserRole;
  departmentId: string;
  isActive: boolean;
  createdAt: string;
}

export interface RoleDefinition {
  name: UserRole;
  permissions: Permission[];
}

export type RecordStatus = 'active' | 'pending_deletion' | 'deleted' | 'pending_approval' | 'approved' | 'rejected';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type RecordType = 'customer' | 'supplier' | 'product' | 'sale' | 'purchase' | 'expense' | 'journal_entry';


export interface ApprovalRequest {
  id: string;
  recordType: RecordType;
  recordId: string;
  requestedBy: string; // userId
  requestDate: string;
  status: ApprovalStatus;
  approvedBy?: string; // userId
  approvalDate?: string;
  notes?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  details: string;
}

export interface EditLog {
  timestamp: string;
  userId: string;
  field: string;
  oldValue: any;
  newValue: any;
}

interface Auditable {
    createdAt: string;
    createdBy: string; // userId
    updatedAt?: string;
    updatedBy?: string; // userId
    isDeleted: boolean;
    deletedAt?: string;
    deletedBy?: string; // userId
    editHistory: EditLog[];
}

export interface Customer extends Auditable {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status?: RecordStatus;
}

export interface Supplier extends Auditable {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status?: RecordStatus;
}

export interface Product extends Auditable {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  description: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  status?: RecordStatus;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
}

export type PaymentMethod = 'Cash' | 'Credit';

export interface Sale extends Auditable {
  id:string;
  invoiceNumber: string;
  customerId: string;
  date: string;
  items: SaleItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  journalEntryId?: string;
  status: RecordStatus;
  paymentMethod: PaymentMethod;
  departmentId: string;
}

export interface PurchaseItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Purchase extends Auditable {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  date: string;
  items: PurchaseItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  journalEntryId?: string;
  status: RecordStatus;
  paymentMethod: PaymentMethod;
  departmentId: string;
}

export interface Expense extends Auditable {
  id: string;
  category: string;
  date: string;
  amount: number;
  description: string;
  journalEntryId?: string;
  status: RecordStatus;
  departmentId: string;
}

export interface JournalEntryLine {
  accountId: string;
  debit: number;
  credit: number;
  productId?: string;
  quantity?: number;
  customerId?: string;
  supplierId?: string;
}

export interface JournalEntry extends Auditable {
  id: string;
  date: string;
  description: string;
  lines: JournalEntryLine[];
  status: RecordStatus;
}

export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
}

export interface LedgerEntry {
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface TrialBalanceLine {
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
}