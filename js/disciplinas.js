// Sistema de Disciplinas - Integração com dados do diretor

// Função para obter disciplinas definidas pelo diretor
function getDisciplinesFromDirector() {
    const courses = localStorage.getItem('courses');
    const disciplines = localStorage.getItem('disciplines');
    
    // Se não existirem dados, criar alguns exemplos
    if (!courses || !disciplines) {
        initializeSampleData();
        return getDisciplinesFromDirector(); // Recursão para retornar os dados criados
    }
    
    return {
        courses: JSON.parse(courses),
        disciplines: JSON.parse(disciplines)
    };
}

// Função para obter as disciplinas do aluno atual
function getStudentDisciplines() {
    const studentDisciplines = localStorage.getItem('studentDisciplines');
    
    // Se não existirem disciplinas do aluno, criar com base nas disciplinas disponíveis
    if (!studentDisciplines) {
        const { disciplines } = getDisciplinesFromDirector();
        
        // Simular matrícula do aluno em algumas disciplinas
        const studentEnrollments = disciplines
            .filter(d => d.active) // Apenas disciplinas ativas
            .slice(0, 5) // Matricular em até 5 disciplinas
            .map(d => ({
                disciplineId: d.id,
                enrollmentDate: new Date().toISOString(),
                status: 'active'
            }));
        
        localStorage.setItem('studentDisciplines', JSON.stringify(studentEnrollments));
        return studentEnrollments;
    }
    
    return JSON.parse(studentDisciplines);
}

// Dados de exemplo (serão usados apenas se não houver dados do diretor)
function initializeSampleData() {
    // Cursos de exemplo
    const sampleCourses = [
        { id: 1, name: "Engenharia de Software", active: true },
        { id: 2, name: "Matemática", active: true },
        { id: 3, name: "Física", active: true },
        { id: 4, name: "História", active: true }
    ];
    
    // Disciplinas de exemplo
    const sampleDisciplines = [
        {
            id: 1,
            name: "Cálculo I",
            code: "MAT101",
            courseId: 1,
            period: "1º Período",
            workload: 60,
            professor: "Prof. Carlos Silva",
            description: "Introdução aos conceitos fundamentais do cálculo diferencial e integral.",
            active: true
        },
        {
            id: 2,
            name: "Física I",
            code: "FIS101",
            courseId: 1,
            period: "1º Período",
            workload: 60,
            professor: "Prof. Ana Santos",
            description: "Mecânica clássica: cinemática, dinâmica e leis de Newton.",
            active: true
        },
        {
            id: 3,
            name: "Programação I",
            code: "PROG101",
            courseId: 1,
            period: "1º Período",
            workload: 80,
            professor: "Prof. João Pereira",
            description: "Introdução à lógica de programação e algoritmos.",
            active: true
        },
        {
            id: 4,
            name: "Álgebra Linear",
            code: "MAT201",
            courseId: 1,
            period: "2º Período",
            workload: 60,
            professor: "Prof. Maria Oliveira",
            description: "Estudo de vetores, matrizes e sistemas lineares.",
            active: true
        },
        {
            id: 5,
            name: "Banco de Dados",
            code: "BD101",
            courseId: 1,
            period: "3º Período",
            workload: 80,
            professor: "Prof. Roberto Almeida",
            description: "Conceitos fundamentais de modelagem e implementação de bancos de dados.",
            active: true
        },
        {
            id: 6,
            name: "História da Computação",
            code: "HC101",
            courseId: 1,
            period: "1º Período",
            workload: 40,
            professor: "Prof. Juliana Costa",
            description: "Evolução histórica da computação e suas implicações sociais.",
            active: true
        }
    ];
    
    localStorage.setItem('courses', JSON.stringify(sampleCourses));
    localStorage.setItem('disciplines', JSON.stringify(sampleDisciplines));
}

// Carregar disciplinas do aluno
function loadStudentDisciplines() {
    const studentEnrollments = getStudentDisciplines();
    const { courses, disciplines } = getDisciplinesFromDirector();
    
    // Combinar informações das disciplinas com as matrículas do aluno
    const studentDisciplines = studentEnrollments.map(enrollment => {
        const discipline = disciplines.find(d => d.id === enrollment.disciplineId);
        const course = courses.find(c => c.id === discipline.courseId);
        
        return {
            ...discipline,
            courseName: course ? course.name : 'Curso não encontrado',
            enrollmentDate: enrollment.enrollmentDate,
            status: enrollment.status
        };
    });
    
    return studentDisciplines;
}

// Atualizar estatísticas
function updateStatistics(disciplines) {
    document.getElementById('totalDisciplinas').textContent = disciplines.length;
    
    const totalWorkload = disciplines.reduce((sum, d) => sum + d.workload, 0);
    document.getElementById('totalCargaHoraria').textContent = `${totalWorkload}h`;
    
    const uniqueProfessors = [...new Set(disciplines.map(d => d.professor))].length;
    document.getElementById('totalProfessores').textContent = uniqueProfessors;
}

