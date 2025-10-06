// Sistema de Calendário para Professores

// Feriados nacionais do Brasil (datas fixas)
const fixedHolidays = [
    { day: 1, month: 0, name: "Confraternização Universal" }, // 1 de Janeiro
    { day: 21, month: 3, name: "Tiradentes" }, // 21 de Abril
    { day: 1, month: 4, name: "Dia do Trabalho" }, // 1 de Maio
    { day: 7, month: 8, name: "Independência do Brasil" }, // 7 de Setembro
    { day: 12, month: 9, name: "Nossa Senhora Aparecida" }, // 12 de Outubro
    { day: 2, month: 10, name: "Finados" }, // 2 de Novembro
    { day: 15, month: 10, name: "Proclamação da República" }, // 15 de Novembro
    { day: 25, month: 11, name: "Natal" } // 25 de Dezembro
];

// Feriados móveis (Páscoa e derivados)
function getEaster(year) {
    // Algoritmo de Gauss para calcular a Páscoa
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    
    return new Date(year, month, day);
}

function getMovableHolidays(year) {
    const easter = getEaster(year);
    const holidays = [];
    
    // Carnaval (48 dias antes da Páscoa)
    const carnival = new Date(easter);
    carnival.setDate(easter.getDate() - 48);
    holidays.push({ date: new Date(carnival), name: "Carnaval" });
    
    // Sexta-feira Santa (2 dias antes da Páscoa)
    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);
    holidays.push({ date: new Date(goodFriday), name: "Sexta-feira Santa" });
    
    // Páscoa
    holidays.push({ date: new Date(easter), name: "Páscoa" });
    
    // Corpus Christi (60 dias depois da Páscoa)
    const corpusChristi = new Date(easter);
    corpusChristi.setDate(easter.getDate() + 60);
    holidays.push({ date: new Date(corpusChristi), name: "Corpus Christi" });
    
    return holidays;
}

// Sistema de armazenamento de eventos
function getEvents() {
    const events = localStorage.getItem('professorEvents');
    return events ? JSON.parse(events) : [];
}

function saveEvents(events) {
    localStorage.setItem('professorEvents', JSON.stringify(events));
}

function getEventId() {
    return Date.now().toString();
}

// Estado atual do calendário
let currentDate = new Date();
let selectedDate = null;
let currentView = 'month';

// Inicializar a página
document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
    setupEventListeners();
    loadEventsForSelectedDate();
});

function initializeCalendar() {
    // Preencher seletor de anos (2025-2080)
    const yearSelect = document.getElementById('yearSelect');
    for (let year = 2025; year <= 2080; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    
    // Definir ano e mês atuais
    yearSelect.value = currentDate.getFullYear();
    document.getElementById('monthSelect').value = currentDate.getMonth();
    
    // Renderizar calendário
    renderCalendar();
}

function setupEventListeners() {
    // Navegação por ano
    document.getElementById('prevYear').addEventListener('click', function() {
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        document.getElementById('yearSelect').value = currentDate.getFullYear();
        renderCalendar();
    });
    
    document.getElementById('nextYear').addEventListener('click', function() {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        document.getElementById('yearSelect').value = currentDate.getFullYear();
        renderCalendar();
    });
    
    document.getElementById('yearSelect').addEventListener('change', function() {
        currentDate.setFullYear(parseInt(this.value));
        renderCalendar();
    });
    
    // Navegação por mês
    document.getElementById('prevMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        document.getElementById('monthSelect').value = currentDate.getMonth();
        renderCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        document.getElementById('monthSelect').value = currentDate.getMonth();
        renderCalendar();
    });
    
    document.getElementById('monthSelect').addEventListener('change', function() {
        currentDate.setMonth(parseInt(this.value));
        renderCalendar();
    });
    
    // Alternar entre visualizações
    document.getElementById('monthView').addEventListener('click', function() {
        currentView = 'month';
        this.classList.add('active');
        document.getElementById('weekView').classList.remove('active');
        renderCalendar();
    });
    
    document.getElementById('weekView').addEventListener('click', function() {
        currentView = 'week';
        this.classList.add('active');
        document.getElementById('monthView').classList.remove('active');
        renderCalendar();
    });
    
    // Botão para adicionar evento
    document.getElementById('addEventBtn').addEventListener('click', function() {
        openEventModal();
    });
    
    // Modal de eventos
    document.querySelector('.close').addEventListener('click', closeEventModal);
    document.getElementById('cancelEvent').addEventListener('click', closeEventModal);
    document.getElementById('saveEvent').addEventListener('click', saveEvent);
    document.getElementById('deleteEvent').addEventListener('click', deleteEvent);
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('eventModal');
        if (event.target === modal) {
            closeEventModal();
        }
    });
    
    // Buscar eventos
    document.getElementById('searchEvents').addEventListener('input', function() {
        filterEvents(this.value);
    });
}

function renderCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthYear = document.getElementById('currentMonthYear');
    
    // Atualizar título
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    currentMonthYear.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    // Limpar calendário
    calendarDays.innerHTML = '';
    
    if (currentView === 'month') {
        renderMonthView();
    } else {
        renderWeekView();
    }
}

function renderMonthView() {
    const calendarDays = document.getElementById('calendarDays');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    // Último dia do mês
    const lastDay = new Date(year, month + 1, 0);
    // Dia da semana do primeiro dia (0 = Domingo, 6 = Sábado)
    const firstDayOfWeek = firstDay.getDay();
    
    // Dias do mês anterior para preencher a primeira semana
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Obter feriados para o mês atual
    const holidays = getHolidaysForMonth(year, month);
    
    // Obter eventos para o mês atual
    const events = getEventsForMonth(year, month);
    
    // Preencher dias do mês anterior
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = createDayElement(prevMonthLastDay - i, true, holidays, events);
        calendarDays.appendChild(day);
    }
    
    // Preencher dias do mês atual
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const day = createDayElement(i, false, holidays, events);
        calendarDays.appendChild(day);
    }
    
    // Preencher dias do próximo mês para completar a grade
    const totalCells = 42; // 6 semanas * 7 dias
    const daysInCalendar = firstDayOfWeek + lastDay.getDate();
    const nextMonthDays = totalCells - daysInCalendar;
    
    for (let i = 1; i <= nextMonthDays; i++) {
        const day = createDayElement(i, true, holidays, events);
        calendarDays.appendChild(day);
    }
}

function createDayElement(dayNumber, isOtherMonth, holidays, events) {
    const day = document.createElement('div');
    day.className = 'day';
    
    if (isOtherMonth) {
        day.classList.add('other-month');
    }
    
    // Verificar se é hoje
    const today = new Date();
    if (!isOtherMonth && 
        dayNumber === today.getDate() && 
        currentDate.getMonth() === today.getMonth() && 
        currentDate.getFullYear() === today.getFullYear()) {
        day.classList.add('today');
    }
    
    // Verificar se é feriado
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${dayNumber}`;
    const holiday = holidays.find(h => h.date === dateKey);
    if (holiday) {
        day.classList.add('holiday');
    }
    
    // Verificar se é a data selecionada
    if (selectedDate && 
        !isOtherMonth && 
        dayNumber === selectedDate.getDate() && 
        currentDate.getMonth() === selectedDate.getMonth() && 
        currentDate.getFullYear() === selectedDate.getFullYear()) {
        day.classList.add('selected');
    }
    
    // Adicionar número do dia
    const dayNumberElement = document.createElement('div');
    dayNumberElement.className = 'day-number';
    dayNumberElement.textContent = dayNumber;
    day.appendChild(dayNumberElement);
    
    // Adicionar eventos do dia
    const dayEvents = events.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate.getDate() === dayNumber && 
               eventDate.getMonth() === currentDate.getMonth() && 
               eventDate.getFullYear() === currentDate.getFullYear();
    });
    
    dayEvents.slice(0, 3).forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = `day-event event-${event.type}`;
        eventElement.textContent = event.title;
        eventElement.title = event.title;
        day.appendChild(eventElement);
    });
    
    if (dayEvents.length > 3) {
        const moreEventsElement = document.createElement('div');
        moreEventsElement.className = 'day-event event-other';
        moreEventsElement.textContent = `+${dayEvents.length - 3} mais`;
        day.appendChild(moreEventsElement);
    }
    
    // Adicionar evento de clique
    day.addEventListener('click', function() {
        if (!isOtherMonth) {
            selectDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber));
        }
    });
    
    return day;
}

function renderWeekView() {
    // Implementação simplificada da visualização semanal
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '<div class="empty-state"><p>Visualização semanal em desenvolvimento</p></div>';
}

function getHolidaysForMonth(year, month) {
    const holidays = [];
    
    // Adicionar feriados fixos
    fixedHolidays.forEach(holiday => {
        if (holiday.month === month) {
            holidays.push({
                date: `${year}-${month}-${holiday.day}`,
                name: holiday.name
            });
        }
    });
    
    // Adicionar feriados móveis
    const movableHolidays = getMovableHolidays(year);
    movableHolidays.forEach(holiday => {
        if (holiday.date.getMonth() === month) {
            holidays.push({
                date: `${year}-${month}-${holiday.date.getDate()}`,
                name: holiday.name
            });
        }
    });
    
    return holidays;
}

function getEventsForMonth(year, month) {
    const events = getEvents();
    return events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
}

function selectDate(date) {
    selectedDate = date;
    renderCalendar();
    loadEventsForSelectedDate();
}

function loadEventsForSelectedDate() {
    const eventsList = document.getElementById('eventsList');
    const selectedDateText = document.getElementById('selectedDateText');
    
    if (!selectedDate) {
        selectedDateText.textContent = 'Selecione uma data';
        eventsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-day"></i>
                <p>Nenhum evento para esta data</p>
                <small>Clique em uma data para ver ou adicionar eventos</small>
            </div>
        `;
        return;
    }
    
    // Formatar data selecionada
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    selectedDateText.textContent = selectedDate.toLocaleDateString('pt-BR', options);
    
    // Obter eventos para a data selecionada
    const events = getEvents().filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === selectedDate.toDateString();
    });
    
    if (events.length === 0) {
        eventsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-day"></i>
                <p>Nenhum evento para esta data</p>
                <button class="btn btn-primary" id="addEventForDate">
                    <i class="fas fa-plus"></i> Adicionar Evento
                </button>
            </div>
        `;
        
        document.getElementById('addEventForDate').addEventListener('click', openEventModal);
    } else {
        eventsList.innerHTML = '';
        events.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = `event-item ${event.type}`;
            eventItem.innerHTML = `
                <div class="event-info">
                    <h4>${event.title}</h4>
                    <p>${event.description || 'Sem descrição'}</p>
                    <small>${getEventTypeName(event.type)}</small>
                </div>
                <div class="event-actions">
                    <button class="btn btn-secondary edit-event" data-id="${event.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger delete-event" data-id="${event.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            eventsList.appendChild(eventItem);
        });
        
        // Adicionar eventos aos botões de edição e exclusão
        document.querySelectorAll('.edit-event').forEach(button => {
            button.addEventListener('click', function() {
                const eventId = this.getAttribute('data-id');
                openEventModal(eventId);
            });
        });
        
        document.querySelectorAll('.delete-event').forEach(button => {
            button.addEventListener('click', function() {
                const eventId = this.getAttribute('data-id');
                deleteEvent(eventId);
            });
        });
    }
}

