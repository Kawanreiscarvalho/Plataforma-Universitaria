// Sistema de Configurações - EduChain

// Configurações padrão
const defaultSettings = {
    theme: 'light',
    fontSize: 'medium',
    resolution: 'normal',
    colorTheme: 'blue',
    zoom: 100,
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
    visibleFocus: true,
    systemNotifications: true,
    emailActivities: true,
    emailDeadlines: false,
    emailMessages: true,
    emailAnnouncements: false,
    pushNotifications: false,
    dataCollection: true,
    profileVisibility: 'students',
    language: 'pt-BR'
};

// Carregar configurações do localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('educhainSettings');
    return savedSettings ? JSON.parse(savedSettings) : {...defaultSettings};
}

// Salvar configurações no localStorage
function saveSettings(settings) {
    localStorage.setItem('educhainSettings', JSON.stringify(settings));
    // Aplicar configurações imediatamente
    applySettings(settings);
}

// Aplicar configurações na página atual
function applySettings(settings) {
    // Tema
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(settings.theme === 'dark' ? 'dark-theme' : 'light-theme');
    
    // Tamanho da fonte
    document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
    document.body.classList.add(`font-${settings.fontSize}`);
    
    // Resolução
    document.body.classList.remove('resolution-compact', 'resolution-normal', 'resolution-spacious');
    document.body.classList.add(`resolution-${settings.resolution}`);
    
    // Tema de cores
    document.body.classList.remove('theme-blue', 'theme-green', 'theme-purple', 'theme-orange', 'theme-red');
    document.body.classList.add(`theme-${settings.colorTheme}`);
    
    // Zoom
    document.body.style.zoom = `${settings.zoom}%`;
    
    // Alto contraste
    if (settings.highContrast) {
        document.body.classList.add('high-contrast');
    } else {
        document.body.classList.remove('high-contrast');
    }
    
    // Reduzir animação
    if (settings.reduceMotion) {
        document.documentElement.style.setProperty('--transition', 'none');
    } else {
        document.documentElement.style.setProperty('--transition', 'all 0.3s ease');
    }
    
    // Foco visível
    if (!settings.visibleFocus) {
        document.body.classList.add('no-focus-outline');
    } else {
        document.body.classList.remove('no-focus-outline');
    }
    
    // Idioma
    document.documentElement.lang = settings.language;
}

// Inicializar a página
document.addEventListener('DOMContentLoaded', function() {
    const settings = loadSettings();
    
    // Aplicar configurações carregadas
    applySettings(settings);
    
    // Preencher formulários com configurações atuais
    populateForms(settings);
    
    // Configurar event listeners
    setupEventListeners();
    
    // Configurar sistema de navegação
    setupNavigation();
});

// Preencher formulários com configurações
function populateForms(settings) {
    // Tema
    document.getElementById('themeToggle').innerHTML = settings.theme === 'dark' ? 
        '<i class="fas fa-sun"></i> Tema Claro' : '<i class="fas fa-moon"></i> Tema Escuro';
    
    // Tamanho da fonte
    const fontSizeMap = { small: 14, medium: 16, large: 18, xlarge: 20 };
    document.getElementById('fontSizeSlider').value = fontSizeMap[settings.fontSize];
    document.getElementById('fontSizeDisplay').textContent = 
        settings.fontSize === 'small' ? 'Pequeno' : 
        settings.fontSize === 'medium' ? 'Médio' : 
        settings.fontSize === 'large' ? 'Grande' : 'Muito Grande';
    
    // Resolução
    document.querySelectorAll('.resolution-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.resolution === settings.resolution) {
            option.classList.add('active');
        }
    });
    
    // Tema de cores
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === settings.colorTheme) {
            option.classList.add('active');
        }
    });
    
    // Zoom
    document.getElementById('zoomSlider').value = settings.zoom;
    document.getElementById('zoomDisplay').textContent = `${settings.zoom}%`;
    
    // Toggles
    document.getElementById('highContrast').checked = settings.highContrast;
    document.getElementById('reduceMotion').checked = settings.reduceMotion;
    document.getElementById('screenReader').checked = settings.screenReader;
    document.getElementById('visibleFocus').checked = settings.visibleFocus;
    document.getElementById('systemNotifications').checked = settings.systemNotifications;
    document.getElementById('pushNotifications').checked = settings.pushNotifications;
    document.getElementById('dataCollection').checked = settings.dataCollection;
    
    // Checkboxes de email
    document.getElementById('emailActivities').checked = settings.emailActivities;
    document.getElementById('emailDeadlines').checked = settings.emailDeadlines;
    document.getElementById('emailMessages').checked = settings.emailMessages;
    document.getElementById('emailAnnouncements').checked = settings.emailAnnouncements;
    
    // Selects
    document.getElementById('profileVisibility').value = settings.profileVisibility;
    document.getElementById('language').value = settings.language;
}

