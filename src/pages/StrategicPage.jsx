import React, { useState, useEffect, useRef, useMemo } from 'react'
import { PERIODS, CATEGORIES, SUPPLIERS, findPreset } from '../data/strategicData'

// ── CSS animations ────────────────────────────────────────────────────────────
const CSS = `
  @keyframes spDdIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spChartIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes barGrow {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }
  @keyframes barGrowH {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
`

// ── SVG path helper ───────────────────────────────────────────────────────────
function rtPath(x, y, w, h, r = 4) {
  if (h <= 0) return ''
  const rr = Math.min(r, w / 2, h)
  return [
    `M${x},${y + h}`,
    `L${x},${y + rr}`,
    `Q${x},${y} ${x + rr},${y}`,
    `L${x + w - rr},${y}`,
    `Q${x + w},${y} ${x + w},${y + rr}`,
    `L${x + w},${y + h}`,
    'Z',
  ].join(' ')
}

// ── Animated counter ──────────────────────────────────────────────────────────
function useCountUp(target, duration = 700, active = true) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    setVal(0)
    const start = performance.now()
    const num = parseFloat(String(target).replace(',', '.')) || 0
    const raf = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(ease * num)
      if (p < 1) requestAnimationFrame(raf)
      else setVal(num)
    }
    requestAnimationFrame(raf)
  }, [target, active])
  return val
}

function AnimatedKpiValue({ value, unit, animate }) {
  const num = parseFloat(String(value).replace(',', '.')) || 0
  const isInt = Number.isInteger(num)
  const counted = useCountUp(num, 700, animate)
  const display = isInt ? Math.round(counted) : counted.toFixed(2).replace('.', ',')
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, flexWrap: 'wrap' }}>
      <span style={{ color: '#ea529b', fontSize: 20, lineHeight: 1 }}>{display}</span>
      {unit && <span style={{ color: '#808082', fontSize: 10 }}>{unit}</span>}
    </div>
  )
}

