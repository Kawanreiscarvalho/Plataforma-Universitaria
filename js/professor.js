// Tabs functionality
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Show corresponding content
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
        
        // If calendar tab is selected, refresh it
        if (tabId === 'calendar') {
            initCalendar();
        }
    });
});

// Chat functionality
const chatInput = document.querySelector('.chat-input input');
const chatButton = document.querySelector('.chat-input button');
const messagesContainer = document.querySelector('.messages');

if (chatButton && chatInput) {
    chatButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        const now = new Date();
        const time = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
        
        const messageElement = `
            <div class="message sent">
                <div class="message-content">
                    <p>${message}</p>
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        messagesContainer.innerHTML += messageElement;
        chatInput.value = '';
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Simulate reply after a delay
        setTimeout(() => {
            const replies = [
                "Obrigado pela informação!",
                "Entendi, professor!",
                "Vou fazer isso agora.",
                "Preciso de mais ajuda com isso.",
                "Muito obrigado pela explicação!"
            ];
            
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            
            const replyElement = `
                <div class="message received">
                    <div class="message-content">
                        <p>${randomReply}</p>
                    </div>
                    <div class="message-time">${time}</div>
                </div>
            `;
            
            messagesContainer.innerHTML += replyElement;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }
}

// Contact selection
if (document.querySelectorAll('.contact').length > 0) {
    document.querySelectorAll('.contact').forEach(contact => {
        contact.addEventListener('click', () => {
            document.querySelectorAll('.contact').forEach(c => c.classList.remove('active'));
            contact.classList.add('active');
        });
    });
}

// Calendar functionality
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const holidays = {
    // Feriados nacionais do Brasil (datas fixas)
    '1-1': 'Ano Novo',
    '4-21': 'Tiradentes',
    '5-1': 'Dia do Trabalho',
    '9-7': 'Independência do Brasil',
    '10-12': 'Nossa Senhora Aparecida',
    '11-2': 'Finados',
    '11-15': 'Proclamação da República',
    '12-25': 'Natal',
};

function initCalendar() {
    // Add event listeners to calendar navigation buttons
    const prevBtn = document.querySelector('.calendar-prev');
    const nextBtn = document.querySelector('.calendar-next');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => navigateMonth(-1));
        nextBtn.addEventListener('click', () => navigateMonth(1));
        
        // Generate initial calendar
        generateCalendar(currentMonth, currentYear);
    }
}

function navigateMonth(direction) {
    currentMonth += direction;
    
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    
    // Check if we're within the allowed range (2023-2050)
    if (currentYear < 2023) {
        currentYear = 2023;
        currentMonth = 0;
    } else if (currentYear > 2050) {
        currentYear = 2050;
        currentMonth = 11;
    }
    
    generateCalendar(currentMonth, currentYear);
}

function generateCalendar(month, year) {
    const calendarHeader = document.querySelector('.calendar-header h2');
    const calendarElement = document.querySelector('.calendar');
    
    if (!calendarHeader || !calendarElement) return;
    
    // Update header
    calendarHeader.textContent = `${monthNames[month]} ${year}`;
    
    // Remove any existing days container
    const existingContainer = document.querySelector('.calendar-days');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    // Create new days container
    const daysContainer = document.createElement('div');
    daysContainer.className = 'calendar-days';
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'day empty';
        daysContainer.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Add holidays only (no sample events)
        addHolidaysToDay(dayElement, day, month, year);
        
        daysContainer.appendChild(dayElement);
    }
    
    // Add days container to calendar
    calendarElement.appendChild(daysContainer);
}

function addHolidaysToDay(dayElement, day, month, year) {
    const holidayDateStr = `${month + 1}-${day}`;
    
    // Add holidays only
    if (holidays[holidayDateStr]) {
        const holidayElement = document.createElement('div');
        holidayElement.className = 'event';
        holidayElement.textContent = holidays[holidayDateStr];
        holidayElement.style.backgroundColor = '#e74c3c'; // Red for holidays
        dayElement.appendChild(holidayElement);
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCalendar();
    
    // Add keyboard navigation for calendar
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            navigateMonth(-1);
        } else if (e.key === 'ArrowRight') {
            navigateMonth(1);
        }
    });
});