import React, { useEffect, useState, useMemo } from 'react'
import { DATASETS, FILTER_OPTIONS, DEFAULT_DATASET } from '../data/costDrivers'
import ParetoChart from '../components/charts/ParetoChart'
import DonutChartCJ from '../components/charts/DonutChartCJ'

// ── Animated counter ──────────────────────────────────────────────────────────
function useCountUp(target, duration = 600) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    setVal(0)
    const num = parseFloat(String(target).replace(',', '.')) || 0
    const start = performance.now()
    const tick = now => {
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(ease * num)
      if (p < 1) requestAnimationFrame(tick)
      else setVal(num)
    }
    requestAnimationFrame(tick)
  }, [target])
  return val
}

function Num({ value, decimals = 2 }) {
  const v = useCountUp(value)
  const display = decimals === 0 ? Math.round(v) : v.toFixed(decimals).replace('.', ',')
  const final = decimals === 0
    ? String(Math.round(value))
    : value.toFixed(decimals).replace('.', ',')
  return (
    <span style={{ display: 'inline-block', minWidth: `${final.length}ch` }}>
      {display}
    </span>
  )
}

// ── Filter pill ───────────────────────────────────────────────────────────────
function FilterPill({ label, value, options, open, onToggle, onSelect }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{
        color: 'rgba(0,0,0,.35)', fontSize: 9,
        letterSpacing: '.05em', textTransform: 'uppercase',
        marginBottom: 3, whiteSpace: 'nowrap',
      }}>
        {label}
      </div>
      <div
        onClick={onToggle}
        style={{
          background: open ? '#f3c0d2' : '#f8d7e0',
          borderRadius: 8, height: 22,
          display: 'flex', alignItems: 'center', padding: '0 9px',
          cursor: 'pointer', userSelect: 'none',
          transition: 'background 0.15s', whiteSpace: 'nowrap',
          minWidth: 120,
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = '#f3c0d2' }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = '#f8d7e0' }}
      >
        <span style={{ color: '#000', fontSize: 9, flex: 1 }}>{value}</span>
        <span style={{ fontSize: 8, color: '#bf3580', marginLeft: 6 }}>{open ? '▴' : '▾'}</span>
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0,
          background: '#fff', borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          zIndex: 100, overflow: 'hidden',
          border: '1px solid #f8d7e0', marginTop: 2,
          minWidth: '100%',
        }}>
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => onSelect(opt)}
              style={{
                padding: '7px 12px', fontSize: 9,
                color: opt === value ? '#bf3580' : '#333',
                background: opt === value ? '#fdf0f5' : 'transparent',
                cursor: 'pointer', whiteSpace: 'nowrap',
                fontWeight: opt === value ? 700 : 400,
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (opt !== value) e.currentTarget.style.background = '#fdf0f5' }}
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

// ── CostFilters ───────────────────────────────────────────────────────────────
function CostFilters({ period, category, supplier, onPeriodChange, onCategoryChange, onSupplierChange }) {
  const [openPill, setOpenPill] = useState(null)

  const pills = [
    { label: 'период',             value: period,   onChange: onPeriodChange,   options: FILTER_OPTIONS.periods },
    { label: 'закупочная категория', value: category, onChange: onCategoryChange, options: FILTER_OPTIONS.categories },
    { label: 'поставщик',          value: supplier, onChange: onSupplierChange, options: FILTER_OPTIONS.suppliers },
  ]

  return (
    <div style={{ position: 'relative', display: 'flex', gap: 14, alignItems: 'flex-end' }}>
      {pills.map((p, idx) => (
        <FilterPill
          key={p.label}
          label={p.label}
          value={p.value}
          options={p.options}
          open={openPill === idx}
          onToggle={() => setOpenPill(openPill === idx ? null : idx)}
          onSelect={v => { p.onChange(v); setOpenPill(null) }}
        />
      ))}
      {openPill !== null && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 90 }}
          onClick={() => setOpenPill(null)}
        />
      )}
    </div>
  )
}

