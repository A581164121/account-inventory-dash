import { MOCK_DATA_MAP } from '../data/mockData';

const DB_NAME = 'AccountingERPDB';
const DB_VERSION = 2; // Incremented version to trigger onupgradeneeded

// List all data stores (tables) in the database
const STORES = [
    'customers', 'suppliers', 'products', 'sales', 'purchases', 'expenses', 
    'journal_entries', 'accounts', 'users', 'activity_log', 'approval_requests',
    'settings', 'departments' // Added 'departments' store
];

let db: IDBDatabase;

/**
 * Initializes the IndexedDB database and creates object stores if they don't exist.
 */
const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("IndexedDB error:", (event.target as any).error);
            reject("Database initialization failed");
        };

        request.onupgradeneeded = (event) => {
            const dbInstance = (event.target as any).result;
            STORES.forEach(storeName => {
                if (!dbInstance.objectStoreNames.contains(storeName)) {
                    dbInstance.createObjectStore(storeName, { keyPath: 'id' });
                }
            });
        };

        request.onsuccess = (event) => {
            db = (event.target as any).result;
            resolve(db);
        };
    });
};

/**
 * Retrieves all items from a given store.
 */
const getAll = <T>(storeName: string): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        initDB().then(db => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => {
                console.error(`Error fetching all from ${storeName}:`, (event.target as any).error);
                reject(`Error fetching from ${storeName}`);
            };
        }).catch(reject);
    });
};

/**
 * Adds or updates a single item in a store.
 */
const upsertItem = <T>(storeName: string, item: T): Promise<void> => {
    return new Promise((resolve, reject) => {
        initDB().then(db => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(item);
            request.onsuccess = () => resolve();
            request.onerror = (event) => {
                console.error(`Error upserting in ${storeName}:`, (event.target as any).error);
                reject(`Error upserting in ${storeName}`);
            };
        }).catch(reject);
    });
};

/**
 * Seeds the database with mock data only if it hasn't been seeded before.
 * Uses a flag in localStorage to track seeding status.
 */
const seedInitialData = async () => {
    const isSeeded = localStorage.getItem('db_seeded');
    if (isSeeded) {
        // If the flag exists, we assume the DB is populated and do nothing.
        return;
    }

    await initDB();
    for (const storeName of STORES) {
        // Check if the store is empty before seeding
        const items = await getAll(storeName);
        if (items.length === 0) {
            const mockData = MOCK_DATA_MAP[storeName];
            if (mockData) {
                const transaction = db.transaction(storeName, 'readwrite');
                const store = transaction.objectStore(storeName);
                mockData.forEach((item: any) => store.put(item));
                await new Promise<void>((resolve, reject) => {
                    transaction.oncomplete = () => resolve();
                    transaction.onerror = () => reject(transaction.error);
                });
                console.log(`Seeded ${storeName} with ${mockData.length} items.`);
            }
        }
    }

    // Set the flag in localStorage after the first successful seeding.
    localStorage.setItem('db_seeded', 'true');
    console.log('Database seeding complete. Future refreshes will not re-seed.');
};


/**
 * Retrieves all data from all stores for backup purposes.
 */
const backupAllData = async (): Promise<Record<string, any[]>> => {
    await initDB();
    const backupData: Record<string, any[]> = {};
    for (const storeName of STORES) {
        backupData[storeName] = await getAll(storeName);
    }
    return backupData;
};

/**
 * Restores data from a backup object, clearing existing data.
 */
const restoreAllData = async (data: Record<string, any[]>): Promise<void> => {
    await initDB();
    const transaction = db.transaction(STORES, 'readwrite');
    for (const storeName of STORES) {
        if (data[storeName]) {
            const store = transaction.objectStore(storeName);
            store.clear();
            data[storeName].forEach(item => store.put(item));
        }
    }
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
            // After a successful restore, set the seeded flag so it doesn't try to seed mock data over it.
            localStorage.setItem('db_seeded', 'true');
            resolve();
        };
        transaction.onerror = () => reject('Restore transaction failed');
    });
};


export const dbService = {
    initDB,
    getAll,
    upsertItem,
    seedInitialData,
    backupAllData,
    restoreAllData,
};