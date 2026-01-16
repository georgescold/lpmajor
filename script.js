// =============================================
// MAJOR LANDING PAGE - JAVASCRIPT V2
// =============================================

document.addEventListener('DOMContentLoaded', function () {
    initRevealAnimations();
    initFAQ();
    initForm();
    initSmoothScroll();
    initInteractiveChart();
    initCounterAnimation();
    initExitIntent();
});

// =============================================
// REVEAL ANIMATIONS ON SCROLL
// =============================================

function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for multiple elements
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // Chart animation on scroll
    const chartAnimation = document.querySelector('.chart-animation');
    if (chartAnimation) {
        const chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    chartObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        chartObserver.observe(chartAnimation);
    }

    // Leaderboard animation on scroll
    const leaderboardAnimation = document.querySelector('.leaderboard-animation');
    if (leaderboardAnimation) {
        const leaderboardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    leaderboardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        leaderboardObserver.observe(leaderboardAnimation);
    }
}

// =============================================
// FAQ ACCORDION
// =============================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// =============================================
// FORM HANDLING
// =============================================

function initForm() {
    const form = document.getElementById('inscriptionForm');
    const successMessage = document.getElementById('successMessage');

    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Get form data
        const formData = {
            prenom: form.querySelector('#prenom').value.trim(),
            email: form.querySelector('#email').value.trim(),
            filiere: form.querySelector('#filiere').value.trim(),
            timestamp: new Date().toISOString()
        };

        // Validate
        if (!validateForm(formData)) {
            return;
        }

        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.disabled = true;

        try {
            // Send to Google Sheets (replace URL with your deployed Apps Script URL)
            const GOOGLE_SHEETS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

            if (GOOGLE_SHEETS_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
                await fetch(GOOGLE_SHEETS_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
            }

            // Show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';



        } catch (error) {
            console.error('Error submitting form:', error);
            // Still show success
            form.style.display = 'none';
            successMessage.style.display = 'block';
        }
    });
}

function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.prenom || data.prenom.length < 2) {
        showToast('Veuillez entrer un prénom valide', 'error');
        return false;
    }

    if (!emailRegex.test(data.email)) {
        showToast('Veuillez entrer une adresse email valide', 'error');
        return false;
    }

    if (!data.filiere || data.filiere.length < 2) {
        showToast('Veuillez entrer votre filière d\'études', 'error');
        return false;
    }

    return true;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
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
        animation: slideUp 0.3s ease;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// localStorage backup removed for security

// =============================================
// SMOOTH SCROLL
// =============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
    }
