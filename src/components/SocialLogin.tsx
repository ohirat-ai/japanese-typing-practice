import React from 'react';
import './SocialLogin.css';

interface SocialLoginProps {
  isVisible: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onGoogleLogin: () => void;
  onXLogin: () => void;
  onYahooLogin: () => void;
  onEmailLogin: () => void;
  onSignupClick?: () => void;
  onLoginClick?: () => void;
}

const SocialLogin: React.FC<SocialLoginProps> = ({
  isVisible,
  onClose,
  mode,
  onGoogleLogin,
  onXLogin,
  onYahooLogin,
  onEmailLogin,
  onSignupClick,
  onLoginClick
}) => {
  if (!isVisible) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="social-login-overlay" onClick={handleBackdropClick}>
      <div className="social-login-modal">
        <div className="social-login-header">
          <h3>{mode === 'login' ? 'ログイン' : '新規登録'}</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="social-login-content">
          <p className="social-login-subtitle">
            ソーシャルアカウントで{mode === 'login' ? 'ログイン' : '新規登録'}
          </p>
          
          <div className="social-buttons">
            <button className="social-button google-button" onClick={onGoogleLogin}>
              <div className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              Google で {mode === 'login' ? 'ログイン' : '新規登録'}
            </button>

            <button className="social-button x-button" onClick={onXLogin}>
              <div className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              X（旧Twitter）で {mode === 'login' ? 'ログイン' : '新規登録'}
            </button>

            <button className="social-button yahoo-button" onClick={onYahooLogin}>
              <div className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#FF0033" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                  <path fill="white" d="M8.5 7h2l2 5.5L14.5 7h2l-3.5 8v3h-2v-3L8.5 7z"/>
                </svg>
              </div>
              Yahoo! JAPAN で {mode === 'login' ? 'ログイン' : '新規登録'}
            </button>
          </div>

          <div className="login-divider">
            <span>または</span>
          </div>

          <button className="email-login-button" onClick={onEmailLogin}>
            <div className="email-icon">📧</div>
            メールアドレスで{mode === 'login' ? 'ログイン' : '新規登録'}
          </button>

          <div className="signup-link">
            {mode === 'login' ? (
              <button className="switch-mode-button" onClick={onSignupClick}>
                アカウントをお持ちでない方はこちら
              </button>
            ) : (
              <button className="switch-mode-button" onClick={onLoginClick}>
                既にアカウントをお持ちの方はこちら
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLogin;