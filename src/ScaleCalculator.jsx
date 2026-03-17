import { useEffect, useMemo, useRef, useState } from 'react'

const ACCENT = '#6FE600'

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

function Section({ accentColor, title, subtitle, children, palette }) {
  const ac = accentColor || ACCENT
  return (
    <section className="overflow-hidden rounded-[30px]" style={{ background: palette.panelStrong, border: `1px solid ${palette.border}`, boxShadow: `${palette.glow}, ${palette.inset}`, backdropFilter: 'blur(18px)' }}>
      <div className="px-6 pb-2 pt-5 md:px-8 md:pt-6">
        <div className="flex items-center gap-3">
          <div className="h-7 w-[3px] rounded-full" style={{ background: ac, boxShadow: `0 0 18px ${ac}` }} />
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.22em]" style={{ color: palette.textMuted }}>{title}</div>
            {subtitle ? <div className="mt-1 text-sm" style={{ color: palette.textSoft }}>{subtitle}</div> : null}
          </div>
        </div>
      </div>
      <div className="px-6 pb-6 md:px-8 md:pb-8">{children}</div>
    </section>
  )
}

function InputRow({ label, value, onChange, suffix, prefix, note, palette, isDark }) {
  const [localValue, setLocalValue] = useState(String(value))
  const isFocused = useRef(false)
  useEffect(() => { if (!isFocused.current) setLocalValue(String(value)) }, [value])
  return (
    <div className="grid grid-cols-1 gap-3 py-5 md:grid-cols-[1fr_180px] md:items-center" style={{ borderBottom: `1px solid ${palette.borderSoft}` }}>
      <div>
        <div className="text-[20px] font-medium tracking-[-0.02em] md:text-[22px]" style={{ color: palette.text }}>{label}</div>
        {note ? <div className="mt-1 max-w-2xl text-sm leading-6" style={{ color: palette.textSoft }}>{note}</div> : null}
      </div>
      <div className="relative">
        {prefix ? <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-medium" style={{ color: palette.textSoft }}>{prefix}</span> : null}
        <input
          type="number"
          value={localValue}
          onFocus={() => { isFocused.current = true }}
          onChange={(e) => { setLocalValue(e.target.value); onChange(e.target.value) }}
          onBlur={(e) => { isFocused.current = false; onChange(e.target.value); setLocalValue(String(value)) }}
          className={`h-[60px] w-full rounded-[16px] text-right text-[24px] font-semibold tracking-[-0.03em] outline-none transition ${prefix ? 'pl-10' : 'pl-5'} ${suffix ? 'pr-10' : 'pr-5'}`}
          style={{ background: palette.bgSecondary, border: `1px solid ${palette.border}`, color: palette.text, boxShadow: isDark ? 'inset 0 1px 0 rgba(255,255,255,0.04)' : 'inset 0 1px 0 rgba(255,255,255,0.85)' }}
        />
        {suffix ? <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-medium" style={{ color: palette.textSoft }}>{suffix}</span> : null}
      </div>
    </div>
  )
}

function ImprovementToggle({ value, onChange, palette, isDark }) {
  const options = ['Conservative', 'Typical', 'Strong']
  return (
    <div className="py-5" style={{ borderBottom: `1px solid ${palette.borderSoft}` }}>
      <div className="text-[20px] font-medium tracking-[-0.02em] md:text-[22px] mb-3" style={{ color: palette.text }}>Improvement level</div>
      <div className="text-sm mb-4" style={{ color: palette.textSoft }}>Controls how much we expect leads and close rate to improve</div>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="flex-1 rounded-[14px] py-3 text-sm font-bold uppercase tracking-[0.12em] transition"
            style={{
              background: value === opt ? ACCENT : palette.bgSecondary,
              border: `1px solid ${value === opt ? ACCENT : palette.border}`,
              color: value === opt ? '#050505' : palette.textMuted,
              boxShadow: value === opt ? `0 0 20px rgba(111,230,0,0.3)` : 'none',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ScaleCalculator() {
  const accent = ACCENT
  const [theme, setTheme] = useState('dark')
  const isDark = theme === 'dark'

  // Your Shop Today
  const [jobsPerMonth, setJobsPerMonth] = useState(30)
  const [leadsPerMonth, setLeadsPerMonth] = useState(60)
  const [avgJobValue, setAvgJobValue] = useState(350)
  const [grossMargin, setGrossMargin] = useState(65)
  const [adSpend, setAdSpend] = useState(1500)

  // Working With Us
  const [monthlyFee, setMonthlyFee] = useState(297)
  const [setupFee, setSetupFee] = useState(0)
  const [improvementLevel, setImprovementLevel] = useState('Typical')

  const clamp = (v, lo, hi) => {
    const n = Number(v)
    return isNaN(n) ? (lo || 0) : Math.min(Math.max(n, lo || 0), hi === undefined ? Infinity : hi)
  }

  // Improvement presets
  const presets = {
    Conservative: { leadLift: 0.15, closeLift: 0.10 },
    Typical:      { leadLift: 0.25, closeLift: 0.20 },
    Strong:       { leadLift: 0.40, closeLift: 0.30 },
  }
  const { leadLift, closeLift } = presets[improvementLevel]

  // Derived: current
  const closeRateCurrent = leadsPerMonth > 0 ? jobsPerMonth / leadsPerMonth : 0
  const gpPerJob = avgJobValue * (grossMargin / 100)
  const monthlyProfitCurrent = jobsPerMonth * gpPerJob
  const yearlyProfitCurrent = monthlyProfitCurrent * 12

  const leadsNew = Math.round(leadsPerMonth * (1 + leadLift))
  const closeRateNew = Math.min(closeRateCurrent * (1 + closeLift), 1)
  const jobsNew = leadsNew * closeRateNew
  const monthlyProfitNew = jobsNew * gpPerJob
  const yearlyProfitNew = monthlyProfitNew * 12

  // Verdict
  const deltaMonthly = monthlyProfitNew - monthlyProfitCurrent
  const deltaYearly = deltaMonthly * 12
  const totalCostPerMonth = adSpend + monthlyFee
  const cacNew = jobsNew > 0 ? totalCostPerMonth / jobsNew : null
  const ltgp = gpPerJob // simplified: single job LTGP (no repeat data in this spec)
  const returnMultiple = cacNew !== null && cacNew > 0 ? ltgp / cacNew : null
  const paybackMonths = deltaMonthly > 0 ? (setupFee + monthlyFee) / deltaMonthly : null
  const paybackWeeks = paybackMonths !== null ? paybackMonths * 4.33 : null
  const annualExtra = deltaMonthly * 12

  const palette = useMemo(() => ({
    bg: isDark ? '#050505' : '#FFFFFF',
    bgSecondary: isDark ? 'rgba(255,255,255,0.028)' : 'rgba(10,10,10,0.035)',
    panelStrong: isDark ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.98)',
    border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(5,5,5,0.10)',
    borderSoft: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(5,5,5,0.06)',
    text: isDark ? '#F5F7FA' : '#050505',
    textMuted: isDark ? 'rgba(245,247,250,0.72)' : 'rgba(5,5,5,0.62)',
    textSoft: isDark ? 'rgba(245,247,250,0.46)' : 'rgba(5,5,5,0.42)',
    glow: isDark ? '0 0 0 1px rgba(255,255,255,0.03), 0 30px 90px rgba(0,0,0,0.55)' : '0 0 0 1px rgba(5,5,5,0.04), 0 20px 60px rgba(5,5,5,0.08)',
    inset: isDark ? 'inset 0 1px 0 rgba(255,255,255,0.04)' : 'inset 0 1px 0 rgba(255,255,255,0.9)',
    hero: isDark
      ? 'radial-gradient(circle at top left, rgba(111,230,0,0.14), transparent 28%), radial-gradient(circle at top right, rgba(255,255,255,0.06), transparent 30%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))'
      : 'radial-gradient(circle at top left, rgba(111,230,0,0.12), transparent 28%), radial-gradient(circle at top right, rgba(111,230,0,0.08), transparent 30%), linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,250,0.98))',
    pageGlow: isDark
      ? 'radial-gradient(circle at top, rgba(111,230,0,0.11), transparent 22%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.05), transparent 18%)'
      : 'radial-gradient(circle at top, rgba(111,230,0,0.10), transparent 22%), radial-gradient(circle at 80% 0%, rgba(111,230,0,0.08), transparent 18%)',
  }), [isDark])

  const verdictLevel = returnMultiple === null ? 'neutral' : returnMultiple < 2 ? 'red' : returnMultiple < 3 ? 'yellow' : 'green'

  const vc = {
    red:     { bg: isDark ? 'rgba(136,19,55,0.22)' : 'rgba(251,113,133,0.10)', border: isDark ? 'rgba(251,113,133,0.25)' : 'rgba(190,18,60,0.18)', text: isDark ? '#FDA4AF' : '#BE123C', label: 'Not Worth It' },
    yellow:  { bg: isDark ? 'rgba(120,92,22,0.20)' : 'rgba(250,204,21,0.12)',  border: isDark ? 'rgba(250,204,21,0.25)'  : 'rgba(161,98,7,0.20)',  text: isDark ? '#FDE68A' : '#A16207', label: 'Borderline' },
    green:   { bg: isDark ? 'rgba(111,230,0,0.10)' : 'rgba(111,230,0,0.10)',   border: isDark ? 'rgba(111,230,0,0.22)'   : 'rgba(111,230,0,0.25)', text: isDark ? accent   : '#4D9B00', label: 'No-Brainer' },
    neutral: { bg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(5,5,5,0.03)',     border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(5,5,5,0.08)',     text: palette.textMuted, label: 'Enter your numbers' },
  }[verdictLevel]

  const verdictMessage = verdictLevel === 'neutral' ? 'Enter your numbers above to see your ROI.'
    : verdictLevel === 'red' ? "You shouldn't do this. Keep what you're doing."
    : verdictLevel === 'yellow' ? "Same-ish money, but we remove the admin headache."
    : `For every $1 you put into ads + our system, you get $${returnMultiple !== null ? returnMultiple.toFixed(2) : '—'} back in gross profit. This is a no-brainer.`

  function fmt(v, type, d) {
    const digits = d === undefined ? 0 : d
    const n = isFinite(v) ? v : 0
    if (type === 'currency') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n)
    if (type === 'pct') return (n * 100).toFixed(1) + '%'
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n)
  }

  const p = { palette, isDark }

  // Table cell styles
  const thStyle = { color: palette.textSoft, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', padding: '12px 16px', textAlign: 'right' }
  const thLabelStyle = { ...thStyle, textAlign: 'left' }
  const tdStyle = (highlight) => ({ color: highlight ? accent : palette.text, fontSize: '20px', fontWeight: 600, padding: '14px 16px', textAlign: 'right', borderTop: `1px solid ${palette.borderSoft}` })
  const tdLabelStyle = { color: palette.textMuted, fontSize: '18px', fontWeight: 500, padding: '14px 16px', borderTop: `1px solid ${palette.borderSoft}` }

  return (
    <div className="min-h-screen" style={{ background: `${palette.pageGlow}, ${palette.bg}` }}>
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">

        {/* Hero */}
        <div className="mb-8 rounded-[34px] p-6 md:p-8" style={{ background: palette.hero, border: `1px solid ${palette.border}`, boxShadow: `${palette.glow}, inset 0 1px 0 rgba(255,255,255,${isDark ? '0.05' : '0.85'})` }}>
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.24em]" style={{ background: isDark ? 'rgba(111,230,0,0.10)' : 'rgba(111,230,0,0.12)', border: `1px solid ${isDark ? 'rgba(111,230,0,0.22)' : 'rgba(111,230,0,0.24)'}`, color: isDark ? '#C9FF9F' : '#4D9B00' }}>
                Scale Automotive
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] md:text-5xl" style={{ color: palette.text }}>
                See your ROI before you decide.
              </h1>
              <p className="mt-3 text-lg leading-8" style={{ color: palette.textMuted }}>
                Your numbers. Our system. Here's exactly what changes.
              </p>
            </div>
            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="inline-flex h-12 items-center gap-3 self-start rounded-full px-5 text-sm font-semibold uppercase tracking-[0.14em] transition" style={{ background: palette.bgSecondary, border: `1px solid ${palette.border}`, color: palette.text }}>
              <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(5,5,5,0.05)' }}>
                {isDark ? <SunIcon /> : <MoonIcon />}
              </span>
              {isDark ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>

        <div className="space-y-6">

          {/* Section 1: Your Shop Today */}
          <Section title="Your Shop Today" subtitle="What your business looks like right now" {...p}>
            <InputRow {...p} label="Jobs per month" value={jobsPerMonth} onChange={(v) => setJobsPerMonth(clamp(v, 0))} note="How many paying jobs do you complete each month?" />
            <InputRow {...p} label="Leads per month" value={leadsPerMonth} onChange={(v) => setLeadsPerMonth(clamp(v, 0))} note="All inbound enquiries — calls, forms, DMs, walk-ins." />
            <div className="py-5" style={{ borderBottom: `1px solid ${palette.borderSoft}` }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[20px] font-medium" style={{ color: palette.text }}>Close rate</div>
                  <div className="text-sm mt-1" style={{ color: palette.textSoft }}>Calculated from jobs / leads above</div>
                </div>
                <div className="text-[28px] font-semibold" style={{ color: palette.textMuted }}>{fmt(closeRateCurrent, 'pct')}</div>
              </div>
            </div>
            <InputRow {...p} label="Average job value" prefix="$" value={avgJobValue} onChange={(v) => setAvgJobValue(clamp(v, 1))} note="Blended average across tint, PPF, detailing, and any other services." />
            <InputRow {...p} label="Gross margin %" suffix="%" value={grossMargin} onChange={(v) => setGrossMargin(clamp(v, 1, 99))} note="Revenue minus direct costs (materials, labor). Not net." />
            <div className="py-5" style={{ borderBottom: `1px solid ${palette.borderSoft}` }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[20px] font-medium" style={{ color: palette.text }}>Gross profit per job</div>
                  <div className="text-sm mt-1" style={{ color: palette.textSoft }}>Calculated from job value x margin</div>
                </div>
                <div className="text-[28px] font-semibold" style={{ color: accent }}>{fmt(gpPerJob, 'currency')}</div>
              </div>
            </div>
            <InputRow {...p} label="Monthly ad spend" prefix="$" value={adSpend} onChange={(v) => setAdSpend(clamp(v, 0))} note="Set to 0 if you don't run paid ads." />
          </Section>

          {/* Section 2: Working With Us */}
          <Section title="Working With Us" subtitle="What you pay, and what we expect to improve" accentColor="#FFC84A" {...p}>
            <InputRow {...p} label="Monthly fee" prefix="$" value={monthlyFee} onChange={(v) => setMonthlyFee(clamp(v, 0))} />
            <InputRow {...p} label="Setup fee" prefix="$" value={setupFee} onChange={(v) => setSetupFee(clamp(v, 0))} note="One-time. Default $0." />
            <ImprovementToggle value={improvementLevel} onChange={setImprovementLevel} {...p} />
            <div className="mt-4 rounded-[16px] p-4" style={{ background: palette.bgSecondary, border: `1px solid ${palette.borderSoft}` }}>
              <div className="text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: palette.textSoft }}>What this level assumes</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-sm" style={{ color: palette.textSoft }}>Lead lift</div>
                  <div className="text-2xl font-bold mt-1" style={{ color: accent }}>+{(leadLift * 100).toFixed(0)}%</div>
                  <div className="text-xs mt-0.5" style={{ color: palette.textSoft }}>more leads, same traffic</div>
                </div>
                <div>
                  <div className="text-sm" style={{ color: palette.textSoft }}>Close rate lift</div>
                  <div className="text-2xl font-bold mt-1" style={{ color: accent }}>+{(closeLift * 100).toFixed(0)}%</div>
                  <div className="text-xs mt-0.5" style={{ color: palette.textSoft }}>more leads converted</div>
                </div>
              </div>
            </div>
          </Section>

          {/* Section 3: Volume Comparison Table */}
          <Section title="Volume" subtitle="Side-by-side: where you are vs. where you'll be" accentColor="#6BF6FF" {...p}>
            {/* Comparison table */}
            <div className="overflow-hidden rounded-[20px]" style={{ border: `1px solid ${palette.border}` }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: palette.bgSecondary }}>
                    <th style={thLabelStyle}>Metric</th>
                    <th style={thStyle}>Current</th>
                    <th style={{ ...thStyle, color: accent }}>+ ScaleAuto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdLabelStyle}>Leads / mo</td>
                    <td style={tdStyle(false)}>{fmt(leadsPerMonth, 'number', 0)}</td>
                    <td style={tdStyle(true)}>{fmt(leadsNew, 'number', 0)}</td>
                  </tr>
                  <tr>
                    <td style={tdLabelStyle}>Jobs / mo</td>
                    <td style={tdStyle(false)}>{fmt(jobsPerMonth, 'number', 0)}</td>
                    <td style={tdStyle(true)}>{fmt(jobsNew, 'number', 1)}</td>
                  </tr>
                  <tr>
                    <td style={tdLabelStyle}>Monthly profit</td>
                    <td style={tdStyle(false)}>{fmt(monthlyProfitCurrent, 'currency')}</td>
                    <td style={tdStyle(true)}>{fmt(monthlyProfitNew, 'currency')}</td>
                  </tr>
                  <tr>
                    <td style={tdLabelStyle}>Yearly profit</td>
                    <td style={tdStyle(false)}>{fmt(yearlyProfitCurrent, 'currency')}</td>
                    <td style={tdStyle(true)}>{fmt(yearlyProfitNew, 'currency')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* Section 4: Verdict */}
          <Section title="The Verdict" accentColor="#6BF6FF" {...p}>

            {/* Color band */}
            <div className="rounded-[26px] px-6 py-8 md:px-10 md:py-10 mb-6" style={{ background: vc.bg, border: `1px solid ${vc.border}` }}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="text-sm font-bold uppercase tracking-[0.2em] mb-2" style={{ color: vc.text, opacity: 0.7 }}>{vc.label}</div>
                  <div className="text-xl font-medium leading-8 max-w-lg" style={{ color: vc.text }}>{verdictMessage}</div>
                </div>
                {returnMultiple !== null && (
                  <div className="text-center shrink-0">
                    <div className="text-6xl font-bold tracking-[-0.06em] md:text-7xl" style={{ color: vc.text }}>{returnMultiple.toFixed(1)}x</div>
                    <div className="text-sm font-semibold uppercase tracking-[0.15em] mt-1" style={{ color: vc.text, opacity: 0.65 }}>return multiple</div>
                  </div>
                )}
              </div>
              {/* Progress bar */}
              <div className="mt-8">
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(5,5,5,0.08)' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{
                    width: returnMultiple !== null ? `${Math.min((returnMultiple / 7) * 100, 100)}%` : '0%',
                    background: verdictLevel === 'green' ? `linear-gradient(90deg, rgba(111,230,0,0.6), ${accent})` : verdictLevel === 'yellow' ? 'linear-gradient(90deg, rgba(250,204,21,0.6), #FACC15)' : 'linear-gradient(90deg, rgba(251,113,133,0.6), #FB7185)',
                  }} />
                </div>
                <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: palette.textSoft }}>
                  <span>0x</span><span>1x</span><span>2x</span><span>3x</span><span>4x</span><span>5x</span><span>6x</span><span>7x+</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase tracking-[0.12em]">
                  <div className="rounded-full py-1.5" style={{ background: isDark ? 'rgba(136,19,55,0.22)' : 'rgba(251,113,133,0.10)', color: isDark ? '#FDA4AF' : '#BE123C' }}>Under 2x — Don't do it</div>
                  <div className="rounded-full py-1.5" style={{ background: isDark ? 'rgba(120,92,22,0.18)' : 'rgba(250,204,21,0.12)', color: isDark ? '#FDE68A' : '#A16207' }}>2–3x — Borderline</div>
                  <div className="rounded-full py-1.5" style={{ background: isDark ? 'rgba(111,230,0,0.10)' : 'rgba(111,230,0,0.10)', color: isDark ? accent : '#4D9B00' }}>Over 3x — No-brainer</div>
                </div>
              </div>
            </div>

            {/* 4 stat cards */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {[
                { label: 'Extra profit / month', value: deltaMonthly > 0 ? `+${fmt(deltaMonthly, 'currency')}` : '—', color: accent },
                { label: 'Annual extra take-home', value: annualExtra > 0 ? `+${fmt(annualExtra, 'currency')}` : '—', color: accent },
                { label: 'Break-even', value: paybackWeeks !== null && paybackWeeks > 0 ? `${paybackWeeks.toFixed(1)} wks` : '—', sub: paybackMonths !== null && paybackMonths > 0 ? `${paybackMonths.toFixed(1)} months` : null, color: isDark ? '#6BF6FF' : '#0891B2' },
                { label: 'For every $1 in ads + system', value: returnMultiple !== null ? `$${returnMultiple.toFixed(2)}` : '—', sub: 'in gross profit', color: isDark ? '#6BF6FF' : '#0891B2' },
              ].map((card) => (
                <div key={card.label} className="rounded-[20px] p-5 flex flex-col" style={{ background: palette.bgSecondary, border: `1px solid ${palette.border}` }}>
                  <div className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: palette.textSoft }}>{card.label}</div>
                  <div className="mt-3 text-[28px] font-bold tracking-[-0.03em]" style={{ color: card.color }}>{card.value}</div>
                  {card.sub && <div className="mt-1 text-sm" style={{ color: palette.textMuted }}>{card.sub}</div>}
                </div>
              ))}
            </div>

            <div className="pt-5 text-center text-sm" style={{ color: palette.textSoft }}>
              Return multiple = Gross Profit per Job / Customer Acquisition Cost (CAC)
            </div>
          </Section>

        </div>
      </div>
    </div>
  )
}
