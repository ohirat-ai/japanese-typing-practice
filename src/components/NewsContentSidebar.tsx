import React, { useState, useEffect, useCallback } from 'react';
import './NewsContentSidebar.css';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  timestamp: Date;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  source: string;
}

interface NewsContentSidebarProps {
  isVisible: boolean;
  onNewsSelect?: (newsItem: NewsItem) => void;
  currentCategory?: string;
}

const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'AI技術の進歩がタイピング練習に革新をもたらす',
    summary: '最新のAI技術を活用したタイピング練習システムが登場し、個人の苦手分野を自動分析して最適な練習プログラムを提供します。',
    category: 'it',
    timestamp: new Date('2024-12-15T10:30:00'),
    difficulty: 'medium',
    tags: ['AI', 'タイピング', '技術'],
    source: 'Tech News'
  },
  {
    id: '2', 
    title: '山梨県の新しいIT教育プログラムが開始',
    summary: '山梨県内の小中学校でタイピング技能向上を目指した新しいIT教育プログラムが本格的に始動しました。',
    category: 'yamanashi',
    timestamp: new Date('2024-12-14T15:45:00'),
    difficulty: 'easy',
    tags: ['教育', '山梨', 'IT'],
    source: '山梨新聞'
  },
  {
    id: '3',
    title: '文学作品をタイピング練習に活用する新しい学習法',
    summary: '古典文学や現代小説を教材として活用したタイピング練習が、文章理解力と入力技能の同時向上に効果的であることが判明しました。',
    category: 'literature',
    timestamp: new Date('2024-12-14T09:20:00'),
    difficulty: 'hard',
    tags: ['文学', '学習法', 'タイピング'],
    source: '教育ジャーナル'
  },
  {
    id: '4',
    title: '企業でのタイピング技能要求水準が向上',
    summary: 'リモートワークの普及に伴い、多くの企業がタイピング技能の重要性を再認識し、採用基準に含める動きが加速しています。',
    category: 'general',
    timestamp: new Date('2024-12-13T14:10:00'),
    difficulty: 'medium',
    tags: ['企業', 'スキル', 'リモートワーク'],
    source: 'ビジネス週刊誌'
  },
  {
    id: '5',
    title: 'eスポーツとタイピングゲームの融合が話題',
    summary: 'タイピング技能を競うeスポーツ大会が注目を集め、プロゲーマーによるタイピング技術解説動画が人気となっています。',
    category: 'general',
    timestamp: new Date('2024-12-13T11:30:00'),
    difficulty: 'easy',
    tags: ['eスポーツ', 'ゲーム', 'タイピング'],
    source: 'ゲーム情報誌'
  },
  {
    id: '6',
    title: '最新ニュース：デジタル庁がタイピング技能標準化を検討',
    summary: 'デジタル庁は全国的なタイピング技能の標準化とデジタルスキル向上の施策について有識者会議での議論を開始しました。',
    category: 'news',
    timestamp: new Date('2024-12-15T08:00:00'),
    difficulty: 'medium',
    tags: ['政府', 'デジタル化', '標準化'],
    source: '官報'
  }
];

const NewsContentSidebar: React.FC<NewsContentSidebarProps> = ({
  isVisible,
  onNewsSelect,
  currentCategory = 'general'
}) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);

  const categories = [
    { key: 'general', name: '一般', icon: '📰' },
    { key: 'it', name: 'IT', icon: '💻' },
    { key: 'yamanashi', name: '山梨', icon: '🗾' },
    { key: 'literature', name: '文学', icon: '📚' },
    { key: 'news', name: 'ニュース', icon: '🗞️' }
  ];

  const updateNewsContent = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const shuffled = [...mockNewsData].sort(() => Math.random() - 0.5);
      setNewsItems(shuffled);
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    updateNewsContent();
    
    const interval = setInterval(() => {
      updateNewsContent();
    }, 300000); // 5分ごとに更新

    return () => clearInterval(interval);
  }, [updateNewsContent]);

  const filteredNews = selectedCategory === 'general' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'hard': return '#f44336';
      default: return '#666';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '初級';
      case 'medium': return '中級';
      case 'hard': return '上級';
      default: return '一般';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return '最新';
    if (hours < 24) return `${hours}時間前`;
    return `${Math.floor(hours / 24)}日前`;
  };

  if (!isVisible) return null;

  return (
    <div className="news-content-sidebar">
      <div className="news-sidebar-header">
        <h3>📺 練習コンテンツ</h3>
        <div className="news-update-info">
          <span className="last-updated">
            最終更新: {lastUpdated.toLocaleTimeString()}
          </span>
          <button 
            className="refresh-button" 
            onClick={updateNewsContent}
            disabled={loading}
          >
            {loading ? '🔄' : '⟳'}
          </button>
        </div>
      </div>

      <div className="news-categories">
        {categories.map(category => (
          <button
            key={category.key}
            className={`category-button ${selectedCategory === category.key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.key)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      <div className="news-content">
        {loading ? (
          <div className="news-loading">
            <div className="loading-spinner"></div>
            <p>コンテンツを更新中...</p>
          </div>
        ) : (
          <div className="news-items">
            {filteredNews.map(item => (
              <div 
                key={item.id} 
                className="news-item"
                onClick={() => onNewsSelect?.(item)}
              >
                <div className="news-item-header">
                  <div className="news-meta">
                    <span 
                      className="news-difficulty"
                      style={{ backgroundColor: getDifficultyColor(item.difficulty) }}
                    >
                      {getDifficultyText(item.difficulty)}
                    </span>
                    <span className="news-timestamp">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                </div>
                
                <h4 className="news-title">{item.title}</h4>
                <p className="news-summary">{item.summary}</p>
                
                <div className="news-footer">
                  <div className="news-tags">
                    {item.tags.map(tag => (
                      <span key={tag} className="news-tag">#{tag}</span>
                    ))}
                  </div>
                  <span className="news-source">{item.source}</span>
                </div>
                
                <div className="practice-button">
                  <button className="start-practice-btn">
                    この内容で練習する →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsContentSidebar;