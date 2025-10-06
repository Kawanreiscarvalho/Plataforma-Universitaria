// Dados de exemplo (em um sistema real, isso viria de um banco de dados)
let courses = JSON.parse(localStorage.getItem('educhain_courses')) || [
    {
        id: 1,
        name: "Engenharia de Software",
        duration: 8,
        active: true,
        disciplines: [
            { id: 101, name: "Algoritmos e Programação", code: "ES101", period: 1, workload: 60 },
            { id: 102, name: "Cálculo I", code: "ES102", period: 1, workload: 60 },
            { id: 103, name: "Banco de Dados", code: "ES201", period: 2, workload: 60 },
            { id: 104, name: "Estrutura de Dados", code: "ES202", period: 2, workload: 60 }
        ]
    },
    {
        id: 2,
        name: "Administração",
        duration: 8,
        active: true,
        disciplines: [
            { id: 201, name: "Introdução à Administração", code: "ADM101", period: 1, workload: 60 },
            { id: 202, name: "Matemática Financeira", code: "ADM102", period: 1, workload: 60 },
            { id: 203, name: "Gestão de Pessoas", code: "ADM201", period: 2, workload: 60 }
        ]
    },
    {
        id: 3,
        name: "Direito",
        duration: 10,
        active: true,
        disciplines: [
            { id: 301, name: "Introdução ao Direito", code: "DIR101", period: 1, workload: 60 },
            { id: 302, name: "Direito Civil I", code: "DIR102", period: 1, workload: 60 }
        ]
    }
];

// Salvar dados no localStorage
function saveData() {
    localStorage.setItem('educhain_courses', JSON.stringify(courses));
    // Em um sistema real, aqui você faria uma requisição para atualizar o servidor
    // para que as mudanças sejam refletidas para professores e alunos
}

// Elementos do modal de exclusão
const deleteModal = document.getElementById('deleteCourseModal');
const courseNameToDelete = document.getElementById('courseNameToDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const closeModalBtn = document.querySelector('.close');

// Variável para armazenar o curso a ser excluído
let courseToDelete = null;

// Configurar event listeners do modal
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeDeleteModal);
}

if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
}

if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', confirmDeleteCourse);
}

// Fechar modal ao clicar fora dele
window.addEventListener('click', function(event) {
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
});

// Funções do modal
function openDeleteModal(course) {
    courseToDelete = course;
    courseNameToDelete.textContent = course.name;
    deleteModal.style.display = 'block';
}

function closeDeleteModal() {
    deleteModal.style.display = 'none';
    courseToDelete = null;
}

function confirmDeleteCourse() {
    if (courseToDelete) {
        deleteCourse(courseToDelete.id);
        closeDeleteModal();
    }
}

// Tabs functionality
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
        
        if (tabId === 'courses') {
            renderCourses();
        } else if (tabId === 'add') {
            populateCourseSelect();
        } else if (tabId === 'course-management') {
            renderCoursesToggle();
        }
    });
});

