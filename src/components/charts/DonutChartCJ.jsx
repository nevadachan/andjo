import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export default function DonutChartCJ({ data, total }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }

    const ctx = canvasRef.current.getContext('2d')

    /* ── Percent labels around slices ── */
    const percentLabelPlugin = {
      id: 'percentLabels',
      afterDatasetsDraw(chart) {
        const { ctx: c, width, height } = chart
        const meta = chart.getDatasetMeta(0)
        const centerX = width / 2
        const centerY = height / 2
        /* outer radius from the arc element */
        const outerR = meta.data[0]?.outerRadius || Math.min(width, height) / 2

        meta.data.forEach((el, i) => {
          const pct = data[i].value.toFixed(2).replace('.', ',')
          const midAngle = (el.startAngle + el.endAngle) / 2

          /* Position labels outside the donut */
          const labelR = outerR + 14
          const x = centerX + Math.cos(midAngle) * labelR
          const y = centerY + Math.sin(midAngle) * labelR

          c.save()
          c.font = 'bold 11px Pragmatica, sans-serif'
          c.fillStyle = data[i].color
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
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 4,
        }],
      },
      options: {
        cutout: '62%',
        responsive: true,
        maintainAspectRatio: true,
        layout: {
          padding: 24, /* space for percent labels outside the donut */
        },
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

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} />

      {/* Center label — "52,00 млн руб" */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        {total && (() => {
          const parts = total.split(',')
          return (
            <>
              <div style={{ lineHeight: 1, textAlign: 'center' }}>
                <span style={{ color: '#000', fontSize: 32, fontWeight: 700 }}>{parts[0]}</span>
                {parts[1] != null && (
                  <span style={{ color: '#000', fontSize: 16, fontWeight: 700 }}>,{parts[1]}</span>
                )}
              </div>
              <div style={{ color: '#000', fontSize: 14, marginTop: 2 }}>млн руб</div>
            </>
          )
        })()}
      </div>
    </div>
  )
}
