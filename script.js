// Εμφάνιση κειμένων/εικόνων με scroll animation
const animatedElements = document.querySelectorAll('.animated-text, .animated-card');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

animatedElements.forEach(el => observer.observe(el));
document.addEventListener('DOMContentLoaded', () => {
    // Επιλέγουμε όλα τα στοιχεία που θέλουμε να παρακολουθήσουμε για animations
    const animatedElements = document.querySelectorAll('.animated-text, .animated-card');

    // Ορίζουμε τις επιλογές για τον Observer
    const observerOptions = {
        root: null, // Ορίζει το viewport ως το πλαίσιο αναφοράς
        rootMargin: '0px', // Δεν προσθέτει επιπλέον margin στο viewport
        threshold: 0.1 // Το callback θα εκτελεστεί όταν το 10% του στοιχείου είναι ορατό
    };

    // Δημιουργούμε έναν Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Ελέγχουμε αν το στοιχείο είναι εντός του viewport
            if (entry.isIntersecting) {
                // Αν είναι ορατό, προσθέτουμε την κλάση 'visible'
                entry.target.classList.add('visible');
                // Αν θέλεις η κίνηση να γίνεται μόνο την πρώτη φορά, θα έβαζες εδώ observer.unobserve(entry.target);
                // Αλλά για να γίνεται κάθε φορά που μπαίνει στο viewport, ΔΕΝ κάνουμε unobserve.
            } else {
                // Αν δεν είναι ορατό, αφαιρούμε την κλάση 'visible'
                // Αυτό είναι το κλειδί για να επαναλάβεις την κίνηση όταν ξανα-μπει στο viewport
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    // Ξεκινάμε να παρακολουθούμε κάθε στοιχείο που επιλέξαμε
    animatedElements.forEach(element => {
        observer.observe(element);
    });
});
// script.js

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".section, .animated-card").forEach(el => {
    observer.observe(el);
  });
});
// Back to Top Button with Progress Circle functionality
const backToTopButton = document.getElementById('back-to-top');
const progressCircle = backToTopButton.querySelector('.progress-circle'); // Βρες τον κύκλο προόδου
const radius = progressCircle.r.baseVal.value; // Βρες την ακτίνα
const circumference = 2 * Math.PI * radius; // Υπολόγισε την περίμετρο

// Ορίσε το αρχικό stroke-dasharray (ίσο με την περίμετρο)
progressCircle.style.strokeDasharray = circumference;
// Απόκρυψε αρχικά την πρόοδο (θέτοντας το offset ίσο με την περίμετρο)
progressCircle.style.strokeDashoffset = circumference;


const scrollThreshold = 400; // Απόσταση σε pixels για να εμφανιστεί το κουμπί

// Εμφάνιση/Απόκρυψη του κουμπιού ΚΑΙ Ενημέρωση της προόδου κατά το scroll
window.addEventListener('scroll', () => {
    // Ενημέρωση ορατότητας κουμπιού (ο κώδικας είναι ο ίδιος με πριν)
    if (window.scrollY > scrollThreshold) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }

    // Ενημέρωση Κυκλικού Δείκτη Προόδου
    const scrollTop = window.scrollY; // Τρέχουσα θέση scroll από την κορυφή
    const docHeight = document.documentElement.scrollHeight; // Συνολικό ύψος σελίδας
    const winHeight = window.innerHeight; // Ύψος viewport

    // Υπολόγισε το μέγιστο ύψος που μπορεί να γίνει scroll
    const maxScroll = docHeight - winHeight;

    // Υπολόγισε την πρόοδο scroll (από 0 έως 1)
    // Αποφυγή διαίρεσης με το μηδέν αν η σελίδα δεν είναι scrollable
    const scrollProgress = maxScroll > 0 ? (scrollTop / maxScroll) : 0;

    // Υπολόγισε το stroke-dashoffset
    // Όταν το scrollProgress είναι 0, το offset είναι circumference (κύκλος κρυμμένος)
    // Όταν το scrollProgress είναι 1, το offset είναι 0 (κύκλος γεμάτος)
    const offset = circumference * (1 - scrollProgress);

    // Εφάρμοσε το offset στον κύκλο προόδου
    progressCircle.style.strokeDashoffset = offset;
});

