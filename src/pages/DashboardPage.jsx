import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { SUPPLIER_DATASETS, FILTER_OPTIONS_PORTFOLIO, DEFAULT_SUPPLIER_DATASET } from '../data/suppliers'
import BarChart from '../components/charts/BarChart'
import PriceChart from '../components/charts/PriceChart'
import DonutChartCJ from '../components/charts/DonutChartCJ'

// ── Animated counter ──────────────────────────────────────────────────────────
function useCountUp(target, duration = 600) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    setVal(0)
    const num = Math.abs(parseFloat(String(target).replace(',', '.')) || 0)
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
  const abs = Math.abs(parseFloat(String(value).replace(',', '.')) || 0)
  const v = useCountUp(abs)
  const display = decimals === 0 ? Math.round(v) : v.toFixed(decimals).replace('.', ',')
  const final = decimals === 0
    ? String(Math.round(abs))
    : abs.toFixed(decimals).replace('.', ',')
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
        color: 'rgba(0,0,0,0.30)', fontSize: 8,
        letterSpacing: 0.4, marginBottom: 2, whiteSpace: 'nowrap',
      }}>
        {label}
      </div>
      <div
        onClick={onToggle}
        style={{
          background: '#F8D7E0', borderRadius: 10, height: 15,
          display: 'flex', alignItems: 'center', padding: '0 9px',
          cursor: 'pointer', userSelect: 'none', width: 119,
          boxSizing: 'border-box',
        }}
      >
        <span style={{ color: '#000', fontSize: 7, flex: 1 }}>{value}</span>
        <span style={{ fontSize: 7, color: '#000', marginLeft: 4 }}>{open ? '▴' : '▾'}</span>
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
                padding: '6px 10px', fontSize: 7,
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

