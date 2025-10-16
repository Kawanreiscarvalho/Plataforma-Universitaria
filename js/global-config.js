// === global-config.js ===
// Aplica automaticamente as configurações do usuário em todas as páginas do EduChain

(function applyGlobalConfig() {
    const savedSettings = localStorage.getItem('educhainSettings');
    if (!savedSettings) return;

    const settings = JSON.parse(savedSettings);

    // Tema (claro/escuro)
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(settings.theme === 'dark' ? 'dark-theme' : 'light-theme');

    // Tamanho da fonte
    document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
    document.body.classList.add(`font-${settings.fontSize}`);

    // Resolução
    document.body.classList.remove('resolution-compact', 'resolution-normal', 'resolution-spacious');
    document.body.classList.add(`resolution-${settings.resolution}`);

    // Tema de cor (azul, verde, roxo etc.)
    document.body.classList.remove('theme-blue', 'theme-green', 'theme-purple', 'theme-orange', 'theme-red');
    document.body.classList.add(`theme-${settings.colorTheme}`);

    // Zoom
    document.body.style.zoom = `${settings.zoom}%`;

    // Alto contraste
    if (settings.highContrast) document.body.classList.add('high-contrast');
    else document.body.classList.remove('high-contrast');

    // Reduzir animações
    document.documentElement.style.setProperty(
        '--transition',
        settings.reduceMotion ? 'none' : 'all 0.3s ease'
    );

    // Foco visível
    if (!settings.visibleFocus) document.body.classList.add('no-focus-outline');
    else document.body.classList.remove('no-focus-outline');

    // Idioma
    if (settings.language) document.documentElement.lang = settings.language;
})();
