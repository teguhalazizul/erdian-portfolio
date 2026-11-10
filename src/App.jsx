import { useRef, useState } from 'react'
import { motion, MotionConfig, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform } from 'framer-motion'
import { profile, stats, experience, skills, education } from './data.js'

const rise = { hidden: { y: '115%' }, show: (i) => ({ y: 0, transition: { delay: 0.15 + i * 0.045, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } }) }

function BigName({ text, offset = 0 }) {
  return (
    <span className="line" aria-label={text}>
      {[...text].map((c, i) => (
        <span className="mask" key={i} aria-hidden="true">
          <motion.span className="ch" variants={rise} initial="hidden" animate="show" custom={i + offset}>{c}</motion.span>
        </span>
      ))}
    </span>
  )
}

function Hero() {
  const ref = useRef(null)
  const mx = useMotionValue(0), my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-1, 1], [6, -6]), { stiffness: 120, damping: 14 })
  const ry = useSpring(useTransform(mx, [-1, 1], [-8, 8]), { stiffness: 120, damping: 14 })
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
    my.set(((e.clientY - r.top) / r.height) * 2 - 1)
    ref.current.style.setProperty('--x', e.clientX - r.left + 'px')
    ref.current.style.setProperty('--y', e.clientY - r.top + 'px')
  }
  return (
    <header className="hero" ref={ref} onMouseMove={move}>
      <div className="glow" />
      <div className="hero-text">
        <h1><BigName text="Erdian" /><BigName text="Aditiarna" offset={6} /></h1>
        <motion.p className="role" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
          IT Specialist and System Engineer in Batam, Indonesia.
        </motion.p>
        <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>{profile.summary}</motion.p>
        <motion.div className="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <a className="btn solid" href={`mailto:${profile.email}`}>Email me</a>
          <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">View LinkedIn</a>
        </motion.div>
      </div>
      <motion.div className="photo" style={{ rotateX: rx, rotateY: ry }} initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1, ease: [0.2, 0.8, 0.2, 1] }}>
        <div className="plate" />
        <img src="/profile.png" alt="Portrait of Erdian Aditiarna in a black suit and sunglasses" />
      </motion.div>
    </header>
  )
}

function Marquee() {
  const words = ['Microsoft 365', 'Intune', 'Networking', 'Mikrotik', 'Linux', 'Python', 'CCTV', 'ServiceNow', 'VMware', 'SharePoint']
  const row = [...words, ...words]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">{row.map((w, i) => <span key={i}>{w}</span>)}</div>
    </div>
  )
}

function Stats() {
  return (
    <section className="stats">
      {stats.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
          <b>{s.value}</b><span>{s.label}</span>
        </motion.div>
      ))}
    </section>
  )
}

function Experience() {
  const ref = useRef(null)
  const [open, setOpen] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 22 })
  return (
    <section id="experience" className="light" ref={ref}>
      <h2>Where I have worked</h2>
      <div className="timeline">
        <div className="rail"><motion.div className="fill" style={{ scaleY: line }} /></div>
        {experience.map((e, i) => (
          <div className="job" key={e.company}>
            <span className={'dot' + (open === i ? ' on' : '')} />
            <button className="job-head" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              <span className="when">{e.period}</span>
              <strong>{e.role}</strong>
              <em>{e.company}</em>
              <span className="plus">{open === i ? '–' : '+'}</span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}>
                  {e.points.map((p) => <li key={p}>{p}</li>)}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills">
      <h2>What I work with</h2>
      <div className="skill-grid">
        {skills.map((g, i) => (
          <motion.div className="skill" key={g.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <h3>{g.title}</h3>
            <div className="chips">{g.items.map((s) => <span key={s}>{s}</span>)}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Education() {
  return (
    <section id="education" className="light">
      <h2>Education</h2>
      <div className="edu">
        {education.map((e) => (
          <div key={e.school}>
            <span className="when">{e.period}</span>
            <strong>{e.school}</strong>
            <p>{e.degree}{e.note ? `. ${e.note}` : ''}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <footer id="contact">
      <h2>Need IT that just works?</h2>
      <a className="mail" href={`mailto:${profile.email}`}>{profile.email}</a>
      <div className="meta">
        <a href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}>{profile.phone}</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <span>{profile.location}</span>
      </div>
    </footer>
  )
}

export default function App() {
  const { scrollYProgress } = useScroll()
  return (
    <MotionConfig reducedMotion="user">
      <motion.div className="progress" style={{ scaleX: scrollYProgress }} />
      <nav>
        <a href="#top" className="logo">EA</a>
        <div><a href="#experience">Experience</a><a href="#skills">Skills</a><a href="#education">Education</a><a href="#contact">Contact</a></div>
      </nav>
      <main id="top">
        <Hero /><Marquee /><Stats /><Experience /><Skills /><Education />
      </main>
      <Contact />
    </MotionConfig>
  )
}