// Carregar filtros
function loadFilters(disciplines) {
    const courseFilter = document.getElementById('courseFilter');
    const courses = [...new Set(disciplines.map(d => d.courseName))];
    
    // Limpar opções existentes (exceto a primeira)
    while (courseFilter.children.length > 1) {
        courseFilter.removeChild(courseFilter.lastChild);
    }
    
    // Adicionar cursos únicos
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course;
        option.textContent = course;
        courseFilter.appendChild(option);
    });
}

// Filtrar disciplinas
function filterDisciplines() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const courseFilter = document.getElementById('courseFilter').value;
    const periodFilter = document.getElementById('periodFilter').value;
    
    const allDisciplines = loadStudentDisciplines();
    
    const filteredDisciplines = allDisciplines.filter(discipline => {
        const matchesSearch = !searchTerm || 
            discipline.name.toLowerCase().includes(searchTerm) ||
            discipline.professor.toLowerCase().includes(searchTerm) ||
            discipline.description.toLowerCase().includes(searchTerm);
        
        const matchesCourse = !courseFilter || discipline.courseName === courseFilter;
        const matchesPeriod = !periodFilter || discipline.period.includes(periodFilter);
        
        return matchesSearch && matchesCourse && matchesPeriod;
    });
    
    displayDisciplines(filteredDisciplines);
    updateStatistics(filteredDisciplines);
}

// Exibir disciplinas na página
function displayDisciplines(disciplines) {
    const container = document.getElementById('disciplinasList');
    const emptyState = document.getElementById('emptyState');
    
    if (disciplines.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    container.innerHTML = '';
    
    disciplines.forEach(discipline => {
        const disciplineCard = document.createElement('div');
        disciplineCard.className = 'disciplina-card';
        disciplineCard.setAttribute('data-id', discipline.id);
        
        disciplineCard.innerHTML = `
            <div class="disciplina-header">
                <h3 class="disciplina-title">${discipline.name}</h3>
                <span class="disciplina-code">${discipline.code}</span>
            </div>
            <div class="disciplina-info">
                <div class="disciplina-meta">
                    <div class="meta-item">
                        <i class="fas fa-user-tie"></i>
                        ${discipline.professor}
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-graduation-cap"></i>
                        ${discipline.courseName}
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        ${discipline.workload}h
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-calendar"></i>
                        ${discipline.period}
                    </div>
                </div>
                <div class="disciplina-description">
                    ${discipline.description}
                </div>
            </div>
            <div class="disciplina-actions">
                <span class="disciplina-status status-${discipline.status === 'active' ? 'active' : 'inactive'}">
                    ${discipline.status === 'active' ? 'Ativa' : 'Inativa'}
                </span>
                <button class="btn btn-primary btn-view-details">
                    <i class="fas fa-eye"></i> Detalhes
                </button>
            </div>
        `;
        
        container.appendChild(disciplineCard);
    });
    
    // Adicionar event listeners para os botões de detalhes
    document.querySelectorAll('.btn-view-details').forEach(button => {
        button.addEventListener('click', function() {
            const disciplineId = this.closest('.disciplina-card').getAttribute('data-id');
            showDisciplineDetails(disciplineId);
        });
    });
}

// Mostrar detalhes da disciplina em modal
function showDisciplineDetails(disciplineId) {
    const disciplines = loadStudentDisciplines();
    const discipline = disciplines.find(d => d.id == disciplineId);
    
    if (!discipline) return;
    
    // Preencher modal com informações da disciplina
    document.getElementById('modalDisciplinaNome').textContent = discipline.name;
    document.getElementById('modalDisciplinaCodigo').textContent = discipline.code;
    document.getElementById('modalDisciplinaCurso').textContent = discipline.courseName;
    document.getElementById('modalDisciplinaPeriodo').textContent = discipline.period;
    document.getElementById('modalDisciplinaCargaHoraria').textContent = `${discipline.workload}h`;
    document.getElementById('modalDisciplinaProfessor').textContent = discipline.professor;
    document.getElementById('modalDisciplinaStatus').textContent = discipline.status === 'active' ? 'Ativa' : 'Inativa';
    document.getElementById('modalDisciplinaDescricao').textContent = discipline.description;
    
    // Mostrar modal
    document.getElementById('disciplinaModal').style.display = 'block';
}

// Fechar modal
function closeModal() {
    document.getElementById('disciplinaModal').style.display = 'none';
}

// Inicializar a página
document.addEventListener('DOMContentLoaded', function() {
    // Carregar disciplinas do aluno
    const studentDisciplines = loadStudentDisciplines();
    
    // Atualizar estatísticas
    updateStatistics(studentDisciplines);
    
    // Carregar filtros
    loadFilters(studentDisciplines);
    
    // Exibir disciplinas
    displayDisciplines(studentDisciplines);
    
    // Event listeners para filtros
    document.getElementById('searchInput').addEventListener('input', filterDisciplines);
    document.getElementById('courseFilter').addEventListener('change', filterDisciplines);
    document.getElementById('periodFilter').addEventListener('change', filterDisciplines);
    
    // Event listeners para o modal
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('contactProfessor').addEventListener('click', function() {
        alert('Funcionalidade de contato com o professor será implementada em breve!');
    });
    
    // Fechar modal ao clicar fora dele
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('disciplinaModal');
        if (event.target === modal) {
            closeModal();
        }
    });
});