import React, { useState, useEffect } from 'react';
import './Achievements.css';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'speed' | 'accuracy' | 'consistency' | 'special';
  requirement: string;
  reward: string;
  isUnlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  maxProgress?: number;
}

interface AchievementsProps {
  userStats?: {
    totalPractices: number;
    maxWPM: number;
    averageAccuracy: number;
    consecutiveDays: number;
    totalTime: number;
  };
}

const Achievements: React.FC<AchievementsProps> = ({ userStats = {
  totalPractices: 15,
  maxWPM: 45,
  averageAccuracy: 87,
  consecutiveDays: 3,
  totalTime: 240
} }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'speed' | 'accuracy' | 'consistency' | 'special'>('all');
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // 実績データの初期化
  useEffect(() => {
    const allAchievements: Achievement[] = [
      // スピード関連
      {
        id: 'speed_10',
        title: '初心者脱出',
        description: 'WPM 10以上を達成',
        icon: '🐣',
        category: 'speed',
        requirement: 'WPM 10以上',
        reward: '経験値 +100',
        isUnlocked: userStats.maxWPM >= 10,
        unlockedDate: userStats.maxWPM >= 10 ? '2024-08-25' : undefined,
        progress: Math.min(userStats.maxWPM, 10),
        maxProgress: 10
      },
      {
        id: 'speed_25',
        title: '中級者の証',
        description: 'WPM 25以上を達成',
        icon: '⚡',
        category: 'speed',
        requirement: 'WPM 25以上',
        reward: '経験値 +300',
        isUnlocked: userStats.maxWPM >= 25,
        unlockedDate: userStats.maxWPM >= 25 ? '2024-08-28' : undefined,
        progress: Math.min(userStats.maxWPM, 25),
        maxProgress: 25
      },
      {
        id: 'speed_50',
        title: 'スピードスター',
        description: 'WPM 50以上を達成',
        icon: '🚀',
        category: 'speed',
        requirement: 'WPM 50以上',
        reward: '経験値 +500, 特別称号',
        isUnlocked: userStats.maxWPM >= 50,
        unlockedDate: userStats.maxWPM >= 50 ? '2024-08-30' : undefined,
        progress: Math.min(userStats.maxWPM, 50),
        maxProgress: 50
      },
      {
        id: 'speed_80',
        title: '雷神',
        description: 'WPM 80以上を達成',
        icon: '⚡',
        category: 'speed',
        requirement: 'WPM 80以上',
        reward: '経験値 +1000, 金のキーボード',
        isUnlocked: userStats.maxWPM >= 80,
        progress: Math.min(userStats.maxWPM, 80),
        maxProgress: 80
      },
      
      // 正確性関連
      {
        id: 'accuracy_90',
        title: '正確無比',
        description: '正確率90%以上を達成',
        icon: '🎯',
        category: 'accuracy',
        requirement: '正確率90%以上',
        reward: '経験値 +300',
        isUnlocked: userStats.averageAccuracy >= 90,
        progress: Math.min(userStats.averageAccuracy, 90),
        maxProgress: 90
      },
      {
        id: 'accuracy_95',
        title: '完璧主義者',
        description: '正確率95%以上を達成',
        icon: '💎',
        category: 'accuracy',
        requirement: '正確率95%以上',
        reward: '経験値 +500',
        isUnlocked: userStats.averageAccuracy >= 95,
        progress: Math.min(userStats.averageAccuracy, 95),
        maxProgress: 95
      },
      {
        id: 'accuracy_99',
        title: '神の領域',
        description: '正確率99%以上を達成',
        icon: '👑',
        category: 'accuracy',
        requirement: '正確率99%以上',
        reward: '経験値 +1000, プラチナトロフィー',
        isUnlocked: userStats.averageAccuracy >= 99,
        progress: Math.min(userStats.averageAccuracy, 99),
        maxProgress: 99
      },
      
      // 継続関連
      {
        id: 'practice_5',
        title: '継続は力なり',
        description: '5回練習を完了',
        icon: '📚',
        category: 'consistency',
        requirement: '練習5回完了',
        reward: '経験値 +200',
        isUnlocked: userStats.totalPractices >= 5,
        unlockedDate: userStats.totalPractices >= 5 ? '2024-08-26' : undefined,
        progress: Math.min(userStats.totalPractices, 5),
        maxProgress: 5
      },
      {
        id: 'practice_50',
        title: '努力家',
        description: '50回練習を完了',
        icon: '🏋️',
        category: 'consistency',
        requirement: '練習50回完了',
        reward: '経験値 +500',
        isUnlocked: userStats.totalPractices >= 50,
        progress: Math.min(userStats.totalPractices, 50),
        maxProgress: 50
      },
      {
        id: 'consecutive_7',
        title: '一週間戦士',
        description: '7日連続で練習',
        icon: '🔥',
        category: 'consistency',
        requirement: '連続7日練習',
        reward: '経験値 +700',
        isUnlocked: userStats.consecutiveDays >= 7,
        progress: Math.min(userStats.consecutiveDays, 7),
        maxProgress: 7
      },
      
      // 特別実績
      {
        id: 'early_bird',
        title: '早起き鳥',
        description: '午前6時前に練習完了',
        icon: '🌅',
        category: 'special',
        requirement: '早朝練習',
        reward: '経験値 +300, 朝活バッジ',
        isUnlocked: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: 'night_owl',
        title: '夜更かしマスター',
        description: '午後11時以降に練習完了',
        icon: '🦉',
        category: 'special',
        requirement: '深夜練習',
        reward: '経験値 +300, 夜更かしバッジ',
        isUnlocked: true,
        unlockedDate: '2024-08-29',
        progress: 1,
        maxProgress: 1
      },
      {
        id: 'perfectionist',
        title: 'パーフェクト',
        description: '正確率100%で練習完了',
        icon: '✨',
        category: 'special',
        requirement: '正確率100%',
        reward: '経験値 +1000, 完璧の証',
        isUnlocked: false,
        progress: 0,
        maxProgress: 1
      }
    ];

    setAchievements(allAchievements);
  }, [userStats]);

  const filteredAchievements = achievements.filter(achievement =>
    selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const getCategoryIcon = (category: string) => {
    const icons = {
      'all': '🏆',
      'speed': '⚡',
      'accuracy': '🎯',
      'consistency': '📈',
      'special': '⭐'
    };
    return icons[category as keyof typeof icons] || '🏆';
  };

  const getCategoryName = (category: string) => {
    const names = {
      'all': '全て',
      'speed': 'スピード',
      'accuracy': '正確性',
      'consistency': '継続性',
      'special': '特別'
    };
    return names[category as keyof typeof names] || '全て';
  };

  const unlockedAchievements = achievements.filter(a => a.isUnlocked).length;
  const totalAchievements = achievements.length;
  const completionRate = Math.round((unlockedAchievements / totalAchievements) * 100);

  return (
    <div className="achievements-page">
      <div className="achievements-header">
        <h1>🏆 実績</h1>
        <p>あなたのタイピング成長の軌跡</p>
        
        <div className="progress-overview">
          <div className="progress-circle">
            <div className="progress-text">
              <span className="progress-percentage">{completionRate}%</span>
              <span className="progress-label">達成率</span>
            </div>
          </div>
          <div className="progress-stats">
            <div className="progress-item">
              <span className="progress-number">{unlockedAchievements}</span>
              <span className="progress-description">解除済み実績</span>
            </div>
            <div className="progress-item">
              <span className="progress-number">{totalAchievements}</span>
              <span className="progress-description">総実績数</span>
            </div>
          </div>
        </div>
      </div>

      <div className="category-filter">
        {(['all', 'speed', 'accuracy', 'consistency', 'special'] as const).map(category => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            <span className="category-icon">{getCategoryIcon(category)}</span>
            <span className="category-name">{getCategoryName(category)}</span>
          </button>
        ))}
      </div>

      <div className="achievements-grid">
        {filteredAchievements.map(achievement => (
          <div
            key={achievement.id}
            className={`achievement-card ${achievement.isUnlocked ? 'unlocked' : 'locked'}`}
          >
            <div className="achievement-icon">
              {achievement.isUnlocked ? achievement.icon : '🔒'}
            </div>
            
            <div className="achievement-content">
              <h3 className="achievement-title">{achievement.title}</h3>
              <p className="achievement-description">{achievement.description}</p>
              
              <div className="achievement-requirement">
                <span className="requirement-label">条件:</span>
                <span className="requirement-text">{achievement.requirement}</span>
              </div>
              
              {achievement.maxProgress && achievement.maxProgress > 1 && (
                <div className="achievement-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%`
                      }}
                    />
                  </div>
                  <span className="progress-text">
                    {achievement.progress || 0} / {achievement.maxProgress}
                  </span>
                </div>
              )}
              
              <div className="achievement-reward">
                <span className="reward-label">報酬:</span>
                <span className="reward-text">{achievement.reward}</span>
              </div>
              
              {achievement.unlockedDate && (
                <div className="unlock-date">
                  {achievement.unlockedDate} に解除
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="achievements-footer">
        <h3>🎯 次の目標</h3>
        <div className="next-goals">
          {achievements
            .filter(a => !a.isUnlocked)
            .slice(0, 3)
            .map(achievement => (
              <div key={achievement.id} className="next-goal">
                <span className="goal-icon">{achievement.icon}</span>
                <span className="goal-title">{achievement.title}</span>
                <span className="goal-requirement">{achievement.requirement}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;