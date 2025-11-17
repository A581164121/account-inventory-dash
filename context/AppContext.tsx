
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Customer, Supplier, Product, Sale, Purchase, Expense, JournalEntry, Account, User, Department, ActivityLog, ApprovalRequest, RecordType, ApprovalStatus, RecordStatus, ThemeColors, CompanyProfile } from '../types';
import { MOCK_CUSTOMERS, MOCK_SUPPLIERS, MOCK_PRODUCTS, MOCK_SALES, MOCK_PURCHASES, MOCK_EXPENSES, MOCK_JOURNAL_ENTRIES, MOCK_ACCOUNTS, MOCK_DEPARTMENTS } from '../data/mockData';
import { useAuth } from './auth';

const defaultTheme: ThemeColors = {
  primary: '#4f46e5',
  secondary: '#10b981',
};

const defaultCompanyProfile: CompanyProfile = {
  name: 'Accounting ERP Inc.',
  address: '123 Business Rd.\nBusiness City, 12345',
  phone: '(123) 456-7890',
  email: 'contact@erp.com',
  website: 'www.erp.com'
};

interface AppContextType {
  customers: Customer[];
  suppliers: Supplier[];
  products: Product[];
  sales: Sale[];
  purchases: Purchase[];
  expenses: Expense[];
  journalEntries: JournalEntry[];
  accounts: Account[];
  users: Omit<User, 'passwordHash'>[];
  departments: Department[];
  activityLog: ActivityLog[];
  approvalRequests: ApprovalRequest[];
  logoUrl: string | null;
  themeColors: ThemeColors;
  companyProfile: CompanyProfile;

  setLogoUrl: (url: string | null) => void;
  setThemeColors: (colors: ThemeColors) => void;
  setCompanyProfile: (profile: CompanyProfile) => void;

  // User Management
  addUser: (user: Omit<User, 'id' | 'passwordHash' | 'createdAt'>, password: string) => User;
  updateUser: (user: Omit<User, 'passwordHash'>) => void;
  resetUserPassword: (userId: string, newPassword: string) => void;


  addCustomer: (customer: Omit<Customer, 'id' | 'status'>, userId: string) => void;
  updateCustomer: (customer: Customer, userId: string) => void;
  
  addSupplier: (supplier: Omit<Supplier, 'id' | 'status'>, userId: string) => void;
  updateSupplier: (supplier: Supplier, userId: string) => void;
  
  addProduct: (product: Omit<Product, 'id' | 'status'>, userId: string) => void;
  updateProduct: (product: Product, userId: string) => void;

  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  setPurchases: React.Dispatch<React.SetStateAction<Purchase[]>>;
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  setJournalEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;

  updateExpense: (expense: Expense, userId: string) => void;

  postJournalEntry: (entry: Omit<JournalEntry, 'id' | 'status'>, userId: string) => JournalEntry;

