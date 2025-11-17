
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Logo from '../components/layout/Logo';
import { Printer, FileDown } from 'lucide-react';
import { exportToPdf } from '../services/exportService';

const PurchaseInvoice: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { purchases, suppliers, products, logoUrl, companyProfile } = useAppContext();
    const purchase = purchases.find(p => p.id === id);
    const supplier = purchase ? suppliers.find(s => s.id === purchase.supplierId) : null;

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    const getProductName = (productId: string) => products.find(p => p.id === productId)?.name || 'N/A';

    const handleDownloadPdf = () => {
        if (purchase) {
           exportToPdf('printable-po', `PurchaseOrder-${purchase.invoiceNumber}`);
        }
    };

    if (!purchase || !supplier) {
        return <div className="p-8">Purchase not found. <Link to="/purchases" className="text-primary hover:underline">Go back to purchases list</Link></div>;
    }

    return (
        <div className="bg-white dark:bg-dark text-gray-800 dark:text-gray-200 min-h-screen p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-end mb-4 no-print space-x-2">
                     <Link to="/purchases" className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg">Back to Purchases</Link>
                    <button onClick={() => window.print()} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <Printer size={20} />
                        <span>Print</span>
                    </button>
                     <button onClick={handleDownloadPdf} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <FileDown size={20} />
                        <span>Download PDF</span>
                    </button>
                </div>
                
                <div id="printable-po" className="printable-area bg-white text-gray-800 p-8 border dark:border-gray-700 rounded-lg">
                    <header className="flex justify-between items-start pb-6 border-b dark:border-gray-700">
                        <div>
                            <Logo src={logoUrl} />
                            <div className="text-sm mt-4">
                                <p className="font-bold text-base">{companyProfile.name}</p>
                                <p className="whitespace-pre-line">{companyProfile.address}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h1 className="text-3xl font-bold text-primary">PURCHASE ORDER</h1>
                            <p className="mt-2"><strong>PO #:</strong> {purchase.invoiceNumber}</p>
                            <p><strong>Date:</strong> {purchase.date}</p>
                        </div>
                    </header>

                    <section className="grid grid-cols-2 gap-4 my-6">
                        <div>
                            <h2 className="font-semibold mb-2">Supplier:</h2>
                            <p className="font-bold">{supplier.name}</p>
                            <p>{supplier.address}</p>
                            <p>{supplier.email}</p>
                            <p>{supplier.phone}</p>
                        </div>
                    </section>
                    
                    <section>
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                <tr>
                                    <th className="p-3 font-semibold">Item</th>
                                    <th className="p-3 font-semibold text-center">Quantity</th>
                                    <th className="p-3 font-semibold text-right">Price</th>
                                    <th className="p-3 font-semibold text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchase.items.map((item, index) => (
                                    <tr key={index} className="border-b dark:border-gray-700">
                                        <td className="p-3">{getProductName(item.productId)}</td>
                                        <td className="p-3 text-center">{item.quantity}</td>
                                        <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                                        <td className="p-3 text-right">{formatCurrency(item.quantity * item.price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    <section className="flex justify-end mt-6">
                        <div className="w-full sm:w-1/2">
                             <div className="flex justify-between py-3 mt-2 border-t-2 dark:border-gray-600 text-xl font-bold text-primary">
                                <span>Total:</span>
                                <span>{formatCurrency(purchase.total)}</span>
                            </div>
                        </div>
                    </section>

                    <footer className="mt-12 pt-6 border-t dark:border-gray-700 text-center text-sm text-gray-500">
                        <p>Purchase Order generated by Accounting ERP.</p>
                        <p className="mt-2">{companyProfile.phone} | {companyProfile.email} {companyProfile.website && `| ${companyProfile.website}`}</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default PurchaseInvoice;
