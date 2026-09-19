import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifySession() {
      if (authService.isAuthenticated()) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }
    verifySession();
  }, []);

  async function login(email, password) {
    const loggedInUser = await authService.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}