// Configurar event listeners
function setupEventListeners() {
    // Alternar tema
    document.getElementById('themeToggle').addEventListener('click', function() {
        const settings = loadSettings();
        settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
        saveSettings(settings);
        populateForms(settings);
    });
    
    // Controles de tamanho da fonte
    document.getElementById('fontSizeSlider').addEventListener('input', function() {
        const value = parseInt(this.value);
        let fontSize;
        
        if (value <= 14) fontSize = 'small';
        else if (value <= 16) fontSize = 'medium';
        else if (value <= 18) fontSize = 'large';
        else fontSize = 'xlarge';
        
        const settings = loadSettings();
        settings.fontSize = fontSize;
        saveSettings(settings);
        populateForms(settings);
    });
    
    document.getElementById('decreaseFont').addEventListener('click', function() {
        const slider = document.getElementById('fontSizeSlider');
        let value = parseInt(slider.value);
        if (value > 12) {
            slider.value = value - 2;
            slider.dispatchEvent(new Event('input'));
        }
    });
    
    document.getElementById('increaseFont').addEventListener('click', function() {
        const slider = document.getElementById('fontSizeSlider');
        let value = parseInt(slider.value);
        if (value < 24) {
            slider.value = value + 2;
            slider.dispatchEvent(new Event('input'));
        }
    });
    
    // Controles de resolução
    document.querySelectorAll('.resolution-option').forEach(option => {
        option.addEventListener('click', function() {
            const resolution = this.dataset.resolution;
            const settings = loadSettings();
            settings.resolution = resolution;
            saveSettings(settings);
            populateForms(settings);
        });
    });
    
    // Controles de tema de cores
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            const colorTheme = this.dataset.theme;
            const settings = loadSettings();
            settings.colorTheme = colorTheme;
            saveSettings(settings);
            populateForms(settings);
        });
    });
    
    // Controles de zoom
    document.getElementById('zoomSlider').addEventListener('input', function() {
        const zoom = parseInt(this.value);
        document.getElementById('zoomDisplay').textContent = `${zoom}%`;
        
        const settings = loadSettings();
        settings.zoom = zoom;
        saveSettings(settings);
    });
    
    document.getElementById('zoomOut').addEventListener('click', function() {
        const slider = document.getElementById('zoomSlider');
        let value = parseInt(slider.value);
        if (value > 50) {
            slider.value = value - 10;
            slider.dispatchEvent(new Event('input'));
        }
    });
    
    document.getElementById('zoomIn').addEventListener('click', function() {
        const slider = document.getElementById('zoomSlider');
        let value = parseInt(slider.value);
        if (value < 150) {
            slider.value = value + 10;
            slider.dispatchEvent(new Event('input'));
        }
    });
    
    // Toggles
    document.getElementById('highContrast').addEventListener('change', function() {
        const settings = loadSettings();
        settings.highContrast = this.checked;
        saveSettings(settings);
    });
    
    document.getElementById('reduceMotion').addEventListener('change', function() {
        const settings = loadSettings();
        settings.reduceMotion = this.checked;
        saveSettings(settings);
    });
    
    document.getElementById('screenReader').addEventListener('change', function() {
        const settings = loadSettings();
        settings.screenReader = this.checked;
        saveSettings(settings);
    });
    
    document.getElementById('visibleFocus').addEventListener('change', function() {
        const settings = loadSettings();
        settings.visibleFocus = this.checked;
        saveSettings(settings);
    });
    
    document.getElementById('systemNotifications').addEventListener('change', function() {
        const settings = loadSettings();
        settings.systemNotifications = this.checked;
        saveSettings(settings);
    });
    
    document.getElementById('pushNotifications').addEventListener('change', function() {
        const settings = loadSettings();
        settings.pushNotifications = this.checked;
        saveSettings(settings);
    });
    
    document.getElementById('dataCollection').addEventListener('change', function() {
        const settings = loadSettings();
        settings.dataCollection = this.checked;
        saveSettings(settings);
    });
    
    // Checkboxes de email
    document.getElementById('emailActivities').addEventListener('change', function() {
        const settings = loadSettings();
        settings.emailActivities = this.checked;
        saveSettings(settings);
    });
    
    document.getElementById('emailDeadlines').addEventListener('change', function() {
        const settings = loadSettings();
        settings.emailDeadlines = this.checked;
        saveSettings(settings);
    });
    
    document.getElementById('emailMessages').addEventListener('change', function() {
        const settings = loadSettings();
        settings.emailMessages = this.checked;
        saveSettings(settings);
    });
    
    document.getElementById('emailAnnouncements').addEventListener('change', function() {
        const settings = loadSettings();
        settings.emailAnnouncements = this.checked;
        saveSettings(settings);
    });
    
    // Selects
    document.getElementById('profileVisibility').addEventListener('change', function() {
        const settings = loadSettings();
        settings.profileVisibility = this.value;
        saveSettings(settings);
    });
    
    document.getElementById('language').addEventListener('change', function() {
        const settings = loadSettings();
        settings.language = this.value;
        saveSettings(settings);
    });
    
    // Botão de salvar
    document.getElementById('saveSettings').addEventListener('click', function() {
        showNotification('Configurações salvas com sucesso!', 'success');
    });
    
    // Botão de redefinir
    document.getElementById('resetSettings').addEventListener('click', function() {
        showConfirmModal(
            'Redefinir Configurações',
            'Tem certeza que deseja redefinir todas as configurações para os valores padrão?',
            function() {
                saveSettings({...defaultSettings});
                populateForms(loadSettings());
                showNotification('Configurações redefinidas com sucesso!', 'success');
            }
        );
    });
    
    // Botão de alterar senha
    document.getElementById('changePassword').addEventListener('click', function() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            showNotification('Preencha todos os campos de senha!', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showNotification('As senhas não coincidem!', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            showNotification('A senha deve ter pelo menos 6 caracteres!', 'error');
            return;
        }
        
        showNotification('Senha alterada com sucesso!', 'success');
        
        // Limpar campos
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    });
    
    // Botão de exportar dados
    document.getElementById('exportData').addEventListener('click', function() {
        showNotification('Preparando download dos seus dados...', 'info');
        // Simular download
        setTimeout(() => {
            showNotification('Download concluído!', 'success');
        }, 2000);
    });
    
    // Botão de excluir conta
    document.getElementById('deleteAccount').addEventListener('click', function() {
        showConfirmModal(
            'Excluir Conta',
            'Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão permanentemente removidos.',
            function() {
                showNotification('Sua conta será excluída em 30 dias. Entre em contato com o suporte para cancelar.', 'warning');
            }
        );
    });
    
    // Busca de configurações
    document.getElementById('searchSettings').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        document.querySelectorAll('.settings-section').forEach(section => {
            const sectionText = section.textContent.toLowerCase();
            const sectionId = section.id;
            
            if (sectionText.includes(searchTerm)) {
                section.style.display = 'block';
                
                // Destacar termos correspondentes
                highlightMatches(section, searchTerm);
            } else {
                section.style.display = 'none';
            }
        });
    });
}

