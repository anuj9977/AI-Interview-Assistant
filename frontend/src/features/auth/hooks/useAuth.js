import { useContext, useEffect } from 'react';
import { AuthContext } from '../auth.context.jsx';
import { login, register, logout, getMe } from '../services/auth.api.js';
import { setStoredToken } from '../../../services/api.js';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        try {

            setLoading(true);
            const data = await login({ email, password });
            setUser(data.user);
            return data;
        }
        catch (error) {
            setUser(null);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        try {
            setLoading(true);
            const data = await register({ username, email, password });
            setUser(data.user);
            return data;
        }
        catch (error) {
            setUser(null);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        try {
            setLoading(true);
            await logout();
            setUser(null);
            return true;
        }
        catch (error) {
            throw error;
        }
        finally {
            setLoading(false);
        }
       
    }

     useEffect(() => {
            const getAndSetUser = async () => {
                try {
                    const data = await getMe();

                    // Safe check: data aur user dono maujood hain ya nahi
                    if (data && data.user) {
                        setUser(data.user);
                    } else {
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Auth error:", error.message);
                    setStoredToken(null);
                    setUser(null); // Error aane par user ko null set karein
                } finally {
                    // Yeh hamesha chalega, chahe success ho ya error
                    setLoading(false);
                }
            }

            getAndSetUser();
        }, []);




    return { user, loading, handleLogin, handleRegister, handleLogout };




}
