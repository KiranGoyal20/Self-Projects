import {
  Badge,
  Box,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { FiBell, FiCheck } from 'react-icons/fi'
import { fetchInbox, markNotificationRead } from '../api/mockApi'
import type { NotificationItem } from '../types'

const categoryColor: Record<NotificationItem['category'], string> = {
  system: 'gray',
  user: 'blue',
  invite: 'teal',
  security: 'red',
}

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function InboxPage() {
  const [items, setItems] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      setItems(await fetchInbox())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inbox')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const unreadCount = items.filter((item) => !item.read).length

  return (
    <Box>
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        justify="space-between"
        align={{ sm: 'center' }}
        gap={3}
        mb={6}
      >
        <Box>
          <Heading size="lg" mb={1} color="gray.900">
            Inbox
          </Heading>
          <Text color="gray.600">Notifications for the signed-in admin user.</Text>
        </Box>
        <Badge
          colorPalette={unreadCount ? 'teal' : 'gray'}
          variant={unreadCount ? 'solid' : 'subtle'}
          px={3}
          py={1}
          borderRadius="full"
          display="inline-flex"
          alignItems="center"
          gap={2}
        >
          <FiBell />
          {unreadCount} unread
        </Badge>
      </Flex>

      {error && (
        <Box
          mb={4}
          p={3}
          borderRadius="md"
          bg="red.50"
          color="red.700"
          borderWidth="1px"
          borderColor="red.200"
        >
          {error}
        </Box>
      )}

      <Box
        bg="white"
        color="gray.800"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="xl"
        overflow="hidden"
        boxShadow="sm"
      >
        {loading ? (
          <Box display="grid" placeItems="center" py={16}>
            <Spinner size="lg" color="teal.500" />
          </Box>
        ) : items.length === 0 ? (
          <Text color="gray.600" p={6}>
            No notifications yet.
          </Text>
        ) : (
          <Stack gap={0}>
            {items.map((item, index) => (
              <Flex
                key={item.id}
                px={5}
                py={4}
                gap={4}
                align="flex-start"
                bg={item.read ? 'white' : '#f0fdfa'}
                borderBottomWidth={index < items.length - 1 ? '1px' : '0'}
                borderColor="gray.100"
              >
                <Box flex="1" minW={0}>
                  <Flex align="center" gap={2} mb={1} flexWrap="wrap">
                    <Text fontWeight={item.read ? '500' : '700'} color="gray.900">
                      {item.title}
                    </Text>
                    <Badge colorPalette={categoryColor[item.category]} variant="subtle">
                      {item.category}
                    </Badge>
                  </Flex>
                  <Text color="gray.600" fontSize="sm">
                    {item.message}
                  </Text>
                  <Text color="gray.500" fontSize="xs" mt={2}>
                    {formatWhen(item.createdAt)}
                  </Text>
                </Box>
                {!item.read && (
                  <IconButton
                    aria-label="Mark as read"
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      await markNotificationRead(item.id)
                      setItems((prev) =>
                        prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)),
                      )
                    }}
                  >
                    <FiCheck />
                  </IconButton>
                )}
              </Flex>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  )
}
