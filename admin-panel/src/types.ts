export type UserRole = 'provider' | 'consumer' | 'admin'

export type AdminRole =
  | 'CSR'
  | 'Family Admin'
  | 'Provider Admin'
  | 'Exchange Admin'
  | 'Ops Admin'

export const ADMIN_ROLES: AdminRole[] = [
  'CSR',
  'Family Admin',
  'Provider Admin',
  'Exchange Admin',
  'Ops Admin',
]

export type UserStatus = 'active' | 'inactive' | 'invited' | 'pending'

export interface UserRecord {
  id: string
  role: UserRole
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  phone: string
  status: UserStatus
  organization?: string
  /** Admin-specific role (CSR, Family Admin, etc.) */
  adminRole?: AdminRole
  createdAt: string
}

export interface SearchFilters {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  phone: string
  status: string
  adminRole: string
}

export interface CreateUserInput {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  phone: string
  organization?: string
  adminRole?: AdminRole | ''
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  createdAt: string
  read: boolean
  category: 'system' | 'user' | 'security' | 'invite'
}

export const emptySearchFilters: SearchFilters = {
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  phone: '',
  status: '',
  adminRole: '',
}
