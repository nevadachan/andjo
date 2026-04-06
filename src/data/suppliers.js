// ─── Preset datasets ──────────────────────────────────────────────────────────

export const SUPPLIER_DATASETS = [
  // ── Preset 1: Серверный модуль X-200, 2025-2026 ──────────────────────────
  {
    period:   '01.01.2025 – 01.01.2026',
    category: 'Серверный модуль X-200',
    supplier: 'Все поставщики',
    suppliers: [
      { id:'A', label:'Поставщик А', color:'#bf3580', deviation:+6.29,  volume:4000, overpay:+1168.0, reliability:93.6, reliabilityNote:'надежный, но дороже рынка',          price:4935, reactionTime:6,  defectRate:1.8 },
      { id:'B', label:'Поставщик B', color:'#ea529b', deviation:-1.55,  volume:2450, overpay:-176.4,  reliability:90.2, reliabilityNote:'надежный, сбалансированный',          price:4571, reactionTime:9,  defectRate:2.6 },
      { id:'C', label:'Поставщик C', color:'#f8d7e0', deviation:-2.52,  volume:1900, overpay:-222.3,  reliability:86.2, reliabilityNote:'средний уровень, риск качества',      price:4526, reactionTime:14, defectRate:3.9 },
      { id:'D', label:'Поставщик D', color:'#555555', deviation:-3.44,  volume:1450, overpay:-232.0,  reliability:95.3, reliabilityNote:'стабильный и надежный',               price:4483, reactionTime:5,  defectRate:1.2 },
      { id:'E', label:'Поставщик E', color:'#808082', deviation:-6.67,  volume:900,  overpay:-279.0,  reliability:83.7, reliabilityNote:'зона повышенного риска',               price:4333, reactionTime:18, defectRate:4.8 },
      { id:'F', label:'Поставщик F', color:'#c8c8c8', deviation:-11.26, volume:500,  overpay:-261.5,  reliability:96.7, reliabilityNote:'стратегический опорный поставщик',     price:4120, reactionTime:4,  defectRate:0.9 },
    ],
    avgPrice:    4643,
    totalAmount: 52.0,
    donutSegments: [
      { id:'A', label:'Поставщик А', value:19.74, pct:37.96, color:'#bf3580' },
      { id:'B', label:'Поставщик B', value:11.20, pct:21.54, color:'#ea529b' },
      { id:'C', label:'Поставщик C', value: 8.60, pct:16.54, color:'#f8d7e0' },
      { id:'D', label:'Поставщик D', value: 6.50, pct:12.50, color:'#555555' },
      { id:'E', label:'Поставщик E', value: 3.90, pct: 7.50, color:'#808082' },
      { id:'F', label:'Поставщик F', value: 2.06, pct: 3.96, color:'#c8c8c8' },
    ],
  },

  // ── Preset 2: Серверный модуль X-200, 2024-2025 ──────────────────────────
  {
    period:   '01.01.2024 – 01.01.2025',
    category: 'Серверный модуль X-200',
    supplier: 'Все поставщики',
    suppliers: [
      { id:'A', label:'Поставщик А', color:'#bf3580', deviation:+5.43,  volume:3800, overpay:+954.0,  reliability:92.8, reliabilityNote:'надежный, чуть дороже рынка',         price:4660, reactionTime:7,  defectRate:1.6 },
      { id:'B', label:'Поставщик B', color:'#ea529b', deviation:-0.82,  volume:2200, overpay:-79.9,   reliability:89.5, reliabilityNote:'надежный, сбалансированный',          price:4384, reactionTime:10, defectRate:2.4 },
      { id:'C', label:'Поставщик C', color:'#f8d7e0', deviation:-1.95,  volume:1750, overpay:-149.9,  reliability:85.1, reliabilityNote:'средний уровень, риск качества',      price:4334, reactionTime:15, defectRate:3.5 },
      { id:'D', label:'Поставщик D', color:'#555555', deviation:-2.76,  volume:1300, overpay:-158.5,  reliability:94.7, reliabilityNote:'стабильный и надежный',               price:4298, reactionTime:6,  defectRate:1.0 },
      { id:'E', label:'Поставщик E', color:'#808082', deviation:-5.40,  volume:800,  overpay:-191.0,  reliability:82.3, reliabilityNote:'зона повышенного риска',               price:4181, reactionTime:16, defectRate:4.2 },
      { id:'F', label:'Поставщик F', color:'#c8c8c8', deviation:-9.10,  volume:450,  overpay:-181.1,  reliability:96.2, reliabilityNote:'стратегический опорный поставщик',     price:4018, reactionTime:5,  defectRate:1.1 },
    ],
    avgPrice:    4420,
    totalAmount: 45.7,
    donutSegments: [
      { id:'A', label:'Поставщик А', value:17.71, pct:38.76, color:'#bf3580' },
      { id:'B', label:'Поставщик B', value: 9.64, pct:21.10, color:'#ea529b' },
      { id:'C', label:'Поставщик C', value: 7.58, pct:16.60, color:'#f8d7e0' },
      { id:'D', label:'Поставщик D', value: 5.59, pct:12.23, color:'#555555' },
      { id:'E', label:'Поставщик E', value: 3.34, pct: 7.31, color:'#808082' },
      { id:'F', label:'Поставщик F', value: 1.81, pct: 3.96, color:'#c8c8c8' },
    ],
  },

  // ── Preset 3: Плата PU-7, 2025-2026 ──────────────────────────────────────
  {
    period:   '01.01.2025 – 01.01.2026',
    category: 'Плата PU-7',
    supplier: 'Все поставщики',
    suppliers: [
      { id:'A', label:'Поставщик А', color:'#bf3580', deviation:+8.11,  volume:8000, overpay:+1198.0, reliability:91.2, reliabilityNote:'надежный, заметно дороже',           price:2000, reactionTime:5,  defectRate:2.1 },
      { id:'B', label:'Поставщик B', color:'#ea529b', deviation:+2.16,  volume:5500, overpay:+218.0,  reliability:88.4, reliabilityNote:'надежный, чуть выше рынка',           price:1890, reactionTime:8,  defectRate:3.0 },
      { id:'C', label:'Поставщик C', color:'#f8d7e0', deviation:-1.08,  volume:4200, overpay:-84.1,   reliability:84.7, reliabilityNote:'средний уровень',                     price:1830, reactionTime:12, defectRate:4.2 },
      { id:'D', label:'Поставщик D', color:'#555555', deviation:-3.24,  volume:3000, overpay:-180.0,  reliability:93.8, reliabilityNote:'стабильный и надежный',               price:1790, reactionTime:4,  defectRate:1.4 },
      { id:'E', label:'Поставщик E', color:'#808082', deviation:-5.95,  volume:2000, overpay:-220.0,  reliability:80.1, reliabilityNote:'зона повышенного риска',               price:1740, reactionTime:20, defectRate:5.1 },
      { id:'F', label:'Поставщик F', color:'#c8c8c8', deviation:-12.43, volume:1000, overpay:-229.0,  reliability:95.8, reliabilityNote:'стратегический опорный поставщик',     price:1620, reactionTime:3,  defectRate:0.7 },
    ],
    avgPrice:    1850,
    totalAmount: 44.5,
    donutSegments: [
      { id:'A', label:'Поставщик А', value:16.00, pct:35.96, color:'#bf3580' },
      { id:'B', label:'Поставщик B', value:10.40, pct:23.37, color:'#ea529b' },
      { id:'C', label:'Поставщик C', value: 7.69, pct:17.28, color:'#f8d7e0' },
      { id:'D', label:'Поставщик D', value: 5.37, pct:12.07, color:'#555555' },
      { id:'E', label:'Поставщик E', value: 3.48, pct: 7.82, color:'#808082' },
      { id:'F', label:'Поставщик F', value: 1.62, pct: 3.64, color:'#c8c8c8' },
    ],
  },

  // ── Preset 4: ИБП 3 кВА, 2025-2026 ──────────────────────────────────────
  {
    period:   '01.01.2025 – 01.01.2026',
    category: 'ИБП 3 кВА',
    supplier: 'Все поставщики',
    suppliers: [
      { id:'A', label:'Поставщик А', color:'#bf3580', deviation:+4.94,  volume:500,  overpay:+953.0,  reliability:94.5, reliabilityNote:'надежный, дороже рынка',              price:40400, reactionTime:8,  defectRate:1.5 },
      { id:'B', label:'Поставщик B', color:'#ea529b', deviation:+1.04,  volume:380,  overpay:+153.0,  reliability:91.3, reliabilityNote:'надежный, сбалансированный',          price:38900, reactionTime:11, defectRate:2.2 },
      { id:'C', label:'Поставщик C', color:'#f8d7e0', deviation:-1.30,  volume:260,  overpay:-130.5,  reliability:87.4, reliabilityNote:'средний уровень',                     price:38000, reactionTime:13, defectRate:3.7 },
      { id:'D', label:'Поставщик D', color:'#555555', deviation:-3.64,  volume:200,  overpay:-280.7,  reliability:96.1, reliabilityNote:'стабильный и надежный',               price:37100, reactionTime:6,  defectRate:0.9 },
      { id:'E', label:'Поставщик E', color:'#808082', deviation:-5.97,  volume:140,  overpay:-322.8,  reliability:82.6, reliabilityNote:'зона повышенного риска',               price:36200, reactionTime:22, defectRate:4.5 },
      { id:'F', label:'Поставщик F', color:'#c8c8c8', deviation:-9.09,  volume:80,   overpay:-280.1,  reliability:97.2, reliabilityNote:'стратегический опорный поставщик',     price:35000, reactionTime:4,  defectRate:0.6 },
    ],
    avgPrice:    38500,
    totalAmount: 60.1,
    donutSegments: [
      { id:'A', label:'Поставщик А', value:20.20, pct:33.61, color:'#bf3580' },
      { id:'B', label:'Поставщик B', value:14.78, pct:24.59, color:'#ea529b' },
      { id:'C', label:'Поставщик C', value: 9.88, pct:16.44, color:'#f8d7e0' },
      { id:'D', label:'Поставщик D', value: 7.42, pct:12.35, color:'#555555' },
      { id:'E', label:'Поставщик E', value: 5.07, pct: 8.44, color:'#808082' },
      { id:'F', label:'Поставщик F', value: 2.80, pct: 4.66, color:'#c8c8c8' },
    ],
  },
]



export const FILTER_OPTIONS_PORTFOLIO = {
  periods:    ['01.01.2025 – 01.01.2026', '01.01.2024 – 01.01.2025', '01.01.2023 – 01.01.2024'],
  categories: ['Серверный модуль X-200', 'Плата PU-7', 'ИБП 3 кВА'],
  suppliers:  ['Все поставщики', 'Поставщик А', 'Поставщик B', 'Поставщик C', 'Поставщик D'],
}

export const DEFAULT_SUPPLIER_DATASET = SUPPLIER_DATASETS[0]
