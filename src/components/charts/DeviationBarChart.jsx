import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export default function DeviationBarChart({ data, avg }) {
  const canvasRef = useRef(null)
  const chartRef  = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')

    const gradPink = ctx.createLinearGradient(200, 0, 0, 0)
    gradPink.addColorStop(0, '#bf3580')
    gradPink.addColorStop(1, '#f8d7e0')

    const gradGrey = ctx.createLinearGradient(200, 0, 0, 0)
    gradGrey.addColorStop(0, '#555')
    gradGrey.addColorStop(1, '#aaa')

    const labels = ['среднее', ...data.map(d => d.month)]
    const values = [avg, ...data.map(d => d.fact)]
    const colors = [gradPink, ...data.map(() => gradGrey)]

    const valueLabelPlugin = {
      id: 'devValueLabels',
      afterDatasetsDraw(chart) {
        const { ctx: c } = chart
        const meta = chart.getDatasetMeta(0)
        meta.data.forEach((el, i) => {
          const val = values[i]
          if (val == null) return
          c.save()
          c.font = 'bold 8px Inter, sans-serif'
          c.fillStyle = i === 0 ? '#bf3580' : '#555'
          c.textAlign = 'left'
          c.textBaseline = 'middle'
          c.fillText(val.toFixed(2).replace('.', ','), el.x + 4, el.y)
          c.restore()

          // Deviation badge for months (not average)
          if (i > 0) {
            const deviation = ((val - avg) / avg * 100)
            const label = (deviation >= 0 ? '+' : '') + deviation.toFixed(2).replace('.', ',') + '%'
            const chartArea = chart.chartArea
            c.save()
            c.font = '7px Inter, sans-serif'
            c.fillStyle = deviation < 0 ? '#e53935' : '#4caf50'
            c.textAlign = 'right'
            c.textBaseline = 'middle'
            c.fillText(label, chartArea.right - 2, el.y)
            c.restore()
          }
        })
      },
    }

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'объем',
            data: values,
            backgroundColor: colors,
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        layout: {
          padding: { right: 60 },
        },
        scales: {
          x: {
            min: 0,
            max: 14,
            grid: {
              color: 'rgba(0,0,0,0.1)',
              lineWidth: 0.5,
              borderDash: [4, 4],
            },
            ticks: {
              color: '#555',
              font: { size: 8 },
            },
          },
          y: {
            grid: { display: false },
            ticks: {
              color: '#333',
              font: { size: 9 },
            },
          },
        },
      },
      plugins: [valueLabelPlugin],
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [data, avg])

  return (
    <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
  )
}
