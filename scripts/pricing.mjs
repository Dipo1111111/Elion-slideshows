// scripts/pricing.mjs — Monte Carlo unit-economics + conversion model for Elion pricing.
// Run: node scripts/pricing.mjs
// No dependencies. 100k iterations per pricing structure.
//
// Answers, with distributions instead of point guesses:
//   - What does ONE slideshow cost us (LLM + Apify + egress + buffer)?
//   - What does ONE user cost us per month at N slideshows?
//   - Given 10,000 visitors/mo, what are the odds a visitor becomes a payer,
//     how many payers accumulate, and is the structure profitable?
//   - Which anchor price maximizes users vs profit (price-elastic conversion)?

const RUNS = 100000

/* ------------------------------ samplers ------------------------------ */
function randNorm() {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}
function gammaSample(shape) {
  if (shape < 1) {
    const u = Math.random()
    return gammaSample(shape + 1) * Math.pow(u, 1 / shape)
  }
  const d = shape - 1 / 3
  const c = 1 / Math.sqrt(9 * d)
  for (;;) {
    let x = 0, v = 0
    do { x = randNorm(); v = 1 + c * x } while (v <= 0)
    v = v * v * v
    const u = Math.random()
    if (u < 1 - 0.0331 * x * x * x * x) return d * v
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v
  }
}
function betaSample(a, b) {
  const x = gammaSample(a), y = gammaSample(b)
  return x / (x + y)
}
function dirichlet(alphas) {
  const gs = alphas.map((a) => gammaSample(a))
  const sum = gs.reduce((a, b) => a + b, 0)
  return gs.map((g) => g / sum)
}
const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x))
const lognorm = (median, sigma) => Math.exp(Math.log(median) + sigma * randNorm())

/* --------------------------- cost model (USD) ------------------------- */
// Per 1 slideshow:
//   LLM: flash-class on OpenRouter, ~800 in / ~400 out tokens per slideshow,
//     batched 3/call. gemini-flash ~$0.30/M in + $2.50/M out ≈ $0.0011;
//     flash-lite ~$0.075/$0.30 ≈ $0.00014. Median ~$0.0005.
//   Apify Pinterest search actor, pooled (~40 images → ~15 slideshows): ~$0.0003.
//   Egress + storage (5 backgrounds ≈ 6 MB egress per slideshow): ~$0.0006.
const COST_PER_SLIDE = { median: 0.0015, sigma: 0.5, lo: 0.0004, hi: 0.005 }

// Fixed overhead / mo (Render web service + Supabase paid + domain + misc)
const FIXED = { median: 40, sigma: 0.5, lo: 15, hi: 200 }

/* ------------------------------- funnel ------------------------------- */
const VISITORS = { median: 10000, sigma: 0.4 } // lognormal around 10k/mo
const SIGNUP_RATE = { a: 2.5, b: 97.5 }        // visitors → signups (beta, mean 2.5%)
const CONV19 = { a: 2, b: 80 }                 // signups → paid at a $19 anchor (beta, ~2.4%)
const ELASTICITY = { mean: 1.1, sd: 0.35 }     // conversion(p) = conv19·(19/p)^e
const CHURN = { mean: 0.08, sd: 0.02, lo: 0.02, hi: 0.2 } // monthly churn → lifetime = 1/churn
const USAGE = { sigma: 0.4 }                   // per-user usage multiplier noise
const ANNUAL_MIX = 0.3                         // share of subscribers on annual billing
const LS_PCT = 0.05, LS_FLAT = 0.5             // Lemon Squeezy fees (5% + $0.50)

