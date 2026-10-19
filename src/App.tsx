import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import { supabase } from './lib/supabase'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './pages/ProtectedRoute'
import './App.css'


// type Game = {
//   id: number
//   title: string
//   platform: Platform
//   category: string
//   description: string
//   status: 'In Development' | 'Playable' | 'Released'
//   visits: number
//   peakCCU: number
//   featured: boolean
// }


// type Game = {
//   id: string
//   title: string
//   platform: 'Roblox' | 'Unreal'
//   category: string
//   description: string
//   status: 'In Development' | 'Shipped'
//   visits: number
//   peakCCU: number
//   image_url: string | null
//   featured_slot: number | null
// }



type Platform = 'Roblox' | 'Unreal'

type Game = {
  id: string
  title: string
  platform: Platform
  category: string
  description: string
  status: 'In Development' | 'Shipped'
  visits: number
  peakCCU: number
  image_url: string | null
  featured_slot: number | null
  other_project_slot: number | null
}



// const featuredGames: Game[] = [
//   { id: 1, title: "Bee's Game @1", platform: 'Roblox', category: 'Simulator', description: 'A sample game entry for your featured Roblox projects.', status: 'In Development', visits: 0, peakCCU: 0, featured: true },
//   { id: 2, title: "Bee's Game @2", platform: 'Roblox', category: 'Adventure', description: 'Another placeholder waiting for your next creation.', status: 'In Development', visits: 0, peakCCU: 0, featured: true },
//   { id: 3, title: "Bee's Game @3", platform: 'Roblox', category: 'Strategy', description: 'A third featured project, ready for its real content.', status: 'In Development', visits: 0, peakCCU: 0, featured: true },
//   { id: 4, title: "Bee's Game @4", platform: 'Unreal', category: 'Action', description: 'A placeholder for an Unreal Engine project.', status: 'In Development', visits: 0, peakCCU: 0, featured: true },
//   { id: 5, title: "Bee's Game @5", platform: 'Unreal', category: 'Exploration', description: 'A second Unreal project placeholder.', status: 'In Development', visits: 0, peakCCU: 0, featured: true },
//   { id: 6, title: "Bee's Game @6", platform: 'Unreal', category: 'Experimental', description: 'A third Unreal project placeholder.', status: 'In Development', visits: 0, peakCCU: 0, featured: true },
// ]

// const otherProjects: Game[] = [
//   { id: 7, title: "Bee's Project @7", platform: 'Roblox', category: 'Prototype', description: 'A small experiment worth showing.', status: 'In Development', visits: 0, peakCCU: 0, featured: false },
//   { id: 8, title: "Bee's Project @8", platform: 'Roblox', category: 'Gameplay', description: 'A gameplay experiment in progress.', status: 'In Development', visits: 0, peakCCU: 0, featured: false },
//   { id: 9, title: "Bee's Project @9", platform: 'Roblox', category: 'Systems', description: 'A place for interesting technical work.', status: 'In Development', visits: 0, peakCCU: 0, featured: false },
//   { id: 10, title: "Bee's Project @10", platform: 'Unreal', category: 'Prototype', description: 'An Unreal experiment in progress.', status: 'In Development', visits: 0, peakCCU: 0, featured: false },
//   { id: 11, title: "Bee's Project @11", platform: 'Unreal', category: 'Environment', description: 'An environment and world-building experiment.', status: 'In Development', visits: 0, peakCCU: 0, featured: false },
// ]



const navigation = [
  { id: 'home', number: '01', label: 'Home' },
  { id: 'stats', number: '02', label: 'Stats' },
  { id: 'featured', number: '03', label: 'Featured Games' },
  { id: 'projects', number: '04', label: 'Other Projects' },
  { id: 'about', number: '05', label: 'Who Am I' },
  { id: 'skills', number: '06', label: 'Skills' },
  { id: 'contact', number: '07', label: 'Get in Touch' },
]

