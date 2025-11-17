
import { UserRole } from "../types";

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
