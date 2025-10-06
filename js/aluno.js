// Dados do aluno (em um sistema real, isso viria do backend)
const alunoData = {
    id: 1,
    nome: "Ana Silva",
    curso: "Engenharia de Software",
    email: "ana.silva@email.com",
    periodo: 3
};

// Dados de exemplo (em um sistema real, isso viria do backend)
const disciplinas = [
    {
        id: 1,
        nome: "Algoritmos e Programação",
        codigo: "ES101",
        professor: "Prof. Carlos Silva",
        periodo: 1,
        cargaHoraria: 60,
        descricao: "Introdução à programação e algoritmos"
    },
    {
        id: 2,
        nome: "Cálculo I",
        codigo: "ES102",
        professor: "Prof. Maria Santos",
        periodo: 1,
        cargaHoraria: 60,
        descricao: "Cálculo diferencial e integral"
    },
    {
        id: 3,
        nome: "Banco de Dados",
        codigo: "ES201",
        professor: "Prof. João Oliveira",
        periodo: 2,
        cargaHoraria: 60,
        descricao: "Fundamentos de bancos de dados relacionais"
    }
];

const atividades = [
    {
        id: 1,
        titulo: "Trabalho de Algoritmos",
        disciplina: "Algoritmos e Programação",
        descricao: "Implementar algoritmo de ordenação",
        dataEntrega: "2023-10-25",
        status: "pendente",
        tipo: "trabalho"
    },
    {
        id: 2,
        titulo: "Prova de Cálculo",
        disciplina: "Cálculo I",
        descricao: "Prova sobre derivadas e integrais",
        dataEntrega: "2023-10-28",
        status: "pendente",
        tipo: "prova"
    },
    {
        id: 3,
        titulo: "Projeto de Banco de Dados",
        disciplina: "Banco de Dados",
        descricao: "Modelar e implementar um banco de dados",
        dataEntrega: "2023-11-05",
        status: "entregue",
        tipo: "projeto",
        nota: 8.5
    }
];

const professores = [
    {
        id: 1,
        nome: "Prof. Carlos Silva",
        disciplina: "Algoritmos e Programação",
        online: true
    },
    {
        id: 2,
        nome: "Prof. Maria Santos",
        disciplina: "Cálculo I",
        online: false
    },
    {
        id: 3,
        nome: "Prof. João Oliveira",
        disciplina: "Banco de Dados",
        online: true
    }
];

const turmas = [
    {
        id: 1,
        nome: "Turma de Algoritmos",
        disciplina: "Algoritmos e Programação",
        membros: 25
    },
    {
        id: 2,
        nome: "Turma de Cálculo",
        disciplina: "Cálculo I",
        membros: 30
    }
];

const reclamacoes = [];

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    inicializarNavegacao();
    carregarDashboard();
    carregarDisciplinas();
    carregarAtividades();
    carregarChat();
    carregarCalendario();
    configurarFormularioReclamacao();
});

// Sistema de navegação por abas
function inicializarNavegacao() {
    // Navegação principal
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove a classe active de todos os links
            document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
            
            // Adiciona a classe active ao link clicado
            this.classList.add('active');
            
            // Esconde todos os conteúdos de abas
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Mostra o conteúdo da aba correspondente
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Navegação secundária (subtabs)
    document.querySelectorAll('.secondary.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const subtabId = this.getAttribute('data-subtab');
            
            // Remove a classe active de todas as subtabs
            document.querySelectorAll('.secondary.tab').forEach(t => t.classList.remove('active'));
            
            // Adiciona a classe active à subtab clicada
            this.classList.add('active');
            
            // Esconde todos os conteúdos de subtabs
            document.querySelectorAll('.subtab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Mostra o conteúdo da subtab correspondente
            document.getElementById(subtabId).classList.add('active');
        });
    });
}

// Carregar dashboard
function carregarDashboard() {
    carregarProximasAtividades();
    carregarCalendarioPreview();
}

