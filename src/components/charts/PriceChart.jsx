import React from 'react'

export default function PriceChart({ suppliers, avgPrice, activeId }) {
  const W = 1120, H = 440
  const L = 60, R = 100, T = 44, B = 56
  const CH = H - T - B

  if (!suppliers || suppliers.length === 0) {
    return <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} />
  }

  const allPrices = suppliers.map(s => s.price)
  const maxP = Math.max(...allPrices, avgPrice) * 1.12 || 1
  const step = (W - L - R) / suppliers.length
  const barW = 48
  const maxIdx = allPrices.indexOf(Math.max(...allPrices))
  const avgY = T + CH - (avgPrice / maxP) * CH
  const yTicks = 6
  const niceMax = Math.ceil(maxP / 1000) * 1000

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block' }}
      shapeRendering="geometricPrecision"
      textRendering="optimizeLegibility"
    >
      <defs>
        {/* default pink bar (highest price) */}
        <linearGradient id="pc-pink" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BF3580" />
          <stop offset="100%" stopColor="#F8D7E0" />
        </linearGradient>
        {/* default grey bar */}
        <linearGradient id="pc-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="16%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="rgba(209,209,209,0.42)" />
        </linearGradient>
        {/* active pink bar — vivid */}
        <linearGradient id="pc-pink-active" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0409a" />
          <stop offset="100%" stopColor="#fce8f0" />
        </linearGradient>
        {/* active grey bar — brighter white */}
        <linearGradient id="pc-bar-active" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="rgba(230,230,230,0.9)" />
        </linearGradient>
      </defs>

      {/* grid lines */}
      {Array.from({ length: yTicks }).map((_, t) => {
        const v = (niceMax / (yTicks - 1)) * t
        const y = T + CH - (v / niceMax) * CH
        return (
          <g key={t}>
            <line x1={L} y1={y} x2={W - R} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" shapeRendering="crispEdges" />
            <text x={L - 8} y={y + 5} textAnchor="end" fontSize="12" fill="rgba(255,255,255,0.6)" fontFamily="Pragmatica, sans-serif">
              {Math.round(v / 1000)}
            </text>
          </g>
        )
      })}

      {/* axis labels */}
      <text
        transform={`translate(16, ${T + CH / 2}) rotate(-90)`}
        textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.5)" fontFamily="Pragmatica, sans-serif"
      >
        цена, руб
      </text>
      <text
        x={(L + W - R) / 2} y={H - 4}
        textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.5)" fontFamily="Pragmatica, sans-serif"
      >
        поставщик
      </text>

      {/* avg price line */}
      <line x1={L} y1={avgY} x2={W - R} y2={avgY} stroke="#BF3580" strokeWidth="2" strokeDasharray="8 6" shapeRendering="crispEdges" />
      <text x={L + 8} y={avgY - 8} fontSize="12" fill="#BF3580" fontWeight="700" fontFamily="Pragmatica, sans-serif">
        {avgPrice.toLocaleString('ru')}
      </text>

      {/* bars */}
      {suppliers.map((s, i) => {
        const val = s.price
        const bH = Math.max(4, (val / niceMax) * CH)
        const cx = L + i * step + step / 2
        const bx = cx - barW / 2
        const by = T + CH - bH

        const isHighest = i === maxIdx
        const isActive = activeId === s.id
        const dimmed = activeId && !isActive
        const opacity = dimmed ? 0.2 : 1

        // pick gradient
        let fill
        if (isActive) {
          fill = isHighest ? 'url(#pc-pink-active)' : 'url(#pc-bar-active)'
        } else {
          fill = isHighest ? 'url(#pc-pink)' : 'url(#pc-bar)'
        }

        const labelColor = isActive ? '#ea529b' : 'rgba(255,255,255,0.6)'
        const labelWeight = isActive ? 700 : 400
        const valueColor = isActive ? '#fff' : 'rgba(255,255,255,0.75)'

        return (
          <g
            key={s.id || i}
            style={{ transition: 'opacity 0.3s ease' }}
            opacity={opacity}
          >
            {/* glow behind active bar */}
            {isActive && (
              <rect
                x={bx - 7} y={by - 7}
                width={barW + 14} height={bH + 7}
                rx={(barW + 14) / 2}
                fill={isHighest ? 'rgba(191,53,128,0.18)' : 'rgba(255,255,255,0.08)'}
              />
            )}

            <rect
              x={bx} y={by} width={barW} height={bH}
              fill={fill}
              rx={barW / 2}
            />

            {/* value above bar */}
            <text
              x={cx} y={by - 8}
              textAnchor="middle" fontSize="12"
              fontWeight={isActive ? 700 : 600}
              fill={valueColor}
              fontFamily="Pragmatica, sans-serif"
            >
              {val.toLocaleString('ru')}
            </text>

            {/* supplier label below */}
            <text
              x={cx} y={T + CH + 28}
              textAnchor="middle" fontSize="14"
              fill={labelColor}
              fontWeight={labelWeight}
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
