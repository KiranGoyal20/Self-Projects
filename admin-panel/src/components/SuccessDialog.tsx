import { Button, Dialog, Portal, Stack, Text } from '@chakra-ui/react'
import { FiCheckCircle, FiMail } from 'react-icons/fi'

interface Props {
  open: boolean
  invitationSent: boolean
  name: string
  email: string
  onClose: () => void
}

export function SuccessDialog({ open, invitationSent, name, email, onClose }: Props) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => {
        if (!details.open) onClose()
      }}
      placement="center"
      size="sm"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="white" color="gray.800">
            <Dialog.Header>
              <Dialog.Title color="gray.900">
                {invitationSent ? 'Invitation sent' : 'User created'}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack align="center" textAlign="center" gap={3} py={2}>
                {invitationSent ? (
                  <FiMail size={44} color="#0d9488" />
                ) : (
                  <FiCheckCircle size={44} color="#16a34a" />
                )}
                {invitationSent ? (
                  <Text color="gray.800">
                    Invitation link has been sent to <strong>{email}</strong> for{' '}
                    <strong>{name}</strong> to complete signup.
                  </Text>
                ) : (
                  <Text color="gray.800">
                    <strong>{name}</strong> was created successfully.
                  </Text>
                )}
              </Stack>
            </Dialog.Body>
            <Dialog.Footer justifyContent="center">
              <Button colorPalette="teal" onClick={onClose}>
                Done
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
