import type { ChartSeries } from '../../types/dashboard'
import { baseChartOptions } from './highchartsSetup'
import { ChartContainer } from './ChartContainer'
import type Highcharts from 'highcharts'

interface Props {
  categories: string[]
  series: ChartSeries[]
}

export function BarChart({ categories, series }: Props) {
  const options: Highcharts.Options = {
    ...baseChartOptions,
    chart: { ...baseChartOptions.chart, type: 'column' },
    xAxis: { categories, crosshair: true },
    yAxis: { title: { text: undefined }, gridLineColor: '#e8eef1' },
    plotOptions: {
      column: {
        borderRadius: 4,
        borderWidth: 0,
      },
    },
    series: series.map((s) => ({
      type: 'column',
      name: s.name,
      data: s.data as number[],
      color: s.color,
    })),
  }

  return <ChartContainer options={options} />
}