// Κύλιση στην κορυφή όταν πατηθεί το κουμπί (ο κώδικας είναι ο ίδιος με πριν)
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Ομαλή κύλιση
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Επιλέγουμε όλα τα στοιχεία που θέλουμε να παρακολουθήσουμε για animations
    // Προσθέστε την κλάση '.animated-text-diagonal' στην παρακάτω γραμμή:
    const animatedElements = document.querySelectorAll('.animated-text, .animated-card, .animated-text-diagonal'); // <-- ΕΝΗΜΕΡΩΜΕΝΗ ΓΡΑΜΜΗ

    // Ο υπόλοιπος κώδικας του Intersection Observer παραμένει ο ίδιος
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Μπορείς να το αλλάξεις αν θες να ενεργοποιείται νωρίτερα/αργότερα
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Αν θέλεις η κίνηση να γίνεται μόνο την πρώτη φορά, βάλε εδώ:
                // observer.unobserve(entry.target);
            } else {
                // Αν θέλεις η κίνηση να επαναλαμβάνεται, αφαίρεσε την κλάση όταν βγαίνει από το viewport
                 entry.target.classList.remove('visible'); // <-- ΚΡΑΤΗΣΤΕ ΑΥΤΟ ΓΙΑ ΕΠΑΝΑΛΗΨΗ
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // ... rest of your JS code (Back to Top button etc.)
});// Στο script.js - Ενσωματώστε αυτό τον κώδικα, αντικαθιστώντας τον προηγούμενο κώδικα για την ενότητα highlights.

// ... (κρατήστε τον υπόλοιπο κώδικα σας, π.χ. για back-to-top, άλλα animations κλπ) ...

// Βρείτε ΟΛΑ τα στοιχεία κειμένου (h3, p) μέσα στα highlight-point divs.
// Θα τα παρακολουθήσουμε ΞΕΧΩΡΙΣΤΑ.
const elementsToAnimateIndividually = document.querySelectorAll('.highlights .highlight-point h2, .highlights .highlight-point p');

// Δεν χρειαζόμαστε πλέον το Map 'activeHighlightsAnimation' αφού το animejs
// μπορεί να σταματήσει animation σε συγκεκριμένο στόχο (το element) άμεσα.

// Intersection Observer callback για ΚΑΘΕ ΞΕΧΩΡΙΣΤΟ στοιχείο
const handleIndividualAnimation = (entries, observer) => {
    entries.forEach(entry => {
        const targetElement = entry.target; // Αυτό είναι το συγκεκριμένο h3 ή p που παρακολουθούμε

        // Βεβαιωθείτε ότι το στοιχείο υπάρχει και είναι ορατό ή μη ορατό
        if (entry.isIntersecting) {
            // Το στοιχείο μπήκε (ή βρίσκεται) στο viewport

            // Σταματήστε τυχόν animation που τρέχει ή εκκρεμεί σε αυτό το συγκεκριμένο στοιχείο
            anime.remove(targetElement);

            // Ξεκινήστε την animation "φωτισμού" (εμφάνιση) για ΑΥΤΟ το στοιχείο
            // Ελέγχουμε την τρέχουσα opacity για να δούμε αν χρειάζεται animation
             const currentOpacity = parseFloat(targetElement.style.opacity) || parseFloat(window.getComputedStyle(targetElement).opacity);
             const finalFullOpacity = 1;

             if (currentOpacity < finalFullOpacity - 0.01) { // Ελέγχουμε αν δεν είναι ήδη τελείως ορατό
                anime({
                    targets: targetElement, // Στόχος είναι ΤΟ ΣΥΓΚΕΚΡΙΜΕΝΟ στοιχείο
                    opacity: finalFullOpacity, // Τελική opacity
                    color: '#FFFFFF', // Τελικό χρώμα (λευκό ή το χρώμα του κειμένου σας)
                    duration: 2000, // <-- ΔΙΑΡΚΕΙΑ animation (πιο αργή, 2 δευτερόλεπτα)
                    easing: 'easeOutQuad'
                    // Μπορείτε να προσθέσετε μια μικρή καθυστέρηση εδώ αν θέλετε
                    // animation: delay: 100, // Καθυστέρηση 100ms αφότου το στοιχείο γίνει ορατό
                    // complete: function(anim) { console.log('Element entered and animated:', targetElement); }
                });
             }


        } else {
            // Το στοιχείο βγήκε (ή βρίσκεται εκτός) από το viewport

            // Σταματήστε τυχόν animation που τρέχει ή εκκρεμεί σε αυτό το συγκεκριμένο στοιχείο
             anime.remove(targetElement);

            // Ξεκινήστε την animation επιστροφής στην κατάσταση "σκιάς" για ΑΥΤΟ το στοιχείο
            // Ελέγχουμε την τρέχουσα opacity για να δούμε αν χρειάζεται animation επιστροφής
            const currentOpacity = parseFloat(targetElement.style.opacity) || parseFloat(window.getComputedStyle(targetElement).opacity);
            const initialShadowOpacity = 0.3;

             if (currentOpacity > initialShadowOpacity + 0.01) { // Ελέγχουμε αν δεν είναι ήδη στην κατάσταση σκιάς
                 anime({
                     targets: targetElement, // Στόχος είναι ΤΟ ΣΥΓΚΕΚΡΙΜΕΝΟ στοιχείο
                     opacity: initialShadowOpacity, // Επιστροφή σε opacity σκιάς
                     color: 'rgba(255, 255, 255, 0.4)', // Επιστροφή σε χρώμα σκιάς
                     duration: 800, // Διάρκεια animation επιστροφής (μπορεί να είναι διαφορετική)
                     easing: 'easeOutQuad'
                     // complete: function(anim) { console.log('Element exited and reset:', targetElement); }
                 });
             }
        }
    });
};

