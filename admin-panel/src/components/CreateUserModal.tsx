import {
  Alert,
  Button,
  Dialog,
  Field,
  Input,
  NativeSelect,
  Portal,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { createUser } from '../api/mockApi'
import { ADMIN_ROLES, type AdminRole, type CreateUserInput, type UserRole } from '../types'

interface Props {
  open: boolean
  role: UserRole
  onClose: () => void
  onCreated: (result: { invitationSent: boolean; email: string; name: string }) => void
}

const emptyForm: CreateUserInput = {
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  phone: '',
  organization: '',
  adminRole: '',
}

const roleLabels: Record<UserRole, string> = {
  provider: 'Provider',
  consumer: 'Consumer',
  admin: 'Admin',
}

export function CreateUserModal({ open, role, onClose, onCreated }: Props) {
  const [form, setForm] = useState<CreateUserInput>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof CreateUserInput, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setForm(emptyForm)
      setErrors({})
      setSubmitError(null)
      setSubmitting(false)
    }
  }, [open, role])

  const setField = (key: keyof CreateUserInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const validate = () => {
    const next: Partial<Record<keyof CreateUserInput, string>> = {}
    if (!form.firstName.trim()) next.firstName = 'Required'
    if (!form.lastName.trim()) next.lastName = 'Required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email'
    }
    if (!form.dateOfBirth) next.dateOfBirth = 'Required'
    if (!form.phone.trim()) next.phone = 'Required'
    if ((role === 'provider' || role === 'admin') && !form.organization?.trim()) {
      next.organization = 'Required'
    }
    if (role === 'admin' && !form.adminRole) {
      next.adminRole = 'Select a role'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    try {
      setSubmitting(true)
      setSubmitError(null)
      const result = await createUser(role, {
        ...form,
        adminRole: role === 'admin' ? (form.adminRole as AdminRole) : undefined,
      })
      onCreated({
        invitationSent: result.invitationSent,
        email: result.user.email,
        name: `${result.user.firstName} ${result.user.lastName}`,
      })
      onClose()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setSubmitting(false)
    }
  }

  const showOrg = role === 'provider' || role === 'admin'

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => {
        if (!details.open && !submitting) onClose()
      }}
      placement="center"
      size="lg"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="white" color="gray.800">
            <Dialog.Header>
              <Dialog.Title color="gray.900">Add {roleLabels[role]}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap={4}>
                {role === 'consumer' && (
                  <Alert.Root status="info">
                    <Alert.Indicator />
                    <Alert.Title>
                      Consumers are invited by email. After you submit, an invitation link will be
                      sent so they can complete signup.
                    </Alert.Title>
                  </Alert.Root>
                )}
                {submitError && (
                  <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Title>{submitError}</Alert.Title>
                  </Alert.Root>
                )}

                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                  <Field.Root invalid={!!errors.firstName} required>
                    <Field.Label color="gray.700" fontWeight="600">
                      First name
                    </Field.Label>
                    <Input
                      bg="white"
                      color="gray.900"
                      borderColor="gray.300"
                      value={form.firstName}
                      onChange={(e) => setField('firstName', e.target.value)}
                    />
                    {errors.firstName && <Field.ErrorText>{errors.firstName}</Field.ErrorText>}
                  </Field.Root>
                  <Field.Root invalid={!!errors.lastName} required>
                    <Field.Label color="gray.700" fontWeight="600">
                      Last name
                    </Field.Label>
                    <Input
                      bg="white"
                      color="gray.900"
                      borderColor="gray.300"
                      value={form.lastName}
                      onChange={(e) => setField('lastName', e.target.value)}
                    />
                    {errors.lastName && <Field.ErrorText>{errors.lastName}</Field.ErrorText>}
                  </Field.Root>
                </SimpleGrid>

                <Field.Root invalid={!!errors.email} required>
                  <Field.Label color="gray.700" fontWeight="600">
                    Email
                  </Field.Label>
                  <Input
                    type="email"
                    bg="white"
                    color="gray.900"
                    borderColor="gray.300"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                  />
                  {errors.email && <Field.ErrorText>{errors.email}</Field.ErrorText>}
                </Field.Root>

                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                  <Field.Root invalid={!!errors.dateOfBirth} required>
                    <Field.Label color="gray.700" fontWeight="600">
                      Date of birth
                    </Field.Label>
                    <Input
                      type="date"
                      bg="white"
                      color="gray.900"
                      borderColor="gray.300"
                      value={form.dateOfBirth}
                      onChange={(e) => setField('dateOfBirth', e.target.value)}
                    />
                    {errors.dateOfBirth && (
                      <Field.ErrorText>{errors.dateOfBirth}</Field.ErrorText>
                    )}
                  </Field.Root>
                  <Field.Root invalid={!!errors.phone} required>
                    <Field.Label color="gray.700" fontWeight="600">
                      Phone
                    </Field.Label>
                    <Input
                      bg="white"
                      color="gray.900"
                      borderColor="gray.300"
                      value={form.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                    />
                    {errors.phone && <Field.ErrorText>{errors.phone}</Field.ErrorText>}
                  </Field.Root>
                </SimpleGrid>

                {role === 'admin' && (
                  <Field.Root invalid={!!errors.adminRole} required>
                    <Field.Label color="gray.700" fontWeight="600">
                      Role
                    </Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        bg="white"
                        color="gray.900"
                        borderColor="gray.300"
                        value={form.adminRole ?? ''}
                        onChange={(e) => setField('adminRole', e.target.value)}
                      >
                        <option value="" disabled>
                          Select a role
                        </option>
                        {ADMIN_ROLES.map((adminRole) => (
                          <option key={adminRole} value={adminRole}>
                            {adminRole}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    {errors.adminRole && <Field.ErrorText>{errors.adminRole}</Field.ErrorText>}
                  </Field.Root>
                )}

                {showOrg && (
                  <Field.Root invalid={!!errors.organization} required>
                    <Field.Label color="gray.700" fontWeight="600">
                      {role === 'admin' ? 'Team / department' : 'Organization'}
                    </Field.Label>
                    <Input
                      bg="white"
                      color="gray.900"
                      borderColor="gray.300"
                      value={form.organization}
                      onChange={(e) => setField('organization', e.target.value)}
                    />
                    {errors.organization && (
                      <Field.ErrorText>{errors.organization}</Field.ErrorText>
                    )}
                  </Field.Root>
                )}
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button colorPalette="teal" onClick={handleSubmit} loading={submitting}>
                {role === 'consumer'
                  ? 'Send invitation'
                  : `Create ${roleLabels[role].toLowerCase()}`}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
