import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export default function DonutChartCJ({ data, total }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const dpr = Math.max(window.devicePixelRatio || 1, 2)

    const percentLabelPlugin = {
      id: 'outerPercentLabels',
      afterDatasetsDraw(chart) {
        const { ctx: c } = chart
        const meta = chart.getDatasetMeta(0)
        if (!meta.data.length) return

        const firstArc = meta.data[0]
        const cx = firstArc.x
        const cy = firstArc.y
        const outerR = firstArc.outerRadius

        meta.data.forEach((arc, i) => {
          if (!data[i]) return
          const midAngle = (arc.startAngle + arc.endAngle) / 2
          const color = data[i].color || '#333'
          const pctNum = data[i].value.toFixed(2).replace('.', ',')

          const labelR = outerR + 12
          const lx = cx + Math.cos(midAngle) * labelR
          const ly = cy + Math.sin(midAngle) * labelR

          const cosA = Math.cos(midAngle)
          let align = 'center'
          let offsetX = 0
          if (cosA < -0.2) { align = 'right'; offsetX = 2 }
          else if (cosA > 0.2) { align = 'left'; offsetX = -2 }

          c.save()
          c.textBaseline = 'middle'

          c.font = 'bold 13px Pragmatica, Inter, system-ui, sans-serif'
          const numW = c.measureText(pctNum).width
          c.font = 'bold 9px Pragmatica, Inter, system-ui, sans-serif'
          const pctW = c.measureText('%').width
          const totalW = numW + pctW

          let startX
          if (align === 'left') startX = lx + offsetX
          else if (align === 'right') startX = lx + offsetX - totalW
          else startX = lx - totalW / 2

          c.font = 'bold 13px Pragmatica, Inter, system-ui, sans-serif'
          c.fillStyle = color
          c.textAlign = 'left'
          c.fillText(pctNum, startX, ly)

          c.font = 'bold 9px Pragmatica, Inter, system-ui, sans-serif'
          c.fillText('%', startX + numW, ly)
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
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverOffset: 4,
          borderRadius: 6,
          spacing: 2,
        }],
      },
      options: {
        cutout: '64%',
        rotation: -90,
        responsive: true,
        maintainAspectRatio: true,
        devicePixelRatio: dpr,
        layout: {
          padding: { top: 26, bottom: 26, left: 50, right: 50 },
        },
        animation: { duration: 500, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFont: { family: 'Pragmatica, sans-serif', size: 11 },
            bodyFont: { family: 'Pragmatica, sans-serif', size: 10 },
            padding: 8,
            cornerRadius: 6,
          },
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

  const renderCenter = () => {
    if (!total) return null
    const parts = total.split(',')
    const intPart = parts[0]
    const decPart = parts[1] ?? '00'

    return (
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{ lineHeight: 1, textAlign: 'center', whiteSpace: 'nowrap' }}>
          <span style={{
            color: '#fff',
            fontSize: 38, fontWeight: 700,
            fontFamily: 'Pragmatica, sans-serif',
            letterSpacing: '-0.02em',
          }}>
            {intPart}
          </span>
          <span style={{
            color: '#fff',
            fontSize: 18, fontWeight: 700,
            fontFamily: 'Pragmatica, sans-serif',
          }}>
            ,{decPart}
          </span>
        </div>
        <div style={{
          color: '#fff',
          fontSize: 16,
          fontFamily: 'Pragmatica, sans-serif',
          fontWeight: 400, marginTop: 1,
          letterSpacing: '0.02em',
        }}>
          млн руб
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <canvas ref={canvasRef} />
      {renderCenter()}
    </div>
  )
}
