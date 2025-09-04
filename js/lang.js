/**
 * Inizializza il selettore della lingua e traduce la pagina.
 * Questa funzione viene chiamata da script.js dopo aver caricato l'header.
 */
function initLanguageSwitcher() {
    const supportedLangs = ['it', 'en', 'es', 'fr', 'de'];
    const defaultLang = 'en';

    /**
     * Determina la lingua iniziale da usare.
     * Priorità: Lingua salvata in localStorage > Lingua del browser > Default.
     * @returns {string} Il codice della lingua da usare (es. 'en').
     */
    function getInitialLang() {
        const savedLang = localStorage.getItem('lang');
        if (savedLang && supportedLangs.includes(savedLang)) {
            return savedLang;
        }

        const browserLang = navigator.language.split('-')[0];
        if (supportedLangs.includes(browserLang)) {
            return browserLang;
        }

        return defaultLang;
    }
    
    let currentLang = getInitialLang();

    const langSwitcher = document.querySelector('.lang-switcher');
    const langDropdown = document.querySelector('.lang-switcher-dropdown');
    const langButtons = document.querySelectorAll('.lang-switcher-dropdown button');
    const currentFlagEl = document.getElementById('current-lang-flag');

    if (!langSwitcher || !langDropdown || !langButtons.length || !currentFlagEl) {
        console.error("Language switcher elements not found. Make sure the header is loaded correctly.");
        return;
    }

    /**
     * Applica le traduzioni alla pagina.
     * @param {string} lang - Il codice della lingua da applicare.
     */
    async function translatePage(lang) {
        try {
            const response = await fetch(`locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Could not load translation file: ${lang}.json`);
            }
            const translations = await response.json();

            // Applica traduzioni a tutti gli elementi con data-key
            document.querySelectorAll('[data-key]').forEach(element => {
                const key = element.dataset.key;
                if (translations[key]) {
                    element.textContent = translations[key];
                }
            });

            // Aggiorna il titolo della pagina
            if (translations.page_title) {
                document.title = translations.page_title;
            }

            // Aggiorna la lingua del tag <html>
            document.documentElement.lang = lang;

            // Aggiorna l'immagine della bandiera corrente
            currentFlagEl.src = `img/flags/${lang === 'en' ? 'gb' : lang}.svg`;
            currentFlagEl.alt = `Selected language: ${lang}`;

            // Salva la scelta dell'utente
            localStorage.setItem('lang', lang);
            langDropdown.classList.remove('active');

        } catch (error) {
            console.error('Error translating page:', error);
            // Se la lingua richiesta fallisce, prova con quella di default
            if (lang !== defaultLang) {
                translatePage(defaultLang);
            }
        }
    }

    // Gestione apertura/chiusura dropdown
    langSwitcher.addEventListener('click', (event) => {
        event.stopPropagation();
        langDropdown.classList.toggle('active');
    });

    // Chiude il dropdown se si clicca fuori
    document.addEventListener('click', () => {
        langDropdown.classList.remove('active');
    });

    // Aggiunge l'evento di click a ogni pulsante del dropdown
    langButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const lang = button.dataset.lang;
            if (lang && lang !== currentLang) {
                currentLang = lang;
                translatePage(lang);
            }
        });
    });

    // Traduce la pagina al caricamento iniziale
    translatePage(currentLang);
}
