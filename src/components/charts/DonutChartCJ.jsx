import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export default function DonutChartCJ({ data, total }) {
  const canvasRef = useRef(null)
  const chartRef  = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }

    const ctx = canvasRef.current.getContext('2d')
    const sum = data.reduce((acc, d) => acc + d.value, 0)

    const percentLabelPlugin = {
      id: 'percentLabels',
      afterDatasetsDraw(chart) {
        const { ctx: c } = chart
        const meta = chart.getDatasetMeta(0)
        meta.data.forEach((el, i) => {
          const pct = sum > 0 ? (data[i].value / sum * 100).toFixed(2) : '0.00'
          const { x, y } = el.tooltipPosition()
          c.save()
          c.font = 'bold 9px Inter, sans-serif'
          c.fillStyle = data[i].color === '#ffffff' ? '#333' : '#fff'
          c.textAlign = 'center'
          c.textBaseline = 'middle'
          c.fillText(pct + '%', x, y)
          c.restore()
        })
      },
    }

    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: data.map(d => d.color),
          borderColor: '#111118',
          borderWidth: 3,
          hoverOffset: 6,
        }],
      },
      options: {
        cutout: '68%',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400 },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
      },
      plugins: [percentLabelPlugin],
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [data, total])

  const computedTotal = data.reduce((acc, d) => acc + d.value, 0).toFixed(2).replace('.', ',')
  const displayTotal = total != null && total !== '' ? total : computedTotal

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{displayTotal}</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, marginTop: 3 }}>млн руб</div>
      </div>
    </div>
  )
}
