
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import AddUser from './pages/admin/AddUser';
import Roles from './pages/admin/Roles';
import ActivityLog from './pages/admin/ActivityLog';
import BrandSettings from './pages/admin/BrandSettings';
import DataManagement from './pages/admin/DataManagement';
import LoginModal from './components/auth/LoginModal';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './context/auth';
import { useAppContext } from './context/AppContext';
import { Permission } from './types';

const MainApp: React.FC = () => {
    const { isDataLoading } = useAppContext();

    if (isDataLoading) {
        return (
            <div className="flex h-screen bg-light dark:bg-dark items-center justify-center">
                <div className="text-xl font-semibold">Loading Business Data...</div>
            </div>
        );
    }
    
    return (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ProtectedRoute permission={Permission.VIEW_DASHBOARD}><Dashboard /></ProtectedRoute>} />
            <Route path="customers" element={<ProtectedRoute permission={Permission.VIEW_CUSTOMER}><Customers /></ProtectedRoute>} />
            <Route path="suppliers" element={<ProtectedRoute permission={Permission.VIEW_CUSTOMER}><Suppliers /></ProtectedRoute>} />
            <Route path="products" element={<ProtectedRoute permission={Permission.VIEW_CUSTOMER}><Products /></ProtectedRoute>} />
            <Route path="sales" element={<ProtectedRoute permission={Permission.VIEW_SALE}><Sales /></ProtectedRoute>} />
            <Route path="sales/invoice/:id" element={<ProtectedRoute permission={Permission.VIEW_SALE}><SaleInvoice /></ProtectedRoute>} />
            <Route path="purchases" element={<ProtectedRoute permission={Permission.VIEW_PURCHASE}><Purchases /></ProtectedRoute>} />
            <Route path="purchases/invoice/:id" element={<ProtectedRoute permission={Permission.VIEW_PURCHASE}><PurchaseInvoice /></ProtectedRoute>} />
            <Route path="expenses" element={<ProtectedRoute permission={Permission.VIEW_EXPENSE}><Expenses /></ProtectedRoute>} />
            <Route path="journal-entries" element={<ProtectedRoute permission={Permission.VIEW_JOURNAL_ENTRY}><JournalEntries /></ProtectedRoute>} />
            <Route path="ledger" element={<ProtectedRoute permission={Permission.VIEW_JOURNAL_ENTRY}><Ledger /></ProtectedRoute>} />
            <Route path="trial-balance" element={<ProtectedRoute permission={Permission.VIEW_JOURNAL_ENTRY}><TrialBalance /></ProtectedRoute>} />
            <Route path="profit-and-loss" element={<ProtectedRoute permission={Permission.VIEW_JOURNAL_ENTRY}><ProfitAndLoss /></ProtectedRoute>} />
            <Route path="balance-sheet" element={<ProtectedRoute permission={Permission.VIEW_JOURNAL_ENTRY}><BalanceSheet /></ProtectedRoute>} />
            <Route path="bank-reconciliation" element={<ProtectedRoute permission={Permission.VIEW_JOURNAL_ENTRY}><BankReconciliation /></ProtectedRoute>} />
            <Route path="reports" element={<ProtectedRoute permission={Permission.VIEW_DASHBOARD}><Reports /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="admin" element={<ProtectedRoute permission={Permission.ACCESS_ADMIN_PANEL}><AdminPanel /></ProtectedRoute>} />
            <Route path="admin/users" element={<ProtectedRoute permission={Permission.MANAGE_USERS}><Users /></ProtectedRoute>} />
            <Route path="admin/users/add" element={<ProtectedRoute permission={Permission.MANAGE_USERS}><AddUser /></ProtectedRoute>} />
            <Route path="admin/roles" element={<ProtectedRoute permission={Permission.MANAGE_ROLES}><Roles /></ProtectedRoute>} />
            <Route path="admin/activity-log" element={<ProtectedRoute permission={Permission.VIEW_ACTIVITY_LOG}><ActivityLog /></ProtectedRoute>} />
            <Route path="admin/brand-settings" element={<ProtectedRoute permission={Permission.MANAGE_BRANDING}><BrandSettings /></ProtectedRoute>} />
            <Route path="admin/data-management" element={<ProtectedRoute permission={Permission.MANAGE_DATA_BACKUP}><DataManagement /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
    )
}


const App: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <>
      {!currentUser ? (
        <LoginModal />
      ) : (
        <MainApp />
      )}
    </>
  );
};

export default App;
