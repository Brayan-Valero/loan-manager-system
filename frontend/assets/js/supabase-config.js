// Configuración de Supabase
const SUPABASE_URL = 'https://kjevzsclagnginnyfgao.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqZXZ6c2NsYWduZ2lubnlmZ2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0ODA2MDksImV4cCI6MTc2NjAxNjYwOX0.VtQ0_1zABV5kDDPvNh0VyZkm_gJwCYrZ0a0qJ8k_Yd8';

let supabase = null;

console.log('Supabase config loaded');

// Inicializar Supabase cuando esté disponible
function initSupabase() {
    try {
        if (!window.supabase) {
            console.error('window.supabase no está disponible');
            return false;
        }
        if (!window.supabase.createClient) {
            console.error('window.supabase.createClient no está disponible');
            return false;
        }
        
        const { createClient } = window.supabase;
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✓ Supabase inicializado correctamente');
        return true;
    } catch (error) {
        console.error('Error inicializando Supabase:', error);
        return false;
    }
}

// Validar configuración
function validateSupabaseConfig() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.warn('Supabase no configurado correctamente');
        return false;
    }
    return true;
}
