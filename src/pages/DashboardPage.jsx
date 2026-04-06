import React, { useState, useEffect, useMemo } from 'react'
import { SUPPLIER_DATASETS, FILTER_OPTIONS_PORTFOLIO, DEFAULT_SUPPLIER_DATASET } from '../data/suppliers'
import BarChart from '../components/charts/BarChart'
import PriceChart from '../components/charts/PriceChart'
import DonutChartCJ from '../components/charts/DonutChartCJ'

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
          minWidth: 130,
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

// ── White card wrapper ────────────────────────────────────────────────────────
function Card({ title, children, style }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 15, display: 'flex',
      flexDirection: 'column', overflow: 'hidden', ...style,
    }}>
      {title && (
        <div style={{
          padding: '10px 14px 4px',
          fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.8)',
          textTransform: 'uppercase', letterSpacing: '.03em', flexShrink: 0,
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

// ── Deviation strip ───────────────────────────────────────────────────────────
function DeviationStrip({ suppliers }) {
  return (
    <Card title="Отклонение цены от средней закупочной цены" style={{ flexShrink: 0 }}>
      <div style={{
        display: 'flex', padding: '4px 10px 10px',
        gap: 4, overflowX: 'auto',
      }}>
        {suppliers.map(s => {
          const pos = s.deviation >= 0
          const color = pos ? '#e84342' : '#00b473'
          return (
            <div key={s.id} style={{
              flex: 1, minWidth: 80, padding: '5px 7px',
              borderRadius: 8, background: '#fafafa',
              border: '1px solid #f0f0f0',
            }}>
              <div style={{ fontSize: 8, color: '#888', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color, lineHeight: 1 }}>
                {pos ? '+' : ''}{s.deviation.toFixed(2)}%
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                <div>
                  <div style={{ fontSize: 7, color: '#aaa' }}>объём</div>
                  <div style={{ fontSize: 8, color: '#333' }}>{s.volume.toLocaleString('ru')} шт</div>
                </div>
                <div>
                  <div style={{ fontSize: 7, color: '#aaa' }}>перепл.</div>
                  <div style={{ fontSize: 8, color }}>
                    {s.overpay >= 0 ? '+' : ''}{s.overpay.toFixed(1)} тр
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ── Reliability strip ─────────────────────────────────────────────────────────
function ReliabilityStrip({ suppliers }) {
  return (
    <Card title="Индекс надёжности поставщика" style={{ flexShrink: 0 }}>
      <div style={{
        display: 'flex', padding: '4px 10px 10px',
        gap: 4,
      }}>
        {suppliers.map(s => {
          const v = s.reliability
          const barColor = v >= 92 ? '#00b473' : v >= 85 ? '#ffa617' : '#e84342'
          return (
            <div key={s.id} style={{ flex: 1, minWidth: 70 }}>
              <div style={{ fontSize: 8, color: '#888', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#000', lineHeight: 1 }}>
                {v.toFixed(1)}%
              </div>
              <div style={{
                marginTop: 4, height: 3, borderRadius: 2,
                background: '#eee', overflow: 'hidden',
              }}>
                <div style={{
                  width: `${v}%`, height: '100%',
                  background: barColor, borderRadius: 2,
                  transition: 'width .4s',
                }} />
              </div>
              <div style={{ fontSize: 7, color: '#aaa', marginTop: 3, lineHeight: 1.3 }}>
                {s.reliabilityNote}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ── Dark donut card ───────────────────────────────────────────────────────────
function DonutCard({ segments, totalAmount }) {
  const [hoveredItem, setHoveredItem] = useState(null)

  const chartData = segments.map(s => ({
    label: s.label,
    value: s.pct,
    color: s.color,
  }))

  const totalStr = totalAmount != null
    ? totalAmount.toFixed(2).replace('.', ',')
    : ''

  return (
    <div style={{
      flex: 1, borderRadius: 15, background: '#111118',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      minHeight: 0, position: 'relative',
    }}>
      {/* glow blob */}
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 200, height: 200,
        borderRadius: '50%', background: 'rgba(191,53,128,0.35)',
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'relative', zIndex: 1,
        padding: '12px 13px 6px',
        color: 'rgba(255,255,255,0.8)', fontSize: 9, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '.03em', flexShrink: 0,
      }}>
        Структура поставщиков
      </div>
      {/* donut */}
      <div style={{ flex: 1, padding: '0 20px', minHeight: 0, position: 'relative', zIndex: 1, maxHeight: 160 }}>
        <DonutChartCJ data={chartData} total={totalStr} />
      </div>
      {/* legend */}
      <div style={{ padding: '4px 13px 12px', flexShrink: 0, position: 'relative', zIndex: 1 }}>
        {segments.map(s => (
          <div
            key={s.id}
            onMouseEnter={() => setHoveredItem(s.id)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 4, padding: '2px 5px', borderRadius: 6,
              background: hoveredItem === s.id ? 'rgba(255,255,255,0.07)' : 'transparent',
              transition: 'background 0.15s', cursor: 'default',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%', background: s.color,
                border: s.color === '#f8d7e0' || s.color === '#ffffff' ? '1px solid #555' : 'none',
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 8, color: hoveredItem === s.id ? '#fff' : 'rgba(255,255,255,0.75)' }}>
                {s.label}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.45)' }}>
                {s.pct.toFixed(2)}%
              </span>
              <span style={{ fontSize: 8, color: '#ea529b', fontWeight: 700 }}>
                {(s.amount ?? s.value).toFixed(2).replace('.', ',')} млн руб
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Legend row (for charts) ───────────────────────────────────────────────────
function LegendRow({ items }) {
  return (
    <div style={{ display: 'flex', gap: 14, padding: '4px 14px 8px', flexShrink: 0 }}>
      {items.map(item => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {item.type === 'dash'
            ? <svg width={20} height={6}><line x1={0} y1={3} x2={20} y2={3} stroke={item.color} strokeWidth={1.5} strokeDasharray="4 3" /></svg>
            : <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
          }
          <span style={{ fontSize: 8, color: '#888' }}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DashboardPage({ onBack }) {
  const [visible, setVisible] = useState(false)
  const [period, setPeriod]     = useState(FILTER_OPTIONS_PORTFOLIO.periods[0])
  const [category, setCategory] = useState(FILTER_OPTIONS_PORTFOLIO.categories[0])
  const [openPill, setOpenPill]  = useState(null)

  const dataset = useMemo(() => {
    return SUPPLIER_DATASETS.find(d => d.period === period && d.category === category)
        || SUPPLIER_DATASETS.find(d => d.category === category)
        || DEFAULT_SUPPLIER_DATASET
  }, [period, category])

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const pills = [
    { key: 'period',   label: 'период',               value: period,   options: FILTER_OPTIONS_PORTFOLIO.periods,    onChange: setPeriod },
    { key: 'category', label: 'закупочная категория', value: category, options: FILTER_OPTIONS_PORTFOLIO.categories, onChange: setCategory },
  ]

  const { suppliers, avgPrice, totalAmount, donutSegments } = dataset

  // suppliers need a price field for PriceChart — derive from avgPrice + deviation
  const suppliersWithPrice = suppliers.map(s => ({
    ...s,
    price: Math.round(avgPrice * (1 + s.deviation / 100)),
  }))

  const normDefect   = 3
  const normReaction = 12

  return (
    <div
      style={{
        width: '100%', height: '100%', background: '#f6f1f5',
        display: 'flex', flexDirection: 'column',
        padding: '8px 20px 8px',
        boxSizing: 'border-box', overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity .5s ease, transform .5s ease',
      }}
      onClick={() => openPill !== null && setOpenPill(null)}
    >
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 8, flexShrink: 0 }}>
        <button
          onClick={e => { e.stopPropagation(); onBack() }}
          style={{
            width: 30, height: 30, borderRadius: '50%', border: 'none',
            background: '#f8d7e0', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="#bf3580" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1, color: '#000' }}>
          ПОРТФЕЛЬ ПОСТАВЩИКОВ И ПОТЕНЦИАЛ ОПТИМИЗАЦИИ
        </div>
      </div>

      {/* ── Filter pills ── */}
      <div
        style={{ display: 'flex', gap: 16, marginBottom: 10, flexShrink: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {pills.map(p => (
          <FilterPill
            key={p.key}
            label={p.label}
            value={p.value}
            options={p.options}
            open={openPill === p.key}
            onToggle={() => setOpenPill(openPill === p.key ? null : p.key)}
            onSelect={v => { p.onChange(v); setOpenPill(null) }}
          />
        ))}
      </div>

      {/* ── Main grid: left (wider) + right ── */}
      <div style={{
        flex: 1, minHeight: 0,
        display: 'grid',
        gridTemplateColumns: '1fr 0.62fr',
        gap: 10,
      }}>
        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0, overflow: 'hidden' }}>
          {/* Deviation strip */}
          <DeviationStrip suppliers={suppliers} />

          {/* Price chart */}
          <Card title="Сравнительный анализ закупочных цен у поставщиков, руб" style={{ flex: 1, minHeight: 0 }}>
            <div style={{ flex: 1, padding: '0 8px', minHeight: 0 }}>
              <PriceChart suppliers={suppliersWithPrice} avgPrice={avgPrice} />
            </div>
            <LegendRow items={[
              { label: 'средняя закупочная цена', color: '#e84342', type: 'dash' },
              { label: 'цена у поставщиков',      color: '#808082', type: 'circle' },
            ]} />
          </Card>

          {/* Reliability strip */}
          <ReliabilityStrip suppliers={suppliers} />
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0, overflow: 'hidden' }}>
          {/* Defect bar chart */}
          <Card title="Уровень брака по поставщикам, %" style={{ flex: 1, minHeight: 0 }}>
            <div style={{ flex: 1, padding: '0 8px', minHeight: 0 }}>
              <BarChart
                suppliers={suppliers}
                getValue={s => s.defectRate ?? 0}
                colorVariant="pink"
                normLine={normDefect}
                normLabel={`норма ${normDefect}%`}
              />
            </div>
            <LegendRow items={[
              { label: 'уровень брака',   color: '#bf3580', type: 'circle' },
              { label: 'допустимая норма', color: '#e84342', type: 'dash' },
            ]} />
          </Card>

          {/* Reaction bar chart */}
          <Card title="Скорость реакции поставщика на запросы, часы" style={{ flex: 1, minHeight: 0 }}>
            <div style={{ flex: 1, padding: '0 8px', minHeight: 0 }}>
              <BarChart
                suppliers={suppliers}
                getValue={s => s.reactionTime ?? 0}
                colorVariant="grey"
                normLine={normReaction}
                normLabel={`норма ${normReaction}ч`}
              />
            </div>
            <LegendRow items={[
              { label: 'время реакции',    color: '#808082', type: 'circle' },
              { label: 'допустимая норма', color: '#e84342', type: 'dash' },
            ]} />
          </Card>

          {/* Donut — supplier structure */}
          <DonutCard segments={donutSegments} totalAmount={totalAmount} />
        </div>
      </div>
    </div>
  )
}