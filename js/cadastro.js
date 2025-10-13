// cadastro.js
document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastroForm');
    const modoBtns = document.querySelectorAll('.modo-btn');
    let modoSelecionado = 'professor';

    // Sistema de seleção de modo
    modoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            modoBtns.forEach(b => b.classList.remove('ativo'));
            this.classList.add('ativo');
            modoSelecionado = this.getAttribute('data-modo');
            atualizarInfoSenha();
        });
    });

    // Atualizar informação da senha (SEM MOSTRAR AS SENHAS)
    function atualizarInfoSenha() {
        const infoText = document.getElementById('infoText');
        if (modoSelecionado === 'professor') {
            infoText.textContent = 'Professor: use a senha específica fornecida pela instituição';
        } else if (modoSelecionado === 'diretor') {
            infoText.textContent = 'Diretor: use a senha específica fornecida pelo sistema';
        } else {
            infoText.textContent = 'Aluno: você pode criar qualquer senha';
        }
    }

    // Validar senha específica
    function validarSenhaEspecial(senha, modo) {
        const senhasEspecificas = {
            'professor': 'prof@0020250A',
            'diretor': 'dir@0020250B'
        };
        
        if (modo in senhasEspecificas) {
            return senha === senhasEspecificas[modo];
        }
        return true; // Aluno pode usar qualquer senha
    }

    // Verificar força da senha
    function verificarForcaSenha(senha) {
        if (senha.length === 0) return 0;
        
        let forca = 0;
        if (senha.length >= 8) forca++;
        if (/[A-Z]/.test(senha)) forca++;
        if (/[a-z]/.test(senha)) forca++;
        if (/[0-9]/.test(senha)) forca++;
        if (/[^A-Za-z0-9]/.test(senha)) forca++;
        
        return forca;
    }

    // Atualizar barra de força da senha
    document.getElementById('senha').addEventListener('input', function() {
        const senha = this.value;
        const forca = verificarForcaSenha(senha);
        const fill = document.getElementById('strength-fill');
        const text = document.getElementById('strength-text');
        
        const cores = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];
        const textos = ['Muito Fraca', 'Fraca', 'Média', 'Forte', 'Muito Forte'];
        
        if (senha.length === 0) {
            fill.style.width = '0%';
            fill.style.backgroundColor = '#e0e0e0';
            text.textContent = 'Digite uma senha';
            text.style.color = '#666';
        } else {
            fill.style.width = `${(forca / 5) * 100}%`;
            fill.style.backgroundColor = cores[forca - 1] || '#e74c3c';
            text.textContent = textos[forca - 1] || 'Muito Fraca';
            text.style.color = cores[forca - 1] || '#e74c3c';
        }
    });

    // Verificar se email já existe
    function emailExiste(email) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        return usuarios.some(u => u.email === email);
    }

    // Submissão do formulário
    cadastroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;

        // Validações básicas
        if (!nome || !email || !senha) {
            mostrarErro('Por favor, preencha todos os campos');
            return;
        }

        if (emailExiste(email)) {
            mostrarErro('Este email já está cadastrado');
            return;
        }

        // Validar senha específica para professor/diretor
        if (!validarSenhaEspecial(senha, modoSelecionado)) {
            let tipoUsuario = modoSelecionado === 'professor' ? 'Professor' : 'Diretor';
            mostrarErro(`Senha de ${tipoUsuario} incorreta! Use a senha específica fornecida.`);
            return;
        }

        // Mostrar loading
        document.getElementById('loadingSpinner').style.display = 'flex';

        // Criar usuário
        const usuario = {
            id: Date.now(),
            nome: nome,
            email: email,
            senha: senha,
            tipo: modoSelecionado,
            dataCadastro: new Date().toISOString()
        };

        // Salvar no localStorage
        setTimeout(() => {
            let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            usuarios.push(usuario);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            // Mostrar sucesso
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('loadingSpinner').style.display = 'none';
            
            // Redirecionar para login após 2 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }, 1000);
    });

    function mostrarErro(mensagem) {
        document.getElementById('errorMessage').textContent = mensagem;
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('loadingSpinner').style.display = 'none';
    }

    // Inicializar informações da senha
    atualizarInfoSenha();
});