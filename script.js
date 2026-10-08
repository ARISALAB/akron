// script.js - ΕΝΟΠΟΙΗΜΕΝΟΣ ΚΩΔΙΚΑΣ

// Βρείτε την ενότητα highlights για το parallax background (πρέπει να είναι έξω από τη συνάρτηση για να είναι προσβάσιμη)
const highlightsSectionForParallax = document.querySelector('.highlights');
let requestId = null; // Για να διαχειριστούμε το requestAnimationFrame

// Αυτές οι σταθερές πρέπει να βρίσκονται στην κορυφή του αρχείου JS σου,
// ή μέσα στο DOMContentLoaded αν τις χρειάζεσαι μόνο εκεί.
// Αν τις χρειάζεσαι και εκτός του DOMContentLoaded (π.χ. σε άλλες συναρτήσεις),
// τότε πρέπει να είναι global.
const backToTopButton = document.getElementById('back-to-top');
const progressCircle = backToTopButton ? backToTopButton.querySelector('.progress-circle') : null;
let radius = 0;
let circumference = 0;

if (progressCircle) {
    radius = progressCircle.r.baseVal.value;
    circumference = 2 * Math.PI * radius;
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;
}

const scrollThreshold = 400; // Απόσταση σε pixels για να εμφανιστεί το κουμπί

// Βρείτε τα στοιχεία για το ticker animation
const tickerContainer = document.querySelector('.contact .contact-intro-banner');
const tickerContent = tickerContainer ? tickerContainer.querySelector('.ticker-content') : null;
let tickerAnimation = null;
let resizeObserver = null;

// --- ΣΥΝΑΡΤΗΣΕΙΣ (Δηλώνονται μία φορά) ---

// Συνάρτηση για το Parallax Background
function updateBackgroundParallax() {
    if (!highlightsSectionForParallax) return;

    const scrollY = window.scrollY;
    const sectionWidth = highlightsSectionForParallax.offsetWidth;
    const sectionHeight = highlightsSectionForParallax.offsetHeight;

    // !!! ΠΡΕΠΕΙ ΝΑ ΑΛΛΑΞΕΙΣ ΑΥΤΑ ΣΤΙΣ ΠΡΑΓΜΑΤΙΚΕΣ ΔΙΑΣΤΑΣΕΙΣ ΤΗΣ 2.jfif !!!
    const originalImageWidth = 1920; // Παράδειγμα: Πλάτος της εικόνας 2.jfif
    const originalImageHeight = 1080; // Παράδειγμα: Ύψος της εικόνας 2.jfif

    let finalImageWidth, finalImageHeight;

    const containerAspectRatio = sectionWidth / sectionHeight;
    const imageAspectRatio = originalImageWidth / originalImageHeight;

    if (imageAspectRatio > containerAspectRatio) {
        finalImageHeight = sectionHeight;
        finalImageWidth = sectionHeight * imageAspectRatio;
    } else {
        finalImageWidth = sectionWidth;
        finalImageHeight = sectionWidth / imageAspectRatio;
    }

    const maxHorizontalMovement = finalImageWidth - sectionWidth;
    const speedFactor = 0.15; // Ρυθμίστε αυτόν τον αριθμό (μικρότερος = λιγότερη κίνηση)

    let desiredPositionX = -scrollY * speedFactor;

    // Περιορίστε την κίνηση της εικόνας
    desiredPositionX = Math.max(-maxHorizontalMovement, desiredPositionX); // Μην πας πιο αριστερά
    desiredPositionX = Math.min(0, desiredPositionX); // Μην πας πιο δεξιά από την αρχική (κέντρο)

    highlightsSectionForParallax.style.backgroundPositionX = `calc(50% + ${desiredPositionX}px)`;

    requestId = requestAnimationFrame(updateBackgroundParallax);
}

// Συνάρτηση για το Ticker Animation
function startTickerJsAnimation() {
    if (!tickerContent || !tickerContainer) return;

    if (tickerAnimation) {
        tickerAnimation.pause();
    }
    tickerContent.style.transform = 'translateX(0)';

    const contentWidth = tickerContent.scrollWidth;
    const containerWidth = tickerContainer.offsetWidth;

    if (contentWidth <= containerWidth) {
        tickerContent.style.transform = 'translateX(0)';
        return;
    }

    const distanceToMove = contentWidth;
    const speedPxPerSec = 90;
    const duration = distanceToMove / speedPxPerSec * 1000;

    tickerAnimation = anime({
        targets: tickerContent,
        translateX: -distanceToMove,
        duration: duration,
        easing: 'linear',
        loop: true,
        autoplay: true
    });
}

