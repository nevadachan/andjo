import React from 'react'

export default function BarChart({ suppliers, getValue, colorVariant, normLine, normLabel }) {
  /* Увеличенный viewBox для чёткости на HiDPI */
  const W = 1120, H = 400
  const L = 60, R = 100, T = 44, B = 56
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
  const barW = 48
  const yTicks = 6
  const tickStep = niceMax / (yTicks - 1)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
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
            <line x1={L} y1={y} x2={W - R} y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
            <text
              x={L - 8} y={y + 4}
              textAnchor="end" fontSize="12" fill="rgba(0,0,0,0.5)"
              fontFamily="Pragmatica, sans-serif"
            >
              {Math.round(v)}
            </text>
          </g>
        )
      })}

      {/* Y-axis title */}
      <text
        transform={`translate(16, ${T + CH / 2}) rotate(-90)`}
        textAnchor="middle" fontSize="12" fill="rgba(0,0,0,0.5)"
        fontFamily="Pragmatica, sans-serif"
      >
        {isPink ? 'уровень брака, %' : 'время реакции, часы'}
      </text>

      {/* X-axis title */}
      <text
        x={(L + W - R) / 2} y={H - 4}
        textAnchor="middle" fontSize="12" fill="rgba(0,0,0,0.5)"
        fontFamily="Pragmatica, sans-serif"
      >
        поставщик
      </text>

      {/* Norm line */}
      {normLine != null && (() => {
        const ny = T + CH - (normLine / niceMax) * CH
        return (
          <g>
            <line x1={L} y1={ny} x2={W - R} y2={ny} stroke="#e84342" strokeWidth="2" strokeDasharray="8 6" />
            {normLabel && (
              <text
                x={W - R + 8} y={ny + 4}
                fontSize="12" fill="#e84342" fontFamily="Pragmatica, sans-serif"
              >
                {normLabel}
              </text>
            )}
          </g>
        )
      })()}

      {/* Right Y-axis (defect chart only) */}
      {isPink && Array.from({ length: yTicks }).map((_, t) => {
        const v = Math.round((100 / (yTicks - 1)) * t)
        const y = T + CH - (t / (yTicks - 1)) * CH
        return (
          <text
            key={`r${t}`}
            x={W - R + 8} y={y + 4}
            fontSize="12" fill="rgba(0,0,0,0.5)"
            fontFamily="Pragmatica, sans-serif"
          >
            {v}
          </text>
        )
      })}
      {isPink && (
        <text
          transform={`translate(${W - 8}, ${T + CH / 2}) rotate(90)`}
          textAnchor="middle" fontSize="12" fill="rgba(0,0,0,0.5)"
          fontFamily="Pragmatica, sans-serif"
        >
          количество, шт
        </text>
      )}

      {/* Bars */}
      {suppliers.map((s, i) => {
        const val = getValue(s)
        const bH = Math.max(4, (val / niceMax) * CH)
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
              x={cx} y={by - 8}
              textAnchor="middle" fontSize="12" fontWeight="700"
              fill="#000" fontFamily="Pragmatica, sans-serif"
            >
              {typeof val === 'number' ? (Number.isInteger(val) ? val : val.toFixed(1)) : val}
              {isPink ? '%' : ''}
            </text>
            <text
              x={cx} y={T + CH + 28}
              textAnchor="middle" fontSize="14" fill="#000"
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