function carregarProximasAtividades() {
    const container = document.getElementById('proximasAtividades');
    const atividadesProximas = atividades.filter(a => a.status === 'pendente').slice(0, 3);
    
    if (atividadesProximas.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhuma atividade pendente</p>';
        return;
    }
    
    container.innerHTML = atividadesProximas.map(atividade => `
        <div class="atividade-item">
            <div class="atividade-header">
                <div>
                    <div class="atividade-title">${atividade.titulo}</div>
                    <div class="atividade-disciplina">${atividade.disciplina}</div>
                </div>
                <div class="atividade-prazo ${isPrazoProximo(atividade.dataEntrega) ? 'urgente' : ''}">
                    ${formatarData(atividade.dataEntrega)}
                </div>
            </div>
            <div class="atividade-descricao">${atividade.descricao}</div>
            <div class="atividade-actions">
                <button class="btn btn-primary btn-sm">
                    <i class="fas fa-eye"></i> Ver Detalhes
                </button>
                <button class="btn btn-success btn-sm">
                    <i class="fas fa-upload"></i> Entregar
                </button>
            </div>
        </div>
    `).join('');
}

function carregarCalendarioPreview() {
    // Implementação simplificada do preview do calendário
    const hoje = new Date();
    const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
    
    let html = '';
    for (let i = 1; i <= 7; i++) {
        const dia = hoje.getDate() - hoje.getDay() + i;
        if (dia > 0 && dia <= diasNoMes) {
            const temEvento = atividades.some(a => {
                const dataAtividade = new Date(a.dataEntrega);
                return dataAtividade.getDate() === dia && 
                       dataAtividade.getMonth() === hoje.getMonth() && 
                       dataAtividade.getFullYear() === hoje.getFullYear();
            });
            
            html += `<div class="day-preview ${dia === hoje.getDate() ? 'current' : ''} ${temEvento ? 'has-event' : ''}">${dia}</div>`;
        } else {
            html += '<div class="day-preview"></div>';
        }
    }
    
    document.querySelector('.calendar-days-preview').innerHTML = html;
}

// Carregar disciplinas
function carregarDisciplinas() {
    const container = document.getElementById('listaDisciplinas');
    
    container.innerHTML = disciplinas.map(disciplina => `
        <div class="disciplina-card">
            <div class="disciplina-header">
                <div>
                    <div class="disciplina-title">${disciplina.nome} (${disciplina.codigo})</div>
                    <div class="disciplina-professor">${disciplina.professor}</div>
                </div>
            </div>
            <div class="disciplina-info">
                <p><strong>Carga horária:</strong> ${disciplina.cargaHoraria}h</p>
                <p><strong>Período:</strong> ${disciplina.periodo}º</p>
                <p>${disciplina.descricao}</p>
            </div>
            <div class="disciplina-actions">
                <button class="btn btn-primary">
                    <i class="fas fa-book"></i> Conteúdos
                </button>
                <button class="btn btn-success">
                    <i class="fas fa-tasks"></i> Atividades
                </button>
                <button class="btn btn-secondary" onclick="iniciarChatProfessor(${disciplina.id})">
                    <i class="fas fa-comment"></i> Chat com Professor
                </button>
            </div>
        </div>
    `).join('');
}

// Carregar atividades
function carregarAtividades() {
    carregarAtividadesPendentes();
    carregarAtividadesEntregues();
    carregarAtividadesAvaliadas();
}

function carregarAtividadesPendentes() {
    const container = document.getElementById('atividadesPendentes');
    const atividadesPendentes = atividades.filter(a => a.status === 'pendente');
    
    if (atividadesPendentes.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-check-circle"></i><p>Todas as atividades entregues!</p></div>';
        return;
    }
    
    container.innerHTML = atividadesPendentes.map(atividade => `
        <div class="atividade-item">
            <div class="atividade-header">
                <div>
                    <div class="atividade-title">${atividade.titulo}</div>
                    <div class="atividade-disciplina">${atividade.disciplina}</div>
                </div>
                <div class="atividade-prazo ${isPrazoProximo(atividade.dataEntrega) ? 'urgente' : ''}">
                    ${formatarData(atividade.dataEntrega)}
                </div>
            </div>
            <div class="atividade-descricao">${atividade.descricao}</div>
            <div class="atividade-actions">
                <button class="btn btn-primary">
                    <i class="fas fa-eye"></i> Detalhes
                </button>
                <button class="btn btn-success">
                    <i class="fas fa-upload"></i> Entregar
                </button>
            </div>
        </div>
    `).join('');
}

