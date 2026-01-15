<script setup lang="ts">
// SEO
useSeoMeta({
  title: 'Major | D\'étudiant moyen à numéro 1',
  description: 'Major - L\'outil universitaire le plus puissant jamais créé. Pré-inscris-toi maintenant pour bénéficier d\'un tarif réduit à vie.',
  ogTitle: 'Major | D\'étudiant moyen à numéro 1',
  ogDescription: 'L\'app qui transforme tes révisions en jeu et te propulse dans le top 1%.',
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image'
})

// Composables
const showExitPopup = ref(false)
const formSubmitted = ref(false)
const isSubmitting = ref(false)
const counterValue = ref(0)

// Form data
const formData = reactive({
  prenom: '',
  email: '',
  filiere: ''
})

// FAQ state
const activeFaq = ref<number | null>(null)

const faqItems = [
  {
    question: "C'est quoi exactement Major ?",
    answer: "Major est une application tout-en-un qui combine un algorithme de révision basé sur la science cognitive, une IA capable de ficher n'importe quel cours + générer des flashcards automatiquement, et un système de gamification pour te motiver. L'essentiel pouvant rendre un étudiant excellent."
  },
  {
    question: "Combien de temps avant de voir des résultats ?",
    answer: "La plupart des utilisateurs constatent une amélioration de leur productivité dès la première semaine. L'impact sur les notes se voit généralement après 2-3 semaines d'utilisation régulière."
  },
  {
    question: "Ça fonctionne pour toutes les filières ?",
    answer: "Oui ! Que tu sois en médecine, droit, commerce, sciences ou lettres, l'algorithme s'adapte à ton contenu. Notre IA est entraînée sur tous types de cours."
  },
  {
    question: "Pourquoi un tarif réduit à vie ?",
    answer: "Nous lançons Major et avons besoin de premiers utilisateurs engagés. En échange de ton feedback, tu bénéficies d'un tarif préférentiel permanent. C'est gagnant-gagnant."
  },
  {
    question: "L'app est disponible sur quels appareils ?",
    answer: "Major sera disponible sur web, iOS et Android. Tu pourras réviser n'importe où, n'importe quand, et ta progression sera synchronisée sur tous tes appareils."
  }
]

// Counter animation
const counterTarget = 127

onMounted(() => {
  // Init reveal animations
  initRevealAnimations()
  
  // Init counter animation
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter()
        counterObserver.unobserve(entry.target)
      }
    })
  }, { threshold: 0.5 })
  
  const counterEl = document.querySelector('.counter-value')
  if (counterEl) counterObserver.observe(counterEl)
  
  // Init chart animation
  initInteractiveChart()
  
  // Init exit intent
  initExitIntent()
})

function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal')
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible')
        }, index * 100)
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })
  
  revealElements.forEach(el => observer.observe(el))
  
  // Chart animation
  const chartAnimation = document.querySelector('.chart-animation')
  if (chartAnimation) {
    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated')
          chartObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.3 })
    chartObserver.observe(chartAnimation)
  }
  
  // Leaderboard animation
  const leaderboardAnimation = document.querySelector('.leaderboard-animation')
  if (leaderboardAnimation) {
    const leaderboardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated')
          leaderboardObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.3 })
    leaderboardObserver.observe(leaderboardAnimation)
  }
}

function animateCounter() {
  const duration = 1500
  const startTime = performance.now()
  
  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    counterValue.value = Math.floor(counterTarget * easeOut)
    
    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }
  
  requestAnimationFrame(update)
}

