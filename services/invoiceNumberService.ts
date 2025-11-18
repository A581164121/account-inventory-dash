import { Sale, Purchase } from '../types';

const SALE_PREFIX = 'INV';
const PURCHASE_PREFIX = 'PINV';

const getEntityPrefix = (name: string): string => {
    if (!name) return 'NA';
    return name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
};

const getLocalStorageKey = (type: 'sale' | 'purchase', entityId: string): string => {
    return `${type}_sequence_${entityId}`;
};

const parseSequenceNumber = (invoiceNumber: string): number => {
    const parts = invoiceNumber.split('-');
    const sequencePart = parts[parts.length - 1];
    const sequence = parseInt(sequencePart, 10);
    return isNaN(sequence) ? 0 : sequence;
};

export const initializeInvoiceSequences = (sales: Sale[], purchases: Purchase[]): void => {
    const saleSequences: { [customerId: string]: number } = {};
    sales.forEach(sale => {
        const currentSequence = parseSequenceNumber(sale.invoiceNumber);
        if (currentSequence > (saleSequences[sale.customerId] || 0)) {
            saleSequences[sale.customerId] = currentSequence;
        }
    });

    Object.keys(saleSequences).forEach(customerId => {
        const key = getLocalStorageKey('sale', customerId);
        const storedValue = parseInt(localStorage.getItem(key) || '0', 10);
        if (saleSequences[customerId] > storedValue) {
            localStorage.setItem(key, saleSequences[customerId].toString());
        }
    });

    const purchaseSequences: { [supplierId: string]: number } = {};
    purchases.forEach(purchase => {
        const currentSequence = parseSequenceNumber(purchase.invoiceNumber);
        if (currentSequence > (purchaseSequences[purchase.supplierId] || 0)) {
            purchaseSequences[purchase.supplierId] = currentSequence;
        }
    });

    Object.keys(purchaseSequences).forEach(supplierId => {
        const key = getLocalStorageKey('purchase', supplierId);
        const storedValue = parseInt(localStorage.getItem(key) || '0', 10);
        if (purchaseSequences[supplierId] > storedValue) {
            localStorage.setItem(key, purchaseSequences[supplierId].toString());
        }
    });
};


export const getNextSaleInvoiceNumber = (customerId: string, customerName: string): string => {
    const key = getLocalStorageKey('sale', customerId);
    const lastNumber = parseInt(localStorage.getItem(key) || '0', 10);
    const nextNumber = lastNumber + 1;
    
    const prefix = getEntityPrefix(customerName);
    return `${SALE_PREFIX}-${prefix}-${nextNumber}`;
};

export const getNextPurchaseInvoiceNumber = (supplierId: string, supplierName: string): string => {
    const key = getLocalStorageKey('purchase', supplierId);
    const lastNumber = parseInt(localStorage.getItem(key) || '0', 10);
    const nextNumber = lastNumber + 1;

    const prefix = getEntityPrefix(supplierName);
    return `${PURCHASE_PREFIX}-${prefix}-${nextNumber}`;
};

export const commitInvoiceNumber = (type: 'sale' | 'purchase', entityId: string, invoiceNumber: string): void => {
    const key = getLocalStorageKey(type, entityId);
    const sequence = parseSequenceNumber(invoiceNumber);
    const storedValue = parseInt(localStorage.getItem(key) || '0', 10);
    if (sequence > storedValue) {
      localStorage.setItem(key, sequence.toString());
    }
};