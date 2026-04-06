import React from 'react'

export default function BarChart({ suppliers, getValue, colorVariant, normLine, normLabel }) {
  const W = 560, H = 200
  const L = 30, R = 50, T = 22, B = 30
  const CH = H - T - B
  const isPink = colorVariant === 'pink'
  const gradId = `bar-grad-${colorVariant}`

  if (!suppliers || suppliers.length === 0) {
    return <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} />
  }

  const vals = suppliers.map(s => getValue(s))
  const rawMax = Math.max(...vals, normLine || 0)
  const niceMax = Math.ceil(rawMax * 1.25) || 1
  const step = (W - L - R) / suppliers.length
  const barW = 24

  /* Y-axis ticks */
  const yTicks = 6
  const tickStep = niceMax / (yTicks - 1)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          {isPink
            ? <><stop offset="0%" stopColor="#F8D7E0" /><stop offset="100%" stopColor="#BF3580" /></>
            : <><stop offset="16%" stopColor="#808082" /><stop offset="71%" stopColor="#CDCCCC" /></>
          }
        </linearGradient>
      </defs>

      {/* Grid + Y labels */}
      {Array.from({ length: yTicks }).map((_, t) => {
        const v = tickStep * t
        const y = T + CH - (v / niceMax) * CH
        return (
          <g key={t}>
            <line x1={L} y1={y} x2={W - R} y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
            <text
              x={L - 4} y={y + 3}
              textAnchor="end" fontSize="6" fill="rgba(0,0,0,0.5)"
              fontFamily="Pragmatica, sans-serif"
            >
              {Math.round(v)}
            </text>
          </g>
        )
      })}

      {/* Y-axis title */}
      <text
        transform={`translate(8, ${T + CH / 2}) rotate(-90)`}
        textAnchor="middle" fontSize="6" fill="rgba(0,0,0,0.5)"
        fontFamily="Pragmatica, sans-serif"
      >
        {isPink ? 'уровень брака, %' : 'время реакции, часы'}
      </text>

      {/* X-axis title */}
      <text
        x={(L + W - R) / 2} y={H - 2}
        textAnchor="middle" fontSize="6" fill="rgba(0,0,0,0.5)"
        fontFamily="Pragmatica, sans-serif"
      >
        поставщик
      </text>

      {/* Norm line */}
      {normLine != null && (() => {
        const ny = T + CH - (normLine / niceMax) * CH
        return (
          <g>
            <line x1={L} y1={ny} x2={W - R} y2={ny} stroke="#e84342" strokeWidth="1" strokeDasharray="4 3" />
            {normLabel && (
              <text
                x={W - R + 4} y={ny + 3}
                fontSize="6" fill="#e84342" fontFamily="Pragmatica, sans-serif"
              >
                {normLabel}
              </text>
            )}
          </g>
        )
      })()}

      {/* Right Y-axis labels (количество, шт) — for defect chart only */}
      {isPink && Array.from({ length: yTicks }).map((_, t) => {
        const v = Math.round((100 / (yTicks - 1)) * t)
        const y = T + CH - (t / (yTicks - 1)) * CH
        return (
          <text
            key={`r${t}`}
            x={W - R + 4} y={y + 3}
            fontSize="6" fill="rgba(0,0,0,0.5)"
            fontFamily="Pragmatica, sans-serif"
          >
            {v}
          </text>
        )
      })}

      {isPink && (
        <text
          transform={`translate(${W - 4}, ${T + CH / 2}) rotate(90)`}
          textAnchor="middle" fontSize="6" fill="rgba(0,0,0,0.5)"
          fontFamily="Pragmatica, sans-serif"
        >
          количество, шт
        </text>
      )}

      {/* Bars */}
      {suppliers.map((s, i) => {
        const val = getValue(s)
        const bH = Math.max(2, (val / niceMax) * CH)
        const cx = L + i * step + step / 2
        const bx = cx - barW / 2
        const by = T + CH - bH

        return (
          <g key={s.id || i}>
            <rect
              x={bx} y={by} width={barW} height={bH}
              fill={`url(#${gradId})`}
              rx={barW / 2}
            />
            <text
              x={cx} y={by - 4}
              textAnchor="middle" fontSize="6" fontWeight="700"
              fill="#000" fontFamily="Pragmatica, sans-serif"
            >
              {typeof val === 'number' ? (Number.isInteger(val) ? val : val.toFixed(1)) : val}
              {isPink ? '%' : ''}
            </text>
            <text
              x={cx} y={T + CH + 14}
              textAnchor="middle" fontSize="7" fill="#000"
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
