// atividade.js - SISTEMA 100% FUNCIONAL

// ===== SISTEMA DE ATIVIDADES GARANTIDO =====
function garantirSistemaAtividades() {
    // Se o sistema unificado não estiver carregado, criar funções básicas
    if (typeof createActivity === 'undefined') {
        console.log('⚠️ Criando sistema local de atividades...');
        
        window.getActivities = function() {
            const activities = localStorage.getItem('activities');
            if (!activities) {
                // Dados iniciais de exemplo
                const atividadesExemplo = [
                    {
                        id: 1,
                        title: "Trabalho de Programação I",
                        type: "activity",
                        discipline: "Programação I",
                        disciplineId: 1,
                        description: "Implementar algoritmos básicos em Python",
                        dueDate: "2023-11-15T23:59",
                        professorId: 1,
                        professorName: "Prof. João Silva",
                        createdAt: new Date().toISOString(),
                        status: 'active',
                        submissions: []
                    }
                ];
                localStorage.setItem('activities', JSON.stringify(atividadesExemplo));
                return atividadesExemplo;
            }
            return JSON.parse(activities);
        };
        
        window.saveActivities = function(activities) {
            localStorage.setItem('activities', JSON.stringify(activities));
        };
        
        window.createActivity = function(activityData) {
            const activities = getActivities();
            const newActivity = {
                id: Date.now(),
                ...activityData,
                createdAt: new Date().toISOString(),
                status: 'active',
                submissions: []
            };
            
            activities.push(newActivity);
            saveActivities(activities);
            
            console.log('✅ Atividade SALVA no sistema:', newActivity);
            return newActivity;
        };
        
        window.getStudentActivities = function(studentId) {
            const activities = getActivities();
            return activities.filter(activity => activity.status === 'active');
        };
    }
    console.log('✅ Sistema de atividades PRONTO!');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 INICIANDO SISTEMA DE ATIVIDADES...');
    
    // ===== GARANTIR QUE O SISTEMA EXISTA =====
    garantirSistemaAtividades();
    
    // ===== VARIÁVEIS =====
    const uploadModal = document.getElementById('uploadModal');
    const viewModal = document.getElementById('viewSubmissionModal');
    const assignmentForm = document.getElementById('assignmentForm');

    // ===== SISTEMA DE DISCIPLINAS =====
    function carregarDisciplinas() {
        const disciplineSelect = document.getElementById('discipline');
        if (!disciplineSelect) return;
        
        disciplineSelect.innerHTML = '<option value="">Selecione a disciplina</option>';
        
        const disciplinasTI = [
            { id: 1, name: "Programação I", code: "PROG101" },
            { id: 2, name: "Banco de Dados", code: "BD201" },
            { id: 3, name: "Desenvolvimento Web", code: "WEB301" },
            { id: 4, name: "Redes de Computadores", code: "RED202" },
            { id: 5, name: "Engenharia de Software", code: "ES302" },
            { id: 6, name: "Inteligência Artificial", code: "IA401" },
            { id: 7, name: "Segurança da Informação", code: "SEG402" },
            { id: 8, name: "Mobile Development", code: "MOB501" },
            { id: 9, name: "Estrutura de Dados", code: "ED202" },
            { id: 10, name: "Sistemas Operacionais", code: "SO301" },
            { id: 11, name: "Computação em Nuvem", code: "CLD401" },
            { id: 12, name: "DevOps e CI/CD", code: "DEVOPS501" }
        ];
        
        disciplinasTI.forEach(disciplina => {
            const option = document.createElement('option');
            option.value = disciplina.id;
            option.textContent = `${disciplina.name} (${disciplina.code})`;
            disciplineSelect.appendChild(option);
        });
    }

    // ===== FORMULÁRIO DE CRIAÇÃO - 100% FUNCIONAL =====
    function configurarFormulario() {
        if (!assignmentForm) {
            console.log('❌ Formulário não encontrado');
            return;
        }

        assignmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📝 Processando criação de atividade...');
            
            // Coletar dados
            const title = document.getElementById('title').value;
            const type = document.getElementById('type').value;
            const disciplineId = document.getElementById('discipline').value;
            const description = document.getElementById('description').value;
            const dueDate = document.getElementById('dueDate').value;

            // Validar
            if (!title || !type || !disciplineId || !description || !dueDate) {
                alert('❌ Preencha todos os campos!');
                return;
            }

            // Buscar nome da disciplina
            const disciplinasTI = [
                { id: 1, name: "Programação I", code: "PROG101" },
                { id: 2, name: "Banco de Dados", code: "BD201" },
                { id: 3, name: "Desenvolvimento Web", code: "WEB301" },
                { id: 4, name: "Redes de Computadores", code: "RED202" },
                { id: 5, name: "Engenharia de Software", code: "ES302" },
                { id: 6, name: "Inteligência Artificial", code: "IA401" },
                { id: 7, name: "Segurança da Informação", code: "SEG402" },
                { id: 8, name: "Mobile Development", code: "MOB501" },
                { id: 9, name: "Estrutura de Dados", code: "ED202" },
                { id: 10, name: "Sistemas Operacionais", code: "SO301" },
                { id: 11, name: "Computação em Nuvem", code: "CLD401" },
                { id: 12, name: "DevOps e CI/CD", code: "DEVOPS501" }
            ];

            const disciplina = disciplinasTI.find(d => d.id == disciplineId);
            
            if (!disciplina) {
                alert('❌ Selecione uma disciplina válida!');
                return;
            }

            // Criar atividade
            const activityData = {
                title: title,
                type: type,
                discipline: disciplina.name,
                disciplineId: parseInt(disciplineId),
                description: description,
                dueDate: dueDate,
                professorId: 1,
                professorName: "Prof. João Silva"
            };

            console.log('📦 Dados da atividade:', activityData);

            // 🎯 SALVAR NO SISTEMA CORRETO
            try {
                const novaAtividade = createActivity(activityData);
                console.log('✅ Atividade SALVA com ID:', novaAtividade.id);
                
                // Verificar se realmente foi salva
                const atividadesSalvas = getActivities();
                console.log('📊 Total de atividades no sistema:', atividadesSalvas.length);
                console.log('Última atividade salva:', atividadesSalvas[atividadesSalvas.length - 1]);
                
                alert('🎉 Atividade criada com sucesso! Os alunos já podem visualizá-la.');
                
                // Limpar e mudar de aba
                this.reset();
                switchTab('list');
                
                // Recarregar lista de atividades
                if (typeof loadProfessorActivities === 'function') {
                    loadProfessorActivities();
                }
                
            } catch (error) {
                console.error('❌ Erro ao salvar atividade:', error);
                alert('❌ Erro ao salvar atividade. Verifique o console.');
            }
        });
    }

    // ===== SISTEMA DE ABAS =====
    function configurarAbas() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                switchTab(tabId);
            });
        });
    }

    function switchTab(tabName) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        const tabAlvo = document.querySelector(`[data-tab="${tabName}"]`);
        const conteudoAlvo = document.getElementById(tabName);
        
        if (tabAlvo) tabAlvo.classList.add('active');
        if (conteudoAlvo) conteudoAlvo.classList.add('active');
    }

    // ===== INICIALIZAÇÃO =====
    function inicializar() {
        console.log('🚀 Inicializando sistema...');
        
        carregarDisciplinas();
        configurarFormulario();
        configurarAbas();
        
        // Verificar atividades existentes
        const atividades = getActivities();
        console.log(`📚 ${atividades.length} atividades carregadas do sistema`);
        
        console.log('✅ Sistema inicializado com sucesso!');
    }

    inicializar();
});

// ===== FUNÇÃO PARA TESTAR INTEGRAÇÃO =====
function testarIntegracao() {
    console.log('=== TESTE DE INTEGRAÇÃO ===');
    
    // Verificar se as atividades estão acessíveis
    const atividades = getActivities();
    console.log('Atividades no sistema:', atividades);
    
    // Testar se o aluno consegue ver
    const atividadesAluno = getStudentActivities(1);
    console.log('Atividades visíveis para o aluno:', atividadesAluno);
    
    return atividades.length > 0;
}

// Executar teste quando a página carregar
window.addEventListener('load', function() {
    setTimeout(testarIntegracao, 1000);
});