// Gestión de autenticación
class Auth {
    static async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data.session;
    }

    static async register(email, password) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
        if (error) throw error;
        return data.user;
    }

    static async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    static async getCurrentUser() {
        const { data } = await supabase.auth.getSession();
        return data.session?.user;
    }

    static async onAuthStateChange(callback) {
        supabase.auth.onAuthStateChange((event, session) => {
            callback(session?.user, event);
        });
    }
}
