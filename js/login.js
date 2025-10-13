// login.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const modoBtns = document.querySelectorAll('.modo-btn');
    let modoSelecionado = 'professor';

    // Sistema de seleção de modo
    modoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            modoBtns.forEach(b => b.classList.remove('ativo'));
            this.classList.add('ativo');
            modoSelecionado = this.getAttribute('data-modo');
        });
    });

    // Função para verificar senha específica
    function verificarSenhaEspecifica(senha, modo) {
        const senhasEspecificas = {
            'professor': 'prof@0020250A',
            'diretor': 'dir@0020250B'
        };
        
        // Se for aluno, qualquer senha é aceita
        if (modo === 'aluno') {
            return true;
        }
        
        // Para professor e diretor, verificar senha específica
        return senha === senhasEspecificas[modo];
    }

    // Função de autenticação
    function autenticarUsuario(email, senha, modo) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        
        // Encontrar usuário pelo email
        const usuario = usuarios.find(u => u.email === email);
        
        if (!usuario) {
            return { sucesso: false, mensagem: 'Usuário não encontrado' };
        }

        // Verificar senha específica para professor/diretor
        if (!verificarSenhaEspecifica(senha, modo)) {
            return { 
                sucesso: false, 
                mensagem: `Senha de ${modo} incorreta!` 
            };
        }

        // Verificar se o tipo corresponde
        if (usuario.tipo !== modo) {
            return { 
                sucesso: false, 
                mensagem: `Este email é de um ${usuario.tipo}. Faça login como ${usuario.tipo}.` 
            };
        }

        return { sucesso: true, usuario: usuario };
    }

    // Submissão do formulário
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const senha = document.getElementById('password').value;

        if (!email || !senha) {
            document.getElementById('errorMessage').textContent = 'Por favor, preencha todos os campos';
            document.getElementById('errorMessage').style.display = 'block';
            return;
        }

        // Mostrar loading
        document.getElementById('loadingSpinner').style.display = 'flex';
        document.getElementById('errorMessage').style.display = 'none';

        // Autenticar usuário
        setTimeout(() => {
            const resultado = autenticarUsuario(email, senha, modoSelecionado);

            if (resultado.sucesso) {
                // Salvar usuário logado na sessão
                localStorage.setItem('usuarioLogado', JSON.stringify(resultado.usuario));
                
                // Mostrar mensagem de sucesso
                document.getElementById('successMessage').style.display = 'block';
                
                // Redirecionar para página específica
                setTimeout(() => {
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
                        default:
                            window.location.href = 'index.html';
                    }
                }, 1500);
            } else {
                document.getElementById('loadingSpinner').style.display = 'none';
                document.getElementById('errorMessage').textContent = resultado.mensagem;
                document.getElementById('errorMessage').style.display = 'block';
            }
        }, 1000);
    });

    // Lembrar senha
    const rememberCheckbox = document.getElementById('remember');
    rememberCheckbox.addEventListener('change', function() {
        const email = document.getElementById('email').value;
        if (this.checked && email) {
            localStorage.setItem('rememberEmail', email);
        } else {
            localStorage.removeItem('rememberEmail');
        }
    });

    // Preencher email lembrado
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        rememberCheckbox.checked = true;
    }
});