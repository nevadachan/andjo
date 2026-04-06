import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { SUPPLIER_DATASETS, FILTER_OPTIONS_PORTFOLIO, DEFAULT_SUPPLIER_DATASET } from '../data/suppliers'
import BarChart from '../components/charts/BarChart'
import PriceChart from '../components/charts/PriceChart'
import DonutChartCJ from '../components/charts/DonutChartCJ'

// ── Filter pill ───────────────────────────────────────────────────────────────
function FilterPill({ label, value, options, open, onToggle, onSelect }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{
        color: 'rgba(0,0,0,.35)', fontSize: 10,
        letterSpacing: '.05em', textTransform: 'uppercase',
        marginBottom: 3, whiteSpace: 'nowrap',
      }}>
        {label}
      </div>
      <div
        onClick={onToggle}
        style={{
          background: open ? '#f3c0d2' : '#f8d7e0',
          borderRadius: 8, height: 26,
          display: 'flex', alignItems: 'center', padding: '0 10px',
          cursor: 'pointer', userSelect: 'none',
          transition: 'background 0.15s', whiteSpace: 'nowrap',
          minWidth: 130,
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = '#f3c0d2' }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = '#f8d7e0' }}
      >
        <span style={{ color: '#000', fontSize: 10, flex: 1 }}>{value}</span>
        <span style={{ fontSize: 9, color: '#bf3580', marginLeft: 6 }}>{open ? '▴' : '▾'}</span>
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
                padding: '8px 14px', fontSize: 10,
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
      flexDirection: 'column', overflow: 'hidden',
      minHeight: 0,
      ...style,
    }}>
      {title && (
        <div style={{
          padding: '10px 14px 4px',
          fontSize: 10, fontWeight: 600, color: 'rgba(0,0,0,0.8)',
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
    <Card
      title="Отклонение цены поставщика от средней закупочной цены по материалу"
      style={{ height: '100%' }}
    >
      <div style={{
        display: 'flex', padding: '4px 10px 10px',
        gap: 4, overflowX: 'auto', flex: 1,
      }}>
        {suppliers.map(s => {
          const pos = s.deviation >= 0
          const color = pos ? '#e84342' : '#00b473'
          return (
            <div key={s.id} style={{
              flex: 1, minWidth: 80, padding: '5px 7px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <div style={{ fontSize: 8, color: '#888', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>
                {pos ? '+' : ''}{s.deviation.toFixed(2)}
                <span style={{ fontSize: 12, fontWeight: 400 }}> %</span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 5 }}>
                <div>
                  <div style={{ fontSize: 7, color: '#aaa' }}>объем</div>
                  <div style={{ fontSize: 8, color: '#333' }}>{s.volume.toLocaleString('ru')}</div>
                </div>
                <div>
                  <div style={{ fontSize: 7, color: '#aaa' }}>переплата</div>
                  <div style={{ fontSize: 8, color }}>
                    {s.overpay >= 0 ? '+' : ''}{s.overpay.toFixed(2)}
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

// ── Reliability strip ──────────────────────────────────────────────────��──────
function ReliabilityStrip({ suppliers }) {
  return (
    <Card title="Индекс надёжности поставщика" style={{ height: '100%' }}>
      <div style={{
        display: 'flex', padding: '4px 10px 10px',
        gap: 4, flex: 1,
      }}>
        {suppliers.map(s => {
          const v = s.reliability
          return (
            <div key={s.id} style={{
              flex: 1, minWidth: 70,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <div style={{ fontSize: 8, color: '#888', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#000', lineHeight: 1 }}>
                {v.toFixed(2)}
                <span style={{ fontSize: 12, fontWeight: 400 }}> %</span>
              </div>
              <div style={{ fontSize: 7, color: '#aaa', marginTop: 4, lineHeight: 1.3 }}>
                {s.reliabilityNote}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ── Donut card (white background, horizontal layout) ──────────────────────────
function DonutCard({ segments, totalAmount }) {
  const chartData = segments.map(s => ({
    label: s.label,
    value: s.pct,
    color: s.color,
  }))

  const totalStr = totalAmount != null
    ? totalAmount.toFixed(2).replace('.', ',')
    : ''

  return (
    <Card title="Структура поставщиков" style={{ height: '100%' }}>
      <div style={{
        flex: 1, minHeight: 0,
        display: 'flex', alignItems: 'center',
        padding: '0 14px 10px',
        gap: 16,
      }}>
        {/* Donut — square, sized by available height */}
        <div style={{
          flex: '0 0 auto',
          height: '100%',
          aspectRatio: '1 / 1',
          minWidth: 0,
          maxWidth: '50%',
        }}>
          <DonutChartCJ data={chartData} total={totalStr} />
        </div>

        {/* Legend — right side */}
        <div style={{
          flex: 1, minWidth: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          gap: 6,
        }}>
          {segments.map(s => (
            <div
              key={s.id}
              style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', background: s.color,
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 9, color: '#333', whiteSpace: 'nowrap' }}>
                  {s.label}
                </span>
              </div>
              <span style={{ fontSize: 9, color: '#333', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {(s.amount ?? s.value).toFixed(2).replace('.', ',')} млн руб
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
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
  const [period, setPeriod] = useState(FILTER_OPTIONS_PORTFOLIO.periods[0])
  const [category, setCategory] = useState(FILTER_OPTIONS_PORTFOLIO.categories[0])
  const [openPill, setOpenPill] = useState(null)

  const dataset = useMemo(() => {
    return SUPPLIER_DATASETS.find(d => d.period === period && d.category === category)
      || SUPPLIER_DATASETS.find(d => d.category === category)
      || DEFAULT_SUPPLIER_DATASET
  }, [period, category])

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const closePills = useCallback(() => {
    if (openPill !== null) setOpenPill(null)
  }, [openPill])

  const pills = [
    { key: 'period', label: 'период', value: period, options: FILTER_OPTIONS_PORTFOLIO.periods, onChange: setPeriod },
    { key: 'category', label: 'закупочная категория', value: category, options: FILTER_OPTIONS_PORTFOLIO.categories, onChange: setCategory },
  ]

  const { suppliers, avgPrice, totalAmount, donutSegments } = dataset

  const suppliersWithPrice = suppliers.map(s => ({
    ...s,
    price: Math.round(avgPrice * (1 + s.deviation / 100)),
  }))

  const normDefect = 3
  const normReaction = 12

  /* ══════════════════════════════════════════════════════════════════════════
     LAYOUT — точно по эталону (2 колонки × 3 строки):

     ┌──────────────────────┬──────────────────────┐
     │   Deviation strip    │   Reliability strip   │  row 1 (auto)
     ├──────────────────────┼──────────────────────┤
     │   Price chart        │   Defect bar chart    │  row 2 (1fr)
     ├──────────────────────┼──────────────────────┤
     │   Reaction bar chart │   Donut card          │  row 3 (1fr)
     └──────────────────────┴──────────────────────┘
            ~55%                    ~45%
     ══════════════════════════════════════════════════════════════════════════ */

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
      onClick={closePills}
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

      {/* ── Main 2×3 grid ── */}
      <div style={{
        flex: 1, minHeight: 0,
        display: 'grid',
        gridTemplateColumns: '55fr 45fr',
        gridTemplateRows: 'auto 1fr 1fr',
        gap: 10,
        overflow: 'hidden',
      }}>

        {/* ── ROW 1: Deviation (left) + Reliability (right) ── */}
        <DeviationStrip suppliers={suppliers} />
        <ReliabilityStrip suppliers={suppliers} />

        {/* ── ROW 2: Price chart (left) + Defect chart (right) ── */}
        <Card title="Сравнительный анализ закупочных цен у поставщиков, руб" style={{ minHeight: 0 }}>
          <div style={{ flex: 1, padding: '0 8px', minHeight: 0 }}>
            <PriceChart suppliers={suppliersWithPrice} avgPrice={avgPrice} />
          </div>
          <LegendRow items={[
            { label: 'средняя закупочная цена', color: '#e84342', type: 'dash' },
            { label: 'цена у поставщиков', color: '#808082', type: 'circle' },
          ]} />
        </Card>

        <Card title="Уровень брака по поставщикам, %" style={{ minHeight: 0 }}>
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
            { label: 'уровень брака', color: '#bf3580', type: 'circle' },
            { label: 'допустимая норма', color: '#e84342', type: 'dash' },
          ]} />
        </Card>

        {/* ── ROW 3: Reaction chart (left) + Donut (right) ── */}
        <Card title="Скорость реакции поставщика на запросы, часы" style={{ minHeight: 0 }}>
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
            { label: 'время реакции', color: '#808082', type: 'circle' },
            { label: 'допустимая норма', color: '#e84342', type: 'dash' },
          ]} />
        </Card>

        <DonutCard segments={donutSegments} totalAmount={totalAmount} />
      </div>
    </div>
  )
}
