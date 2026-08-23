import { Alert, Box, Spinner } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { searchUsers } from '../api/mockApi'
import { CreateUserModal } from '../components/CreateUserModal'
import { ResultsTable } from '../components/ResultsTable'
import { SearchPanel } from '../components/SearchPanel'
import { SuccessDialog } from '../components/SuccessDialog'
import { emptySearchFilters, type SearchFilters, type UserRecord, type UserRole } from '../types'

interface Props {
  role: UserRole
  title: string
  description: string
  addLabel: string
}

export function UserManagementPage({ role, title, description, addLabel }: Props) {
  const [filters, setFilters] = useState<SearchFilters>(emptySearchFilters)
  const [rows, setRows] = useState<UserRecord[]>([])
  const [searched, setSearched] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [success, setSuccess] = useState<{
    invitationSent: boolean
    email: string
    name: string
  } | null>(null)

  const runSearch = useCallback(
    async (nextFilters: SearchFilters) => {
      try {
        setSearching(true)
        setError(null)
        const results = await searchUsers(role, nextFilters)
        setRows(results)
        setSearched(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setSearching(false)
      }
    },
    [role],
  )

  useEffect(() => {
    void runSearch(emptySearchFilters)
  }, [runSearch])

  return (
    <Box>
      <SearchPanel
        title={title}
        description={description}
        filters={filters}
        onChange={setFilters}
        onSearch={() => void runSearch(filters)}
        onReset={() => {
          setFilters(emptySearchFilters)
          void runSearch(emptySearchFilters)
        }}
        onAdd={() => setCreateOpen(true)}
        addLabel={addLabel}
        searching={searching}
        showAdminRoleFilter={role === 'admin'}
      />

      {error && (
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          <Alert.Title>{error}</Alert.Title>
        </Alert.Root>
      )}

      {searching && !searched ? (
        <Box display="grid" placeItems="center" py={16}>
          <Spinner size="lg" color="teal.500" />
        </Box>
      ) : (
        <ResultsTable
          role={role}
          rows={rows}
          emptyMessage={
            searched ? 'No matching records found. Try adjusting your filters.' : 'No records yet.'
          }
        />
      )}

      <CreateUserModal
        open={createOpen}
        role={role}
        onClose={() => setCreateOpen(false)}
        onCreated={(result) => {
          setSuccess(result)
          void runSearch(filters)
        }}
      />

      <SuccessDialog
        open={!!success}
        invitationSent={success?.invitationSent ?? false}
        name={success?.name ?? ''}
        email={success?.email ?? ''}
        onClose={() => setSuccess(null)}
      />
    </Box>
  )
}
