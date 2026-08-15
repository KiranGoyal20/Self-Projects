import { useCallback, useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { fetchDashboard, fetchTabData } from '../../api/mockApi'
import type { DashboardMeta, TabData } from '../../types/dashboard'
import { DashboardGridSection } from './DashboardGridSection'

export function Dashboard() {
  const [meta, setMeta] = useState<DashboardMeta | null>(null)
  const [activeTabId, setActiveTabId] = useState<string>('')
  const [tabCache, setTabCache] = useState<Record<string, TabData>>({})
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [loadingTab, setLoadingTab] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoadingMeta(true)
        const dashboard = await fetchDashboard()
        if (cancelled) return
        setMeta(dashboard)
        setActiveTabId(dashboard.tabs[0]?.id ?? '')
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard')
        }
      } finally {
        if (!cancelled) setLoadingMeta(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const loadTab = useCallback(
    async (tabId: string) => {
      if (!tabId || tabCache[tabId]) return
      try {
        setLoadingTab(true)
        setError(null)
        const data = await fetchTabData(tabId)
        setTabCache((prev) => ({ ...prev, [tabId]: data }))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tab')
      } finally {
        setLoadingTab(false)
      }
    },
    [tabCache],
  )

  useEffect(() => {
    if (activeTabId) {
      void loadTab(activeTabId)
    }
  }, [activeTabId, loadTab])

  if (loadingMeta) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!meta) {
    return <Alert severity="error">{error ?? 'Dashboard unavailable'}</Alert>
  }

  const activeTab = tabCache[activeTabId]

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {meta.title}
        </Typography>
        {meta.subtitle && (
          <Typography variant="body1" color="text.secondary">
            {meta.subtitle}
          </Typography>
        )}
      </Box>

      <Tabs
        value={activeTabId}
        onChange={(_, value: string) => setActiveTabId(value)}
        sx={{
          mb: 3,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
        }}
      >
        {meta.tabs.map((tab) => (
          <Tab key={tab.id} label={tab.label} value={tab.id} />
        ))}
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loadingTab && !activeTab && (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {activeTab &&
        activeTab.grids.map((grid) => <DashboardGridSection key={grid.id} grid={grid} />)}
    </Box>
  )
}