/* ----------------------------- structures ----------------------------- */
const STRUCTURES = [
  {
    name: 'A  Free + Pro $19           (2 plans, as-locked)',
    paid: [{ name: 'Pro', price: 19, cap: 100, baseUsage: 22 }],
    mixAlpha: [1],
    entry: 19,
    annualFactor: 0.42, // $99/yr = 57% off the $19 list (legacy, inconsistent)
    tierBump: 1.0,
  },
  {
    name: 'B  Free + Creator $19 + Studio $49   (RECOMMENDED)',
    paid: [
      { name: 'Creator', price: 19, cap: 100, baseUsage: 22 },
      { name: 'Studio', price: 49, cap: 500, baseUsage: 90 },
    ],
    mixAlpha: [1.4, 0.6], // ~70% Creator / 30% Studio
    entry: 19,
    annualFactor: 0.9, // $190/yr = 10 months (17% off)
    tierBump: 1.12,
  },
  {
    name: 'C  Free + Starter $9 + Creator $19 + Studio $39',
    paid: [
      { name: 'Starter', price: 9, cap: 30, baseUsage: 10 },
      { name: 'Creator', price: 19, cap: 100, baseUsage: 22 },
      { name: 'Studio', price: 39, cap: 500, baseUsage: 90 },
    ],
    mixAlpha: [0.5, 1.3, 0.6],
    entry: 9,
    annualFactor: 0.9,
    tierBump: 1.18,
  },
  {
    name: 'D  Free + Creator $29 + Studio $59   (premium positioning)',
    paid: [
      { name: 'Creator', price: 29, cap: 100, baseUsage: 22 },
      { name: 'Studio', price: 59, cap: 500, baseUsage: 90 },
    ],
    mixAlpha: [1.4, 0.6],
    entry: 29,
    annualFactor: 0.9,
    tierBump: 1.12,
  },
]

function simulateStructure(st) {
  const payingUsers = [], gross = [], profit = [], odds = []
  const nPaid = st.paid.length
  for (let i = 0; i < RUNS; i++) {
    const visitors = lognorm(VISITORS.median, VISITORS.sigma)
    const signups = visitors * betaSample(SIGNUP_RATE.a, SIGNUP_RATE.b)

    const conv19 = betaSample(CONV19.a, CONV19.b)
    const e = clamp(randNorm() * ELASTICITY.sd + ELASTICITY.mean, 0.6, 1.8)
    const conv = conv19 * Math.pow(19 / st.entry, e) * st.tierBump
    const newPayer = signups * conv
    odds.push(newPayer / visitors)

    const churn = clamp(randNorm() * CHURN.sd + CHURN.mean, CHURN.lo, CHURN.hi)
    const users = newPayer * (1 / churn)
    payingUsers.push(users)

    const costPerSlide = clamp(lognorm(COST_PER_SLIDE.median, COST_PER_SLIDE.sigma), COST_PER_SLIDE.lo, COST_PER_SLIDE.hi)
    const fixed = clamp(lognorm(FIXED.median, FIXED.sigma), FIXED.lo, FIXED.hi)

    const mix = dirichlet(st.mixAlpha)
    let arpu = 0, usageCost = 0
    for (let t = 0; t < nPaid; t++) {
      const tier = st.paid[t]
      const share = mix[t]
      const usage = Math.min(tier.baseUsage * lognorm(1, USAGE.sigma), tier.cap)
      arpu += share * tier.price * (ANNUAL_MIX * st.annualFactor + (1 - ANNUAL_MIX))
      usageCost += share * usage * costPerSlide
    }

    const g = arpu * users
    const fees = LS_PCT * g + LS_FLAT * users
    profit.push(g - fees - usageCost * users - fixed)
    gross.push(g)
  }
  const P = (arr, p) => {
    const s = [...arr].sort((a, b) => a - b)
    return s[Math.floor((p / 100) * s.length)]
  }
  return {
    users: [P(payingUsers, 10), P(payingUsers, 50), P(payingUsers, 90)],
    gross: [P(gross, 10), P(gross, 50), P(gross, 90)],
    profit: [P(profit, 10), P(profit, 50), P(profit, 90)],
    odds: [P(odds, 10), P(odds, 50), P(odds, 90)],
    pProfit: profit.filter((p) => p > 0).length / RUNS,
    pUsers50: payingUsers.filter((u) => u >= 50).length / RUNS,
    pUsers100: payingUsers.filter((u) => u >= 100).length / RUNS,
    pUsers200: payingUsers.filter((u) => u >= 200).length / RUNS,
  }
}

