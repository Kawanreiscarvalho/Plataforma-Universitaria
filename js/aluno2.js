// ... (código anterior permanece igual)

// Adicionar estas variáveis globais no início do arquivo
let atividadesFiltradas = [];
let disciplinasFiltradas = [];
let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();

// Feriados nacionais do Brasil (2023-2025)
const feriadosNacionais = {
    '2023': {
        '1-1': 'Ano Novo',
        '2-20': 'Carnaval',
        '2-21': 'Carnaval',
        '4-7': 'Paixão de Cristo',
        '4-21': 'Tiradentes',
        '5-1': 'Dia do Trabalho',
        '6-8': 'Corpus Christi',
        '9-7': 'Independência do Brasil',
        '10-12': 'Nossa Senhora Aparecida',
        '11-2': 'Finados',
        '11-15': 'Proclamação da República',
        '12-25': 'Natal'
    },
    '2024': {
        '1-1': 'Ano Novo',
        '2-12': 'Carnaval',
        '2-13': 'Carnaval',
        '3-29': 'Paixão de Cristo',
        '4-21': 'Tiradentes',
        '5-1': 'Dia do Trabalho',
        '5-30': 'Corpus Christi',
        '9-7': 'Independência do Brasil',
        '10-12': 'Nossa Senhora Aparecida',
        '11-2': 'Finados',
        '11-15': 'Proclamação da República',
        '12-25': 'Natal'
    },
    '2025': {
        '1-1': 'Ano Novo',
        '3-4': 'Carnaval',
        '3-5': 'Carnaval',
        '4-18': 'Paixão de Cristo',
        '4-21': 'Tiradentes',
        '5-1': 'Dia do Trabalho',
        '6-19': 'Corpus Christi',
        '9-7': 'Independência do Brasil',
        '10-12': 'Nossa Senhora Aparecida',
        '11-2': 'Finados',
        '11-15': 'Proclamação da República',
        '12-25': 'Natal'
    }
};

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    inicializarNavegacao();
    carregarDashboard();
    carregarDisciplinas();
    carregarAtividades();
    carregarChat();
    carregarCalendario();
    configurarFormularioReclamacao();
    configurarSistemaPesquisa(); // Nova função
});

// ... (código anterior permanece igual)

// CONFIGURAR SISTEMA DE PESQUISA
function configurarSistemaPesquisa() {
    const searchInputs = document.querySelectorAll('.search-box input, .chat-search input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const isChatSearch = this.parentElement.classList.contains('chat-search');
            
            if (isChatSearch) {
                pesquisarChat(searchTerm);
            } else {
                pesquisarGeral(searchTerm);
            }
        });
    });
}

function pesquisarGeral(termo) {
    if (termo.length < 2) {
        // Se termo muito curto, mostrar tudo
        carregarDisciplinas();
        carregarAtividades();
        return;
    }
    
    // Pesquisar disciplinas
    disciplinasFiltradas = disciplinas.filter(disciplina => 
        disciplina.nome.toLowerCase().includes(termo) ||
        disciplina.professor.toLowerCase().includes(termo) ||
        disciplina.codigo.toLowerCase().includes(termo)
    );
    
    // Pesquisar atividades
    atividadesFiltradas = atividades.filter(atividade => 
        atividade.titulo.toLowerCase().includes(termo) ||
        atividade.disciplina.toLowerCase().includes(termo) ||
        atividade.descricao.toLowerCase().includes(termo)
    );
    
    // Atualizar exibição
    exibirDisciplinasFiltradas();
    exibirAtividadesFiltradas();
}

