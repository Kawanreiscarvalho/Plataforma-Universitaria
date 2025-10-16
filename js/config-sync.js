// === config-sync.js ===
// Este script sincroniza as configurações salvas da página config.html com as demais páginas do sistema.

// Carregar configurações salvas
function applySavedConfig() {
    const config = JSON.parse(localStorage.getItem('educhainConfig')) || {};

    // Tema de cores
    if (config.theme) {
        document.body.setAttribute('data-theme', config.theme);
    }

    // Tamanho da fonte
    if (config.fontSize) {
        document.documentElement.style.fontSize = config.fontSize + 'px';
    }

    // Zoom da página
    if (config.zoom) {
        document.body.style.zoom = config.zoom;
    }

    // Modo escuro/claro
    if (config.darkMode) {
        document.body.classList.toggle('dark-mode', config.darkMode === true);
    }

    // Espaçamento / resolução
    if (config.resolution) {
        document.body.classList.remove('compact', 'normal', 'spacious');
        document.body.classList.add(config.resolution);
    }
}

// Quando a página carregar
document.addEventListener('DOMContentLoaded', applySavedConfig);
