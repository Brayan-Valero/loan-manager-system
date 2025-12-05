// Utilidades
class Utils {
    static formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2
        }).format(amount);
    }

    static formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-CO');
    }

    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    static formatNumber(number, decimals = 2) {
        return parseFloat(number).toFixed(decimals);
    }

    static calculateMonthlyInstallment(principal, annualRate, months) {
        const monthlyRate = annualRate / 12 / 100;
        if (monthlyRate === 0) return principal / months;
        return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
               (Math.pow(1 + monthlyRate, months) - 1);
    }
}

// Sistema de notificaciones mejorado
const Notification = {
    success: (msg) => Utils.showNotification(msg, 'success'),
    error: (msg) => Utils.showNotification(msg, 'error'),
    warning: (msg) => Utils.showNotification(msg, 'warning'),
    info: (msg) => Utils.showNotification(msg, 'info')
};
