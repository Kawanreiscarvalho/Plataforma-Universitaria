// js/cadastro-professores.js - VERSÃO CORRIGIDA

class GerenciadorProfessores {
    constructor() {
        this.professores = this.carregarProfessores();
        this.editandoId = null;
        this.inicializarEventos();
        this.renderizarLista();
        this.configurarDependenciasTurnoHorario();
        
        console.log('Gerenciador inicializado. Professores carregados:', this.professores.length);
    }

    // Configurar dependência entre turno e horário
    configurarDependenciasTurnoHorario() {
        const turnoSelect = document.getElementById('professorTurno');
        const horarioSelect = document.getElementById('professorHorario');
        
        if (turnoSelect && horarioSelect) {
            turnoSelect.addEventListener('change', () => {
                this.filtrarHorariosPorTurno();
            });
        }
    }

    // Filtrar horários com base no turno selecionado
    filtrarHorariosPorTurno() {
        const turno = document.getElementById('professorTurno').value;
        const horarioSelect = document.getElementById('professorHorario');
        
        if (!horarioSelect) return;
        
        horarioSelect.innerHTML = '<option value="">Selecione o horário</option>';
        horarioSelect.disabled = !turno;
        
        if (!turno) return;

        const horariosPorTurno = {
            'matutino': ['07:00-09:00', '08:00-10:00', '10:00-12:00'],
            'vespertino': ['13:00-15:00', '15:00-17:00', '17:00-19:00'],
            'noturno': ['18:00-20:00', '19:00-21:00', '20:00-22:00', '21:00-23:00'],
            'integral': ['07:00-09:00', '08:00-10:00', '10:00-12:00', '13:00-15:00', '15:00-17:00', '17:00-19:00', '18:00-20:00', '19:00-21:00', '20:00-22:00']
        };

        const horarios = horariosPorTurno[turno] || [];
        
        horarios.forEach(horario => {
            const option = document.createElement('option');
            option.value = horario;
            option.textContent = horario.replace('-', ' - ');
            horarioSelect.appendChild(option);
        });
    }

    // Carregar professores do localStorage
    carregarProfessores() {
        try {
            const professoresSalvos = localStorage.getItem('professores');
            return professoresSalvos ? JSON.parse(professoresSalvos) : [];
        } catch (error) {
            console.error('Erro ao carregar professores:', error);
            return [];
        }
    }

    // Salvar professores no localStorage
    salvarProfessores() {
        try {
            localStorage.setItem('professores', JSON.stringify(this.professores));
            console.log('Professores salvos:', this.professores);
            return true;
        } catch (error) {
            console.error('Erro ao salvar professores:', error);
            this.mostrarMensagem('Erro ao salvar dados!', 'error');
            return false;
        }
    }

