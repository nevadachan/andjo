import React from 'react'

export default function DonutChart({ segments, circumference }) {
  const R = 68, SW = 24, GW = 26
  return (
    <svg style={{ position:'absolute', left:79, top:47 }} width="162" height="162" viewBox="0 0 162 162">
      {segments.map(s => (
        <circle key={s.id} cx="81" cy="81" r={R} fill="none"
          stroke={s.color} strokeWidth={SW}
          strokeDasharray={`${s.len} ${circumference - s.len}`}
          strokeDashoffset={-s.offset}
          transform="rotate(-90 81 81)" />
      ))}
      {segments.map(s => (
        <circle key={`g-${s.id}`} cx="81" cy="81" r={R} fill="none"
          stroke="white" strokeWidth={GW}
          strokeDasharray={`2 ${circumference - 2}`}
          strokeDashoffset={-(s.offset - 1)}
          transform="rotate(-90 81 81)" />
      ))}
    </svg>
  )
}