function carregarAtividadesEntregues() {
    const container = document.getElementById('atividadesEntregues');
    const atividadesEntregues = atividades.filter(a => a.status === 'entregue' && !a.nota);
    
    if (atividadesEntregues.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-clock"></i><p>Nenhuma atividade aguardando avaliação</p></div>';
        return;
    }
    
    container.innerHTML = atividadesEntregues.map(atividade => `
        <div class="atividade-item">
            <div class="atividade-header">
                <div>
                    <div class="atividade-title">${atividade.titulo}</div>
                    <div class="atividade-disciplina">${atividade.disciplina}</div>
                </div>
                <div class="atividade-prazo">
                    Entregue em: ${formatarData(atividade.dataEntrega)}
                </div>
            </div>
            <div class="atividade-descricao">${atividade.descricao}</div>
            <div class="atividade-actions">
                <button class="btn btn-primary">
                    <i class="fas fa-eye"></i> Ver Entrega
                </button>
                <span class="status-badge status-pendente">Aguardando avaliação</span>
            </div>
        </div>
    `).join('');
}

function carregarAtividadesAvaliadas() {
    const container = document.getElementById('atividadesAvaliadas');
    const atividadesAvaliadas = atividades.filter(a => a.nota);
    
    if (atividadesAvaliadas.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-graduation-cap"></i><p>Nenhuma atividade avaliada ainda</p></div>';
        return;
    }
    
    container.innerHTML = atividadesAvaliadas.map(atividade => `
        <div class="atividade-item">
            <div class="atividade-header">
                <div>
                    <div class="atividade-title">${atividade.titulo}</div>
                    <div class="atividade-disciplina">${atividade.disciplina}</div>
                </div>
                <div class="atividade-prazo">
                    Nota: <strong>${atividade.nota}/10</strong>
                </div>
            </div>
            <div class="atividade-descricao">${atividade.descricao}</div>
            <div class="atividade-actions">
                <button class="btn btn-primary">
                    <i class="fas fa-eye"></i> Ver Correção
                </button>
                <span class="status-badge status-resolvido">Avaliado</span>
            </div>
        </div>
    `).join('');
}

// Carregar chat
function carregarChat() {
    carregarListaProfessores();
    carregarListaTurmas();
}

function carregarListaProfessores() {
    const container = document.getElementById('professoresList');
    
    container.innerHTML = professores.map(professor => `
        <div class="contact-item" onclick="selecionarProfessor(${professor.id})">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(professor.nome)}&background=3498db&color=fff" alt="${professor.nome}">
            <div class="contact-info">
                <h4>${professor.nome}</h4>
                <p>${professor.disciplina}</p>
            </div>
            ${professor.online ? '<span class="online-dot"></span>' : ''}
        </div>
    `).join('');
}

function carregarListaTurmas() {
    const container = document.getElementById('turmasList');
    
    container.innerHTML = turmas.map(turma => `
        <div class="contact-item" onclick="selecionarTurma(${turma.id})">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(turma.nome)}&background=9b59b6&color=fff" alt="${turma.nome}">
            <div class="contact-info">
                <h4>${turma.nome}</h4>
                <p>${turma.membros} membros</p>
            </div>
        </div>
    `).join('');
}

function selecionarProfessor(professorId) {
    const professor = professores.find(p => p.id === professorId);
    if (professor) {
        document.querySelector('.selected-contact img').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(professor.nome)}&background=3498db&color=fff`;
        document.querySelector('.selected-contact h4').textContent = professor.nome;
        document.querySelector('.selected-contact p').textContent = professor.online ? 'Online' : 'Offline';
        
        // Limpar e carregar mensagens (simulação)
        const chatMessages = document.querySelector('.chat-messages');
        chatMessages.innerHTML = `
            <div class="message received">
                <div class="message-content">
                    <p>Olá ${alunoData.nome}, como posso ajudá-la hoje?</p>
                </div>
                <div class="message-time">${formatarHora(new Date())}</div>
            </div>
        `;
    }
}

function selecionarTurma(turmaId) {
    const turma = turmas.find(t => t.id === turmaId);
    if (turma) {
        document.querySelector('.selected-contact img').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(turma.nome)}&background=9b59b6&color=fff`;
        document.querySelector('.selected-contact h4').textContent = turma.nome;
        document.querySelector('.selected-contact p').textContent = 'Grupo da turma';
        
        // Limpar e carregar mensagens (simulação)
        const chatMessages = document.querySelector('.chat-messages');
        chatMessages.innerHTML = `
            <div class="message received">
                <div class="message-content">
                    <p>Bem-vindos ao chat da ${turma.nome}!</p>
                </div>
                <div class="message-time">${formatarHora(new Date())}</div>
            </div>
        `;
    }
}

