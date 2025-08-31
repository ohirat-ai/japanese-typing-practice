import React, { useState, useEffect } from 'react';
import './Ranking.css';

interface RankingData {
  id: string;
  userName: string;
  wpm: number;
  accuracy: number;
  score: number;
  rank: 'S' | 'A' | 'B' | 'C' | 'D' | 'E';
  date: string;
  category: string;
}

interface RankingProps {
  currentUser?: string;
}

const Ranking: React.FC<RankingProps> = ({ currentUser }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('daily');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'general' | 'literature' | 'it' | 'yamanashi'>('all');
  const [rankingData, setRankingData] = useState<RankingData[]>([]);

  // モックデータ生成（実際の実装ではAPIから取得）
  const generateMockRankingData = (): RankingData[] => {
    const categories = ['general', 'literature', 'it', 'yamanashi'];
    const ranks: Array<'S' | 'A' | 'B' | 'C' | 'D' | 'E'> = ['S', 'A', 'B', 'C', 'D', 'E'];
    const names = [
      '田中太郎', '山田花子', 'タイピングマスター', '佐藤健', '鈴木美咲',
      'KeyboardNinja', '高速入力者', '正確性重視', 'SpeedTyper', '練習中',
      currentUser || 'あなた'
    ];

    return Array.from({ length: 50 }, (_, i) => {
      const wpm = Math.floor(Math.random() * 100) + 20;
      const accuracy = Math.floor(Math.random() * 30) + 70;
      const score = Math.floor(wpm * (accuracy / 100) * (Math.random() * 5 + 5) * 10);
      
      let rank: 'S' | 'A' | 'B' | 'C' | 'D' | 'E' = 'E';
      if (wpm >= 80 && accuracy >= 98 && score >= 1500) rank = 'S';
      else if (wpm >= 60 && accuracy >= 95 && score >= 1000) rank = 'A';
      else if (wpm >= 40 && accuracy >= 90 && score >= 600) rank = 'B';
      else if (wpm >= 25 && accuracy >= 80 && score >= 300) rank = 'C';
      else if (wpm >= 15 && accuracy >= 70) rank = 'D';

      return {
        id: `user_${i}`,
        userName: names[i % names.length],
        wpm,
        accuracy,
        score,
        rank,
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: categories[Math.floor(Math.random() * categories.length)]
      };
    }).sort((a, b) => b.score - a.score);
  };

  useEffect(() => {
    // 実際の実装ではAPI呼び出し
    const mockData = generateMockRankingData();
    setRankingData(mockData);
  }, [selectedPeriod, selectedCategory]);

  const getRankColor = (rank: 'S' | 'A' | 'B' | 'C' | 'D' | 'E'): string => {
    const rankColors = {
      'S': '#FFD700', // ゴールド
      'A': '#FF6B35', // オレンジ
      'B': '#4ECDC4', // ティール
      'C': '#45B7D1', // ブルー
      'D': '#96CEB4', // グリーン
      'E': '#95A5A6'  // グレー
    };
    return rankColors[rank] || '#95A5A6';
  };

  const filteredData = rankingData.filter(data => 
    selectedCategory === 'all' || data.category === selectedCategory
  );

  const getRankingIcon = (position: number) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `${position}位`;
  };

  return (
    <div className="ranking-page">
      <div className="ranking-header">
        <h1>🏆 ランキング</h1>
        <p>全国のタイピング練習者と競い合いましょう！</p>
      </div>

      <div className="ranking-filters">
        <div className="filter-group">
          <h3>期間</h3>
          <div className="filter-buttons">
            <button
              className={selectedPeriod === 'daily' ? 'active' : ''}
              onClick={() => setSelectedPeriod('daily')}
            >
              日間
            </button>
            <button
              className={selectedPeriod === 'weekly' ? 'active' : ''}
              onClick={() => setSelectedPeriod('weekly')}
            >
              週間
            </button>
            <button
              className={selectedPeriod === 'monthly' ? 'active' : ''}
              onClick={() => setSelectedPeriod('monthly')}
            >
              月間
            </button>
            <button
              className={selectedPeriod === 'all' ? 'active' : ''}
              onClick={() => setSelectedPeriod('all')}
            >
              全期間
            </button>
          </div>
        </div>

        <div className="filter-group">
          <h3>カテゴリー</h3>
          <div className="filter-buttons">
            <button
              className={selectedCategory === 'all' ? 'active' : ''}
              onClick={() => setSelectedCategory('all')}
            >
              全カテゴリ
            </button>
            <button
              className={selectedCategory === 'general' ? 'active' : ''}
              onClick={() => setSelectedCategory('general')}
            >
              一般
            </button>
            <button
              className={selectedCategory === 'literature' ? 'active' : ''}
              onClick={() => setSelectedCategory('literature')}
            >
              文学
            </button>
            <button
              className={selectedCategory === 'it' ? 'active' : ''}
              onClick={() => setSelectedCategory('it')}
            >
              IT
            </button>
            <button
              className={selectedCategory === 'yamanashi' ? 'active' : ''}
              onClick={() => setSelectedCategory('yamanashi')}
            >
              山梨
            </button>
          </div>
        </div>
      </div>

      <div className="ranking-stats">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{filteredData.length}</div>
            <div className="stat-label">参加者数</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-value">{Math.round(filteredData.reduce((sum, data) => sum + data.wpm, 0) / filteredData.length) || 0}</div>
            <div className="stat-label">平均WPM</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-value">{filteredData[0]?.score || 0}</div>
            <div className="stat-label">最高スコア</div>
          </div>
        </div>
      </div>

      <div className="ranking-list">
        <div className="ranking-table">
          <div className="table-header">
            <div className="col-rank">順位</div>
            <div className="col-user">ユーザー</div>
            <div className="col-score">スコア</div>
            <div className="col-wpm">WPM</div>
            <div className="col-accuracy">正確率</div>
            <div className="col-rank-badge">ランク</div>
          </div>
          
          <div className="table-body">
            {filteredData.slice(0, 50).map((data, index) => (
              <div
                key={data.id}
                className={`table-row ${data.userName === currentUser ? 'current-user' : ''}`}
              >
                <div className="col-rank">
                  <span className="ranking-position">
                    {getRankingIcon(index + 1)}
                  </span>
                </div>
                <div className="col-user">
                  <div className="user-info">
                    <span className="user-name">{data.userName}</span>
                    {data.userName === currentUser && (
                      <span className="user-tag">あなた</span>
                    )}
                  </div>
                </div>
                <div className="col-score">{data.score.toLocaleString()}</div>
                <div className="col-wpm">{data.wpm}</div>
                <div className="col-accuracy">{data.accuracy}%</div>
                <div className="col-rank-badge">
                  <div
                    className="rank-badge-small"
                    style={{ backgroundColor: getRankColor(data.rank) }}
                  >
                    {data.rank}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ranking-footer">
        <p>💡 <strong>ランクアップのコツ:</strong> 速度と正確性のバランスが重要です</p>
        <p>📈 定期的な練習で上位ランカーを目指しましょう！</p>
      </div>
    </div>
  );
};

export default Ranking;