export const ROLES = {
    STUDENT: 'student',
    ADMIN: 'admin',
    MESS_MANAGER: 'mess_manager',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
