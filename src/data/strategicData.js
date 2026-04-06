export const PERIODS = [
  '01.01.2025 – 01.01.2026',
  '01.01.2024 – 01.01.2025',
  '01.01.2023 – 01.01.2024',
]

export const CATEGORIES = [
  'Плата PU-7',
  'Резистор R-220',
  'Конденсатор C-10мкФ',
  'Трансформатор T-5А',
]

export const SUPPLIERS = [
  'Все поставщики',
  'Поставщик А',
  'Поставщик B',
  'Поставщик C',
  'Поставщик D',
]

const M = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
const md = (f, p) => M.map((month, i) => ({ month, fact: f[i], plan: p[i] }))

export const PRESETS = [
  // ── Плата PU-7 / 2025 ──────────────────────────────────────────────────────
  {
    period: '01.01.2025 – 01.01.2026', category: 'Плата PU-7', supplier: 'Поставщик А',
    kpiProcurement: { volume: '125,84', avgPrice: '5 320', priceGrowth: '+8,50', suppliers: '18' },
    kpiConcentration: { top3: '72,58', hhi: '2 360', top1dep: '33,81' },
    monthlyData: md(
      [8.91, 9.33, 10.24, 9.65, 10.82, 11.51, 12.01, 13.00, 12.18, 11.37, 8.91, 7.91],
      [9.20, 9.50, 10.00, 9.80, 10.50, 11.30, 12.50, 12.70, 12.00, 11.50, 9.50, 8.50],
    ),
  },
  {
    period: '01.01.2025 – 01.01.2026', category: 'Плата PU-7', supplier: 'Поставщик B',
    kpiProcurement: { volume: '48,23', avgPrice: '5 480', priceGrowth: '+10,20', suppliers: '6' },
    kpiConcentration: { top3: '89,10', hhi: '3 120', top1dep: '55,40' },
    monthlyData: md(
      [3.20, 3.45, 4.10, 3.90, 4.40, 5.02, 5.30, 5.80, 5.10, 4.62, 3.50, 3.84],
      [3.50, 3.60, 3.90, 4.00, 4.20, 4.80, 5.50, 5.60, 5.00, 4.80, 4.00, 4.20],
    ),
  },
  {
    period: '01.01.2025 – 01.01.2026', category: 'Плата PU-7', supplier: 'Поставщик C',
    kpiProcurement: { volume: '32,15', avgPrice: '5 100', priceGrowth: '+6,30', suppliers: '4' },
    kpiConcentration: { top3: '95,20', hhi: '3 890', top1dep: '60,50' },
    monthlyData: md(
      [2.10, 2.30, 2.80, 2.60, 2.90, 3.20, 3.50, 3.80, 3.40, 3.10, 2.40, 2.15],
      [2.20, 2.40, 2.70, 2.70, 2.80, 3.10, 3.60, 3.70, 3.30, 3.20, 2.50, 2.30],
    ),
  },
  {
    period: '01.01.2025 – 01.01.2026', category: 'Плата PU-7', supplier: 'Поставщик D',
    kpiProcurement: { volume: '21,40', avgPrice: '4 990', priceGrowth: '+5,10', suppliers: '3' },
    kpiConcentration: { top3: '98,70', hhi: '4 210', top1dep: '70,20' },
    monthlyData: md(
      [1.50, 1.65, 1.90, 1.80, 2.10, 2.30, 2.50, 2.80, 2.55, 2.30, 1.70, 1.60],
      [1.60, 1.70, 1.80, 1.90, 2.00, 2.20, 2.60, 2.70, 2.50, 2.40, 1.80, 1.70],
    ),
  },
  {
    period: '01.01.2025 – 01.01.2026', category: 'Плата PU-7', supplier: 'Все поставщики',
    kpiProcurement: { volume: '228,62', avgPrice: '5 240', priceGrowth: '+7,80', suppliers: '31' },
    kpiConcentration: { top3: '68,40', hhi: '1 980', top1dep: '29,50' },
    monthlyData: md(
      [15.71, 16.73, 19.04, 18.00, 20.22, 22.03, 23.31, 25.40, 23.23, 21.39, 16.51, 15.50],
      [16.50, 17.20, 18.40, 18.40, 19.50, 21.40, 24.20, 24.70, 22.80, 21.90, 17.80, 16.70],
    ),
  },
  // ── Резистор R-220 / 2025 ──────────────────────────────────────────────────
  {
    period: '01.01.2025 – 01.01.2026', category: 'Резистор R-220', supplier: 'Все поставщики',
    kpiProcurement: { volume: '342,50', avgPrice: '210', priceGrowth: '+3,20', suppliers: '42' },
    kpiConcentration: { top3: '52,10', hhi: '1 240', top1dep: '22,30' },
    monthlyData: md(
      [22.10, 24.30, 28.50, 27.80, 31.20, 34.10, 35.90, 38.00, 36.50, 33.40, 26.50, 24.20],
      [23.00, 25.00, 28.00, 28.50, 30.00, 33.00, 37.00, 37.50, 35.00, 34.00, 27.00, 25.00],
    ),
  },
  {
    period: '01.01.2025 – 01.01.2026', category: 'Резистор R-220', supplier: 'Поставщик А',
    kpiProcurement: { volume: '76,40', avgPrice: '195', priceGrowth: '+2,50', suppliers: '8' },
    kpiConcentration: { top3: '78,50', hhi: '2 890', top1dep: '44,10' },
    monthlyData: md(
      [4.80, 5.30, 6.40, 6.10, 7.20, 7.80, 8.50, 9.20, 8.40, 7.60, 5.90, 5.20],
      [5.10, 5.50, 6.20, 6.30, 6.90, 7.50, 8.80, 8.90, 8.10, 7.90, 6.10, 5.60],
    ),
  },
  {
    period: '01.01.2025 – 01.01.2026', category: 'Резистор R-220', supplier: 'Поставщик B',
    kpiProcurement: { volume: '58,70', avgPrice: '218', priceGrowth: '+4,10', suppliers: '5' },
    kpiConcentration: { top3: '82,30', hhi: '3 040', top1dep: '48,60' },
    monthlyData: md(
      [3.60, 4.10, 5.00, 4.80, 5.60, 6.10, 6.80, 7.40, 6.90, 6.10, 4.60, 4.20],
      [3.90, 4.30, 4.80, 5.00, 5.30, 5.90, 7.10, 7.20, 6.60, 6.40, 4.90, 4.50],
    ),
  },
  {
    period: '01.01.2025 – 01.01.2026', category: 'Резистор R-220', supplier: 'Поставщик C',
    kpiProcurement: { volume: '42,30', avgPrice: '224', priceGrowth: '+5,60', suppliers: '4' },
    kpiConcentration: { top3: '90,10', hhi: '3 560', top1dep: '58,20' },
    monthlyData: md(
      [2.60, 2.90, 3.60, 3.40, 3.90, 4.30, 4.80, 5.20, 4.80, 4.30, 3.30, 3.10],
      [2.80, 3.10, 3.40, 3.60, 3.70, 4.10, 5.00, 5.10, 4.60, 4.50, 3.50, 3.30],
    ),
  },
  {
    period: '01.01.2025 – 01.01.2026', category: 'Резистор R-220', supplier: 'Поставщик D',
    kpiProcurement: { volume: '31,80', avgPrice: '205', priceGrowth: '+2,90', suppliers: '3' },
    kpiConcentration: { top3: '94,50', hhi: '4 020', top1dep: '65,30' },
    monthlyData: md(
      [1.90, 2.20, 2.70, 2.60, 3.00, 3.30, 3.70, 4.00, 3.70, 3.30, 2.50, 2.30],
      [2.10, 2.30, 2.60, 2.70, 2.80, 3.10, 3.90, 3.90, 3.50, 3.40, 2.70, 2.50],
    ),
  },
  // ── Конденсатор C-10мкФ / 2025 ─────────────────────────────────────────────
  {
    period: '01.01.2025 – 01.01.2026', category: 'Конденсатор C-10мкФ', supplier: 'Все поставщики',
    kpiProcurement: { volume: '142,70', avgPrice: '1 380', priceGrowth: '+4,60', suppliers: '28' },
    kpiConcentration: { top3: '61,40', hhi: '1 620', top1dep: '27,80' },
    monthlyData: md(
      [9.20, 10.10, 12.30, 11.80, 13.50, 14.80, 15.90, 17.20, 15.60, 14.10, 10.50, 9.70],
      [9.80, 10.50, 11.80, 12.10, 13.00, 14.30, 16.50, 16.80, 15.00, 14.60, 11.10, 10.30],
    ),
  },
  {
    period: '01.01.2025 – 01.01.2026', category: 'Конденсатор C-10мкФ', supplier: 'Поставщик А',
    kpiProcurement: { volume: '58,30', avgPrice: '1 420', priceGrowth: '+5,80', suppliers: '12' },
    kpiConcentration: { top3: '81,30', hhi: '2 640', top1dep: '41,20' },
    monthlyData: md(
      [3.80, 4.10, 4.90, 4.60, 5.30, 5.80, 6.20, 6.80, 6.10, 5.50, 4.10, 3.60],
      [4.00, 4.30, 4.70, 4.80, 5.10, 5.60, 6.50, 6.60, 5.90, 5.70, 4.40, 3.90],
    ),
  },
  {
    period: '01.01.2025 – 01.01.2026', category: 'Конденсатор C-10мкФ', supplier: 'Поставщик B',
    kpiProcurement: { volume: '34,60', avgPrice: '1 450', priceGrowth: '+6,90', suppliers: '6' },
    kpiConcentration: { top3: '88,70', hhi: '3 180', top1dep: '52,30' },
    monthlyData: md(
      [2.20, 2.40, 2.90, 2.70, 3.10, 3.40, 3.70, 4.10, 3.70, 3.30, 2.50, 2.20],
      [2.40, 2.55, 2.80, 2.85, 3.00, 3.30, 3.90, 3.95, 3.55, 3.45, 2.70, 2.45],
    ),
  },
  {
    period: '01.01.2025 – 01.01.2026', category: 'Конденсатор C-10мкФ', supplier: 'Поставщик C',
    kpiProcurement: { volume: '26,40', avgPrice: '1 395', priceGrowth: '+4,20', suppliers: '5' },
    kpiConcentration: { top3: '92,60', hhi: '3 720', top1dep: '59,80' },
    monthlyData: md(
      [1.70, 1.85, 2.20, 2.10, 2.40, 2.60, 2.80, 3.10, 2.80, 2.50, 1.90, 1.65],
      [1.80, 1.95, 2.10, 2.20, 2.30, 2.50, 2.95, 3.00, 2.70, 2.65, 2.05, 1.80],
    ),
  },
  {
    period: '01.01.2025 – 01.01.2026', category: 'Конденсатор C-10мкФ', supplier: 'Поставщик D',
    kpiProcurement: { volume: '19,10', avgPrice: '1 360', priceGrowth: '+3,50', suppliers: '3' },
    kpiConcentration: { top3: '96,80', hhi: '4 450', top1dep: '68,40' },
    monthlyData: md(
      [1.20, 1.35, 1.60, 1.50, 1.75, 1.90, 2.10, 2.30, 2.10, 1.90, 1.40, 1.20],
      [1.30, 1.40, 1.55, 1.60, 1.65, 1.80, 2.20, 2.25, 2.00, 1.95, 1.50, 1.30],
    ),
  },
  // ── Трансформатор T-5А / 2025 ──────────────────────────────────────────────
  {
    period: '01.01.2025 – 01.01.2026', category: 'Трансформатор T-5А', supplier: 'Все поставщики',
    kpiProcurement: { volume: '356,20', avgPrice: '11 860', priceGrowth: '+9,70', suppliers: '22' },
    kpiConcentration: { top3: '64,20', hhi: '1 790', top1dep: '31,60' },
    monthlyData: md(
      [23.80, 25.40, 30.20, 28.50, 33.10, 36.20, 38.50, 42.80, 38.00, 34.70, 27.30, 21.20],
      [25.00, 26.50, 29.30, 29.80, 32.00, 35.00, 40.20, 41.30, 36.80, 36.10, 28.80, 24.40],
    ),
  },
  {
    period: '01.01.2025 – 01.01.2026', category: 'Трансформатор T-5А', supplier: 'Поставщик А',
    kpiProcurement: { volume: '94,30', avgPrice: '12 100', priceGrowth: '+10,40', suppliers: '7' },
    kpiConcentration: { top3: '79,50', hhi: '2 780', top1dep: '43,20' },
    monthlyData: md(
      [6.10, 6.60, 7.90, 7.50, 8.60, 9.50, 10.20, 11.40, 10.10, 9.20, 7.20, 5.80],
      [6.50, 6.90, 7.70, 7.80, 8.40, 9.20, 10.60, 10.90, 9.70, 9.50, 7.60, 6.50],
    ),
  },
  {
    period: '01.01.2025 – 01.01.2026', category: 'Трансформатор T-5А', supplier: 'Поставщик B',
    kpiProcurement: { volume: '72,50', avgPrice: '11 740', priceGrowth: '+8,90', suppliers: '5' },
    kpiConcentration: { top3: '85,30', hhi: '3 050', top1dep: '49,70' },
    monthlyData: md(
      [4.60, 5.10, 6.10, 5.80, 6.70, 7.40, 7.90, 8.80, 7.80, 7.10, 5.60, 4.40],
      [5.00, 5.30, 5.90, 6.10, 6.50, 7.10, 8.30, 8.50, 7.50, 7.40, 5.90, 4.90],
    ),
  },
  {
    period: '01.01.2025 – 01.01.2026', category: 'Трансформатор T-5А', supplier: 'Поставщик C',
    kpiProcurement: { volume: '186,90', avgPrice: '12 400', priceGrowth: '+11,30', suppliers: '9' },
    kpiConcentration: { top3: '88,60', hhi: '3 210', top1dep: '52,40' },
    monthlyData: md(
      [12.40, 13.20, 15.80, 14.90, 17.20, 18.90, 20.10, 22.30, 19.80, 18.10, 14.20, 11.00],
      [13.00, 13.80, 15.30, 15.50, 16.80, 18.30, 21.00, 21.50, 19.20, 18.80, 15.00, 12.80],
    ),
  },
  {
    period: '01.01.2025 – 01.01.2026', category: 'Трансформатор T-5А', supplier: 'Поставщик D',
    kpiProcurement: { volume: '48,20', avgPrice: '11 500', priceGrowth: '+7,80', suppliers: '4' },
    kpiConcentration: { top3: '93,40', hhi: '3 960', top1dep: '63,10' },
    monthlyData: md(
      [3.10, 3.40, 4.10, 3.90, 4.50, 5.00, 5.30, 5.90, 5.30, 4.80, 3.80, 2.90],
      [3.40, 3.60, 3.90, 4.10, 4.30, 4.80, 5.60, 5.70, 5.10, 5.00, 4.00, 3.10],
    ),
  },
  // ── Плата PU-7 / 2024 ──────────────────────────────────────────────────────
  {
    period: '01.01.2024 – 01.01.2025', category: 'Плата PU-7', supplier: 'Поставщик А',
    kpiProcurement: { volume: '116,10', avgPrice: '4 910', priceGrowth: '+6,20', suppliers: '16' },
    kpiConcentration: { top3: '70,30', hhi: '2 180', top1dep: '31,20' },
    monthlyData: md(
      [7.80, 8.40, 9.50, 9.10, 10.20, 10.80, 11.50, 12.40, 11.80, 10.70, 8.50, 7.40],
      [8.20, 8.70, 9.20, 9.30, 9.90, 10.50, 12.00, 12.10, 11.40, 11.10, 9.00, 7.90],
    ),
  },
  {
    period: '01.01.2024 – 01.01.2025', category: 'Плата PU-7', supplier: 'Все поставщики',
    kpiProcurement: { volume: '210,40', avgPrice: '4 830', priceGrowth: '+5,80', suppliers: '28' },
    kpiConcentration: { top3: '65,90', hhi: '1 840', top1dep: '27,10' },
    monthlyData: md(
      [13.80, 15.20, 17.60, 16.90, 19.10, 20.80, 22.40, 24.30, 22.10, 20.50, 15.80, 14.90],
      [14.80, 15.90, 17.10, 17.50, 18.60, 20.20, 23.30, 23.70, 21.60, 21.30, 16.90, 15.90],
    ),
  },
  {
    period: '01.01.2024 – 01.01.2025', category: 'Резистор R-220', supplier: 'Все поставщики',
    kpiProcurement: { volume: '316,20', avgPrice: '204', priceGrowth: '+2,10', suppliers: '38' },
    kpiConcentration: { top3: '50,40', hhi: '1 180', top1dep: '20,90' },
    monthlyData: md(
      [20.10, 22.40, 26.30, 25.60, 28.80, 31.40, 33.20, 35.10, 33.70, 30.80, 24.40, 22.30],
      [21.20, 23.10, 25.80, 26.30, 27.70, 30.40, 34.20, 34.60, 32.30, 31.40, 24.90, 23.10],
    ),
  },
  {
    period: '01.01.2024 – 01.01.2025', category: 'Конденсатор C-10мкФ', supplier: 'Все поставщики',
    kpiProcurement: { volume: '131,50', avgPrice: '1 320', priceGrowth: '+3,40', suppliers: '25' },
    kpiConcentration: { top3: '59,20', hhi: '1 540', top1dep: '25,60' },
    monthlyData: md(
      [8.40, 9.30, 11.40, 10.90, 12.50, 13.60, 14.70, 15.90, 14.40, 13.00, 9.70, 8.90],
      [9.00, 9.70, 10.90, 11.20, 12.00, 13.20, 15.30, 15.50, 13.80, 13.50, 10.30, 9.50],
    ),
  },
  {
    period: '01.01.2024 – 01.01.2025', category: 'Трансформатор T-5А', supplier: 'Все поставщики',
    kpiProcurement: { volume: '328,40', avgPrice: '10 810', priceGrowth: '+7,60', suppliers: '20' },
    kpiConcentration: { top3: '62,10', hhi: '1 710', top1dep: '29,80' },
    monthlyData: md(
      [21.90, 23.40, 27.80, 26.30, 30.50, 33.40, 35.50, 39.50, 35.10, 32.00, 25.20, 19.60],
      [23.10, 24.40, 27.00, 27.50, 29.50, 32.30, 37.10, 38.10, 33.90, 33.30, 26.60, 22.50],
    ),
  },
  // ── Плата PU-7 / 2023 ──────────────────────────────────────────────────────
  {
    period: '01.01.2023 – 01.01.2024', category: 'Плата PU-7', supplier: 'Поставщик А',
    kpiProcurement: { volume: '109,40', avgPrice: '4 620', priceGrowth: '+4,10', suppliers: '15' },
    kpiConcentration: { top3: '68,50', hhi: '2 040', top1dep: '29,80' },
    monthlyData: md(
      [7.20, 7.80, 9.10, 8.70, 9.80, 10.30, 11.00, 11.90, 11.40, 10.30, 8.10, 7.00],
      [7.60, 8.10, 8.80, 9.00, 9.50, 10.00, 11.50, 11.60, 10.90, 10.80, 8.60, 7.50],
    ),
  },
  {
    period: '01.01.2023 – 01.01.2024', category: 'Плата PU-7', supplier: 'Все поставщики',
    kpiProcurement: { volume: '198,70', avgPrice: '4 550', priceGrowth: '+3,80', suppliers: '25' },
    kpiConcentration: { top3: '63,20', hhi: '1 720', top1dep: '25,40' },
    monthlyData: md(
      [12.80, 14.10, 16.40, 15.80, 18.00, 19.50, 21.10, 23.00, 21.20, 19.40, 15.00, 14.20],
      [13.60, 14.80, 15.90, 16.30, 17.40, 18.90, 22.00, 22.40, 20.40, 20.00, 15.90, 15.00],
    ),
  },
  {
    period: '01.01.2023 – 01.01.2024', category: 'Резистор R-220', supplier: 'Все поставщики',
    kpiProcurement: { volume: '298,30', avgPrice: '199', priceGrowth: '+1,40', suppliers: '35' },
    kpiConcentration: { top3: '48,60', hhi: '1 120', top1dep: '19,50' },
    monthlyData: md(
      [19.00, 21.10, 24.90, 24.20, 27.20, 29.60, 31.30, 33.10, 31.80, 29.10, 23.10, 21.00],
      [20.10, 21.90, 24.40, 24.90, 26.20, 28.70, 32.30, 32.70, 30.50, 29.70, 23.60, 21.90],
    ),
  },
  {
    period: '01.01.2023 – 01.01.2024', category: 'Конденсатор C-10мкФ', supplier: 'Все поставщики',
    kpiProcurement: { volume: '122,80', avgPrice: '1 278', priceGrowth: '+2,60', suppliers: '22' },
    kpiConcentration: { top3: '57,30', hhi: '1 470', top1dep: '23,90' },
    monthlyData: md(
      [7.80, 8.70, 10.60, 10.20, 11.70, 12.80, 13.80, 14.90, 13.50, 12.20, 9.10, 8.30],
      [8.40, 9.10, 10.20, 10.50, 11.30, 12.40, 14.40, 14.60, 12.90, 12.70, 9.60, 8.90],
    ),
  },
  {
    period: '01.01.2023 – 01.01.2024', category: 'Трансформатор T-5А', supplier: 'Все поставщики',
    kpiProcurement: { volume: '304,60', avgPrice: '10 040', priceGrowth: '+5,90', suppliers: '18' },
    kpiConcentration: { top3: '60,30', hhi: '1 640', top1dep: '28,10' },
    monthlyData: md(
      [20.30, 21.70, 25.80, 24.40, 28.30, 31.00, 32.90, 36.60, 32.60, 29.70, 23.40, 18.20],
      [21.40, 22.60, 25.10, 25.50, 27.40, 30.00, 34.40, 35.30, 31.40, 30.90, 24.70, 20.90],
    ),
  },
]

export function findPreset(period, category, supplier) {
  let p = PRESETS.find(x => x.period === period && x.category === category && x.supplier === supplier)
  if (p) return p
  p = PRESETS.find(x => x.category === category && x.supplier === supplier)
  if (p) return p
  p = PRESETS.find(x => x.category === category && x.supplier === 'Все поставщики')
  if (p) return p
  p = PRESETS.find(x => x.category === category)
  if (p) return p
  return PRESETS[0]
}
