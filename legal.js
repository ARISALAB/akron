// Νομικές σελίδες: γλώσσα (κοινή με την αρχική) + ρυθμίσεις cookies
(function () {
    var TITLES = {
        el: document.documentElement.getAttribute('data-title-el'),
        en: document.documentElement.getAttribute('data-title-en')
    };

    function getLang() {
        var q = new URLSearchParams(location.search).get('lang');
        if (q === 'el' || q === 'en') return q;
        try {
            var s = localStorage.getItem('selectedLanguage');
            if (s === 'el' || s === 'en') return s;
        } catch (e) {}
        return (navigator.language || 'el').slice(0, 2) === 'en' ? 'en' : 'el';
    }

    function setLang(lang) {
        document.documentElement.lang = lang;
        if (TITLES[lang]) document.title = TITLES[lang];
        try { localStorage.setItem('selectedLanguage', lang); } catch (e) {}
        document.querySelectorAll('.lg-lang button').forEach(function (b) {
            b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false');
        });
    }

    // Νωρίς, για να μη «αναβοσβήνει» η λάθος γλώσσα
    setLang(getLang());

    document.addEventListener('DOMContentLoaded', function () {
        setLang(document.documentElement.lang);
        document.querySelectorAll('.lg-lang button').forEach(function (b) {
            b.addEventListener('click', function () { setLang(b.dataset.lang); });
        });

        // «Ρυθμίσεις cookies»: διαγράφει την επιλογή και τα cookies του Google Analytics
        document.querySelectorAll('[data-cookie-reset]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                try { localStorage.removeItem('cookieConsent'); } catch (e) {}
                document.cookie.split(';').forEach(function (c) {
                    var name = c.split('=')[0].trim();
                    if (name.indexOf('_ga') === 0) {
                        var host = location.hostname;
                        var domains = ['', host, '.' + host, '.' + host.replace(/^www\./, '')];
                        domains.forEach(function (d) {
                            document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
                        });
                    }
                });
                var lang = document.documentElement.lang;
                var msg = lang === 'en'
                    ? 'Your choice has been cleared. You will be asked again on the home page.'
                    : 'Η επιλογή σας διαγράφηκε. Θα σας ζητηθεί ξανά στην αρχική σελίδα.';
                document.querySelectorAll('.lg-status').forEach(function (s) { s.textContent = msg; });
                if (!document.querySelector('.lg-status')) alert(msg);
            });
        });
    });
})();