// Observer options
const individualObserverOptions = {
    root: null, // viewport
    rootMargin: '0px',
    // Χρησιμοποιούμε thresholds στο 0 και στο 0.1. Αυτό σημαίνει:
    // - Ενεργοποίηση όταν 0% του στοιχείου είναι ορατό (βγήκε εντελώς).
    // - Ενεργοποίηση όταν 10% του στοιχείου είναι ορατό (μπήκε από πάνω ή κάτω).
    // Αυτό κάνει την animation να ενεργοποιείται μόλις το στοιχείο φτάσει κοντά στο όριο της οθόνης.
    threshold: [0, 0.1]
};

// Create την observer instance
const individualElementObserver = new IntersectionObserver(handleIndividualAnimation, individualObserverOptions);

// Ξεκινήστε την παρακολούθηση ΚΑΘΕ ΞΕΧΩΡΙΣΤΟΥ στοιχείου κειμένου
elementsToAnimateIndividually.forEach(element => {
    // **ΣΗΜΑΝΤΙΚΟ:** Βεβαιωθείτε ότι τα στοιχεία ξεκινούν με το στυλ "σκιάς"
    // όταν φορτώνει η σελίδα. Το CSS πρέπει να ορίσει αυτό το αρχικό στυλ.
    // Για επιπλέον σιγουριά, μπορούμε να θέσουμε το style inline εδώ,
    // αν το computed style δεν είναι ήδη κοντά στην επιθυμητή opacity σκιάς.
    const computedOpacity = parseFloat(window.getComputedStyle(element).opacity);
    const initialShadowOpacity = 0.3;

    // Θέτουμε inline style μόνο αν το τρέχον opacity (computed ή inline)
    // δεν είναι ήδη κοντά στην αρχική opacity σκιάς.
    // Αυτό αποτρέπει flickers αν το CSS έχει ήδη κάνει τη δουλειά.
     if (computedOpacity > initialShadowOpacity + 0.01 || computedOpacity < initialShadowOpacity - 0.01) {
         element.style.opacity = initialShadowOpacity;
         element.style.color = 'rgba(255, 255, 255, 0.4)'; // Βεβαιωθείτε και για το χρώμα
     }

    individualElementObserver.observe(element); // Παρακολούθηση του συγκεκριμένου στοιχείου
});

// ... υπόλοιπος κώδικας του script.js (π.χ. για άλλα animated-text στοιχεία, back-to-top κλπ) ...
// **ΑΦΑΙΡΕΣΤΕ** τον προηγούμενο κώδικα Observer που παρακολουθούσε ολόκληρη την ενότητα highlights.
// Στο script.js - Ενσωματώστε αυτό τον κώδικα

// ... (κρατήστε όλο τον προηγούμενο κώδικα σας, συμπεριλαμβανομένων των Observers για τις animations κειμένου) ...

// Βρείτε την ενότητα highlights για το parallax background
const highlightsSectionForParallax = document.querySelector('.highlights');

