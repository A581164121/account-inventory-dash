import { UserRole } from "../types";

// IMPORTANT: This is a frontend simulation of password hashing.
// In a real application, you would use a library like bcrypt on the server.
const FAKE_SALT = 'a_very_salty_salt_string';
export const fakeHash = (password: string): string => `bcrypt_sim_${password}_${FAKE_SALT}`;
export const fakeCompare = (password: string, hash: string): boolean => hash === fakeHash(password);

export const getRedirectPathForRole = (role: UserRole): string => {
    switch (role) {
        case UserRole.SUPER_ADMIN:
            return '/';
        case UserRole.ADMIN:
            return '/admin';
        case UserRole.SALES_MANAGER:
        case UserRole.SALES_STAFF:
            return '/sales';
        case UserRole.PURCHASE_MANAGER:
        case UserRole.PURCHASE_STAFF:
            return '/purchases';
        case UserRole.ACCOUNTS_MANAGER:
        case UserRole.GENERAL_LEDGER_STAFF:
            return '/journal-entries';
        case UserRole.CUSTOM:
            return '/'; // Defaults to dashboard, which will be permission-checked
        default:
            return '/';
    }
};