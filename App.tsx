
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Purchases from './pages/Purchases';
import Expenses from './pages/Expenses';
import JournalEntries from './pages/JournalEntries';
import Ledger from './pages/Ledger';
import TrialBalance from './pages/TrialBalance';
import ProfitAndLoss from './pages/ProfitAndLoss';
import BalanceSheet from './pages/BalanceSheet';
import BankReconciliation from './pages/BankReconciliation';
import Reports from './pages/Reports';
import SaleInvoice from './pages/SaleInvoice';
import PurchaseInvoice from './pages/PurchaseInvoice';
import AdminPanel from './pages/admin/AdminPanel';
import Users from './pages/admin/Users';
import Roles from './pages/admin/Roles';
import ActivityLog from './pages/admin/ActivityLog';
import BrandSettings from './pages/admin/BrandSettings';


const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="products" element={<Products />} />
          <Route path="sales" element={<Sales />} />
          <Route path="sales/invoice/:id" element={<SaleInvoice />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="purchases/invoice/:id" element={<PurchaseInvoice />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="journal-entries" element={<JournalEntries />} />
          <Route path="ledger" element={<Ledger />} />
          <Route path="trial-balance" element={<TrialBalance />} />
          <Route path="profit-and-loss" element={<ProfitAndLoss />} />
          <Route path="balance-sheet" element={<BalanceSheet />} />
          <Route path="bank-reconciliation" element={<BankReconciliation />} />
          <Route path="reports" element={<Reports />} />
          
          {/* Admin Routes */}
          <Route path="admin" element={<AdminPanel />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/roles" element={<Roles />} />
          <Route path="admin/activity-log" element={<ActivityLog />} />
          <Route path="admin/brand-settings" element={<BrandSettings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;