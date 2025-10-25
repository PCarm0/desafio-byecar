const API_BASE_URL = 'http://localhost:3000/api';

class Dashboard {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || '{}');
        this.init();
    }

    init() {
        if (!this.token) {
            window.location.href = 'index.html';
            return;
        }

        this.loadUserInfo();
        this.loadStats();
        this.loadRecentClients();
        this.loadRecentSales();
        this.bindEvents();
    }

    loadUserInfo() {
        document.getElementById('user-name').textContent = this.user.name || 'Usuário';
        document.getElementById('user-email').textContent = this.user.email || 'user@email.com';
    }

    async loadStats() {
        try {
            const [clientsRes, salesRes, usersRes] = await Promise.all([
                this.apiCall('/clients'),
                this.apiCall('/sales'),
                this.apiCall('/users')
            ]);

            // Total de clientes
            document.getElementById('total-clients').textContent = 
                clientsRes.success ? clientsRes.data.length : 0;

            // Total de vendas e receita
            if (salesRes.success) {
                document.getElementById('total-sales').textContent = salesRes.data.length;
                
                const totalRevenue = salesRes.data.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
                document.getElementById('total-revenue').textContent = 
                    `R$ ${totalRevenue.toFixed(2)}`;
            }

            // Total de usuários
            document.getElementById('total-users').textContent = 
                usersRes.success ? usersRes.data.length : 0;

        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            this.showError('Erro ao carregar dados do dashboard');
        }
    }

    async loadRecentClients() {
        try {
            const response = await this.apiCall('/clients');
            const container = document.getElementById('recent-clients');

            if (response.success && response.data.length > 0) {
                const recentClients = response.data.slice(0, 5);
                container.innerHTML = recentClients.map(client => `
                    <div class="recent-item">
                        <div class="item-info">
                            <h4>${client.name}</h4>
                            <p>${client.email || 'Sem email'}</p>
                        </div>
                        <div class="item-meta">
                            <small>${new Date(client.created_at).toLocaleDateString()}</small>
                        </div>
                    </div>
                `).join('');
            } else {
                container.innerHTML = '<div class="loading">Nenhum cliente encontrado</div>';
            }
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            document.getElementById('recent-clients').innerHTML = 
                '<div class="loading">Erro ao carregar clientes</div>';
        }
    }

    async loadRecentSales() {
        try {
            const response = await this.apiCall('/sales');
            const container = document.getElementById('recent-sales');

            if (response.success && response.data.length > 0) {
                const recentSales = response.data.slice(0, 5);
                container.innerHTML = recentSales.map(sale => `
                    <div class="recent-item">
                        <div class="item-info">
                            <h4>Venda #${sale.id}</h4>
                            <p>${sale.client_name || 'Cliente'}</p>
                        </div>
                        <div class="item-value">
                            R$ ${parseFloat(sale.amount).toFixed(2)}
                        </div>
                    </div>
                `).join('');
            } else {
                container.innerHTML = '<div class="loading">Nenhuma venda encontrada</div>';
            }
        } catch (error) {
            console.error('Erro ao carregar vendas:', error);
            document.getElementById('recent-sales').innerHTML = 
                '<div class="loading">Erro ao carregar vendas</div>';
        }
    }

    bindEvents() {
        // Logout
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
    }

    async apiCall(endpoint, options = {}) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (response.status === 401) {
            this.logout();
            throw new Error('Não autorizado');
        }

        return await response.json();
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }

    showError(message) {
        alert(message);
    }
}

// Inicializar dashboard quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});