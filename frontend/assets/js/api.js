// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

class API {
    static async getAuthToken() {
        try {
            const token = await Auth.getAuthToken();
            return token || null;
        } catch (error) {
            console.error('Error obteniendo token:', error);
            return null;
        }
    }

    static getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
        };
        return headers;
    }

    // Clientes
    static async getClients() {
        try {
            const token = await this.getAuthToken();
            const headers = { ...this.getHeaders() };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_BASE_URL}/clients`, {
                headers: headers
            });
            if (!response.ok) {
                return [];
            }
            return response.json();
        } catch (error) {
            console.log('Error obteniendo clientes:', error);
            return [];
        }
    }

    static async getClientById(id) {
        try {
            const token = await this.getAuthToken();
            const headers = { ...this.getHeaders() };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
                headers: headers
            });
            if (!response.ok) return null;
            return response.json();
        } catch (error) {
            return null;
        }
    }

    static async createClient(clientData) {
        try {
            const token = await this.getAuthToken();
            const headers = { ...this.getHeaders() };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_BASE_URL}/clients`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(clientData)
            });
            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Error creando cliente');
            }
            return response.json();
        } catch (error) {
            console.error('Error creando cliente:', error);
            throw error;
        }
    }

    static async updateClient(id, clientData) {
        try {
            const token = await this.getAuthToken();
            const headers = { ...this.getHeaders() };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(clientData)
            });
            if (!response.ok) throw new Error('Error actualizando cliente');
            return response.json();
        } catch (error) {
            console.error('Error actualizando cliente:', error);
            throw error;
        }
    }

    static async deleteClient(id) {
        try {
            const token = await this.getAuthToken();
            const headers = { ...this.getHeaders() };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
                method: 'DELETE',
                headers: headers
            });
            return response.status === 204 || response.ok;
        } catch (error) {
            console.error('Error eliminando cliente:', error);
            throw error;
        }
    }

    // Préstamos
    static async getLoans() {
        try {
            const token = await this.getAuthToken();
            const headers = { ...this.getHeaders() };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_BASE_URL}/loans`, {
                headers: headers
            });
            if (!response.ok) return [];
            return response.json();
        } catch (error) {
            console.log('Error obteniendo préstamos:', error);
            return [];
        }
    }

    static async getLoanById(id) {
        try {
            const token = await this.getAuthToken();
            const headers = { ...this.getHeaders() };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_BASE_URL}/loans/${id}`, {
                headers: headers
            });
            if (!response.ok) return null;
            return response.json();
        } catch (error) {
            return null;
        }
    }

    static async createLoan(loanData) {
        try {
            const token = await this.getAuthToken();
            const headers = { ...this.getHeaders() };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_BASE_URL}/loans`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(loanData)
            });
            if (!response.ok) throw new Error('Error creando préstamo');
            return response.json();
        } catch (error) {
            console.error('Error creando préstamo:', error);
            throw error;
        }
    }

    static async updateLoan(id, loanData) {
        try {
            const token = await this.getAuthToken();
            const headers = { ...this.getHeaders() };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_BASE_URL}/loans/${id}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(loanData)
            });
            if (!response.ok) throw new Error('Error actualizando préstamo');
            return response.json();
        } catch (error) {
            console.error('Error actualizando préstamo:', error);
            throw error;
        }
    }

    static async deleteLoan(id) {
        try {
            const token = await this.getAuthToken();
            const headers = { ...this.getHeaders() };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_BASE_URL}/loans/${id}`, {
                method: 'DELETE',
                headers: headers
            });
            return response.status === 204 || response.ok;
        } catch (error) {
            console.error('Error eliminando préstamo:', error);
            throw error;
        }
    }

    // Simulador
    static async simulateLoan(principal, rate, months) {
        try {
            const token = await this.getAuthToken();
            const headers = { ...this.getHeaders() };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_BASE_URL}/loans/simulate`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ principal, rate, months })
            });
            if (!response.ok) throw new Error('Error simulando préstamo');
            return response.json();
        } catch (error) {
            console.error('Error simulando préstamo:', error);
            throw error;
        }
    }

    // Pagos
    static async getPayments() {
        try {
            const token = await this.getAuthToken();
            const headers = { ...this.getHeaders() };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_BASE_URL}/payments`, {
                headers: headers
            });
            if (!response.ok) return [];
            return response.json();
        } catch (error) {
            console.log('Error obteniendo pagos:', error);
            return [];
        }
    }

    static async createPayment(paymentData) {
        try {
            const token = await this.getAuthToken();
            const headers = { ...this.getHeaders() };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_BASE_URL}/payments`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(paymentData)
            });
            if (!response.ok) throw new Error('Error creando pago');
            return response.json();
        } catch (error) {
            console.error('Error creando pago:', error);
            throw error;
        }
    }

    static async deletePayment(id) {
        try {
            const token = await this.getAuthToken();
            const headers = { ...this.getHeaders() };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
                method: 'DELETE',
                headers: headers
            });
            return response.status === 204 || response.ok;
        } catch (error) {
            console.error('Error eliminando pago:', error);
            throw error;
        }
    }
}
