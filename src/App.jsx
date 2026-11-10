import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { motion, MotionConfig, AnimatePresence, animate, useInView, useScroll, useSpring, useMotionValue, useTransform } from 'framer-motion'
import { profile, ui, stats, marquee, experience, skills, education } from './data.js'

const Lang = createContext('en')
const useLang = () => useContext(Lang)
const ease = [0.2, 0.8, 0.2, 1]

function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 300, damping: 28 }), sy = useSpring(y, { stiffness: 300, damping: 28 })
  const [big, setBig] = useState(false)
  useEffect(() => {
    const m = (e) => { x.set(e.clientX); y.set(e.clientY); setBig(!!e.target.closest('a,button,.skill')) }
    window.addEventListener('mousemove', m)
    return () => window.removeEventListener('mousemove', m)
  }, [])
  return <motion.div className="cursor" style={{ x: sx, y: sy }} animate={{ scale: big ? 2.6 : 1 }} />
}

function Magnetic({ children }) {
  const ref = useRef(null)
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 }), y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 })
  const move = (e) => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * 0.3); y.set((e.clientY - r.top - r.height / 2) * 0.4) }
  return <motion.span ref={ref} style={{ x, y, display: 'inline-block' }} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0) }}>{children}</motion.span>
}

function Words({ text, as: Tag = 'h2' }) {
  return (
    <Tag className="words" aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span className="mask" key={i} aria-hidden="true">
          <motion.span className="ch" initial={{ y: '110%', rotate: 6 }} whileInView={{ y: 0, rotate: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.07, duration: 0.8, ease }}>{w}&nbsp;</motion.span>
        </span>
      ))}
    </Tag>
  )
}

function Counter({ n, suffix = '', dec = 0 }) {
  const ref = useRef(null), inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => { if (inView) animate(0, n, { duration: 1.8, ease, onUpdate: (l) => setV(l) }) }, [inView])
  return <b ref={ref}>{v.toFixed(dec)}{suffix}</b>
}

function Nav({ lang, setLang }) {
  const t = ui[lang]
  const ids = ['experience', 'skills', 'education', 'contact']
  return (
    <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8, ease }}>
      <a href="#top" className="logo">EA</a>
      <div className="links">{ids.map((id, i) => <a key={id} href={`#${id}`}>{t.nav[i]}</a>)}</div>
      <div className="lang" role="group" aria-label="Language">
        {['en', 'id'].map((l) => (
          <button key={l} onClick={() => { setLang(l); localStorage.setItem('lang', l) }} aria-pressed={lang === l} className={lang === l ? 'on' : ''}>
            {lang === l && <motion.span layoutId="pill" className="pill" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
            <span>{l === 'en' ? 'EN' : 'ID'}</span>
          </button>
        ))}
      </div>
    </motion.nav>
  )
}

function Hero() {
  const lang = useLang(), t = ui[lang]
  const ref = useRef(null), boot = useRef(true)
  const [ri, setRi] = useState(0)
  const mx = useMotionValue(0), my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-1, 1], [6, -6]), { stiffness: 120, damping: 14 })
  const ry = useSpring(useTransform(mx, [-1, 1], [-8, 8]), { stiffness: 120, damping: 14 })
  const { scrollY } = useScroll()
  const py = useTransform(scrollY, [0, 600], [0, 90])
  useEffect(() => { const a = setTimeout(() => (boot.current = false), 2500), b = setInterval(() => setRi((i) => (i + 1) % 4), 2600); return () => { clearTimeout(a); clearInterval(b) } }, [])
  const d = (n) => (boot.current ? n : 0)
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1); my.set(((e.clientY - r.top) / r.height) * 2 - 1)
    ref.current.style.setProperty('--x', e.clientX - r.left + 'px'); ref.current.style.setProperty('--y', e.clientY - r.top + 'px')
  }
  const name = (txt, off) => (
    <span className="line" aria-label={txt}>{[...txt].map((c, i) => (
      <span className="mask" key={i} aria-hidden="true"><motion.span className="ch" initial={{ y: '115%' }} animate={{ y: 0 }} transition={{ delay: 0.3 + (i + off) * 0.05, duration: 0.9, ease }}>{c}</motion.span></span>
    ))}</span>
  )
  return (
    <header className="hero" ref={ref} onMouseMove={move}>
      <div className="blob b1" /><div className="blob b2" /><div className="glow" />
      <div className="hero-text">
        <h1>{name('Erdian', 0)}{name('Aditiarna', 6)}</h1>
        <motion.div key={lang} className="swap" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d(1.2), duration: 0.6 }}>
          <p className="role">{t.intro}{' '}
            <span className="rotor"><AnimatePresence mode="wait"><motion.span key={ri} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ duration: 0.4, ease }}>{t.roles[ri]}</motion.span></AnimatePresence></span>
          </p>
          <p className="lead">{t.lead}</p>
          <div className="cta">
            <Magnetic><a className="btn solid" href={`mailto:${profile.email}`}>{t.email}</a></Magnetic>
            <Magnetic><a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">{t.linkedin}</a></Magnetic>
          </div>
        </motion.div>
      </div>
      <motion.div className="photo-wrap" style={{ y: py }}>
        <motion.div className="photo" style={{ rotateX: rx, rotateY: ry }} initial={{ opacity: 0, y: 80, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.6, duration: 1.1, ease }}>
          <div className="plate" />
          <svg className="badge" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="c" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs><text><textPath href="#c">{t.badge}</textPath></text><circle cx="60" cy="60" r="6" /></svg>
          <img src="/profile.png" alt="Portrait of Erdian Aditiarna in a black suit and sunglasses" />
          {['Microsoft 365', 'Intune', 'Mikrotik'].map((c, i) => <span key={c} className={`fchip f${i}`}>{c}</span>)}
        </motion.div>
      </motion.div>
    </header>
  )
}

