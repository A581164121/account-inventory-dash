import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Customer, Supplier, Product, Sale, Purchase, Expense, JournalEntry, Account } from '../types';
import { MOCK_CUSTOMERS, MOCK_SUPPLIERS, MOCK_PRODUCTS, MOCK_SALES, MOCK_PURCHASES, MOCK_EXPENSES, MOCK_JOURNAL_ENTRIES, MOCK_ACCOUNTS } from '../data/mockData';

interface AppContextType {
  customers: Customer[];
  suppliers: Supplier[];
  products: Product[];
  sales: Sale[];
  purchases: Purchase[];
  expenses: Expense[];
  journalEntries: JournalEntry[];
  accounts: Account[];
  addSale: (sale: Omit<Sale, 'id'>) => void;
  addPurchase: (purchase: Omit<Purchase, 'id'>) => void;
  // Add more state and functions as needed
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);
  const [purchases, setPurchases] = useState<Purchase[]>(MOCK_PURCHASES);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(MOCK_JOURNAL_ENTRIES);
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);

  const addSale = (sale: Omit<Sale, 'id'>) => {
    const newSale = { ...sale, id: `SALE-${Date.now()}` };
    setSales(prev => [...prev, newSale]);
    // Update stock
    newSale.items.forEach(item => {
      setProducts(prevProducts => prevProducts.map(p => 
        p.id === item.productId ? { ...p, stock: p.stock - item.quantity } : p
      ));
    });
  };

  const addPurchase = (purchase: Omit<Purchase, 'id'>) => {
    const newPurchase = { ...purchase, id: `PUR-${Date.now()}` };
    setPurchases(prev => [newPurchase, ...prev]);
    // Update stock
    newPurchase.items.forEach(item => {
        setProducts(prevProducts => prevProducts.map(p =>
            p.id === item.productId ? { ...p, stock: p.stock + item.quantity } : p
        ));
    });
  };

  // Here you would add functions for addExpense, etc.

  const value = {
    customers,
    suppliers,
    products,
    sales,
    purchases,
    expenses,
    journalEntries,
    accounts,
    addSale,
    addPurchase,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
