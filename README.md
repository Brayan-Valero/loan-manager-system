# Loan Manager - Sistema de Gestión de Préstamos

Sistema completo para que prestamistas gestionen de forma profesional todos sus préstamos, clientes, pagos y generar recibos en PDF.

## 🚀 Características

✅ **Autenticación segura** con Supabase Auth  
✅ **Gestión de clientes** - Registrar y actualizar información de clientes  
✅ **Gestión de préstamos** - Crear y monitorear préstamos con tasas de interés configurables  
✅ **Registro de pagos** - Registrar pagos y actualizar saldos automáticamente  
✅ **Simulador de cuotas** - Calcular cuotas antes de otorgar préstamos  
✅ **Generación de PDFs** - Descargar documentos de préstamos y recibos de pago  
✅ **Panel de control** - Vista general con estadísticas de préstamos  
✅ **Historial completo** - Todas las transacciones registradas  
✅ **API REST** - Backend robusto con Spring Boot y PostgreSQL  

## 📋 Tecnologías

### Backend
- **Framework**: Spring Boot 3.2.0
- **Lenguaje**: Java 17
- **Build**: Maven
- **BD**: PostgreSQL (Supabase)
- **Autenticación**: JWT (Supabase Auth)
- **API**: REST Controllers

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos responsivos
- **JavaScript (Vanilla)** - Sin dependencias pesadas
- **jsPDF** - Generación de PDFs
- **Supabase Client** - Autenticación

## 📦 Estructura del Proyecto

```
loan-manager-system/
├── backend/                          # Aplicación Spring Boot
│   ├── pom.xml                      # Dependencias Maven
│   └── src/main/java/com/loanmanager/
│       ├── LoanManagerApplication.java
│       ├── controller/              # REST Controllers
│       ├── entity/                  # Modelos JPA
│       ├── repository/              # Repositorios JPA
│       ├── service/                 # Lógica de negocio
│       ├── config/                  # Configuración
│       └── security/                # Seguridad JWT
│   └── src/main/resources/
│       └── application.yml          # Configuración
│
└── frontend/                         # Aplicación web
    ├── index.html                   # Página principal
    └── assets/
        ├── css/
        │   └── styles.css           # Estilos
        └── js/
            ├── app.js               # Aplicación principal
            ├── api.js               # Cliente API REST
            ├── auth.js              # Gestión de autenticación
            ├── utils.js             # Utilidades
            └── supabase-config.js   # Configuración Supabase
```

## 🔧 Requisitos Previos

### Backend
- Java 17 o superior
- Maven 3.8.0 o superior
- PostgreSQL (a través de Supabase)

### Frontend
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Servidor HTTP simple

### Credenciales Supabase
- URL del proyecto
- Clave Anon (Pública)
- JWT Secret (para backend)

## 📝 Instalación y Configuración

### 1️⃣ Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto
2. Ve a **Settings > API** para obtener:
   - `URL del Proyecto` (ej: `https://xxxx.supabase.co`)
   - `Clave Anon Pública`
   - `JWT Secret` (para el backend)

3. En **SQL Editor**, ejecuta el siguiente script para crear las tablas:

```sql
-- Tabla de clientes
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    document_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de préstamos
CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id),
    principal_amount NUMERIC(12, 2) NOT NULL,
    interest_rate NUMERIC(5, 2) NOT NULL,
    number_of_installments INTEGER NOT NULL,
    monthly_installment NUMERIC(12, 2) NOT NULL,
    start_date DATE NOT NULL,
    due_date DATE NOT NULL,
    balance NUMERIC(12, 2) NOT NULL,
    paid_installments INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pagos
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    loan_id INTEGER NOT NULL REFERENCES loans(id),
    amount NUMERIC(12, 2) NOT NULL,
    payment_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejor rendimiento
CREATE INDEX idx_loans_client ON loans(client_id);
CREATE INDEX idx_payments_loan ON payments(loan_id);
```

### 2️⃣ Configurar y ejecutar el Backend

```bash
cd backend

# Editar application.yml con tus credenciales
# Reemplaza los valores en src/main/resources/application.yml:
# DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD de Supabase
# JWT_SECRET con el JWT Secret de Supabase

# Compilar y ejecutar
mvn clean install
mvn spring-boot:run
```

