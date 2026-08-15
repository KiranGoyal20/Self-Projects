import Alert from '@mui/material/Alert'
import type { Widget } from '../../types/dashboard'
import { BarChart } from './BarChart'
import { BubbleChart } from './BubbleChart'
import { KpiCard } from './KpiCard'
import { LineChart } from './LineChart'
import { PieChart } from './PieChart'
import { TableChart } from './TableChart'
import { TreeChart } from './TreeChart'

interface Props {
  widget: Widget
}

function hasCategories(
  data: Widget['data'],
): data is { categories: string[]; series: import('../../types/dashboard').ChartSeries[] } {
  return 'categories' in data && 'series' in data
}

function hasSeriesOnly(
  data: Widget['data'],
): data is { series: import('../../types/dashboard').ChartSeries[] } {
  return 'series' in data && !('categories' in data)
}

export function ChartRenderer({ widget }: Props) {
  const { type, data } = widget

  switch (type) {
    case 'bar':
      if (!hasCategories(data)) return <Alert severity="warning">Invalid bar chart data</Alert>
      return <BarChart categories={data.categories} series={data.series} />
    case 'line':
      if (!hasCategories(data)) return <Alert severity="warning">Invalid line chart data</Alert>
      return <LineChart categories={data.categories} series={data.series} />
    case 'pie':
      if (!hasSeriesOnly(data)) return <Alert severity="warning">Invalid pie chart data</Alert>
      return <PieChart series={data.series} />
    case 'donut':
      if (!hasSeriesOnly(data)) return <Alert severity="warning">Invalid donut chart data</Alert>
      return <PieChart series={data.series} donut />
    case 'bubble':
      if (!('points' in data)) return <Alert severity="warning">Invalid bubble chart data</Alert>
      return <BubbleChart points={data.points} />
    case 'tree':
      if (!('tree' in data)) return <Alert severity="warning">Invalid tree chart data</Alert>
      return <TreeChart tree={data.tree} />
    case 'kpi':
      if (!('kpis' in data)) return <Alert severity="warning">Invalid KPI data</Alert>
      return <KpiCard kpis={data.kpis} />
    case 'table':
      if (!('columns' in data) || !('rows' in data)) {
        return <Alert severity="warning">Invalid table data</Alert>
      }
      return <TableChart columns={data.columns} rows={data.rows} />
    default:
      return <Alert severity="info">Unsupported chart type</Alert>
  }
}