// --- Παρακολούθηση Scroll για Background Parallax ---

let requestId = null; // Για να διαχειριστούμε το requestAnimationFrame

function updateBackgroundParallax() {
    // Βεβαιωθείτε ότι η ενότητα υπάρχει
    if (!highlightsSectionForParallax) return;

    // Πάρτε την τρέχουσα κάθετη θέση scroll της σελίδας
    const scrollY = window.scrollY;

    // Υπολογίστε τη νέα οριζόντια θέση background.
    // Προσαρμόστε το 'speedFactor' (π.χ. 0.05, 0.1, 0.2) για να ελέγξετε την ταχύτητα κίνησης.
    // Ένας θετικός παράγοντας κάνει την εικόνα να κινείται προς τα αριστερά (-X)
    // όταν ο scrollY αυξάνεται (scroll κάτω).
    const speedFactor = 0.15; // <-- Ρυθμίστε αυτόν τον αριθμό για την ταχύτητα
    const newPositionX = -scrollY * speedFactor; // Όσο αυξάνεται το scrollY, τόσο πιο αρνητικό γίνεται το newPositionX (κίνηση αριστερά)

    // Εφαρμόστε τη νέα θέση στην ιδιότητα background-position-x του στυλ του στοιχείου.
    // Χρησιμοποιούμε template literals και 'px' για τη μονάδα.
    highlightsSectionForParallax.style.backgroundPositionX = `${newPositionX}px`;

    // Ζητήστε το επόμενο frame animation για να συνεχίσετε την ενημέρωση
    requestId = requestAnimationFrame(updateBackgroundParallax);
}

// Ξεκινήστε να ακούτε για scroll events ΜΟΛΙΣ φορτώσει το DOM
document.addEventListener('DOMContentLoaded', () => {
    if (highlightsSectionForParallax) {
        // Καλέστε την updateBackgroundParallax μία φορά για να ορίσει την αρχική θέση με βάση το αρχικό scroll
        // (αν η σελίδα δεν είναι στην κορυφή στην φόρτωση)
        updateBackgroundParallax();

        // Προσθέστε τον event listener για το scroll.
        // Μέσα στον listener, απλά ζητάμε ένα frame animation.
        // Η requestAnimationFrame εσωτερικά φροντίζει να μην τρέχει ο κώδικας ενημέρωσης
        // πιο συχνά από όσο χρειάζεται ο browser για να ζωγραφίσει το επόμενο frame.
        window.addEventListener('scroll', () => {
            // Ακυρώστε τυχόν εκκρεμή αιτήματα animation για να αποφύγετε περιττές κλήσεις
            if (requestId) {
                cancelAnimationFrame(requestId);
            }
            // Ζητήστε ένα νέο frame animation
            requestId = requestAnimationFrame(updateBackgroundParallax);
        });

        // Προαιρετικό: Μπορείτε να σταματήσετε την animation αν η ενότητα είναι πολύ μακριά από το viewport
        // για να εξοικονομήσετε πόρους, χρησιμοποιώντας έναν IntersectionObserver για αυτό.
        // Για τώρα, η animation τρέχει πάντα στο scroll.
    }
});


// ... (κρατήστε όλο τον υπόλοιπο κώδικα σας, συμπεριλαμβανομένων των Observers για τις animations κειμένου) ...
// Βεβαιωθείτε ότι ο κώδικας για το parallax background δεν αντικαθιστά ή συγκρούεται
// με τον κώδικα για τις animations κειμένου.
// Στο script.js

// ... (κρατήστε τον προηγούμενο κώδικα σας για άλλες ενότητες, animations, observers κλπ) ...

// --- Ticker Animation με JS (για συνεχή κύλιση) ---
const tickerContainer = document.querySelector('.contact .contact-intro-banner');
const tickerContent = tickerContainer ? tickerContainer.querySelector('.ticker-content') : null;

let tickerAnimation = null;
let resizeObserver = null; // Για να χειριστούμε αλλαγές μεγέθους οθόνης/container

