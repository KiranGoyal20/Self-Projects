import { ChakraProvider } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { system } from '../../theme'

/** Light-mode only provider — avoids dark fg tokens on light panels. */
export function Provider({ children }: { children: ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>
}
