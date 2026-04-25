import { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((authData) => {
    // authData can be either:
    // 1. {user: {...}, token: "..."} from API response
    // 2. Already processed {id, email, name, token}

    let userData;
    if (authData.user && authData.token) {
      // API response format
      userData = { ...authData.user, token: authData.token };
    } else {
      // Already processed
      userData = authData;
    }

    setUser(userData);
    localStorage.setItem('auth', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
