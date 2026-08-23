import { Box, Flex, Separator, Stack, Text } from '@chakra-ui/react'
import { FiActivity, FiInbox, FiShield, FiUsers } from 'react-icons/fi'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { DRAWER_WIDTH } from '../theme'

const navItems = [
  { label: 'Providers', path: '/providers', icon: FiActivity },
  { label: 'Consumers', path: '/consumers', icon: FiUsers },
  { label: 'Admins', path: '/admins', icon: FiShield },
  { label: 'Inbox', path: '/inbox', icon: FiInbox },
]

export function AppLayout() {
  const location = useLocation()

  return (
    <Flex minH="100vh" bg="#f4f6f9" color="gray.800">
      <Box
        as="aside"
        w={DRAWER_WIDTH}
        flexShrink={0}
        bg="#13253f"
        color="white"
        display="flex"
        flexDirection="column"
      >
        <Box px={5} py={5}>
          <Text fontSize="xs" letterSpacing="wider" textTransform="uppercase" color="whiteAlpha.700">
            Control center
          </Text>
          <Text fontSize="lg" fontWeight="700" lineHeight="short" color="white">
            Admin Panel
          </Text>
        </Box>
        <Separator borderColor="whiteAlpha.300" />
        <Stack gap={1} px={3} py={4} flex="1">
          {navItems.map((item) => {
            const selected = location.pathname.startsWith(item.path)
            const Icon = item.icon
            return (
              <Box
                key={item.path}
                asChild
                borderRadius="md"
                px={3}
                py={2.5}
                bg={selected ? 'rgba(13, 148, 136, 0.35)' : 'transparent'}
                color={selected ? 'white' : 'rgba(255,255,255,0.82)'}
                _hover={{
                  bg: selected ? 'rgba(13, 148, 136, 0.45)' : 'rgba(255,255,255,0.08)',
                }}
              >
                <NavLink to={item.path}>
                  <Flex align="center" gap={3}>
                    <Icon size={18} />
                    <Text fontWeight="600" color="inherit">
                      {item.label}
                    </Text>
                  </Flex>
                </NavLink>
              </Box>
            )
          })}
        </Stack>
        <Box px={5} py={5}>
          <Text fontSize="sm" color="whiteAlpha.700">
            Signed in as
          </Text>
          <Text fontWeight="600" color="white">
            Nina Okoro
          </Text>
        </Box>
      </Box>

      <Box as="main" flex="1" p={{ base: 4, md: 7 }} minW={0} color="gray.800">
        <Outlet />
      </Box>
    </Flex>
  )
}
