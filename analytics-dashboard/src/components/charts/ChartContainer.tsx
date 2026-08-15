import { useEffect, useRef } from 'react'
import HighchartsReact from 'highcharts-react-official'
import type { HighchartsReactRefObject } from 'highcharts-react-official'
import type HighchartsNamespace from 'highcharts'
import Highcharts, { ensureHighchartsModules } from './highchartsSetup'

interface ChartContainerProps {
  options: HighchartsNamespace.Options
}

export function ChartContainer({ options }: ChartContainerProps) {
  const chartRef = useRef<HighchartsReactRefObject>(null)

  useEffect(() => {
    ensureHighchartsModules()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      chartRef.current?.chart?.reflow()
    }
    window.addEventListener('resize', handleResize)
    const timer = window.setTimeout(handleResize, 50)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.clearTimeout(timer)
    }
  }, [options])

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartRef}
      containerProps={{ style: { width: '100%', height: '100%' } }}
    />
  )
}
