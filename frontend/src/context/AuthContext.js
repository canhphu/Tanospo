import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// --- Hàm fix lỗi UTF-8 sai khi lấy từ Google ---
function normalizeString(str) {
  try {
    return decodeURIComponent(escape(str));
  } catch {
    return str;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user từ localStorage khi App mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        let parsedUser = JSON.parse(storedUser);

        // Fix lỗi encoding nếu có tên
        if (parsedUser.name) {
          parsedUser.name = normalizeString(parsedUser.name);
        }

        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // --- Kiểm tra token 24h ---
  const isTokenValid = (user) => {
    if (!user?.timestamp) return false;
    const tokenAge = (new Date() - new Date(user.timestamp)) / (1000 * 60 * 60);
    return tokenAge < 24;
  };

  // --- Login tài khoản TEST ---
  const login = (email, password) => {
    const TEST_EMAIL = 'test@example.com';
    const TEST_PASSWORD = '123456';

    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      const mockUser = {
        email,
        name: email.split('@')[0],
        token: 'mock-test-token',
        timestamp: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    }

    return false; // login fail
  };

  // --- Authenticate dùng cho Google Login ---
  const authenticate = (userObj) => {
    if (!userObj) return;

    const fixedUser = {
      ...userObj,
      name: normalizeString(userObj.name || ''),
      timestamp: new Date().toISOString(),
    };

    setUser(fixedUser);
    try {
      localStorage.setItem('user', JSON.stringify(fixedUser));
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  };

  // --- Logout ---
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // --- Auto logout nếu token hết hạn ---
  useEffect(() => {
    if (user && !isTokenValid(user)) {
      console.debug('Token expired → auto logout');
      logout();
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        authenticate,
        logout,
        isAuthenticated: !!user && isTokenValid(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