// ── Stagger card wrapper ──────────────────────────────────────────────────────
function StaggerCard({ index, children, style = {}, hoverLift = false }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => hoverLift && setHovered(true)}
      onMouseLeave={() => hoverLift && setHovered(false)}
      style={{
        animation: `cardIn 0.45s ease both`,
        animationDelay: `${index * 80}ms`,
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.18)' : 'none',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ── Dropdown ──────────────────────────────────────────────────────────────────
function Dropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{
        color: 'rgba(0,0,0,0.35)', fontSize: 8, textTransform: 'uppercase',
        letterSpacing: '0.05em', marginBottom: 3, whiteSpace: 'nowrap',
      }}>
        {label}
      </div>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          height: 16, background: '#f8d7e0', borderRadius: 10, cursor: 'pointer',
          display: 'flex', alignItems: 'center', paddingLeft: 8, paddingRight: 6,
          gap: 4, minWidth: 120, maxWidth: 220, userSelect: 'none',
        }}
      >
        <span style={{
          fontSize: 7, color: '#000', flex: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{value}</span>
        <span style={{
          fontSize: 8, color: '#bf3580', display: 'inline-block',
          transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none',
        }}>▾</span>
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 3px)', left: 0,
          background: '#fff', borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          zIndex: 1000, overflow: 'hidden', minWidth: '100%',
          border: '1px solid #f3c0d2',
          animation: 'spDdIn 0.15s ease',
        }}>
          {options.map(opt => (
            <div
              key={opt}
              onMouseDown={e => { e.preventDefault(); onChange(opt); setOpen(false) }}
              style={{
                padding: '5px 10px', fontSize: 7.5, cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: opt === value ? '#f8d7e0' : 'transparent',
                color: opt === value ? '#bf3580' : '#222',
                fontWeight: opt === value ? 700 : 400,
              }}
              onMouseEnter={e => { if (opt !== value) e.currentTarget.style.background = '#fdf0f4' }}
              onMouseLeave={e => { if (opt !== value) e.currentTarget.style.background = 'transparent' }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function VolumeBarChart({ data, animKey }) {
  const VW = 700, VH = 220
  const ML = 34, MR = 6, MT = 20, MB = 26
  const plotW = VW - ML - MR
  const plotH = VH - MT - MB

  const maxFact = Math.max(...data.map(d => d.fact))
  const yMax = Math.ceil(maxFact * 1.18 / 2) * 2
  const toY = v => MT + plotH * (1 - v / yMax)
  const slotW = plotW / data.length
  const barW = Math.max(8, Math.floor(slotW * 0.52))

  const yTicks = []
  for (let v = 0; v <= yMax; v += 2) yTicks.push(v)

  return (
    <svg
      key={animKey}
      viewBox={`0 0 ${VW} ${VH}`}
      width="100%" height="100%"
      preserveAspectRatio="none"
      style={{ display: 'block', animation: 'spChartIn 0.4s ease' }}
      fontFamily="Inter, sans-serif"
    >
      <defs>
        <linearGradient id="pgVol" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8d7e0" />
          <stop offset="100%" stopColor="#bf3580" />
        </linearGradient>
      </defs>
      {yTicks.map(v => (
        <g key={v}>
          <line x1={ML} y1={toY(v)} x2={VW - MR} y2={toY(v)}
            stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 3" />
          <text x={ML - 3} y={toY(v) + 3} textAnchor="end" fontSize="7" fill="rgba(255,255,255,0.6)">{v}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const cx = ML + slotW * i + slotW / 2
        const bx = cx - barW / 2
        const bH = Math.max(1, plotH * d.fact / yMax)
        const bY = toY(d.fact)
        const delay = `${i * 40}ms`
        return (
          <g key={i}>
            <g style={{
              transformOrigin: `${cx}px ${MT + plotH}px`,
              animation: `barGrow 0.5s cubic-bezier(0.34,1.56,0.64,1) both`,
              animationDelay: delay,
            }}>
              <path d={rtPath(bx, bY, barW, bH)} fill="url(#pgVol)" />
            </g>
            <text x={cx} y={bY - 3} textAnchor="middle" fontSize="6.5" fill="#fff" fontWeight="700"
              style={{ animation: `spChartIn 0.3s ease both`, animationDelay: `${i * 40 + 300}ms` }}>
              {d.fact.toFixed(2).replace('.', ',')}
            </text>
            <text x={cx} y={VH - MB + 14} textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.75)">
              {d.month}
            </text>
          </g>
        )
      })}
      <circle cx={ML + 5} cy={VH - 4} r={4} fill="url(#pgVol)" />
      <text x={ML + 13} y={VH - 1} fontSize="6" fill="rgba(255,255,255,0.75)">объем закупок</text>
    </svg>
  )
}

// ── Plan/Fact Chart (SVG) ─────────────────────────────────────────────────────
function PlanFactChart({ data, animKey }) {
  const VW = 700, VH = 225
  const ML = 34, MR = 6, MT = 26, MB = 26
  const plotW = VW - ML - MR
  const plotH = VH - MT - MB

  const maxVal = Math.max(...data.flatMap(d => [d.fact, d.plan]))
  const yMax = Math.ceil(maxVal * 1.18 / 2) * 2
  const toY = v => MT + plotH * (1 - v / yMax)
  const slotW = plotW / data.length
  const pairW = Math.max(18, Math.floor(slotW * 0.56))
  const bW = Math.max(7, Math.floor(pairW / 2) - 1)

  const yTicks = []
  for (let v = 0; v <= yMax; v += 2) yTicks.push(v)

  return (
    <svg
      key={animKey}
      viewBox={`0 0 ${VW} ${VH}`}
      width="100%" height="100%"
      preserveAspectRatio="none"
      style={{ display: 'block', animation: 'spChartIn 0.4s ease' }}
      fontFamily="Inter, sans-serif"
    >
      <defs>
        <linearGradient id="pgPF" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bf3580" />
          <stop offset="100%" stopColor="#f8d7e0" />
        </linearGradient>
        <linearGradient id="ggPF" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(210,210,210,0.9)" />
          <stop offset="100%" stopColor="rgba(160,160,160,0.6)" />
        </linearGradient>
      </defs>
      {yTicks.map(v => (
        <g key={v}>
          <line x1={ML} y1={toY(v)} x2={VW - MR} y2={toY(v)}
            stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 3" />
          <text x={ML - 3} y={toY(v) + 3} textAnchor="end" fontSize="7" fill="rgba(255,255,255,0.6)">{v}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const cx = ML + slotW * i + slotW / 2
        const px = cx - pairW / 2
        const fx = px + bW + 2
        const pH = Math.max(1, plotH * d.plan / yMax)
        const fH = Math.max(1, plotH * d.fact / yMax)
        const pY = toY(d.plan)
        const fY = toY(d.fact)
        const dev = (d.fact - d.plan) / d.plan * 100
        const devStr = (dev >= 0 ? '+' : '') + dev.toFixed(1) + '%'
        const topY = Math.min(pY, fY)
        const delay = `${i * 40}ms`
        const baseY = MT + plotH
        return (
          <g key={i}>
            <g style={{ transformOrigin: `${px + bW / 2}px ${baseY}px`, animation: `barGrow 0.5s cubic-bezier(0.34,1.56,0.64,1) both`, animationDelay: delay }}>
              <path d={rtPath(px, pY, bW, pH)} fill="url(#ggPF)" />
            </g>
            <g style={{ transformOrigin: `${fx + bW / 2}px ${baseY}px`, animation: `barGrow 0.5s cubic-bezier(0.34,1.56,0.64,1) both`, animationDelay: `${i * 40 + 60}ms` }}>
              <path d={rtPath(fx, fY, bW, fH)} fill="url(#pgPF)" />
            </g>
            <text x={cx} y={topY - 4} textAnchor="middle" fontSize="6"
              fill={dev >= 0 ? '#a0ffb8' : '#ffb0b0'}
              style={{ animation: `spChartIn 0.3s ease both`, animationDelay: `${i * 40 + 350}ms` }}>
              {devStr}
            </text>
            <text x={cx} y={VH - MB + 14} textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.75)">
              {d.month}
            </text>
          </g>
        )
      })}
      <circle cx={ML + 5} cy={VH - 4} r={4} fill="url(#ggPF)" />
      <text x={ML + 13} y={VH - 1} fontSize="6" fill="rgba(255,255,255,0.75)">план</text>
      <circle cx={ML + 52} cy={VH - 4} r={4} fill="url(#pgPF)" />
      <text x={ML + 60} y={VH - 1} fontSize="6" fill="rgba(255,255,255,0.75)">факт</text>
    </svg>
  )
}

// ── Deviation Chart (SVG) ─────────────────────────────────────────────────────
function DeviationChart({ data, animKey }) {
  const avg = data.reduce((s, d) => s + d.fact, 0) / data.length
  const rows = [
    { name: 'среднее', val: avg, isPink: true, dev: null },
    ...data.map(d => ({
      name: d.month, val: d.fact, isPink: false,
      dev: (d.fact - avg) / avg * 100,
    })),
  ]

  const VW = 510, VH = 490
  const ML = 58, MR = 98, MT = 18, MB = 22
  const rowH = (VH - MT - MB) / rows.length
  const plotW = VW - ML - MR
  const maxVal = Math.max(...rows.map(r => r.val)) * 1.1
  const toX = v => ML + (v / maxVal) * plotW
  const barH = Math.max(8, rowH * 0.52)

  const step = maxVal > 30 ? 10 : maxVal > 10 ? 2 : 1
  const xTicks = []
  for (let v = 0; v <= Math.ceil(maxVal); v += step) xTicks.push(v)

  return (
    <svg
      key={animKey}
      viewBox={`0 0 ${VW} ${VH}`}
      width="100%" height="100%"
      preserveAspectRatio="none"
      style={{ display: 'block', animation: 'spChartIn 0.4s ease' }}
      fontFamily="Inter, sans-serif"
    >
      <defs>
        <linearGradient id="pgHDev" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#bf3580" />
          <stop offset="100%" stopColor="#f8d7e0" />
        </linearGradient>
        <linearGradient id="ggHDev" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(160,160,160,0.9)" />
          <stop offset="100%" stopColor="rgba(210,210,210,0.5)" />
        </linearGradient>
      </defs>
      {xTicks.map(v => (
        <line key={v} x1={toX(v)} y1={MT} x2={toX(v)} y2={VH - MB}
          stroke="rgba(0,0,0,0.12)" strokeWidth="1" strokeDasharray="3 3" />
      ))}
      {rows.map((r, i) => {
        const rowMidY = MT + i * rowH + rowH / 2
        const barY = rowMidY - barH / 2
        const barW = Math.max(1, (r.val / maxVal) * plotW)
        const delay = `${i * 50}ms`
        return (
          <g key={i}>
            <text x={ML - 4} y={rowMidY + 3.5} textAnchor="end" fontSize="9" fill="#000">{r.name}</text>
            <g style={{ transformOrigin: `${ML}px ${rowMidY}px`, animation: `barGrowH 0.5s cubic-bezier(0.34,1.56,0.64,1) both`, animationDelay: delay }}>
              <rect x={ML} y={barY} width={barW} height={barH}
                fill={r.isPink ? 'url(#pgHDev)' : 'url(#ggHDev)'} rx={6} />
            </g>
            <text x={ML + barW + 4} y={rowMidY + 3.5} fontSize="8" fill="#333"
              style={{ animation: `spChartIn 0.3s ease both`, animationDelay: `${i * 50 + 300}ms` }}>
              {r.val.toFixed(2).replace('.', ',')}
            </text>
            {r.dev !== null && (
              <g style={{ animation: `spChartIn 0.3s ease both`, animationDelay: `${i * 50 + 350}ms` }}>
                <circle cx={ML + plotW + 16} cy={rowMidY} r={7} fill={r.dev >= 0 ? '#4caf50' : '#e84342'} />
                <text x={ML + plotW + 16} y={rowMidY + 3} textAnchor="middle" fontSize="7" fill="#fff">
                  {r.dev >= 0 ? '↑' : '↓'}
                </text>
                <text x={ML + plotW + 26} y={rowMidY + 3} fontSize="7.5"
                  fill={r.dev >= 0 ? '#4caf50' : '#e84342'} fontWeight="700">
                  {(r.dev >= 0 ? '+' : '') + r.dev.toFixed(1) + '%'}
                </text>
              </g>
            )}
          </g>
        )
      })}
      {xTicks.map(v => (
        <text key={v} x={toX(v)} y={VH - MB + 14} textAnchor="middle" fontSize="7" fill="#555">{v}</text>
      ))}
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function StrategicPage({ onBack }) {
  const [visible, setVisible] = useState(false)
  const [period, setPeriod]     = useState(PERIODS[0])
  const [category, setCategory] = useState(CATEGORIES[0])
  const [supplier, setSupplier] = useState(SUPPLIERS[1])
  const [fading, setFading]     = useState(false)
  const [chartKey, setChartKey] = useState(0)
  const [kpiKey, setKpiKey]     = useState(0)

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const preset = useMemo(
    () => findPreset(period, category, supplier),
    [period, category, supplier],
  )

  const wrap = setter => val => {
    setFading(true)
    setTimeout(() => {
      setter(val)
      setChartKey(k => k + 1)
      setKpiKey(k => k + 1)
      setFading(false)
    }, 180)
  }

  const { kpiProcurement: kp, kpiConcentration: kc, monthlyData } = preset
  const fadeSx = { opacity: fading ? 0 : 1, transition: 'opacity 0.18s ease' }

  return (
    <>
      <style>{CSS}</style>
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        background: '#f6f1f5',
        padding: '8px 30px 10px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity .6s ease, transform .6s ease',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, height: 34, marginBottom: 4 }}>
          <button
            onClick={e => { e.stopPropagation(); onBack() }}
            style={{
              width: 30, height: 30, borderRadius: 15, border: 'none',
              background: '#F8D7E0', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="#bf3580" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div style={{
            color: '#000', fontSize: 20, fontWeight: 400,
            textTransform: 'uppercase', letterSpacing: '-0.022em',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            Стратегическая панель закупочной деятельности
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 18, flexShrink: 0, alignItems: 'flex-end', marginBottom: 8 }}>
          <Dropdown label="Период" options={PERIODS} value={period} onChange={wrap(setPeriod)} />
          <Dropdown label="Закупочная категория" options={CATEGORIES} value={category} onChange={wrap(setCategory)} />
          <Dropdown label="Поставщик" options={SUPPLIERS} value={supplier} onChange={wrap(setSupplier)} />
        </div>

        {/* Main grid */}
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '698px 1fr', gap: '0 10px' }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0, overflow: 'hidden' }}>

            {/* KPI 1 */}
            <StaggerCard index={0} hoverLift style={{
              background: 'rgba(255,255,255,0.85)', borderRadius: 15,
              flexShrink: 0, padding: '10px 13px', overflow: 'hidden', ...fadeSx,
            }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(0,0,0,0.8)', marginBottom: 8, whiteSpace: 'nowrap' }}>
                Ключевые показатели закупочной деятельности
              </div>
              <div style={{ display: 'flex' }} key={kpiKey}>
                {[
                  { label: 'объем закупок',           value: kp.volume,      unit: 'млн руб' },
                  { label: 'средняя закупочная цена',  value: kp.avgPrice,    unit: 'руб/ед'  },
                  { label: 'среднегодовой рост цен',   value: kp.priceGrowth, unit: '%'       },
                  { label: 'активные поставщики',      value: kp.suppliers,   unit: 'шт'      },
                ].map((c, i) => (
                  <div key={i} style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ color: '#808082', fontSize: 9, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</div>
                    <AnimatedKpiValue value={c.value} unit={c.unit} animate={true} />
                  </div>
                ))}
              </div>
            </StaggerCard>

            {/* Volume bar chart */}
            <StaggerCard index={1} hoverLift style={{
              flex: 1, minHeight: 0, borderRadius: 15, background: '#000',
              overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ position: 'absolute', background: 'rgba(248,215,224,0.6)', borderRadius: '50%', width: 184, height: 175, right: -20, top: -26, transform: 'rotate(28.5deg)', filter: 'blur(82px)', pointerEvents: 'none' }} />
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '10px 13px 2px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                Динамика закупок, МЛН РУБ
              </div>
              <div style={{ flex: 1, minHeight: 0, padding: '0 6px 4px', ...fadeSx }}>
                <VolumeBarChart data={monthlyData} animKey={chartKey} />
              </div>
            </StaggerCard>

            {/* Plan/Fact chart */}
            <StaggerCard index={2} hoverLift style={{
              flex: 1, minHeight: 0, borderRadius: 15, background: '#000',
              overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ position: 'absolute', background: 'rgba(248,215,224,0.6)', borderRadius: '50%', width: 418, height: 179, right: 0, bottom: -40, transform: 'rotate(28.5deg)', filter: 'blur(82px)', pointerEvents: 'none' }} />
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '10px 13px 2px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                Исполнение плана закупок, МЛН РУБ
              </div>
              <div style={{ flex: 1, minHeight: 0, padding: '0 6px 4px', ...fadeSx }}>
                <PlanFactChart data={monthlyData} animKey={chartKey + 1} />
              </div>
            </StaggerCard>

          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0, overflow: 'hidden' }}>

            {/* KPI 2 */}
            <StaggerCard index={1} hoverLift style={{
              background: 'rgba(255,255,255,0.85)', borderRadius: 15,
              flexShrink: 0, padding: '10px 13px', overflow: 'hidden', ...fadeSx,
            }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(0,0,0,0.8)', marginBottom: 8, whiteSpace: 'nowrap' }}>
                Ключевые показатели концентрации закупок
              </div>
              <div style={{ display: 'flex' }} key={kpiKey}>
                {[
                  { label: 'концентрация ТОП-3',       value: kc.top3,    unit: '%' },
                  { label: 'индекс концентрации (HHI)', value: kc.hhi,     unit: ''  },
                  { label: 'зависимость от ТОП-1',      value: kc.top1dep, unit: '%' },
                ].map((c, i) => (
                  <div key={i} style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ color: '#808082', fontSize: 9, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</div>
                    <AnimatedKpiValue value={c.value} unit={c.unit} animate={true} />
                  </div>
                ))}
              </div>
            </StaggerCard>

            {/* Deviation chart */}
            <StaggerCard index={2} hoverLift style={{
              flex: 1, minHeight: 0, borderRadius: 15, background: '#fff',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ padding: '10px 13px 4px', flexShrink: 0 }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(0,0,0,0.8)', lineHeight: '130%', marginBottom: 5 }}>
                  Отклонение объёма закупок<br />от среднего значения, МЛН РУБ
                </div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(90deg,#bf3580,#f8d7e0)' }} />
                    <span style={{ fontSize: 9, color: '#000' }}>среднее</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: 'rgba(160,160,160,0.7)' }} />
                    <span style={{ fontSize: 9, color: '#000' }}>фактический объем</span>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, minHeight: 0, padding: '0 6px 4px', ...fadeSx }}>
                <DeviationChart data={monthlyData} animKey={chartKey + 2} />
              </div>
            </StaggerCard>

          </div>
        </div>
      </div>
    </>
  )
}