  // Approval Workflow
  requestDelete: (recordType: RecordType, recordId: string, userId: string) => void;
  approveRequest: (requestId: string, userId: string) => void;
  rejectRequest: (requestId: string, userId: string) => void;
  approveJournalEntry: (entryId: string, userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  // Main Data State
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);
  const [purchases, setPurchases] = useState<Purchase[]>(MOCK_PURCHASES);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(MOCK_JOURNAL_ENTRIES);
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);

  // Admin & Workflow State (Departments are static for now)
  const [departments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
  
  // Branding State
  const [logoUrl, setLogoUrlState] = useState<string | null>(() => localStorage.getItem('companyLogo'));
  const [themeColors, setThemeColorsState] = useState<ThemeColors>(() => {
    try {
      const savedTheme = localStorage.getItem('themeColors');
      return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
    } catch (error) {
      console.error("Failed to parse theme colors from localStorage", error);
      return defaultTheme;
    }
  });
  const [companyProfile, setCompanyProfileState] = useState<CompanyProfile>(() => {
    try {
      const savedProfile = localStorage.getItem('companyProfile');
      return savedProfile ? JSON.parse(savedProfile) : defaultCompanyProfile;
    } catch (error) {
      console.error("Failed to parse company profile from localStorage", error);
      return defaultCompanyProfile;
    }
  });


  const setLogoUrl = (url: string | null) => {
    setLogoUrlState(url);
    if (url) {
      localStorage.setItem('companyLogo', url);
    } else {
      localStorage.removeItem('companyLogo');
    }
  };

  const setThemeColors = (colors: ThemeColors) => {
    setThemeColorsState(colors);
    localStorage.setItem('themeColors', JSON.stringify(colors));
  };
  
  const setCompanyProfile = (profile: CompanyProfile) => {
    setCompanyProfileState(profile);
    localStorage.setItem('companyProfile', JSON.stringify(profile));
  };


  const logActivity = (userId: string, action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId,
      action,
      details,
    };
    setActivityLog(prev => [newLog, ...prev]);
  };
  
  // User Management Wrappers (integrate with AuthContext and add logging)
  const addUser = (user: Omit<User, 'id' | 'passwordHash' | 'createdAt'>, password: string): User => {
    if (!auth.currentUser) throw new Error("Authentication error");
    const newUser = auth.addUser(user, password);
    logActivity(auth.currentUser.id, 'Create User', `Created new user: ${newUser.name} (${newUser.email})`);
    return newUser;
  };

  const updateUser = (updatedUser: Omit<User, 'passwordHash'>) => {
    if (!auth.currentUser) throw new Error("Authentication error");
    auth.updateUser(updatedUser);
    logActivity(auth.currentUser.id, 'Update User', `Updated user details for: ${updatedUser.name} (ID: ${updatedUser.id})`);
  };

  const resetUserPassword = (userId: string, newPassword: string) => {
    if (!auth.currentUser) throw new Error("Authentication error");
    const targetUser = auth.users.find(u => u.id === userId);
    auth.resetUserPassword(userId, newPassword);
    logActivity(auth.currentUser.id, 'Reset Password', `Reset password for user: ${targetUser?.name || 'Unknown'} (ID: ${userId})`);
  };

  // Internal Delete Functions (only called by approval workflow)
  const _deleteCustomer = (id: string) => setCustomers(prev => prev.filter(c => c.id !== id));
  const _deleteSupplier = (id: string) => setSuppliers(prev => prev.filter(s => s.id !== id));
  const _deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  const _deleteSale = (id: string) => setSales(prev => prev.filter(s => s.id !== id));
  const _deletePurchase = (id: string) => setPurchases(prev => prev.filter(p => p.id !== id));
  const _deleteExpense = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));
  const _deleteJournalEntry = (id: string) => setJournalEntries(prev => prev.filter(je => je.id !== id));


  // Approval Workflow Logic
  const requestDelete = (recordType: RecordType, recordId: string, userId: string) => {
    const newRequest: ApprovalRequest = {
      id: `REQ-${Date.now()}`,
      recordType,
      recordId,
      requestedBy: userId,
      requestDate: new Date().toISOString(),
      status: 'pending',
    };
    setApprovalRequests(prev => [newRequest, ...prev]);

    // Mark the record as pending deletion
    const updater = (setter: React.Dispatch<React.SetStateAction<any[]>>) => {
        setter(prev => prev.map(r => r.id === recordId ? { ...r, status: 'pending_deletion' } : r));
    }
    
    switch(recordType) {
        case 'customer': updater(setCustomers); break;
        case 'supplier': updater(setSuppliers); break;
        case 'product': updater(setProducts); break;
        case 'sale': updater(setSales); break;
        case 'purchase': updater(setPurchases); break;
        case 'expense': updater(setExpenses); break;
        case 'journal_entry': updater(setJournalEntries); break;
    }

    logActivity(userId, `Requested Deletion`, `Record: ${recordType} #${recordId}`);
  };

  const approveRequest = (requestId: string, userId: string) => {
      const request = approvalRequests.find(r => r.id === requestId);
      if(!request) return;

      setApprovalRequests(prev => prev.map(r => r.id === requestId ? {...r, status: 'approved', approvedBy: userId, approvalDate: new Date().toISOString()} : r));
      
      switch(request.recordType) {
          case 'customer': _deleteCustomer(request.recordId); break;
          case 'supplier': _deleteSupplier(request.recordId); break;
          case 'product': _deleteProduct(request.recordId); break;
          case 'sale': _deleteSale(request.recordId); break;
          case 'purchase': _deletePurchase(request.recordId); break;
          case 'expense': _deleteExpense(request.recordId); break;
          case 'journal_entry': _deleteJournalEntry(request.recordId); break;
      }
      logActivity(userId, 'Approved Deletion', `Record: ${request.recordType} #${request.recordId}`);
  };

  const rejectRequest = (requestId: string, userId: string) => {
    const request = approvalRequests.find(r => r.id === requestId);
    if(!request) return;
    
    setApprovalRequests(prev => prev.map(r => r.id === requestId ? {...r, status: 'rejected', approvedBy: userId, approvalDate: new Date().toISOString()} : r));
    
    // Revert status from 'pending_deletion' to 'active'
     const updater = (setter: React.Dispatch<React.SetStateAction<any[]>>) => {
        setter(prev => prev.map(r => r.id === request.recordId ? { ...r, status: 'active' } : r));
    }
    
    switch(request.recordType) {
        case 'customer': updater(setCustomers); break;
        case 'supplier': updater(setSuppliers); break;
        case 'product': updater(setProducts); break;
        case 'sale': updater(setSales); break;
        case 'purchase': updater(setPurchases); break;
        case 'expense': updater(setExpenses); break;
        case 'journal_entry': updater(setJournalEntries); break;
    }
     logActivity(userId, 'Rejected Deletion', `Record: ${request.recordType} #${request.recordId}`);
  };


  // CRUD operations with logging
  const addCustomer = (customer: Omit<Customer, 'id' | 'status'>, userId: string) => {
      const newCustomer = { ...customer, id: `CUST-${Date.now()}`, status: 'active' as RecordStatus };
      setCustomers(prev => [...prev, newCustomer]);
      logActivity(userId, 'Create Customer', `ID: ${newCustomer.id}, Name: ${newCustomer.name}`);
  };
  const updateCustomer = (updatedCustomer: Customer, userId: string) => {
      setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
      logActivity(userId, 'Update Customer', `ID: ${updatedCustomer.id}`);
  };
  
  const addSupplier = (supplier: Omit<Supplier, 'id' | 'status'>, userId: string) => {
      const newSupplier = { ...supplier, id: `SUP-${Date.now()}`, status: 'active' as RecordStatus };
      setSuppliers(prev => [...prev, newSupplier]);
      logActivity(userId, 'Create Supplier', `ID: ${newSupplier.id}, Name: ${newSupplier.name}`);
  };
  const updateSupplier = (updatedSupplier: Supplier, userId: string) => {
      setSuppliers(prev => prev.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
      logActivity(userId, 'Update Supplier', `ID: ${updatedSupplier.id}`);
  };

  const addProduct = (product: Omit<Product, 'id' | 'status'>, userId: string) => {
      const newProduct = { ...product, id: `PROD-${Date.now()}`, status: 'active' as RecordStatus };
      setProducts(prev => [...prev, newProduct]);
      logActivity(userId, 'Create Product', `ID: ${newProduct.id}, Name: ${newProduct.name}`);
  };
  const updateProduct = (updatedProduct: Product, userId: string) => {
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      logActivity(userId, 'Update Product', `ID: ${updatedProduct.id}`);
  };

  const postJournalEntry = (entry: Omit<JournalEntry, 'id'|'status'>, userId: string): JournalEntry => {
    const newJournalEntry = { ...entry, id: `JE-${Date.now()}`, status: 'pending_approval' as RecordStatus, createdBy: userId };
    setJournalEntries(prev => [newJournalEntry, ...prev]);
    logActivity(userId, 'Create Journal Entry', `ID: ${newJournalEntry.id}`);
    return newJournalEntry;
  };
  
  const approveJournalEntry = (entryId: string, userId: string) => {
      const entry = journalEntries.find(je => je.id === entryId);
      if (!entry) return;

      setJournalEntries(prev => prev.map(je => je.id === entryId ? { ...je, status: 'approved' } : je));
      logActivity(userId, 'Approve Journal Entry', `ID: ${entryId}`);

      // Process lines for side-effects (e.g., inventory updates) only after approval
      entry.lines.forEach(line => {
          const account = accounts.find(a => a.id === line.accountId);
          if (account?.name === 'Inventory' && line.productId && line.quantity) {
              if (line.debit > 0) { // Inventory increase
                  setProducts(prevProducts => prevProducts.map(p =>
                      p.id === line.productId ? { ...p, stock: p.stock + line.quantity! } : p
                  ));
              } else if (line.credit > 0) { // Inventory decrease
                  setProducts(prevProducts => prevProducts.map(p =>
                      p.id === line.productId ? { ...p, stock: p.stock - line.quantity! } : p
                  ));
              }
          }
      });
  };

  const updateExpense = (updatedExpense: Expense, userId: string) => {
      setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));
      logActivity(userId, 'Update Expense', `ID: ${updatedExpense.id}`);
  };

  const value = {
    customers, suppliers, products, sales, purchases, expenses, journalEntries, accounts,
    users: auth.users.map(({ passwordHash, ...user }) => user), // Provide users without password hash
    departments, activityLog, approvalRequests,
    logoUrl, themeColors, companyProfile, setLogoUrl, setThemeColors, setCompanyProfile,
    addUser, updateUser, resetUserPassword,
    addCustomer, updateCustomer,
    addSupplier, updateSupplier,
    addProduct, updateProduct,
    setSales, setPurchases, setExpenses, setJournalEntries,
    updateExpense,
    postJournalEntry,
    approveJournalEntry,
    requestDelete, approveRequest, rejectRequest
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
