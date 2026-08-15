import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Responsive, useContainerWidth, verticalCompactor } from 'react-grid-layout'
import type { Layout } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import type { DashboardGrid } from '../../types/dashboard'
import { WidgetCard } from './WidgetCard'

interface Props {
  grid: DashboardGrid
}

const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }

export function DashboardGridSection({ grid }: Props) {
  const { width, containerRef, mounted } = useContainerWidth()
  const [layout, setLayout] = useState<Layout>(grid.layout)

  const widgetMap = useMemo(
    () => Object.fromEntries(grid.widgets.map((w) => [w.id, w])),
    [grid.widgets],
  )

  const layouts = useMemo(
    () => ({
      lg: layout,
      md: layout,
      sm: layout.map((item) => ({ ...item, w: Math.min(item.w, 6), x: Math.min(item.x, 4) })),
      xs: layout.map((item) => ({ ...item, w: 4, x: 0 })),
      xxs: layout.map((item) => ({ ...item, w: 2, x: 0 })),
    }),
    [layout],
  )

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">{grid.title}</Typography>
        {grid.description && (
          <Typography variant="body2" color="text.secondary">
            {grid.description}
          </Typography>
        )}
      </Box>

      <Box ref={containerRef} sx={{ width: '100%' }}>
        {mounted && (
          <Responsive
            className="dashboard-grid"
            width={width}
            layouts={layouts}
            breakpoints={breakpoints}
            cols={cols}
            rowHeight={36}
            dragConfig={{ handle: '.widget-drag-handle' }}
            compactor={verticalCompactor}
            onLayoutChange={(current: Layout) => {
              setLayout(current)
            }}
          >
            {grid.widgets.map((widget) => (
              <div key={widget.id}>
                <WidgetCard widget={widgetMap[widget.id] ?? widget} />
              </div>
            ))}
          </Responsive>
        )}
      </Box>
    </Box>
  )
}
