import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user từ localStorage khi App mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Hàm kiểm tra tính hợp lệ của token (dựa trên thời gian 24 giờ)
  const isTokenValid = (user) => {
    if (!user?.timestamp) return false;
    // Tính tuổi token theo giờ
    const tokenAge = (new Date() - new Date(user.timestamp)) / (1000 * 60 * 60); 
    return tokenAge < 24;
  };

  // Hàm login đã được sửa đổi
  const login = (email, password) => {
    const TEST_EMAIL = 'test@example.com';
    const TEST_PASSWORD = '123456';

    // 🔑 Bước 1: Kiểm tra tài khoản test
    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      // 🔑 Bước 2: Tạo đối tượng người dùng mô phỏng cho tài khoản test
      const mockUser = {
        email,
        name: email.split('@')[0], // name là 'test'
        token: 'mock-test-token',
        timestamp: new Date().toISOString(), // Dùng để kiểm tra thời gian hết hạn
      };
      
      // 🔑 Bước 3: Lưu và thiết lập trạng thái
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true; // Đăng nhập thành công
    }
    
    // Nếu không phải tài khoản test, bạn có thể thêm logic gọi API ở đây.
    // Hiện tại, tôi sẽ trả về false cho bất kỳ tài khoản nào khác.
    console.warn('Đăng nhập thất bại: Tài khoản hoặc mật khẩu không hợp lệ.');
    return false; // Đăng nhập thất bại
  };

  // Hàm authenticate: dùng để thiết lập user từ OAuth provider (Google)
  const authenticate = (userObj) => {
    if (!userObj) return;
    setUser(userObj);
    try {
      localStorage.setItem('user', JSON.stringify(userObj));
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  };

  // Hàm logout đã sẵn sàng và hoạt động tốt
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Tự động logout nếu token hết hạn (sau 24 giờ)
  useEffect(() => {
    if (user && !isTokenValid(user)) {
      console.debug('Token expired, auto-logging out.');
      logout();
    }
  }, [user]); // Bổ sung [user] vào dependency array

  // 📦 Cung cấp context
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        authenticate,
        logout,
        isAuthenticated: !!user && isTokenValid(user), // Kiểm tra cả user tồn tại VÀ token còn hiệu lực
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};