    // Inicializar eventos
    inicializarEventos() {
        console.log('Inicializando eventos...');
        
        // Formulário
        const form = document.getElementById('professorForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Formulário submetido');
                this.salvarProfessor();
            });
        } else {
            console.error('Formulário não encontrado!');
        }

        // Botão novo professor
        const novoBtn = document.getElementById('novoProfessorBtn');
        if (novoBtn) {
            novoBtn.addEventListener('click', () => {
                this.limparFormulario();
            });
        }

        // Botão cancelar
        const cancelarBtn = document.getElementById('cancelarBtn');
        if (cancelarBtn) {
            cancelarBtn.addEventListener('click', () => {
                this.limparFormulario();
            });
        }

        // Filtros
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.aplicarFiltros();
            });
        }

        // Outros filtros...
        ['filtroCurso', 'filtroTurno', 'filtroHorario'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    this.aplicarFiltros();
                });
            }
        });
    }

    // Salvar/editar professor - VERSÃO SIMPLIFICADA E CORRIGIDA
    salvarProfessor() {
        console.log('Iniciando salvamento do professor...');
        
        // Coletar dados do formulário
        const professor = {
            id: this.editandoId || Date.now(),
            nome: this.obterValorCampo('professorNome'),
            email: this.obterValorCampo('professorEmail'),
            curso: this.obterValorCampo('professorCurso'),
            periodo: this.obterValorCampo('professorPeriodo'),
            turno: this.obterValorCampo('professorTurno'),
            horario: this.obterValorCampo('professorHorario'),
            disciplina: this.obterValorCampo('professorDisciplina'),
            sala: this.obterValorCampo('professorSala'),
            dataCadastro: new Date().toISOString()
        };

        console.log('Dados do professor:', professor);

        // Validações básicas
        if (!professor.nome || !professor.email) {
            this.mostrarMensagem('Nome e email são obrigatórios!', 'error');
            return;
        }

        // Validar email único
        if (this.emailExiste(professor.email, professor.id)) {
            this.mostrarMensagem('Já existe um professor cadastrado com este email!', 'error');
            return;
        }

        try {
            if (this.editandoId) {
                // Editar professor existente
                const index = this.professores.findIndex(p => p.id === this.editandoId);
                if (index !== -1) {
                    this.professores[index] = professor;
                    console.log('Professor atualizado:', professor);
                    this.mostrarMensagem('Professor atualizado com sucesso!', 'success');
                }
            } else {
                // Adicionar novo professor
                this.professores.push(professor);
                console.log('Novo professor adicionado:', professor);
                this.mostrarMensagem('Professor cadastrado com sucesso!', 'success');
            }

            // Salvar no localStorage
            if (this.salvarProfessores()) {
                this.renderizarLista();
                this.limparFormulario();
            }
        } catch (error) {
            console.error('Erro ao salvar professor:', error);
            this.mostrarMensagem('Erro ao salvar professor!', 'error');
        }
    }

    // Método auxiliar para obter valor do campo
    obterValorCampo(id) {
        const element = document.getElementById(id);
        return element ? element.value : '';
    }

    // Verificar se email já existe
    emailExiste(email, idAtual) {
        return this.professores.some(p => p.email === email && p.id !== idAtual);
    }

    // Mostrar mensagem
    mostrarMensagem(mensagem, tipo) {
        console.log(`Mensagem [${tipo}]:`, mensagem);
        
        // Remover mensagens existentes
        const mensagensExistentes = document.querySelectorAll('.mensagem');
        mensagensExistentes.forEach(msg => msg.remove());

        // Criar elemento de mensagem
        const mensagemDiv = document.createElement('div');
        mensagemDiv.className = `mensagem ${tipo}`;
        mensagemDiv.innerHTML = `
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${mensagem}
        `;

        // Adicionar ao DOM
        document.body.appendChild(mensagemDiv);

        // Remover após 3 segundos
        setTimeout(() => {
            if (mensagemDiv.parentNode) {
                mensagemDiv.remove();
            }
        }, 3000);
    }

    // Editar professor
    editarProfessor(id) {
        console.log('Editando professor ID:', id);
        const professor = this.professores.find(p => p.id === id);
        if (!professor) {
            console.error('Professor não encontrado:', id);
            return;
        }

        this.editandoId = id;
        
        // Preencher formulário
        this.preencherCampo('professorId', professor.id);
        this.preencherCampo('professorNome', professor.nome);
        this.preencherCampo('professorEmail', professor.email);
        this.preencherCampo('professorCurso', professor.curso);
        this.preencherCampo('professorPeriodo', professor.periodo);
        this.preencherCampo('professorTurno', professor.turno);
        this.preencherCampo('professorDisciplina', professor.disciplina);
        this.preencherCampo('professorSala', professor.sala);
        
        // Configurar horários baseado no turno
        this.filtrarHorariosPorTurno();
        setTimeout(() => {
            this.preencherCampo('professorHorario', professor.horario);
        }, 100);
        
        // Atualizar título do formulário
        const formTitle = document.getElementById('formTitle');
        if (formTitle) {
            formTitle.textContent = 'Editar Professor';
        }
    }

    // Método auxiliar para preencher campo
    preencherCampo(id, valor) {
        const element = document.getElementById(id);
        if (element) {
            element.value = valor || '';
        }
    }

    // Excluir professor
    excluirProfessor(id) {
        if (!confirm('Tem certeza que deseja excluir este professor?')) {
            return;
        }

        this.professores = this.professores.filter(p => p.id !== id);
        if (this.salvarProfessores()) {
            this.renderizarLista();
            this.mostrarMensagem('Professor excluído com sucesso!', 'success');
        }
    }

    // Limpar formulário
    limparFormulario() {
        const form = document.getElementById('professorForm');
        if (form) {
            form.reset();
        }
        this.preencherCampo('professorId', '');
        this.editandoId = null;
        
        const horarioSelect = document.getElementById('professorHorario');
        if (horarioSelect) {
            horarioSelect.innerHTML = '<option value="">Selecione o horário</option>';
            horarioSelect.disabled = true;
        }
        
        const formTitle = document.getElementById('formTitle');
        if (formTitle) {
            formTitle.textContent = 'Cadastrar Novo Professor';
        }
        
        console.log('Formulário limpo');
    }

    // Aplicar filtros
    aplicarFiltros() {
        this.renderizarLista();
    }

    // Obter professores filtrados
    obterProfessoresFiltrados() {
        const searchTerm = this.obterValorCampo('searchInput').toLowerCase();
        const filtroCurso = this.obterValorCampo('filtroCurso');
        const filtroTurno = this.obterValorCampo('filtroTurno');
        const filtroHorario = this.obterValorCampo('filtroHorario');

        return this.professores.filter(professor => {
            const matchSearch = !searchTerm || 
                               professor.nome.toLowerCase().includes(searchTerm) ||
                               professor.email.toLowerCase().includes(searchTerm);
            const matchCurso = !filtroCurso || professor.curso === filtroCurso;
            const matchTurno = !filtroTurno || professor.turno === filtroTurno;
            const matchHorario = !filtroHorario || professor.horario === filtroHorario;

            return matchSearch && matchCurso && matchTurno && matchHorario;
        });
    }

    // Renderizar lista de professores
    renderizarLista() {
        const container = document.getElementById('listaProfessores');
        if (!container) {
            console.error('Container da lista de professores não encontrado!');
            return;
        }

        const professoresFiltrados = this.obterProfessoresFiltrados();
        console.log('Renderizando lista. Total:', professoresFiltrados.length);

        if (professoresFiltrados.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chalkboard-teacher"></i>
                    <p>Nenhum professor encontrado</p>
                    <small>Tente ajustar os filtros ou cadastrar um novo professor</small>
                </div>
            `;
            return;
        }

        container.innerHTML = professoresFiltrados.map(professor => `
            <div class="professor-item">
                <div class="professor-header">
                    <div class="professor-info">
                        <h3>${professor.nome}</h3>
                        <div class="professor-email">${professor.email}</div>
                    </div>
                    <div class="professor-actions">
                        <button class="btn btn-secondary" onclick="gerenciadorProfessores.editarProfessor(${professor.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="gerenciadorProfessores.excluirProfessor(${professor.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="professor-details">
                    <div class="detail-item">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Curso: ${this.formatarCurso(professor.curso)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>Período: ${professor.periodo}º</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>Turno: ${this.formatarTurno(professor.turno)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>Horário: ${professor.horario}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-book"></i>
                        <span>Disciplina: ${this.formatarDisciplina(professor.disciplina)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-door-open"></i>
                        <span>Sala: ${professor.sala}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Métodos auxiliares para formatação (mantidos iguais)
    formatarCurso(curso) {
        const cursos = {
            'engenharia': 'Engenharia de Software',
            'direito': 'Direito',
            'administracao': 'Administração',
            'medicina': 'Medicina',
            'arquitetura': 'Arquitetura'
        };
        return cursos[curso] || curso;
    }

    formatarTurno(turno) {
        const turnos = {
            'matutino': 'Matutino',
            'vespertino': 'Vespertino',
            'noturno': 'Noturno',
            'integral': 'Integral'
        };
        return turnos[turno] || turno;
    }

    formatarDisciplina(disciplina) {
        const disciplinas = {
            'calculo': 'Cálculo I',
            'fisica': 'Física I',
            'programacao': 'Programação I',
            'algebra': 'Álgebra Linear',
            'banco-dados': 'Banco de Dados',
            'redes': 'Redes de Computadores'
        };
        return disciplinas[disciplina] || disciplina;
    }
}

// Inicializar o gerenciador com verificação
let gerenciadorProfessores;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando gerenciador...');
    gerenciadorProfessores = new GerenciadorProfessores();
    
    // Verificar se os elementos necessários existem
    if (!document.getElementById('professorForm')) {
        console.error('Elemento professorForm não encontrado! Verifique o HTML.');
    }
    if (!document.getElementById('listaProfessores')) {
        console.error('Elemento listaProfessores não encontrado! Verifique o HTML.');
    }
});

// CSS para as mensagens (mantido igual)
const style = document.createElement('style');
style.textContent = `
    .mensagem {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .mensagem.success {
        background: #2ecc71;
    }
    
    .mensagem.error {
        background: #e74c3c;
    }
    
    .mensagem i {
        margin-right: 8px;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);