// Configurar sistema de navegação
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover active de todos
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            document.querySelectorAll('.settings-section').forEach(section => section.classList.remove('active'));
            
            // Adicionar active ao selecionado
            this.classList.add('active');
            const sectionId = this.dataset.section;
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// Mostrar modal de confirmação
function showConfirmModal(title, message, confirmCallback) {
    const modal = document.getElementById('confirmModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalCancel = document.getElementById('modalCancel');
    const closeBtn = document.querySelector('.close');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    modal.style.display = 'block';
    
    const closeModal = function() {
        modal.style.display = 'none';
        modalConfirm.removeEventListener('click', confirmHandler);
        modalCancel.removeEventListener('click', cancelHandler);
        closeBtn.removeEventListener('click', cancelHandler);
        window.removeEventListener('click', outsideClick);
    };
    
    const confirmHandler = function() {
        confirmCallback();
        closeModal();
    };
    
    const cancelHandler = function() {
        closeModal();
    };
    
    const outsideClick = function(e) {
        if (e.target === modal) {
            closeModal();
        }
    };
    
    modalConfirm.addEventListener('click', confirmHandler);
    modalCancel.addEventListener('click', cancelHandler);
    closeBtn.addEventListener('click', cancelHandler);
    window.addEventListener('click', outsideClick);
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Adicionar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Adicionar animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 16px;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    `;
    document.head.appendChild(style);
    
    // Adicionar ao documento
    document.body.appendChild(notification);
    
    // Configurar botão de fechar
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Destacar termos de busca
function highlightMatches(element, searchTerm) {
    const text = element.innerHTML;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const highlighted = text.replace(regex, '<mark>$1</mark>');
    element.innerHTML = highlighted;
}

// Função para aplicar configurações em outras páginas
// Esta função deve ser chamada em todas as páginas do sistema
function applyGlobalSettings() {
    const settings = loadSettings();
    applySettings(settings);
}

// Adicionar CSS para no-focus-outline
const noFocusStyle = document.createElement('style');
noFocusStyle.textContent = `
    body.no-focus-outline *:focus {
        outline: none !important;
    }
`;
document.head.appendChild(noFocusStyle);






