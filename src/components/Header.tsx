import React, { useState } from 'react';
import SocialLogin from './SocialLogin';
import './Header.css';

interface HeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
  userLevel?: number;
  currentPage?: string;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onProfileClick?: () => void;
  onNavigate?: (page: string) => void;
  // 設定関連のprops
  soundEnabled?: boolean;
  onSoundChange?: (enabled: boolean) => void;
  fontSize?: 'small' | 'medium' | 'large';
  onFontSizeChange?: (size: 'small' | 'medium' | 'large') => void;
  // ソーシャルログイン関連のprops
  onGoogleLogin?: () => void;
  onXLogin?: () => void;
  onYahooLogin?: () => void;
  onEmailLogin?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isLoggedIn = false, 
  userName = 'ゲスト', 
  userLevel = 1,
  currentPage = 'dashboard',
  onLoginClick,
  onSignupClick,
  onProfileClick,
  onNavigate,
  soundEnabled = true,
  onSoundChange,
  fontSize = 'medium',
  onFontSizeChange,
  onGoogleLogin,
  onXLogin,
  onYahooLogin,
  onEmailLogin
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showSocialLogin, setShowSocialLogin] = useState(false);
  const [showSignupLogin, setShowSignupLogin] = useState(false);

  const handleNavClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleLoginClick = () => {
    setShowSocialLogin(true);
    onLoginClick?.();
  };

  const handleSocialLoginClose = () => {
    setShowSocialLogin(false);
  };

  const handleSignupClick = () => {
    setShowSignupLogin(true);
    onSignupClick?.();
  };

  const handleSignupLoginClose = () => {
    setShowSignupLogin(false);
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-logo" onClick={() => handleNavClick('dashboard')}>
          <div className="logo-icon">⌨️</div>
          <div className="logo-text">
            <h1>TypingMaster</h1>
            <span className="logo-subtitle">日本語タイピング練習</span>
          </div>
        </div>


        {/* Navigation */}
        <nav className="header-nav">
          <button 
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            ダッシュボード
          </button>
          <button 
            className={`nav-item ${currentPage === 'practice' ? 'active' : ''}`}
            onClick={() => handleNavClick('practice')}
          >
            練習
          </button>
          <button 
            className={`nav-item ${currentPage === 'ranking' ? 'active' : ''}`}
            onClick={() => handleNavClick('ranking')}
          >
            ランキング
          </button>
          <button 
            className={`nav-item ${currentPage === 'achievements' ? 'active' : ''}`}
            onClick={() => handleNavClick('achievements')}
          >
            実績
          </button>
          <button 
            className={`nav-item ${currentPage === 'about' ? 'active' : ''}`}
            onClick={() => handleNavClick('about')}
          >
            使い方
          </button>
        </nav>

        {/* Settings and User Section */}
        <div className="header-user">
          {/* Settings Menu (only show on practice page) */}
          {currentPage === 'practice' && (
            <div className="settings-dropdown-container">
              <button 
                className="settings-button"
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              >
                ⚙️
              </button>
              
              {showSettingsMenu && (
                <div className="settings-dropdown">
                  <div className="dropdown-item">
                    <label className="setting-label">
                      <input
                        type="checkbox"
                        checked={soundEnabled}
                        onChange={(e) => onSoundChange?.(e.target.checked)}
                        className="setting-checkbox"
                      />
                      <span>効果音</span>
                    </label>
                  </div>
                  
                  <div className="dropdown-item">
                    <div className="setting-label">文字サイズ:</div>
                    <div className="font-size-buttons">
                      <button
                        className={fontSize === 'small' ? 'active' : ''}
                        onClick={() => onFontSizeChange?.('small')}
                      >
                        小
                      </button>
                      <button
                        className={fontSize === 'medium' ? 'active' : ''}
                        onClick={() => onFontSizeChange?.('medium')}
                      >
                        中
                      </button>
                      <button
                        className={fontSize === 'large' ? 'active' : ''}
                        onClick={() => onFontSizeChange?.('large')}
                      >
                        大
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {isLoggedIn ? (
            <div className="user-profile" onClick={() => setShowUserMenu(!showUserMenu)}>
              <div className="user-avatar">
                <span className="avatar-text">{userName.charAt(0)}</span>
                <div className="user-level">Lv.{userLevel}</div>
              </div>
              <div className="user-info">
                <span className="user-name">{userName}</span>
                <span className="user-status">オンライン</span>
              </div>
              <div className="dropdown-arrow">▼</div>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-item" onClick={onProfileClick}>
                    <span className="dropdown-icon">👤</span>
                    プロフィール
                  </div>
                  <div className="dropdown-item">
                    <span className="dropdown-icon">⚙️</span>
                    設定
                  </div>
                  <div className="dropdown-item">
                    <span className="dropdown-icon">📊</span>
                    統計
                  </div>
                  <hr className="dropdown-divider" />
                  <div className="dropdown-item logout">
                    <span className="dropdown-icon">🚪</span>
                    ログアウト
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="login-section">
              <button className="login-button" onClick={handleLoginClick}>
                ログイン
              </button>
              <button className="signup-button" onClick={handleSignupClick}>
                新規登録
              </button>
            </div>
          )}
        </div>
      </div>
      
      <SocialLogin
        isVisible={showSocialLogin}
        onClose={handleSocialLoginClose}
        mode="login"
        onGoogleLogin={() => {
          onGoogleLogin?.();
          setShowSocialLogin(false);
        }}
        onXLogin={() => {
          onXLogin?.();
          setShowSocialLogin(false);
        }}
        onYahooLogin={() => {
          onYahooLogin?.();
          setShowSocialLogin(false);
        }}
        onEmailLogin={() => {
          onEmailLogin?.();
          setShowSocialLogin(false);
        }}
        onSignupClick={() => {
          setShowSocialLogin(false);
          setShowSignupLogin(true);
        }}
      />
      
      <SocialLogin
        isVisible={showSignupLogin}
        onClose={handleSignupLoginClose}
        mode="signup"
        onGoogleLogin={() => {
          onGoogleLogin?.();
          setShowSignupLogin(false);
        }}
        onXLogin={() => {
          onXLogin?.();
          setShowSignupLogin(false);
        }}
        onYahooLogin={() => {
          onYahooLogin?.();
          setShowSignupLogin(false);
        }}
        onEmailLogin={() => {
          onEmailLogin?.();
          setShowSignupLogin(false);
        }}
        onLoginClick={() => {
          setShowSignupLogin(false);
          setShowSocialLogin(true);
        }}
      />
    </header>
  );
};

export default Header;