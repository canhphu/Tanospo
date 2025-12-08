
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import "../styles/Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { authenticate } = useAuth();

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
      
      authenticate(user);
      navigate('/dashboard');
    } catch (err) {
      setError('登録に失敗しました。もう一度お試しください。');
      console.error('Registration error:', err);
    }
  };

  // Decode JWT credential returned by Google
  const decodeJwt = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (e) {
      console.error('Failed to decode JWT', e);
      return null;
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    // Prefer ID token if present
    const credential = credentialResponse?.credential;
    if (credential) {
      const profile = decodeJwt(credential);
      const user = {
        email: profile?.email,
        name: profile?.name || profile?.given_name || 'Google User',
        token: credential,
        timestamp: new Date().toISOString()
      };
      authenticate(user);
      navigate('/dashboard');
      return;
    }

    // If access_token is returned, fetch userinfo
    const accessToken = credentialResponse?.access_token;
    if (accessToken) {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!res.ok) throw new Error('Failed to fetch userinfo: ' + res.status);
        const profile = await res.json();
        const user = {
          email: profile?.email,
          name: profile?.name || profile?.given_name || 'Google User',
          token: accessToken,
          timestamp: new Date().toISOString()
        };
        authenticate(user);
        navigate('/dashboard');
        return;
      } catch (err) {
        console.error('Error fetching userinfo with access_token (signup):', err);
        setError('Google signup succeeded but failed to fetch profile. Please try again.');
        return;
      }
    }

    setError('Google authentication failed. No credential or access_token returned.');
  };

  const handleGoogleFailure = (err) => {
    console.error('Google signup failed', err);
    setError('Google signup failed. Please try again.');
  };

  // Hook to trigger Google OAuth with a custom button
  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleFailure,
    flow: 'implicit',
    scope: 'openid profile email',
    prompt: 'consent'
  });

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

        <div className="divider">または</div>

        <button className="btn-google" onClick={() => googleLogin()} type="button">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="google"
            style={{ width: 18, height: 18, marginRight: 8 }}
          />
          Googleで登録
        </button>

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
