import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
// Fix: Import JournalEntryLine type to resolve type error.
import { Customer, Supplier, Product, Sale, Purchase, Expense, JournalEntry, Account, User, Department, ActivityLog, ApprovalRequest, RecordType, ThemeColors, CompanyProfile, LogoUrl, EditLog, UserRole, JournalEntryLine } from '../types';
import { useAuth } from './auth';
import { initializeInvoiceSequences } from '../services/invoiceNumberService';
import { dbService } from '../services/storageService';
import { fakeHash } from '../utils/auth';

const defaultTheme: ThemeColors = {
  id: 'themeColors',
  primary: '#4f46e5',
  secondary: '#10b981',
};

const defaultCompanyProfile: CompanyProfile = {
  id: 'companyProfile',
  name: 'Accounting ERP Inc.',
  address: '123 Business Rd.\nBusiness City, 12345',
  phone: '(123) 456-7890',
  email: 'contact@erp.com',
  website: 'www.erp.com',
  salesTaxRate: 0,
};

const defaultLogoUrl: LogoUrl = {
    id: 'logoUrl',
    url: null,
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
  users: User[];
  departments: Department[];
  activityLog: ActivityLog[];
  approvalRequests: ApprovalRequest[];
  logoUrl: string | null;
  themeColors: ThemeColors;
  companyProfile: CompanyProfile;
  isDataLoading: boolean;

  setLogoUrl: (url: string | null) => Promise<void>;
  setThemeColors: (colors: ThemeColors) => Promise<void>;
  setCompanyProfile: (profile: CompanyProfile) => Promise<void>;

  addCustomer: (customer: Omit<Customer, 'id' | 'status' | 'isDeleted' | 'createdAt' | 'createdBy' | 'editHistory'>) => Promise<void>;
  updateCustomer: (customer: Customer) => Promise<void>;
  
  addSupplier: (supplier: Omit<Supplier, 'id' | 'status' | 'isDeleted' | 'createdAt' | 'createdBy' | 'editHistory'>) => Promise<void>;
  updateSupplier: (supplier: Supplier) => Promise<void>;
  
  addProduct: (product: Omit<Product, 'id' | 'status' | 'isDeleted' | 'createdAt' | 'createdBy' | 'editHistory'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;

  addSale: (sale: Omit<Sale, 'id' | 'isDeleted' | 'createdAt' | 'createdBy' | 'editHistory'>) => Promise<void>;
  addPurchase: (purchase: Omit<Purchase, 'id' | 'isDeleted' | 'createdAt' | 'createdBy' | 'editHistory'>) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'isDeleted' | 'createdAt' | 'createdBy' | 'editHistory'>) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;

  postJournalEntry: (entry: Omit<JournalEntry, 'id' | 'isDeleted' | 'createdAt' | 'createdBy' | 'editHistory'>) => Promise<JournalEntry>;
  
  // User Management
  addUser: (userData: Omit<User, 'id' | 'passwordHash' | 'createdAt'>, password: string) => Promise<User>;
  updateUser: (updatedUserData: Omit<User, 'passwordHash'>) => Promise<void>;
  resetUserPassword: (userId: string, newPassword: string) => Promise<void>;

  // Approval Workflow
  requestDelete: (recordType: RecordType, recordId: string) => Promise<void>;
  approveRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  approveJournalEntry: (entryId: string) => Promise<void>;

  // Backup & Restore
  backupData: () => Promise<void>;
  restoreData: (file: File) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { authInitialized, currentUser } = useAuth();
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  // Main Data State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
  
  // Branding State
  const [logoUrl, setLogoUrlState] = useState<string | null>(null);
  const [themeColors, setThemeColorsState] = useState<ThemeColors>(defaultTheme);
  const [companyProfile, setCompanyProfileState] = useState<CompanyProfile>(defaultCompanyProfile);

  // Data Loading Effect
  useEffect(() => {
    const loadData = async () => {
        setIsDataLoading(true);
        try {
            await dbService.seedInitialData();
            const [
                customersData, suppliersData, productsData, salesData, purchasesData,
                expensesData, journalEntriesData, accountsData, usersData, departmentsData,
                activityLogData, approvalRequestsData, settingsData
            ] = await Promise.all([
                dbService.getAll<Customer>('customers'), dbService.getAll<Supplier>('suppliers'),
                dbService.getAll<Product>('products'), dbService.getAll<Sale>('sales'),
                dbService.getAll<Purchase>('purchases'), dbService.getAll<Expense>('expenses'),
                dbService.getAll<JournalEntry>('journal_entries'), dbService.getAll<Account>('accounts'),
                dbService.getAll<User>('users'), dbService.getAll<Department>('departments'),
                dbService.getAll<ActivityLog>('activity_log'), dbService.getAll<ApprovalRequest>('approval_requests'),
                dbService.getAll<any>('settings'),
            ]);

            setCustomers(customersData); setSuppliers(suppliersData); setProducts(productsData);
            setSales(salesData); setPurchases(purchasesData); setExpenses(expensesData);
            setJournalEntries(journalEntriesData); setAccounts(accountsData); setUsers(usersData);
            setDepartments(departmentsData); setActivityLog(activityLogData); setApprovalRequests(approvalRequestsData);
            
            const companyProfileSetting = settingsData.find(s => s.id === 'companyProfile');
            setCompanyProfileState(companyProfileSetting || defaultCompanyProfile);
            
            const themeColorsSetting = settingsData.find(s => s.id === 'themeColors');
            setThemeColorsState(themeColorsSetting || defaultTheme);

            const logoUrlSetting = settingsData.find(s => s.id === 'logoUrl');
            setLogoUrlState(logoUrlSetting ? logoUrlSetting.url : defaultLogoUrl.url);
            
            initializeInvoiceSequences(salesData, purchasesData);

        } catch (error) {
            console.error("Failed to load data from IndexedDB", error);
        } finally {
            setIsDataLoading(false);
        }
    };
    if (authInitialized) { // Load data after auth system has checked for users
        loadData();
    }
  }, [authInitialized]);

  const logActivity = async (action: string, details: string) => {
    if (!currentUser) return;
    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      action,
      details,
    };
    try {
        await dbService.upsertItem('activity_log', newLog);
        setActivityLog(prev => [newLog, ...prev]);
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
  };

  const createAuditable = <T extends object>(item: T, idPrefix: string): T & { id: string; status: 'active'; isDeleted: boolean; createdAt: string; createdBy: string; editHistory: EditLog[]; } => {
    if (!currentUser) throw new Error("No authenticated user.");
    return {
        ...item,
        id: `${idPrefix}-${Date.now()}`,
        status: 'active',
        isDeleted: false,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.id,
        editHistory: [],
    };
  }

  // --- SETTINGS ---
  const setLogoUrl = async (url: string | null) => {
    const setting: LogoUrl = { id: 'logoUrl', url };
    try {
        await dbService.upsertItem('settings', setting);
        setLogoUrlState(url);
        await logActivity('Update Settings', 'Company logo updated.');
    } catch(error) {
        console.error("Failed to set logo URL:", error);
        alert('Error: Could not save the new logo.');
    }
  };
  const setThemeColors = async (colors: ThemeColors) => {
    const setting: ThemeColors = { ...colors, id: 'themeColors' };
    try {
        await dbService.upsertItem('settings', setting);
        setThemeColorsState(colors);
        await logActivity('Update Settings', 'Theme colors updated.');
    } catch (error) {
        console.error("Failed to set theme colors:", error);
        alert('Error: Could not save theme colors.');
    }
  };
  const setCompanyProfile = async (profile: CompanyProfile) => {
    const setting: CompanyProfile = { ...profile, id: 'companyProfile' };
    try {
        await dbService.upsertItem('settings', setting);
        setCompanyProfileState(profile);
        await logActivity('Update Settings', 'Company profile updated.');
    } catch (error) {
        console.error("Failed to set company profile:", error);
        alert('Error: Could not save company profile.');
    }
  };

  // --- CRUD Operations ---
  const addCustomer = async (customer: Omit<Customer, 'id' | 'status' | 'isDeleted' | 'createdAt' | 'createdBy' | 'editHistory'>) => {
      const newCustomer = createAuditable(customer, 'CUST');
      try {
          await dbService.upsertItem('customers', newCustomer);
          setCustomers(prev => [...prev, newCustomer]);
          await logActivity('Create Customer', `ID: ${newCustomer.id}, Name: ${newCustomer.name}`);
      } catch (error) {
          console.error("Failed to add customer:", error);
          alert(`Error: Could not save customer ${newCustomer.name}. Please try again.`);
          throw new Error("Failed to add customer to the database.");
      }
  };

  const generateEditLogs = (oldRecord: any, newRecord: any): EditLog[] => {
    if (!currentUser) return [];
    const logs: EditLog[] = [];
    Object.keys(newRecord).forEach(key => {
        if (key === 'id' || key === 'editHistory' || key.includes('At') || key.includes('By')) return;
        if (JSON.stringify(oldRecord[key]) !== JSON.stringify(newRecord[key])) {
            logs.push({
                timestamp: new Date().toISOString(),
                userId: currentUser.id,
                field: key,
                oldValue: oldRecord[key],
                newValue: newRecord[key],
            });
        }
    });
    return logs;
  };
  
  const updateCustomer = async (customer: Customer) => {
      if (!currentUser) return;
      const oldCustomer = customers.find(c => c.id === customer.id);
      if (!oldCustomer) return;

      const editLogs = generateEditLogs(oldCustomer, customer);
      const updatedCustomer = { 
          ...customer, 
          updatedAt: new Date().toISOString(), 
          updatedBy: currentUser.id,
          editHistory: [...(oldCustomer.editHistory || []), ...editLogs]
      };
      try {
          await dbService.upsertItem('customers', updatedCustomer);
          setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
          await logActivity('Update Customer', `ID: ${updatedCustomer.id}`);
      } catch (error) {
          console.error("Failed to update customer:", error);
          alert(`Error: Could not update customer ${customer.name}. Please try again.`);
          throw new Error("Failed to update customer in the database.");
      }
  };
  
  const addSupplier = async (supplier: Omit<Supplier, 'id' | 'status' | 'isDeleted' | 'createdAt' | 'createdBy' | 'editHistory'>) => {
      const newSupplier = createAuditable(supplier, 'SUP');
      try {
          await dbService.upsertItem('suppliers', newSupplier);
          setSuppliers(prev => [...prev, newSupplier]);
          await logActivity('Create Supplier', `ID: ${newSupplier.id}, Name: ${newSupplier.name}`);
      } catch (error) {
          console.error("Failed to add supplier:", error);
          alert(`Error: Could not save supplier ${newSupplier.name}. Please try again.`);
          throw new Error("Failed to add supplier to the database.");
      }
  };

  const updateSupplier = async (supplier: Supplier) => {
      if (!currentUser) return;
      const oldSupplier = suppliers.find(s => s.id === supplier.id);
      if (!oldSupplier) return;

      const editLogs = generateEditLogs(oldSupplier, supplier);
      const updatedSupplier = { 
          ...supplier,
          updatedAt: new Date().toISOString(), 
          updatedBy: currentUser.id,
          editHistory: [...(oldSupplier.editHistory || []), ...editLogs]
       };
      try {
          await dbService.upsertItem('suppliers', updatedSupplier);
          setSuppliers(prev => prev.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
          await logActivity('Update Supplier', `ID: ${updatedSupplier.id}`);
      } catch (error) {
          console.error("Failed to update supplier:", error);
          alert(`Error: Could not update supplier ${supplier.name}. Please try again.`);
          throw new Error("Failed to update supplier in the database.");
      }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'status' | 'isDeleted' | 'createdAt' | 'createdBy' | 'editHistory'>) => {
      const newProduct = createAuditable(product, 'PROD');
      try {
          await dbService.upsertItem('products', newProduct);
          setProducts(prev => [...prev, newProduct]);
          await logActivity('Create Product', `ID: ${newProduct.id}, Name: ${newProduct.name}`);
      } catch (error) {
          console.error("Failed to add product:", error);
          alert(`Error: Could not save product ${newProduct.name}. Please try again.`);
          throw new Error("Failed to add product to the database.");
      }
  };

  const updateProduct = async (product: Product) => {
      if (!currentUser) return;
      const oldProduct = products.find(p => p.id === product.id);
      if(!oldProduct) return;

      const editLogs = generateEditLogs(oldProduct, product);
      const updatedProduct = { 
          ...product,
          updatedAt: new Date().toISOString(),
          updatedBy: currentUser.id,
          editHistory: [...(oldProduct.editHistory || []), ...editLogs]
      };
      try {
          await dbService.upsertItem('products', updatedProduct);
          setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
          await logActivity('Update Product', `ID: ${updatedProduct.id}`);
      } catch (error) {
          console.error("Failed to update product:", error);
          alert(`Error: Could not update product ${product.name}. Please try again.`);
          throw new Error("Failed to update product in the database.");
      }
  };

  const addSale = async (sale: Omit<Sale, 'id' | 'isDeleted' | 'createdAt' | 'createdBy' | 'editHistory'>) => {
      if (!currentUser) throw new Error("Authentication error");
      
      try {
        const newSale = createAuditable({ ...sale, status: 'approved', departmentId: currentUser.departmentId }, 'SALE');
        const customerName = customers.find(c => c.id === sale.customerId)?.name || 'N/A';
        let totalCogs = 0;
        const cogsAndInventoryLines: JournalEntryLine[] = [];
        const updatedProducts: Product[] = [];

        // 1. Update product stock
        for (const item of sale.items) {
            const product = products.find(p => p.id === item.productId);
            if (!product || product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product?.name}. Available: ${product?.stock}`);
            }
            const itemCogs = item.quantity * product.purchasePrice;
            totalCogs += itemCogs;
            cogsAndInventoryLines.push({ accountId: '103', debit: 0, credit: itemCogs, productId: item.productId, quantity: item.quantity });
            
            const updatedProduct = { ...product, stock: product.stock - item.quantity };
            updatedProducts.push(updatedProduct);
        }

        // 2. Create Journal Entry
        const newJournalEntry: Omit<JournalEntry, 'id' | 'isDeleted' | 'createdAt' | 'createdBy' | 'editHistory'> = {
            date: sale.date,
            description: `Sale to ${customerName} - Inv #${sale.invoiceNumber}`,
            lines: [
                { accountId: sale.paymentMethod === 'Cash' ? '101' : '102', debit: sale.total, credit: 0, customerId: sale.customerId },
                { accountId: '401', debit: 0, credit: sale.subtotal },
                { accountId: '202', debit: 0, credit: sale.taxAmount },
                { accountId: '501', debit: totalCogs, credit: 0 },
                ...cogsAndInventoryLines,
            ],
            status: 'approved',
        };
        const createdJournalEntry = await postJournalEntry(newJournalEntry);
        newSale.journalEntryId = createdJournalEntry.id;
        
        // 3. Save all changes
        await dbService.upsertItem('sales', newSale);
        for(const p of updatedProducts) { await dbService.upsertItem('products', p); }

        // 4. Update state
        setSales(prev => [newSale, ...prev]);
        setProducts(prev => prev.map(p => updatedProducts.find(up => up.id === p.id) || p));
        await logActivity('Create Sale', `ID: ${newSale.id}, Total: ${newSale.total}`);
        
      } catch(error) {
        console.error("Failed to add sale:", error);
        alert(`Failed to add sale: ${(error as Error).message}`);
        throw error; // Re-throw to be caught by the form handler
      }
  };
  
  const addPurchase = async (purchase: Omit<Purchase, 'id' | 'isDeleted' | 'createdAt' | 'createdBy' | 'editHistory'>) => {
    if (!currentUser) throw new Error("Authentication error");

    try {
        const newPurchase = createAuditable({ ...purchase, status: 'approved', departmentId: currentUser.departmentId }, 'PUR');
        const supplierName = suppliers.find(s => s.id === purchase.supplierId)?.name || 'N/A';
        const updatedProducts: Product[] = [];

        // 1. Update product stock
        for (const item of purchase.items) {
            const product = products.find(p => p.id === item.productId);
            if (!product) throw new Error(`Product with ID ${item.productId} not found.`);
            const updatedProduct = { ...product, stock: product.stock + item.quantity };
            updatedProducts.push(updatedProduct);
        }

        // 2. Create Journal Entry
        const newJournalEntry: Omit<JournalEntry, 'id' | 'isDeleted' | 'createdAt' | 'createdBy' | 'editHistory'> = {
            date: purchase.date,
            description: `Purchase from ${supplierName} - Inv #${purchase.invoiceNumber}`,
            lines: [
                { accountId: '103', debit: purchase.subtotal, credit: 0 },
                { accountId: '104', debit: purchase.taxAmount, credit: 0 },
                { accountId: purchase.paymentMethod === 'Cash' ? '101' : '201', debit: 0, credit: purchase.total, supplierId: purchase.supplierId },
            ],
            status: 'approved',
        };
        const createdJournalEntry = await postJournalEntry(newJournalEntry);
        newPurchase.journalEntryId = createdJournalEntry.id;

        // 3. Save changes
        await dbService.upsertItem('purchases', newPurchase);
        for (const p of updatedProducts) { await dbService.upsertItem('products', p); }

        // 4. Update state
        setPurchases(prev => [newPurchase, ...prev]);
        setProducts(prev => prev.map(p => updatedProducts.find(up => up.id === p.id) || p));
        await logActivity('Create Purchase', `ID: ${newPurchase.id}, Total: ${newPurchase.total}`);

    } catch (error) {
        console.error("Failed to add purchase:", error);
        alert(`Failed to add purchase: ${(error as Error).message}`);
        throw error;
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'isDeleted' | 'createdAt' | 'createdBy' | 'editHistory'>) => {
      if (!currentUser) throw new Error("Authentication error");
      const newExpense = createAuditable({ ...expense, status: 'approved', departmentId: currentUser.departmentId }, 'EXP');
      
      const expenseAccount = accounts.find(a => a.name.toLowerCase().includes(newExpense.category.toLowerCase()) && a.type === 'Expense') 
                                || accounts.find(a => a.id === '503'); // Default to Utilities
      if (!expenseAccount) {
          throw new Error(`Could not find an expense account for category: ${newExpense.category}. Please check account setup.`);
      }
      try {
        const newJournalEntry: Omit<JournalEntry, 'id' | 'isDeleted' | 'createdAt' | 'createdBy' | 'editHistory'> = {
            date: newExpense.date,
            description: newExpense.description,
            lines: [
                { accountId: expenseAccount.id, debit: newExpense.amount, credit: 0 },
                { accountId: '101', debit: 0, credit: newExpense.amount }
            ],
            status: 'approved',
        };
        const createdJournalEntry = await postJournalEntry(newJournalEntry);
        newExpense.journalEntryId = createdJournalEntry.id;
        
        await dbService.upsertItem('expenses', newExpense);
        setExpenses(prev => [newExpense, ...prev]);
        await logActivity('Create Expense', `ID: ${newExpense.id}, Amount: ${newExpense.amount}`);
      } catch (error) {
          console.error("Failed to add expense:", error);
          alert(`Failed to add expense: ${(error as Error).message}`);
          throw error;
      }
  };

  const updateExpense = async (expense: Expense) => {
    if (!currentUser) return;
    const oldExpense = expenses.find(e => e.id === expense.id);
    if (!oldExpense) return;

    const editLogs = generateEditLogs(oldExpense, expense);
    const updatedExpense = {
        ...expense,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.id,
        editHistory: [...(oldExpense.editHistory || []), ...editLogs]
    };
    try {
        await dbService.upsertItem('expenses', updatedExpense);
        setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));
        await logActivity('Update Expense', `ID: ${updatedExpense.id}`);
    } catch(error) {
        console.error("Failed to update expense:", error);
        alert(`Error: Could not update expense for ${expense.date}. Please try again.`);
        throw new Error("Failed to update expense in the database.");
    }
  };

  const postJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'isDeleted'|'createdAt'|'createdBy'|'editHistory'>): Promise<JournalEntry> => {
    if (!currentUser) throw new Error("No authenticated user.");
    const newJournalEntry = createAuditable(entry, 'JE');
    try {
        await dbService.upsertItem('journal_entries', newJournalEntry);
        setJournalEntries(prev => [newJournalEntry, ...prev]);
        await logActivity('Create Journal Entry', `ID: ${newJournalEntry.id}`);
        return newJournalEntry;
    } catch (error) {
        console.error("Failed to post journal entry:", error);
        alert(`Error: Could not post journal entry "${newJournalEntry.description}".`);
        throw new Error("Failed to post journal entry to the database.");
    }
  };
  
    // User Management Functions
  const addUser = async (userData: Omit<User, 'id' | 'passwordHash' | 'createdAt'>, password: string): Promise<User> => {
    const newUser: User = {
        ...userData,
        id: `USER-${Date.now()}`,
        passwordHash: fakeHash(password),
        createdAt: new Date().toISOString(),
    };
    try {
        await dbService.upsertItem('users', newUser);
        setUsers(prev => [...prev, newUser]);
        return newUser;
    } catch (error) {
        console.error("Failed to add user:", error);
        alert(`Error: Could not create user ${newUser.name}.`);
        throw new Error("Failed to create user in the database.");
    }
  };

  const updateUser = async (updatedUserData: Omit<User, 'passwordHash'>) => {
    const userToUpdate = users.find(u => u.id === updatedUserData.id);
    if (!userToUpdate) throw new Error("User not found");
    const updatedUser = { ...userToUpdate, ...updatedUserData };
    
    try {
        await dbService.upsertItem('users', updatedUser);
        setUsers(prev => prev.map(u => u.id === updatedUserData.id ? updatedUser : u));
    } catch (error) {
        console.error("Failed to update user:", error);
        alert(`Error: Could not update user ${updatedUser.name}.`);
        throw new Error("Failed to update user in the database.");
    }
  };

  const resetUserPassword = async (userId: string, newPassword: string) => {
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) throw new Error("User not found");
      const updatedUser = { ...userToUpdate, passwordHash: fakeHash(newPassword) };

      try {
          await dbService.upsertItem('users', updatedUser);
          setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      } catch (error) {
          console.error("Failed to reset password:", error);
          alert(`Error: Could not reset password for user ${userToUpdate.name}.`);
          throw new Error("Failed to reset password in the database.");
      }
  };

  // --- Workflow ---
  const requestDelete = async (recordType: RecordType, recordId: string) => {
    if (!currentUser) return;
    const newRequest: ApprovalRequest = {
      id: `REQ-${Date.now()}`,
      recordType, recordId,
      requestedBy: currentUser.id,
      requestDate: new Date().toISOString(),
      status: 'pending',
    };
    
    const storeMap = { customer: { state: customers, setter: setCustomers, db: 'customers'}, supplier: { state: suppliers, setter: setSuppliers, db: 'suppliers'}, product: { state: products, setter: setProducts, db: 'products'}, sale: { state: sales, setter: setSales, db: 'sales'}, purchase: { state: purchases, setter: setPurchases, db: 'purchases'}, expense: { state: expenses, setter: setExpenses, db: 'expenses'}, journal_entry: { state: journalEntries, setter: setJournalEntries, db: 'journal_entries'} };
    const { state, setter, db } = storeMap[recordType];
    const record = state.find(r => r.id === recordId);

    if (record) {
      try {
        await dbService.upsertItem('approval_requests', newRequest);
        const updatedRecord = { ...record, status: 'pending_deletion' as const };
        await dbService.upsertItem(db, updatedRecord);
        
        setApprovalRequests(prev => [newRequest, ...prev]);
        setter(prev => prev.map(r => r.id === recordId ? updatedRecord : r));
        await logActivity(`Requested Deletion`, `Record: ${recordType} #${recordId}`);
      } catch (error) {
        console.error("Failed to request deletion:", error);
        alert(`Error: Could not request deletion for ${recordType} #${recordId}.`);
      }
    }
  };

  const approveRequest = async (requestId: string) => {
      if(!currentUser) return;
      const request = approvalRequests.find(r => r.id === requestId);
      if(!request) return;

      const storeMap = { customer: { state: customers, setter: setCustomers, db: 'customers'}, supplier: { state: suppliers, setter: setSuppliers, db: 'suppliers'}, product: { state: products, setter: setProducts, db: 'products'}, sale: { state: sales, setter: setSales, db: 'sales'}, purchase: { state: purchases, setter: setPurchases, db: 'purchases'}, expense: { state: expenses, setter: setExpenses, db: 'expenses'}, journal_entry: { state: journalEntries, setter: setJournalEntries, db: 'journal_entries'} };
      const { state, setter, db } = storeMap[request.recordType];
      const record = state.find(r => r.id === request.recordId);

      if (record) {
        try {
          const updatedRequest = {...request, status: 'approved' as const, approvedBy: currentUser.id, approvalDate: new Date().toISOString()};
          await dbService.upsertItem('approval_requests', updatedRequest);
          
          const updatedRecord = { ...record, isDeleted: true, deletedAt: new Date().toISOString(), deletedBy: currentUser.id, status: 'deleted' as const };
          await dbService.upsertItem(db, updatedRecord);
          
          setApprovalRequests(prev => prev.map(r => r.id === requestId ? updatedRequest : r));
          setter(prev => prev.map(r => r.id === request.recordId ? updatedRecord : r));
          await logActivity('Approved Deletion', `Record: ${request.recordType} #${request.recordId}`);
        } catch (error) {
          console.error("Failed to approve deletion request:", error);
          alert(`Error: Could not approve deletion for ${request.recordType} #${request.recordId}.`);
        }
      }
  };

  const rejectRequest = async (requestId: string) => {
    if (!currentUser) return;
    const request = approvalRequests.find(r => r.id === requestId);
    if(!request) return;
    
    const storeMap = { customer: { state: customers, setter: setCustomers, db: 'customers'}, supplier: { state: suppliers, setter: setSuppliers, db: 'suppliers'}, product: { state: products, setter: setProducts, db: 'products'}, sale: { state: sales, setter: setSales, db: 'sales'}, purchase: { state: purchases, setter: setPurchases, db: 'purchases'}, expense: { state: expenses, setter: setExpenses, db: 'expenses'}, journal_entry: { state: journalEntries, setter: setJournalEntries, db: 'journal_entries'} };
    const { state, setter, db } = storeMap[request.recordType];
    const record = state.find(r => r.id === request.recordId);
    
    if (record) {
      try {
        const updatedRequest = {...request, status: 'rejected' as const, approvedBy: currentUser.id, approvalDate: new Date().toISOString()};
        await dbService.upsertItem('approval_requests', updatedRequest);
        
        const updatedRecord = { ...record, status: 'active' as const };
        await dbService.upsertItem(db, updatedRecord);
        
        setApprovalRequests(prev => prev.map(r => r.id === requestId ? updatedRequest : r));
        setter(prev => prev.map(r => r.id === request.recordId ? updatedRecord : r));
        await logActivity('Rejected Deletion', `Record: ${request.recordType} #${request.recordId}`);
      } catch (error) {
        console.error("Failed to reject deletion request:", error);
        alert(`Error: Could not reject deletion for ${request.recordType} #${request.recordId}.`);
      }
    }
  };

  const approveJournalEntry = async (entryId: string) => {
      if(!currentUser) return;
      const entry = journalEntries.find(je => je.id === entryId);
      if (!entry) return;

      try {
        const updatedEntry = { ...entry, status: 'approved' as const };
        await dbService.upsertItem('journal_entries', updatedEntry);
        setJournalEntries(prev => prev.map(je => je.id === entryId ? updatedEntry : je));
        await logActivity('Approve Journal Entry', `ID: ${entryId}`);
      } catch (error) {
        console.error("Failed to approve journal entry:", error);
        alert(`Error: Could not approve Journal Entry #${entryId}.`);
      }
  };

  const backupData = async () => {
    try {
        const data = await dbService.backupAllData();
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `erp-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        alert('Backup successful!');
    } catch (error) {
        console.error('Backup failed:', error);
        alert('Backup failed. See console for details.');
    }
  };

  const restoreData = async (file: File) => {
    if (!window.confirm('Are you sure you want to restore? This will overwrite all current data.')) {
        return;
    }
    try {
        const text = await file.text();
        const data = JSON.parse(text);
        await dbService.restoreAllData(data);
        alert('Restore successful! The application will now reload.');
        window.location.reload();
    } catch (error) {
        console.error('Restore failed:', error);
        alert('Restore failed. Make sure you are using a valid backup file. See console for details.');
    }
  };

  const value = {
    customers, suppliers, products, sales, purchases, expenses, journalEntries, accounts,
    users, departments, activityLog, approvalRequests,
    logoUrl: logoUrl, themeColors, companyProfile, isDataLoading,
    setLogoUrl, setThemeColors, setCompanyProfile,
    addCustomer, updateCustomer,
    addSupplier, updateSupplier,
    addProduct, updateProduct,
    addSale, addPurchase, addExpense, updateExpense,
    postJournalEntry,
    addUser, updateUser, resetUserPassword,
    approveJournalEntry,
    requestDelete, approveRequest, rejectRequest,
    backupData, restoreData,
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