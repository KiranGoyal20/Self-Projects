import Highcharts from 'highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsTreemap from 'highcharts/modules/treemap'

type HighchartsModule = (hc: typeof Highcharts) => void

function initModule(mod: unknown) {
  const candidate = mod as HighchartsModule | { default?: HighchartsModule }
  const fn = typeof candidate === 'function' ? candidate : candidate.default
  if (typeof fn === 'function') {
    fn(Highcharts)
  }
}

let initialized = false

export function ensureHighchartsModules() {
  if (initialized) return
  initModule(HighchartsMore)
  initModule(HighchartsTreemap)
  initialized = true
}

export const chartColors = [
  '#0f4c5c',
  '#e36414',
  '#5c80bc',
  '#2a9d8f',
  '#9b5de5',
  '#f4a261',
  '#457b9d',
  '#e76f51',
]

export const baseChartOptions: Highcharts.Options = {
  chart: {
    backgroundColor: 'transparent',
    style: { fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif' },
  },
  colors: chartColors,
  title: { text: undefined },
  credits: { enabled: false },
  accessibility: { enabled: false },
  legend: {
    itemStyle: { color: '#5b6b73', fontWeight: '500' },
  },
  tooltip: {
    shared: true,
    backgroundColor: '#ffffff',
    borderColor: '#d7e0e5',
    style: { color: '#1a2b32' },
  },
}

export default Highcharts
