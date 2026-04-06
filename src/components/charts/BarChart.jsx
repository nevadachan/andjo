import React from 'react'

export default function BarChart({ suppliers, getValue, colorVariant, normLine, normLabel }) {
  const W = 320, H = 160
  const L = 30, R = 10, T = 20, B = 28
  const CH = H - T - B
  const isPink = colorVariant === 'pink'
  const gradId = `bg-${colorVariant}-${isPink ? 1 : 0}`

  if (!suppliers || suppliers.length === 0) {
    return <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} />
  }

  const maxValue = Math.max(...suppliers.map(s => getValue(s))) * 1.15 || 1
  const step = (W - L - R) / suppliers.length
  const barW = Math.max(8, Math.floor(step * 0.55))

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%" height="100%"
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          {isPink
            ? <><stop offset="0%" stopColor="#f8d7e0"/><stop offset="100%" stopColor="#bf3580"/></>
            : <><stop offset="15%" stopColor="#808082"/><stop offset="100%" stopColor="#cdcccc"/></>
          }
        </linearGradient>
      </defs>

      {[0,1,2,3,4].map(t => {
        const v = (maxValue / 4) * t
        const y = T + CH - (v / maxValue) * CH
        return (
          <g key={t}>
            <line x1={L} y1={y} x2={W - R} y2={y} stroke="rgba(0,0,0,0.07)" strokeWidth="1" strokeDasharray="3 3" />
            <text x={L - 3} y={y + 3} textAnchor="end" fontSize="7" fill="#aaa">
              {Math.round(v)}
            </text>
          </g>
        )
      })}

      {normLine != null && (() => {
        const ny = T + CH - (normLine / maxValue) * CH
        return (
          <g>
            <line x1={L} y1={ny} x2={W - R} y2={ny} stroke="#e84342" strokeWidth="1.2" strokeDasharray="4 3" />
            {normLabel && (
              <text x={W - R - 2} y={ny - 3} textAnchor="end" fontSize="7" fill="#e84342">{normLabel}</text>
            )}
          </g>
        )
      })()}

      {suppliers.map((s, i) => {
        const val = getValue(s)
        const bH = Math.max(2, (val / maxValue) * CH)
        const cx = L + i * step + step / 2
        const bx = cx - barW / 2
        const by = T + CH - bH
        return (
          <g key={s.id || i}>
            <rect x={bx} y={by} width={barW} height={bH} fill={`url(#${gradId})`} rx="3" />
            <text x={cx} y={by - 3} textAnchor="middle" fontSize="7" fill="#555" fontWeight="600">
              {typeof val === 'number' ? val.toFixed(1) : val}
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
