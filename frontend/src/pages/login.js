import React, { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const { login, authenticate } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const success = login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Failed to log in');
      console.error('Login error:', err);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('Google success response:', credentialResponse);
    
    // Decode the JWT credential
    const credential = credentialResponse?.credential;
    if (credential) {
      try {
        const payload = jwtDecode(credential);
        const user = {
          email: payload?.email,
          name: payload?.name || payload?.given_name || 'Google User',
          token: credential,
          timestamp: new Date().toISOString()
        };
        authenticate(user);
        navigate('/dashboard');
        return;
      } catch (err) {
        console.error('Error decoding credential:', err);
        setError('Google login succeeded but failed to decode credential.');
        return;
      }
    }

    const debug = JSON.stringify(credentialResponse || {}, null, 2);
    setError('Google login failed. No credential returned. Debug: ' + debug);
    console.warn('No credential in Google response:', credentialResponse);
  };

  const handleGoogleFailure = (error) => {
    console.error('Google login failed:', error);
    setError('Google login failed. Please try again.');
  };

  const handleForgotPassword = () => {
    setShowForgotModal(true);
    setResetEmail(email);
    setError('');
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!resetEmail) {
      setError('メールアドレスを入力してください');
      return;
    }

    try {
      // Simulate password reset API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResetSuccess(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setResetSuccess(false);
        setResetEmail('');
      }, 3000);
    } catch (err) {
      setError('パスワードリセットに失敗しました。再度お試しください。');
      console.error('Password reset error:', err);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setResetEmail('');
    setResetSuccess(false);
    setError('');
  };

  return (
    <div className="login-container">
      <div className="left">
        <h2 className="title">ログイン</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>メール</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com" 
              required
            />
          </div>

          <div className="input-group">
            <label>パスワード</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <p className="forgot" onClick={handleForgotPassword}>パスワードをお忘れですか</p>

          <button type="submit" className="btn-login">
            ログイン
          </button>
        </form>

        <div className="divider">または</div>

        <div className="custom-google">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            text="signin_with"
            theme="outline"
            size="large"
            logo_alignment="left"
          />
        </div>

        <p className="register">
          まだアカウントがありません？
          <span className="register-link" onClick={() => navigate('/register')}>
            登録する
          </span>
        </p>
      </div>

      <div className="right">
        <div className="dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={closeForgotModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">パスワードリセット</h3>
              <button className="modal-close" onClick={closeForgotModal}>×</button>
            </div>
            
            <div className="modal-body">
              {resetSuccess ? (
                <div className="success-message">
                  <div className="success-icon">✉️</div>
                  <h4>リセットメールを送信しました</h4>
                  <p>{resetEmail}宛にパスワードリセット用のメールを送信しました。<br/>メールをご確認ください。</p>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit}>
                  <div className="input-group">
                    <label>メールアドレス</label>
                    <input 
                      type="email" 
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="email@example.com" 
                      required
                    />
                  </div>
                  
                  {error && <div className="error-message">{error}</div>}
                  
                  <p className="reset-info">
                    登録したメールアドレスを入力してください。<br/>
                    パスワードリセット用のリンクを送信します。
                  </p>
                  
                  <button type="submit" className="btn-reset">
                    リセットメールを送信
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}