function iniciarChatProfessor(disciplinaId) {
    // Navegar para a aba de chat
    document.querySelector('[data-tab="chat"]').click();
    
    // Selecionar o professor da disciplina
    const disciplina = disciplinas.find(d => d.id === disciplinaId);
    if (disciplina) {
        const professor = professores.find(p => p.nome.includes(disciplina.professor.split(' ')[1]));
        if (professor) {
            selecionarProfessor(professor.id);
        }
    }
}

// Carregar calendário
function carregarCalendario() {
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    
    let html = '';
    
    // Dias vazios no início
    for (let i = 0; i < primeiroDia.getDay(); i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    // Dias do mês
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
        const temAtividade = atividades.some(a => {
            const dataAtividade = new Date(a.dataEntrega);
            return dataAtividade.getDate() === i && 
                   dataAtividade.getMonth() === hoje.getMonth() && 
                   dataAtividade.getFullYear() === hoje.getFullYear();
        });
        
        html += `
            <div class="calendar-day ${i === hoje.getDate() ? 'current' : ''}">
                <div class="day-number">${i}</div>
                ${temAtividade ? '<div class="calendar-event">Atividade</div>' : ''}
            </div>
        `;
    }
    
    document.getElementById('calendarioDias').innerHTML = html;
}

// Configurar formulário de reclamações
function configurarFormularioReclamacao() {
    const form = document.getElementById('reclamacaoForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const tipo = document.getElementById('reclamacaoTipo').value;
        const assunto = document.getElementById('reclamacaoAssunto').value;
        const mensagem = document.getElementById('reclamacaoMensagem').value;
        
        if (!tipo || !assunto || !mensagem) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        const novaReclamacao = {
            id: reclamacoes.length + 1,
            tipo,
            assunto,
            mensagem,
            data: new Date().toISOString(),
            status: 'pendente'
        };
        
        reclamacoes.push(novaReclamacao);
        salvarReclamacoes();
        form.reset();
        
        alert('Reclamação enviada com sucesso! A direção entrará em contato em breve.');
        carregarReclamacoes();
    });
}

function carregarReclamacoes() {
    const container = document.getElementById('listaReclamacoes');
    const reclamacoesSalvas = JSON.parse(localStorage.getItem('reclamacoes_aluno')) || [];
    
    if (reclamacoesSalvas.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>Nenhuma reclamação enviada ainda</p></div>';
        return;
    }
    
    container.innerHTML = reclamacoesSalvas.map(reclamacao => `
        <div class="reclamacao-item">
            <div class="reclamacao-header">
                <div class="reclamacao-assunto">${reclamacao.assunto}</div>
                <div class="reclamacao-tipo">${reclamacao.tipo}</div>
            </div>
            <div class="reclamacao-mensagem">${reclamacao.mensagem}</div>
            <div class="reclamacao-status">
                <div class="reclamacao-data">${formatarDataCompleta(reclamacao.data)}</div>
                <span class="status-badge status-${reclamacao.status}">${reclamacao.status}</span>
            </div>
        </div>
    `).join('');
}

function salvarReclamacoes() {
    localStorage.setItem('reclamacoes_aluno', JSON.stringify(reclamacoes));
}

// Funções utilitárias
function isPrazoProximo(dataString) {
    const data = new Date(dataString);
    const hoje = new Date();
    const diffTime = data - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
}

function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

function formatarDataCompleta(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatarHora(data) {
    return data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Event listener para enviar mensagens no chat
document.querySelector('.chat-input button').addEventListener('click', function() {
    const input = document.querySelector('.chat-input input');
    const mensagem = input.value.trim();
    
    if (mensagem) {
        const chatMessages = document.querySelector('.chat-messages');
        
        chatMessages.innerHTML += `
            <div class="message sent">
                <div class="message-content">
                    <p>${mensagem}</p>
                </div>
                <div class="message-time">${formatarHora(new Date())}</div>
            </div>
        `;
        
        input.value = '';
        
        // Simular resposta após um tempo
        setTimeout(() => {
            chatMessages.innerHTML += `
                <div class="message received">
                    <div class="message-content">
                        <p>Obrigado pela mensagem. Responderei em breve.</p>
                    </div>
                    <div class="message-time">${formatarHora(new Date())}</div>
                </div>
            `;
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

// Permitir enviar mensagem com Enter
document.querySelector('.chat-input input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.querySelector('.chat-input button').click();
    }
});
