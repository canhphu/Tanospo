import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (formData.password.length < 6) {
      setError('パスワードは6文字以上にしてください');
      return;
    }

    // In a real app, you would send this to your backend
    try {
      // Mock registration - in a real app, you would call an API here
      const user = {
        email: formData.email,
        name: formData.email.split('@')[0],
        token: 'mock-jwt-token'
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err) {
      setError('登録に失敗しました。もう一度お試しください。');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="register-container">
      <div className="left">
        <h2 className="title">登録</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>メール</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com" 
              required
            />
          </div>

          <div className="input-group">
            <label>パスワード</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>パスワード再入力</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-register">
            登録する
          </button>
        </form>

        <p className="login-link">
          すでにアカウントをお持ちですか？
          <Link to="/login" className="link">
            ログインする
          </Link>
        </p>     
      </div>

      <div className="right"></div>
    </div>
  );
}
