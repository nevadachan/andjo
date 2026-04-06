import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export default function MonthlyBarChart({ data }) {
  const canvasRef = useRef(null)
  const chartRef  = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')

    const grad = ctx.createLinearGradient(0, 0, 0, 200)
    grad.addColorStop(0, '#f8d7e0')
    grad.addColorStop(1, '#bf3580')

    const valueLabelPlugin = {
      id: 'monthlyValueLabels',
      afterDatasetsDraw(chart) {
        const { ctx: c } = chart
        const meta = chart.getDatasetMeta(0)
        meta.data.forEach((el, i) => {
          const val = chart.data.datasets[0].data[i]
          if (val == null) return
          c.save()
          c.font = 'bold 9px Inter, sans-serif'
          c.fillStyle = '#fff'
          c.textAlign = 'center'
          c.textBaseline = 'bottom'
          c.fillText(val.toFixed(2).replace('.', ','), el.x, el.y - 3)
          c.restore()
        })
      },
    }

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.month),
        datasets: [
          {
            label: 'объем закупок',
            data: data.map(d => d.fact),
            backgroundColor: grad,
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#fff',
              font: { size: 8 },
              maxRotation: 0,
            },
            title: {
              display: true,
              text: 'месяц',
              color: '#fff',
              font: { size: 8 },
            },
          },
          y: {
            min: 0,
            max: 14,
            grid: {
              color: 'rgba(142,143,143,0.3)',
              lineWidth: 0.8,
              borderDash: [4, 4],
            },
            ticks: {
              color: '#fff',
              font: { size: 8 },
            },
            title: {
              display: true,
              text: 'объем закупок, млн руб',
              color: '#fff',
              font: { size: 8 },
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
  }, [data])

  return (
    <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
  )
}