// Συνάρτηση για τον χειρισμό του ticker resize
function handleTickerResize() {
    setTimeout(startTickerJsAnimation, 100);
}

// Συνάρτηση για το Cookie Consent Banner
function getCookieConsent() {
    try { return localStorage.getItem('cookieConsent'); } catch (e) { return null; }
}

function showCookieBanner() {
    const cookieBanner = document.getElementById('cookieConsentBanner');
    // Εμφανίζεται μόνο αν ο επισκέπτης δεν έχει ήδη επιλέξει
    if (cookieBanner && !getCookieConsent()) {
        cookieBanner.style.display = 'flex';
    }
}

function hideCookieBanner(consentType) {
    const cookieBanner = document.getElementById('cookieConsentBanner');
    if (cookieBanner) {
        try { localStorage.setItem('cookieConsent', consentType); } catch (e) {}
        cookieBanner.style.display = 'none';
        if (consentType === 'accepted') {
            loadGoogleAnalytics();
        } else {
            clearAnalyticsCookies();
        }
    }
}

// Διαγραφή cookies Google Analytics (όταν ο επισκέπτης απορρίπτει ή αλλάζει γνώμη)
function clearAnalyticsCookies() {
    const host = location.hostname;
    const domains = ['', host, '.' + host, '.' + host.replace(/^www\./, '')];
    document.cookie.split(';').forEach(c => {
        const name = c.split('=')[0].trim();
        if (name.indexOf('_ga') === 0) {
            domains.forEach(d => {
                document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
            });
        }
    });
}

// Το Google Analytics φορτώνει ΜΟΝΟ μετά από «Αποδοχή»
const GA_ID = 'G-Z3JRSJD53V';
function loadGoogleAnalytics() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
}

