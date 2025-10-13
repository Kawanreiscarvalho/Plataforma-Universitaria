// cadastro-professores.js
class GerenciadorProfessores {
    constructor() {
        this.professores = this.carregarProfessores();
        this.editandoId = null;
        this.inicializarEventos();
        this.renderizarLista();
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
            disciplina: document.getElementById('professorDisciplina').value,
            dataCadastro: new Date().toISOString()
        };

        // Validar email único
        if (this.emailExiste(professor.email, professor.id)) {
            alert('Já existe um professor cadastrado com este email!');
            return;
        }

        if (this.editandoId) {
            // Editar professor existente
            const index = this.professores.findIndex(p => p.id === this.editandoId);
            this.professores[index] = professor;
        } else {
            // Adicionar novo professor
            this.professores.push(professor);
        }

        this.salvarProfessores();
        this.renderizarLista();
        this.limparFormulario();
        
        alert(`Professor ${this.editandoId ? 'atualizado' : 'cadastrado'} com sucesso!`);
    }

    // Verificar se email já existe
    emailExiste(email, idAtual) {
        return this.professores.some(p => p.email === email && p.id !== idAtual);
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
        document.getElementById('professorDisciplina').value = professor.disciplina;
        
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
        
        alert('Professor excluído com sucesso!');
    }

    // Limpar formulário
    limparFormulario() {
        document.getElementById('professorForm').reset();
        document.getElementById('professorId').value = '';
        this.editandoId = null;
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

        return this.professores.filter(professor => {
            const matchSearch = professor.nome.toLowerCase().includes(searchTerm) ||
                              professor.email.toLowerCase().includes(searchTerm);
            const matchCurso = !filtroCurso || professor.curso === filtroCurso;
            const matchTurno = !filtroTurno || professor.turno === filtroTurno;

            return matchSearch && matchCurso && matchTurno;
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
                        <i class="fas fa-book"></i>
                        <span>Disciplina: ${this.formatarDisciplina(professor.disciplina)}</span>
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

    // Método para obter todos os professores (para uso em outras páginas)
    obterTodosProfessores() {
        return this.professores;
    }

    // Método para obter professor por ID (para uso em outras páginas)
    obterProfessorPorId(id) {
        return this.professores.find(p => p.id === id);
    }

    // Método para obter professores por curso (para uso em outras páginas)
    obterProfessoresPorCurso(curso) {
        return this.professores.filter(p => p.curso === curso);
    }
}

// Inicializar o gerenciador
const gerenciador = new GerenciadorProfessores();

// Exportar para uso em outras páginas (se necessário)
window.GerenciadorProfessores = GerenciadorProfessores;
window.gerenciadorProfessores = gerenciador;