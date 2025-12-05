# Conexión a Supabase

## Configuración de la Base de Datos

El sistema está conectado a **Supabase PostgreSQL**. A continuación se detalla cómo está configurada la conexión.

### Backend (Spring Boot)

El backend utiliza las siguientes variables de configuración en `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://db.kjevzsclagnginnyfgao.subabase.co:5432/postgres
    username: postgres
    password: Brayan10_
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

app:
  jwt:
    secret: a347b4c6-5431-4e0d-99bf-2e921a79159c
```

#### Parámetros:
- **URL**: Servidor PostgreSQL de Supabase
- **Usuario**: postgres
- **Contraseña**: Brayan10_
- **JWT Secret**: Token para validar autenticación con Supabase

### Frontend (JavaScript)

El frontend obtiene la configuración de Supabase desde `localStorage`. En la primera carga, el sistema busca:

```javascript
const SUPABASE_URL = localStorage.getItem('SUPABASE_URL');
const SUPABASE_ANON_KEY = localStorage.getItem('SUPABASE_ANON_KEY');
```

**Nota**: Actualmente estas credenciales están establecidas en el navegador y no requieren configuración manual.

### Tablas de Base de Datos

El sistema utiliza tres tablas principales:

#### 1. `clients` (Clientes)
```sql
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
```

#### 2. `loans` (Préstamos)
```sql
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
```

#### 3. `payments` (Pagos)
```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    loan_id INTEGER NOT NULL REFERENCES loans(id),
    amount NUMERIC(12, 2) NOT NULL,
    payment_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Índices para Optimización
```sql
CREATE INDEX idx_loans_client ON loans(client_id);
CREATE INDEX idx_payments_loan ON payments(loan_id);
```

## Autenticación

El sistema utiliza **Supabase Auth** con JWT (JSON Web Tokens):

1. **Login**: El usuario se autentica en Supabase Auth
2. **Token JWT**: Se obtiene el token de sesión
3. **Validación Backend**: El token se valida en cada solicitud API mediante `JWTAuthenticationFilter`

### Configuración de Seguridad

- **CORS**: Configurado para aceptar solicitudes desde `http://localhost:3000`
- **Session Management**: Stateless (sin almacenamiento de sesión en servidor)
- **Token Validation**: En cada request se valida el Bearer token

## Requisitos para Ejecución

Para que el sistema funcione correctamente:

1. **Base de Datos**: Las tablas deben estar creadas en Supabase
2. **Backend**: Java 17 y Maven instalados
3. **Frontend**: Navegador moderno con soporte para ES6+

## Verificación de Conexión

Para verificar que todo está correctamente configurado:

1. Inicia el backend: `mvn spring-boot:run`
2. Inicia el frontend: `python -m http.server 3000`
3. Abre `http://localhost:3000` en tu navegador
4. Intenta hacer login con un usuario registrado en Supabase

Si ves el dashboard, la conexión es exitosa.
