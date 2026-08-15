import type { ChartSeries } from '../../types/dashboard'
import { baseChartOptions } from './highchartsSetup'
import { ChartContainer } from './ChartContainer'
import type Highcharts from 'highcharts'

interface Props {
  categories: string[]
  series: ChartSeries[]
}

export function LineChart({ categories, series }: Props) {
  const options: Highcharts.Options = {
    ...baseChartOptions,
    chart: { ...baseChartOptions.chart, type: 'line' },
    xAxis: { categories, crosshair: true },
    yAxis: { title: { text: undefined }, gridLineColor: '#e8eef1' },
    plotOptions: {
      series: {
        marker: { radius: 3 },
      },
    },
    series: series.map((s) => ({
      type: 'line',
      name: s.name,
      data: s.data as number[],
      color: s.color,
    })),
  }

  return <ChartContainer options={options} />
}