function initInteractiveChart() {
  const chartTabs = document.getElementById('chartTabs')
  const curveLine = document.getElementById('curveLine')
  const curveFill = document.getElementById('curveFill')
  const chartLabels = document.getElementById('chartLabels')

  if (!chartTabs || !curveLine || !curveFill || !chartLabels) return

  const chartData: Record<string, { line: string; fill: string; labels: string[] }> = {
    '7j': {
      line: 'M0,60 Q20,55 40,45 T80,50 T120,30 T160,35 T200,25',
      fill: 'M0,60 Q20,55 40,45 T80,50 T120,30 T160,35 T200,25 L200,80 L0,80 Z',
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    },
    '30j': {
      line: 'M0,55 Q25,60 50,40 T100,45 T150,25 T200,20',
      fill: 'M0,55 Q25,60 50,40 T100,45 T150,25 T200,20 L200,80 L0,80 Z',
      labels: ['S1', 'S2', 'S3', 'S4']
    },
    '90j': {
      line: 'M0,70 Q30,65 60,50 T120,40 T180,20 T200,15',
      fill: 'M0,70 Q30,65 60,50 T120,40 T180,20 T200,15 L200,80 L0,80 Z',
      labels: ['Jan', 'Fév', 'Mar']
    }
  }

  const tabs = chartTabs.querySelectorAll('.tab')
  tabs.forEach(tab => {
    ;(tab as HTMLElement).style.cursor = 'pointer'
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'))
      tab.classList.add('active')

      const period = (tab as HTMLElement).dataset.period || '7j'
      const data = chartData[period]

      curveLine.style.transition = 'opacity 0.3s ease'
      curveFill.style.transition = 'opacity 0.3s ease'
      curveLine.style.opacity = '0'
      curveFill.style.opacity = '0'

      setTimeout(() => {
        curveLine.setAttribute('d', data.line)
        curveFill.setAttribute('d', data.fill)
        chartLabels.innerHTML = data.labels.map(l => `<span>${l}</span>`).join('')
        curveLine.style.opacity = '1'
        curveFill.style.opacity = '1'
        curveLine.style.strokeDasharray = '300'
        curveLine.style.strokeDashoffset = '300'
        curveLine.style.animation = 'none'
        ;(curveLine as any).offsetHeight
        curveLine.style.animation = 'drawCurve 1s ease-out forwards'
      }, 300)
    })
  })
}

function initExitIntent() {
  const STORAGE_KEY = 'major_exit_popup_shown'
  const MIN_TIME_ON_PAGE = 3000 // 3 secondes minimum sur la page
  const pageLoadTime = Date.now()
  
  // Ne pas afficher si déjà montré cette session
  if (sessionStorage.getItem(STORAGE_KEY)) return
  
  // Affiche le popup uniquement quand la souris quitte vers le haut (intention de fermer)
  document.addEventListener('mouseout', (e) => {
    // Vérifie que la souris sort par le haut de la fenêtre
    if (e.clientY <= 0 && e.relatedTarget === null) {
      // Vérifie que l'utilisateur a passé un minimum de temps sur la page
      if (showExitPopup.value) return
      if (Date.now() - pageLoadTime < MIN_TIME_ON_PAGE) return
      
      showExitPopup.value = true
      sessionStorage.setItem(STORAGE_KEY, 'true')
    }
  })
}


function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index
}

function closeExitPopup() {
  showExitPopup.value = false
}

async function submitForm() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!formData.prenom || formData.prenom.length < 2) {
    showToast('Veuillez entrer un prénom valide', 'error')
    return
  }
  
  if (!emailRegex.test(formData.email)) {
    showToast('Veuillez entrer une adresse email valide', 'error')
    return
  }
  
  if (!formData.filiere || formData.filiere.length < 2) {
    showToast("Veuillez entrer votre filière d'études", 'error')
    return
  }
  
  // Submit to Google Sheets
  const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyrjQePbsm-VyxG2BWej406M8yu7nysCFM-H8EaOy8Rj70DDCf8e5U0AbukhJXP5Jkzmw/exec'
  
  isSubmitting.value = true
  
  try {
    await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        timestamp: new Date().toISOString()
      })
    })
    
    // Save to localStorage as backup
    const existing = JSON.parse(localStorage.getItem('majorInscriptions') || '[]')
    existing.push({ ...formData, timestamp: new Date().toISOString() })
    localStorage.setItem('majorInscriptions', JSON.stringify(existing))
    
    formSubmitted.value = true
  } catch (error) {
    console.error('Error:', error)
    formSubmitted.value = true
  } finally {
    isSubmitting.value = false
  }
}

