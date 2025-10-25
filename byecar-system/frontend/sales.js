const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Gerenciador de vendas
 * @class
 */
class SalesManager {
    /**
     * @constructor
     */
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || '{}');
        this.sales = [];
        this.clients = [];
        this.init();
    }

    /**
     * Inicializa o gerenciador de vendas
     * @method
     */
    init() {
        if (!this.token) {
            window.location.href = 'index.html';
            return;
        }

        this.loadSales();
        this.loadClients();
        this.bindEvents();
        
        // Set today's date as default
        document.getElementById('sale-date').value = new Date().toISOString().split('T')[0];
    }

    /**
     * Carrega todas as vendas
     * @method
     * @async
     */
    async loadSales() {
        try {
            const response = await this.apiCall('/sales');
            
            if (response.success) {
                this.sales = response.data;
                this.renderSales();
                this.updateStats();
            } else {
                this.showError('Erro ao carregar vendas');
            }
        } catch (error) {
            console.error('Erro:', error);
            this.showError('Erro ao carregar vendas');
        }
    }

    /**
     * Carrega todos os clientes
     * @method
     * @async
     */
    async loadClients() {
        try {
            const response = await this.apiCall('/clients');
            
            if (response.success) {
                this.clients = response.data;
                this.populateClientSelect();
            }
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        }
    }

    /**
     * Preenche o select de clientes
     * @method
     */
    populateClientSelect() {
        const select = document.getElementById('sale-client');
        select.innerHTML = '<option value="">Selecione um cliente</option>';
        
        this.clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            select.appendChild(option);
        });
    }

    /**
     * Renderiza a lista de vendas
     * @method
     * @param {Array} filteredSales - Vendas filtradas (opcional)
     */
    renderSales(filteredSales = null) {
        const sales = filteredSales || this.sales;
        const tbody = document.getElementById('sales-tbody');
        
        if (sales.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="loading">Nenhuma venda encontrada</td></tr>';
            return;
        }

        tbody.innerHTML = sales.map(sale => `
            <tr>
                <td>#${sale.id}</td>
                <td>${sale.client_name || 'Cliente não encontrado'}</td>
                <td><strong>R$ ${parseFloat(sale.amount).toFixed(2)}</strong></td>
                <td>${new Date(sale.sale_date).toLocaleDateString()}</td>
                <td>${sale.description || '-'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="salesManager.editSale(${sale.id})">
                            <i class='bx bxs-edit'></i>
                        </button>
                        <button class="btn-delete" onclick="salesManager.deleteSale(${sale.id})">
                            <i class='bx bxs-trash'></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    /**
     * Atualiza as estatísticas de vendas
     * @method
     */
    updateStats() {
        const totalSales = this.sales.length;
        const totalRevenue = this.sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
        const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

        document.getElementById('total-sales-count').textContent = totalSales;
        document.getElementById('total-revenue-amount').textContent = `R$ ${totalRevenue.toFixed(2)}`;
        document.getElementById('average-sale').textContent = `R$ ${averageSale.toFixed(2)}`;
    }

    /**
     * Vincula eventos aos elementos
     * @method
     */
    bindEvents() {
        // Modal
        const modal = document.getElementById('sale-modal');
        const addBtn = document.getElementById('add-sale-btn');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.querySelector('.btn-cancel');
        const form = document.getElementById('sale-form');

        addBtn.addEventListener('click', () => this.openModal());
        closeBtn.addEventListener('click', () => this.closeModal());
        cancelBtn.addEventListener('click', () => this.closeModal());
        
        form.addEventListener('submit', (e) => this.saveSale(e));

        // Fechar modal ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Busca
        document.getElementById('search-sale').addEventListener('input', (e) => {
            this.searchSales(e.target.value);
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
    }

    /**
     * Abre o modal para nova venda
     * @method
     */
    openModal() {
        if (this.clients.length === 0) {
            this.showError('É necessário ter clientes cadastrados antes de criar vendas');
            return;
        }

        const modal = document.getElementById('sale-modal');
        const title = document.getElementById('modal-title');

        title.textContent = 'Nova Venda';
        document.getElementById('sale-form').reset();
        document.getElementById('sale-id').value = '';
        document.getElementById('sale-date').value = new Date().toISOString().split('T')[0];

        modal.style.display = 'block';
    }

    /**
     * Fecha o modal
     * @method
     */
    closeModal() {
        document.getElementById('sale-modal').style.display = 'none';
    }

    /**
     * Salva uma venda (cria ou atualiza)
     * @method
     * @async
     * @param {Event} e - Evento do formulário
     */
    async saveSale(e) {
        e.preventDefault();

        const saleId = document.getElementById('sale-id').value;
        const saleData = {
            client_id: parseInt(document.getElementById('sale-client').value),
            amount: parseFloat(document.getElementById('sale-amount').value),
            sale_date: document.getElementById('sale-date').value,
            description: document.getElementById('sale-description').value
        };

        if (!saleData.client_id || !saleData.amount || !saleData.sale_date) {
            this.showError('Cliente, valor e data são obrigatórios');
            return;
        }

        if (saleData.amount <= 0) {
            this.showError('O valor deve ser maior que zero');
            return;
        }

        try {
            let response;
            if (saleId) {
                // Editar venda existente
                response = await this.apiCall(`/sales/${saleId}`, {
                    method: 'PUT',
                    body: JSON.stringify(saleData)
                });
            } else {
                // Nova venda
                response = await this.apiCall('/sales', {
                    method: 'POST',
                    body: JSON.stringify(saleData)
                });
            }

            if (response.success) {
                this.closeModal();
                this.loadSales();
                this.showSuccess(saleId ? 'Venda atualizada!' : 'Venda registrada com sucesso!');
            } else {
                this.showError(response.message);
            }
        } catch (error) {
            console.error('Erro ao salvar venda:', error);
            this.showError('Erro ao salvar venda');
        }
    }

    /**
     * Prepara o modal para edição de uma venda
     * @method
     * @param {number} saleId - ID da venda a ser editada
     */
    async editSale(saleId) {
        try {
            const sale = this.sales.find(s => s.id === saleId);
            if (sale) {
                this.openEditModal(sale);
            } else {
                this.showError('Venda não encontrada');
            }
        } catch (error) {
            console.error('Erro:', error);
            this.showError('Erro ao carregar dados da venda');
        }
    }

    /**
     * Abre o modal para edição de venda
     * @method
     * @param {Object} sale - Dados da venda
     */
    openEditModal(sale) {
        const modal = document.getElementById('sale-modal');
        const title = document.getElementById('modal-title');

        title.textContent = 'Editar Venda';
        document.getElementById('sale-id').value = sale.id;
        document.getElementById('sale-client').value = sale.client_id;
        document.getElementById('sale-amount').value = sale.amount;
        
        // Formata a data corretamente para o input date
        const saleDate = new Date(sale.sale_date);
        const formattedDate = saleDate.toISOString().split('T')[0];
        document.getElementById('sale-date').value = formattedDate;
        
        document.getElementById('sale-description').value = sale.description || '';

        modal.style.display = 'block';
    }

    /**
     * Exclui uma venda
     * @method
     * @async
     * @param {number} saleId - ID da venda a ser excluída
     */
    async deleteSale(saleId) {
        if (!confirm('Tem certeza que deseja excluir esta venda?')) {
            return;
        }

        try {
            const response = await this.apiCall(`/sales/${saleId}`, {
                method: 'DELETE'
            });

            if (response.success) {
                this.loadSales();
                this.showSuccess('Venda excluída com sucesso!');
            } else {
                this.showError(response.message);
            }
        } catch (error) {
            console.error('Erro ao excluir venda:', error);
            this.showError('Erro ao excluir venda');
        }
    }

    /**
     * Busca vendas
     * @method
     * @param {string} query - Termo de busca
     */
    searchSales(query) {
        if (!query) {
            this.renderSales();
            return;
        }

        const filtered = this.sales.filter(sale =>
            sale.client_name.toLowerCase().includes(query.toLowerCase()) ||
            sale.id.toString().includes(query) ||
            sale.description?.toLowerCase().includes(query.toLowerCase())
        );

        this.renderSales(filtered);
    }

    /**
     * Faz chamadas à API
     * @method
     * @async
     * @param {string} endpoint - Endpoint da API
     * @param {Object} options - Opções da requisição
     * @returns {Promise<Object>} Resposta da API
     */
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

    /**
     * Realiza logout do usuário
     * @method
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }

    /**
     * Exibe mensagem de erro
     * @method
     * @param {string} message - Mensagem de erro
     */
    showError(message) {
        alert('Erro: ' + message);
    }

    /**
     * Exibe mensagem de sucesso
     * @method
     * @param {string} message - Mensagem de sucesso
     */
    showSuccess(message) {
        alert('Sucesso: ' + message);
    }
}

// CSS adicional para a página de vendas
const salesCSS = `
.stat-icon.average {
    background: #8b5cf6;
}

.btn-edit, .btn-delete {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-right: 0.25rem;
}

.btn-edit {
    background: #dbeafe;
    color: var(--primary);
}

.btn-delete {
    background: #fee2e2;
    color: var(--danger);
}

.form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.9rem;
    background: white;
}

.form-group select:focus {
    outline: none;
    border-color: var(--primary);
}

/* Estilos para o modal */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
}

.modal-content {
    background-color: white;
    margin: 5% auto;
    padding: 0;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    animation: modalSlide 0.3s ease;
}

@keyframes modalSlide {
    from { transform: translateY(-50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

.modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    color: var(--dark);
}

.close {
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--secondary);
}

.close:hover {
    color: var(--dark);
}

#sale-form {
    padding: 1.5rem;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--dark);
    font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.9rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary);
}

.form-group textarea {
    resize: vertical;
    min-height: 80px;
}

.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
}

.btn-cancel, .btn-primary {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
}

.btn-cancel {
    background: #f1f5f9;
    color: var(--secondary);
}

.btn-primary {
    background: var(--primary);
    color: white;
}

.btn-primary:hover {
    background: var(--primary-dark);
}

.action-buttons {
    display: flex;
    gap: 0.5rem;
}
`;

// Adicionar CSS adicional
const style = document.createElement('style');
style.textContent = salesCSS;
document.head.appendChild(style);

// Inicializar gerenciador de vendas
let salesManager;
document.addEventListener('DOMContentLoaded', () => {
    salesManager = new SalesManager();
});