// Render courses list
function renderCourses() {
    const coursesContainer = document.getElementById('coursesContainer');
    coursesContainer.innerHTML = '';
    
    const activeCourses = courses.filter(course => course.active);
    
    if (activeCourses.length === 0) {
        coursesContainer.innerHTML = '<div class="card"><p>Nenhum curso ativo cadastrado.</p></div>';
        return;
    }
    
    activeCourses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = 'course-item';
        courseElement.innerHTML = `
            <div class="course-header">
                <div class="course-title-container">
                    <div class="course-title">${course.name}</div>
                    <div class="course-duration">${course.duration} períodos</div>
                </div>
                <div class="course-actions">
                    <button class="btn btn-danger btn-delete-course" data-course-id="${course.id}">
                        <i class="fas fa-trash"></i> Excluir Curso
                    </button>
                </div>
            </div>
            <div class="disciplines-list" id="disciplines-${course.id}">
                ${renderDisciplines(course.disciplines)}
            </div>
            <button class="btn btn-primary btn-add-discipline" style="margin-top: 15px; width: 100%;" data-course-id="${course.id}">
                <i class="fas fa-plus"></i> Adicionar Disciplina
            </button>
        `;
        
        coursesContainer.appendChild(courseElement);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.btn-add-discipline').forEach(btn => {
        btn.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course-id');
            document.querySelector('[data-tab="add"]').click();
            document.getElementById('courseSelect').value = courseId;
        });
    });
    
    document.querySelectorAll('.btn-edit-discipline').forEach(btn => {
        btn.addEventListener('click', function() {
            const disciplineId = this.getAttribute('data-discipline-id');
            alert(`Editar disciplina ${disciplineId} - Funcionalidade em desenvolvimento`);
        });
    });
    
    document.querySelectorAll('.btn-delete-discipline').forEach(btn => {
        btn.addEventListener('click', function() {
            const disciplineId = parseInt(this.getAttribute('data-discipline-id'));
            if (confirm('Tem certeza que deseja excluir esta disciplina?')) {
                deleteDiscipline(disciplineId);
            }
        });
    });
    
    // Adicionar event listeners para exclusão de cursos
    document.querySelectorAll('.btn-delete-course').forEach(btn => {
        btn.addEventListener('click', function() {
            const courseId = parseInt(this.getAttribute('data-course-id'));
            const course = courses.find(c => c.id === courseId);
            if (course) {
                openDeleteModal(course);
            }
        });
    });
}

