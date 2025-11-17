
import React from 'react';
import { Home, Users, Truck, Package, ShoppingCart, Briefcase, DollarSign, BookOpen, BarChart2, FileText, PieChart, Activity, RefreshCw, Shield, List, UserCheck, Database } from 'lucide-react';
import { Permission } from './types';

export const NAV_LINKS = [
  { name: 'Dashboard', path: '/', icon: <Home size={20} />, permission: Permission.VIEW_DASHBOARD },
  { name: 'Customers', path: '/customers', icon: <Users size={20} />, permission: Permission.VIEW_CUSTOMER },
  { name: 'Suppliers', path: '/suppliers', icon: <Truck size={20} />, permission: Permission.VIEW_CUSTOMER },
  { name: 'Products', path: '/products', icon: <Package size={20} />, permission: Permission.VIEW_CUSTOMER },
  { name: 'Sales', path: '/sales', icon: <ShoppingCart size={20} />, permission: Permission.VIEW_SALE },
  { name: 'Purchases', path: '/purchases', icon: <Briefcase size={20} />, permission: Permission.VIEW_PURCHASE },
  { name: 'Expenses', path: '/expenses', icon: <DollarSign size={20} />, permission: Permission.VIEW_EXPENSE },
  { name: 'Journal Entries', path: '/journal-entries', icon: <BookOpen size={20} />, permission: Permission.VIEW_JOURNAL_ENTRY },
];

export const REPORTS_LINKS = [
  { name: 'Ledger', path: '/ledger', icon: <BarChart2 size={20} />, permission: Permission.VIEW_JOURNAL_ENTRY },
  { name: 'Trial Balance', path: '/trial-balance', icon: <Activity size={20} />, permission: Permission.VIEW_JOURNAL_ENTRY },
  { name: 'Profit & Loss', path: '/profit-and-loss', icon: <PieChart size={20} />, permission: Permission.VIEW_JOURNAL_ENTRY },
  { name: 'Balance Sheet', path: '/balance-sheet', icon: <FileText size={20} />, permission: Permission.VIEW_JOURNAL_ENTRY },
  { name: 'Bank Reconciliation', path: '/bank-reconciliation', icon: <RefreshCw size={20} />, permission: Permission.VIEW_JOURNAL_ENTRY },
  { name: 'Reports', path: '/reports', icon: <BarChart2 size={20} />, permission: Permission.VIEW_DASHBOARD },
];

export const ADMIN_LINKS = [
    { name: 'Admin Dashboard', path: '/admin', icon: <Shield size={20} />, permission: Permission.ACCESS_ADMIN_PANEL },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} />, permission: Permission.MANAGE_USERS },
    { name: 'Roles & Permissions', path: '/admin/roles', icon: <UserCheck size={20} />, permission: Permission.MANAGE_ROLES },
    { name: 'Activity Log', path: '/admin/activity-log', icon: <List size={20} />, permission: Permission.VIEW_ACTIVITY_LOG },
    { name: 'Company Settings', path: '/admin/brand-settings', icon: <Briefcase size={20} />, permission: Permission.MANAGE_BRANDING },
    { name: 'Data Management', path: '/admin/data-management', icon: <Database size={20} />, permission: Permission.MANAGE_DATA_BACKUP },
];
