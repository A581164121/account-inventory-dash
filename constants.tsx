
import React from 'react';
import { Home, Users, Truck, Package, ShoppingCart, Briefcase, DollarSign, BookOpen, BarChart2, FileText, PieChart, Activity, RefreshCw } from 'lucide-react';

export const NAV_LINKS = [
  { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
  { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
  { name: 'Suppliers', path: '/suppliers', icon: <Truck size={20} /> },
  { name: 'Products', path: '/products', icon: <Package size={20} /> },
  { name: 'Sales', path: '/sales', icon: <ShoppingCart size={20} /> },
  { name: 'Purchases', path: '/purchases', icon: <Briefcase size={20} /> },
  { name: 'Expenses', path: '/expenses', icon: <DollarSign size={20} /> },
  { name: 'Journal Entries', path: '/journal-entries', icon: <BookOpen size={20} /> },
];

export const REPORTS_LINKS = [
  { name: 'Ledger', path: '/ledger', icon: <BarChart2 size={20} /> },
  { name: 'Trial Balance', path: '/trial-balance', icon: <Activity size={20} /> },
  { name: 'Profit & Loss', path: '/profit-and-loss', icon: <PieChart size={20} /> },
  { name: 'Balance Sheet', path: '/balance-sheet', icon: <FileText size={20} /> },
  { name: 'Bank Reconciliation', path: '/bank-reconciliation', icon: <RefreshCw size={20} /> },
  { name: 'Reports', path: '/reports', icon: <BarChart2 size={20} /> },
];
