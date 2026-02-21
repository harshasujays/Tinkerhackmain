"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './redalert.module.css'

export default function RedAlertPage() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const pageEffectRef = useRef<HTMLDivElement | null>(null)

function triggerPageConfetti() {
  const container = pageEffectRef.current
  if (!container) {
    console.log("No container found")
    return
  }

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement("div")
    piece.className = styles.pageConfetti

    piece.style.left = `${Math.random() * 100}vw`
    piece.style.top = `${Math.random() * 100}vh`
    piece.style.background = `hsl(${Math.random() * 40 + 300},70%,75%)`
    piece.style.width = "8px"
    piece.style.height = "12px"

    container.appendChild(piece)

    setTimeout(() => {
      piece.remove()
    }, 2000)
  }
}
function triggerPageAura() {
  const container = pageEffectRef.current
  if (!container) return

  const aura = document.createElement('div')
  aura.className = styles.pageAura
  container.appendChild(aura)

  setTimeout(() => aura.remove(), 900)
}
  const effectRef = useRef<HTMLDivElement | null>(null)

function triggerConfetti() {
  const container = effectRef.current
  if (!container) return

  for (let i = 0; i < 12; i++) {
    const piece = document.createElement('div')
    piece.className = styles.confettiPiece
    piece.style.left = `${Math.random() * 50}px`
    piece.style.background = `hsl(${Math.random() * 40 + 300},70%,75%)`
    container.appendChild(piece)

    setTimeout(() => piece.remove(), 900)
  }
}

