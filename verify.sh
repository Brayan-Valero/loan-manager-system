#!/bin/bash
# Script de verificación de instalación - Loan Manager

echo "================================================"
echo "  VERIFICACIÓN DE INSTALACIÓN - LOAN MANAGER"
echo "================================================"
echo ""

# Verificar estructura del proyecto
echo "✓ Verificando estructura del proyecto..."
if [ -d "backend" ] && [ -d "frontend" ]; then
    echo "  ✅ Estructura correcta encontrada"
else
    echo "  ❌ ERROR: Falta estructura de directorios"
    exit 1
fi

# Verificar Java
echo ""
echo "✓ Verificando Java..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | grep 'version' | head -1 | cut -d'"' -f2)
    echo "  ✅ Java instalado: $JAVA_VERSION"
else
    echo "  ❌ ERROR: Java no encontrado. Requiere Java 17+"
fi

# Verificar Maven
echo ""
echo "✓ Verificando Maven..."
if command -v mvn &> /dev/null; then
    MAVEN_VERSION=$(mvn -v 2>&1 | head -1)
    echo "  ✅ Maven instalado: $MAVEN_VERSION"
else
    echo "  ❌ ERROR: Maven no encontrado"
fi

# Verificar archivos clave
echo ""
echo "✓ Verificando archivos clave..."

FILES=(
    "backend/pom.xml"
    "backend/src/main/resources/application.yml"
    "frontend/index.html"
    "frontend/assets/js/app.js"
    "README.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ FALTA: $file"
    fi
done

# Resumen
echo ""
echo "================================================"
echo "  PRÓXIMOS PASOS:"
echo "================================================"
echo ""
echo "1. CONFIGURAR SUPABASE"
echo "   - Crea una BD en supabase.com"
echo "   - Ejecuta el SQL del README.md"
echo "   - Obtén credenciales (URL, Anon Key, JWT Secret)"
echo ""
echo "2. CONFIGURAR BACKEND"
echo "   - Lee: backend/ENV_CONFIG.md"
echo "   - Edita o establece variables de entorno"
echo "   - Ejecuta: mvn spring-boot:run"
echo ""
echo "3. EJECUTAR FRONTEND"
echo "   - Usa: python -m http.server 3000"
echo "   - O: npx http-server -p 3000"
echo ""
echo "4. ACCEDER"
echo "   - Abre: http://localhost:3000"
echo "   - Configura credenciales Supabase"
echo "   - ¡Regístrate y comienza!"
echo ""
echo "================================================"