function showToast(message: string, type: 'info' | 'error' = 'info') {
  const toast = document.createElement('div')
  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'error' ? '#EF4444' : '#10B981'};
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 500;
    z-index: 9999;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  `
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 3000)
}
</script>

<template>
  <div>
    <!-- Urgency Banner -->
    <div class="urgency-banner">
      <span>
        <svg class="banner-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        Offre de lancement : plus que <strong>47 places</strong> au tarif réduit
      </span>
    </div>

    <!-- Header -->
    <header class="header">
      <nav class="nav container">
        <a href="#" class="logo">
          <svg class="logo-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 8L4 16L20 24L36 16L20 8Z" fill="#0B1F3A" />
            <path d="M10 19V28C10 28 14 32 20 32C26 32 30 28 30 28V19L20 24L10 19Z" fill="#0B1F3A" />
            <path d="M32 17V26" stroke="#D4A72C" stroke-width="2" stroke-linecap="round" />
            <circle cx="32" cy="28" r="2" fill="#D4A72C" />
          </svg>
          <span class="logo-text">Major</span>
        </a>
        <div class="nav-links">
          <a href="#features">Fonctionnalités</a>
          <a href="#features">Comment ça marche</a>
          <a href="#about">À propos</a>
          <a href="#faq">FAQ</a>
        </div>
        <a href="#inscription" class="btn btn-primary btn-nav">S'inscrire gratuitement</a>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <!-- Floating Icons -->
      <div class="floating-icons">
        <div class="floating-icon icon-1">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0B1F3A" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
          </svg>
        </div>
        <div class="floating-icon icon-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4A72C" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round">
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
            </polygon>
          </svg>
        </div>
        <div class="floating-icon icon-3">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4A72C" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
        </div>
        <div class="floating-icon icon-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0B1F3A" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7"></path>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7"></path>
            <path d="M4 22h16"></path>
            <path d="M10 22V8a2 2 0 0 1 4 0v14"></path>
          </svg>
        </div>
      </div>

      <div class="container">
        <div class="hero-content">
          <!-- Social Proof Badge -->
          <div class="hero-badge">
            <div class="badge-avatars">
              <img src="/avatar_badge_1.png" alt="Étudiant" class="avatar-img">
              <img src="/avatar_badge_2.png" alt="Étudiant" class="avatar-img">
              <img src="/avatar_badge_3.png" alt="Étudiant" class="avatar-img">
            </div>
            <span class="badge-counter">+<span class="counter-value">{{ counterValue }}</span> étudiants
              pré-inscrits</span>
          </div>

          <h1 class="hero-title">
            D'étudiant Moyen à<br>
            <span class="highlight-navy">Numéro 1</span>
          </h1>

          <p class="hero-subtitle">
            L'app qui transforme tes révisions en jeu et te propulse dans le top 1%.
          </p>

          <div class="hero-cta">
            <a href="#inscription" class="btn btn-primary btn-lg btn-glow">
              Essayer Major
            </a>
          </div>
        </div>

        <!-- Dashboard Preview -->
        <div class="dashboard-preview-container reveal">
          <div class="dashboard-ui">
            <!-- Dash Header -->
            <div class="dash-header">
              <div class="dash-logo">
                <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 8L4 16L20 24L36 16L20 8Z" fill="#0B1F3A" />
                  <path d="M10 19V28C10 28 14 32 20 32C26 32 30 28 30 28V19L20 24L10 19Z" fill="#0B1F3A" />
                  <path d="M32 17V26" stroke="#D4A72C" stroke-width="2" stroke-linecap="round" />
                  <circle cx="32" cy="28" r="2" fill="#D4A72C" />
                </svg>
                MAJOR
              </div>
              <div class="dash-nav">
                <span class="dash-nav-item active">Tableau de bord</span>
                <span class="dash-nav-item">Révisions</span>
                <span class="dash-nav-item">Classement</span>
              </div>
              <div class="dash-actions">
                <div class="dash-objective">OBJECTIF 15H</div>
                <button class="dash-btn-start">
                  <span>▶</span> Démarrer
                </button>
                <img src="/avatar_user.png" alt="Profil" class="dash-user-img">
              </div>
            </div>

            <!-- Dash Body -->
            <div class="dash-body">
              <div class="dash-headup">
                <h2 class="dash-title">Tableau de bord</h2>
                <p class="dash-subtitle">Tu es à 84% de ton objectif hebdo • <strong>Plus que 2h15</strong>
                  <a href="#">Ajuster ↗</a>
                </p>
              </div>

              <!-- Stats Grid -->
              <div class="dash-grid">
                <!-- Card 1 -->
                <div class="dash-card">
                  <div class="dash-card-header">
                    <span class="dash-card-title">TEMPS DE TRAVAIL (7J)</span>
                    <span class="dash-card-icon">⏱️</span>
                  </div>
                  <div class="dash-value-group">
                    <span class="dash-value">12h 45</span>
                    <span class="dash-badge green">+19%</span>
                  </div>
                  <div class="dash-progress">
                    <span>PROGRESSION HEBDO</span>
                    <span>84%</span>
                  </div>
                  <div class="dash-bar" style="margin-top: 8px;">
                    <div class="dash-bar-fill" style="width: 84%;"></div>
                  </div>
                </div>

                <!-- Card 2 -->
                <div class="dash-card">
                  <div class="dash-card-header">
                    <span class="dash-card-title" style="color:#F59E0B">SÉRIE</span>
                    <span class="dash-card-icon" style="color:#F59E0B">📈</span>
                  </div>
                  <div class="dash-value-group">
                    <span class="dash-value">4 Jours</span>
                  </div>
                  <div style="font-size: 0.875rem; color: #64748B; margin-bottom: 12px;">
                    Record: <strong>12 Jours</strong>
                  </div>
                  <div class="dash-fire-alert">
                    <span>🔥</span> 1 session aujourd'hui pour continuer
                  </div>
                </div>

                <!-- Card 3 -->
                <div class="dash-card">
                  <div class="dash-card-header">
                    <span class="dash-card-title">CLASSEMENT</span>
                    <span class="dash-card-icon">🏆</span>
                  </div>
                  <div class="dash-value-group">
                    <span class="dash-value">#42</span>
                    <span class="dash-badge outline">EXCELLENT</span>
                  </div>
                  <div style="font-size: 0.875rem; color: #64748B;">
                    Top 0,6% des utilisateurs
                  </div>
                </div>
              </div>

              <!-- Plan du jour -->
              <div class="dash-section">
                <h3 class="dash-section-title">Plan du jour</h3>
                <p class="dash-section-subtitle">Régularité > intensité.</p>
                <div class="dash-plan-row">
                  <div class="dash-tasks">
                    <div class="dash-task">
                      <div class="task-dot grey"></div>
                      <div class="task-info">
                        <h4>Droit Civil</h4>
                        <p>Fiches • 45 min</p>
                      </div>
                    </div>
                    <div class="dash-task">
                      <div class="task-dot grey" style="background: #E2E8F0;"></div>
                      <div class="task-info">
                        <h4>Anglais</h4>
                        <p>Quiz • 15 min</p>
                      </div>
                    </div>
                  </div>
                  <div class="dash-plan-actions">
                    <button class="btn-dash primary">
                      <span>▶</span> Lancer la session
                    </button>
                    <button class="btn-dash secondary">
                      ✎ Modifier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-bg"></div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item reveal">
            <span class="stat-number">+5h</span>
            <span class="stat-label">gagnées par semaine</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item reveal">
            <span class="stat-number">2min</span>
            <span class="stat-label">pour créer tes flashcards</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item reveal">
            <span class="stat-number">1%</span>
            <span class="stat-label">des étudiants d'élite</span>
          </div>
        </div>
        <div class="stats-cta">
          <a href="#features" class="btn-link">En savoir plus ↓</a>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-badge">Ils témoignent</span>
          <h2 class="section-title">Ce que disent nos premiers utilisateurs</h2>
        </div>

        <div class="testimonials-grid reveal">
          <div class="testimonial-card">
            <div class="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p class="testimonial-text">"Je stressais pour le bac, je ne savais pas comment m'organiser. Avec Major, je
              sais exactement quoi réviser chaque jour. J'ai pris confiance et mes notes ont décollé."</p>
            <div class="testimonial-author">
              <img src="/avatar_badge_1.png" alt="Clara M." class="testimonial-avatar">
              <div class="testimonial-info">
                <span class="testimonial-name">Clara M.</span>
                <span class="testimonial-role">Terminale · Lyon</span>
              </div>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p class="testimonial-text">"Je révise 2h de moins par jour et je retiens 3x plus. Le classement me pousse à
              rester constant. Mes partiels n'ont jamais été aussi bien préparés."</p>
            <div class="testimonial-author">
              <img src="/avatar_badge_2.png" alt="Thomas D." class="testimonial-avatar">
              <div class="testimonial-info">
                <span class="testimonial-name">Thomas D.</span>
                <span class="testimonial-role">Droit L2 · Paris</span>
              </div>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p class="testimonial-text">"L'IA génère mes flashcards en 2 minutes. Avant, je passais des heures à ficher.
              Major a littéralement sauvé mon semestre."</p>
            <div class="testimonial-author">
              <img src="/avatar_badge_3.png" alt="Emma L." class="testimonial-avatar">
              <div class="testimonial-info">
                <span class="testimonial-name">Emma L.</span>
                <span class="testimonial-role">École de commerce · Toulouse</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-badge">Notre système</span>
          <h2 class="section-title">La technologie derrière Major</h2>
        </div>

        <div class="features-grid-vertical">
          <!-- Feature 1: Sciences cognitives -->
          <div class="feature-card-horizontal reveal">
            <div class="feature-content">
              <div class="feature-icon-badge">🧠</div>
              <h3>Applique les sciences cognitives à tes révisions et suis ta progression</h3>
              <p>Connais ton efficience avec l'indice de productivité et analyse en direct tes capacités.
                Notre algorithme te dit exactement quoi réviser et quand.</p>
            </div>
            <div class="feature-visual-tech">
              <div class="tech-animation chart-animation">
                <div class="perf-chart" id="perfChart">
                  <div class="chart-header">
                    <span class="chart-title">Performance</span>
                    <div class="chart-tabs" id="chartTabs">
                      <span class="tab active" data-period="7j">7j</span>
                      <span class="tab" data-period="30j">30j</span>
                      <span class="tab" data-period="90j">90j</span>
                    </div>
                  </div>
                  <div class="chart-body">
                    <svg class="curve-svg" viewBox="0 0 200 80" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style="stop-color:#0B1F3A;stop-opacity:0.2" />
                          <stop offset="100%" style="stop-color:#0B1F3A;stop-opacity:0" />
                        </linearGradient>
                      </defs>
                      <path class="curve-fill" id="curveFill"
                        d="M0,60 Q20,55 40,45 T80,50 T120,30 T160,35 T200,25 L200,80 L0,80 Z"
                        fill="url(#curveGradient)" />
                      <path class="curve-line" id="curveLine"
                        d="M0,60 Q20,55 40,45 T80,50 T120,30 T160,35 T200,25" fill="none" stroke="#0B1F3A"
                        stroke-width="2" />
                      <circle class="curve-dot" cx="200" cy="25" r="3" fill="#0B1F3A" />
                    </svg>
                  </div>
                  <div class="chart-labels" id="chartLabels">
                    <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Feature 2: IA -->
          <div class="feature-card-horizontal reverse reveal">
            <div class="feature-content">
              <div class="feature-icon-badge">🤖</div>
              <h3>Fiche automatiquement tes cours grâce à l'IA la plus performante du marché</h3>
              <p>Pendant que d'autres passent des heures à stabiloter, tu peux instantanément commencer tes
                révisions. Importe ton cours, Major fait le reste.</p>
            </div>
            <div class="feature-visual-tech">
              <div class="tech-animation ai-animation-v2">
                <!-- Document source -->
                <div class="ai-source">
                  <div class="ai-doc-premium">
                    <div class="doc-header"></div>
                    <div class="doc-lines">
                      <span></span><span></span><span></span><span></span><span></span>
                    </div>
                  </div>
                  <span class="ai-label">Ton cours</span>
                </div>

                <!-- Flèche animée -->
                <div class="ai-process">
                  <div class="ai-spark">✨</div>
                  <svg class="ai-arrow-svg" width="60" height="30" viewBox="0 0 60 30">
                    <path d="M0 15H50M50 15L40 5M50 15L40 25" stroke="#D4A72C" stroke-width="3"
                      stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span class="ai-magic-text">IA</span>
                </div>

                <!-- Flashcards résultat -->
                <div class="ai-result">
                  <div class="ai-flashcards">
                    <div class="flashcard fc-1">Q</div>
                    <div class="flashcard fc-2">Q</div>
                    <div class="flashcard fc-3">Q</div>
                  </div>
                  <span class="ai-label">Flashcards</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Feature 3: Tracking -->
          <div class="feature-card-horizontal reveal">
            <div class="feature-content">
              <div class="feature-icon-badge">📊</div>
              <h3>Ne travaille plus dans l'ombre</h3>
              <p>Suis ta progression en temps réel et prouve que tu es le/la meilleur(e) avec une approche
                pensée pour les compétiteurs.</p>
            </div>
            <div class="feature-visual-tech">
              <div class="tech-animation leaderboard-animation">
                <div class="leaderboard-card">
                  <div class="leaderboard-header">
                    <span class="leaderboard-title">Classement mondial</span>
                    <span class="leaderboard-subtitle">CETTE SEMAINE</span>
                  </div>
                  <div class="leaderboard-list">
                    <div class="leaderboard-item rank-1">
                      <span class="rank-badge gold">🥇</span>
                      <img src="/avatar_marie.png" alt="Marie L." class="rank-avatar-img">
                      <div class="rank-info">
                        <span class="rank-name">Marie L.</span>
                        <span class="rank-stats">34h 15min</span>
                      </div>
                      <span class="rank-trend up">+2 ↑</span>
                    </div>
                    <div class="leaderboard-item rank-2">
                      <span class="rank-badge silver">🥈</span>
                      <img src="/avatar_thomas.png" alt="Cyber_Tom" class="rank-avatar-img">
                      <div class="rank-info">
                        <span class="rank-name">Cyber_Tom</span>
                        <span class="rank-stats">31h 40min</span>
                      </div>
                      <span class="rank-trend up">+5 ↑</span>
                    </div>
                    <div class="leaderboard-item rank-3 highlight">
                      <span class="rank-badge bronze">🥉</span>
                      <img src="/avatar_user.png" alt="Toi" class="rank-avatar-img you">
                      <div class="rank-info">
                        <span class="rank-name">Toi</span>
                        <span class="rank-stats">28h 55min</span>
                      </div>
                      <span class="rank-trend same">= 0</span>
                    </div>
                    <div class="leaderboard-item rank-4">
                      <span class="rank-number">4</span>
                      <img src="/avatar_profile_new.png" alt="Manon S." class="rank-avatar-img">
                      <div class="rank-info">
                        <span class="rank-name">Manon S.</span>
                        <span class="rank-stats">24h 30min</span>
                      </div>
                      <span class="rank-trend down">-3 ↓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Target Audience Section -->
    <section class="target">
      <div class="container">
        <div class="target-content reveal">
          <span class="section-badge badge-dark">Pour qui ?</span>
          <h2 class="target-title">Major n'est pas pour tout le monde.</h2>
          <p class="target-subtitle">L'outil est spécialement conçu pour les étudiants qui veulent passer au
            niveau supérieur et dominer leur cursus.</p>

          <div class="target-comparison">
            <div class="comparison-column bad">
              <h4>99% des étudiants</h4>
              <ul>
                <li>❌ Révisent au hasard, sans stratégie</li>
                <li>❌ Travaillent 10h pour retenir 2h</li>
                <li>❌ Abandonnent face à la surcharge</li>
                <li>❌ Stagnent pendant que d'autres progressent</li>
              </ul>
            </div>
            <div class="comparison-column good">
              <h4>Étudiants Major (1%)</h4>
              <ul>
                <li>✅ Révisent intelligemment, au bon moment</li>
                <li>✅ Mémorisent 3x plus en 2x moins de temps</li>
                <li>✅ Restent motivés grâce à la gamification</li>
                <li>✅ Grimpent dans les classements chaque semaine</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about" id="about">
      <div class="container">
        <div class="about-content about-storytelling reveal">
          <div class="about-photo">
            <img src="/louis-photo.jpg" alt="Louis - Créateur de Major" class="founder-photo">
            <div class="photo-caption">
              <span class="founder-name">Louis, 24 ans</span>
              <span class="founder-alias">@Mystérieux Étudiant</span>
            </div>
          </div>
          <div class="about-story">
            <span class="section-badge">Mon histoire</span>
            <h2 class="about-title">D'élève moyen à major de promo.</h2>
            <p class="about-lead">Au lycée, j'avais 11 de moyenne. Le proviseur disait que je n'arriverais
              jamais dans la filière que j'avais demandée. <strong>Il avait presque raison.</strong></p>
            <p>Ce déclic a tout changé. J'ai compris que quand on a des ambitions, il faut y mettre les
              moyens. Alors j'ai travaillé, expérimenté, optimisé. Aujourd'hui, je majore mes études dans un
              domaine ultra-concurrentiel.</p>
            <p>Mais je n'y suis pas arrivé sans accroc, j'ai fait énormément d'erreurs.</p>
            <p class="about-mission">C'est pour cela que j'ai voulu créer l'outil que j'aurai rêvé avoir dès le
              départ destiné à ceux qui veulent sortir du lot mais qui ne savent pas par où commencer.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq" id="faq">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-badge">FAQ</span>
          <h2 class="section-title">Les questions fréquentes</h2>
        </div>

        <div class="faq-list reveal">
          <div v-for="(item, index) in faqItems" :key="index" class="faq-item" :class="{ active: activeFaq === index }">
            <button class="faq-question" @click="toggleFaq(index)">
              <span>{{ item.question }}</span>
              <span class="faq-icon">{{ activeFaq === index ? '-' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="final-cta" id="inscription">
      <div class="container">
        <div class="cta-content reveal">
          <h2 class="cta-title">Rejoins les 1% qui font le choix de l'excellence</h2>
          <p class="cta-subtitle">Le prochain major, c'est toi.</p>

          <form v-if="!formSubmitted" id="inscriptionForm" class="inscription-form" @submit.prevent="submitForm">
            <div class="form-row">
              <div class="form-group">
                <input v-model="formData.prenom" type="text" id="prenom" name="prenom" placeholder="Ton prénom"
                  required>
              </div>
              <div class="form-group">
                <input v-model="formData.email" type="email" id="email" name="email"
                  placeholder="ton.email@exemple.com" required>
              </div>
            </div>
            <div class="form-group">
              <input v-model="formData.filiere" type="text" id="filiere" name="filiere"
                placeholder="Ta filière (ex: Médecine, Droit, Commerce...)" required>
            </div>
            <button type="submit" class="btn btn-primary btn-lg btn-full btn-glow" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="btn-loading">
                <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
                </svg>
                Envoi en cours...
              </span>
              <span v-else>Demander l'accès</span>
            </button>
          </form>

          <div v-else class="success-message">
            <div class="success-badge">
              <svg class="success-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 12l2.5 2.5L16 9" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Candidature envoyée</h3>
            <p class="success-main">Nous allons étudier ton profil afin de vérifier si tu es éligible à rejoindre <strong>Major</strong>.</p>
            <div class="success-steps">
              <div class="step">
                <span class="step-number">1</span>
                <span class="step-text">Analyse de ton profil</span>
                <span class="step-status active">En cours...</span>
              </div>
              <div class="step">
                <span class="step-number">2</span>
                <span class="step-text">Vérification d'éligibilité</span>
                <span class="step-status">À venir</span>
              </div>
              <div class="step">
                <span class="step-number">3</span>
                <span class="step-text">Réponse par email</span>
                <span class="step-status">~20min</span>
              </div>
            </div>
            <p class="success-note">📧 Vérifie ta boîte mail (et tes spams) dans les prochaines minutes.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-logo">
              <svg class="logo-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8L4 16L20 24L36 16L20 8Z" fill="#0B1F3A" />
                <path d="M10 19V28C10 28 14 32 20 32C26 32 30 28 30 28V19L20 24L10 19Z" fill="#0B1F3A" />
                <path d="M32 17V26" stroke="#D4A72C" stroke-width="2" stroke-linecap="round" />
                <circle cx="32" cy="28" r="2" fill="#D4A72C" />
              </svg>
              <span class="logo-text">Major</span>
            </div>
            <p class="footer-tagline">D'étudiant moyen à numéro 1</p>
          </div>

          <div class="footer-links">
            <h5>Pages</h5>
            <a href="#features">Fonctionnalités</a>
            <a href="#pillars">Comment ça marche</a>
            <a href="#about">À propos</a>
            <a href="#faq">FAQ</a>
          </div>

          <div class="footer-links">
            <h5>Légal</h5>
            <a href="/cgu">CGU</a>
            <a href="/confidentialite">Confidentialité</a>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-social">
            <a href="#" class="social-icon" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" class="social-icon" aria-label="TikTok">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
          </div>
          <p>© 2026 Major. Tous droits réservés.</p>
          <p class="security-line">🔒 Données sécurisées et protégées</p>
        </div>
      </div>
    </footer>

    <!-- Exit Intent Popup -->
    <Teleport to="body">
      <div v-if="showExitPopup" class="exit-popup-overlay active" @click.self="closeExitPopup">
        <div class="exit-popup">
          <button class="exit-popup-close" @click="closeExitPopup" aria-label="Fermer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div class="exit-popup-content">
            <div class="exit-popup-badge">🎓 Dernière chance</div>
            <h2 class="exit-popup-title">Attends, ne pars pas les mains vides !</h2>
            <p class="exit-popup-subtitle">Rejoins les <strong>+127 étudiants</strong> qui ont déjà réservé leur
              place au tarif de lancement.</p>

            <div class="exit-popup-benefits">
              <div class="exit-benefit">
                <span class="benefit-icon">✨</span>
                <span>Tarif réduit à vie</span>
              </div>
              <div class="exit-benefit">
                <span class="benefit-icon">🧠</span>
                <span>IA qui fiche tes cours</span>
              </div>
              <div class="exit-benefit">
                <span class="benefit-icon">📈</span>
                <span>Algorithme de révision</span>
              </div>
            </div>

            <a href="#inscription" class="btn btn-primary btn-lg exit-popup-cta" @click="closeExitPopup">
              Réserver ma place maintenant
            </a>

            <button class="exit-popup-dismiss" @click="closeExitPopup">
              Non merci, je préfère réviser seul
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
