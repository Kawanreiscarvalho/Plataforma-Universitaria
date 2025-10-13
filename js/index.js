// index.js
document.addEventListener('DOMContentLoaded', function() {
    const roleSelection = document.getElementById('roleSelection');
    const loginForm = document.getElementById('loginForm');
    const backButton = document.getElementById('backButton');
    const loginButton = document.getElementById('loginButton');

    let roleSelecionado = '';

    // Mapeamento de roles para tipos de usuário
    const roleParaTipo = {
        'student': 'aluno',
        'teacher': 'professor', 
        'director': 'diretor'
    };

    // Seleção de perfil
    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.role-card').forEach(c => {
                c.classList.remove('selected');
            });
            this.classList.add('selected');
            roleSelecionado = this.getAttribute('data-role');
            
            // Mostrar formulário de login
            roleSelection.style.display = 'none';
            loginForm.style.display = 'block';
            
            // Atualizar título
            const titulos = {
                'student': 'Aluno',
                'teacher': 'Professor',
                'director': 'Diretor'
            };
            document.querySelector('.logo h2').textContent = `Login como ${titulos[roleSelecionado]}`;
        });
    });

    // Botão voltar
    backButton.addEventListener('click', function() {
        loginForm.style.display = 'none';
        roleSelection.style.display = 'block';
        roleSelecionado = '';
        document.querySelector('.logo h2').textContent = 'Bem-vindo ao EduChain';
        document.querySelector('.logo p').textContent = 'Selecione seu perfil para continuar';
        
        // Limpar campos
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    });

    // Função para verificar senha específica (MESMA LÓGICA DO LOGIN.JS)
    function verificarSenhaEspecifica(senha, role) {
        const senhasEspecificas = {
            'teacher': 'prof@0020250A', // Professor
            'director': 'dir@0020250B'  // Diretor
        };
        
        // Se for aluno, qualquer senha é aceita
        if (role === 'student') {
            return true;
        }
        
        // Para professor e diretor, verificar senha específica
        return senha === senhasEspecificas[role];
    }

    // Função de autenticação (MESMA LÓGICA DO LOGIN.JS)
    function autenticarUsuario(email, senha, role) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        
        // Encontrar usuário pelo email
        const usuario = usuarios.find(u => u.email === email);
        
        if (!usuario) {
            return { sucesso: false, mensagem: 'Usuário não encontrado' };
        }

        // Verificar senha específica para professor/diretor
        if (!verificarSenhaEspecifica(senha, role)) {
            return { 
                sucesso: false, 
                mensagem: `Senha de ${roleParaTipo[role]} incorreta!` 
            };
        }

        // Verificar se o tipo corresponde
        const tipoEsperado = roleParaTipo[role];
        if (usuario.tipo !== tipoEsperado) {
            return { 
                sucesso: false, 
                mensagem: `Este email é de um ${usuario.tipo}. Faça login como ${usuario.tipo}.` 
            };
        }

        return { sucesso: true, usuario: usuario };
    }

    // Login na index
    loginButton.addEventListener('click', function() {
        const email = document.getElementById('email').value;
        const senha = document.getElementById('password').value;

        if (!email || !senha) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        if (!roleSelecionado) {
            alert('Por favor, selecione um perfil');
            return;
        }

        const resultado = autenticarUsuario(email, senha, roleSelecionado);

        if (resultado.sucesso) {
            // Salvar usuário logado
            localStorage.setItem('usuarioLogado', JSON.stringify(resultado.usuario));
            
            // Redirecionar para página específica
            switch(resultado.usuario.tipo) {
                case 'aluno':
                    window.location.href = 'aluno.html';
                    break;
                case 'professor':
                    window.location.href = 'professor.html';
                    break;
                case 'diretor':
                    window.location.href = 'diretor.html';
                    break;
            }
        } else {
            alert(resultado.mensagem);
        }
    });

    // Permitir submit com Enter
    loginForm.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginButton.click();
        }
    });

    // Preencher email lembrado se existir
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
    }
});