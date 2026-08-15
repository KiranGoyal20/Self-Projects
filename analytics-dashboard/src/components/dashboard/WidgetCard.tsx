import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Widget } from '../../types/dashboard'
import { ChartRenderer } from '../charts/ChartRenderer'

interface Props {
  widget: Widget
}

export function WidgetCard({ widget }: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        className="widget-drag-handle"
        sx={{
          alignItems: 'center',
          px: 1.5,
          py: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          cursor: 'grab',
          bgcolor: 'rgba(15, 76, 92, 0.03)',
          '&:active': { cursor: 'grabbing' },
        }}
      >
        <DragIndicatorIcon fontSize="small" color="action" />
        <Typography variant="subtitle2" sx={{ flex: 1 }} noWrap>
          {widget.title}
        </Typography>
        <Chip label={widget.type} size="small" variant="outlined" />
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0, p: 1.5 }}>
        <ChartRenderer widget={widget} />
      </Box>
    </Paper>
  )
}
