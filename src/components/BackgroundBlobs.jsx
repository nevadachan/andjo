import React from 'react'

export default function BackgroundBlobs({ variant = 'solid' }) {
  const op = variant === 'semi' ? 0.5 : 1
  return (
    <>
      <svg style={{ position:'absolute', left:-509, top:276.73, overflow:'visible', pointerEvents:'none' }} width="1501" height="983" viewBox="0 0 1501 983" fill="none">
        <path d="M107.373 682.855C270.077 732.756 247.267 566.201 367.27 541.229C487.274 516.258 680.355 599.635 822.286 535.693C964.217 471.75 922.81 221.88 1035.96 130.143C1149.11 38.4051 1291.94 308.889 1335.85 144.135C1379.75 -20.6199 1457.27 421.028 1457.27 421.028L228.799 959.749C228.799 959.749 -55.3306 632.955 107.373 682.855Z" fill="black"/>
      </svg>
      <svg style={{ position:'absolute', left:-396, top:398.39, overflow:'visible', pointerEvents:'none' }} width="1808" height="1364" viewBox="0 0 1808 1364" fill="none">
        <path d="M147.668 991.934C354.712 1037.63 300.246 829.718 443.104 785.404C585.963 741.09 835.515 825.825 998.991 729.96C1162.47 634.096 1071.96 322.953 1195.79 195.053C1319.61 67.1518 1537.51 393.527 1564.97 180.789C1592.42 -31.9487 1757.69 517.539 1757.69 517.539L340.395 1328.68C340.395 1328.68 -59.3769 946.242 147.668 991.934Z" fill="#BF3580" fillOpacity={op}/>
      </svg>
      <svg style={{ position:'absolute', left:61.58, top:403.89, overflow:'visible', pointerEvents:'none' }} width="1200" height="933" viewBox="0 0 1200 933" fill="none">
        <path d="M108.018 588.424C251.485 667.303 200.61 478.206 294.516 467.454C388.421 456.702 563.331 577.267 667.761 526.157C772.192 475.046 689.957 190.334 765.351 104.106C840.745 17.8778 1010.39 340.054 1014.75 162.479C1019.1 -15.0959 1168.02 488.755 1168.02 488.755L261.29 914.699C261.29 914.699 -35.4482 509.544 108.018 588.424Z" fill="#BF3580" fillOpacity={op}/>
      </svg>
      <svg style={{ position:'absolute', left:110, top:942.65, overflow:'visible', pointerEvents:'none' }} width="1322" height="1123" viewBox="0 0 1322 1123" fill="none">
        <path d="M125.801 827.534C287.947 859.414 221.875 693.89 324.688 655.048C427.5 616.206 626.483 678.425 738.735 597.755C850.988 517.085 745.301 269.578 823.718 164.123C902.135 58.6685 1106.05 315.457 1101.4 144.169C1096.74 -27.1184 1287.5 409.86 1287.5 409.86L311.907 1093.23C311.907 1093.23 -36.3454 795.655 125.801 827.534Z" fill="black"/>
      </svg>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.25)', backdropFilter:'blur(125px)', pointerEvents:'none' }} />
    </>
  )
}