// --- ΚΕΝΤΡΙΚΟ DOMContentLoaded LISTENER ---
document.addEventListener('DOMContentLoaded', () => {

    // --- Parallax Background Initialization ---
    if (highlightsSectionForParallax) {
        updateBackgroundParallax(); // Ορισμός αρχικής θέσης
        window.addEventListener('scroll', () => {
            if (requestId) {
                cancelAnimationFrame(requestId);
            }
            requestId = requestAnimationFrame(updateBackgroundParallax);
        });
    }

    // --- Text/Card/Diagonal Animation Observer ---
    const animatedElements = document.querySelectorAll('.animated-text, .animated-card, .animated-text-diagonal');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const generalObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Αν θες μόνο μία φορά, κάνε unobserve: observer.unobserve(entry.target);
            } else {
                entry.target.classList.remove('visible'); // Επαναλαμβάνει την κίνηση
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => generalObserver.observe(el));

    // --- Individual Highlight Text Animation Observer (με anime.js) ---
    const elementsToAnimateIndividually = document.querySelectorAll('.highlights .highlight-point h2, .highlights .highlight-point p');
    const handleIndividualAnimation = (entries, observer) => {
        entries.forEach(entry => {
            const targetElement = entry.target;
            if (entry.isIntersecting) {
                anime.remove(targetElement); // Σταματάει προηγούμενη animation
                const currentOpacity = parseFloat(targetElement.style.opacity) || parseFloat(window.getComputedStyle(targetElement).opacity);
                const finalFullOpacity = 1;
                if (currentOpacity < finalFullOpacity - 0.01) {
                    anime({
                        targets: targetElement,
                        opacity: finalFullOpacity,
                        color: '#FFFFFF',
                        duration: 2000,
                        easing: 'easeOutQuad'
                    });
                }
            } else {
                anime.remove(targetElement); // Σταματάει προηγούμενη animation
                const currentOpacity = parseFloat(targetElement.style.opacity) || parseFloat(window.getComputedStyle(targetElement).opacity);
                const initialShadowOpacity = 0.3;
                if (currentOpacity > initialShadowOpacity + 0.01) {
                    anime({
                        targets: targetElement,
                        opacity: initialShadowOpacity,
                        color: 'rgba(255, 255, 255, 0.4)',
                        duration: 800,
                        easing: 'easeOutQuad'
                    });
                }
            }
        });
    };

    const individualObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: [0, 0.1]
    };

    const individualElementObserver = new IntersectionObserver(handleIndividualAnimation, individualObserverOptions);

    elementsToAnimateIndividually.forEach(element => {
        const computedOpacity = parseFloat(window.getComputedStyle(element).opacity);
        const initialShadowOpacity = 0.3;
        if (computedOpacity > initialShadowOpacity + 0.01 || computedOpacity < initialShadowOpacity - 0.01) {
            element.style.opacity = initialShadowOpacity;
            element.style.color = 'rgba(255, 255, 255, 0.4)';
        }
        individualElementObserver.observe(element);
    });

    // --- Back to Top Button and Progress Circle ---
    if (backToTopButton && progressCircle) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }

            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;
            const maxScroll = docHeight - winHeight;
            const scrollProgress = maxScroll > 0 ? (scrollTop / maxScroll) : 0;
            const offset = circumference * (1 - scrollProgress);
            progressCircle.style.strokeDashoffset = offset;
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Ticker Animation Initialization ---
    if (tickerContent && tickerContainer) {
        startTickerJsAnimation(); // Ξεκινήστε την animation αρχικά

        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(entries => {
                handleTickerResize();
            });
            resizeObserver.observe(tickerContainer);
        } else {
            window.addEventListener('resize', handleTickerResize);
        }
    }

    // --- Portfolio Preview Items Animation ---
    const previewItems = document.querySelectorAll('.parallax-content .portfolio-previews .preview-item');
    const previewObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const previewObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(previewItems).indexOf(entry.target);
                const delay = index * 200; // Καθυστέρηση
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target); // Μόνο την πρώτη φορά
            }
        });
    }, previewObserverOptions);

    previewItems.forEach(item => {
        previewObserver.observe(item);
    });

    // --- Hamburger Menu Toggle ---
    const hamburgerToggle = document.querySelector('.hamburger-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerToggle && navLinks) {
        hamburgerToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            document.body.classList.toggle('no-scroll'); // Προσθέστε/αφαιρέστε κλάση για no-scroll
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    document.body.classList.remove('no-scroll');
                }
            });
        });

        document.addEventListener('click', (event) => {
            if (!navLinks.contains(event.target) && !hamburgerToggle.contains(event.target) && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // --- Cookie Consent Banner ---
    const cookieBanner = document.getElementById('cookieConsentBanner');
    const acceptCookiesBtn = document.getElementById('acceptCookies');
    const declineCookiesBtn = document.getElementById('declineCookies');

    if (cookieBanner && acceptCookiesBtn && declineCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            hideCookieBanner('accepted');
        });

        declineCookiesBtn.addEventListener('click', () => {
            hideCookieBanner('declined');
        });

        document.addEventListener('languageChanged', (event) => {
            showCookieBanner();
        });
        showCookieBanner(); // Εμφάνιση του banner μόνο αν δεν υπάρχει επιλογή
    }

    // --- Footer: «Ρυθμίσεις cookies» ξανανοίγει το banner ---
    const cookieSettingsBtn = document.getElementById('cookie-settings');
    if (cookieSettingsBtn) {
        cookieSettingsBtn.addEventListener('click', () => {
            try { localStorage.removeItem('cookieConsent'); } catch (e) {}
            clearAnalyticsCookies();
            showCookieBanner();
        });
    }

    // --- Κάθε CTA προεπιλέγει το αντίστοιχο πακέτο στη φόρμα ---
    const planSelect = document.querySelector('#contactForm select[name="project_type"]');
    if (planSelect) {
        document.querySelectorAll('a[data-plan]').forEach(link => {
            link.addEventListener('click', () => { planSelect.value = link.dataset.plan; });
        });
    }

    // --- Intro: κόβεται με οποιαδήποτε κίνηση του επισκέπτη ---
    const root = document.documentElement;
    if (root.classList.contains('intro')) {
        const skip = () => root.classList.add('intro-skip');
        ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(ev =>
            window.addEventListener(ev, skip, { once: true, passive: true }));
        setTimeout(skip, 7000);
    }

    // --- Hero video: αργή κίνηση ---
    // Ταχύτητα βίντεο: 1 = κανονική, 0.75 = ήρεμη, 0.5 = πολύ αργή (λιγότερο ομαλή)
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        const HERO_SPEED = 0.75;
        const applySpeed = () => {
            heroVideo.defaultPlaybackRate = HERO_SPEED;
            heroVideo.playbackRate = HERO_SPEED;
        };
        applySpeed();
        heroVideo.addEventListener('loadedmetadata', applySpeed);
        heroVideo.addEventListener('play', applySpeed);
    }

    // --- Mobile Sticky CTA ---
    const mobileCta = document.getElementById('mobileCta');
    if (mobileCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                mobileCta.classList.add('show');
            } else {
                mobileCta.classList.remove('show');
            }
        });
    }

    // Αν ο επισκέπτης έχει ήδη αποδεχτεί σε προηγούμενη επίσκεψη
    if (getCookieConsent() === 'accepted') {
        loadGoogleAnalytics();
    }

}); // Τέλος του ΕΝΙΑΙΟΥ DOMContentLoaded listener