function pesquisarChat(termo) {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(termo)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function exibirDisciplinasFiltradas() {
    const container = document.getElementById('listaDisciplinas');
    
    if (disciplinasFiltradas.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>Nenhuma disciplina encontrada</p></div>';
        return;
    }
    
    container.innerHTML = disciplinasFiltradas.map(disciplina => `
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
                <button class="btn btn-primary" onclick="visualizarConteudo(${disciplina.id})">
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

function exibirAtividadesFiltradas() {
    const containers = ['atividadesPendentes', 'atividadesEntregues', 'atividadesAvaliadas'];
    
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        const status = containerId.replace('atividades', '').toLowerCase();
        
        const atividadesFiltradasStatus = atividadesFiltradas.filter(a => {
            if (status === 'pendentes') return a.status === 'pendente';
            if (status === 'entregues') return a.status === 'entregue' && !a.nota;
            if (status === 'avaliadas') return a.nota;
            return false;
        });
        
        if (atividadesFiltradasStatus.length === 0) {
            let message = '';
            if (status === 'pendentes') message = 'Nenhuma atividade pendente encontrada';
            if (status === 'entregues') message = 'Nenhuma atividade entregue encontrada';
            if (status === 'avaliadas') message = 'Nenhuma atividade avaliada encontrada';
            
            container.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i><p>${message}</p></div>`;
            return;
        }
        
        container.innerHTML = atividadesFiltradasStatus.map(atividade => `
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
                    ${atividade.status === 'pendente' ? `
                        <button class="btn btn-primary" onclick="visualizarDetalhesAtividade(${atividade.id})">
                            <i class="fas fa-eye"></i> Detalhes
                        </button>
                        <button class="btn btn-success" onclick="abrirModalEntrega(${atividade.id})">
                            <i class="fas fa-upload"></i> Entregar
                        </button>
                    ` : atividade.nota ? `
                        <button class="btn btn-primary" onclick="visualizarCorrecao(${atividade.id})">
                            <i class="fas fa-eye"></i> Ver Correção
                        </button>
                        <span class="status-badge status-resolvido">Avaliado: ${atividade.nota}/10</span>
                    ` : `
                        <button class="btn btn-primary" onclick="visualizarDetalhesAtividade(${atividade.id})">
                            <i class="fas fa-eye"></i> Ver Entrega
                        </button>
                        <span class="status-badge status-pendente">Aguardando avaliação</span>
                    `}
                </div>
            </div>
        `).join('');
    });
}

// FUNCIONALIDADE DE VISUALIZAR CONTEÚDO
function visualizarConteudo(disciplinaId) {
    const disciplina = disciplinas.find(d => d.id === disciplinaId);
    if (!disciplina) return;
    
    // Simular conteúdo (em sistema real, viria do backend)
    const conteudos = [
        { id: 1, titulo: "Aula 1 - Introdução", tipo: "pdf", data: "2023-10-01" },
        { id: 2, titulo: "Slides da Aula 2", tipo: "ppt", data: "2023-10-08" },
        { id: 3, titulo: "Material Complementar", tipo: "zip", data: "2023-10-15" },
        { id: 4, titulo: "Exercícios Resolvidos", tipo: "doc", data: "2023-10-22" }
    ];
    
    // Criar modal de conteúdos
    const modalHTML = `
        <div class="modal" id="conteudoModal">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3>Conteúdos - ${disciplina.nome}</h3>
                    <span class="close" onclick="fecharModal('conteudoModal')">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="conteudos-list">
                        ${conteudos.map(conteudo => `
                            <div class="conteudo-item">
                                <div class="conteudo-icon">
                                    <i class="fas fa-file-${conteudo.tipo === 'pdf' ? 'pdf' : conteudo.tipo === 'doc' ? 'word' : conteudo.tipo === 'ppt' ? 'powerpoint' : 'archive'} ${conteudo.tipo === 'pdf' ? 'text-danger' : conteudo.tipo === 'doc' ? 'text-primary' : conteudo.tipo === 'ppt' ? 'text-warning' : 'text-secondary'}"></i>
                                </div>
                                <div class="conteudo-info">
                                    <h4>${conteudo.titulo}</h4>
                                    <p>Disponibilizado em: ${formatarData(conteudo.data)}</p>
                                </div>
                                <div class="conteudo-actions">
                                    <button class="btn btn-primary btn-sm">
                                        <i class="fas fa-download"></i> Baixar
                                    </button>
                                    <button class="btn btn-secondary btn-sm">
                                        <i class="fas fa-eye"></i> Visualizar
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar modal ao documento
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('conteudoModal').style.display = 'block';
}

