"use client"
import React, {useEffect, useRef, useState} from 'react'
import styles from './redalert.module.css'

export default function RedAlertPage(){
  const formRef = useRef<HTMLFormElement | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const [dark, setDark] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(()=>{
    const stored = typeof window !== 'undefined' ? localStorage.getItem('redalert-dark') : null
    if(stored === 'true') setDark(true)
  },[])

  useEffect(()=>{
    if(dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    try{ localStorage.setItem('redalert-dark', String(dark)) }catch(e){}
  },[dark])

  function handleStart(e: React.MouseEvent){
    e.preventDefault()
    setShowQuestions(true)
  }

  // when questions are revealed, scroll to them smoothly
  useEffect(()=>{
    if(showQuestions){
      sectionRef.current?.scrollIntoView({behavior:'smooth'})
    }
  },[showQuestions])

  function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    // show non-blocking success banner instead of alert
    setSubmitted(true)
    formRef.current?.reset()
    sectionRef.current?.scrollIntoView({behavior:'smooth'})
  }

  // auto-hide toast after 4 seconds
  useEffect(()=>{
    if(!submitted) return
    const t = setTimeout(()=> setSubmitted(false), 4000)
    return ()=> clearTimeout(t)
  },[submitted])

  // Pagination state: two pages of 6 questions each
  const [step, setStep] = useState(0) // 0 => first 6, 1 => second 6

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
    {label: 'Strongly agree', value: 'strongly_agree'},
    {label: 'Agree', value: 'agree'},
    {label: 'Somewhat agree', value: 'somewhat_agree'},
    {label: 'Disagree', value: 'disagree'},
    {label: 'Strongly disagree', value: 'strongly_disagree'}
  ]

  function nextPage(e: React.MouseEvent<HTMLButtonElement>){
    e.preventDefault()
    e.stopPropagation()
    if(step < 1) setStep(s => s + 1)
    // hide any toast when navigating
    setSubmitted(false)
    setTimeout(()=> sectionRef.current?.scrollIntoView({behavior:'smooth'}), 50)
  }

  function prevPage(e: React.MouseEvent<HTMLButtonElement>){
    e.preventDefault()
    e.stopPropagation()
    if(step > 0) setStep(s => s - 1)
    setSubmitted(false)
    setTimeout(()=> sectionRef.current?.scrollIntoView({behavior:'smooth'}), 50)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>RedAlert</h1>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span className={styles.modeLabel} aria-hidden>{dark ? 'Dark' : 'Light'}</span>
            <button
              className={styles.iconBtn}
              onClick={()=>setDark(d=>!d)}
              aria-pressed={dark}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={dark ? 'Light mode' : 'Dark mode'}
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        <div className={styles.hero}>
          <p className={styles.lead}>A short assessment to help identify potential relationship red flags. This is not a diagnosis—just a quick checklist to raise awareness.</p>
          <a href="#questionnaire" onClick={handleStart} className={styles.startBtn}>Start Assessment</a>
        </div>
      </header>

      <main className={styles.container}>
        {showQuestions && (
          <section id="questionnaire" ref={sectionRef} className={styles.questionnaire}>
          <h2>Relationship Red Flags — Quick Assessment</h2>
          <p className={styles.intro}>For each statement below, choose the option that best matches your experience.</p>
          <div className={styles.stepDots} aria-hidden="false">
            {[0,1].map(i => (
              <button
                key={i}
                type="button"
                onClick={()=>setStep(i)}
                className={i === step ? styles.dotActive : styles.dot}
                aria-current={i === step}
                aria-label={`Go to step ${i+1}`}
              />
            ))}
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
            {submitted && (
              <div role="status" aria-live="polite" className={styles.successBanner}>
                <span>Assessment submitted successfully</span>
                <button aria-label="Dismiss" className={styles.toastClose} onClick={()=>setSubmitted(false)}>×</button>
              </div>
            )}
            <div className={styles.questions}>
              {questions.slice(step * 6, step * 6 + 6).map((q, idx)=>{
                const qIndex = step * 6 + idx + 1
                return (
                  <fieldset className={styles.question} key={qIndex}>
                    <legend>{qIndex}. {q}</legend>
                    <div>
                      {options.map(opt=> (
                        <label key={opt.value}>
                          <input type="radio" name={`q${qIndex}`} value={opt.value} /> {opt.label}
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

      <footer className={styles.footer}><small>RedAlert — awareness tool. If you are in immediate danger, contact local emergency services.</small></footer>
    </div>
  )
}