function startTickerJsAnimation() {
    // Βεβαιωθείτε ότι τα στοιχεία υπάρχουν
    if (!tickerContent || !tickerContainer) return;

    // Σταματήστε τυχόν animation που τρέχει ή εκκρεμεί
    if (tickerAnimation) {
        tickerAnimation.pause(); // Ή stop() αν θέλετε να την τερματίσετε εντελώς
    }

    // Επαναφέρετε τη θέση για να ξεκινήσει από την αρχή
    tickerContent.style.transform = 'translateX(0)';


    // Μετρήστε το πλάτος του περιεχομένου (ολόκληρης της γραμμής κειμένου)
    // Χρησιμοποιούμε scrollWidth για να πάρουμε το πλήρες πλάτος ακόμα κι αν είναι κρυμμένο από overflow
    const contentWidth = tickerContent.scrollWidth;
    // Μπορείτε επίσης να χρησιμοποιήσετε getBoundingClientRect().width, αλλά scrollWidth είναι συχνά καλύτερο για το πλήρες, μη κρυμμένο πλάτος.
    // const contentWidth = tickerContent.getBoundingClientRect().width;


    // Μετρήστε το πλάτος του ορατού container
    const containerWidth = tickerContainer.offsetWidth;

    // Αν το περιεχόμενο είναι πιο κοντό από τον ορατό χώρο, δεν χρειάζεται κύλιση
    // Μπορείτε να το κεντράρετε σε αυτή την περίπτωση αν θέλετε
     if (contentWidth <= containerWidth) {
         tickerContent.style.transform = 'translateX(0)'; // Σιγουρευτείτε ότι είναι στην αρχή
         // Προαιρετικά, αν θέλετε να το κεντράρετε:
         // tickerContent.style.textAlign = 'center'; // Προσθέστε text-align στο ticker-content CSS
         // remove animation properties
         return;
     }


    // Υπολογίστε την απόσταση που πρέπει να διανύσει το κείμενο σε ένα πλήρη κύκλο.
    // Είναι το πλάτος του περιεχομένου.
    const distanceToMove = contentWidth;

    // Ορίστε την επιθυμητή ταχύτητα κύλισης (π.χ., pixels ανά δευτερόλεπτο)
    const speedPxPerSec = 90; // <-- ΡΥΘΜΙΣΕ ΤΑΧΥΤΗΤΑ ΕΔΩ (π.χ. 30, 40, 50, 80 pixels/sec)

    // Υπολογίστε τη διάρκεια της animation με βάση την απόσταση και την ταχύτητα
    const duration = distanceToMove / speedPxPerSec * 1000; // Διάρκεια σε milliseconds

    // Ξεκινήστε την animation με το animejs
    tickerAnimation = anime({
        targets: tickerContent, // Στόχος είναι το ticker-content
        translateX: -distanceToMove, // Μετακίνηση αριστερά κατά το πλάτος του περιεχομένου
        duration: duration, // Διάρκεια που υπολογίσαμε
        easing: 'linear', // Σταθερή ταχύτητα
        loop: true, // <-- Κάνει την animation να επαναλαμβάνεται ατέρμονα
        autoplay: true // Ξεκινάει αμέσως
    });
}

// Χειριστείτε την αλλαγή μεγέθους οθόνης για να επαναμετρήσετε και να επανεκκινήσετε την animation
function handleTickerResize() {
     // Δώστε λίγο χρόνο στον browser να ολοκληρώσει το resize rendering
     setTimeout(startTickerJsAnimation, 100); // Καθυστερημένη επανεκκίνηση animation
}


// Ξεκινήστε την animation όταν το DOM είναι πλήρως φορτωμένο
document.addEventListener('DOMContentLoaded', () => {
    if (tickerContent && tickerContainer) {
         // Ξεκινήστε την animation αρχικά
         startTickerJsAnimation();

         // Χρησιμοποιήστε ResizeObserver για να παρακολουθήσετε αλλαγές μεγέθους στο container του ticker
         if (typeof ResizeObserver !== 'undefined') {
             resizeObserver = new ResizeObserver(entries => {
                 // Επανεκκινήστε την animation όταν αλλάζουν οι διαστάσεις του container
                 handleTickerResize(); // Χρησιμοποιούμε την ίδια handleTickerResize
             });
             resizeObserver.observe(tickerContainer); // Παρακολουθήστε τον περιέκτη
         } else {
             // Fallback για παλιότερους browsers: παρακολουθήστε το window resize
             window.addEventListener('resize', handleTickerResize);
         }
    }
});

