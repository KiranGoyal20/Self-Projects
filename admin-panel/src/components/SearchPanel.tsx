import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  NativeSelect,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { FiSearch } from 'react-icons/fi'
import { ADMIN_ROLES, type SearchFilters } from '../types'

interface Props {
  title: string
  description: string
  filters: SearchFilters
  onChange: (filters: SearchFilters) => void
  onSearch: () => void
  onReset: () => void
  onAdd: () => void
  addLabel: string
  searching?: boolean
  showAdminRoleFilter?: boolean
}

export function SearchPanel({
  title,
  description,
  filters,
  onChange,
  onSearch,
  onReset,
  onAdd,
  addLabel,
  searching,
  showAdminRoleFilter,
}: Props) {
  const setField = (key: keyof SearchFilters, value: string) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <Box
      bg="white"
      color="gray.800"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      p={{ base: 4, md: 6 }}
      mb={6}
      boxShadow="sm"
    >
      <Stack
        direction={{ base: 'column', sm: 'row' }}
        justify="space-between"
        align={{ sm: 'flex-start' }}
        gap={4}
        mb={5}
      >
        <Box>
          <Heading size="lg" mb={1} color="gray.900">
            {title}
          </Heading>
          <Text color="gray.600">{description}</Text>
        </Box>
        <Button colorPalette="teal" onClick={onAdd}>
          {addLabel}
        </Button>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        <Field.Root>
          <Field.Label color="gray.700" fontWeight="600">
            First name
          </Field.Label>
          <Input
            bg="white"
            color="gray.900"
            borderColor="gray.300"
            value={filters.firstName}
            onChange={(e) => setField('firstName', e.target.value)}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label color="gray.700" fontWeight="600">
            Last name
          </Field.Label>
          <Input
            bg="white"
            color="gray.900"
            borderColor="gray.300"
            value={filters.lastName}
            onChange={(e) => setField('lastName', e.target.value)}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label color="gray.700" fontWeight="600">
            Email
          </Field.Label>
          <Input
            bg="white"
            color="gray.900"
            borderColor="gray.300"
            value={filters.email}
            onChange={(e) => setField('email', e.target.value)}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label color="gray.700" fontWeight="600">
            Date of birth
          </Field.Label>
          <Input
            type="date"
            bg="white"
            color="gray.900"
            borderColor="gray.300"
            value={filters.dateOfBirth}
            onChange={(e) => setField('dateOfBirth', e.target.value)}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label color="gray.700" fontWeight="600">
            Phone
          </Field.Label>
          <Input
            bg="white"
            color="gray.900"
            borderColor="gray.300"
            value={filters.phone}
            onChange={(e) => setField('phone', e.target.value)}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label color="gray.700" fontWeight="600">
            Status
          </Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              bg="white"
              color="gray.900"
              borderColor="gray.300"
              value={filters.status}
              onChange={(e) => setField('status', e.target.value)}
            >
              <option value="">Any</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="invited">Invited</option>
              <option value="pending">Pending</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>
        {showAdminRoleFilter && (
          <Field.Root>
            <Field.Label color="gray.700" fontWeight="600">
              Role
            </Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                bg="white"
                color="gray.900"
                borderColor="gray.300"
                value={filters.adminRole}
                onChange={(e) => setField('adminRole', e.target.value)}
              >
                <option value="">Any</option>
                {ADMIN_ROLES.map((adminRole) => (
                  <option key={adminRole} value={adminRole}>
                    {adminRole}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
        )}
      </SimpleGrid>

      <Stack direction="row" gap={3} mt={5}>
        <Button colorPalette="blue" onClick={onSearch} loading={searching}>
          <FiSearch />
          {searching ? 'Searching…' : 'Search'}
        </Button>
        <Button variant="outline" color="gray.800" onClick={onReset} disabled={searching}>
          Reset
        </Button>
      </Stack>
    </Box>
  )
}
