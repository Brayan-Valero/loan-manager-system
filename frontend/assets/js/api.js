// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

class API {
    static async getAuthToken() {
        const { data } = await supabase.auth.getSession();
        return data.session?.access_token;
    }

    static getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
        };
        return headers;
    }

    // Clientes
    static async getClients() {
        const token = await this.getAuthToken();
        const response = await fetch(`${API_BASE_URL}/clients`, {
            headers: { ...this.getHeaders(), 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    }

    static async getClientById(id) {
        const token = await this.getAuthToken();
        const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
            headers: { ...this.getHeaders(), 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    }

    static async createClient(clientData) {
        const token = await this.getAuthToken();
        const response = await fetch(`${API_BASE_URL}/clients`, {
            method: 'POST',
            headers: { ...this.getHeaders(), 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(clientData)
        });
        return response.json();
    }

    static async updateClient(id, clientData) {
        const token = await this.getAuthToken();
        const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
            method: 'PUT',
            headers: { ...this.getHeaders(), 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(clientData)
        });
        return response.json();
    }

    static async deleteClient(id) {
        const token = await this.getAuthToken();
        const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
            method: 'DELETE',
            headers: { ...this.getHeaders(), 'Authorization': `Bearer ${token}` }
        });
        return response.status === 204;
    }

    // Préstamos
    static async getLoans() {
        const token = await this.getAuthToken();
        const response = await fetch(`${API_BASE_URL}/loans`, {
            headers: { ...this.getHeaders(), 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    }

    static async getLoanById(id) {
        const token = await this.getAuthToken();
        const response = await fetch(`${API_BASE_URL}/loans/${id}`, {
            headers: { ...this.getHeaders(), 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    }

    static async createLoan(loanData) {
        const token = await this.getAuthToken();
        const response = await fetch(`${API_BASE_URL}/loans`, {
            method: 'POST',
            headers: { ...this.getHeaders(), 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(loanData)
        });
        return response.json();
    }

    static async updateLoan(id, loanData) {
        const token = await this.getAuthToken();
        const response = await fetch(`${API_BASE_URL}/loans/${id}`, {
            method: 'PUT',
            headers: { ...this.getHeaders(), 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(loanData)
        });
        return response.json();
    }

    static async deleteLoan(id) {
        const token = await this.getAuthToken();
        const response = await fetch(`${API_BASE_URL}/loans/${id}`, {
            method: 'DELETE',
            headers: { ...this.getHeaders(), 'Authorization': `Bearer ${token}` }
        });
        return response.status === 204;
    }

    // Simulador
    static async simulateLoan(principal, rate, months) {
        const token = await this.getAuthToken();
        const response = await fetch(`${API_BASE_URL}/loans/simulate`, {
            method: 'POST',
            headers: { ...this.getHeaders(), 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ principal, rate, months })
        });
        return response.json();
    }

    // Pagos
    static async getPayments() {
        const token = await this.getAuthToken();
        const response = await fetch(`${API_BASE_URL}/payments`, {
            headers: { ...this.getHeaders(), 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    }

    static async createPayment(paymentData) {
        const token = await this.getAuthToken();
        const response = await fetch(`${API_BASE_URL}/payments`, {
            method: 'POST',
            headers: { ...this.getHeaders(), 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(paymentData)
        });
        return response.json();
    }

    static async deletePayment(id) {
        const token = await this.getAuthToken();
        const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
            method: 'DELETE',
            headers: { ...this.getHeaders(), 'Authorization': `Bearer ${token}` }
        });
        return response.status === 204;
    }
}
