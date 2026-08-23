import { mockNotifications, mockUsers } from '../data/mockData'
import type {
  CreateUserInput,
  NotificationItem,
  SearchFilters,
  UserRecord,
  UserRole,
} from '../types'

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

let users = structuredClone(mockUsers)
let notifications = structuredClone(mockNotifications)

function matches(user: UserRecord, filters: SearchFilters) {
  const includes = (value: string, query: string) =>
    !query.trim() || value.toLowerCase().includes(query.trim().toLowerCase())

  return (
    includes(user.firstName, filters.firstName) &&
    includes(user.lastName, filters.lastName) &&
    includes(user.email, filters.email) &&
    includes(user.phone, filters.phone) &&
    (!filters.dateOfBirth || user.dateOfBirth === filters.dateOfBirth) &&
    (!filters.status || user.status === filters.status) &&
    (!filters.adminRole || user.adminRole === filters.adminRole)
  )
}

export async function searchUsers(
  role: UserRole,
  filters: SearchFilters,
): Promise<UserRecord[]> {
  await delay()
  return users.filter((user) => user.role === role && matches(user, filters))
}

export async function createUser(
  role: UserRole,
  input: CreateUserInput,
): Promise<{ user: UserRecord; invitationSent: boolean }> {
  await delay(700)

  const invitationSent = role === 'consumer'
  const user: UserRecord = {
    id: `${role.slice(0, 3)}-${Date.now()}`,
    role,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    dateOfBirth: input.dateOfBirth,
    phone: input.phone,
    organization: input.organization,
    adminRole: role === 'admin' && input.adminRole ? input.adminRole : undefined,
    status: invitationSent ? 'invited' : 'active',
    createdAt: new Date().toISOString().slice(0, 10),
  }

  users = [user, ...users]

  notifications = [
    {
      id: `n-${Date.now()}`,
      title: invitationSent ? 'Consumer invitation sent' : `${capitalize(role)} created`,
      message: invitationSent
        ? `Invitation link sent to ${input.email} to complete signup.`
        : role === 'admin' && input.adminRole
          ? `${input.firstName} ${input.lastName} was added as ${input.adminRole}.`
          : `${input.firstName} ${input.lastName} was added as a ${role}.`,
      createdAt: new Date().toISOString(),
      read: false,
      category: invitationSent ? 'invite' : 'user',
    },
    ...notifications,
  ]

  return { user, invitationSent }
}

export async function fetchInbox(): Promise<NotificationItem[]> {
  await delay(350)
  return structuredClone(notifications)
}

export async function markNotificationRead(id: string): Promise<void> {
  await delay(150)
  notifications = notifications.map((item) =>
    item.id === id ? { ...item, read: true } : item,
  )
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
