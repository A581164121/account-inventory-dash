
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  customerId: string;
  date: string;
  items: SaleItem[];
  total: number;
}

export interface PurchaseItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  date: string;
  items: PurchaseItem[];
  total: number;
}

export interface Expense {
  id: string;
  category: string;
  date: string;
  amount: number;
  description: string;
}

export interface JournalEntryLine {
  accountId: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  lines: JournalEntryLine[];
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
