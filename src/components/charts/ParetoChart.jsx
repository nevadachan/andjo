import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export default function ParetoChart({ labels, costData, cumulativeData }) {
  const canvasRef = useRef(null)
  const chartRef  = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }

    const ctx = canvasRef.current.getContext('2d')

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
            c.font = 'bold 9px Inter, sans-serif'
            c.fillStyle = di === 0 ? '#333' : '#bf3580'
            c.textAlign = 'center'
            c.textBaseline = di === 0 ? 'bottom' : 'middle'
            if (di === 0) {
              c.fillText(val.toFixed(2), el.x, el.y - 3)
            } else {
              c.fillText(val.toFixed(1) + '%', el.x + 14, el.y)
            }
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
            reverse: false,
            grid: { drawOnChartArea: false },
            ticks: {
              font: { size: 8 },
              color: '#555',
              callback: v => v + '%',
            },
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