// ── Deviation strip ───────────────────────────────────────────────────────────
function DeviationStrip({ suppliers }) {
  return (
    <div style={{
      background: '#000', borderRadius: 15, height: '100%',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 16px 4px',
        color: 'rgba(255,255,255,0.80)', fontSize: 10,
        textTransform: 'uppercase', flexShrink: 0,
      }}>
        Отклонение цены поставщика от средней закупочной цены по материалу
      </div>
      <div style={{ display: 'flex', padding: '0 16px 8px', flex: 1 }}>
        {suppliers.map(s => {
          const pos = s.deviation >= 0
          const color = pos ? '#FFA617' : '#00B473'
          return (
            <div key={s.id} style={{
              flex: 1, minWidth: 0,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <div style={{
                fontSize: 9, color: '#808082', marginBottom: 2,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {s.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color, flexShrink: 0 }}>
                  {pos ? '+' : '−'}
                </span>
                <span style={{ fontSize: 20, fontWeight: 700, color }}>
                  <Num value={Math.abs(s.deviation)} decimals={2} />
                </span>
                <span style={{ fontSize: 8.67, color: 'transparent', flexShrink: 0 }}>&nbsp;</span>
                <span style={{ fontSize: 10, color: '#808082', flexShrink: 0 }}>%</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 6, color: '#808082', textTransform: 'lowercase', lineHeight: '6.6px', whiteSpace: 'nowrap' }}>объем</div>
                  <div style={{ marginTop: 1, whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 8.67, fontWeight: 700, color: '#808082' }}>
                      {s.volume.toLocaleString('ru')}
                    </span>
                    <span style={{ fontSize: 4, color: '#808082' }}> шт</span>
                  </div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 6, color: '#808082', lineHeight: '6.6px', whiteSpace: 'nowrap' }}>переплата</div>
                  <div style={{ marginTop: 1, whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 8.67, fontWeight: 700, color: '#808082' }}>
                      {s.overpay >= 0 ? '+' : '−'}<Num value={Math.abs(s.overpay)} decimals={2} />
                    </span>
                    <span style={{ fontSize: 4, color: '#808082' }}> тыс руб</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Reliability strip ─────────────────────────────────────────────────────────
function ReliabilityStrip({ suppliers }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.80)', borderRadius: 15, height: '100%',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 13px 4px',
        color: 'rgba(0,0,0,0.80)', fontSize: 10,
        textTransform: 'uppercase', flexShrink: 0,
      }}>
        Индекс надежности поставщика
      </div>
      <div style={{ display: 'flex', padding: '0 13px 8px', flex: 1 }}>
        {suppliers.map(s => (
          <div key={s.id} style={{
            flex: 1, minWidth: 0,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <div style={{
              fontSize: 9, color: '#808082', marginBottom: 2,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {s.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#EA529B' }}>
                <Num value={s.reliability} decimals={2} />
              </span>
              <span style={{ fontSize: 10, color: '#808082', marginLeft: 2, flexShrink: 0 }}>%</span>
            </div>
            <div style={{
              fontSize: 6, color: '#808082', marginTop: 3,
              lineHeight: '6.6px', textTransform: 'lowercase', maxWidth: 70,
              overflow: 'hidden',
            }}>
              {s.reliabilityNote}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
function ChartCard({ title, dark, children, legendItems }) {
  const bg = dark ? '#000' : '#fff'
  const titleColor = dark ? 'rgba(255,255,255,0.80)' : 'rgba(0,0,0,0.80)'
  const legendColor = dark ? '#fff' : '#000'

  return (
    <div style={{
      background: bg, borderRadius: 15, height: '100%',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 19px 4px',
        color: titleColor, fontSize: 10,
        textTransform: 'uppercase', flexShrink: 0,
      }}>
        {title}
      </div>
      <div style={{ flex: 1, minHeight: 0, padding: '0 8px', position: 'relative' }}>
        {children}
      </div>
      {legendItems && (
        <div style={{ display: 'flex', gap: 12, padding: '4px 19px 10px', flexShrink: 0 }}>
          {legendItems.map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {item.type === 'dash'
                ? <svg width={16} height={6}><line x1={0} y1={3} x2={16} y2={3} stroke={item.color} strokeWidth={1.5} strokeDasharray="4 3" /></svg>
                : <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.gradient || item.color }} />
              }
              <span style={{ fontSize: 6, color: legendColor }}>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Donut card ────────────────────────────────────────────────────────────────
function DonutCard({ segments, totalAmount }) {
  const chartData = segments.map(s => ({ label: s.label, value: s.pct, color: s.color }))
  const totalStr = totalAmount != null ? totalAmount.toFixed(2).replace('.', ',') : ''

  return (
    <div style={{
      background: '#fff', borderRadius: 15, height: '100%',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 13px 4px',
        color: 'rgba(0,0,0,0.80)', fontSize: 10,
        textTransform: 'uppercase', flexShrink: 0,
      }}>
        Структура поставщиков
      </div>
      <div style={{
        flex: 1, minHeight: 0, display: 'flex', alignItems: 'center',
        padding: '0 13px 10px', overflow: 'hidden',
      }}>
        <div style={{
          flex: '0 0 52%', position: 'relative',
          alignSelf: 'stretch', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: '100%', paddingBottom: '100%', position: 'relative' }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%', height: '90%',
            }}>
              <DonutChartCJ data={chartData} total={totalStr} centerColor="#000" />
            </div>
          </div>
        </div>
        <div style={{
          flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', gap: 10, paddingLeft: 20,
        }}>
          {segments.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: '#000', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {s.label}
              </span>
              <span style={{ fontSize: 10, color: '#000', whiteSpace: 'nowrap', flexShrink: 0 }}>
                <Num value={Math.abs(s.amount ?? s.value)} decimals={2} /> млн руб
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Hardcoded suppliers A–F (as on the screenshot) ────────────────────────────
const ALL_SUPPLIERS = [
  {
    id: 'A',
    label: 'Поставщик А',
    deviation: 6.29,
    volume: 4000,
    overpay: 1168.00,
    reliability: 93.60,
    reliabilityNote: 'надёжный, дороже рынка',
    defectRate: 1.8,
    reactionTime: 6,
    color: '#BF3580',
  },
  {
    id: 'B',
    label: 'Поставщик В',
    deviation: -1.55,
    volume: 2450,
    overpay: -176.40,
    reliability: 90.20,
    reliabilityNote: 'надёжный, сбалансированный по цене и качеству',
    defectRate: 2.6,
    reactionTime: 9,
    color: '#EA529B',
  },
  {
    id: 'C',
    label: 'Поставщик С',
    deviation: -2.52,
    volume: 1900,
    overpay: -222.30,
    reliability: 86.20,
    reliabilityNote: 'средний уровень, риски качества и сроков',
    defectRate: 3.9,
    reactionTime: 14,
    color: '#F07DB5',
  },
  {
    id: 'D',
    label: 'Поставщик D',
    deviation: -3.44,
    volume: 1450,
    overpay: -232.00,
    reliability: 95.30,
    reliabilityNote: 'стабильный и надёжный',
    defectRate: 1.2,
    reactionTime: 5,
    color: '#808082',
  },
  {
    id: 'E',
    label: 'Поставщик Е',
    deviation: -6.67,
    volume: 900,
    overpay: -279.00,
    reliability: 83.70,
    reliabilityNote: 'зона повышенного риска',
    defectRate: 4.8,
    reactionTime: 18,
    color: '#CDCCCC',
  },
  {
    id: 'F',
    label: 'Поставщик F',
    deviation: -11.26,
    volume: 500,
    overpay: -261.50,
    reliability: 96.70,
    reliabilityNote: 'стратегический спорный поставщик',
    defectRate: 0.9,
    reactionTime: 4,
    color: '#3D3D3D',
  },
]

// Donut segments for all suppliers (as on screenshot)
const ALL_DONUT_SEGMENTS = [
  { id: 'A', label: 'Поставщик А', pct: 37.96, amount: 19.74, color: '#BF3580' },
  { id: 'B', label: 'Поставщик В', pct: 21.54, amount: 11.20, color: '#EA529B' },
  { id: 'C', label: 'Поставщик С', pct: 16.54, amount: 8.60,  color: '#F07DB5' },
  { id: 'D', label: 'Поставщик D', pct: 12.50, amount: 6.50,  color: '#808082' },
  { id: 'E', label: 'Поставщик Е', pct: 7.50,  amount: 3.90,  color: '#CDCCCC' },
  { id: 'F', label: 'Поставщик F', pct: 3.96,  amount: 2.06,  color: '#3D3D3D' },
]
const ALL_TOTAL_AMOUNT = 52.00
const AVG_PRICE = 4642

const SUPPLIER_FILTER_OPTIONS = [
  'Все поставщики',
  'Поставщик А',
  'Поставщик В',
  'Поставщик С',
  'Поставщик D',
  'Поставщик Е',
  'Поставщик F',
]

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DashboardPage({ onBack }) {
  const [visible, setVisible] = useState(false)
  const [period, setPeriod] = useState(FILTER_OPTIONS_PORTFOLIO.periods[0])
  const [category, setCategory] = useState(FILTER_OPTIONS_PORTFOLIO.categories[0])
  const [supplier, setSupplier] = useState('Все поставщики')
  const [openPill, setOpenPill] = useState(null)

  // Use external dataset for period/category, but merge our hardcoded suppliers
  const dataset = useMemo(() => {
    return SUPPLIER_DATASETS.find(d => d.period === period && d.category === category)
      || SUPPLIER_DATASETS.find(d => d.category === category)
      || DEFAULT_SUPPLIER_DATASET
  }, [period, category])

  // Filtered suppliers list
  const filteredSuppliers = useMemo(() => {
    if (supplier === 'Все поставщики') return ALL_SUPPLIERS
    return ALL_SUPPLIERS.filter(s => s.label === supplier)
  }, [supplier])

  // Filtered donut segments
  const filteredDonutSegments = useMemo(() => {
    if (supplier === 'Все поставщики') return ALL_DONUT_SEGMENTS
    const seg = ALL_DONUT_SEGMENTS.find(s => s.label === supplier)
    return seg ? [{ ...seg, pct: 100 }] : ALL_DONUT_SEGMENTS
  }, [supplier])

  // Total amount for donut center
  const filteredTotalAmount = useMemo(() => {
    if (supplier === 'Все поставщики') return ALL_TOTAL_AMOUNT
    const seg = ALL_DONUT_SEGMENTS.find(s => s.label === supplier)
    return seg ? seg.amount : ALL_TOTAL_AMOUNT
  }, [supplier])

  // avgPrice: use from dataset if available, otherwise fallback
  const avgPrice = dataset?.avgPrice ?? AVG_PRICE

  const suppliersWithPrice = filteredSuppliers.map(s => ({
    ...s,
    price: Math.round(avgPrice * (1 + s.deviation / 100)),
  }))

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const closePills = useCallback(() => {
    if (openPill !== null) setOpenPill(null)
  }, [openPill])

  const pills = [
    { key: 'period',   label: 'период',              value: period,   options: FILTER_OPTIONS_PORTFOLIO.periods,    onChange: setPeriod   },
    { key: 'category', label: 'закупочная категория', value: category, options: FILTER_OPTIONS_PORTFOLIO.categories, onChange: setCategory },
    { key: 'supplier', label: 'поставщик',            value: supplier, options: SUPPLIER_FILTER_OPTIONS,            onChange: setSupplier },
  ]

  const normDefect   = 3
  const normReaction = 12

  return (
    <div
      style={{
        width: '100%', height: '100%', background: '#F6F1F5',
        display: 'flex', flexDirection: 'column',
        padding: '6px 30px 10px',
        boxSizing: 'border-box', overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity .5s ease, transform .5s ease',
        willChange: 'opacity, transform',
      }}
      onClick={closePills}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0, marginBottom: 2 }}>
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
        <div style={{ fontSize: 22, textTransform: 'uppercase', lineHeight: '33px', color: '#000' }}>
          Портфель поставщиков и потенциал оптимизации
        </div>
      </div>

      {/* Filter pills */}
      <div
        style={{ display: 'flex', gap: 19, marginBottom: 8, flexShrink: 0 }}
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

      {/* Main grid */}
      <div style={{
        flex: 1, minHeight: 0,
        display: 'grid',
        gridTemplateColumns: '607fr 612fr',
        gridTemplateRows: '101fr 260fr 230fr',
        gap: 10,
        overflow: 'hidden',
      }}>
        <DeviationStrip suppliers={filteredSuppliers} />
        <ReliabilityStrip suppliers={filteredSuppliers} />

        <ChartCard
          title="Сравнительный анализ закупочных цен у поставщиков, руб"
          dark
          legendItems={[
            { label: 'средняя закупочная цена', gradient: 'linear-gradient(180deg, #BF3580 0%, #F8D7E0 100%)', type: 'circle' },
            { label: 'цена у поставщиков', gradient: 'linear-gradient(180deg, #fff 16%, rgba(209,209,209,0.42) 100%)', type: 'circle' },
          ]}
        >
          <PriceChart suppliers={suppliersWithPrice} avgPrice={avgPrice} />
        </ChartCard>

        <ChartCard
          title="Уровень брака по поставщикам, %"
          legendItems={[
            { label: 'уровень брака', gradient: 'linear-gradient(180deg, #F8D7E0 0%, #BF3580 100%)', type: 'circle' },
            { label: 'допустимая норма', color: '#e84342', type: 'dash' },
          ]}
        >
          <BarChart
            suppliers={filteredSuppliers}
            getValue={s => s.defectRate ?? 0}
            colorVariant="pink"
            normLine={normDefect}
            normLabel={`норма ${normDefect}%`}
          />
        </ChartCard>

        <ChartCard
          title="Скорость реакции поставщика на запросы, часы"
          legendItems={[
            { label: 'время реакции', gradient: 'linear-gradient(180deg, #808082 16%, #CDCCCC 71%)', type: 'circle' },
            { label: 'допустимая норма', color: '#e84342', type: 'dash' },
          ]}
        >
          <BarChart
            suppliers={filteredSuppliers}
            getValue={s => s.reactionTime ?? 0}
            colorVariant="grey"
            normLine={normReaction}
            normLabel={`норма ${normReaction}ч`}
          />
        </ChartCard>

        <DonutCard segments={filteredDonutSegments} totalAmount={filteredTotalAmount} />
      </div>
    </div>
  )
}
