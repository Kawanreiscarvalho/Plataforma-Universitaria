// Configurações do sistema
        const CONFIG = {
            TEMPO_REDIRECIONAMENTO: 3000,
            TEMPO_SIMULACAO: 2000
        };

        // Elementos da página
        const form = document.getElementById('forgotPasswordForm');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');
        const emailInput = document.getElementById('emailInput');
        const backLink = document.getElementById('backLink');

        // =============================================
        // FUNÇÕES DE VALIDAÇÃO
        // =============================================

        /**
         * Valida formato de email
         */
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        /**
         * Verifica se email existe no sistema
         */
        function emailExists(email) {
            const usuariosCadastrados = JSON.parse(localStorage.getItem('usuarios')) || [];
            return usuariosCadastrados.some(usuario => usuario.email === email);
        }

        // =============================================
        // FUNÇÕES DE INTERFACE
        // =============================================

        /**
         * Limpa mensagens de erro/sucesso
         */
        function clearMessages() {
            emailInput.classList.remove('input-error', 'input-success');
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';
        }

        /**
         * Exibe mensagem de erro
         */
        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }

        /**
         * Exibe mensagem de sucesso
         */
        function showSuccess(message) {
            successMessage.textContent = message;
            successMessage.style.display = 'block';
        }

        // =============================================
        // SIMULAÇÃO DE SERVIÇO DE EMAIL
        // =============================================

        /**
         * Simula o envio de email de recuperação
         */
        function simularEnvioEmailRecuperacao(email) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Verificar se email existe
                    if (!emailExists(email)) {
                        reject({
                            status: 404,
                            message: 'E-mail não encontrado em nossa base de dados.'
                        });
                    } else {
                        // Simular envio bem-sucedido
                        console.log(`[SIMULAÇÃO] Email de recuperação enviado para: ${email}`);
                        
                        resolve({
                            status: 200,
                            message: 'Link de recuperação enviado com sucesso!'
                        });
                    }
                }, CONFIG.TEMPO_SIMULACAO);
            });
        }

        // =============================================
        // EVENT LISTENERS
        // =============================================

        /**
         * Processa o formulário de recuperação de senha
         */
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearMessages();

            const email = emailInput.value.trim();

            // Validações
            if (!email) {
                emailInput.classList.add('input-error');
                showError('Por favor, insira seu e-mail.');
                return;
            }

            if (!validateEmail(email)) {
                emailInput.classList.add('input-error');
                showError('Por favor, insira um e-mail válido.');
                return;
            }

            // Mostrar loading
            loadingSpinner.style.display = 'flex';

            try {
                // Simular chamada à API
                const resultado = await simularEnvioEmailRecuperacao(email);

                if (resultado.status === 200) {
                    // Sucesso no envio
                    emailInput.classList.add('input-success');
                    showSuccess('Link de recuperação enviado! Verifique seu e-mail.');
                    form.reset();
                    
                    // Redirecionar após tempo configurado
                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, CONFIG.TEMPO_REDIRECIONAMENTO);
                }
            } catch (error) {
                // Erro na recuperação
                emailInput.classList.add('input-error');
                showError(error.message || 'Erro ao enviar link de recuperação. Tente novamente.');
            } finally {
                // Esconder loading
                loadingSpinner.style.display = 'none';
            }
        });

        /**
         * Limpa erros ao digitar no campo de email
         */
        emailInput.addEventListener('input', function() {
            this.classList.remove('input-error');
            errorMessage.style.display = 'none';
        });

        /**
         * Redireciona para página de login
         */
        backLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = "login.html";
        });

        // =============================================
        // INICIALIZAÇÃO
        // =============================================

        console.log('Página de recuperação de senha WorkCodes carregada');