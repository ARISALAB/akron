// script.js - ΕΝΟΠΟΙΗΜΕΝΟΣ ΚΩΔΙΚΑΣ ΜΕ ΔΙΟΡΘΩΣΕΙΣ ΓΙΑ PARALLAX

// Βρείτε την ενότητα highlights για το parallax background (πρέπει να είναι εκτός DOMContentLoaded για προσβασιμότητα)
const highlightsSectionForParallax = document.querySelector('.highlights');
let requestId = null; // Για να διαχειριστούμε το requestAnimationFrame

// Αυτές οι σταθερές πρέπει να βρίσκονται στην κορυφή του αρχείου JS σου
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

/**
 * Ενημερώνει τη θέση του background για το parallax effect.
 */
function updateBackgroundParallax() {
    if (!highlightsSectionForParallax) return;

    const scrollY = window.scrollY;
    const sectionWidth = highlightsSectionForParallax.offsetWidth;
    const sectionHeight = highlightsSectionForParallax.offsetHeight;

    // Πραγματικές διαστάσεις της εικόνας 2.jfif
    const originalImageWidth = 2048;
    const originalImageHeight = 2048;

    let finalImageWidth, finalImageHeight;

    const containerAspectRatio = sectionWidth / sectionHeight;
    const imageAspectRatio = originalImageWidth / originalImageHeight;

    // Υπολογισμός του μεγέθους της εικόνας με βάση το 'cover'
    if (imageAspectRatio > containerAspectRatio) {
        // Η εικόνα είναι πιο "φαρδιά" αναλογικά από τον container
        finalImageHeight = sectionHeight;
        finalImageWidth = sectionHeight * imageAspectRatio;
    } else {
        // Η εικόνα είναι πιο "ψηλή" αναλογικά από τον container (όπως μια τετράγωνη σε φαρδύ container)
        finalImageWidth = sectionWidth;
        finalImageHeight = sectionWidth / imageAspectRatio;
    }

    // Το πόσο μπορεί να κινηθεί η εικόνα οριζόντια, χωρίς να εμφανιστεί κενό
    let maxHorizontalMovement = finalImageWidth - sectionWidth;

    // Εάν η εικόνα, μετά το 'cover', είναι μικρότερη ή ίση σε πλάτος με το section,
    // τότε δεν υπάρχει περιθώριο για κίνηση.
    // Την μεγαλώνουμε τεχνητά για να δημιουργήσουμε αυτό το περιθώριο.
    if (maxHorizontalMovement <= 0) {
        // Κάνουμε την εικόνα 20% μεγαλύτερη από το πλάτος του section για να υπάρχει πάντα κίνηση
        finalImageWidth = sectionWidth * 1.2;
        maxHorizontalMovement = finalImageWidth - sectionWidth;
    }

    // Ρυθμίστε το 'speedFactor' για να ελέγξετε την ταχύτητα κίνησης.
    const speedFactor = 0.15; // Δοκίμασε και τιμές όπως 0.08, 0.1, 0.2

    // Υπολογίστε την επιθυμητή μετατόπιση με βάση το scrollY
    let desiredPositionX = -scrollY * speedFactor;

    // Περιορίστε την κίνηση της εικόνας ώστε να μην βγαίνει εκτός ορίων.
    // Η κίνηση ξεκινά από το κέντρο (50%), οπότε το offset είναι relative σε αυτό.
    desiredPositionX = Math.max(-maxHorizontalMovement / 2, desiredPositionX); // Μην πας πιο αριστερά από το διαθέσιμο μισό εύρος
    desiredPositionX = Math.min(maxHorizontalMovement / 2, desiredPositionX); // Μην πας πιο δεξιά από το διαθέσιμο μισό εύρος

    // Εφαρμόστε τη νέα θέση στην ιδιότητα background-position-x του στυλ του στοιχείου.
    highlightsSectionForParallax.style.backgroundPositionX = `calc(50% + ${desiredPositionX}px)`;

    requestId = requestAnimationFrame(updateBackgroundParallax);
}


/**
 * Ξεκινά την animation κύλισης του ticker.
 */
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
    const speedPxPerSec = 90; // Ρυθμίστε ταχύτητα εδώ
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

/**
 * Χειρίζεται την επανεκκίνηση του ticker animation μετά από αλλαγή μεγέθους.
 */
function handleTickerResize() {
    setTimeout(startTickerJsAnimation, 100);
}

/**
 * Εμφανίζει το cookie consent banner.
 */
function showCookieBanner() {
    const cookieBanner = document.getElementById('cookieConsentBanner');
    if (cookieBanner) {
        cookieBanner.style.display = 'flex'; // Πάντα εμφανές για δοκιμή
    }
}

/**
 * Κρύβει το cookie consent banner και αποθηκεύει την επιλογή.
 * @param {string} consentType - 'accepted' ή 'declined'.
 */