const skills = [
  { category: 'Programming', items: ['Luau', 'GDScript', 'JavaScript / TypeScript', 'C++'] },
  { category: 'Game Development', items: ['Gameplay Programming', 'Game Mechanics', 'Prototyping', 'Level Design'] },
  { category: '3D Art', items: ['Blender', '3D Modeling', 'Materials & Texturing', 'Lighting & Rendering'] },
  { category: 'Visual Design', items: ['Game Thumbnails', 'Game Icons', 'UI/UX Design', 'Composition'] },
  { category: 'Production', items: ['Git & GitHub', 'Debugging', 'Testing', 'Documentation'] },
  { category: 'Other Skills', items: ['Game Balancing', 'Optimization', 'World Building', 'Creative Problem Solving'] },
]

function formatNumber(value: number) {
  return value.toLocaleString('en-IN')
}


function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasEnteredView, setHasEnteredView] = useState(false)
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasEnteredView) return

    const duration = 1600
    const target = Number(value) || 0
    let startTime: number | null = null
    let animationFrame = 0

    function animate(timestamp: number) {
      if (startTime === null) startTime = timestamp

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1,
      )
      const easedProgress = 1 - Math.pow(1 - progress, 4)

      setDisplayValue(target * easedProgress)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [value, hasEnteredView])

  const formattedValue = Number.isInteger(value)
    ? Math.round(displayValue).toLocaleString('en-IN')
    : displayValue.toFixed(1)

  return (
    <span ref={elementRef}>
      {formattedValue}
    </span>
  )
}



function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [featuredPlatform, setFeaturedPlatform] = useState<Platform>('Roblox')
  const [projectsPlatform, setProjectsPlatform] = useState<Platform>('Roblox')
  const [allProjects, setAllProjects] = useState<Game[]>([])



const [portfolioStats, setPortfolioStats] = useState({
  total_games: 0,
  in_development: 0,
  total_visits: 0,
  peak_ccu: 0,
  years_experience: 0,
})


  
useEffect(() => {
  async function loadPortfolioStats() {
    const { data, error } = await supabase
      .from('portfolio_stats')
      .select('total_games, in_development, total_visits, peak_ccu, years_experience')
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Could not load portfolio stats:', error)
      return
    }

    console.log('Public portfolio stats:', data)

    if (data) {
      setPortfolioStats({
        total_games: data.total_games,
        in_development: data.in_development,
        total_visits: data.total_visits,
        peak_ccu: data.peak_ccu,
        years_experience: Number(data.years_experience),
      })
    }
  }

  loadPortfolioStats()
}, [])


    
useEffect(() => {
  async function loadProjects() {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Could not load portfolio projects:', error)
      return
    }

    const mappedProjects: Game[] = (data ?? []).map(project => ({
      id: project.id,
      title: project.name,
      platform: project.platform,
      category: project.genre,
      description: project.description,
      status: project.status,
      visits: Number(project.visits),
      peakCCU: project.peak_ccu,
      image_url: project.image_url,
      featured_slot: project.featured_slot,
      other_project_slot: project.other_project_slot,
    }))

    setAllProjects(mappedProjects)
  }

  void loadProjects()
}, [])




  useEffect(() => {
    const sections = navigation
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: '-15% 0px -65% 0px',
        threshold: [0, 0.1, 0.25, 0.5],
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  const selectedFeatured = allProjects
  .filter((game) => game.featured_slot !== null)
  .sort((a, b) => a.featured_slot! - b.featured_slot!)
  .filter((game) => game.platform === featuredPlatform)

const selectedProjects = allProjects
  .filter(
    (game) =>
      game.other_project_slot !== null &&
      game.status === 'Shipped' &&
      game.platform === projectsPlatform,
  )
  .sort(
    (a, b) =>
      a.other_project_slot! - b.other_project_slot!,
  )

  
const stats = [
  { label: 'Total Games', value: portfolioStats.total_games },
  { label: 'In Development', value: portfolioStats.in_development },
  { label: 'Total Visits', value: portfolioStats.total_visits },
  { label: 'Peak CCU', value: portfolioStats.peak_ccu },
  { label: 'Years of Experience', value: portfolioStats.years_experience },
]


  return (
    <div className="site-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" aria-label="BeeHub home">
          <span className="brand-mark">B.</span>
          <span className="brand-name">BeeHub<span>.</span></span>
        </a>

        <div className="sidebar-caption">THE CREATOR SPACE</div>

        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              aria-current={activeSection === item.id ? 'location' : undefined}
            >
              <span className="nav-number">{item.number}</span>
              <span className="nav-label">{item.label}</span>
              {activeSection === item.id && <span className="nav-indicator" />}
            </a>
          ))}
        </nav>

        
