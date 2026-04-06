import React from 'react'

export default function PriceChart({ suppliers, avgPrice }) {
  const W = 560, H = 220
  const L = 30, R = 50, T = 22, B = 30
  const CH = H - T - B

  if (!suppliers || suppliers.length === 0) {
    return <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} />
  }

  const allPrices = suppliers.map(s => s.price)
  const maxP = Math.max(...allPrices, avgPrice) * 1.12 || 1
  const step = (W - L - R) / suppliers.length
  const barW = 24

  const maxIdx = allPrices.indexOf(Math.max(...allPrices))
  const avgY = T + CH - (avgPrice / maxP) * CH

  /* Y-axis: 6 ticks (0–5) */
  const yTicks = 6
  const niceMax = Math.ceil(maxP / 1000) * 1000

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="pc-pink" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BF3580" />
          <stop offset="100%" stopColor="#F8D7E0" />
        </linearGradient>
        <linearGradient id="pc-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="16%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="rgba(209,209,209,0.42)" />
        </linearGradient>
      </defs>

      {/* Grid lines + Y-axis labels */}
      {Array.from({ length: yTicks }).map((_, t) => {
        const v = (niceMax / (yTicks - 1)) * t
        const y = T + CH - (v / niceMax) * CH
        return (
          <g key={t}>
            <line x1={L} y1={y} x2={W - R} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            <text x={L - 4} y={y + 3} textAnchor="end" fontSize="6" fill="rgba(255,255,255,0.6)" fontFamily="Pragmatica, sans-serif">
              {Math.round(v / 1000)}
            </text>
          </g>
        )
      })}

      {/* Y-axis title */}
      <text
        transform={`translate(8, ${T + CH / 2}) rotate(-90)`}
        textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.5)" fontFamily="Pragmatica, sans-serif"
      >
        цена, руб
      </text>

      {/* X-axis title */}
      <text
        x={(L + W - R) / 2} y={H - 2}
        textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.5)" fontFamily="Pragmatica, sans-serif"
      >
        поставщик
      </text>

      {/* Average price line */}
      <line x1={L} y1={avgY} x2={W - R} y2={avgY} stroke="#BF3580" strokeWidth="1" strokeDasharray="4 3" />
      <text x={L + 4} y={avgY - 4} fontSize="6" fill="#BF3580" fontWeight="700" fontFamily="Pragmatica, sans-serif">
        {avgPrice.toLocaleString('ru')}
      </text>

      {/* Bars */}
      {suppliers.map((s, i) => {
        const val = s.price
        const bH = Math.max(2, (val / niceMax) * CH)
        const cx = L + i * step + step / 2
        const bx = cx - barW / 2
        const by = T + CH - bH
        const isPink = i === maxIdx

        return (
          <g key={s.id || i}>
            <rect
              x={bx} y={by} width={barW} height={bH}
              fill={isPink ? 'url(#pc-pink)' : 'url(#pc-bar)'}
              rx={barW / 2}
            />
            <text
              x={cx} y={by - 4}
              textAnchor="middle" fontSize="6" fontWeight="700"
              fill="#fff" fontFamily="Pragmatica, sans-serif"
            >
              {val.toLocaleString('ru')}
            </text>
            <text
              x={cx} y={T + CH + 14}
              textAnchor="middle" fontSize="7" fill="#fff"
              fontFamily="Pragmatica, sans-serif"
            >
              {s.label || ''}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
