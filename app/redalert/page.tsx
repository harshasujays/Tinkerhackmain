"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './redalert.module.css'

export default function RedAlertPage() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const [dark, setDark] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)

  // Pagination state: two pages of 6 questions each
  const [step, setStep] = useState(0) // 0 => first 6, 1 => second 6

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

  function nextPage(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
    if (step < 1) setStep(s => s + 1)
    setTimeout(() => sectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  function prevPage(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
    if (step > 0) setStep(s => s - 1)
    setTimeout(() => sectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Navigate to result page with answers
    // We can pass answers as query params or via sessionStorage/localStorage for simplicity
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redalert-answers', JSON.stringify(answers))
      router.push('/result') // your RedAlertResult.tsx should be at pages/result.tsx
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgDecor} aria-hidden></div>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>RedAlert</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className={styles.themeToggle}
              onClick={() => setDark(d => !d)}
              aria-pressed={dark}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={dark ? 'Light mode' : 'Dark mode'}
            >
              <span className={styles.toggleTrack}>
                <span className={styles.toggleKnob} aria-hidden>{dark ? '🪵' : '🌸'}</span>
              </span>
            </button>
            <span className={styles.modeLabel} aria-hidden>{dark ? 'Masculine' : 'Feminine'}</span>
          </div>
        </div>

        <div className={styles.hero}>
          <p className={styles.lead}>A short assessment to help identify potential relationship red flags. This is not a diagnosis—just a quick checklist to raise awareness.</p>
          <p className={styles.supportText}>You deserve clarity and emotional safety in every relationship.</p>
          <a href="#questionnaire" onClick={handleStart} className={styles.startBtn}>Start Assessment</a>
        </div>

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
          <section id="questionnaire" ref={sectionRef} className={styles.questionnaire}>
            <h2>Relationship Red Flags — Quick Assessment</h2>
            <p className={styles.intro}>For each statement below, choose the option that best matches your experience.</p>

            <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.questions}>
                {questions.slice(step * 6, step * 6 + 6).map((q, idx) => {
                  const qIndex = step * 6 + idx + 1
                  return (
                    <fieldset className={styles.question} key={qIndex} style={{ ['--i' as any]: idx }}>
                      <legend>{qIndex}. {q}</legend>
                      <div>
                        {options.map(opt => (
                          <label key={opt.value}>
                            <input
                              type="radio"
                              name={`q${qIndex}`}
                              value={opt.value}
                              checked={answers[qIndex] === opt.value}
                              onChange={() => handleAnswer(qIndex, opt.value)}
                            /> {opt.label}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  )
                })}
              </div>

              <div className={styles.actions}>
                <div className={styles.pager}>
                  {step > 0 && <button type="button" className={styles.prevBtn} onClick={prevPage}>Previous</button>}
                  {step < 1 ? (
                    <button type="button" className={styles.nextBtn} onClick={nextPage}>Next</button>
                  ) : (
                    <button type="submit" className={styles.submit}>Submit Assessment</button>
                  )}
                </div>
              </div>
            </form>
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <small>RedAlert — awareness tool. If you are in immediate danger, contact local emergency services.</small>
      </footer>
    </div>
  )
}