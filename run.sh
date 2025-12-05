#!/bin/bash
# Script para ejecutar la aplicación completa

echo "================================================"
echo "  LOAN MANAGER - INICIANDO APLICACIÓN"
echo "================================================"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si estamos en la raíz del proyecto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "ERROR: Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Opción 1: Ejecutar solo backend
if [ "$1" = "backend" ]; then
    echo -e "${GREEN}Iniciando Backend...${NC}"
    cd backend
    echo "Compilando..."
    mvn clean install
    echo -e "${GREEN}Ejecutando Spring Boot en puerto 8080...${NC}"
    mvn spring-boot:run
    exit 0
fi

# Opción 2: Ejecutar solo frontend
if [ "$1" = "frontend" ]; then
    echo -e "${GREEN}Iniciando Frontend...${NC}"
    cd frontend
    if command -v python3 &> /dev/null; then
        echo -e "${GREEN}Servidor disponible en http://localhost:3000${NC}"
        python3 -m http.server 3000
    elif command -v python &> /dev/null; then
        echo -e "${GREEN}Servidor disponible en http://localhost:3000${NC}"
        python -m http.server 3000
    else
        echo -e "${YELLOW}Abre index.html en tu navegador manualmente${NC}"
    fi
    exit 0
fi

# Opción 3: Ejecutar ambos (requiere 2 terminales o tmux)
echo -e "${YELLOW}Modo dual: Backend en puerto 8080, Frontend en puerto 3000${NC}"
echo ""
echo "1. Abre otra terminal en la misma carpeta"
echo "2. Ejecuta: bash run.sh frontend"
echo ""
echo -e "${GREEN}Iniciando Backend...${NC}"
cd backend
mvn clean install
mvn spring-boot:run
