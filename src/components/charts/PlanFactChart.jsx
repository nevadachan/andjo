import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export default function PlanFactChart({ data }) {
  const canvasRef = useRef(null)
  const chartRef  = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')

    const gradPlan = ctx.createLinearGradient(0, 0, 0, 200)
    gradPlan.addColorStop(0, '#999')
    gradPlan.addColorStop(1, '#555')

    const gradFact = ctx.createLinearGradient(0, 0, 0, 200)
    gradFact.addColorStop(0, '#f8d7e0')
    gradFact.addColorStop(1, '#bf3580')

    const deviationPlugin = {
      id: 'planFactLabels',
      afterDatasetsDraw(chart) {
        const { ctx: c } = chart
        const planMeta = chart.getDatasetMeta(0)
        const factMeta = chart.getDatasetMeta(1)

        planMeta.data.forEach((planEl, i) => {
          const planVal = chart.data.datasets[0].data[i]
          const factVal = chart.data.datasets[1].data[i]
          if (planVal == null || factVal == null) return

          const factEl = factMeta.data[i]

          // Plan value label
          c.save()
          c.font = '8px Inter, sans-serif'
          c.fillStyle = '#aaa'
          c.textAlign = 'center'
          c.textBaseline = 'bottom'
          c.fillText(planVal.toFixed(2).replace('.', ','), planEl.x, planEl.y - 3)
          c.restore()

          // Fact value label
          c.save()
          c.font = 'bold 8px Inter, sans-serif'
          c.fillStyle = '#f8d7e0'
          c.textAlign = 'center'
          c.textBaseline = 'bottom'
          c.fillText(factVal.toFixed(2).replace('.', ','), factEl.x, factEl.y - 3)
          c.restore()

          // Deviation label above the group
          const absDiff = factVal - planVal
          const pctDiff = ((absDiff / planVal) * 100)
          const label1 = (pctDiff >= 0 ? '+' : '') + pctDiff.toFixed(2).replace('.', ',') + '%'
          const label2 = (absDiff >= 0 ? '+' : '') + absDiff.toFixed(2).replace('.', ',') + ' млн'
          const midX = (planEl.x + factEl.x) / 2
          const topY = Math.min(planEl.y, factEl.y) - 18

          c.save()
          c.font = '7px Inter, sans-serif'
          c.fillStyle = absDiff < 0 ? '#ff6b6b' : '#4caf50'
          c.textAlign = 'center'
          c.textBaseline = 'bottom'
          c.fillText(label1, midX, topY)
          c.fillText(label2, midX, topY + 10)
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
            label: 'план',
            data: data.map(d => d.plan),
            backgroundColor: gradPlan,
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: 'факт',
            data: data.map(d => d.fact),
            backgroundColor: gradFact,
            borderRadius: 4,
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
              font: { size: 7 },
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
              text: 'млн руб',
              color: '#fff',
              font: { size: 8 },
            },
          },
        },
      },
      plugins: [deviationPlugin],
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
