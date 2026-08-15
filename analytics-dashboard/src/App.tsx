import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { Dashboard } from './components/dashboard/Dashboard'
import { theme } from './theme/theme'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box component="main" sx={{ py: { xs: 2, md: 4 } }}>
        <Container maxWidth="xl">
          <Dashboard />
        </Container>
      </Box>
    </ThemeProvider>
  )
}