// Προαιρετικό: Καθαρισμός Observer/Animation αν χρειαστεί (για πιο σύνθετες εφαρμογές)
/*
window.addEventListener('beforeunload', () => {
    if (tickerAnimation) tickerAnimation.pause();
    if (resizeObserver && tickerContainer) resizeObserver.unobserve(tickerContainer);
    if (window.removeEventListener) window.removeEventListener('resize', handleTickerResize);
});
*/


// ... (κρατήστε όλο τον υπόλοιπο κώδικα σας) ...
// Βεβαιωθείτε ότι αυτός ο κώδικας δεν συγκρούεται με άλλους.
// ΑΦΑΙΡΕΣΤΕ ΟΠΟΙΟΝΔΗΠΟΤΕ ΠΡΟΗΓΟΥΜΕΝΟ ΚΩΔΙΚΑ ΓΙΑ ΤΟ HIGHLIGHTS/CONTACT ANIMATION (CSS @keyframes & JS Observers/animations για αυτά).

// Στο script.js

// ... (Κρατήστε όλο τον προηγούμενο κώδικα σας, συμπεριλαμβανομένων των Observers και λειτουργιών μέσα στο DOMContentLoaded listener) ...

document.addEventListener('DOMContentLoaded', () => {
    // ... (Ο υπάρχων κώδικας) ...

    // --- Animation για Portfolio Preview Items ---
    const previewItems = document.querySelectorAll('.parallax-content .portfolio-previews .preview-item');

    const previewObserverOptions = {
        root: null, // Χρησιμοποιούμε το viewport
        rootMargin: '0px',
        threshold: 0.2 // <-- ΡΥΘΜΙΣΕ: Ποσοστό ορατότητας για ενεργοποίηση
    };

    const previewObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(previewItems).indexOf(entry.target);

                // --- ΑΛΛΑΓΗ: Μεγαλύτερος πολλαπλασιαστής για την καθυστέρηση ---
                const delay = index * 200; // <-- ΑΥΞΗΣΗ ΚΑΘΥΣΤΕΡΗΣΗΣ: Τώρα 200ms ανά στοιχείο (αντί για 100ms)

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                // Σταμάτα να παρακολουθείς μετά την πρώτη εμφάνιση
                observer.unobserve(entry.target);
            }
            /* ... (optional else block) ... */
        });
    }, previewObserverOptions);

    // Ξεκίνησε να παρακολουθείς ΚΑΘΕ preview item
    previewItems.forEach(item => {
        previewObserver.observe(item);
    });

    // ... (Κρατήστε όλο τον υπόλοιπο κώδικα σας μέσα στο DOMContentLoaded listener) ...

}); // Τέλος του ΕΝΙΑΙΟΥ DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerToggle = document.querySelector('.hamburger-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerToggle && navLinks) {
        hamburgerToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            // Προαιρετικά: Αλλάξτε το σύμβολο του hamburger σε X και αντίστροφα
            // hamburgerToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
            // Επίσης, ίσως θέλετε να απενεργοποιήσετε την κύλιση της σελίδας όταν το menu είναι ανοιχτό
            // document.body.classList.toggle('no-scroll');
        });

        // Προαιρετικό: Κλείστε το menu όταν ο χρήστης πατάει σε ένα link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    // Επαναφέρετε το σύμβολο του hamburger αν το αλλάζετε
                    // hamburgerToggle.textContent = '☰';
                    // Επαναφέρετε την κύλιση της σελίδας αν την απενεργοποιήσατε
                    // document.body.classList.remove('no-scroll');
                }
            });
        });

         // Προαιρετικό: Κλείστε το menu αν ο χρήστης κάνει κλικ έξω από αυτό
         document.addEventListener('click', (event) => {
             // Ελέγξτε αν το κλικ έγινε εκτός του navLinks και εκτός του hamburgerToggle
             if (!navLinks.contains(event.target) && !hamburgerToggle.contains(event.target) && navLinks.classList.contains('open')) {
                 navLinks.classList.remove('open');
                 // Επαναφέρετε το σύμβολο του hamburger
                 // hamburgerToggle.textContent = '☰';
                 // Επαναφέρετε την κύλιση
                 // document.body.classList.remove('no-scroll');
             }
         });
    }
});

// Αν χρησιμοποιείτε την επιλογή no-scroll, προσθέστε αυτό το CSS:
/*
.no-scroll {
    overflow: hidden;
}
*/