function getEventTypeName(type) {
    const typeNames = {
        'activity': 'Atividade',
        'exam': 'Prova',
        'recovery': 'Recuperação',
        'meeting': 'Reunião',
        'holiday': 'Feriado',
        'other': 'Outro'
    };
    
    return typeNames[type] || 'Evento';
}

function openEventModal(eventId = null) {
    const modal = document.getElementById('eventModal');
    const modalTitle = document.getElementById('modalTitle');
    const deleteButton = document.getElementById('deleteEvent');
    
    // Limpar formulário
    document.getElementById('eventForm').reset();
    document.getElementById('eventId').value = '';
    
    if (eventId) {
        // Modo edição
        modalTitle.textContent = 'Editar Evento';
        deleteButton.style.display = 'inline-block';
        
        const events = getEvents();
        const event = events.find(e => e.id === eventId);
        
        if (event) {
            document.getElementById('eventId').value = event.id;
            document.getElementById('eventDate').value = event.date;
            document.getElementById('eventType').value = event.type;
            document.getElementById('eventTitle').value = event.title;
            document.getElementById('eventDescription').value = event.description || '';
            document.getElementById('eventDiscipline').value = event.discipline || '';
        }
    } else {
        // Modo adição
        modalTitle.textContent = 'Adicionar Evento';
        deleteButton.style.display = 'none';
        
        // Preencher data com a data selecionada, se houver
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            document.getElementById('eventDate').value = formattedDate;
        }
    }
    
    modal.style.display = 'block';
}

function closeEventModal() {
    document.getElementById('eventModal').style.display = 'none';
}

function saveEvent() {
    const eventId = document.getElementById('eventId').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventType = document.getElementById('eventType').value;
    const eventTitle = document.getElementById('eventTitle').value;
    const eventDescription = document.getElementById('eventDescription').value;
    const eventDiscipline = document.getElementById('eventDiscipline').value;
    
    // Validação básica
    if (!eventDate || !eventType || !eventTitle) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    const events = getEvents();
    
    if (eventId) {
        // Atualizar evento existente
        const index = events.findIndex(e => e.id === eventId);
        if (index !== -1) {
            events[index] = {
                id: eventId,
                date: eventDate,
                type: eventType,
                title: eventTitle,
                description: eventDescription,
                discipline: eventDiscipline
            };
        }
    } else {
        // Adicionar novo evento
        events.push({
            id: getEventId(),
            date: eventDate,
            type: eventType,
            title: eventTitle,
            description: eventDescription,
            discipline: eventDiscipline
        });
    }
    
    saveEvents(events);
    closeEventModal();
    renderCalendar();
    loadEventsForSelectedDate();
}

function deleteEvent(eventId = null) {
    if (!eventId) {
        eventId = document.getElementById('eventId').value;
    }
    
    if (!eventId) return;
    
    if (confirm('Tem certeza que deseja excluir este evento?')) {
        const events = getEvents();
        const filteredEvents = events.filter(e => e.id !== eventId);
        saveEvents(filteredEvents);
        closeEventModal();
        renderCalendar();
        loadEventsForSelectedDate();
    }
}

function filterEvents(searchTerm) {
    // Implementação simplificada de busca
    // Em uma implementação mais completa, isso filtraria os eventos exibidos
    console.log('Buscando eventos com termo:', searchTerm);
}