function hideCookieBanner(consentType) {
    const cookieBanner = document.getElementById('cookieConsentBanner');
    if (cookieBanner) {
        localStorage.setItem('cookieConsent', consentType);
        cookieBanner.style.display = 'none';
        if (consentType === 'accepted') {
            loadGoogleAnalytics(); // Φορτώνει GA αν δοθεί συγκατάθεση
        }
    }
}

/**
 * Φορτώνει το Google Analytics script (placeholder).
 */
function loadGoogleAnalytics() {
    console.log('Google Analytics loaded (or would be if uncommented).');
}

// --- ΚΕΝΤΡΙΚΟ DOMContentLoaded LISTENER ---
// Όλος ο κώδικας που αλληλεπιδρά με το DOM πρέπει να βρίσκεται εδώ μέσα
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
        root: null, // Viewport ως πλαίσιο αναφοράς
        rootMargin: '0px',
        threshold: 0.1 // Ενεργοποιείται όταν το 10% του στοιχείου είναι ορατό
    };

    const generalObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Αν θες η animation να παίζει μόνο την πρώτη φορά, κάνε unobserve: observer.unobserve(entry.target);
            } else {
                entry.target.classList.remove('visible'); // Επαναλαμβάνει την κίνηση όταν βγαίνει και ξαναμπαίνει
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
                anime.remove(targetElement); // Σταματάει τυχόν προηγούμενη animation
                const currentOpacity = parseFloat(targetElement.style.opacity) || parseFloat(window.getComputedStyle(targetElement).opacity);
                const finalFullOpacity = 1;
                if (currentOpacity < finalFullOpacity - 0.01) { // Ελέγχουμε αν δεν είναι ήδη πλήρως ορατό
                    anime({
                        targets: targetElement,
                        opacity: finalFullOpacity,
                        color: '#FFFFFF', // Τελικό χρώμα (λευκό)
                        duration: 2000, // Διάρκεια animation σε ms
                        easing: 'easeOutQuad'
                    });
                }
            } else {
                anime.remove(targetElement); // Σταματάει τυχόν προηγούμενη animation
                const currentOpacity = parseFloat(targetElement.style.opacity) || parseFloat(window.getComputedStyle(targetElement).opacity);
                const initialShadowOpacity = 0.3; // Αρχική opacity "σκιάς"
                if (currentOpacity > initialShadowOpacity + 0.01) { // Ελέγχουμε αν δεν είναι ήδη στην κατάσταση σκιάς
                    anime({
                        targets: targetElement,
                        opacity: initialShadowOpacity,
                        color: 'rgba(255, 255, 255, 0.4)', // Χρώμα σκιάς
                        duration: 800, // Διάρκεια animation επιστροφής
                        easing: 'easeOutQuad'
                    });
                }
            }
        });
    };

    const individualObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: [0, 0.1] // Ενεργοποιείται στο 0% (όταν βγαίνει) και στο 10% (όταν μπαίνει)
    };

    const individualElementObserver = new IntersectionObserver(handleIndividualAnimation, individualObserverOptions);

    elementsToAnimateIndividually.forEach(element => {
        // Βεβαιωθείτε ότι τα στοιχεία ξεκινούν με το στυλ "σκιάς"
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
            // Ορατότητα κουμπιού
            if (window.scrollY > scrollThreshold) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }

            // Ενημέρωση Κυκλικού Δείκτη Προόδου
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

        // Χρήση ResizeObserver για να παρακολουθήσετε αλλαγές μεγέθους στο container του ticker
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(entries => {
                handleTickerResize();
            });
            resizeObserver.observe(tickerContainer);
        } else {
            // Fallback για παλιότερους browsers
            window.addEventListener('resize', handleTickerResize);
        }
    }

    // --- Portfolio Preview Items Animation ---
    const previewItems = document.querySelectorAll('.parallax-content .portfolio-previews .preview-item');
    const previewObserverOptions = {
        root: null, // Χρησιμοποιούμε το viewport
        rootMargin: '0px',
        threshold: 0.2 // Ποσοστό ορατότητας για ενεργοποίηση
    };

    const previewObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(previewItems).indexOf(entry.target);
                const delay = index * 200; // Καθυστέρηση animation ανά στοιχείο (πιο αργή)
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target); // Σταμάτα να παρακολουθείς μετά την πρώτη εμφάνιση
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
            // Προσθήκη/αφαίρεση κλάσης για απενεργοποίηση κύλισης στη σελίδα
            document.body.classList.toggle('no-scroll');
        });

        // Κλείσιμο menu όταν πατηθεί ένα link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    document.body.classList.remove('no-scroll');
                }
            });
        });

        // Κλείσιμο menu αν ο χρήστης κάνει κλικ έξω από αυτό
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

        // Όταν αλλάζει η γλώσσα, βεβαιωνόμαστε ότι το banner εμφανίζεται αν χρειάζεται
        document.addEventListener('languageChanged', (event) => {
            showCookieBanner();
        });
        showCookieBanner(); // Εμφάνιση του banner μόλις φορτώσει η σελίδα (πάντα εμφανές για δοκιμή)
    }

}); // Τέλος του ΕΝΙΑΙΟΥ DOMContentLoaded listener
