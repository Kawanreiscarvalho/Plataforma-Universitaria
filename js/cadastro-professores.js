// js/cadastro-professores.js - VERSÃO COMPLETA COM SALA

class GerenciadorProfessores {
    constructor() {
        this.professores = this.carregarProfessores();
        this.editandoId = null;
        this.inicializarEventos();
        this.renderizarLista();
        this.configurarDependenciasTurnoHorario();
    }

    // Configurar dependência entre turno e horário
    configurarDependenciasTurnoHorario() {
        const turnoSelect = document.getElementById('professorTurno');
        const horarioSelect = document.getElementById('professorHorario');
        
        turnoSelect.addEventListener('change', () => {
            this.filtrarHorariosPorTurno();
        });
    }

    // Filtrar horários com base no turno selecionado
    filtrarHorariosPorTurno() {
        const turno = document.getElementById('professorTurno').value;
        const horarioSelect = document.getElementById('professorHorario');
        
        // Resetar e habilitar o campo
        horarioSelect.innerHTML = '<option value="">Selecione o horário</option>';
        horarioSelect.disabled = !turno;
        
        if (!turno) return;

        const horariosPorTurno = {
            'matutino': [
                { value: '07:00-09:00', label: '07:00 - 09:00' },
                { value: '08:00-10:00', label: '08:00 - 10:00' },
                { value: '10:00-12:00', label: '10:00 - 12:00' }
            ],
            'vespertino': [
                { value: '13:00-15:00', label: '13:00 - 15:00' },
                { value: '15:00-17:00', label: '15:00 - 17:00' },
                { value: '17:00-19:00', label: '17:00 - 19:00' }
            ],
            'noturno': [
                { value: '18:00-20:00', label: '18:00 - 20:00' },
                { value: '19:00-21:00', label: '19:00 - 21:00' },
                { value: '20:00-22:00', label: '20:00 - 22:00' },
                { value: '21:00-23:00', label: '21:00 - 23:00' }
            ],
            'integral': [
                { value: '07:00-09:00', label: '07:00 - 09:00' },
                { value: '08:00-10:00', label: '08:00 - 10:00' },
                { value: '10:00-12:00', label: '10:00 - 12:00' },
                { value: '13:00-15:00', label: '13:00 - 15:00' },
                { value: '15:00-17:00', label: '15:00 - 17:00' },
                { value: '17:00-19:00', label: '17:00 - 19:00' },
                { value: '18:00-20:00', label: '18:00 - 20:00' },
                { value: '19:00-21:00', label: '19:00 - 21:00' },
                { value: '20:00-22:00', label: '20:00 - 22:00' },
                { value: '21:00-23:00', label: '21:00 - 23:00' }
            ]
        };

        const horarios = horariosPorTurno[turno] || [];
        
        horarios.forEach(horario => {
            const option = document.createElement('option');
            option.value = horario.value;
            option.textContent = horario.label;
            horarioSelect.appendChild(option);
        });
    }

    // Carregar professores do localStorage
    carregarProfessores() {
        const professoresSalvos = localStorage.getItem('professores');
        return professoresSalvos ? JSON.parse(professoresSalvos) : [];
    }

    // Salvar professores no localStorage
    salvarProfessores() {
        localStorage.setItem('professores', JSON.stringify(this.professores));
    }

    // Inicializar eventos
    inicializarEventos() {
        // Formulário
        document.getElementById('professorForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarProfessor();
        });

        // Botão novo professor
        document.getElementById('novoProfessorBtn').addEventListener('click', () => {
            this.limparFormulario();
        });

        // Botão cancelar
        document.getElementById('cancelarBtn').addEventListener('click', () => {
            this.limparFormulario();
        });

        // Filtros
        document.getElementById('searchInput').addEventListener('input', () => {
            this.aplicarFiltros();
        });

        document.getElementById('filtroCurso').addEventListener('change', () => {
            this.aplicarFiltros();
        });

        document.getElementById('filtroTurno').addEventListener('change', () => {
            this.aplicarFiltros();
        });

