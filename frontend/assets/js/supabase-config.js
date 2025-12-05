// Configuración de Supabase
const SUPABASE_URL = localStorage.getItem('SUPABASE_URL') || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = localStorage.getItem('SUPABASE_ANON_KEY') || 'your-anon-key';

const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Validar configuración
function validateSupabaseConfig() {
    if (SUPABASE_URL.includes('your-project') || SUPABASE_ANON_KEY.includes('your-anon-key')) {
        console.warn('Supabase no configurado. Por favor, establece las credenciales.');
        return false;
    }
    return true;
}
