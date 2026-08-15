import { baseChartOptions } from './highchartsSetup'
import { ChartContainer } from './ChartContainer'
import type Highcharts from 'highcharts'

interface Point {
  name: string
  x: number
  y: number
  z: number
}

interface Props {
  points: Point[]
}

export function BubbleChart({ points }: Props) {
  const options: Highcharts.Options = {
    ...baseChartOptions,
    chart: { ...baseChartOptions.chart, type: 'bubble', zooming: { type: 'xy' } },
    xAxis: {
      title: { text: 'Avg session duration (min)' },
      gridLineWidth: 1,
      gridLineColor: '#e8eef1',
    },
    yAxis: {
      title: { text: 'Engagement score' },
      gridLineColor: '#e8eef1',
    },
    tooltip: {
      ...baseChartOptions.tooltip,
      shared: false,
      useHTML: true,
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormat: 'Duration: {point.x}<br/>Score: {point.y}<br/>Volume: {point.z}',
    },
    series: [
      {
        type: 'bubble',
        name: 'Segments',
        data: points.map((p) => ({ name: p.name, x: p.x, y: p.y, z: p.z })),
      },
    ],
  }

  return <ChartContainer options={options} />
}