function triggerAura() {
  const container = effectRef.current
  if (!container) return

  const aura = document.createElement('div')
  aura.className = styles.aura
  container.appendChild(aura)

  setTimeout(() => aura.remove(), 600)
}
  const [dark, setDark] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)

  // Pagination state: two pages of 6 questions each
  const [currentIndex, setCurrentIndex] = useState(0) // 0 => first 6, 1 => second 6

  // answers stored by question index (1-based)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  // Dark mode from localStorage
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('redalert-dark') : null
    if (stored === 'true') setDark(true)
  }, [])

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    try { localStorage.setItem('redalert-dark', String(dark)) } catch (e) { }
  }, [dark])

  function handleStart(e: React.MouseEvent) {
  e.preventDefault()

  if (dark) triggerPageAura()
  else triggerPageConfetti()

  setShowQuestions(true)
}

  // scroll to questions when revealed
  useEffect(() => {
    if (showQuestions) {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [showQuestions])

  function handleAnswer(qIndex: number, value: string) {
    setAnswers(prev => ({ ...prev, [qIndex]: value }))
  }

  const questions: string[] = [
    'I feel my feelings are dismissed or minimized by my partner.',
    "My partner tries to control who I spend time with or isolates me.",
    'I experience frequent criticism that undermines my self-worth.',
    'Decisions about me or our relationship are often made without my input.',
    'There are regular hostile arguments or yelling in our interactions.',
    'My privacy is invaded (e.g., checking my phone or messages) without permission.',
    'My personal boundaries are ignored or not respected by my partner.',
    'My partner uses guilt, threats, or manipulation to get their way.',
    'I have been pressured into sexual or intimate situations I was uncomfortable with.',
    'I feel anxious or on-edge before interacting with my partner.',
    'My partner denies or minimizes hurtful behaviors when I bring them up.',
    'My partner frequently humiliates or embarrasses me, privately or publicly.'
  ]

  const options = [
    { label: 'Strongly agree', value: 'strongly_agree' },
    { label: 'Agree', value: 'agree' },
    { label: 'Somewhat agree', value: 'somewhat_agree' },
    { label: 'Disagree', value: 'disagree' },
    { label: 'Strongly disagree', value: 'strongly_disagree' }
  ]


 function handleSubmit(e: React.FormEvent) {
  e.preventDefault()

  if (dark) triggerPageAura()
  else triggerPageConfetti()

  setTimeout(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redalert-answers', JSON.stringify(answers))
      router.push('/result')
    }
  }, 600)
}
function triggerModeAura(isDark: boolean) {
  const container = pageEffectRef.current
  if (!container) return

  const aura = document.createElement("div")
  aura.className = isDark
    ? styles.masculineModeAura
    : styles.feminineModeAura

  container.appendChild(aura)

  setTimeout(() => aura.remove(), 700)
}
const q = questions[currentIndex]
const qIndex = currentIndex + 1
  return (
    <div className={styles.page}>
      <div className={styles.bgDecor} aria-hidden></div>
      <div ref={pageEffectRef} className={styles.pageEffectLayer}></div>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>RedAlert</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  <div className={styles.toggleWrapper}>
    <button
      className={styles.themeToggle}
      onClick={() => {
  setDark(d => {
    const next = !d
    triggerModeAura(next)
    return next
  })
}}
      aria-pressed={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
    >
      <span className={styles.toggleTrack}>
        <span className={styles.toggleKnob}>
          {dark ? '🪵' : '🌸'}
        </span>
      </span>
    </button>

    <div ref={effectRef} className={styles.effectContainer}></div>
  </div>

  <span className={styles.modeLabel} aria-hidden>
    {dark ? 'Masculine' : 'Feminine'}
  </span>
</div>
        </div>

        <div className={styles.hero}>
          <p className={styles.brandTag}>RedAlert</p>

<h1 className={styles.heroTitle}>
  Are You Missing <span>Red Flags</span>?
</h1>

<p className={styles.heroSub}>
  A 2-minute private relationship check. No judgment. No data stored.
</p>

<button onClick={handleStart} className={styles.startBtn}>
  Start My Check
</button> </div>

        <div className={styles.reassurance} aria-hidden>
          <span className={styles.badge}>
            <span className={styles.iconWrap} aria-hidden>
              <span className={styles.femIcon}>💗</span>
              <span className={styles.masIcon}>🔒</span>
            </span>
            This tool is private and judgment-free.
          </span>

          <span className={styles.badge}>
            <span className={styles.iconWrap} aria-hidden>
              <span className={styles.femIcon}>🌸</span>
              <span className={styles.masIcon}>💪🏼</span>
            </span>
            Your answers are not stored.
          </span>
        </div>
      </header>

      <main className={styles.container}>
  {showQuestions && (
    <section
      id="questionnaire"
      ref={sectionRef}
      className={styles.questionnaire}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <fieldset className={styles.question}>
  
  <div className={styles.questionHeader}>
    <span className={styles.questionNumber}>
      Question {qIndex} of {questions.length}
    </span>

    <h3 className={styles.questionText}>
      {q}
    </h3>
  </div>

  <div className={styles.options}>
    {options.map(opt => (
      <label key={opt.value} className={styles.optionItem}>
        <input
          type="radio"
          name={`q${qIndex}`}
          value={opt.value}
          checked={answers[qIndex] === opt.value}
          onChange={() => handleAnswer(qIndex, opt.value)}
        />
        <span>{opt.label}</span>
      </label>
    ))}
  </div>

  <div className={styles.cardActions}>
    {currentIndex > 0 && (
      <button
        type="button"
        className={styles.backBtn}
        onClick={() => setCurrentIndex(i => i - 1)}
      >
        Back
      </button>
    )}

    {currentIndex < questions.length - 1 ? (
      <button
        type="button"
        className={styles.nextBtn}
        onClick={() => setCurrentIndex(i => i + 1)}
        disabled={!answers[qIndex]}
      >
        Next
      </button>
    ) : (
      <button
        type="submit"
        className={styles.nextBtn}
        disabled={!answers[qIndex]}
      >
        Submit
      </button>
    )}
  </div>

</fieldset>
      </form>
    </section>
  )}
</main>

<footer className={styles.footer}>
  <small>
    RedAlert — awareness tool. If you are in
    immediate danger, contact local emergency services.
  </small>
</footer>

         </div>
  )
}
