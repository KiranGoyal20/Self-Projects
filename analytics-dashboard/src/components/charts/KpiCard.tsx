import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { KpiData } from '../../types/dashboard'

interface Props {
  kpis: KpiData[]
}

function formatValue(kpi: KpiData) {
  if (typeof kpi.value === 'number') {
    const formatted = kpi.value.toLocaleString()
    return kpi.unit === '$' ? `$${formatted}` : `${formatted}${kpi.unit ?? ''}`
  }
  return kpi.value
}

function TrendIcon({ trend }: { trend?: KpiData['trend'] }) {
  if (trend === 'up') return <TrendingUpIcon fontSize="small" color="success" />
  if (trend === 'down') return <TrendingDownIcon fontSize="small" color="error" />
  return <TrendingFlatIcon fontSize="small" color="action" />
}

export function KpiCard({ kpis }: Props) {
  const kpi = kpis[0]
  if (!kpi) return null

  const positive = (kpi.delta ?? 0) >= 0

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {kpi.label}
      </Typography>
      <Typography variant="h4" component="div" sx={{ mb: 1.5 }}>
        {formatValue(kpi)}
      </Typography>
      {kpi.delta !== undefined && (
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          <TrendIcon trend={kpi.trend} />
          <Typography
            variant="body2"
            sx={{ color: positive ? 'success.main' : 'error.main', fontWeight: 600 }}
          >
            {positive ? '+' : ''}
            {kpi.delta}
            {typeof kpi.value === 'string' && kpi.value.includes('%') ? 'pp' : '%'}
          </Typography>
          {kpi.deltaLabel && (
            <Typography variant="caption" color="text.secondary">
              {kpi.deltaLabel}
            </Typography>
          )}
        </Stack>
      )}
    </Box>
  )
}
