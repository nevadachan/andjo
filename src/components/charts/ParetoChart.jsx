import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export default function ParetoChart({ labels, costData, cumulativeData }) {
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

    const gradId = ctx.createLinearGradient(0, 0, 0, 300)
    gradId.addColorStop(0, '#808082')
    gradId.addColorStop(1, '#cdcccc')

    const yMax = Math.ceil(Math.max(...costData) * 1.2 / 5) * 5

    const valueLabelPlugin = {
      id: 'valueLabels',
      afterDatasetsDraw(chart) {
        const { ctx: c } = chart
        chart.data.datasets.forEach((ds, di) => {
          const meta = chart.getDatasetMeta(di)
          if (meta.hidden) return
          meta.data.forEach((el, i) => {
            const val = ds.data[i]
            if (val == null) return
            c.save()
            c.font = 'bold 9px Pragmatica, Inter, sans-serif'
            c.textAlign = 'center'
            if (di === 0) {
              // ── бар: чёрный цвет, отступ 6px над баром ──
              c.fillStyle = '#000'
              c.textBaseline = 'bottom'
              c.fillText(val.toFixed(2), el.x, el.y - 6)
            } else if (di === 1) {
              // ── линия накопленной доли: розовый, правее точки ──
              c.fillStyle = '#bf3580'
              c.textBaseline = 'middle'
              c.fillText(val.toFixed(1) + '%', el.x + 14, el.y)
            }
            // di === 2 — пороговая линия, подписи не нужны
            c.restore()
          })
        })
      },
    }

    chartRef.current = new Chart(ctx, {
      data: {
        labels: labels.map(l => l.split('\n')),
        datasets: [
          {
            type: 'bar',
            label: 'вклад в себестоимость',
            data: costData,
            backgroundColor: gradId,
            borderColor: 'transparent',
            borderRadius: 4,
            yAxisID: 'yLeft',
            order: 2,
          },
          {
            type: 'line',
            label: 'накопленная доля',
            data: cumulativeData,
            borderColor: '#bf3580',
            backgroundColor: 'transparent',
            pointBackgroundColor: '#bf3580',
            pointRadius: 4,
            tension: 0.3,
            yAxisID: 'yRight',
            order: 1,
          },
          {
            type: 'line',
            label: 'пороговое значение',
            data: new Array(labels.length).fill(80),
            borderColor: '#e53935',
            borderDash: [5, 5],
            borderWidth: 1.5,
            backgroundColor: 'transparent',
            pointRadius: 0,
            yAxisID: 'yRight',
            order: 0,
          },
        ],
      },
      options: {
        animation: { duration: 400 },
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: dpr,
        layout: {
          // ── отступ сверху чтобы цифры над барами не обрезались ──
          padding: { top: 18 },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
        scales: {
          x: {
            grid: { color: 'rgba(142,143,143,0.25)', lineWidth: 0.5 },
            ticks: { font: { size: 8 }, color: '#555', maxRotation: 0 },
          },
          yLeft: {
            type: 'linear',
            position: 'left',
            min: 0,
            max: yMax,
            grid: { color: 'rgba(142,143,143,0.25)', lineWidth: 0.5 },
            ticks: { font: { size: 8 }, color: '#555' },
            title: {
              display: true,
              text: 'вклад в себестоимость, млн руб',
              font: { size: 7 },
              color: '#888',
            },
          },
          yRight: {
            type: 'linear',
            position: 'right',
            min: 0,
            max: 110,
            grid: { drawOnChartArea: false },
            ticks: { font: { size: 8 }, color: '#555', callback: v => v + '%' },
            title: {
              display: true,
              text: 'накопленная доля, %',
              font: { size: 7 },
              color: '#888',
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
  }, [labels, costData, cumulativeData])

  return (
    <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
  )
}
