
import { supabase } from './supabaseClient';
import { MOCK_DATA_MAP } from '../data/mockData';

// Tables in Supabase should match these names
const STORE_NAMES = [
    'customers', 'suppliers', 'products', 'sales', 'purchases', 'expenses', 
    'journal_entries', 'accounts', 'users', 'departments', 'activity_log', 
    'approval_requests', 'settings'
];

const getAll = async <T>(tableName: string): Promise<T[]> => {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*');
        
        if (error) {
            throw error;
        }
        return data as T[];
    } catch (error: any) {
        console.warn(`Supabase fetch failed for "${tableName}". Falling back to mock data. Details: ${error.message || JSON.stringify(error)}`);
        // Fallback to mock data so app works without keys
        return (MOCK_DATA_MAP[tableName] || []) as T[];
    }
};

const upsertItem = async <T extends { id: string }>(tableName: string, item: T): Promise<void> => {
    try {
        const { error } = await supabase
            .from(tableName)
            .upsert(item, { onConflict: 'id' });

        if (error) {
            throw error;
        }
    } catch (error: any) {
        console.error(`Error upserting into ${tableName}:`, error.message || error);
        // In a real scenario, we might want to throw this to notify the user
        // But for resiliency in this demo, we log it.
        throw error; 
    }
};

const deleteItem = async (tableName: string, id: string): Promise<void> => {
    try {
        const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }
    } catch (error: any) {
        console.error(`Error deleting from ${tableName}:`, error.message || error);
        throw error;
    }
};

const seedInitialData = async (): Promise<void> => {
    try {
        // Check if users exist to determine if seeding is needed
        const { count, error } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (error) {
            // If table doesn't exist or connection fails, skip seeding silently
            console.warn("Skipping seed check due to connection error:", error.message);
            return;
        }

        if (count && count > 0) {
            return; // Data exists, skip seeding
        }

        console.log("Seeding initial data to Supabase...");
        
        for (const storeName of STORE_NAMES) {
            const dataToSeed = MOCK_DATA_MAP[storeName] || [];
            if (dataToSeed.length > 0) {
                const { error: seedError } = await supabase
                    .from(storeName)
                    .upsert(dataToSeed);
                
                if (seedError) {
                    console.warn(`Failed to seed ${storeName}:`, seedError.message);
                }
            }
        }
        console.log("Initial data seeding complete.");
    } catch (err) {
        console.warn("Seeding process encountered an error (likely offline):", err);
    }
};


const backupAllData = async (): Promise<Record<string, any[]>> => {
    const backup: Record<string, any[]> = {};
    for (const storeName of STORE_NAMES) {
        // backup should probably rely on local state or successfull fetches
        // For now, we attempt fetch
        backup[storeName] = await getAll(storeName);
    }
    return backup;
};

const restoreAllData = async (data: Record<string, any[]>): Promise<void> => {
    for (const storeName of STORE_NAMES) {
        if (data[storeName] && Array.isArray(data[storeName])) {
            try {
                const { error } = await supabase.from(storeName).upsert(data[storeName]);
                if (error) throw error;
            } catch (err) {
                console.error(`Error restoring ${storeName}:`, err);
            }
        }
    }
};

const resetDatabase = async (): Promise<void> => {
    for (const storeName of STORE_NAMES) {
        try {
            const { error } = await supabase.from(storeName).delete().neq('id', '0'); 
            if (error) throw error;
        } catch (err) {
             console.error(`Error clearing ${storeName}:`, err);
        }
    }
};

export const dbService = {
    getAll,
    upsertItem,
    deleteItem,
    seedInitialData,
    backupAllData,
    restoreAllData,
    resetDatabase,
};