// ── Deviation strip ───────────────────────────────────────────────────────────
function DeviationStrip({ materials, animate }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
      <div style={{
        padding: '8px 12px 0',
        color: 'rgba(0,0,0,0.7)', fontSize: 9, fontWeight: 500,
        textTransform: 'uppercase', letterSpacing: '.03em',
      }}>
        Отклонение цены поставщика от средней закупочной цены по материалу
      </div>
      <div style={{ display: 'flex', minHeight: 86 }}>
        {materials.map((m, i) => (
          <div
            key={m.id}
            style={{
              flex: 1,
              borderLeft: i > 0 ? '1px solid #f0eef0' : 'none',
              padding: '4px 8px',
              background: hovered === m.id ? 'rgba(191,53,128,0.07)' : 'transparent',
              transition: 'background 0.15s, opacity 0.3s',
              opacity: animate ? 1 : 0,
              cursor: 'default',
              overflow: 'hidden',
            }}
            onMouseEnter={() => setHovered(m.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ color: '#808082', fontSize: 8, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {m.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1, marginTop: 2 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: m.deviationColor }}>
                <Num value={Math.abs(m.deviation)} decimals={2} />
              </span>
              <span style={{ color: '#808082', fontSize: 10, marginLeft: 1 }}>%</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <div>
                <div style={{ color: '#808082', fontSize: 7 }}>объём</div>
                <div style={{ color: '#808082' }}>
                  <span style={{ fontSize: 8, fontWeight: 600 }}>{m.volume.toLocaleString('ru')}</span>
                  <span style={{ fontSize: 6 }}> шт</span>
                </div>
              </div>
              <div>
                <div style={{ color: '#808082', fontSize: 7 }}>ср. цена</div>
                <div style={{ color: '#808082' }}>
                  <span style={{ fontSize: 8, fontWeight: 600 }}>{m.avgPrice.toLocaleString('ru')}</span>
                  <span style={{ fontSize: 6 }}> руб</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Pareto card ───────────────────────────────────────────────────────────────
function ParetoCard({ labels, costData, cumulativeData }) {
  return (
    <div style={{
      flex: 1, borderRadius: 15, background: '#fff',
      overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0,
    }}>
      <div style={{
        padding: '10px 16px 4px',
        color: 'rgba(0,0,0,0.8)', fontSize: 10, fontWeight: 500,
        textTransform: 'uppercase', letterSpacing: '.03em', flexShrink: 0,
      }}>
        Структура себестоимости продаж по материалам
      </div>
      <div style={{ flex: 1, padding: '0 20px 8px 38px', minHeight: 0 }}>
        <ParetoChart labels={labels} costData={costData} cumulativeData={cumulativeData} />
      </div>
      <div style={{ padding: '0 16px 10px 38px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#808082' }} />
          <span style={{ fontSize: 7, color: '#555' }}>вклад в себестоимость</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 16, height: 2, background: '#bf3580' }} />
          <span style={{ fontSize: 7, color: '#555' }}>накопленная доля</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 16, height: 0, borderTop: '1.5px dashed #e53935' }} />
          <span style={{ fontSize: 7, color: '#555' }}>пороговое значение</span>
        </div>
      </div>
    </div>
  )
}

// ── Donut card ────────────────────────────────────────────────────────────────
function DonutCard({ data, animate }) {
  const [hoveredItem, setHoveredItem] = useState(null)
  const sum = data.reduce((acc, d) => acc + d.value, 0)

  return (
    <div style={{
      flex: 1, borderRadius: 15, background: '#111118',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      minHeight: 0, position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 200, height: 200,
        borderRadius: '50%', background: 'rgba(191,53,128,0.35)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        padding: '12px 13px 6px',
        color: 'rgba(255,255,255,0.8)', fontSize: 9, fontWeight: 500,
        textTransform: 'uppercase', letterSpacing: '.03em', flexShrink: 0,
      }}>
        Структура закупочных расходов<br />по категориям материалов
      </div>
      <div style={{ flex: 1, padding: '4px 40px', minHeight: 0 }}>
        <DonutChartCJ data={data} total={sum.toFixed(2).replace('.', ',')} />
      </div>
      <div style={{ padding: '4px 13px 12px', flexShrink: 0 }}>
        {data.map(d => {
          const pct = sum > 0 ? (d.value / sum * 100).toFixed(2) : '0.00'
          return (
            <div
              key={d.label}
              onMouseEnter={() => setHoveredItem(d.label)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 6, padding: '3px 5px', borderRadius: 6,
                background: hoveredItem === d.label ? 'rgba(255,255,255,0.07)' : 'transparent',
                transition: 'background 0.15s, opacity 0.3s',
                opacity: animate ? 1 : 0,
                cursor: 'default',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', background: d.color,
                  border: d.color === '#ffffff' ? '1px solid #555' : 'none',
                  flexShrink: 0,
                  transform: hoveredItem === d.label ? 'scale(1.35)' : 'scale(1)',
                  transition: 'transform 0.15s',
                }} />
                <span style={{ fontSize: 9, color: hoveredItem === d.label ? '#fff' : 'rgba(255,255,255,0.75)', transition: 'color 0.15s' }}>
                  {d.label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)' }}>{pct}%</span>
                <span style={{ fontSize: 9, color: '#ea529b', fontWeight: 600 }}>
                  <Num value={d.value} decimals={2} /> млн руб
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── KPI card ──────────────────────────────────────────────────────────────────
function KpiCard({ kpi, animate }) {
  const [hoveredKpi, setHoveredKpi] = useState(null)

  const kpis = [
    { key: 'hhi',       label: 'Индекс концентрации (HHI)', value: kpi.hhi,       unit: '' },
    { key: 'top2dep',   label: 'Зависимость от ТОП-2',      value: kpi.top2dep,   unit: ' %' },
    { key: 'importDep', label: 'Импортозависимость',         value: kpi.importDep, unit: ' %' },
  ]

  return (
    <div style={{
      flexShrink: 0, height: 148, borderRadius: 15, background: '#111118',
      overflow: 'hidden', padding: '12px 13px', position: 'relative',
    }}>
      <div style={{
        position: 'absolute', bottom: -40, right: -40, width: 160, height: 160,
        borderRadius: '50%', background: 'rgba(191,53,128,0.3)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />
      <div style={{
        color: 'rgba(255,255,255,0.8)', fontSize: 9, fontWeight: 500,
        textTransform: 'uppercase', letterSpacing: '.03em', marginBottom: 10,
      }}>
        Ключевые показатели концентрации закупок
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {kpis.map(k => (
          <div
            key={k.key}
            style={{ flex: 1, transition: 'opacity 0.3s', opacity: animate ? 1 : 0 }}
            onMouseEnter={() => setHoveredKpi(k.key)}
            onMouseLeave={() => setHoveredKpi(null)}
          >
            <div style={{ color: '#808082', fontSize: 7, textTransform: 'uppercase', letterSpacing: '.03em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {k.label}
            </div>
            <div style={{
              color: '#ea529b', fontSize: 20, fontWeight: 700, marginTop: 2,
              display: 'inline-block',
              transform: hoveredKpi === k.key ? 'scale(1.12)' : 'scale(1)',
              transformOrigin: 'left center',
              transition: 'transform 0.2s ease',
            }}>
              <Num value={parseFloat(String(k.value).replace(',', '.')) || 0} decimals={typeof k.value === 'number' && Number.isInteger(k.value) ? 0 : 2} />
              {k.unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CostDriversPage({ onBack }) {
  const [visible, setVisible] = useState(false)
  const [period, setPeriod]     = useState(DEFAULT_DATASET.period)
  const [category, setCategory] = useState(DEFAULT_DATASET.category)
  const [supplier, setSupplier] = useState(DEFAULT_DATASET.supplier)
  const [animate, setAnimate]   = useState(true)

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const dataset = useMemo(() => {
    let found = DATASETS.find(d => d.period === period && d.category === category && d.supplier === supplier)
    if (found) return found
    found = DATASETS.find(d => d.category === category && d.supplier === supplier)
    if (found) return found
    found = DATASETS.find(d => d.category === category)
    if (found) return found
    found = DATASETS.find(d => d.period === period)
    if (found) return found
    return DEFAULT_DATASET
  }, [period, category, supplier])

  const triggerAnimate = (setter, value) => {
    setAnimate(false)
    setter(value)
    requestAnimationFrame(() => setAnimate(true))
  }

  return (
    <div style={{
      width: '100%', height: '100%', background: '#f6f1f5',
      display: 'flex', flexDirection: 'column',
      padding: '8px 20px 8px', boxSizing: 'border-box', overflow: 'hidden',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: 'opacity .5s ease, transform .5s ease',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, marginBottom: 6 }}>
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
        <div style={{ color: '#000', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-.02em' }}>
          Драйверы себестоимости и концентрация затрат
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexShrink: 0, marginBottom: 10 }}>
        <CostFilters
          period={period}
          category={category}
          supplier={supplier}
          onPeriodChange={v => triggerAnimate(setPeriod, v)}
          onCategoryChange={v => triggerAnimate(setCategory, v)}
          onSupplierChange={v => triggerAnimate(setSupplier, v)}
        />
      </div>

      {/* Main grid */}
      <div style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: '1fr 389px',
        gridTemplateRows: '1fr',
        gap: 10, minHeight: 0, overflow: 'hidden',
      }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0, overflow: 'hidden' }}>
          <DeviationStrip materials={dataset.materials} animate={animate} />
          <ParetoCard
            labels={dataset.paretoLabels}
            costData={dataset.paretoCost}
            cumulativeData={dataset.paretoCum}
          />
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden', height: '100%' }}>
          <DonutCard data={dataset.donutData} animate={animate} />
          <KpiCard kpi={dataset.kpi} animate={animate} />
        </div>
      </div>
    </div>
  )
}