        document.getElementById('filtroHorario').addEventListener('change', () => {
            this.aplicarFiltros();
        });
    }

    // Salvar/editar professor
    salvarProfessor() {
        const professor = {
            id: this.editandoId || Date.now(),
            nome: document.getElementById('professorNome').value,
            email: document.getElementById('professorEmail').value,
            curso: document.getElementById('professorCurso').value,
            periodo: document.getElementById('professorPeriodo').value,
            turno: document.getElementById('professorTurno').value,
            horario: document.getElementById('professorHorario').value,
            disciplina: document.getElementById('professorDisciplina').value,
            sala: document.getElementById('professorSala').value, // NOVO CAMPO
            dataCadastro: new Date().toISOString()
        };

        // Validar email único
        if (this.emailExiste(professor.email, professor.id)) {
            this.mostrarMensagem('Já existe um professor cadastrado com este email!', 'error');
            return;
        }

        if (this.editandoId) {
            // Editar professor existente
            const index = this.professores.findIndex(p => p.id === this.editandoId);
            this.professores[index] = professor;
            this.mostrarMensagem('Professor atualizado com sucesso!', 'success');
        } else {
            // Adicionar novo professor
            this.professores.push(professor);
            this.mostrarMensagem('Professor cadastrado com sucesso!', 'success');
        }

        this.salvarProfessores();
        this.renderizarLista();
        this.limparFormulario();
    }

    // Verificar se email já existe
    emailExiste(email, idAtual) {
        return this.professores.some(p => p.email === email && p.id !== idAtual);
    }

    // Mostrar mensagem
    mostrarMensagem(mensagem, tipo) {
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
            mensagemDiv.remove();
        }, 3000);
    }

    // Editar professor
    editarProfessor(id) {
        const professor = this.professores.find(p => p.id === id);
        if (!professor) return;

        this.editandoId = id;
        
        // Preencher formulário
        document.getElementById('professorId').value = professor.id;
        document.getElementById('professorNome').value = professor.nome;
        document.getElementById('professorEmail').value = professor.email;
        document.getElementById('professorCurso').value = professor.curso;
        document.getElementById('professorPeriodo').value = professor.periodo;
        document.getElementById('professorTurno').value = professor.turno;
        
        // Configurar horários baseado no turno
        this.filtrarHorariosPorTurno();
        setTimeout(() => {
            document.getElementById('professorHorario').value = professor.horario;
        }, 100);
        
        document.getElementById('professorDisciplina').value = professor.disciplina;
        document.getElementById('professorSala').value = professor.sala; // NOVO CAMPO
        
        // Atualizar título do formulário
        document.getElementById('formTitle').textContent = 'Editar Professor';
        
        // Rolagem suave para o formulário
        document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
    }

    // Excluir professor
    excluirProfessor(id) {
        if (!confirm('Tem certeza que deseja excluir este professor?')) {
            return;
        }

        this.professores = this.professores.filter(p => p.id !== id);
        this.salvarProfessores();
        this.renderizarLista();
        this.mostrarMensagem('Professor excluído com sucesso!', 'success');
    }

    // Limpar formulário
    limparFormulario() {
        document.getElementById('professorForm').reset();
        document.getElementById('professorId').value = '';
        this.editandoId = null;
        document.getElementById('professorHorario').innerHTML = '<option value="">Selecione o horário</option>';
        document.getElementById('professorHorario').disabled = true;
        document.getElementById('formTitle').textContent = 'Cadastrar Novo Professor';
    }

    // Aplicar filtros
    aplicarFiltros() {
        this.renderizarLista();
    }

    // Obter professores filtrados
    obterProfessoresFiltrados() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filtroCurso = document.getElementById('filtroCurso').value;
        const filtroTurno = document.getElementById('filtroTurno').value;
        const filtroHorario = document.getElementById('filtroHorario').value;

        return this.professores.filter(professor => {
            const matchSearch = professor.nome.toLowerCase().includes(searchTerm) ||
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
        const professoresFiltrados = this.obterProfessoresFiltrados();

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
                        <button class="btn btn-secondary" onclick="gerenciador.editarProfessor(${professor.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="gerenciador.excluirProfessor(${professor.id})">
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

    // Métodos auxiliares para formatação
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

// Inicializar o gerenciador
const gerenciador = new GerenciadorProfessores();

// CSS para as mensagens
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