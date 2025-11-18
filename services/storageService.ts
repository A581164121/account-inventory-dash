import { MOCK_DATA_MAP } from '../data/mockData';

const DB_NAME = 'AccountingERPDB';
const DB_VERSION = 1;
const STORE_NAMES = [
    'customers', 'suppliers', 'products', 'sales', 'purchases', 'expenses', 
    'journal_entries', 'accounts', 'users', 'departments', 'activity_log', 
    'approval_requests', 'settings'
];

let db: IDBDatabase;
let dbPromise: Promise<IDBDatabase>;

const initDB = (): Promise<IDBDatabase> => {
    if (dbPromise) {
        return dbPromise;
    }

    dbPromise = new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("Database error:", request.error);
            reject("Database error: " + request.error);
        };

        request.onsuccess = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const dbInstance = (event.target as IDBOpenDBRequest).result;
            STORE_NAMES.forEach(storeName => {
                if (!dbInstance.objectStoreNames.contains(storeName)) {
                    dbInstance.createObjectStore(storeName, { keyPath: 'id' });
                }
            });
        };
    });
    return dbPromise;
};

const getAll = async <T>(storeName: string): Promise<T[]> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
};

const upsertItem = async <T>(storeName: string, item: T): Promise<void> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
};

const seedInitialData = async (): Promise<void> => {
    const db = await initDB();
    
    const usersCount = await new Promise<number>((resolve, reject) => {
        const transaction = db.transaction('users', 'readonly');
        const store = transaction.objectStore('users');
        const countRequest = store.count();
        countRequest.onsuccess = () => resolve(countRequest.result);
        countRequest.onerror = () => reject(countRequest.error);
    });

    if (usersCount > 0) {
        return; 
    }

    console.log("Seeding initial data...");
    const transaction = db.transaction(STORE_NAMES, 'readwrite');
    
    transaction.onabort = (event) => {
        console.error("Seed transaction aborted.", transaction.error);
    };
    
    transaction.onerror = (event) => {
        console.error("Seed transaction error.", transaction.error);
    };

    for (const storeName of STORE_NAMES) {
        const store = transaction.objectStore(storeName);
        const dataToSeed = MOCK_DATA_MAP[storeName] || [];
        for (const item of dataToSeed) {
            store.add(item);
        }
    }
    
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
            console.log("Initial data seeded successfully.");
            resolve();
        };
    });
};


const backupAllData = async (): Promise<Record<string, any[]>> => {
    const backup: Record<string, any[]> = {};
    for (const storeName of STORE_NAMES) {
        backup[storeName] = await getAll(storeName);
    }
    return backup;
};

const restoreAllData = async (data: Record<string, any[]>): Promise<void> => {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAMES, 'readwrite');

    transaction.onabort = (event) => {
        console.error("Restore transaction aborted.", transaction.error);
    };
    
    transaction.onerror = (event) => {
        console.error("Restore transaction error.", transaction.error);
    };

    for (const storeName of STORE_NAMES) {
        if (data[storeName]) {
            const store = transaction.objectStore(storeName);
            store.clear(); // Wait for clear to finish before adding
            for (const item of data[storeName]) {
                store.add(item);
            }
        }
    }
    
    return new Promise((resolve) => {
        transaction.oncomplete = () => {
            console.log("Data restored successfully.");
            resolve();
        };
    });
};

const resetDatabase = async (): Promise<void> => {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAMES, 'readwrite');

    transaction.onabort = (event) => {
        console.error("Reset transaction aborted.", transaction.error);
    };
    
    transaction.onerror = (event) => {
        console.error("Reset transaction error.", transaction.error);
    };

    for (const storeName of STORE_NAMES) {
        const store = transaction.objectStore(storeName);
        store.clear();
    }
    
    return new Promise((resolve) => {
        transaction.oncomplete = () => {
            console.log("Database has been reset.");
            resolve();
        };
    });
};

export const dbService = {
    initDB,
    getAll,
    upsertItem,
    seedInitialData,
    backupAllData,
    restoreAllData,
    resetDatabase,
};
