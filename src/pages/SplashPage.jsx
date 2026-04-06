import React from 'react'
import BackgroundBlobs from '../components/BackgroundBlobs'

function BouncingArrow() {
  return (
    <span style={{ display:'inline-block', width:10, height:10, borderRight:'2px solid rgba(255,255,255,0.6)', borderBottom:'2px solid rgba(255,255,255,0.6)', transform:'rotate(45deg)', flexShrink:0, marginBottom:4, animation:'bounce-arrow 1.4s ease-in-out infinite' }} />
  )
}

export default function SplashPage({ onEnter }) {
  return (
    <div style={{ width:'100%', height:'100%', background:'#000', position:'relative', overflow:'hidden' }}>
      <BackgroundBlobs variant="solid" />
      <div style={{ color:'#fff', fontSize:170, fontWeight:900, lineHeight:0.9, textAlign:'center', position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', whiteSpace:'nowrap', letterSpacing:'-0.03em', userSelect:'none', pointerEvents:'none' }}>
        Matrix<br />Analytics
      </div>
      <button
        onClick={onEnter}
        style={{ all:'unset', color:'rgba(255,255,255,0.8)', fontSize:13, fontWeight:400, lineHeight:'150%', letterSpacing:'0.08em', textTransform:'uppercase', position:'absolute', left:30, bottom:29, maxWidth:'50%', cursor:'pointer', display:'flex', alignItems:'flex-end', gap:12, transition:'opacity .25s' }}
        onMouseEnter={e => e.currentTarget.style.opacity = '.6'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <span>внутренняя аналитическая платформа для сравнения<br />и контроля закупочных цен материалов у контрагентов</span>
        <BouncingArrow />
      </button>
    </div>
  )
}
