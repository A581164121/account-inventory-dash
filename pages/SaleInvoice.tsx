
import React, { useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Logo from '../components/layout/Logo';
import { Printer, FileDown, ArrowLeft } from 'lucide-react';
import { exportToPdf } from '../services/exportService';

const SaleInvoice: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { sales, customers, products, logoUrl, companyProfile } = useAppContext();
    const sale = sales.find(s => s.id === id);
    const customer = sale ? customers.find(c => c.id === sale.customerId) : null;

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('print') === 'true') {
            const timeoutId = setTimeout(() => {
                window.print();
            }, 500); // Delay to ensure content renders

            return () => clearTimeout(timeoutId);
        }
    }, [location.search]);

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    const getProductName = (productId: string) => products.find(p => p.id === productId)?.name || 'N/A';
    
    const handleDownloadPdf = () => {
        if (sale) {
            exportToPdf('printable-invoice', `Invoice-${sale.invoiceNumber}`);
        }
    };

    if (!sale || !customer) {
        return (
            <div className="p-8 flex flex-col items-center justify-center h-64">
                <p className="text-xl text-gray-500 mb-4">Invoice not found.</p>
                <Link to="/sales" className="text-primary hover:underline flex items-center">
                    <ArrowLeft size={20} className="mr-2"/> Back to Sales
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-dark text-gray-800 dark:text-gray-200 min-h-screen p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6 no-print">
                     <Link to="/sales" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center transition-colors">
                        <ArrowLeft size={20} className="mr-2"/>
                        Back to Sales
                     </Link>
                     <div className="flex space-x-3">
                        <button onClick={() => window.print()} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-600 transition-colors">
                            <Printer size={20} />
                            <span>Print</span>
                        </button>
                        <button onClick={handleDownloadPdf} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors">
                            <FileDown size={20} />
                            <span>Download PDF</span>
                        </button>
                    </div>
                </div>
                
                <div id="printable-invoice" className="printable-area bg-white text-gray-800 p-8 md:p-12 border dark:border-gray-700 rounded-lg shadow-lg dark:shadow-none relative">
                    <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
                        <div className="w-1/2">
                            <Logo src={logoUrl} style={{ height: '48px', marginBottom: '1rem' }} />
                            <div className="text-gray-600 text-sm leading-relaxed">
                                <p className="font-bold text-gray-800 text-lg mb-1">{companyProfile.name}</p>
                                <p className="whitespace-pre-line">{companyProfile.address}</p>
                                <p className="mt-2">{companyProfile.phone}</p>
                                <p>{companyProfile.email}</p>
                                {companyProfile.website && <p>{companyProfile.website}</p>}
                            </div>
                        </div>
                        <div className="text-right w-1/2">
                            <h1 className="text-4xl font-bold text-gray-200 uppercase tracking-wide mb-4">Invoice</h1>
                            <div className="text-gray-600">
                                <div className="flex justify-end mb-1">
                                    <span className="font-semibold w-32">Invoice #:</span>
                                    <span className="font-bold text-gray-800">{sale.invoiceNumber}</span>
                                </div>
                                <div className="flex justify-end mb-1">
                                    <span className="font-semibold w-32">Date:</span>
                                    <span>{sale.date}</span>
                                </div>
                                <div className="flex justify-end mb-1">
                                    <span className="font-semibold w-32">Payment Method:</span>
                                    <span>{sale.paymentMethod}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-2">Bill To</h3>
                        <div className="text-gray-700">
                            <p className="font-bold text-lg text-gray-900">{customer.name}</p>
                            <p className="whitespace-pre-line">{customer.address}</p>
                            <p className="mt-1">{customer.email}</p>
                            <p>{customer.phone}</p>
                        </div>
                    </div>
                    
                    <div className="mb-8">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                                    <th className="p-3 font-semibold border-b">Item</th>
                                    <th className="p-3 font-semibold text-center border-b">Quantity</th>
                                    <th className="p-3 font-semibold text-right border-b">Price</th>
                                    <th className="p-3 font-semibold text-right border-b">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sale.items.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-100 text-sm">
                                        <td className="p-3 font-medium text-gray-800">{getProductName(item.productId)}</td>
                                        <td className="p-3 text-center text-gray-600">{item.quantity}</td>
                                        <td className="p-3 text-right text-gray-600">{formatCurrency(item.price)}</td>
                                        <td className="p-3 text-right text-gray-800 font-medium">{formatCurrency(item.quantity * item.price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end">
                        <div className="w-full sm:w-1/2 lg:w-1/3">
                            <div className="flex justify-between py-2 border-b border-gray-100 text-gray-600">
                                <span className="font-semibold">Subtotal</span>
                                <span>{formatCurrency(sale.subtotal)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100 text-gray-600">
                                <span className="font-semibold">Tax ({sale.taxRate}%)</span>
                                <span>{formatCurrency(sale.taxAmount)}</span>
                            </div>
                             <div className="flex justify-between py-3 mt-2 text-xl font-bold text-gray-900">
                                <span>Total</span>
                                <span>{formatCurrency(sale.total)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-500 text-sm">
                        <p className="font-medium text-gray-700 mb-2">Thank you for your business!</p>
                        <p>Please make checks payable to {companyProfile.name}.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaleInvoice;
