#!/bin/bash
# Checklist de Setup - Loan Manager

echo "╔════════════════════════════════════════════╗"
echo "║  LOAN MANAGER - CHECKLIST DE CONFIGURACIÓN ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Funciones
check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2 (NO ENCONTRADO)"
        return 1
    fi
}

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2 (FALTA)"
        return 1
    fi
}

# Sección 1: Requisitos del Sistema
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}1. REQUISITOS DEL SISTEMA${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""

check_command "java" "Java 17 o superior"
check_command "mvn" "Maven 3.8 o superior"
check_command "python" "Python 3.x" || check_command "python3" "Python 3.x"

echo ""

# Sección 2: Archivos del Backend
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}2. ARCHIVOS DEL BACKEND${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""

BACKEND_FILES=(
    "backend/pom.xml:Maven POM"
    "backend/src/main/java/com/loanmanager/LoanManagerApplication.java:Clase Principal"
    "backend/src/main/resources/application.yml:Configuración"
    "backend/src/main/java/com/loanmanager/entity/Client.java:Entidad Client"
    "backend/src/main/java/com/loanmanager/entity/Loan.java:Entidad Loan"
    "backend/src/main/java/com/loanmanager/entity/Payment.java:Entidad Payment"
    "backend/src/main/java/com/loanmanager/controller/ClientController.java:Cliente Controller"
    "backend/src/main/java/com/loanmanager/controller/LoanController.java:Loan Controller"
    "backend/src/main/java/com/loanmanager/controller/PaymentController.java:Payment Controller"
    "backend/src/main/java/com/loanmanager/service/ClientService.java:Cliente Service"
    "backend/src/main/java/com/loanmanager/service/LoanService.java:Loan Service"
    "backend/src/main/java/com/loanmanager/service/PaymentService.java:Payment Service"
    "backend/src/main/java/com/loanmanager/security/JWTUtil.java:JWT Util"
    "backend/src/main/java/com/loanmanager/security/JWTAuthenticationFilter.java:JWT Filter"
    "backend/src/main/java/com/loanmanager/config/SecurityConfig.java:Security Config"
)

for file_pair in "${BACKEND_FILES[@]}"; do
    file="${file_pair%:*}"
    name="${file_pair#*:}"
    check_file "$file" "$name"
done

echo ""

# Sección 3: Archivos del Frontend
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}3. ARCHIVOS DEL FRONTEND${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""

FRONTEND_FILES=(
    "frontend/index.html:Página Principal"
    "frontend/assets/css/styles.css:Estilos CSS"
    "frontend/assets/js/app.js:Aplicación Principal"
    "frontend/assets/js/api.js:Cliente API"
    "frontend/assets/js/auth.js:Autenticación"
    "frontend/assets/js/utils.js:Utilidades"
    "frontend/assets/js/supabase-config.js:Config Supabase"
)

for file_pair in "${FRONTEND_FILES[@]}"; do
    file="${file_pair%:*}"
    name="${file_pair#*:}"
    check_file "$file" "$name"
done

echo ""

# Sección 4: Documentación
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}4. DOCUMENTACIÓN${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""

DOC_FILES=(
    "README.md:Guía Principal"
    "QUICK_START.md:Inicio Rápido"
    "WINDOWS_SETUP.md:Guía Windows"
    "PROJECT_SUMMARY.md:Resumen Técnico"
    "DEPLOYMENT.md:Deployment"
    "backend/ENV_CONFIG.md:Config Variables"
    "PROYECTO_COMPLETADO.md:Estado Final"
)

for file_pair in "${DOC_FILES[@]}"; do
    file="${file_pair%:*}"
    name="${file_pair#*:}"
    check_file "$file" "$name"
done

echo ""

# Sección 5: Credenciales Supabase
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}5. CREDENCIALES SUPABASE${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}⚠ Por favor, verifica que tengas:${NC}"
echo ""
echo "  1. URL del Proyecto:"
echo "     ${YELLOW}https://xxxx.supabase.co${NC}"
echo ""
echo "  2. Clave Anon (Pública):"
echo "     ${YELLOW}eyJhbGci...${NC}"
echo ""
echo "  3. JWT Secret:"
echo "     ${YELLOW}eyJhbGci...${NC}"
echo ""

read -p "¿Tienes las credenciales de Supabase? (s/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${YELLOW}Obtén las credenciales de: https://supabase.com${NC}"
fi

echo ""

# Sección 6: Resumen
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}RESUMEN GENERAL${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""

echo -e "${GREEN}✓ Proyecto Loan Manager${NC}"
echo -e "${GREEN}✓ Backend Spring Boot 3${NC}"
echo -e "${GREEN}✓ Frontend HTML/CSS/JS${NC}"
echo -e "${GREEN}✓ Documentación Completa${NC}"
echo ""

echo -e "${YELLOW}PRÓXIMOS PASOS:${NC}"
echo ""
echo "1. ${BLUE}Configurar Base de Datos${NC}"
echo "   Ejecuta el SQL en Supabase (ver README.md)"
echo ""
echo "2. ${BLUE}Configurar Variables de Entorno${NC}"
echo "   Lee: backend/ENV_CONFIG.md"
echo ""
echo "3. ${BLUE}Compilar Backend${NC}"
echo "   cd backend && mvn clean install"
echo ""
echo "4. ${BLUE}Ejecutar Backend${NC}"
echo "   mvn spring-boot:run"
echo ""
echo "5. ${BLUE}Ejecutar Frontend${NC}"
echo "   cd frontend && python -m http.server 3000"
echo ""
echo "6. ${BLUE}Acceder a la Aplicación${NC}"
echo "   http://localhost:3000"
echo ""

echo "═══════════════════════════════════════════"
echo -e "${GREEN}¡TODO LISTO PARA COMENZAR!${NC}"
echo "═══════════════════════════════════════════"
