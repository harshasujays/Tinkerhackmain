"use client"
import React, { useEffect, useState, useMemo } from "react"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Label,
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip 
} from 'recharts'
import styles from "../redalert.module.css"

export default function RedAlertResultsPage() {
  const [dark, setDark] = useState(false)
  const [risk, setRisk] = useState(0)
  const [flag, setFlag] = useState<"black" | "red" | "green">("green")
  const [description, setDescription] = useState("")
  const [emergencyTips, setEmergencyTips] = useState<string[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])

  const scoreMap = useMemo(() => ({
    strongly_agree: 5,
    agree: 4,
    somewhat_agree: 3,
    disagree: 2,
    strongly_disagree: 1
  }), [])

  useEffect(() => {
    const storedDark = typeof window !== "undefined" ? localStorage.getItem("redalert-dark") : null
    if (storedDark === "true") setDark(true)
  }, [])

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [dark])

  useEffect(() => {
    const storedAnswers = typeof window !== "undefined" ? sessionStorage.getItem("redalert-answers") : null
    
    if (storedAnswers) {
      const answers: Record<number, string> = JSON.parse(storedAnswers)
      
      const categories = {
        "Respect": [1, 3, 11],
        "Control": [2, 4, 12],
        "Privacy": [6, 7, 9],
        "Manipulation": [5, 8, 10]
      }

      let totalScore = 0
      const bData = Object.entries(categories).map(([name, indices]) => {
        let catScore = 0
        indices.forEach(idx => {
          const answerKey = answers[idx] as keyof typeof scoreMap
          const s = scoreMap[answerKey] || 1
          catScore += s
          totalScore += s
        });
        return { name, score: Math.round((catScore / 15) * 100) }
      })

      const riskPercent = Math.round((totalScore / 60) * 100)
      setRisk(riskPercent)
      setCategoryData(bData)

      if (riskPercent >= 80) {
        setFlag("black")
        setDescription("CRITICAL RISK LEVEL. Your partner demonstrates severe red-flag behaviors. Immediate action is recommended: prioritize your safety.")
        setEmergencyTips([
          "🚨 IMMEDIATE SAFETY: Leave if you feel in danger",
          "📞 National DV Hotline: 1-800-799-7233",
          "📱 Text START to 88788",
          "🏥 Seek medical attention if injured",
          "🏠 Develop a safety plan immediately",
          "⚠️ Trust your instincts: they are usually right",
          "🗣️ Set firm boundaries regarding respect",
          "👥 Reach out to a trusted friend today"
        ])
      } else if (riskPercent >= 50) {
        setFlag("red")
        setDescription("MODERATE-TO-HIGH RISK. Your partner exhibits multiple concerning behaviors that suggest potential issues with emotional safety.")
        setEmergencyTips([
          "⚠️ Trust your instincts: they are usually right",
          "📞 Call 1-800-799-7233 for safety advice",
          "👥 Reach out to a trusted friend today",
          "🗣️ Set firm boundaries regarding respect"
        ])
      } else {
        setFlag("green")
        setDescription("EXCELLENT FOUNDATION. Your partner demonstrates strong, healthy relationship behaviors and genuine respect.")
        setEmergencyTips([])
      }
    }
  }, [scoreMap])

  const handleRetake = () => {
    sessionStorage.removeItem("redalert-answers")
    window.location.href = "/redalert"
  }

  const accentColor = flag === "black" ? (dark ? "#ffffff" : "#000000") : flag === "red" ? "#ef4444" : "#22c55e"
  const cardBackground = dark ? "rgba(30, 30, 35, 0.95)" : "rgba(255, 255, 255, 0.95)"
  const textColor = dark ? "#e5e7eb" : "#1f2937"
  const borderColor = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"

  const pieData = [
    { name: 'Risk Factors', value: risk },
    { name: 'Healthy Factors', value: 100 - risk }
  ]

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>RedAlert</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className={styles.themeToggle} onClick={() => setDark(!dark)}>
              <span className={styles.toggleTrack}>
                <span className={styles.toggleKnob}>{dark ? "🪵" : "🌸"}</span>
              </span>
            </button>
            <span style={{ fontWeight: 600, fontSize: "0.9rem", color: textColor }}>
              {dark ? "Masculine" : "Feminine"}
            </span>
          </div>
        </div>
      </header>

      <main className={styles.container} style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", 
          gap: "40px", 
          marginTop: "28px",
          marginBottom: "40px" 
        }}>
          
          {/* ENHANCED PIE SECTION */}
          <section style={{ 
            background: cardBackground, borderRadius: "32px", border: `1px solid ${borderColor}`, 
            padding: "30px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(10px)", minHeight: 400
          }}>
            <h3 style={{ fontSize: "0.8rem", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.5, marginBottom: "10px", color: textColor }}>Relationship Composition</h3>
            
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie 
                  data={pieData} 
                  innerRadius={75} 
                  outerRadius={100} 
                  paddingAngle={8} 
                  cornerRadius={12} 
                  dataKey="value" 
                  isAnimationActive={true}
                >
                  <Cell fill={accentColor} stroke="none" />
                  <Cell fill={dark ? "#333" : "#eee"} stroke="none" />
                  <Label 
                    value={`${risk}%`} 
                    position="center" 
                    fill={textColor} 
                    style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'inherit' }} 
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Content-Rich Legend/Data */}
            <div style={{ width: '100%', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: textColor }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: accentColor }} /> 
                        Unhealthy Patterns
                    </span>
                    <span style={{ fontWeight: 700 }}>{risk}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: textColor }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: dark ? "#333" : "#eee" }} /> 
                        Safety & Respect
                    </span>
                    <span style={{ fontWeight: 700 }}>{100 - risk}%</span>
                </div>
                <div style={{ height: '1px', background: borderColor, margin: '8px 0' }} />
                <p style={{ fontSize: '0.75rem', opacity: 0.6, textAlign: 'center', fontStyle: 'italic', color: textColor }}>
                    {risk > 50 ? "High concentration of red flag behaviors detected." : "Healthy dynamics are prominent in this assessment."}
                </p>
            </div>
          </section>

          {/* HERO ASSESSMENT */}
          <section style={{ 
            background: cardBackground, borderRadius: "32px", border: `2px solid ${accentColor}`, 
            padding: "30px", textAlign: "center", display: "flex", flexDirection: "column", 
            justifyContent: "center", boxShadow: `0 20px 50px ${accentColor}20`, minHeight: 400 
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "10px" }}>
                {flag === "black" ? "🏴" : flag === "red" ? "🚩" : "💚"}
            </div>
            <h2 style={{ color: accentColor, fontWeight: 900, fontSize: "2rem", margin: 0 }}>{flag.toUpperCase()} FLAG</h2>
            <div style={{ fontSize: "5rem", fontWeight: 900, color: accentColor, lineHeight: 1, margin: "10px 0" }}>
                {risk}%
            </div>
            <p style={{ fontSize: "0.95rem", color: textColor, lineHeight: 1.5, opacity: 0.8 }}>{description}</p>
          </section>

        </div>

        {/* EMERGENCY RESOURCES */}
        {emergencyTips.length > 0 && (
          <section style={{ 
            background: flag === "black" ? "rgba(0,0,0,0.05)" : "rgba(239, 68, 68, 0.05)",
            borderRadius: "32px", padding: "40px", border: `1px solid ${accentColor}30`,
            marginBottom: "40px"
          }}>
            <h2 style={{ textAlign: "center", color: accentColor, fontSize: "1.2rem", letterSpacing: "2px", marginBottom: "30px" }}>RESOURCES & SAFETY PLAN</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {emergencyTips.map((tip, idx) => (
                <div key={idx} style={{ 
                  background: cardBackground, padding: "20px", borderRadius: "18px", 
                  border: `1px solid ${borderColor}`, fontSize: "0.9rem", color: textColor,
                  lineHeight: 1.4
                }}>
                  {tip}
                </div>
              ))}
            </div>
          </section>
        )}

        <div style={{ textAlign: "center", paddingBottom: "60px" }}>
            <button className={styles.submit} onClick={handleRetake} style={{ padding: "16px 60px", borderRadius: "100px", fontWeight: 800 }}>
                Retake Assessment
            </button>
        </div>
      </main>
    </div>
  )
}