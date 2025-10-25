const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Gerenciador de clientes
 * @class
 */
class ClientsManager {
    /**
     * @constructor
     */
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || '{}');
        this.clients = [];
        this.init();
    }

    /**
     * Inicializa o gerenciador de clientes
     * @method
     */
    init() {
        if (!this.token) {
            window.location.href = 'index.html';
            return;
        }

        this.loadClients();
        this.bindEvents();
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
                this.renderClients();
            } else {
                this.showError('Erro ao carregar clientes');
            }
        } catch (error) {
            console.error('Erro:', error);
            this.showError('Erro ao carregar clientes');
        }
    }

    /**
     * Renderiza a lista de clientes
     * @method
     * @param {Array} filteredClients - Clientes filtrados (opcional)
     */
    renderClients(filteredClients = null) {
        const clients = filteredClients || this.clients;
        const tbody = document.getElementById('clients-tbody');
        
        if (clients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">Nenhum cliente encontrado</td></tr>';
            return;
        }

        tbody.innerHTML = clients.map(client => `
            <tr>
                <td>
                    <div class="client-info">
                        <strong>${client.name}</strong>
                        ${client.address ? `<br><small>${client.address}</small>` : ''}
                    </div>
                </td>
                <td>${client.email || '-'}</td>
                <td>${client.phone || '-'}</td>
                <td>${new Date(client.created_at).toLocaleDateString()}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="clientsManager.editClient(${client.id})">
                            <i class='bx bxs-edit'></i>
                        </button>
                        <button class="btn-delete" onclick="clientsManager.deleteClient(${client.id})">
                            <i class='bx bxs-trash'></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    /**
     * Vincula eventos aos elementos
     * @method
     */
    bindEvents() {
        // Modal
        const modal = document.getElementById('client-modal');
        const addBtn = document.getElementById('add-client-btn');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.querySelector('.btn-cancel');
        const form = document.getElementById('client-form');

        addBtn.addEventListener('click', () => this.openModal());
        closeBtn.addEventListener('click', () => this.closeModal());
        cancelBtn.addEventListener('click', () => this.closeModal());
        
        form.addEventListener('submit', (e) => this.saveClient(e));

        // Fechar modal ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Busca
        document.getElementById('search-client').addEventListener('input', (e) => {
            this.searchClients(e.target.value);
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
    }

    /**
     * Abre o modal para adicionar ou editar um cliente
     * @method
     * @param {Object} client - Cliente a ser editado (opcional)
     */
    openModal(client = null) {
        const modal = document.getElementById('client-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('client-form');

        if (client) {
            title.textContent = 'Editar Cliente';
            document.getElementById('client-id').value = client.id;
            document.getElementById('client-name').value = client.name;
            document.getElementById('client-email').value = client.email || '';
            document.getElementById('client-phone').value = client.phone || '';
            document.getElementById('client-address').value = client.address || '';
        } else {
            title.textContent = 'Novo Cliente';
            form.reset();
            document.getElementById('client-id').value = '';
        }

        modal.style.display = 'block';
    }

    /**
     * Fecha o modal
     * @method
     */
    closeModal() {
        document.getElementById('client-modal').style.display = 'none';
    }

    /**
     * Salva um cliente (cria ou atualiza)
     * @method
     * @async
     * @param {Event} e - Evento do formulário
     */
    async saveClient(e) {
        e.preventDefault();

        const clientId = document.getElementById('client-id').value;
        const clientData = {
            name: document.getElementById('client-name').value,
            email: document.getElementById('client-email').value,
            phone: document.getElementById('client-phone').value,
            address: document.getElementById('client-address').value
        };

        if (!clientData.name) {
            this.showError('Nome é obrigatório');
            return;
        }

        try {
            let response;
            if (clientId) {
                // Editar cliente existente
                response = await this.apiCall(`/clients/${clientId}`, {
                    method: 'PUT',
                    body: JSON.stringify(clientData)
                });
            } else {
                // Novo cliente
                response = await this.apiCall('/clients', {
                    method: 'POST',
                    body: JSON.stringify(clientData)
                });
            }

            if (response.success) {
                this.closeModal();
                this.loadClients();
                this.showSuccess(clientId ? 'Cliente atualizado!' : 'Cliente criado!');
            } else {
                this.showError(response.message);
            }
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            this.showError('Erro ao salvar cliente');
        }
    }

    /**
     * Prepara o modal para edição de um cliente
     * @method
     * @param {number} clientId - ID do cliente a ser editado
     */
    editClient(clientId) {
        const client = this.clients.find(c => c.id === clientId);
        if (client) {
            this.openModal(client);
        }
    }

    /**
     * Exclui um cliente
     * @method
     * @async
     * @param {number} clientId - ID do cliente a ser excluído
     */
    async deleteClient(clientId) {
        if (!confirm('Tem certeza que deseja excluir este cliente?')) {
            return;
        }

        try {
            const response = await this.apiCall(`/clients/${clientId}`, {
                method: 'DELETE'
            });

            if (response.success) {
                this.loadClients();
                this.showSuccess('Cliente excluído com sucesso!');
            } else {
                this.showError(response.message);
            }
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            this.showError('Erro ao excluir cliente');
        }
    }

    /**
     * Busca clientes
     * @method
     * @param {string} query - Termo de busca
     */
    searchClients(query) {
        if (!query) {
            this.renderClients();
            return;
        }

        const filtered = this.clients.filter(client =>
            client.name.toLowerCase().includes(query.toLowerCase()) ||
            (client.email && client.email.toLowerCase().includes(query.toLowerCase())) ||
            (client.phone && client.phone.includes(query))
        );

        this.renderClients(filtered);
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

// CSS adicional para a página de clientes
const additionalCSS = `
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

#client-form {
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
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.9rem;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary);
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

.table-container {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #f1f5f9;
}

th {
    background: #f8fafc;
    color: var(--dark);
    font-weight: 600;
}

.client-info small {
    color: var(--secondary);
}

.action-buttons {
    display: flex;
    gap: 0.5rem;
}

.btn-edit, .btn-delete {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

.btn-edit {
    background: #dbeafe;
    color: var(--primary);
}

.btn-delete {
    background: #fee2e2;
    color: var(--danger);
}

.search-box {
    position: relative;
    width: 300px;
}

.search-box input {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.9rem;
}

.search-box i {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--secondary);
}
`;

// Adicionar CSS adicional
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Inicializar gerenciador de clientes
let clientsManager;
document.addEventListener('DOMContentLoaded', () => {
    clientsManager = new ClientsManager();
});