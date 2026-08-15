import { useMemo } from 'react'
import type { TreeNode } from '../../types/dashboard'
import Highcharts, { baseChartOptions, ensureHighchartsModules } from './highchartsSetup'
import { ChartContainer } from './ChartContainer'

interface Props {
  tree: TreeNode[]
}

function flattenTree(
  nodes: TreeNode[],
  parentId?: string,
): Highcharts.PointOptionsObject[] {
  const points: Highcharts.PointOptionsObject[] = []

  nodes.forEach((node, index) => {
    const id = parentId ? `${parentId}/${node.name}` : `${node.name}-${index}`
    points.push({
      id,
      name: node.name,
      parent: parentId,
      value: node.children?.length ? undefined : node.value,
      color: node.color,
    })
    if (node.children?.length) {
      points.push(...flattenTree(node.children, id))
    }
  })

  return points
}

export function TreeChart({ tree }: Props) {
  ensureHighchartsModules()

  const data = useMemo(() => flattenTree(tree), [tree])

  const options: Highcharts.Options = {
    ...baseChartOptions,
    chart: { ...baseChartOptions.chart, type: 'treemap' },
    tooltip: {
      ...baseChartOptions.tooltip,
      shared: false,
      pointFormat: '<b>{point.name}</b>: {point.value}',
    },
    series: [
      {
        type: 'treemap',
        layoutAlgorithm: 'squarified',
        clip: false,
        dataLabels: {
          enabled: true,
          style: { textOutline: 'none', fontWeight: '600' },
        },
        levels: [
          {
            level: 1,
            dataLabels: { enabled: true },
            borderWidth: 3,
          },
          {
            level: 2,
            dataLabels: { enabled: true },
            borderWidth: 2,
          },
        ],
        data,
      },
    ],
  }

  return <ChartContainer options={options} />
}
