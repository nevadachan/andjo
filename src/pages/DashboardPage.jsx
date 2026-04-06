import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { SUPPLIER_DATASETS, FILTER_OPTIONS_PORTFOLIO, DEFAULT_SUPPLIER_DATASET } from '../data/suppliers'
import BarChart from '../components/charts/BarChart'
import PriceChart from '../components/charts/PriceChart'
import DonutChartCJ from '../components/charts/DonutChartCJ'

// ── Хук для отслеживания размера экрана ───────────────────────────────────────
function useBreakpoint() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1200,
    isDesktop: width >= 1200,
    width,
  }
}

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
      minHeight: 0, // ← критично для flex-контейнеров
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
function DeviationStrip({ suppliers, isMobile }) {
  return (
    <Card title="Отклонение цены от средней закупочной цены" style={{ flexShrink: 0 }}>
      <div style={{
        display: 'flex',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        padding: '4px 10px 10px',
        gap: 6, overflowX: 'auto',
      }}>
        {suppliers.map(s => {
          const pos = s.deviation >= 0
          const color = pos ? '#e84342' : '#00b473'
          return (
            <div key={s.id} style={{
              flex: isMobile ? '1 1 calc(50% - 6px)' : '1 1 0',
              minWidth: isMobile ? 'unset' : 80,
              padding: '6px 8px',
              borderRadius: 8, background: '#fafafa',
              border: '1px solid #f0f0f0',
            }}>
              <div style={{ fontSize: 9, color: '#888', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color, lineHeight: 1 }}>
                {pos ? '+' : ''}{s.deviation.toFixed(2)}%
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <div>
                  <div style={{ fontSize: 8, color: '#aaa' }}>объём</div>
                  <div style={{ fontSize: 9, color: '#333' }}>{s.volume.toLocaleString('ru')} шт</div>
                </div>
                <div>
                  <div style={{ fontSize: 8, color: '#aaa' }}>перепл.</div>
                  <div style={{ fontSize: 9, color }}>
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
function ReliabilityStrip({ suppliers, isMobile }) {
  return (
    <Card title="Индекс надёжности поставщика" style={{ flexShrink: 0 }}>
      <div style={{
        display: 'flex',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        padding: '4px 10px 10px',
        gap: 6,
      }}>
        {suppliers.map(s => {
          const v = s.reliability
          const barColor = v >= 92 ? '#00b473' : v >= 85 ? '#ffa617' : '#e84342'
          return (
            <div key={s.id} style={{
              flex: isMobile ? '1 1 calc(50% - 6px)' : '1 1 0',
              minWidth: isMobile ? 'unset' : 70,
            }}>
              <div style={{ fontSize: 9, color: '#888', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#000', lineHeight: 1 }}>
                {v.toFixed(1)}%
              </div>
              <div style={{
                marginTop: 4, height: 4, borderRadius: 2,
                background: '#eee', overflow: 'hidden',
              }}>
                <div style={{
                  width: `${v}%`, height: '100%',
                  background: barColor, borderRadius: 2,
                  transition: 'width .4s',
                }} />
              </div>
              <div style={{ fontSize: 8, color: '#aaa', marginTop: 3, lineHeight: 1.3 }}>
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
        color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '.03em', flexShrink: 0,
      }}>
        Структура поставщиков
      </div>

      {/* ── Donut — КЛЮЧЕВОЙ ФИКС: aspect-ratio вместо фиксированного maxHeight ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%',
        padding: '0 10px',
        boxSizing: 'border-box',
        flex: '1 1 auto',
        minHeight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 220,
          aspectRatio: '1 / 1',
        }}>
          <DonutChartCJ data={chartData} total={totalStr} />
        </div>
      </div>

      {/* legend */}
      <div style={{ padding: '6px 13px 12px', flexShrink: 0, position: 'relative', zIndex: 1 }}>
        {segments.map(s => (
          <div
            key={s.id}
            onMouseEnter={() => setHoveredItem(s.id)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 4, padding: '3px 6px', borderRadius: 6,
              background: hoveredItem === s.id ? 'rgba(255,255,255,0.07)' : 'transparent',
              transition: 'background 0.15s', cursor: 'default',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: s.color,
                border: s.color === '#f8d7e0' || s.color === '#ffffff' ? '1px solid #555' : 'none',
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 9, color: hoveredItem === s.id ? '#fff' : 'rgba(255,255,255,0.75)' }}>
                {s.label}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)' }}>
                {s.pct.toFixed(2)}%
              </span>
              <span style={{ fontSize: 9, color: '#ea529b', fontWeight: 700 }}>
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
          <span style={{ fontSize: 9, color: '#888' }}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Chart card — обёртка для графиков с правильными пропорциями ──────────────
function ChartCard({ title, children, legendItems, style }) {
  return (
    <Card title={title} style={{ flex: '1 1 0', minHeight: 0, ...style }}>
      <div style={{
        flex: '1 1 0',
        minHeight: 0,
        padding: '0 8px',
        position: 'relative',
        /* Контейнер растягивается, а графики внутри должны быть 100% width/height */
      }}>
        {children}
      </div>
      {legendItems && <LegendRow items={legendItems} />}
    </Card>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DashboardPage({ onBack }) {
  const [visible, setVisible] = useState(false)
  const [period, setPeriod] = useState(FILTER_OPTIONS_PORTFOLIO.periods[0])
  const [category, setCategory] = useState(FILTER_OPTIONS_PORTFOLIO.categories[0])
  const [openPill, setOpenPill] = useState(null)
  const { isMobile, isTablet } = useBreakpoint()

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

  // ── Адаптивный layout ──
  // Мобилка: одна колонка
  // Планшет: две колонки но более равные
  // Десктоп: 1fr 0.55fr
  const gridColumns = isMobile
    ? '1fr'
    : isTablet
      ? '1fr 1fr'
      : '1fr 0.55fr'

  return (
    <div
      style={{
        width: '100%', height: '100%', background: '#f6f1f5',
        display: 'flex', flexDirection: 'column',
        padding: isMobile ? '8px 10px' : '8px 20px',
        boxSizing: 'border-box',
        overflow: isMobile ? 'auto' : 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity .5s ease, transform .5s ease',
      }}
      onClick={closePills}
    >
      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 12,
        marginBottom: 8, flexShrink: 0,
        flexWrap: 'wrap',
      }}>
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
        <div style={{
          fontSize: isMobile ? 16 : 22,
          fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.1, color: '#000',
        }}>
          ПОРТФЕЛЬ ПОСТАВЩИКОВ И ПОТЕНЦИАЛ ОПТИМИЗАЦИИ
        </div>
      </div>

      {/* ── Filter pills ── */}
      <div
        style={{
          display: 'flex', gap: 16, marginBottom: 10, flexShrink: 0,
          flexWrap: 'wrap',
        }}
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

      {/* ── Main grid ── */}
      <div style={{
        flex: 1, minHeight: 0,
        display: 'grid',
        gridTemplateColumns: gridColumns,
        gridTemplateRows: isMobile ? 'auto' : '1fr',
        gap: 10,
        overflow: isMobile ? 'visible' : 'hidden',
      }}>
        {/* ── LEFT COLUMN ── */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 10,
          minHeight: 0, overflow: 'hidden',
        }}>
          <DeviationStrip suppliers={suppliers} isMobile={isMobile} />

          <ChartCard
            title="Сравнительный анализ закупочных цен у поставщиков, руб"
            legendItems={[
              { label: 'средняя закупочная цена', color: '#e84342', type: 'dash' },
              { label: 'цена у поставщиков', color: '#808082', type: 'circle' },
            ]}
            style={isMobile ? { minHeight: 220 } : {}}
          >
            <PriceChart suppliers={suppliersWithPrice} avgPrice={avgPrice} />
          </ChartCard>

          <ReliabilityStrip suppliers={suppliers} isMobile={isMobile} />
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 10,
          minHeight: 0, overflow: 'hidden',
        }}>
          <ChartCard
            title="Уровень брака по поставщикам, %"
            legendItems={[
              { label: 'уровень брака', color: '#bf3580', type: 'circle' },
              { label: 'допустимая норма', color: '#e84342', type: 'dash' },
            ]}
            style={isMobile ? { minHeight: 180 } : {}}
          >
            <BarChart
              suppliers={suppliers}
              getValue={s => s.defectRate ?? 0}
              colorVariant="pink"
              normLine={normDefect}
              normLabel={`норма ${normDefect}%`}
            />
          </ChartCard>

          <ChartCard
            title="Скорость реакции поставщика на запросы, часы"
            legendItems={[
              { label: 'время реакции', color: '#808082', type: 'circle' },
              { label: 'допустимая норма', color: '#e84342', type: 'dash' },
            ]}
            style={isMobile ? { minHeight: 180 } : {}}
          >
            <BarChart
              suppliers={suppliers}
              getValue={s => s.reactionTime ?? 0}
              colorVariant="grey"
              normLine={normReaction}
              normLabel={`норма ${normReaction}ч`}
            />
          </ChartCard>

          <DonutCard segments={donutSegments} totalAmount={totalAmount} />
        </div>
      </div>
    </div>
  )
}
