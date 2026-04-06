import React from 'react'

export default function PriceChart({ suppliers, avgPrice }) {
  const W = 320, H = 160
  const L = 40, R = 10, T = 20, B = 28
  const CH = H - T - B

  if (!suppliers || suppliers.length === 0) {
    return <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} />
  }

  const allPrices = suppliers.map(s => s.price)
  const maxP = Math.max(...allPrices, avgPrice) * 1.12 || 1
  const step = (W - L - R) / suppliers.length
  const barW = Math.max(8, Math.floor(step * 0.55))

  const maxIdx = allPrices.indexOf(Math.max(...allPrices))

  const avgY = T + CH - (avgPrice / maxP) * CH

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%" height="100%"
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="pc-pink" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8d7e0"/>
          <stop offset="100%" stopColor="#bf3580"/>
        </linearGradient>
        <linearGradient id="pc-grey" x1="0" y1="0" x2="0" y2="1">
          <stop offset="15%" stopColor="#808082"/>
          <stop offset="100%" stopColor="#cdcccc"/>
        </linearGradient>
      </defs>

      {[0,1,2,3,4].map(t => {
        const v = (maxP / 4) * t
        const y = T + CH - (v / maxP) * CH
        return (
          <g key={t}>
            <line x1={L} y1={y} x2={W - R} y2={y} stroke="rgba(0,0,0,0.07)" strokeWidth="1" strokeDasharray="3 3" />
            <text x={L - 3} y={y + 3} textAnchor="end" fontSize="7" fill="#aaa">
              {Math.round(v)}
            </text>
          </g>
        )
      })}

      <line x1={L} y1={avgY} x2={W - R} y2={avgY} stroke="#e84342" strokeWidth="1.2" strokeDasharray="4 3" />
      <text x={W - R - 2} y={avgY - 3} textAnchor="end" fontSize="7" fill="#e84342">ср. цена</text>

      {suppliers.map((s, i) => {
        const val = s.price
        const bH = Math.max(2, (val / maxP) * CH)
        const cx = L + i * step + step / 2
        const bx = cx - barW / 2
        const by = T + CH - bH
        const isPink = i === maxIdx
        return (
          <g key={s.id || i}>
            <rect x={bx} y={by} width={barW} height={bH} fill={isPink ? 'url(#pc-pink)' : 'url(#pc-grey)'} rx="3" />
            <text x={cx} y={by - 3} textAnchor="middle" fontSize="7" fill="#555" fontWeight="600">
              {val.toLocaleString('ru')}
            </text>
            <text x={cx} y={H - B + 14} textAnchor="middle" fontSize="7" fill="#888">
              {s.label ? s.label.replace('Поставщик ', '') : ''}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
