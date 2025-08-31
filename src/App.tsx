import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TypingPractice from './components/TypingPractice';
import HowToUse from './components/HowToUse';
import './App.css';

type PracticeCategory = 'general' | 'news' | 'yamanashi' | 'literature' | 'it' | 'custom';
type PracticeLength = 'short' | 'long';

function App() {
  const [currentCategory, setCurrentCategory] = useState<PracticeCategory>('general');
  const [currentLength, setCurrentLength] = useState<PracticeLength>('short');
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  const handleCategoryChange = (category: PracticeCategory) => {
    setCurrentCategory(category);
  };

  const handleLengthChange = (length: PracticeLength) => {
    setCurrentLength(length);
  };

  const handleStartPractice = () => {
    setCurrentPage('practice');
  };


  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login initiated');
    setIsLoggedIn(true);
  };

  const handleXLogin = () => {
    // TODO: Implement X (Twitter) OAuth
    console.log('X login initiated');
    setIsLoggedIn(true);
  };

  const handleYahooLogin = () => {
    // TODO: Implement Yahoo! JAPAN OAuth
    console.log('Yahoo! JAPAN login initiated');
    setIsLoggedIn(true);
  };

  const handleEmailLogin = () => {
    // TODO: Implement email login form
    console.log('Email login initiated');
    setIsLoggedIn(true);
  };

  const handleSignup = () => {
    console.log('Signup initiated');
  };

  // Mock user stats for demonstration
  const mockUserStats = {
    level: 15,
    exp: 750,
    maxExp: 1000,
    todayPracticeTime: 25, // minutes
    consecutiveDays: 7,
    bestWPM: 85,
    averageAccuracy: 94.5,
    totalPracticeTime: 120, // hours
    completedLessons: 45,
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            userStats={mockUserStats}
            dailyGoal={30}
            onStartPractice={handleStartPractice}
          />
        );
      case 'practice':
        return (
          <TypingPractice 
            category={currentCategory}
            length={currentLength}
            onCategoryChange={handleCategoryChange}
            onLengthChange={handleLengthChange}
            soundEnabled={soundEnabled}
            fontSize={fontSize}
          />
        );
      case 'ranking':
        return (
          <div className="page-container">
            <h2>ランキング</h2>
            <p>ランキングページは実装予定です。</p>
          </div>
        );
      case 'achievements':
        return (
          <div className="page-container">
            <h2>実績</h2>
            <p>実績ページは実装予定です。</p>
          </div>
        );
      case 'about':
        return <HowToUse />;
      default:
        return (
          <Dashboard 
            userStats={mockUserStats}
            dailyGoal={30}
            onStartPractice={handleStartPractice}
          />
        );
    }
  };

  return (
    <div className="App">
      <Header 
        isLoggedIn={isLoggedIn}
        userName="田中太郎"
        userLevel={mockUserStats.level}
        currentPage={currentPage}
        onLoginClick={handleLogin}
        onSignupClick={handleSignup}
        onNavigate={handleNavigation}
        soundEnabled={soundEnabled}
        onSoundChange={setSoundEnabled}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        onGoogleLogin={handleGoogleLogin}
        onXLogin={handleXLogin}
        onYahooLogin={handleYahooLogin}
        onEmailLogin={handleEmailLogin}
      />
      
      {renderCurrentPage()}
    </div>
  );
}

export default App;
