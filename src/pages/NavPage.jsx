import React, { useEffect, useState } from 'react'
import BackgroundBlobs from '../components/BackgroundBlobs'
import NavCard from '../components/NavCard'

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
    <div style={{ width:'100%', height:'100%', background:'#000', position:'relative', overflow:'hidden', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)', transition:'opacity .7s ease, transform .7s ease' }}>
      <BackgroundBlobs variant="semi" />
      <div style={{ color:'#fff', fontSize:130, fontWeight:900, lineHeight:0.88, letterSpacing:'-0.03em', position:'absolute', left:62, top:44 }}>
        Matrix<br />Analytics
      </div>
      <div style={{ position:'absolute', left:62, top:337, display:'grid', gridTemplateColumns:'479px 479px', gridTemplateRows:'148px 148px', columnGap:192, rowGap:44 }}>
        {CARDS.map(c => (
          <NavCard key={c.id} title={c.title} mirrorGradient={c.mirror} onClick={() => onSelectDash(c.id)} />
        ))}
        <div />
      </div>
    </div>
  )
}
