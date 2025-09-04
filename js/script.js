/**
 * Carica un componente HTML in un elemento placeholder.
 * @param {string} url - L'URL del file HTML del componente.
 * @param {string} placeholderId - L'ID dell'elemento dove inserire il componente.
 * @param {function} [callback] - Funzione opzionale da eseguire dopo il caricamento.
 */
function loadComponent(url, placeholderId, callback) {
    const el = document.getElementById(placeholderId);
    if (!el) {
        console.error(`Placeholder with ID "${placeholderId}" not found.`);
        return;
    }
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${url}`);
            }
            return response.text();
        })
        .then(html => {
            el.innerHTML = html;
            if (callback) {
                callback();
            }
        })
        .catch(err => console.error('Error loading component:', err));
}

/**
 * Inizializza la logica per il menu di navigazione mobile.
 */
function initNavigation() {
    const toggleBtn = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('main-nav-mobile');
    if (!toggleBtn || !mobileNav) return;

    toggleBtn.addEventListener('click', () => {
        const isVisible = mobileNav.style.display === 'block';
        mobileNav.style.display = isVisible ? 'none' : 'block';
    });
}

// Event listener che si attiva quando il DOM è pronto.
document.addEventListener('DOMContentLoaded', () => {
    // Carica l'header e, una volta fatto, inizializza la navigazione e il selettore lingua.
    loadComponent('hf/header.html', 'header-placeholder', () => {
        initNavigation();
        initLanguageSwitcher(); // Questa funzione è definita in lang.js
    });
    // Carica il footer.
    loadComponent('hf/footer.html', 'footer-placeholder');
});
