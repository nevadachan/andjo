import React, { useState } from 'react'

const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M11.2803 0.75C11.2803 0.335786 10.9445 0 10.5303 0L3.78033 0C3.36611 0 3.03033 0.335786 3.03033 0.75C3.03033 1.16421 3.36611 1.5 3.78033 1.5H9.78033V7.5C9.78033 7.91421 10.1161 8.25 10.5303 8.25C10.9445 8.25 11.2803 7.91421 11.2803 7.5L11.2803 0.75ZM0.530327 10.75L1.06066 11.2803L11.0607 1.28033L10.5303 0.75L10 0.219669L0 10.2197L0.530327 10.75Z" fill="white"/>
  </svg>
)

export default function NavCard({ title, onClick, mirrorGradient = false }) {
  const [hovered, setHovered] = useState(false)
  const bgGrad = mirrorGradient
    ? 'linear-gradient(160deg, rgba(234,82,155,0.86) 0%, rgba(234,82,155,0) 100%)'
    : 'linear-gradient(160deg, rgba(234,82,155,0) 0%, rgba(234,82,155,0.86) 100%)'
  const borderGrad = mirrorGradient
    ? 'linear-gradient(45deg, rgba(255,255,255,0.9) 0%, rgba(102,102,102,0) 100%)'
    : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(102,102,102,0) 100%)'
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width:479, height:148, position:'relative', borderRadius:15, cursor:'pointer', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', filter: hovered ? 'brightness(1.2)' : 'brightness(1)', transition:'transform .2s ease, filter .2s ease' }}>
      <div style={{ position:'absolute', inset:0, borderRadius:15, background:bgGrad, opacity:0.45 }} />
      <div style={{ position:'absolute', inset:0, borderRadius:15, padding:1, background:borderGrad, WebkitMask:'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite:'xor', maskComposite:'exclude', pointerEvents:'none' }} />
      <div style={{ position:'absolute', left:27, top:20, right:27, bottom:20, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
        <div style={{ color:'#fff', fontSize:20, fontWeight:600, lineHeight:1.3, letterSpacing:'0.01em', textTransform:'uppercase' }}>{title}</div>
        <div style={{ display:'flex', alignItems:'center', gap:6, color:'#fff', fontSize:13, fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', opacity:0.8 }}>
          <ArrowIcon />ПЕРЕЙТИ
        </div>
      </div>
    </div>
  )
}