/* ------------------------------- output ------------------------------- */
const money = (x) => (x >= 1000 ? '$' + (x / 1000).toFixed(1) + 'k' : '$' + Math.round(x))
const pct = (x) => (x * 100).toFixed(1) + '%'

console.log('=== ELION PRICING MODEL — Monte Carlo, ' + RUNS.toLocaleString() + ' runs/structure ===\n')

console.log('Deterministic cost model (per 1 slideshow):')
console.log('  LLM (flash-class, batched 3/call)   ~$0.0005   (lite $0.0001 - flash $0.0011)')
console.log('  Apify Pinterest (pooled ~15/slide)  ~$0.0003')
console.log('  Egress + storage (~6 MB)            ~$0.0006')
console.log('  Buffer/misc                         ~$0.0001')
console.log('  TOTAL median                        ~$0.0015/slideshow  (p10 $0.0005 - p90 $0.0040)\n')

console.log('Per-user variable cost / mo at median cost/slide:')
for (const n of [3, 10, 30, 100, 500]) {
  console.log('  ' + String(n).padStart(4) + ' slideshows/mo  ~$' + (n * COST_PER_SLIDE.median).toFixed(2) +
    '   (worst-case p90 ~$' + (n * COST_PER_SLIDE.hi).toFixed(2) + ')')
}
console.log('\nFixed overhead ~$40/mo (range $15-200). Lemon Squeezy 5% + $0.50/charge.\n')

console.log('Funnel: 10k visitors/mo x ~2.5% signups x ~2.4% paid conversion = ~6 new payers/mo;')
console.log('x ~12.5 mo lifetime = ~75 paying steady-state.\n')

console.log('PER-STRUCTURE RESULTS (medians; p10 - p90 in parens)')
console.log('structure'.padEnd(42), 'payers'.padEnd(12), 'gross'.padEnd(10), 'profit'.padEnd(10), 'P>0', 'P≥100')
for (const st of STRUCTURES) {
  const r = simulateStructure(st)
  const [u10, u50, u90] = r.users
  const [g10, g50, g90] = r.gross
  const [p10, p50, p90] = r.profit
  console.log(
    st.name.padEnd(42),
    money(u50).padEnd(12),
    money(g50).padEnd(10),
    money(p50).padEnd(10),
    pct(r.pProfit).padEnd(6),
    pct(r.pUsers100),
  )
  console.log(
    ' '.padEnd(42),
    ('[' + Math.round(u10) + '-' + Math.round(u90) + ']').padEnd(12),
    ('[' + money(g10) + '-' + money(g90) + ']').padEnd(10),
    ('[' + money(p10) + '-' + money(p90) + ']'),
  )
}
console.log('\nOdds that a single visitor becomes a payer (median, p10-p90):')
for (const st of STRUCTURES) {
  const r = simulateStructure(st)
  console.log('  ' + st.name.trim().split(/\s+/)[0], pct(r.odds[1]), '  [' + pct(r.odds[0]) + ' - ' + pct(r.odds[2]) + ']')
}

console.log('\nANCHOR-PRICE SWEEP (single paid tier, annual = 10 months):')
console.log('price'.padEnd(8), 'payers'.padEnd(10), 'gross'.padEnd(10), 'profit'.padEnd(10), 'P>0', 'P≥100')
for (const price of [9, 12, 15, 19, 25, 29, 39]) {
  const st = {
    name: price + '',
    paid: [{ name: 'Pro', price, cap: 100, baseUsage: 22 }],
    mixAlpha: [1],
    entry: price,
    annualFactor: 0.9,
    tierBump: 1.0,
  }
  const r = simulateStructure(st)
  console.log(
    ('$' + price).padEnd(8),
    money(r.users[1]).padEnd(10),
    money(r.gross[1]).padEnd(10),
    money(r.profit[1]).padEnd(10),
    pct(r.pProfit).padEnd(6),
    pct(r.pUsers100),
  )
}