<div className="sidebar-bottom">
  <span className="sidebar-status"><span /> THE HIVE IS GROWING</span>
  <span className="sidebar-version">BEEHUB / 001</span>

  <a className="admin-link" href="/admin/login">
    <span>↗</span>
    Admin Login
  </a>
</div>

      </aside>

      <main className="main-content">
        <section className="hero section" id="home">

          <div className="hero-copy">
            <div className="section-kicker"><span>01</span><i /> HOME</div>
            <p className="eyebrow">INDEPENDENT CREATOR · BEE</p>
            <h1>
              DREAM IT.
              <br />
              <span>BUILD IT.</span>
              <br />
              PLAY IT.
            </h1>
            <p className="hero-description">
              A home for games, 3D art, experiments, and everything
              that starts with a curious mind and ends with something real.
            </p>

            <div className="hero-actions">
              <a className="button-primary" href="#featured">Explore my work <span>↗</span></a>
              <a className="button-secondary" href="#about">Meet the creator <span>↓</span></a>
            </div>
          </div>

          <div className="hero-art" aria-label="Decorative geometric BeeHub artwork">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-glow" />
            <div className="hero-cube">
              <div className="cube-top" />
              <div className="cube-left" />
              <div className="cube-right" />
              <span>B</span>
            </div>
            <span className="art-note art-note-top">✳ CREATION IN PROGRESS</span>
            <span className="art-note art-note-bottom">BUILT BY BEE</span>
          </div>

          <div className="hero-bottom">
            <span>GAMES / 3D / EXPERIMENTS</span>
            <a href="#stats">SCROLL TO EXPLORE ↓</a>
          </div>
        </section>

        <section className="section stats-section" id="stats">
          <div className="section-kicker"><span>02</span><i /> THE NUMBERS</div>
          <div className="section-heading">
            <div>
              <h2>STATS<span className="accent">.</span></h2>
              <p>Every journey starts somewhere. This is the starting line.</p>
            </div>
            <span className="section-note">ALL FIGURES START AT ZERO</span>
          </div>

          <div className="stats-grid">
            {stats.map((stat, index) => (
              <article className="stat-card" key={stat.label}>
                <span className="stat-index">0{index + 1}</span>
                <span className="stat-value">
                    <AnimatedNumber value={stat.value} />
                </span>
                <span className="stat-label">{stat.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="featured">
          <div className="section-kicker"><span>03</span><i /> THE SHOWCASE</div>
          <div className="section-heading">
            <div>
              <h2>FEATURED GAMES<span className="accent">.</span></h2>
              <p>The main attractions. Three featured games per platform.</p>
            </div>
            <PlatformFilter value={featuredPlatform} onChange={setFeaturedPlatform} />
          </div>

          <div className="featured-grid">
            {selectedFeatured.map((game, index) => (
              <GameCard game={game} key={game.id} index={index} featured />
            ))}
          </div>
        </section>

        <section className="section" id="projects">
          <div className="section-kicker"><span>04</span><i /> THE WORKBENCH</div>
          <div className="section-heading">
            <div>
              <h2>OTHER PROJECTS<span className="accent">.</span></h2>
              <p>Prototypes, experiments, and smaller projects worth a look.</p>
            </div>
            <PlatformFilter value={projectsPlatform} onChange={setProjectsPlatform} />
          </div>

          <div className="projects-grid">
            {selectedProjects.map((game, index) => (
              <GameCard game={game} key={game.id} index={index} />
            ))}
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="section-kicker"><span>05</span><i /> ABOUT</div>
          <h2 className="large-heading">WHO AM I<span className="accent">?</span></h2>

          <div className="about-grid">
            <div className="about-copy">
              <p className="about-lead">
                I'm Bee — a creator exploring game development,
                3D art, and the space between an idea and its execution.
              </p>
              <p>
                I enjoy building things, learning how they work, and
                experimenting with different ways to bring imaginary
                worlds to life.
              </p>
              <p>
                BeeHub is where that journey lives: the things I make,
                the things I'm learning, and the experiments that might
                become something bigger.
              </p>
            </div>

            <div className="focus-list">
              <span className="list-caption">CURRENT INTERESTS</span>
              {['Game development', 'Blender & 3D art', 'Gameplay systems', 'Thumbnails & visual design', 'Independent game creation'].map((item, index) => (
                <div className="focus-item" key={item}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span>{item}</span>
                  <span className="focus-arrow">↗</span>
                </div>
              ))}
            </div>
          </div>

          <div className="about-facts">
            {[
              ['01', 'FOCUS', 'Games & 3D'],
              ['02', 'APPROACH', 'Learn by building'],
              ['03', 'MINDSET', 'Always experimenting'],
              ['04', 'HOME', 'BeeHub'],
            ].map(([number, label, value]) => (
              <div className="fact" key={number}>
                <span>{number} / {label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="skills">
          <div className="section-kicker"><span>06</span><i /> THE TOOLKIT</div>
          <div className="section-heading">
            <div>
              <h2>SKILLS<span className="accent">.</span></h2>
              <p>Creative and technical skills across the indie development process.</p>
            </div>
          </div>

          <div className="skills-grid">
            {skills.map((skill, index) => (
              <article className="skill-card" key={skill.category}>
                <span className="skill-index">0{index + 1}</span>
                <h3>{skill.category}</h3>
                <div className="skill-tags">
                  {skill.items.map((item) => <span key={item}>{item}</span>)}
                </div>
              </article>
            ))}
          </div>
          <p className="skills-note">
            Initial skill list · Proficiency and individual skills will be configurable later.
          </p>
        </section>

        <section className="section contact-section" id="contact">
          <div className="section-kicker"><span>07</span><i /> CONTACT</div>
          <div className="contact-heading">
            <div>
              <h2>LET'S MAKE<br />SOMETHING<span className="accent">.</span></h2>
              <p>Have an idea, a project, or something interesting to share? Let's connect.</p>
            </div>
            <div className="contact-aside">
              <span>OPEN TO</span>
              <strong>Ideas & collaboration</strong>
              <span>BASED IN</span>
              <strong>My little corner of the internet</strong>
            </div>
          </div>

          <div className="contact-grid">
            <ContactCard label="EMAIL" value="bee@example.com" href="mailto:bee@example.com" />
            <ContactCard label="GITHUB" value="Bee-109" href="https://github.com/Bee-109" />
            <ContactCard label="DISCORD" value="Bee-109" href="#" />
            <ContactCard label="PORTFOLIO" value="BeeHub" href="#home" />
          </div>
        </section>

        <footer className="footer">
          <a className="brand footer-brand" href="#home">
            <span className="brand-mark">B.</span>
            <span className="brand-name">BeeHub<span>.</span></span>
          </a>
          <p>Made with curiosity and a little honey.</p>
          <a href="#home">BACK TO TOP ↑</a>
        </footer>
      </main>
    </div>
  )
}

function PlatformFilter({
  value,
  onChange,
}: {
  value: Platform
  onChange: (platform: Platform) => void
}) {
  return (
    <div className="platform-filter" aria-label="Filter by platform">
      {(['Roblox', 'Unreal'] as Platform[]).map((platform) => (
        <button
          key={platform}
          type="button"
          className={value === platform ? 'selected' : ''}
          aria-pressed={value === platform}
          onClick={() => onChange(platform)}
        >
          {platform}
        </button>
      ))}
    </div>
  )
}

// function GameCard({
//   game,
//   index,
//   featured = false,
// }: {
//   game: Game
//   index: number
//   featured?: boolean
// }) {
//   return (
//     <article className={`game-card ${featured ? 'featured-card' : 'project-card'}`}>
//       <div className={`game-art game-art-${(index % 5) + 1}`}>
//   {game.image_url && (
//     <img
//       className="game-thumbnail"
//       src={game.image_url}
//       alt={`${game.title} thumbnail`}
//     />
//   )}
//   <span className="game-art-number">{String(index + 1).padStart(2, '0')}</span>
//   <span className="game-art-symbol">{['◈', '✳', '◇', '⬡', '✦'][index % 5]}</span>
//   <span className="game-platform">{game.platform}</span>
//   <span className="game-art-caption">BEE-109 / PROJECT {String(index + 1).padStart(2, '0')}</span>
// </div>

//       <div className="game-details">
//         <div className="game-meta">
//           <span>{game.category}</span>
//           <span className={`game-status ${game.status === 'Shipped' ? 'shipped' : 'in-development'}`}>
//   <i />
//   {game.status}
// </span>
//         </div>
//         <h3 className="game-title">{game.title}</h3>
//         <p>{game.description}</p>

//         <div className="game-stats">
//           <div><strong>{formatNumber(game.visits)}</strong><span>VISITS</span></div>
//           <div><strong>{formatNumber(game.peakCCU)}</strong><span>PEAK CCU</span></div>
//         </div>

//         <div className="game-tags">
//           <span>{game.platform}</span>
//           <span>{game.category}</span>
//         </div>
//       </div>
//     </article>
//   )
// }



function GameCard({
  game,
  index,
  featured = false,
}: {
  game: Game
  index: number
  featured?: boolean
}) {
  return (
    <article className={`game-card ${featured ? 'featured-card' : 'project-card'}`}>
      <div className={`game-art game-art-${(index % 5) + 1}`}>
        {game.image_url && (
          <img
            className="game-thumbnail"
            src={game.image_url}
            alt={`${game.title} thumbnail`}
          />
        )}

        <div className="game-art-overlay" />

        <span className="game-art-number">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="game-platform">{game.platform}</span>

        <div className="game-art-content">
          <div className="game-meta">
            <span>{game.category}</span>
            <span className={`game-status ${game.status === 'Shipped' ? 'shipped' : 'in-development'}`}>
              <i />
              {game.status}
            </span>
          </div>

          <h3 className="game-title">{game.title}</h3>

          <p className="game-description">{game.description}</p>

          <div className="game-stats">
            <div>
              <strong>{formatNumber(game.visits)}</strong>
              <span>VISITS</span>
            </div>
            <div>
              <strong>{formatNumber(game.peakCCU)}</strong>
              <span>PEAK CCU</span>
            </div>
          </div>

          <div className="game-card-bottom">
            <div className="game-tags">
              <span>{game.platform}</span>
              <span>{game.category}</span>
            </div>

            {game.platform === 'Roblox' && (
              <a
                className="game-play-button"
                href="#contact"
                aria-label={`Learn more about ${game.title}`}
              >
                Try Game Now <span>↗</span>
              </a>
            )}
          </div>
        </div>

        <span className="game-art-caption">
          BEE-109 / PROJECT {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </article>
  )
}


function ContactCard({
  label,
  value,
  href,
}: {
  label: string
  value: string
  href: string
}) {
  return (
    <a className="contact-card" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
      <span>{label}</span>
      <strong>{value}</strong>
      <span className="contact-arrow">↗</span>
    </a>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      
<Routes>
  <Route path="/" element={<App />} />
  <Route path="/admin/login" element={<AdminLogin />} />

  <Route element={<ProtectedRoute />}>
    <Route path="/admin" element={<AdminDashboard />} />
  </Route>
</Routes>

    </BrowserRouter>
  )
}