function Marquee() {
  const row = [...marquee, ...marquee]
  return (
    <div className="marquees" aria-hidden="true">
      <div className="marquee"><div className="track">{row.map((w, i) => <span key={i}>{w}</span>)}</div></div>
      <div className="marquee alt"><div className="track rev">{row.map((w, i) => <span key={i}>{w}</span>)}</div></div>
    </div>
  )
}

function Stats() {
  const t = ui[useLang()]
  return (
    <section className="stats">
      {stats.map((s, i) => (
        <motion.div className="stat" key={i} initial={{ opacity: 0, y: 40, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.7, ease }}>
          <Counter {...s} /><span>{t.stats[i]}</span>
        </motion.div>
      ))}
    </section>
  )
}

function Experience() {
  const lang = useLang(), t = ui[lang]
  const ref = useRef(null), [open, setOpen] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 22 })
  return (
    <section id="experience" className="light" ref={ref}>
      <Words text={t.exp} />
      <div className="timeline">
        <div className="rail"><motion.div className="fill" style={{ scaleY: line }} /></div>
        {experience.map((e, i) => (
          <motion.div className="job" key={e.company} initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.7, ease }}>
            <span className={'dot' + (open === i ? ' on' : '')} />
            <button className="job-head" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              <span className="when">{e.period[lang]}</span><strong>{e.role[lang]}</strong><em>{e.company}</em>
              <motion.span className="plus" animate={{ rotate: open === i ? 45 : 0 }}>+</motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }}>
                  {e.points[lang].map((p, k) => <motion.li key={p} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + k * 0.07 }}>{p}</motion.li>)}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Skills() {
  const lang = useLang(), t = ui[lang]
  const spot = (e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', e.clientX - r.left + 'px'); e.currentTarget.style.setProperty('--my', e.clientY - r.top + 'px') }
  return (
    <section id="skills">
      <Words text={t.skills} />
      <div className="skill-grid">
        {skills.map((g, i) => (
          <motion.div className="skill" key={i} onMouseMove={spot} initial={{ opacity: 0, y: 50, rotateX: -12 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.8, ease }}>
            <h3>{g.title[lang]}</h3>
            <div className="chips">{g.items[lang].map((s, k) => (
              <motion.span key={s} initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + k * 0.05, type: 'spring', stiffness: 300, damping: 18 }}>{s}</motion.span>
            ))}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Education() {
  const lang = useLang(), t = ui[lang]
  return (
    <section id="education" className="light">
      <Words text={t.edu} />
      <div className="edu">
        {education.map((e, i) => (
          <motion.div className="edu-card" key={e.school} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.7, ease }} whileHover={{ y: -6 }}>
            <span className="when">{e.period}</span><strong>{e.school}</strong>
            <p>{e.degree[lang]}{e.note ? `. ${e.note[lang]}` : ''}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  const t = ui[useLang()]
  return (
    <footer id="contact">
      <Words text={t.cta} />
      <Magnetic><a className="mail" href={`mailto:${profile.email}`}>{profile.email}</a></Magnetic>
      <div className="meta">
        <a href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}>{profile.phone}</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <span>{profile.location}</span>
      </div>
    </footer>
  )
}

export default function App() {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('lang') || (navigator.language.startsWith('id') ? 'id' : 'en') } catch { return 'en' } })
  const { scrollYProgress } = useScroll()
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  return (
    <Lang.Provider value={lang}>
      <MotionConfig reducedMotion="user">
        <Cursor />
        <motion.div className="progress" style={{ scaleX: scrollYProgress }} />
        <Nav lang={lang} setLang={setLang} />
        <main id="top">
          <Hero />
          <Marquee />
          <div key={lang} className="swap-in"><Stats /><Experience /><Skills /><Education /></div>
        </main>
        <Contact key={'c' + lang} />
      </MotionConfig>
    </Lang.Provider>
  )
}
