import React from 'react';
import './Dashboard.css';

interface UserStats {
  level: number;
  exp: number;
  maxExp: number;
  todayPracticeTime: number; // minutes
  consecutiveDays: number;
  bestWPM: number;
  averageAccuracy: number;
  totalPracticeTime: number; // hours
  completedLessons: number;
}

interface DashboardProps {
  userStats: UserStats;
  dailyGoal: number; // minutes
  onStartPractice: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userStats, dailyGoal, onStartPractice }) => {
  const expPercentage = (userStats.exp / userStats.maxExp) * 100;
  const dailyGoalPercentage = Math.min((userStats.todayPracticeTime / dailyGoal) * 100, 100);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}分`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}時間${mins > 0 ? `${mins}分` : ''}`;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h2>おかえりなさい！</h2>
            <p>今日も一緒にタイピングスキルを向上させましょう</p>
          </div>
          <button className="main-cta-button" onClick={onStartPractice}>
            <span className="cta-icon">🚀</span>
            今すぐ練習を始める
            <span className="cta-arrow">→</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          
          {/* Level Progress */}
          <div className="stat-card level-card">
            <div className="stat-header">
              <span className="stat-icon">⭐</span>
              <h3>レベル {userStats.level}</h3>
            </div>
            <div className="level-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${expPercentage}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {userStats.exp} / {userStats.maxExp} EXP
              </span>
            </div>
            <div className="level-info">
              次のレベルまで {userStats.maxExp - userStats.exp} EXP
            </div>
          </div>

          {/* Daily Goal */}
          <div className="stat-card goal-card">
            <div className="stat-header">
              <span className="stat-icon">🎯</span>
              <h3>今日の目標</h3>
            </div>
            <div className="goal-progress">
              <div className="circular-progress">
                <div className="progress-circle">
                  <svg viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e0e0e0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#4caf50"
                      strokeWidth="8"
                      strokeDasharray={`${dailyGoalPercentage * 2.83} 283`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="progress-text">
                    <span className="progress-number">{Math.round(dailyGoalPercentage)}%</span>
                  </div>
                </div>
              </div>
              <div className="goal-info">
                <div className="goal-time">{formatTime(userStats.todayPracticeTime)} / {formatTime(dailyGoal)}</div>
                {dailyGoalPercentage >= 100 && (
                  <div className="goal-achieved">🎉 目標達成!</div>
                )}
              </div>
            </div>
          </div>

          {/* Consecutive Days */}
          <div className="stat-card streak-card">
            <div className="stat-header">
              <span className="stat-icon">🔥</span>
              <h3>連続記録</h3>
            </div>
            <div className="streak-display">
              <div className="streak-number">{userStats.consecutiveDays}</div>
              <div className="streak-text">日連続</div>
            </div>
            <div className="streak-motivation">
              {userStats.consecutiveDays === 0 ? 
                "今日から始めましょう！" : 
                "素晴らしい継続力です！"
              }
            </div>
          </div>

          {/* Quick Stats */}
          <div className="stat-card stats-card">
            <div className="stat-header">
              <span className="stat-icon">📊</span>
              <h3>あなたの記録</h3>
            </div>
            <div className="quick-stats">
              <div className="quick-stat">
                <span className="quick-stat-label">最高速度</span>
                <span className="quick-stat-value">{userStats.bestWPM} WPM</span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-label">平均正確率</span>
                <span className="quick-stat-value">{userStats.averageAccuracy}%</span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-label">総練習時間</span>
                <span className="quick-stat-value">{userStats.totalPracticeTime}h</span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-label">完了レッスン</span>
                <span className="quick-stat-value">{userStats.completedLessons}回</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievement */}
        <div className="recent-achievement">
          <div className="achievement-icon">🏆</div>
          <div className="achievement-text">
            <strong>新しい実績を獲得しました！</strong>
            <span>「連続7日練習」バッジを獲得</span>
          </div>
          <button className="view-achievements">実績を見る</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;