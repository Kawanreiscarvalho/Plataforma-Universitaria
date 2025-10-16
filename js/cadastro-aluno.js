// js/cadastro-aluno.js

class GerenciadorAlunos {
    constructor() {
        this.alunos = this.carregarAlunos();
        this.editandoId = null;
        this.inicializarEventos();
        this.renderizarLista();
    }

    // Carregar alunos do localStorage
    carregarAlunos() {
        const alunosSalvos = localStorage.getItem('alunos');
        return alunosSalvos ? JSON.parse(alunosSalvos) : [];
    }

    // Salvar alunos no localStorage
    salvarAlunos() {
        localStorage.setItem('alunos', JSON.stringify(this.alunos));
    }

    // Inicializar eventos
    inicializarEventos() {
        // Formulário
        document.getElementById('alunoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarAluno();
        });

        // Botão novo aluno
        document.getElementById('novoAlunoBtn').addEventListener('click', () => {
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

        document.getElementById('filtroPeriodo').addEventListener('change', () => {
            this.aplicarFiltros();
        });

        // Máscara de CPF
        document.getElementById('alunoCPF').addEventListener('input', (e) => {
            this.aplicarMascaraCPF(e.target);
        });
    }

    // Aplicar máscara de CPF
    aplicarMascaraCPF(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        
        input.value = value;
    }

    // Obter disciplinas selecionadas
    obterDisciplinasSelecionadas() {
        const checkboxes = document.querySelectorAll('.disciplina-checkbox input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    // Preencher disciplinas no formulário
    preencherDisciplinas(disciplinas) {
        const checkboxes = document.querySelectorAll('.disciplina-checkbox input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = disciplinas.includes(cb.value);
        });
    }

    // Salvar/editar aluno
    salvarAluno() {
        const disciplinas = this.obterDisciplinasSelecionadas();
        
        if (disciplinas.length === 0) {
            this.mostrarMensagem('Selecione pelo menos uma disciplina!', 'error');
            return;
        }

        const aluno = {
            id: this.editandoId || Date.now(),
            nome: document.getElementById('alunoNome').value,
            email: document.getElementById('alunoEmail').value,
            cpf: document.getElementById('alunoCPF').value,
            curso: document.getElementById('alunoCurso').value,
            periodo: document.getElementById('alunoPeriodo').value,
            turno: document.getElementById('alunoTurno').value,
            disciplinas: disciplinas,
            dataCadastro: new Date().toISOString()
        };

        // Validar email único
        if (this.emailExiste(aluno.email, aluno.id)) {
            this.mostrarMensagem('Já existe um aluno cadastrado com este email!', 'error');
            return;
        }

        // Validar CPF único
        if (this.cpfExiste(aluno.cpf, aluno.id)) {
            this.mostrarMensagem('Já existe um aluno cadastrado com este CPF!', 'error');
            return;
        }

        if (this.editandoId) {
            // Editar aluno existente
            const index = this.alunos.findIndex(a => a.id === this.editandoId);
            this.alunos[index] = aluno;
            this.mostrarMensagem('Aluno atualizado com sucesso!', 'success');
        } else {
            // Adicionar novo aluno
            this.alunos.push(aluno);
            this.mostrarMensagem('Aluno cadastrado com sucesso!', 'success');
        }

        this.salvarAlunos();
        this.renderizarLista();
        this.limparFormulario();
    }

    // Verificar se email já existe
    emailExiste(email, idAtual) {
        return this.alunos.some(a => a.email === email && a.id !== idAtual);
    }

    // Verificar se CPF já existe
    cpfExiste(cpf, idAtual) {
        return this.alunos.some(a => a.cpf === cpf && a.id !== idAtual);
    }

    // Mostrar mensagem
    mostrarMensagem(mensagem, tipo) {
        const mensagemDiv = document.createElement('div');
        mensagemDiv.className = `mensagem ${tipo}`;
        mensagemDiv.innerHTML = `
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${mensagem}
        `;

        document.body.appendChild(mensagemDiv);

        setTimeout(() => {
            mensagemDiv.remove();
        }, 3000);
    }

    // Editar aluno
    editarAluno(id) {
        const aluno = this.alunos.find(a => a.id === id);
        if (!aluno) return;

        this.editandoId = id;
        
        // Preencher formulário
        document.getElementById('alunoId').value = aluno.id;
        document.getElementById('alunoNome').value = aluno.nome;
        document.getElementById('alunoEmail').value = aluno.email;
        document.getElementById('alunoCPF').value = aluno.cpf;
        document.getElementById('alunoCurso').value = aluno.curso;
        document.getElementById('alunoPeriodo').value = aluno.periodo;
        document.getElementById('alunoTurno').value = aluno.turno;
        
        // Preencher disciplinas
        this.preencherDisciplinas(aluno.disciplinas);
        
        // Atualizar título do formulário
        document.getElementById('formTitle').textContent = 'Editar Aluno';
        
        // Rolagem suave para o formulário
        document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
    }

    // Excluir aluno
    excluirAluno(id) {
        if (!confirm('Tem certeza que deseja excluir este aluno?')) {
            return;
        }

        this.alunos = this.alunos.filter(a => a.id !== id);
        this.salvarAlunos();
        this.renderizarLista();
        this.mostrarMensagem('Aluno excluído com sucesso!', 'success');
    }

    // Limpar formulário
    limparFormulario() {
        document.getElementById('alunoForm').reset();
        document.getElementById('alunoId').value = '';
        this.editandoId = null;
        document.getElementById('formTitle').textContent = 'Cadastrar Novo Aluno';
    }

    // Aplicar filtros
    aplicarFiltros() {
        this.renderizarLista();
    }

    // Obter alunos filtrados
    obterAlunosFiltrados() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filtroCurso = document.getElementById('filtroCurso').value;
        const filtroTurno = document.getElementById('filtroTurno').value;
        const filtroPeriodo = document.getElementById('filtroPeriodo').value;

        return this.alunos.filter(aluno => {
            const matchSearch = aluno.nome.toLowerCase().includes(searchTerm) ||
                              aluno.email.toLowerCase().includes(searchTerm) ||
                              aluno.cpf.includes(searchTerm);
            const matchCurso = !filtroCurso || aluno.curso === filtroCurso;
            const matchTurno = !filtroTurno || aluno.turno === filtroTurno;
            const matchPeriodo = !filtroPeriodo || aluno.periodo === filtroPeriodo;

            return matchSearch && matchCurso && matchTurno && matchPeriodo;
        });
    }

    // Renderizar lista de alunos
    renderizarLista() {
        const container = document.getElementById('listaAlunos');
        const alunosFiltrados = this.obterAlunosFiltrados();

        if (alunosFiltrados.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-graduate"></i>
                    <p>Nenhum aluno encontrado</p>
                    <small>Tente ajustar os filtros ou cadastrar um novo aluno</small>
                </div>
            `;
            return;
        }

        container.innerHTML = alunosFiltrados.map(aluno => `
            <div class="professor-item">
                <div class="professor-header">
                    <div class="professor-info">
                        <h3>${aluno.nome}</h3>
                        <div class="professor-email">${aluno.email} | CPF: ${aluno.cpf}</div>
                    </div>
                    <div class="professor-actions">
                        <button class="btn btn-secondary" onclick="gerenciadorAlunos.editarAluno(${aluno.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="gerenciadorAlunos.excluirAluno(${aluno.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="professor-details">
                    <div class="detail-item">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Curso: ${this.formatarCurso(aluno.curso)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>Período: ${aluno.periodo}º</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>Turno: ${this.formatarTurno(aluno.turno)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-book"></i>
                        <span>Disciplinas: ${this.formatarDisciplinas(aluno.disciplinas)}</span>
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

    formatarDisciplinas(disciplinas) {
        const disciplinasMap = {
            'calculo': 'Cálculo I',
            'fisica': 'Física I',
            'programacao': 'Programação I',
            'algebra': 'Álgebra Linear',
            'banco-dados': 'Banco de Dados',
            'redes': 'Redes de Computadores'
        };
        
        return disciplinas.map(d => disciplinasMap[d] || d).join(', ');
    }

    // Método para obter todos os alunos (para uso em outras páginas)
    obterTodosAlunos() {
        return this.alunos;
    }

    // Método para obter aluno por ID (para uso em outras páginas)
    obterAlunoPorId(id) {
        return this.alunos.find(a => a.id === id);
    }

    // Método para obter alunos por curso (para uso em outras páginas)
    obterAlunosPorCurso(curso) {
        return this.alunos.filter(a => a.curso === curso);
    }

    // Método para obter alunos por disciplina (para uso em outras páginas)
    obterAlunosPorDisciplina(disciplina) {
        return this.alunos.filter(a => a.disciplinas.includes(disciplina));
    }
}

// Inicializar o gerenciador
const gerenciadorAlunos = new GerenciadorAlunos();

// CSS adicional para as disciplinas
const style = document.createElement('style');
style.textContent = `
    .disciplinas-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
        margin-top: 8px;
    }
    
    .disciplina-checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: var(--light);
        border-radius: 6px;
        transition: var(--transition);
    }
    
    .disciplina-checkbox:hover {
        background: #e0e0e0;
    }
    
    .disciplina-checkbox input[type="checkbox"] {
        width: 16px;
        height: 16px;
    }
    
    .disciplina-checkbox label {
        margin: 0;
        cursor: pointer;
        font-weight: normal;
    }
    
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

// Exportar para uso em outras páginas
window.GerenciadorAlunos = GerenciadorAlunos;
window.gerenciadorAlunos = gerenciadorAlunos;