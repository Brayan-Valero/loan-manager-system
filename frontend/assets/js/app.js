// Aplicación principal
let currentUser = null;
let currentPage = 'dashboard';

// Variables de caché
let clients = [];
let loans = [];
let payments = [];

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', async () => {
    Auth.onAuthStateChange(async (user, event) => {
        currentUser = user;
        if (user) {
            await loadData();
            showPage('dashboard');
        } else {
            showLoginPage();
        }
    });

    // Verificar si hay sesión activa
    const user = await Auth.getCurrentUser();
    if (user) {
        currentUser = user;
        await loadData();
        showPage('dashboard');
    } else {
        showLoginPage();
    }
});

async function loadData() {
    try {
        clients = await API.getClients();
        loans = await API.getLoans();
        payments = await API.getPayments();
    } catch (error) {
        console.error('Error cargando datos:', error);
    }
}

function showLoginPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="login-container">
            <div class="login-box">
                <h1>Loan Manager</h1>

                <div id="login" class="login-form active">
                    <div class="form-group">
                        <label for="login-email">Correo:</label>
                        <input type="email" id="login-email" placeholder="tu@email.com">
                    </div>
                    <div class="form-group">
                        <label for="login-password">Contrase?a:</label>
                        <input type="password" id="login-password" placeholder="Tu contrase?a">
                    </div>
                    <button class="btn btn-primary" style="width: 100%;" onclick="handleLogin()">Ingresar</button>
                </div>
            </div>
        </div>
    `;
}

async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        Notification.error('Por favor completa todos los campos');
        return;
    }

    try {
        await Auth.login(email, password);
        Notification.success('¡Ingreso exitoso!');
    } catch (error) {
        Notification.error('Error: ' + error.message);
    }
}

function showPage(page) {
    currentPage = page;
    const app = document.getElementById('app');

    switch (page) {
        case 'dashboard':
            app.innerHTML = getDashboardHTML();
            renderDashboard();
            break;
        case 'clients':
            app.innerHTML = getClientsHTML();
            renderClients();
            break;
        case 'loans':
            app.innerHTML = getLoansHTML();
            renderLoans();
            break;
        case 'payments':
            app.innerHTML = getPaymentsHTML();
            renderPayments();
            break;
        case 'simulator':
            app.innerHTML = getSimulatorHTML();
            break;
    }
}

function getDashboardHTML() {
    const totalLoans = loans.length;
    const totalClientsCount = clients.length;
    const activeLoans = loans.filter(l => l.status === 'ACTIVE').length;
    const totalBalance = loans.reduce((sum, l) => sum + parseFloat(l.balance || 0), 0);

    return `
        ${getHeader()}
        <div class="container">
            <div class="dashboard-stats">
                <div class="stat-card primary">
                    <div class="stat-label">Total Clientes</div>
                    <div class="stat-value">${totalClientsCount}</div>
                </div>
                <div class="stat-card secondary">
                    <div class="stat-label">Préstamos Activos</div>
                    <div class="stat-value">${activeLoans}</div>
                </div>
                <div class="stat-card danger">
                    <div class="stat-label">Saldo Total Pendiente</div>
                    <div class="stat-value">${Utils.formatCurrency(totalBalance)}</div>
                </div>
                <div class="stat-card warning">
                    <div class="stat-label">Total de Préstamos</div>
                    <div class="stat-value">${totalLoans}</div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2>Préstamos Recientes</h2>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Monto</th>
                            <th>Saldo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${loans.slice(0, 5).map(loan => `
                            <tr>
                                <td>${loan.client?.name || 'N/A'}</td>
                                <td>${Utils.formatCurrency(loan.principalAmount)}</td>
                                <td>${Utils.formatCurrency(loan.balance)}</td>
                                <td><span style="color: ${loan.status === 'ACTIVE' ? 'green' : 'orange'}">${loan.status}</span></td>
                                <td>
                                    <div class="table-actions">
                                        <button class="btn btn-primary btn-small" onclick="viewLoanDetail(${loan.id})">Ver</button>
                                        <button class="btn btn-secondary btn-small" onclick="downloadLoanPDF(${loan.id})">PDF</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function getClientsHTML() {
    return `
        ${getHeader()}
        <div class="container">
            <div class="card">
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <h2>Gestión de Clientes</h2>
                    <button class="btn btn-primary" onclick="openClientModal()">+ Nuevo Cliente</button>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Documento</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${clients.map(client => `
                            <tr>
                                <td>${client.name}</td>
                                <td>${client.email}</td>
                                <td>${client.phone || 'N/A'}</td>
                                <td>${client.documentNumber || 'N/A'}</td>
                                <td>
                                    <div class="table-actions">
                                        <button class="btn btn-primary btn-small" onclick="editClient(${client.id})">Editar</button>
                                        <button class="btn btn-danger btn-small" onclick="deleteClient(${client.id})">Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <div id="clientModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="clientModalTitle">Nuevo Cliente</h2>
                    <button class="close-btn" onclick="closeClientModal()">&times;</button>
                </div>
                <div class="form-group">
                    <label>Nombre:</label>
                    <input type="text" id="clientName" placeholder="Nombre completo">
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" id="clientEmail" placeholder="email@example.com">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Teléfono:</label>
                        <input type="text" id="clientPhone" placeholder="Teléfono">
                    </div>
                    <div class="form-group">
                        <label>Documento:</label>
                        <input type="text" id="clientDocument" placeholder="Número de documento">
                    </div>
                </div>
                <div class="form-group">
                    <label>Dirección:</label>
                    <input type="text" id="clientAddress" placeholder="Dirección">
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="saveClient()">Guardar</button>
                    <button class="btn" style="background: #ccc;" onclick="closeClientModal()">Cancelar</button>
                </div>
            </div>
        </div>
    `;
}

function getLoansHTML() {
    return `
        ${getHeader()}
        <div class="container">
            <div class="card">
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <h2>Gestión de Préstamos</h2>
                    <button class="btn btn-primary" onclick="openLoanModal()">+ Nuevo Préstamo</button>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Monto</th>
                            <th>Interés %</th>
                            <th>Cuotas</th>
                            <th>Saldo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${loans.map(loan => `
                            <tr>
                                <td>${loan.client?.name || 'N/A'}</td>
                                <td>${Utils.formatCurrency(loan.principalAmount)}</td>
                                <td>${loan.interestRate}%</td>
                                <td>${loan.numberOfInstallments}</td>
                                <td>${Utils.formatCurrency(loan.balance)}</td>
                                <td><span style="color: ${loan.status === 'ACTIVE' ? 'green' : 'orange'}">${loan.status}</span></td>
                                <td>
                                    <div class="table-actions">
                                        <button class="btn btn-primary btn-small" onclick="viewLoanDetail(${loan.id})">Ver</button>
                                        <button class="btn btn-secondary btn-small" onclick="openPaymentModal(${loan.id})">Pago</button>
                                        <button class="btn btn-danger btn-small" onclick="deleteLoan(${loan.id})">Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <div id="loanModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="loanModalTitle">Nuevo Préstamo</h2>
                    <button class="close-btn" onclick="closeLoanModal()">&times;</button>
                </div>
                <div class="form-group">
                    <label>Cliente:</label>
                    <select id="loanClient">
                        <option value="">Selecciona un cliente</option>
                        ${clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Monto Principal:</label>
                        <input type="number" id="loanPrincipal" placeholder="0.00" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Tasa de Interés (% anual):</label>
                        <input type="number" id="loanRate" placeholder="0.00" step="0.01">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Número de Cuotas:</label>
                        <input type="number" id="loanInstallments" placeholder="0" step="1">
                    </div>
                    <div class="form-group">
                        <label>Fecha de Inicio:</label>
                        <input type="date" id="loanStartDate">
                    </div>
                </div>
                <div class="form-group">
                    <label>Cuota Mensual (calculada):</label>
                    <input type="text" id="loanMonthlyCalc" readonly style="background: #f5f5f5;">
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="saveLoan()">Guardar</button>
                    <button class="btn" style="background: #ccc;" onclick="closeLoanModal()">Cancelar</button>
                </div>
            </div>
        </div>
    `;
}

function getPaymentsHTML() {
    return `
        ${getHeader()}
        <div class="container">
            <div class="card">
                <div class="card-header">
                    <h2>Registro de Pagos</h2>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Préstamo</th>
                            <th>Monto Pagado</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${payments.map(payment => {
                            const loan = loans.find(l => l.id === payment.loan?.id);
                            const client = clients.find(c => c.id === loan?.client?.id);
                            return `
                            <tr>
                                <td>${client?.name || 'N/A'}</td>
                                <td>${Utils.formatCurrency(loan?.principalAmount || 0)}</td>
                                <td>${Utils.formatCurrency(payment.amount)}</td>
                                <td>${Utils.formatDate(payment.paymentDate)}</td>
                                <td>
                                    <div class="table-actions">
                                        <button class="btn btn-secondary btn-small" onclick="downloadPaymentPDF(${payment.id})">PDF</button>
                                        <button class="btn btn-danger btn-small" onclick="deletePayment(${payment.id})">Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function getSimulatorHTML() {
    return `
        ${getHeader()}
        <div class="container">
            <div class="card" style="max-width: 500px; margin: 0 auto;">
                <div class="card-header">
                    <h2>Simulador de Préstamos</h2>
                </div>
                <div class="form-group">
                    <label>Monto del Préstamo:</label>
                    <input type="number" id="simPrincipal" placeholder="0.00" step="0.01">
                </div>
                <div class="form-group">
                    <label>Tasa de Interés Anual (%):</label>
                    <input type="number" id="simRate" placeholder="0.00" step="0.01">
                </div>
                <div class="form-group">
                    <label>Número de Cuotas:</label>
                    <input type="number" id="simMonths" placeholder="0" step="1">
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-bottom: 20px;" onclick="runSimulation()">Simular</button>

                <div id="simulationResults" style="display: none; border-top: 2px solid var(--border-color); padding-top: 20px;">
                    <h3>Resultados:</h3>
                    <div class="form-row full">
                        <div class="form-group">
                            <label>Cuota Mensual:</label>
                            <input type="text" id="simMonthly" readonly style="background: #f5f5f5;">
                        </div>
                    </div>
                    <div class="form-row full">
                        <div class="form-group">
                            <label>Total a Pagar:</label>
                            <input type="text" id="simTotal" readonly style="background: #f5f5f5;">
                        </div>
                    </div>
                    <div class="form-row full">
                        <div class="form-group">
                            <label>Interés Total:</label>
                            <input type="text" id="simTotalInterest" readonly style="background: #f5f5f5;">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getHeader() {
    return `
        <div class="header">
            <div class="header-content">
                <h1>Loan Manager</h1>
                <div class="header-right">
                    <div class="user-info">
                        ${currentUser?.email || 'Usuario'}
                    </div>
                    <button class="btn btn-secondary" onclick="logout()">Cerrar Sesión</button>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="nav-tabs">
                <button class="nav-tab ${currentPage === 'dashboard' ? 'active' : ''}" onclick="showPage('dashboard')">Dashboard</button>
                <button class="nav-tab ${currentPage === 'clients' ? 'active' : ''}" onclick="showPage('clients')">Clientes</button>
                <button class="nav-tab ${currentPage === 'loans' ? 'active' : ''}" onclick="showPage('loans')">Préstamos</button>
                <button class="nav-tab ${currentPage === 'payments' ? 'active' : ''}" onclick="showPage('payments')">Pagos</button>
                <button class="nav-tab ${currentPage === 'simulator' ? 'active' : ''}" onclick="showPage('simulator')">Simulador</button>
            </div>
        </div>
    `;
}

// Funciones para Clientes
function renderClients() {
    // Renderizado dinámico
}

function openClientModal() {
    document.getElementById('clientName').value = '';
    document.getElementById('clientEmail').value = '';
    document.getElementById('clientPhone').value = '';
    document.getElementById('clientDocument').value = '';
    document.getElementById('clientAddress').value = '';
    document.getElementById('clientModalTitle').textContent = 'Nuevo Cliente';
    document.getElementById('clientModal').classList.add('show');
}

function closeClientModal() {
    document.getElementById('clientModal').classList.remove('show');
}

async function saveClient() {
    const name = document.getElementById('clientName').value;
    const email = document.getElementById('clientEmail').value;
    const phone = document.getElementById('clientPhone').value;
    const documentNumber = document.getElementById('clientDocument').value;
    const address = document.getElementById('clientAddress').value;

    if (!name || !email) {
        Notification.error('Por favor completa los campos requeridos');
        return;
    }

    try {
        await API.createClient({
            name, email, phone, documentNumber, address
        });
        await loadData();
        closeClientModal();
        showPage('clients');
        Notification.success('Cliente guardado exitosamente');
    } catch (error) {
        Notification.error('Error: ' + error.message);
    }
}

async function editClient(id) {
    const client = clients.find(c => c.id === id);
    if (!client) return;

    document.getElementById('clientName').value = client.name;
    document.getElementById('clientEmail').value = client.email;
    document.getElementById('clientPhone').value = client.phone || '';
    document.getElementById('clientDocument').value = client.documentNumber || '';
    document.getElementById('clientAddress').value = client.address || '';
    document.getElementById('clientModalTitle').textContent = 'Editar Cliente';
    document.getElementById('clientModal').classList.add('show');
}

async function deleteClient(id) {
    if (confirm('¿Estás seguro que deseas eliminar este cliente?')) {
        try {
            await API.deleteClient(id);
            await loadData();
            showPage('clients');
            Notification.success('Cliente eliminado');
        } catch (error) {
            Notification.error('Error: ' + error.message);
        }
    }
}

// Funciones para Préstamos
function renderLoans() {
    // Renderizado dinámico
}

function openLoanModal() {
    document.getElementById('loanClient').value = '';
    document.getElementById('loanPrincipal').value = '';
    document.getElementById('loanRate').value = '';
    document.getElementById('loanInstallments').value = '';
    document.getElementById('loanStartDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('loanMonthlyCalc').value = '';
    document.getElementById('loanModal').classList.add('show');
}

function closeLoanModal() {
    document.getElementById('loanModal').classList.remove('show');
}

document.addEventListener('input', function(e) {
    if (e.target.id === 'loanPrincipal' || e.target.id === 'loanRate' || e.target.id === 'loanInstallments') {
        const principal = parseFloat(document.getElementById('loanPrincipal').value) || 0;
        const rate = parseFloat(document.getElementById('loanRate').value) || 0;
        const installments = parseInt(document.getElementById('loanInstallments').value) || 0;

        if (principal > 0 && rate >= 0 && installments > 0) {
            const monthly = Utils.calculateMonthlyInstallment(principal, rate, installments);
            document.getElementById('loanMonthlyCalc').value = Utils.formatCurrency(monthly);
        }
    }
});

async function saveLoan() {
    const clientId = document.getElementById('loanClient').value;
    const principal = parseFloat(document.getElementById('loanPrincipal').value);
    const rate = parseFloat(document.getElementById('loanRate').value);
    const installments = parseInt(document.getElementById('loanInstallments').value);
    const startDate = document.getElementById('loanStartDate').value;

    if (!clientId || !principal || rate < 0 || !installments || !startDate) {
        Notification.error('Por favor completa todos los campos');
        return;
    }

    try {
        const client = clients.find(c => c.id === parseInt(clientId));
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + installments);

        await API.createLoan({
            client: { id: parseInt(clientId) },
            principalAmount: principal,
            interestRate: rate,
            numberOfInstallments: installments,
            startDate: startDate,
            dueDate: dueDate.toISOString().split('T')[0]
        });

        await loadData();
        closeLoanModal();
        showPage('loans');
        Notification.success('Préstamo registrado exitosamente');
    } catch (error) {
        Notification.error('Error: ' + error.message);
    }
}

async function deleteLoan(id) {
    if (confirm('¿Estás seguro que deseas eliminar este préstamo?')) {
        try {
            await API.deleteLoan(id);
            await loadData();
            showPage('loans');
            Notification.success('Préstamo eliminado');
        } catch (error) {
            Notification.error('Error: ' + error.message);
        }
    }
}

function openPaymentModal(loanId) {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Registrar Pago</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="form-group">
                <label>Monto:</label>
                <input type="number" id="paymentAmount" placeholder="0.00" step="0.01">
            </div>
            <div class="form-group">
                <label>Fecha de Pago:</label>
                <input type="date" id="paymentDate" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
                <label>Notas:</label>
                <textarea id="paymentNotes" placeholder="Notas del pago (opcional)"></textarea>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="savePayment(${loanId})">Guardar</button>
                <button class="btn" style="background: #ccc;" onclick="this.closest('.modal').remove()">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function savePayment(loanId) {
    const amount = parseFloat(document.getElementById('paymentAmount').value);
    const paymentDate = document.getElementById('paymentDate').value;
    const notes = document.getElementById('paymentNotes').value;

    if (!amount || !paymentDate) {
        Notification.error('Por favor completa los campos requeridos');
        return;
    }

    try {
        await API.createPayment({
            loan: { id: loanId },
            amount: amount,
            paymentDate: paymentDate,
            notes: notes
        });

        // Actualizar saldo del préstamo
        const loan = loans.find(l => l.id === loanId);
        if (loan) {
            loan.balance = Math.max(0, loan.balance - amount);
            loan.paidInstallments = (loan.paidInstallments || 0) + 1;
            if (loan.balance <= 0) loan.status = 'COMPLETED';
            await API.updateLoan(loanId, loan);
        }

        await loadData();
        document.querySelector('.modal').remove();
        showPage('payments');
        Notification.success('Pago registrado exitosamente');
    } catch (error) {
        Notification.error('Error: ' + error.message);
    }
}

async function deletePayment(id) {
    if (confirm('¿Estás seguro que deseas eliminar este pago?')) {
        try {
            await API.deletePayment(id);
            await loadData();
            showPage('payments');
            Notification.success('Pago eliminado');
        } catch (error) {
            Notification.error('Error: ' + error.message);
        }
    }
}

// Funciones para Simulador
async function runSimulation() {
    const principal = parseFloat(document.getElementById('simPrincipal').value);
    const rate = parseFloat(document.getElementById('simRate').value);
    const months = parseInt(document.getElementById('simMonths').value);

    if (!principal || rate < 0 || !months) {
        Notification.error('Por favor completa todos los campos');
        return;
    }

    try {
        const result = await API.simulateLoan(principal, rate, months);
        document.getElementById('simMonthly').value = Utils.formatCurrency(result.monthlyInstallment);
        document.getElementById('simTotal').value = Utils.formatCurrency(result.totalToPay);
        document.getElementById('simTotalInterest').value = Utils.formatCurrency(result.totalInterest);
        document.getElementById('simulationResults').style.display = 'block';
    } catch (error) {
        Notification.error('Error: ' + error.message);
    }
}

// Funciones para PDF
function viewLoanDetail(loanId) {
    const loan = loans.find(l => l.id === loanId);
    const client = clients.find(c => c.id === loan?.client?.id);

    if (!loan) return;

    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>Detalles del Préstamo</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div style="padding: 20px 0;">
                <p><strong>Cliente:</strong> ${client?.name || 'N/A'}</p>
                <p><strong>Email:</strong> ${client?.email || 'N/A'}</p>
                <p><strong>Monto Original:</strong> ${Utils.formatCurrency(loan.principalAmount)}</p>
                <p><strong>Tasa de Interés:</strong> ${loan.interestRate}%</p>
                <p><strong>Cuota Mensual:</strong> ${Utils.formatCurrency(loan.monthlyInstallment)}</p>
                <p><strong>Número de Cuotas:</strong> ${loan.numberOfInstallments}</p>
                <p><strong>Cuotas Pagadas:</strong> ${loan.paidInstallments || 0}</p>
                <p><strong>Saldo Actual:</strong> ${Utils.formatCurrency(loan.balance)}</p>
                <p><strong>Fecha de Inicio:</strong> ${Utils.formatDate(loan.startDate)}</p>
                <p><strong>Fecha de Vencimiento:</strong> ${Utils.formatDate(loan.dueDate)}</p>
                <p><strong>Estado:</strong> <span style="color: ${loan.status === 'ACTIVE' ? 'green' : 'orange'}">${loan.status}</span></p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="downloadLoanPDF(${loan.id})">Descargar PDF</button>
                <button class="btn" style="background: #ccc;" onclick="this.closest('.modal').remove()">Cerrar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function downloadLoanPDF(loanId) {
    const loan = loans.find(l => l.id === loanId);
    const client = clients.find(c => c.id === loan?.client?.id);

    if (!loan) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('DOCUMENTO DE PRÉSTAMO', 15, 15);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);

    let yPos = 30;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('INFORMACIÓN DEL CLIENTE:', 15, yPos);
    yPos += 7;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(`Nombre: ${client?.name || 'N/A'}`, 15, yPos);
    yPos += 5;
    doc.text(`Email: ${client?.email || 'N/A'}`, 15, yPos);
    yPos += 5;
    doc.text(`Teléfono: ${client?.phone || 'N/A'}`, 15, yPos);
    yPos += 5;
    doc.text(`Documento: ${client?.documentNumber || 'N/A'}`, 15, yPos);
    yPos += 10;

    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('DETALLES DEL PRÉSTAMO:', 15, yPos);
    yPos += 7;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(`Monto Original: ${Utils.formatCurrency(loan.principalAmount)}`, 15, yPos);
    yPos += 5;
    doc.text(`Tasa de Interés: ${loan.interestRate}% anual`, 15, yPos);
    yPos += 5;
    doc.text(`Número de Cuotas: ${loan.numberOfInstallments}`, 15, yPos);
    yPos += 5;
    doc.text(`Cuota Mensual: ${Utils.formatCurrency(loan.monthlyInstallment)}`, 15, yPos);
    yPos += 5;
    doc.text(`Fecha de Inicio: ${Utils.formatDate(loan.startDate)}`, 15, yPos);
    yPos += 5;
    doc.text(`Fecha de Vencimiento: ${Utils.formatDate(loan.dueDate)}`, 15, yPos);
    yPos += 10;

    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('ESTADO ACTUAL:', 15, yPos);
    yPos += 7;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(`Cuotas Pagadas: ${loan.paidInstallments || 0}`, 15, yPos);
    yPos += 5;
    doc.text(`Saldo Pendiente: ${Utils.formatCurrency(loan.balance)}`, 15, yPos);
    yPos += 5;
    doc.text(`Estado: ${loan.status}`, 15, yPos);

    doc.save(`prestamo_${loanId}.pdf`);
    Notification.success('PDF descargado correctamente');
}

function downloadPaymentPDF(paymentId) {
    const payment = payments.find(p => p.id === paymentId);
    const loan = loans.find(l => l.id === payment?.loan?.id);
    const client = clients.find(c => c.id === loan?.client?.id);

    if (!payment) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFillColor(0, 153, 77);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('RECIBO DE PAGO', 15, 15);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    let yPos = 30;
    doc.setFont(undefined, 'bold');
    doc.text('INFORMACIÓN DEL PAGO:', 15, yPos);
    yPos += 7;

    doc.setFont(undefined, 'normal');
    doc.text(`Recibo #: ${paymentId}`, 15, yPos);
    yPos += 5;
    doc.text(`Fecha: ${Utils.formatDate(payment.paymentDate)}`, 15, yPos);
    yPos += 5;
    doc.text(`Monto Pagado: ${Utils.formatCurrency(payment.amount)}`, 15, yPos);
    yPos += 10;

    doc.setFont(undefined, 'bold');
    doc.text('INFORMACIÓN DEL CLIENTE:', 15, yPos);
    yPos += 7;

    doc.setFont(undefined, 'normal');
    doc.text(`Nombre: ${client?.name || 'N/A'}`, 15, yPos);
    yPos += 5;
    doc.text(`Email: ${client?.email || 'N/A'}`, 15, yPos);
    yPos += 10;

    doc.setFont(undefined, 'bold');
    doc.text('DETALLES DEL PRÉSTAMO:', 15, yPos);
    yPos += 7;

    doc.setFont(undefined, 'normal');
    doc.text(`Préstamo #: ${loan?.id || 'N/A'}`, 15, yPos);
    yPos += 5;
    doc.text(`Monto Original: ${Utils.formatCurrency(loan?.principalAmount || 0)}`, 15, yPos);
    yPos += 5;
    doc.text(`Saldo Anterior: ${Utils.formatCurrency((parseFloat(loan?.balance || 0) + parseFloat(payment.amount)))}`, 15, yPos);
    yPos += 5;
    doc.text(`Saldo Nuevo: ${Utils.formatCurrency(loan?.balance || 0)}`, 15, yPos);

    doc.save(`recibo_pago_${paymentId}.pdf`);
    Notification.success('Recibo descargado correctamente');
}

async function logout() {
    try {
        await Auth.logout();
        showLoginPage();
        Notification.success('Sesión cerrada');
    } catch (error) {
        Notification.error('Error: ' + error.message);
    }
}

