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

function Section({ accentColor = ACCENT, title, subtitle, children, palette }) {
  return (
    <section
      className="overflow-hidden rounded-[30px]"
      style={{
        background: palette.panelStrong,
        border: `1px solid ${palette.border}`,
        boxShadow: `${palette.glow}, ${palette.inset}`,
        backdropFilter: 'blur(18px)',
      }}
    >
      <div className="px-6 pb-2 pt-5 md:px-8 md:pt-6">
        <div className="flex items-center gap-3">
          <div className="h-7 w-[3px] rounded-full" style={{ background: accentColor, boxShadow: `0 0 18px ${accentColor}` }} />
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

function InputRow({ label, value, onChange, suffix, prefix, note, palette, isDark, optional }) {
  const [localValue, setLocalValue] = useState(String(value))
  const isFocused = useRef(false)

  useEffect(() => {
    if (!isFocused.current) setLocalValue(String(value))
  }, [value])

  return (
    <div className="grid grid-cols-1 gap-3 py-6 md:grid-cols-[1fr_190px] md:items-center" style={{ borderBottom: `1px solid ${palette.borderSoft}` }}>
      <div>
        <div className="flex items-center gap-3">
          <div className="text-[22px] font-medium tracking-[-0.02em] md:text-[24px]" style={{ color: palette.text }}>{label}</div>
          {optional && (
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(5,5,5,0.05)', color: palette.textSoft }}>
              optional
            </span>
          )}
        </div>
        {note ? <div className="mt-2 max-w-2xl text-sm leading-6" style={{ color: palette.textSoft }}>{note}</div> : null}
      </div>
      <div className="relative">
        {prefix ? <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-medium" style={{ color: palette.textSoft }}>{prefix}</span> : null}
        <input
          type="number"
          value={localValue}
          onFocus={() => { isFocused.current = true }}
          onChange={(e) => { setLocalValue(e.target.value); onChange(e.target.value) }}
          onBlur={(e) => { isFocused.current = false; onChange(e.target.value); setLocalValue(String(value)) }}
          className={`h-[64px] w-full rounded-[18px] text-right text-[26px] font-semibold tracking-[-0.03em] outline-none transition ${prefix ? 'pl-10' : 'pl-5'} ${suffix ? 'pr-12' : 'pr-5'}`}
          style={{
            background: palette.bgSecondary,
            border: `1px solid ${palette.border}`,
            color: palette.text,
            boxShadow: isDark ? 'inset 0 1px 0 rgba(255,255,255,0.04)' : 'inset 0 1px 0 rgba(255,255,255,0.85)',
          }}
        />
        {suffix ? <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-medium" style={{ color: palette.textSoft }}>{suffix}</span> : null}
      </div>
    </div>
  )
}

function MetricRow({ label, value, valueClassName, palette, sublabel }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4" style={{ borderBottom: `1px solid ${palette.borderSoft}` }}>
      <div>
        <div className="text-[22px] tracking-[-0.02em]" style={{ color: palette.textMuted }}>{label}</div>
        {sublabel && <div className="text-sm mt-0.5" style={{ color: palette.textSoft }}>{sublabel}</div>}
      </div>
      <div className={`text-right text-[28px] font-semibold tracking-[-0.04em] shrink-0 ${valueClassName || ''}`} style={!valueClassName ? { color: palette.text } : undefined}>
        {value}
      </div>
    </div>
  )
}

function BigStatCard({ label, value, sublabel, color, palette, isDark }) {
  const c = color || ACCENT
  return (
    <div
      className="rounded-[24px] p-6 flex flex-col"
      style={{
        background: palette.bgSecondary,
        border: `1px solid ${palette.border}`,
        boxShadow: isDark ? 'inset 0 1px 0 rgba(255,255,255,0.03)' : 'inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      <div className="text-sm font-bold uppercase tracking-[0.12em]" style={{ color: palette.textSoft }}>{label}</div>
      <div className="mt-4 text-4xl font-bold tracking-[-0.04em]" style={{ color: c }}>{value}</div>
      {sublabel && <div className="mt-2 text-base" style={{ color: palette.textMuted }}>{sublabel}</div>}
    </div>
  )
}

export default function ScaleCalculator() {
  const accent = ACCENT
  const [theme, setTheme] = useState('dark')
  const isDark = theme === 'dark'

  const [avgJobValue, setAvgJobValue] = useState(350)
  const [grossMargin, setGrossMargin] = useState(65)
  const [repeatJobsPerYear, setRepeatJobsPerYear] = useState(2)
  const [leadsPerMonth, setLeadsPerMonth] = useState(40)
  const [closeRate, setCloseRate] = useState(30)
  const [adSpend, setAdSpend] = useState(1500)
  const [websiteConvRate, setWebsiteConvRate] = useState(0)
  const [setupFee, setSetupFee] = useState(997)
  const [monthlyFee, setMonthlyFee] = useState(297)
  const [leadLift, setLeadLift] = useState(25)
  const [closeLift, setCloseLift] = useState(20)

  const clamp = (v, min, max) => {
    const lo = min === undefined ? 0 : min
    const hi = max === undefined ? Infinity : max
    const n = Number(v)
    return isNaN(n) ? lo : Math.min(Math.max(n, lo), hi)
  }

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

  const gpPerJob = avgJobValue * (grossMargin / 100)
  const ltgp = gpPerJob * repeatJobsPerYear
  const custCurrent = leadsPerMonth * (closeRate / 100)
  const gpMonthCurrent = custCurrent * gpPerJob
  const cacCurrent = adSpend > 0 && custCurrent > 0 ? adSpend / custCurrent : null
  const ratioCurrent = cacCurrent !== null && ltgp > 0 ? ltgp / cacCurrent : null
  const leadsNew = leadsPerMonth * (1 + leadLift / 100)
  const closeRateNew = (closeRate / 100) * (1 + closeLift / 100)
  const custNew = leadsNew * closeRateNew
  const gpMonthNew = custNew * gpPerJob
  const extraCustomers = custNew - custCurrent
  const deltaGPMonth = gpMonthNew - gpMonthCurrent
  const cacNew = custNew > 0 ? (adSpend + monthlyFee) / custNew : null
  const ratioNew = cacNew !== null && ltgp > 0 ? ltgp / cacNew : null
  const returnMultiple = cacNew !== null && ltgp > 0 ? ltgp / cacNew : null
  const paybackMonths = deltaGPMonth > 0 ? (setupFee + monthlyFee) / deltaGPMonth : null
  const paybackWeeks = paybackMonths !== null ? paybackMonths * 4.33 : null
  const annualExtraProfit = deltaGPMonth * 12

  const verdictLevel = returnMultiple === null ? 'neutral' : returnMultiple < 2 ? 'red' : returnMultiple < 3 ? 'yellow' : 'green'

  const verdictColors = {
    red:     { bg: isDark ? 'rgba(136,19,55,0.22)' : 'rgba(251,113,133,0.10)',  border: isDark ? 'rgba(251,113,133,0.25)' : 'rgba(190,18,60,0.18)',   text: isDark ? '#FDA4AF' : '#BE123C', label: 'Not Worth It' },
    yellow:  { bg: isDark ? 'rgba(120,92,22,0.20)' : 'rgba(250,204,21,0.12)',   border: isDark ? 'rgba(250,204,21,0.25)'  : 'rgba(161,98,7,0.20)',    text: isDark ? '#FDE68A' : '#A16207', label: 'Break Even Territory' },
    green:   { bg: isDark ? 'rgba(111,230,0,0.10)' : 'rgba(111,230,0,0.10)',    border: isDark ? 'rgba(111,230,0,0.22)'   : 'rgba(111,230,0,0.25)',   text: isDark ? accent   : '#4D9B00', label: 'No-Brainer' },
    neutral: { bg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(5,5,5,0.03)',      border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(5,5,5,0.08)',       text: palette.textMuted,              label: 'Enter your numbers' },
  }
  const vc = verdictColors[verdictLevel]

  const verdictMessage = verdictLevel === 'neutral'
    ? 'Enter your numbers above to see your ROI.'
    : verdictLevel === 'red'
    ? "You shouldn't do this. Keep what you're doing."
    : verdictLevel === 'yellow'
    ? "Same-ish money, but we remove the admin headache."
    : `You make ${fmt(ltgp, 'currency')} for every ${cacNew !== null ? fmt(cacNew, 'currency') : '—'} you put in. This is a no-brainer.`

  function fmt(v, type, digits) {
    const d = digits === undefined ? 0 : digits
    const n = isFinite(v) ? v : 0
    if (type === 'currency') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: d, minimumFractionDigits: d }).format(n)
    if (type === 'pct') return n.toFixed(d === 0 ? 1 : d) + '%'
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: d, minimumFractionDigits: d }).format(n)
  }

  const p = { palette, isDark }

  return (
    <div className="min-h-screen" style={{ background: `${palette.pageGlow}, ${palette.bg}` }}>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">

        <div className="mb-8 rounded-[34px] p-6 md:p-8" style={{ background: palette.hero, border: `1px solid ${palette.border}`, boxShadow: `${palette.glow}, inset 0 1px 0 rgba(255,255,255,${isDark ? '0.05' : '0.85'})` }}>
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.24em]" style={{ background: isDark ? 'rgba(111,230,0,0.10)' : 'rgba(111,230,0,0.12)', border: `1px solid ${isDark ? 'rgba(111,230,0,0.22)' : 'rgba(111,230,0,0.24)'}`, color: isDark ? '#C9FF9F' : '#4D9B00' }}>
                Scale Automotive
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] md:text-6xl" style={{ color: palette.text }}>
                See your ROI before you decide.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 md:text-xl" style={{ color: palette.textMuted }}>
                Enter your shop's numbers. See exactly how much more profit our system creates, how fast you break even, and whether this is a no-brainer.
              </p>
            </div>
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="inline-flex h-14 items-center gap-3 self-start rounded-full px-5 text-sm font-semibold uppercase tracking-[0.14em] transition"
              style={{ background: palette.bgSecondary, border: `1px solid ${palette.border}`, color: palette.text, boxShadow: isDark ? 'inset 0 1px 0 rgba(255,255,255,0.04)' : 'inset 0 1px 0 rgba(255,255,255,0.92)' }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(5,5,5,0.05)' }}>
                {isDark ? <SunIcon /> : <MoonIcon />}
              </span>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>

        <div className="space-y-6">

          <Section title="Business Economics" subtitle="Your shop's core unit economics" {...p}>
            <InputRow {...p} label="Average job value" prefix="$" value={avgJobValue} onChange={(v) => setAvgJobValue(clamp(v, 1))} note="Blended average across tint, PPF, detailing, and any other services." />
            <InputRow {...p} label="Gross margin on an average job" suffix="%" value={grossMargin} onChange={(v) => setGrossMargin(clamp(v, 1, 99))} note="Revenue minus direct job costs (materials, labor). Not net profit." />
            <InputRow {...p} label="Repeat jobs per customer per year" suffix="x" value={repeatJobsPerYear} onChange={(v) => setRepeatJobsPerYear(clamp(v, 0.1))} note="How many times does the average customer come back in a 12-month window?" />
          </Section>

          <Section title="Your Current Funnel" subtitle="Where you are right now" accentColor="#FFC84A" {...p}>
            <InputRow {...p} label="Leads per month" value={leadsPerMonth} onChange={(v) => setLeadsPerMonth(clamp(v, 0))} note="All inbound leads across every source — Google, Instagram, referrals, walk-ins." />
            <InputRow {...p} label="Lead-to-job close rate" suffix="%" value={closeRate} onChange={(v) => setCloseRate(clamp(v, 0, 100))} note="What % of leads actually become paying jobs?" />
            <InputRow {...p} label="Monthly ad spend" prefix="$" value={adSpend} onChange={(v) => setAdSpend(clamp(v, 0))} note="Set to 0 if you don't run paid ads." />
            <InputRow {...p} label="Website conversion rate" suffix="%" value={websiteConvRate} onChange={(v) => setWebsiteConvRate(clamp(v, 0, 100))} note="% of website visitors who contact you. Leave at 0 if unknown." optional />
          </Section>

          <Section title="Scale Automotive Pricing" subtitle="What you're charging them" accentColor="#6BF6FF" {...p}>
            <InputRow {...p} label="Setup fee" prefix="$" value={setupFee} onChange={(v) => setSetupFee(clamp(v, 0))} />
            <InputRow {...p} label="Monthly fee" prefix="$" value={monthlyFee} onChange={(v) => setMonthlyFee(clamp(v, 0))} />
          </Section>

          <Section title="Improvement Assumptions" subtitle="Conservative estimates — you control these on the call" accentColor="#FFC84A" {...p}>
            <InputRow {...p} label="Expected lead lift from better site + reviews" suffix="%" value={leadLift} onChange={(v) => setLeadLift(clamp(v, 0, 500))} note="How many more leads from the same traffic? A better site + review system typically drives 20-40%." />
            <InputRow {...p} label="Expected close rate lift from better follow-up" suffix="%" value={closeLift} onChange={(v) => setCloseLift(clamp(v, 0, 200))} note="A CRM with automated follow-up typically closes 15-25% more leads. Be conservative." />
          </Section>

          <Section title="Per-Customer Economics" subtitle="What each customer is actually worth to you" {...p}>
            <MetricRow {...p} label="Gross profit per job" value={fmt(gpPerJob, 'currency')} />
            <MetricRow {...p} label="Lifetime gross profit (LTGP) per customer" value={fmt(ltgp, 'currency')} valueClassName="text-[#6FE600]" sublabel={`${fmt(gpPerJob, 'currency')} x ${repeatJobsPerYear} jobs/yr`} />
          </Section>

          <Section title="Your Current Monthly Performance" accentColor="#FFC84A" {...p}>
            <MetricRow {...p} label="Customers per month" value={custCurrent.toFixed(1)} />
            <MetricRow {...p} label="Monthly gross profit (new customers)" value={fmt(gpMonthCurrent, 'currency')} />
            <MetricRow {...p} label="Customer acquisition cost (CAC)" value={cacCurrent !== null ? fmt(cacCurrent, 'currency') : '—'} sublabel={cacCurrent === null ? 'No ad spend entered' : undefined} />
            <MetricRow {...p} label="LTGP:CAC ratio"
              value={ratioCurrent !== null ? `${ratioCurrent.toFixed(1)}x` : '—'}
              sublabel={ratioCurrent === null ? 'Enter ad spend to calculate' : undefined}
              valueClassName={ratioCurrent === null ? undefined : ratioCurrent >= 3 ? 'text-[#6FE600]' : ratioCurrent >= 2 ? (isDark ? 'text-yellow-300' : 'text-yellow-700') : (isDark ? 'text-red-400' : 'text-red-700')}
            />
          </Section>

          <Section title="With Scale Automotive" subtitle="What your funnel looks like after we go live" accentColor="#6BF6FF" {...p}>
            <MetricRow {...p} label="New leads per month" value={leadsNew.toFixed(1)} sublabel={`+${leadLift}% lift from ${leadsPerMonth} current`} />
            <MetricRow {...p} label="New close rate" value={fmt(closeRateNew * 100, 'pct')} sublabel={`+${closeLift}% lift from ${closeRate}% current`} />
            <MetricRow {...p} label="Customers per month" value={custNew.toFixed(1)} valueClassName="text-[#6FE600]" />
            <MetricRow {...p} label="Monthly gross profit (new customers)" value={fmt(gpMonthNew, 'currency')} valueClassName="text-[#6FE600]" />
            <MetricRow {...p} label="Extra customers per month because of us" value={`+${extraCustomers.toFixed(1)}`} valueClassName="text-[#6FE600]" />
            <MetricRow {...p} label="Extra gross profit per month because of us" value={`+${fmt(deltaGPMonth, 'currency')}`} valueClassName="text-[#6FE600]" />
            {cacNew !== null && <MetricRow {...p} label="New CAC (including our fee)" value={fmt(cacNew, 'currency')} sublabel="Ad spend + monthly fee, divided by new customers" />}
            {ratioNew !== null && (
              <MetricRow {...p} label="New LTGP:CAC ratio"
                value={`${ratioNew.toFixed(1)}x`}
                valueClassName={ratioNew >= 3 ? 'text-[#6FE600]' : ratioNew >= 2 ? (isDark ? 'text-yellow-300' : 'text-yellow-700') : (isDark ? 'text-red-400' : 'text-red-700')}
              />
            )}
          </Section>

          <Section title="The Verdict" accentColor="#6BF6FF" {...p}>
            <div className="rounded-[26px] px-6 py-8 md:px-10 md:py-10 mb-6" style={{ background: vc.bg, border: `1px solid ${vc.border}` }}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-sm font-bold uppercase tracking-[0.2em] mb-2" style={{ color: vc.text, opacity: 0.7 }}>{vc.label}</div>
                  <div className="text-xl font-medium leading-8 max-w-xl" style={{ color: vc.text }}>{verdictMessage}</div>
                </div>
                {returnMultiple !== null && (
                  <div className="text-center shrink-0">
                    <div className="text-6xl font-bold tracking-[-0.06em] md:text-7xl" style={{ color: vc.text }}>{returnMultiple.toFixed(1)}x</div>
                    <div className="text-sm font-semibold uppercase tracking-[0.15em] mt-1" style={{ color: vc.text, opacity: 0.65 }}>return multiple</div>
                  </div>
                )}
              </div>
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
                  <div className="rounded-full py-1" style={{ background: isDark ? 'rgba(136,19,55,0.22)' : 'rgba(251,113,133,0.10)', color: isDark ? '#FDA4AF' : '#BE123C' }}>Under 2x — Don't do it</div>
                  <div className="rounded-full py-1" style={{ background: isDark ? 'rgba(120,92,22,0.18)' : 'rgba(250,204,21,0.12)', color: isDark ? '#FDE68A' : '#A16207' }}>2-3x — Borderline</div>
                  <div className="rounded-full py-1" style={{ background: isDark ? 'rgba(111,230,0,0.10)' : 'rgba(111,230,0,0.10)', color: isDark ? accent : '#4D9B00' }}>Over 3x — No-brainer</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <BigStatCard {...p} label="Extra profit per month" value={deltaGPMonth > 0 ? `+${fmt(deltaGPMonth, 'currency')}` : '—'} sublabel="vs. your current baseline" color={accent} />
              <BigStatCard {...p} label="Break-even" value={paybackWeeks !== null && paybackWeeks > 0 ? `${paybackWeeks.toFixed(1)} wks` : '—'} sublabel={paybackMonths !== null && paybackMonths > 0 ? `${paybackMonths.toFixed(1)} months` : 'Enter numbers above'} color={isDark ? '#6BF6FF' : '#0891B2'} />
              <BigStatCard {...p} label="Annual extra take-home" value={annualExtraProfit > 0 ? `+${fmt(annualExtraProfit, 'currency')}` : '—'} sublabel="extra gross profit per year" color={accent} />
              <BigStatCard {...p} label="For every $1 in ads + system" value={returnMultiple !== null ? `$${returnMultiple.toFixed(2)}` : '—'} sublabel="in lifetime gross profit" color={isDark ? '#6BF6FF' : '#0891B2'} />
            </div>

            <div className="pt-6 text-center text-sm" style={{ color: palette.textSoft }}>
              Return multiple = Lifetime Gross Profit (LTGP) / Customer Acquisition Cost (CAC)
            </div>
          </Section>

        </div>
      </div>
    </div>
  )
}
