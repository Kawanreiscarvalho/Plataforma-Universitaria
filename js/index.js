document.addEventListener('DOMContentLoaded', function() {
    const roleSelection = document.getElementById('roleSelection');
    const loginForm = document.getElementById('loginForm');
    const backButton = document.getElementById('backButton');
    const loginButton = document.getElementById('loginButton');
    let selectedRole = '';
    
    // Mapeamento de roles para páginas
    const rolePages = {
        'student': 'aluno.html',
        'teacher': 'professor.html', 
        'director': 'diretor.html'
    };
    
    // Role selection
    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', function() {
            selectedRole = this.getAttribute('data-role');
            
            // Hide role selection and show login form
            roleSelection.style.display = 'none';
            loginForm.style.display = 'block';
            
            // Update form based on selected role
            const roleTitles = {
                'student': 'Aluno',
                'teacher': 'Professor',
                'director': 'Diretor'
            };
            
            document.querySelector('.logo h2').textContent = `Acesso como ${roleTitles[selectedRole]}`;
        });
    });
    
    // Back button
    backButton.addEventListener('click', function() {
        loginForm.style.display = 'none';
        roleSelection.style.display = 'flex';
        document.querySelector('.logo h2').textContent = 'Bem-vindo ao EduChain';
    });
    
    // Login button
    loginButton.addEventListener('click', function() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        // Simulate login process
        alert(`Login realizado com sucesso como ${selectedRole}!`);
        
        // Redirect based on role
        if (rolePages[selectedRole]) {
            window.location.href = rolePages[selectedRole];
        } else {
            alert('Tipo de perfil não reconhecido.');
        }
    });
});