import React, { useEffect, useState } from 'react'

const DESIGN_W = 1280
const DESIGN_H = 720

export default function ScaleRoot({ children }) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const calc = () => {
      const scaleX = window.innerWidth  / DESIGN_W
      const scaleY = window.innerHeight / DESIGN_H
      setScale(Math.max(0.5, Math.max(scaleX, scaleY))) 
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f6f1f5',
      overflow: 'hidden',
    }}>
      <div style={{
        width: DESIGN_W,
        height: DESIGN_H,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  )
}
