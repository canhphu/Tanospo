import React, { useState } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "../styles/Login.css";

// Helper to decode JWT credential returned by Google
const decodeJwt = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (e) {
    return null;
  }
};

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
    // If Google returns an ID token in 'credential', decode it and finish
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

    // Otherwise, Google may return an access_token — use it to fetch userinfo
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
        console.error('Error fetching userinfo with access_token:', err);
        setError('Google login succeeded but failed to fetch profile. See console.');
        return;
      }
    }

    const debug = JSON.stringify(credentialResponse || {}, null, 2);
    setError('Google login failed. No credential or access_token returned. Debug: ' + debug);
    console.warn('No credential or access_token in Google response:', credentialResponse);
  };

  const handleGoogleFailure = (error) => {
    console.error('Google login failed:', error);
    setError('Google login failed. Please try again.');
  };

  // Hook to trigger Google OAuth with a custom button
  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleFailure,
    flow: 'implicit',
    scope: 'openid profile email',
    prompt: 'consent'
  });

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
          <button
            className="btn-google"
            onClick={() => googleLogin()}
            type="button"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="google"
              style={{ width: 18, height: 18, marginRight: 8 }}
            />
            Googleでログイン
          </button>
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
