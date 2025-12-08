// Gestión de autenticación con Supabase
class Auth {
    static async login(email, password) {
        try {
            if (!supabase) {
                throw new Error('Supabase no inicializado');
            }
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
            return data.session;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    static async register(email, password) {
        try {
            if (!supabase) {
                throw new Error('Supabase no inicializado');
            }
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });
            if (error) throw error;
            return data.user;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }

    static async logout() {
        try {
            if (!supabase) {
                throw new Error('Supabase no inicializado');
            }
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('Error en logout:', error);
            throw error;
        }
    }

    static async getCurrentUser() {
        try {
            if (!supabase) {
                return null;
            }
            const { data } = await supabase.auth.getSession();
            return data.session?.user || null;
        } catch (error) {
            console.error('Error obteniendo usuario actual:', error);
            return null;
        }
    }

    static async onAuthStateChange(callback) {
        try {
            if (!supabase) {
                console.error('Supabase no inicializado');
                return;
            }
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                callback(session?.user || null, event);
            });
            return subscription;
        } catch (error) {
            console.error('Error en onAuthStateChange:', error);
        }
    }

    static async getAuthToken() {
        try {
            if (!supabase) {
                throw new Error('Supabase no inicializado');
            }
            const { data } = await supabase.auth.getSession();
            return data.session?.access_token || null;
        } catch (error) {
            console.error('Error obteniendo token:', error);
            return null;
        }
    }
}