`;
document.head.appendChild(style);

// =============================================
// INTERACTIVE PERFORMANCE CHART
// =============================================

function initInteractiveChart() {
    const chartTabs = document.getElementById('chartTabs');
    const curveLine = document.getElementById('curveLine');
    const curveFill = document.getElementById('curveFill');
    const chartLabels = document.getElementById('chartLabels');

    if (!chartTabs || !curveLine || !curveFill || !chartLabels) return;

    // Chart data for different periods
    const chartData = {
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
    };

    // Add click listeners to tabs
    const tabs = chartTabs.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.style.cursor = 'pointer';
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');

            // Get the period
            const period = tab.dataset.period;
            const data = chartData[period];

            // Animate the chart update
            curveLine.style.transition = 'opacity 0.3s ease';
            curveFill.style.transition = 'opacity 0.3s ease';
            curveLine.style.opacity = '0';
            curveFill.style.opacity = '0';

            setTimeout(() => {
                // Update paths
                curveLine.setAttribute('d', data.line);
                curveFill.setAttribute('d', data.fill);

                // Update labels
                chartLabels.innerHTML = data.labels.map(l => `<span>${l}</span>`).join('');

                // Fade back in
                curveLine.style.opacity = '1';
                curveFill.style.opacity = '1';

                // Re-trigger draw animation
                curveLine.style.strokeDasharray = '300';
                curveLine.style.strokeDashoffset = '300';
                curveLine.style.animation = 'none';
                curveLine.offsetHeight; // Trigger reflow
                curveLine.style.animation = 'drawCurve 1s ease-out forwards';
            }, 300);
        });
    });
}

// =============================================
// COUNTER ANIMATION
// =============================================

function initCounterAnimation() {
    const counterElement = document.querySelector('.counter-value');

    if (!counterElement) return;

    const targetValue = parseInt(counterElement.dataset.target) || 127;
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounter(counterElement, 0, targetValue, 1500);
                counterElement.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(counterElement);
}

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(start + (end - start) * easeOut);

        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

// =============================================
// EXIT INTENT POPUP
// =============================================

function initExitIntent() {
    const popup = document.getElementById('exitPopup');
    const closeBtn = document.getElementById('exitPopupClose');
    const dismissBtn = document.getElementById('exitPopupDismiss');
    const ctaBtn = document.getElementById('exitPopupCta');

    if (!popup) return;

    let hasShown = false;
    const STORAGE_KEY = 'major_exit_popup_shown';
    const MIN_TIME_ON_PAGE = 5000; // 5 seconds minimum before showing
    const pageLoadTime = Date.now();

    // Check if already shown this session
    if (sessionStorage.getItem(STORAGE_KEY)) {
        return;
    }

    function showPopup() {
        if (hasShown) return;
        if (Date.now() - pageLoadTime < MIN_TIME_ON_PAGE) return;

        hasShown = true;
        sessionStorage.setItem(STORAGE_KEY, 'true');
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hidePopup() {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Desktop: Mouse leave detection (moving to top of viewport)
    document.addEventListener('mouseout', function (e) {
        if (e.clientY <= 0 && e.relatedTarget === null) {
            showPopup();
        }
    });

    // Mobile fallback: Show after 30 seconds if user hasn't scrolled much
    let hasScrolledDeep = false;
    window.addEventListener('scroll', function () {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 50) {
            hasScrolledDeep = true;
        }
    });

    setTimeout(function () {
        if (!hasScrolledDeep && !hasShown) {
            showPopup();
        }
    }, 30000);

    // Close handlers
    closeBtn.addEventListener('click', hidePopup);
    dismissBtn.addEventListener('click', hidePopup);

    // Close on overlay click
    popup.addEventListener('click', function (e) {
        if (e.target === popup) {
            hidePopup();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            hidePopup();
        }
    });

    // CTA click - close popup and scroll to form
    ctaBtn.addEventListener('click', function () {
        hidePopup();
    });
}

// =============================================
// BLOG SECTION - TOGGLE FUNCTIONS
// =============================================

function toggleBlogCard(header) {
    const card = header.closest('.blog-card');
    if (!card) return;

    // Close other expanded cards (optional - remove if you want multiple open)
    const allCards = document.querySelectorAll('.blog-card.expanded');
    allCards.forEach(otherCard => {
        if (otherCard !== card) {
            otherCard.classList.remove('expanded');
        }
    });

    // Toggle current card
    card.classList.toggle('expanded');

    // Smooth scroll to card if expanding and it's partially out of view
    if (card.classList.contains('expanded')) {
        setTimeout(() => {
            const cardRect = card.getBoundingClientRect();
            if (cardRect.top < 80) {
                card.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
}

function toggleAccordion(header) {
    const item = header.closest('.accordion-item');
    if (!item) return;

    // Check if already open
    const isOpen = item.classList.contains('open');

    // Close all other items in the same accordion
    const accordion = item.closest('.blog-accordion');
    if (accordion) {
        accordion.querySelectorAll('.accordion-item.open').forEach(openItem => {
            if (openItem !== item) {
                openItem.classList.remove('open');
            }
        });
    }

    // Toggle current item
    item.classList.toggle('open');

    // Smooth scroll if opening and item is partially out of view
    if (!isOpen) {
        setTimeout(() => {
            const itemRect = item.getBoundingClientRect();
            if (itemRect.top < 80 || itemRect.bottom > window.innerHeight) {
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 100);
    }
}
