import React, { useEffect, useState } from 'react'
import BackgroundBlobs from '../components/BackgroundBlobs'
import NavCard from '../components/NavCard'

const CSS = `
  @keyframes titleIn {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`

const CARDS = [
  { id: 'strategic', title: 'Стратегическая панель закупочной деятельности', mirror: false },
  { id: 'drivers',   title: 'Драйверы себестоимости и концентрация затрат',  mirror: true  },
  { id: 'portfolio', title: 'Портфель поставщиков и потенциал оптимизации',  mirror: false },
]

export default function NavPage({ onSelectDash }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <>
      <style>{CSS}</style>
      <div style={{
        width: '100%', height: '100%', background: '#000',
        position: 'relative', overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transition: 'opacity .5s ease',
      }}>
        <BackgroundBlobs variant="semi" />

        {/* Title */}
        <div style={{
          color: '#fff', fontSize: 130, fontWeight: 900,
          lineHeight: 0.88, letterSpacing: '-0.03em',
          position: 'absolute', left: 62, top: 44,
          opacity: 0,
          animation: visible ? 'titleIn 0.7s ease 0.1s forwards' : 'none',
        }}>
          Matrix<br />Analytics
        </div>

        {/* Cards */}
        <div style={{
          position: 'absolute', left: 62, top: 337,
          display: 'grid',
          gridTemplateColumns: '479px 479px',
          gridTemplateRows: '148px 148px',
          columnGap: 192, rowGap: 44,
        }}>
          {CARDS.map((c, i) => (
            <div
              key={c.id}
              style={{
                opacity: 0,
                animation: visible ? `cardIn 0.5s ease ${0.2 + i * 0.1}s forwards` : 'none',
              }}
            >
              <NavCard
                title={c.title}
                mirrorGradient={c.mirror}
                onClick={() => onSelectDash(c.id)}
              />
            </div>
          ))}
          <div />
        </div>
      </div>
    </>
  )
}
