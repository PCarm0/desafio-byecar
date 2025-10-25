const API_BASE_URL = 'http://localhost:3000/api';

console.log('🔧 Frontend configurado para:', API_BASE_URL);

class AuthApp {
    constructor() {
        this.currentUser = null;
        this.token = localStorage.getItem('token');
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthentication();
        
        // Verifica se já está autenticado
        if (this.token) {
            this.validateToken();
        }
    }

    bindEvents() {
        // Login form
        document.querySelector('.form-login').addEventListener('submit', (e) => this.handleLogin(e));
        
        // Register form
        document.querySelector('.form-register').addEventListener('submit', (e) => this.handleRegister(e));
        
        // Toggle between forms
        document.getElementById('show-register').addEventListener('click', (e) => this.showForm('register'));
        document.getElementById('show-login').addEventListener('click', (e) => this.showForm('login'));
        
        // Forgot password
        document.getElementById('forgot-password').addEventListener('click', (e) => this.handleForgotPassword(e));
    }

    showForm(formType) {
        const loginForm = document.querySelector('.form-login');
        const registerForm = document.querySelector('.form-register');
        
        if (formType === 'register') {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        } else {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        }
        
        // Clear messages
        this.clearMessages();
    }

    clearMessages() {
        document.getElementById('login-message').innerHTML = '';
        document.getElementById('login-message').className = 'message';
        document.getElementById('register-message').innerHTML = '';
        document.getElementById('register-message').className = 'message';
    }

    showMessage(elementId, message, type = 'error') {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.className = `message ${type}`;
    }

    setLoading(form, isLoading) {
        const button = form.querySelector('.login-btn');
        const inputs = form.querySelectorAll('input');
        
        if (isLoading) {
            button.innerHTML = '<i class="bx bx-loader-circle bx-spin"></i> Carregando...';
            button.disabled = true;
            form.classList.add('loading');
        } else {
            button.textContent = form.classList.contains('form-login') ? 'Login' : 'Cadastrar';
            button.disabled = false;
            form.classList.remove('loading');
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const form = event.target;

        // Validações básicas
        if (!email || !password) {
            this.showMessage('login-message', 'Por favor, preencha todos os campos');
            return;
        }

        this.setLoading(form, true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                // Salva token e dados do usuário
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                
                this.showMessage('login-message', 'Login realizado com sucesso!', 'success');
                
                // Redireciona para dashboard após 1 segundo
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                this.showMessage('login-message', data.message);
            }
        } catch (error) {
            console.error('Erro no login:', error);
            this.showMessage('login-message', 'Erro ao conectar com o servidor');
        } finally {
            this.setLoading(form, false);
        }
    }

    async handleRegister(event) {
        event.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const form = event.target;

        // Validações
        if (!name || !email || !password || !confirmPassword) {
            this.showMessage('register-message', 'Por favor, preencha todos os campos');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage('register-message', 'As senhas não coincidem');
            return;
        }

        if (password.length < 6) {
            this.showMessage('register-message', 'A senha deve ter pelo menos 6 caracteres');
            return;
        }

        this.setLoading(form, true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.showMessage('register-message', 'Cadastro realizado com sucesso! Faça login para continuar.', 'success');
                
                // Limpa o formulário
                form.reset();
                
                // Volta para o login após 2 segundos
                setTimeout(() => {
                    this.showForm('login');
                }, 2000);
            } else {
                this.showMessage('register-message', data.message);
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            this.showMessage('register-message', 'Erro ao conectar com o servidor');
        } finally {
            this.setLoading(form, false);
        }
    }

    handleForgotPassword(event) {
        event.preventDefault();
        alert('Funcionalidade de recuperação de senha em desenvolvimento!');
    }

    async validateToken() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                // Token válido, redireciona para dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Token inválido, remove do localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error('Erro ao validar token:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }

    checkAuthentication() {
        if (this.token) {
            // Mostra que está verificando autenticação
            console.log('Verificando autenticação...');
        }
    }
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new AuthApp();
});