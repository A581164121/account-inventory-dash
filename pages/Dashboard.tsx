
import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingCart, Briefcase, TrendingUp, BarChart, Package, PlusCircle, UserPlus, PackagePlus, AlertTriangle } from 'lucide-react';
import Card from '../components/ui/Card';
import SalesPurchasesChart from '../components/charts/SalesPurchasesChart';
import ProfitTrendChart from '../components/charts/ProfitTrendChart';
import { useAppContext } from '../context/AppContext';
import { getDashboardSummary, getChartData } from '../services/accountingService';

const Dashboard: React.FC = () => {
    const appState = useAppContext();
    const summary = getDashboardSummary(appState);
    const { salesPurchasesData, profitTrendData } = getChartData(appState);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Card title="Total Sales" value={formatCurrency(summary.totalSales)} icon={<ShoppingCart size={24} className="text-white"/>} colorClass="bg-blue-500" />
            <Card title="Total Purchases" value={formatCurrency(summary.totalPurchases)} icon={<Briefcase size={24} className="text-white"/>} colorClass="bg-green-500" />
            <Card title="Total Expenses" value={formatCurrency(summary.totalExpenses)} icon={<DollarSign size={24} className="text-white"/>} colorClass="bg-red-500" />
            <Card title="Gross Profit" value={formatCurrency(summary.grossProfit)} icon={<TrendingUp size={24} className="text-white"/>} colorClass="bg-yellow-500" />
            <Card title="Net Profit" value={formatCurrency(summary.netProfit)} icon={<BarChart size={24} className="text-white"/>} colorClass="bg-purple-500" />
            <Card title="Total Products" value={summary.totalProducts.toString()} icon={<Package size={24} className="text-white"/>} colorClass="bg-indigo-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <SalesPurchasesChart data={salesPurchasesData} />
            <ProfitTrendChart data={profitTrendData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Links</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Link to="/sales" className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-primary hover:text-white transition-colors">
                        <PlusCircle size={32} className="mb-2" />
                        <span className="font-medium text-center">Add Sale</span>
                    </Link>
                    <Link to="/purchases" className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-primary hover:text-white transition-colors">
                        <Briefcase size={32} className="mb-2" />
                        <span className="font-medium text-center">Add Purchase</span>
                    </Link>
                    <Link to="/expenses" className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-primary hover:text-white transition-colors">
                        <DollarSign size={32} className="mb-2" />
                        <span className="font-medium text-center">Add Expense</span>
                    </Link>
                    <Link to="/customers" className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-primary hover:text-white transition-colors">
                        <UserPlus size={32} className="mb-2" />
                        <span className="font-medium text-center">Add Customer</span>
                    </Link>
                    <Link to="/products" className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-primary hover:text-white transition-colors">
                        <PackagePlus size={32} className="mb-2" />
                        <span className="font-medium text-center">Add Product</span>
                    </Link>
                </div>
            </div>
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <AlertTriangle size={20} className="text-yellow-500 mr-2" />
                    Low Stock Alerts
                </h3>
                {summary.lowStockProducts.length > 0 ? (
                    <div className="overflow-x-auto max-h-48">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr>
                                    <th className="p-2 font-semibold">Product</th>
                                    <th className="p-2 font-semibold text-right">Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summary.lowStockProducts.map(p => (
                                    <tr key={p.id} className="border-b dark:border-gray-700">
                                        <td className="p-2">{p.name}</td>
                                        <td className="p-2 text-right font-bold text-red-500">{p.stock}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No products with low stock.</p>
                )}
            </div>
        </div>
    </div>
  );
};

export default Dashboard;