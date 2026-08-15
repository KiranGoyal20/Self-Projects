import type { ChartSeries, SeriesPoint } from '../../types/dashboard'
import { baseChartOptions } from './highchartsSetup'
import { ChartContainer } from './ChartContainer'
import type Highcharts from 'highcharts'

interface Props {
  series: ChartSeries[]
  donut?: boolean
}

export function PieChart({ series, donut = false }: Props) {
  const primary = series[0]
  const options: Highcharts.Options = {
    ...baseChartOptions,
    chart: { ...baseChartOptions.chart, type: 'pie' },
    tooltip: {
      ...baseChartOptions.tooltip,
      shared: false,
      pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y})',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        innerSize: donut ? '55%' : '0%',
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          style: { fontWeight: '500', textOutline: 'none' },
        },
      },
    },
    series: [
      {
        type: 'pie',
        name: primary?.name ?? 'Share',
        data: (primary?.data as SeriesPoint[]) ?? [],
      },
    ],
  }

  return <ChartContainer options={options} />
}
