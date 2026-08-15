import type { Layout } from 'react-grid-layout'

export type ChartType =
  | 'bar'
  | 'line'
  | 'pie'
  | 'donut'
  | 'bubble'
  | 'tree'
  | 'kpi'
  | 'table'

export interface SeriesPoint {
  name: string
  y?: number
  value?: number
  z?: number
  color?: string
}

export interface ChartSeries {
  name: string
  data: number[] | SeriesPoint[] | Array<[number, number, number]>
  color?: string
}

export interface TableColumn {
  field: string
  headerName: string
  width?: number
  align?: 'left' | 'right' | 'center'
}

export interface TableRow {
  id: string | number
  [key: string]: string | number | boolean | null
}

export interface KpiData {
  label: string
  value: string | number
  delta?: number
  deltaLabel?: string
  unit?: string
  trend?: 'up' | 'down' | 'flat'
}

export interface TreeNode {
  name: string
  value?: number
  color?: string
  children?: TreeNode[]
}

export type WidgetData =
  | { categories: string[]; series: ChartSeries[] }
  | { series: ChartSeries[] }
  | { points: Array<{ name: string; x: number; y: number; z: number }> }
  | { tree: TreeNode[] }
  | { kpis: KpiData[] }
  | { columns: TableColumn[]; rows: TableRow[] }

export interface Widget {
  id: string
  title: string
  type: ChartType
  data: WidgetData
}

export interface DashboardGrid {
  id: string
  title: string
  description?: string
  layout: Layout
  widgets: Widget[]
}

export interface TabMeta {
  id: string
  label: string
  icon?: string
}

export interface TabData {
  id: string
  label: string
  grids: DashboardGrid[]
}

export interface DashboardMeta {
  id: string
  title: string
  subtitle?: string
  tabs: TabMeta[]
}
