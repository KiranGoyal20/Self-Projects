import { Badge, Box, Table, Text } from '@chakra-ui/react'
import type { UserRecord, UserRole } from '../types'

interface Props {
  role: UserRole
  rows: UserRecord[]
  emptyMessage: string
}

const statusColor: Record<UserRecord['status'], string> = {
  active: 'green',
  inactive: 'gray',
  invited: 'blue',
  pending: 'orange',
}

export function ResultsTable({ role, rows, emptyMessage }: Props) {
  const showOrg = role === 'provider' || role === 'admin'
  const showAdminRole = role === 'admin'

  return (
    <Box
      bg="white"
      color="gray.800"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="sm"
    >
      <Table.ScrollArea>
        <Table.Root size="sm" stickyHeader>
          <Table.Header>
            <Table.Row bg="gray.100">
              <Table.ColumnHeader color="gray.700" fontWeight="700">
                Name
              </Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="700">
                Email
              </Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="700">
                DOB
              </Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="700">
                Phone
              </Table.ColumnHeader>
              {showAdminRole && (
                <Table.ColumnHeader color="gray.700" fontWeight="700">
                  Role
                </Table.ColumnHeader>
              )}
              {showOrg && (
                <Table.ColumnHeader color="gray.700" fontWeight="700">
                  Organization
                </Table.ColumnHeader>
              )}
              <Table.ColumnHeader color="gray.700" fontWeight="700">
                Status
              </Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="700">
                Created
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={6 + (showOrg ? 1 : 0) + (showAdminRole ? 1 : 0)}>
                  <Text color="gray.600" py={4}>
                    {emptyMessage}
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              rows.map((row) => (
                <Table.Row key={row.id} _hover={{ bg: 'gray.50' }}>
                  <Table.Cell color="gray.900" fontWeight="600">
                    {row.firstName} {row.lastName}
                  </Table.Cell>
                  <Table.Cell color="gray.800">{row.email}</Table.Cell>
                  <Table.Cell color="gray.800">{row.dateOfBirth}</Table.Cell>
                  <Table.Cell color="gray.800">{row.phone}</Table.Cell>
                  {showAdminRole && (
                    <Table.Cell color="gray.800">{row.adminRole ?? '—'}</Table.Cell>
                  )}
                  {showOrg && (
                    <Table.Cell color="gray.800">{row.organization ?? '—'}</Table.Cell>
                  )}
                  <Table.Cell>
                    <Badge colorPalette={statusColor[row.status]} variant="subtle">
                      {row.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell color="gray.800">{row.createdAt}</Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Box>
  )
}