El backend estará disponible en `http://localhost:8080`

### 3️⃣ Configurar y ejecutar el Frontend

```bash
cd frontend

# Si tienes Python 3 instalado:
python -m http.server 3000

# O si tienes Node.js:
npx http-server -p 3000

# O abre directamente index.html en el navegador
```

El frontend estará disponible en `http://localhost:3000`

### 4️⃣ Primera vez usando la aplicación

1. Abre `http://localhost:3000` en tu navegador
2. Ve a la pestaña **"Configurar"**
3. Ingresa:
   - **URL de Supabase**: `https://tu-proyecto.supabase.co`
   - **Clave Anon**: Tu clave pública
4. Haz clic en "Guardar Configuración"
5. Recarga la página
6. Regístrate con tu correo y contraseña
7. ¡Listo! Comienza a usar el sistema

## 🔐 Variables de Entorno - Backend

Crea un archivo `.env` en la raíz del backend o establece las siguientes variables:

```env
# Supabase Database
DB_HOST=tu-proyecto.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu-password-de-supabase

# JWT
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📡 Endpoints de la API

### Clientes
```
GET    /api/clients              - Obtener todos los clientes
GET    /api/clients/{id}         - Obtener cliente por ID
POST   /api/clients              - Crear nuevo cliente
PUT    /api/clients/{id}         - Actualizar cliente
DELETE /api/clients/{id}         - Eliminar cliente
```

### Préstamos
```
GET    /api/loans                - Obtener todos los préstamos
GET    /api/loans/{id}           - Obtener préstamo por ID
POST   /api/loans                - Crear nuevo préstamo
PUT    /api/loans/{id}           - Actualizar préstamo
DELETE /api/loans/{id}           - Eliminar préstamo
POST   /api/loans/simulate       - Simular cálculo de cuota
```

### Pagos
```
GET    /api/payments             - Obtener todos los pagos
GET    /api/payments/{id}        - Obtener pago por ID
POST   /api/payments             - Registrar nuevo pago
DELETE /api/payments/{id}        - Eliminar pago
```

## 🖥️ Uso de la Aplicación

### Dashboard
Vista general con estadísticas:
- Total de clientes
- Préstamos activos
- Saldo total pendiente
- Últimos préstamos registrados

### Gestión de Clientes
- Registrar nuevos clientes
- Editar información
- Eliminar clientes
- Ver historial de préstamos

### Gestión de Préstamos
- Crear préstamos con tasa de interés
- Definir número de cuotas
- Registrar pagos parciales
- Ver estado actual (saldo, cuotas pagadas)

### Simulador
- Calcular cuota mensual antes de otorgar
- Ver total a pagar e interés total
- Ajustar parámetros fácilmente

### Generación de PDFs
- Descargar documentos de préstamos
- Descargar recibos de pago
- Compartir con clientes

## 🔒 Seguridad

- ✅ Autenticación JWT con Supabase
- ✅ Validación de tokens en cada solicitud
- ✅ CORS configurado para producción
- ✅ Contraseñas encriptadas en Supabase
- ✅ Solo el prestamista tiene acceso
- ✅ Base de datos encriptada en tránsito

## 📱 Responsivo

La aplicación funciona perfectamente en:
- Computadoras de escritorio
- Tablets
- Dispositivos móviles

## 🐛 Solución de Problemas

### Error de conexión a BD
- Verifica que los datos de Supabase sean correctos
- Asegúrate de que las tablas existan
- Revisa que el JWT_SECRET coincida

### Errores de autenticación
- Limpia el localStorage del navegador
- Vuelve a ingresar las credenciales de Supabase
- Verifica que la Clave Anon sea correcta

### Frontend no carga datos
- Abre la consola (F12) para ver errores
- Verifica que el backend esté ejecutándose
- Asegúrate de tener autenticación activa

## 📚 Documentación Adicional

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Spring Boot](https://spring.io/projects/spring-boot)
- [Documentación de jsPDF](https://github.com/parallax/jsPDF)

## 📧 Soporte

Para soporte técnico o reportar errores, contacta al desarrollador.

## 📄 Licencia

Este proyecto es de uso exclusivo del prestamista.

---

**Versión**: 1.0.0  
**Última actualización**: 5 de diciembre de 2025