// Render disciplines list for a course
function renderDisciplines(disciplines) {
    if (disciplines.length === 0) {
        return '<p>Nenhuma disciplina cadastrada para este curso.</p>';
    }
    
    // Group disciplines by period
    const periods = {};
    disciplines.forEach(discipline => {
        if (!periods[discipline.period]) {
            periods[discipline.period] = [];
        }
        periods[discipline.period].push(discipline);
    });
    
    let html = '';
    for (const period in periods) {
        html += `<h3 style="margin: 15px 0 10px 0; color: var(--primary);">${period}º Período</h3>`;
        
        periods[period].forEach(discipline => {
            html += `
                <div class="discipline-item">
                    <div class="discipline-info">
                        <h4>${discipline.name} (${discipline.code})</h4>
                        <p>Carga horária: ${discipline.workload}h</p>
                    </div>
                    <div class="discipline-actions">
                        <button class="btn btn-primary btn-edit-discipline" data-discipline-id="${discipline.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-delete-discipline" data-discipline-id="${discipline.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    }
    
    return html;
}

// Populate course select dropdown
function populateCourseSelect() {
    const courseSelect = document.getElementById('courseSelect');
    courseSelect.innerHTML = '<option value="">Selecione um curso</option>';
    
    const activeCourses = courses.filter(course => course.active);
    
    activeCourses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.name;
        courseSelect.appendChild(option);
    });
}

// Add new discipline
document.getElementById('disciplineForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const courseId = parseInt(document.getElementById('courseSelect').value);
    const period = parseInt(document.getElementById('periodSelect').value);
    const name = document.getElementById('disciplineName').value;
    const code = document.getElementById('disciplineCode').value;
    const workload = parseInt(document.getElementById('workload').value);
    
    if (!courseId || !period || !name || !code || !workload) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    const course = courses.find(c => c.id === courseId);
    if (!course) {
        alert('Curso não encontrado.');
        return;
    }
    
    // Check if discipline code already exists in this course
    if (course.disciplines.some(d => d.code === code)) {
        alert('Já existe uma disciplina dengan este código no curso selecionado.');
        return;
    }
    
    // Generate a unique ID (in a real system, this would be done by the database)
    const newId = Math.max(...course.disciplines.map(d => d.id), 0) + 1;
    
    // Add the new discipline
    course.disciplines.push({
        id: newId,
        name,
        code,
        period,
        workload
    });
    
    // Save data and update UI
    saveData();
    alert('Disciplina adicionada com sucesso!');
    this.reset();
    
    // Switch back to courses tab
    document.querySelector('[data-tab="courses"]').click();
});

// Delete discipline
function deleteDiscipline(disciplineId) {
    for (const course of courses) {
        const index = course.disciplines.findIndex(d => d.id === disciplineId);
        if (index !== -1) {
            course.disciplines.splice(index, 1);
            saveData();
            renderCourses();
            alert('Disciplina excluída com sucesso!');
            return;
        }
    }
    alert('Disciplina não encontrada.');
}

// Delete course
function deleteCourse(courseId) {
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (courseIndex !== -1) {
        const courseName = courses[courseIndex].name;
        
        // Remover o curso do array
        courses.splice(courseIndex, 1);
        
        // Salvar dados e atualizar UI
        saveData();
        renderCourses();
        renderCoursesToggle();
        
        alert(`Curso "${courseName}" excluído com sucesso!`);
    } else {
        alert('Curso não encontrado.');
    }
}

// New course button
document.getElementById('newCourseBtn').addEventListener('click', function() {
    const courseName = prompt('Digite o nome do novo curso:');
    if (courseName) {
        const duration = prompt('Digite a duração do curso (em períodos):');
        if (duration && !isNaN(duration)) {
            // Generate a unique ID
            const newId = Math.max(...courses.map(c => c.id), 0) + 1;
            
            // Add the new course
            courses.push({
                id: newId,
                name: courseName,
                duration: parseInt(duration),
                active: true,
                disciplines: []
            });
            
            // Save data and update UI
            saveData();
            renderCourses();
            renderCoursesToggle();
            alert('Curso criado com sucesso!');
        }
    }
});

// Função para renderizar os toggles de cursos
function renderCoursesToggle() {
    const container = document.getElementById('coursesToggleContainer');
    container.innerHTML = '';
    
    if (courses.length === 0) {
        container.innerHTML = '<div class="card"><p>Nenhum curso cadastrado.</p></div>';
        return;
    }
    
    courses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = 'course-toggle-item';
        if (course.active) {
            courseElement.style.borderColor = 'var(--success)';
        }
        courseElement.innerHTML = `
            <div class="course-toggle-info">
                <h4>${course.name}</h4>
                <p>${course.duration} períodos • ${course.disciplines.length} disciplinas</p>
            </div>
            <label class="toggle-switch">
                <input type="checkbox" ${course.active ? 'checked' : ''} data-course-id="${course.id}">
                <span class="toggle-slider"></span>
            </label>
        `;
        
        container.appendChild(courseElement);
    });
    
    // Adicionar event listeners aos toggles
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const courseId = parseInt(this.getAttribute('data-course-id'));
            const isActive = this.checked;
            
            // Atualizar o status do curso
            const course = courses.find(c => c.id === courseId);
            if (course) {
                course.active = isActive;
                
                // Feedback visual
                const courseElement = this.closest('.course-toggle-item');
                if (isActive) {
                    courseElement.style.borderColor = 'var(--success)';
                } else {
                    courseElement.style.borderColor = 'var(--light)';
                }
            }
        });
    });
}

// Botão para salvar configurações
document.getElementById('saveCoursesBtn').addEventListener('click', function() {
    saveData();
    alert('Configurações de cursos salvas com sucesso! As alterações serão refletidas para professores e alunos.');
});

// Botão para ativar todos os cursos
document.getElementById('activateAllBtn').addEventListener('click', function() {
    courses.forEach(course => {
        course.active = true;
    });
    
    // Atualizar a UI
    renderCoursesToggle();
    
    // Marcar checkboxes
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.checked = true;
        toggle.closest('.course-toggle-item').style.borderColor = 'var(--success)';
    });
    
    alert('Todos os cursos foram ativados.');
});

// Botão para desativar todos os cursos
document.getElementById('deactivateAllBtn').addEventListener('click', function() {
    if (confirm('Tem certeza que deseja desativar todos os cursos? Isso tornará os cursos invisíveis para professores e alunos.')) {
        courses.forEach(course => {
            course.active = false;
        });
        
        // Atualizar a UI
        renderCoursesToggle();
        
        // Desmarcar checkboxes
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.checked = false;
            toggle.closest('.course-toggle-item').style.borderColor = 'var(--light)';
        });
        
        alert('Todos os cursos foram desativados.');
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderCourses();
    renderCoursesToggle();
});