// MODAL DE ENTREGA DE ATIVIDADE
function abrirModalEntrega(atividadeId) {
    const atividade = atividades.find(a => a.id === atividadeId);
    if (!atividade) return;
    
    const modalHTML = `
        <div class="modal" id="entregaModal">
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>Entregar Atividade: ${atividade.titulo}</h3>
                    <span class="close" onclick="fecharModal('entregaModal')">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="arquivoEntrega">Selecionar arquivo (PDF, DOC, DOCX)</label>
                        <input type="file" id="arquivoEntrega" class="form-control" accept=".pdf,.doc,.docx" required>
                        <small class="text-help">Tamanho máximo: 10MB</small>
                    </div>
                    <div class="form-group">
                        <label for="observacaoEntrega">Observações (opcional)</label>
                        <textarea id="observacaoEntrega" class="form-control" rows="3" placeholder="Alguma observação sobre sua entrega..."></textarea>
                    </div>
                    <div class="entrega-info">
                        <p><strong>Data limite:</strong> ${formatarDataCompleta(atividade.dataEntrega)}</p>
                        <p class="text-${isPrazoProximo(atividade.dataEntrega) ? 'danger' : 'success'}">
                            ${isPrazoProximo(atividade.dataEntrega) ? '⚠️ Prazo próximo!' : '✅ Prazo dentro do normal'}
                        </p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="fecharModal('entregaModal')">Cancelar</button>
                    <button class="btn btn-success" onclick="enviarAtividade(${atividadeId})">
                        <i class="fas fa-check"></i> Confirmar Entrega
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('entregaModal').style.display = 'block';
}

function enviarAtividade(atividadeId) {
    const arquivoInput = document.getElementById('arquivoEntrega');
    const observacao = document.getElementById('observacaoEntrega').value;
    
    if (!arquivoInput.files[0]) {
        alert('Por favor, selecione um arquivo para enviar.');
        return;
    }
    
    // Validar tipo de arquivo
    const arquivo = arquivoInput.files[0];
    const tiposPermitidos = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!tiposPermitidos.includes(arquivo.type)) {
        alert('Por favor, selecione um arquivo PDF ou Word.');
        return;
    }
    
    // Validar tamanho do arquivo
    if (arquivo.size > 10 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 10MB.');
        return;
    }
    
    // Simular envio (em sistema real, seria uma requisição AJAX)
    const atividadeIndex = atividades.findIndex(a => a.id === atividadeId);
    if (atividadeIndex !== -1) {
        atividades[atividadeIndex].status = 'entregue';
        atividades[atividadeIndex].dataEntregaRealizada = new Date().toISOString();
        atividades[atividadeIndex].arquivo = arquivo.name;
        atividades[atividadeIndex].observacao = observacao;
        
        alert('Atividade entregue com sucesso!');
        fecharModal('entregaModal');
        carregarAtividades(); // Recarregar a lista
    }
}

function cancelarEntrega(atividadeId) {
    if (confirm('Tem certeza que deseja cancelar esta entrega?')) {
        const atividadeIndex = atividades.findIndex(a => a.id === atividadeId);
        if (atividadeIndex !== -1) {
            atividades[atividadeIndex].status = 'pendente';
            delete atividades[atividadeIndex].dataEntregaRealizada;
            delete atividades[atividadeIndex].arquivo;
            delete atividades[atividadeIndex].observacao;
            
            alert('Entrega cancelada com sucesso!');
            carregarAtividades(); // Recarregar a lista
        }
    }
}

// FUNÇÕES AUXILIARES DO CALENDÁRIO
function navegarCalendario(direcao) {
    currentCalendarMonth += direcao;
    
    if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
    } else if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
    }
    
    // Limitar navegação até 2025
    if (currentCalendarYear > 2025) {
        currentCalendarYear = 2025;
        currentCalendarMonth = 11;
        alert('Ano máximo é 2025');
        return;
    }
    
    if (currentCalendarYear < 2023) {
        currentCalendarYear = 2023;
        currentCalendarMonth = 0;
        alert('Ano mínimo é 2023');
        return;
    }
    
    carregarCalendario();
}

function carregarCalendario() {
    const primeiroDia = new Date(currentCalendarYear, currentCalendarMonth, 1);
    const ultimoDia = new Date(currentCalendarYear, currentCalendarMonth + 1, 0);
    const hoje = new Date();
    
    // Atualizar header do calendário
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    document.querySelector('.calendar-header h2').textContent = 
        `${meses[currentCalendarMonth]} ${currentCalendarYear}`;
    
    let html = '';
    
    // Dias vazios no início
    for (let i = 0; i < primeiroDia.getDay(); i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    // Dias do mês
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
        const dataAtual = new Date(currentCalendarYear, currentCalendarMonth, i);
        const isToday = dataAtual.toDateString() === hoje.toDateString();
        const isCurrentMonth = dataAtual.getMonth() === hoje.getMonth() && dataAtual.getFullYear() === hoje.getFullYear();
        
        // Verificar se é feriado
        const feriadoKey = `${currentCalendarMonth + 1}-${i}`;
        const isFeriado = feriadosNacionais[currentCalendarYear] && feriadosNacionais[currentCalendarYear][feriadoKey];
        
        // Verificar se tem atividade
        const temAtividade = atividades.some(a => {
            const dataAtividade = new Date(a.dataEntrega);
            return dataAtividade.getDate() === i && 
                   dataAtividade.getMonth() === currentCalendarMonth && 
                   dataAtividade.getFullYear() === currentCalendarYear;
        });
        
        html += `
            <div class="calendar-day ${isToday ? 'current' : ''} ${isFeriado ? 'feriado' : ''}">
                <div class="day-number">${i}</div>
                ${isFeriado ? '<div class="calendar-event feriado">Feriado</div>' : ''}
                ${temAtividade && !isFeriado ? '<div class="calendar-event atividade">Atividade</div>' : ''}
                ${isFeriado ? '<div class="feriado-tooltip">' + feriadosNacionais[currentCalendarYear][feriadoKey] + '</div>' : ''}
            </div>
        `;
    }
    
    document.getElementById('calendarioDias').innerHTML = html;
    
    // Adicionar event listeners para os botões de navegação
    const botoesNavegacao = document.querySelectorAll('.calendar-header .btn');
    if (botoesNavegacao.length === 2) {
        botoesNavegacao[0].onclick = () => navegarCalendario(-1);
        botoesNavegacao[1].onclick = () => navegarCalendario(1);
    }
}

// FUNÇÕES UTILITÁRIAS ADICIONAIS
function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.remove();
    }
}

function visualizarDetalhesAtividade(atividadeId) {
    const atividade = atividades.find(a => a.id === atividadeId);
    if (!atividade) return;
    
    alert(`Detalhes da atividade: ${atividade.titulo}\n\nDescrição: ${atividade.descricao}\nData de entrega: ${formatarDataCompleta(atividade.dataEntrega)}`);
}

function visualizarCorrecao(atividadeId) {
    const atividade = atividades.find(a => a.id === atividadeId);
    if (!atividade || !atividade.nota) return;
    
    alert(`Correção da atividade: ${atividade.titulo}\n\nNota: ${atividade.nota}/10\nData de avaliação: ${formatarDataCompleta(atividade.dataEntrega)}`);
}

// Adicionar event listener para fechar modal clicando fora
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        fecharModal(event.target.id);
    }
});

// Adicionar estilos dinâmicos para o calendário
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .calendar-day.feriado {
            background-color: rgba(231, 76, 60, 0.1);
        }
        
        .calendar-event.feriado {
            background-color: #e74c3c;
        }
        
        .feriado-tooltip {
            position: absolute;
            bottom: 5px;
            left: 5px;
            right: 5px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 0.7em;
            text-align: center;
            display: none;
            z-index: 10;
        }
        
        .calendar-day:hover .feriado-tooltip {
            display: block;
        }
        
        .conteudos-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .conteudo-item {
            display: flex;
            align-items: center;
            padding: 15px;
            border: 1px solid var(--light);
            border-radius: 8px;
            gap: 15px;
        }
        
        .conteudo-icon {
            font-size: 2rem;
        }
        
        .conteudo-info {
            flex: 1;
        }
        
        .conteudo-info h4 {
            margin: 0 0 5px 0;
            color: var(--dark);
        }
        
        .conteudo-info p {
            margin: 0;
            color: var(--text-light);
            font-size: 0.9rem;
        }
        
        .text-help {
            color: var(--text-light);
            font-size: 0.8rem;
        }
        
        .entrega-info {
            background: var(--bg-light);
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
        
        .text-danger {
            color: var(--danger);
        }
        
        .text-success {
            color: var(--success);
        }
    </style>
`);