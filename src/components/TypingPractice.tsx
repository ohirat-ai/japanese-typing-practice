import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSoundEffects } from '../hooks/useSoundEffects';
import './TypingPractice.css';

type PracticeCategory = 'general' | 'news' | 'yamanashi' | 'literature' | 'it' | 'custom';
type PracticeLength = 'short' | 'long';

interface TypingPracticeProps {
  category: PracticeCategory;
  length: PracticeLength;
  onCategoryChange: (category: PracticeCategory) => void;
  onLengthChange: (length: PracticeLength) => void;
  soundEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

// 文字変換マップ（カタカナ→ひらがな、漢字→ひらがな）
const conversionMap: { [key: string]: string } = {
  // カタカナ→ひらがな
  'ア': 'あ', 'イ': 'い', 'ウ': 'う', 'エ': 'え', 'オ': 'お',
  'カ': 'か', 'キ': 'き', 'ク': 'く', 'ケ': 'け', 'コ': 'こ',
  'ガ': 'が', 'ギ': 'ぎ', 'グ': 'ぐ', 'ゲ': 'げ', 'ゴ': 'ご',
  'サ': 'さ', 'シ': 'し', 'ス': 'す', 'セ': 'せ', 'ソ': 'そ',
  'ザ': 'ざ', 'ジ': 'じ', 'ズ': 'ず', 'ゼ': 'ぜ', 'ゾ': 'ぞ',
  'タ': 'た', 'チ': 'ち', 'ツ': 'つ', 'テ': 'て', 'ト': 'と',
  'ダ': 'だ', 'ヂ': 'ぢ', 'ヅ': 'づ', 'デ': 'で', 'ド': 'ど',
  'ナ': 'な', 'ニ': 'に', 'ヌ': 'ぬ', 'ネ': 'ね', 'ノ': 'の',
  'ハ': 'は', 'ヒ': 'ひ', 'フ': 'ふ', 'ヘ': 'へ', 'ホ': 'ほ',
  'バ': 'ば', 'ビ': 'び', 'ブ': 'ぶ', 'ベ': 'べ', 'ボ': 'ぼ',
  'パ': 'ぱ', 'ピ': 'ぴ', 'プ': 'ぷ', 'ペ': 'ぺ', 'ポ': 'ぽ',
  'マ': 'ま', 'ミ': 'み', 'ム': 'む', 'メ': 'め', 'モ': 'も',
  'ヤ': 'や', 'ユ': 'ゆ', 'ヨ': 'よ',
  'ラ': 'ら', 'リ': 'り', 'ル': 'る', 'レ': 'れ', 'ロ': 'ろ',
  'ワ': 'わ', 'ヲ': 'を', 'ン': 'ん',
  'ャ': 'ゃ', 'ュ': 'ゅ', 'ョ': 'ょ',
  'ッ': 'っ', 'ー': 'ー',
  // よく使われる漢字・単語→ひらがな
  'こんにちは': 'こんにちは', '今日': 'きょう', '天気': 'てんき', '楽しい': 'たのしい', '日本語': 'にほんご',
  'タイピング': 'たいぴんぐ', '練習': 'れんしゅう', '桜': 'さくら', '咲く': 'さく',
  '季節': 'きせつ', 'コーヒー': 'こーひー', '飲み': 'のみ', '仕事': 'しごと',
  // 不足していた重要な漢字を追加
  '音楽': 'おんがく', '音': 'おん', '楽': 'がく', '聴き': 'きき', '聴く': 'きく', '聴': 'き',
  'ながら': 'ながら', 'リラックス': 'りらっくす', 'して': 'して', 'います': 'います',
  '読書': 'どくしょ', '読': 'よ', '書': 'しょ', '知識': 'ちしき', '知': 'ち', '識': 'しき',
  '広げる': 'ひろげる', '広': 'ひろ', '素晴らしい': 'すばらしい', '素': 'そ', '晴': 'はら',
  '習慣': 'しゅうかん', '習': 'しゅう', '慣': 'かん', '新しい': 'あたらしい', '新': 'しん',
  '学ぶ': 'まなぶ', '学': 'がく', '楽しい': 'たのしい', 'もの': 'もの', 'です': 'です',
  '春': 'はる', '花': 'はな', '美しく': 'うつくしく', '多く': 'おおく', '人々': 'ひとびと',
  '花見': 'はなみ', '楽しみ': 'たのしみ', '公園': 'こうえん', '川沿い': 'かわぞい', 
  '並木': 'なみき', 'ピンク': 'ぴんく', '白': 'しろ', '彩られ': 'いろどられ',
  '雲': 'くも', '見え': 'みえ', '時期': 'じき', '家族': 'かぞく', '友人': 'ゆうじん',
  '一緒': 'いっしょ', '弁当': 'べんとう', '持って': 'もって', '出かけ': 'でかけ',
  '下': 'した', 'ピクニック': 'ぴくにっく', '人たち': 'ひとたち',
  '夜': 'よる', '提灯': 'ちょうちん', '灯され': 'ともされ', '夜桜': 'よざくら',
  '見物': 'けんぶつ', '人気': 'にんき', '短い': 'みじかい', '大切': 'たいせつ',
  '美しい': 'うつくしい', '愛で': 'めで', '過ごし': 'すごし', '象徴的': 'しょうちょうてき',
  '古く': 'ふるく', '親しまれて': 'したしまれて',
  '現代': 'げんだい', '社会': 'しゃかい', 'テクノロジー': 'てくのろじー', '進歩': 'しんぽ',
  '私たち': 'わたしたち', '生活': 'せいかつ', '大きく': 'おおきく', '変えて': 'かえて',
  'スマートフォン': 'すまーとふぉん', 'パソコン': 'ぱそこん', 'インターネット': 'いんたーねっと',
  '普及': 'ふきゅう', '世界中': 'せかいじゅう', '情報': 'じょうほう', '瞬時': 'しゅんじ',
  'アクセス': 'あくせす', '人工知能': 'じんこうちのう', '機械学習': 'きかいがくしゅう',
  '技術': 'ぎじゅつ', '発達': 'はったつ', '自動運転車': 'じどううんてんしゃ',
  '音声認識': 'おんせいにんしき', 'システム': 'しすてむ', '以前': 'いぜん',
  '想像': 'そうぞう', '実用化': 'じつようか', '一方': 'いっぽう',
  'プライバシー': 'ぷらいばしー', '保護': 'ほご', 'サイバーセキュリティ': 'さいばーせきゅりてぃ',
  '新た': 'あらた', '課題': 'かだい', '生まれて': 'うまれて',
  // 数字と記号
  '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
  '０': '0', '１': '1', '２': '2', '３': '3', '４': '4', '５': '5', '６': '6', '７': '7', '８': '8', '９': '9',
  '：': ':', '；': ';', '・': '/', '〜': '~', '－': '-', '＋': '+', '＝': '=',
  '【': '[', '】': ']', '『': '[', '』': ']', '〔': '[', '〕': ']'
};

// ひらがな→ローマ字変換マップ
const hiraganaToRomajiMap: { [key: string]: string } = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'だ': 'da', 'ぢ': 'di', 'づ': 'du', 'で': 'de', 'ど': 'do',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo', 'ん': 'n',
  'ゃ': 'ya', 'ゅ': 'yu', 'ょ': 'yo',
  'っ': '', // 促音は次の子音を重ねる
  'ー': '', // 長音記号
  // 拗音
  'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
  'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
  'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
  'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
  'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
  'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
  'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
  'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
  'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
  'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
  'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
  // 記号・句読点
  '。': '.', '、': ',', '？': '?', '！': '!',
  '（': '(', '）': ')', '「': '"', '」': '"',
  ' ': ' ', '　': ' ', // 全角スペース
  // 数字と記号
  '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
  ':': ':', ';': ';', '/': '/', '~': '~', '-': '-', '+': '+', '=': '=',
  '[': '[', ']': ']'
};

// カテゴリー別テキストデータ（newsとcustomを除く）
type ValidTextDataCategory = 'general' | 'yamanashi' | 'literature' | 'it';
const textData: Record<ValidTextDataCategory, { short: string[], long: string[] }> = {
  general: {
    short: [
      "こんにちは、今日はいい天気ですね。",
      "プログラミングは楽しいです。",
      "日本語のタイピング練習をしています。",
      "桜が咲く季節になりました。",
      "コーヒーを飲みながら仕事をします。",
      "読書は知識を広げる素晴らしい習慣です。",
      "音楽を聴きながらリラックスしています。",
      "新しいことを学ぶのは楽しいものです。",
    ],
    long: [
      "春は花の季節です。桜の花が美しく咲き、多くの人々が花見を楽しみます。公園や川沿いの桜並木は、ピンクや白の花で彩られ、まるで雲のように見えます。花見の時期には、家族や友人と一緒にお弁当を持って出かけ、桜の下でピクニックを楽しむ人たちがたくさんいます。",
      "現代社会において、テクノロジーの進歩は私たちの生活を大きく変えています。スマートフォンやパソコン、インターネットの普及により、世界中の情報に瞬時にアクセスできるようになりました。人工知能や機械学習の技術も発達し、自動運転車や音声認識システムなど、以前は想像もできなかった技術が実用化されています。",
    ]
  },
  yamanashi: {
    short: [
      "富士山は山梨県の象徴的な山です。",
      "山梨県は桃とぶどうの産地として有名です。",
      "武田信玄は甲斐の国の戦国大名でした。",
      "ほうとうは山梨県の郷土料理です。",
      "河口湖では美しい富士山が見られます。",
      "甲府市は山梨県の県庁所在地です。",
      "昇仙峡は日本屈指の渓谷美を誇ります。",
      "山梨県は盆地特有の気候を持ちます。",
    ],
    long: [
      "山梨県は本州の中央部に位置し、富士山をはじめとする美しい山々に囲まれた内陸県です。県内には富士五湖と呼ばれる河口湖、山中湖、西湖、精進湖、本栖湖があり、四季折々の自然の美しさを楽しむことができます。また、ぶどうや桃などの果物の生産が盛んで、特にワインの品質は世界的にも高く評価されています。",
      "武田信玄で知られる甲斐の国、現在の山梨県は戦国時代から江戸時代にかけて重要な役割を果たしました。信玄堤として知られる治水事業や、金山の開発など、先進的な技術と政策で領国経営を行いました。現在でも武田神社や恵林寺など、武田氏ゆかりの史跡が数多く残されており、歴史ファンにとって魅力的な観光地となっています。",
      "山梨県の郷土料理「ほうとう」は、幅広の麺を野菜と一緒に味噌仕立ての汁で煮込んだ料理です。かぼちゃ、大根、人参、白菜などの季節の野菜をたっぷりと使い、栄養価が高く体を温める効果があります。寒い冬には特に人気があり、県内の多くの店で味わうことができます。",
    ]
  },
  literature: {
    short: [
      "吾輩は猫である。名前はまだ無い。",
      "国境の長いトンネルを抜けると雪国であった。",
      "月日は百代の過客にして、行きかふ年もまた旅人なり。",
      "祇園精舎の鐘の声、諸行無常の響きあり。",
      "メロスは激怒した。必ず、かの邪智暴虐の王を除かねばならぬと決意した。",
      "親譲りの無鉄砲で小供の時から損ばかりしている。",
      "あるところに貧しい木こりの夫婦が住んでいました。",
      "春はあけぼの。やうやう白くなりゆく山際、少し明かりて。",
    ],
    long: [
      "夏目漱石の「吾輩は猫である」は、明治時代を代表する小説の一つです。猫の視点から人間社会を風刺的に描いた作品で、鋭い観察眼と洒脱なユーモアが特徴的です。主人公の猫は名前を持たず、教師の家に飼われながら、人間たちの行動や思考を冷静に観察し、批評していきます。",
      "太宰治の「走れメロス」は、友情と信頼をテーマにした短編小説です。暴君に処刑を宣告されたメロスが、友人を人質に残して故郷へ帰り、約束の期限までに戻ってくるという物語です。メロスの必死の走りと、友人セリヌンティウスの揺るぎない信頼が、読者の心を打つ名作となっています。",
      "清少納言の「枕草子」は、平安時代の随筆文学の傑作です。「春はあけぼの」で始まる四季の美しさを描いた段は特に有名で、日本人の季節感や美意識を表現しています。宮廷生活の様子や、作者の鋭い観察眼による人物評、さまざまな物事への感想が生き生きと描かれています。",
    ]
  },
  it: {
    short: [
      "プログラミングはコンピュータに指示を与える技術です。",
      "データベースは情報を整理して保存するシステムです。",
      "アルゴリズムは問題を解決するための手順です。",
      "人工知能は人間の知能を模倣する技術です。",
      "クラウドコンピューティングでリソースを共有します。",
      "セキュリティは情報を保護するために重要です。",
      "APIはアプリケーション間の通信を可能にします。",
      "機械学習はデータから自動的に学習する技術です。",
    ],
    long: [
      "ウェブ開発では、HTML、CSS、JavaScriptが基本的な技術です。HTMLはページの構造を定義し、CSSは見た目をデザインし、JavaScriptは動的な機能を実装します。これらの技術を組み合わせることで、インタラクティブで魅力的なウェブサイトを作成することができます。最近では、ReactやVue.jsなどのフレームワークも広く使われています。",
      "データサイエンスは、大量のデータから有用な情報を抽出する分野です。統計学、機械学習、プログラミングの知識を組み合わせて、データの分析と可視化を行います。PythonやRなどのプログラミング言語が主に使用され、pandas、NumPy、scikit-learnなどのライブラリが活用されています。",
      "ブロックチェーン技術は、分散型の台帳システムです。取引の記録をブロックと呼ばれる単位にまとめ、それらを暗号学的にチェーン状に連結することで、改ざんが困難なシステムを実現します。仮想通貨だけでなく、サプライチェーン管理や投票システムなど、さまざまな分野での応用が期待されています。",
    ]
  }
};

// 今日のニュース（API連携のモックデータ）
const getTodaysNews = (): { short: string[], long: string[] } => {
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`;
  
  return {
    short: [
      `${dateStr}、新しい技術革新が発表されました。`,
      `${dateStr}、経済成長率が発表されました。`,
      `${dateStr}、環境保護の新政策が決定されました。`,
      `${dateStr}、スポーツの国際大会が開催されました。`,
      `${dateStr}、教育分野での改革案が提示されました。`,
    ],
    long: [
      `${dateStr}、政府は新しい経済政策を発表しました。この政策は、中小企業の支援強化と雇用創出を主な目標としており、今後数年間で大きな経済効果が期待されています。専門家からは、適切な実施により経済の安定成長につながるとの評価を得ています。`,
      `${dateStr}、最新の科学研究により、持続可能な技術開発に新たな進展がありました。この技術は環境負荷を大幅に削減しながら、効率的なエネルギー利用を可能にします。実用化に向けた取り組みが加速しており、近い将来の実現が期待されています。`,
    ]
  };
};

type UserRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

interface TypingStats {
  wpm: number;
  accuracy: number;
  totalChars: number;
  correctChars: number;
  incorrectChars: number;
  score: number;
  rank: UserRank;
}



const TypingPractice: React.FC<TypingPracticeProps> = ({ category, length, onCategoryChange, onLengthChange, soundEnabled, fontSize }) => {
  const [currentText, setCurrentText] = useState('');
  const [expectedText, setExpectedText] = useState('');
  const [expectedRomaji, setExpectedRomaji] = useState('');
  const [typedRomaji, setTypedRomaji] = useState('');
  const [hasInputError, setHasInputError] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatingText, setGeneratingText] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 0,
    totalChars: 0,
    correctChars: 0,
    incorrectChars: 0,
    score: 0,
    rank: 'E',
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const textDisplayRef = useRef<HTMLDivElement>(null);
  
  const { playCorrectSound, playIncorrectSound, playCompletionSound } = useSoundEffects({
    enabled: soundEnabled,
    volume: 0.3
  });

  // ランク別の色を取得する関数
  const getRankColor = useCallback((rank: UserRank): string => {
    const rankColors = {
      'S': '#FFD700', // ゴールド
      'A': '#FF6B35', // オレンジ
      'B': '#4ECDC4', // ティール
      'C': '#45B7D1', // ブルー
      'D': '#96CEB4', // グリーン
      'E': '#95A5A6'  // グレー
    };
    return rankColors[rank] || '#95A5A6';
  }, []);

  // タイマーの更新
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isCompleted) {
      interval = setInterval(() => {
        setCurrentTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, isCompleted]);

  // スコア・ランク計算関数
  const calculateScore = useCallback((wpm: number, accuracy: number, retryCount: number, textLength: number): { score: number, rank: UserRank } => {
    // 基本スコア = WPM × 正確率の二乗 × 文章長係数
    const lengthBonus = Math.min(textLength / 100, 2); // 長文ボーナス（最大2倍）
    const baseScore = wpm * Math.pow(accuracy / 100, 2) * lengthBonus;
    
    // リトライペナルティ（リトライ回数に応じて減点）
    const retryPenalty = Math.max(0, 1 - (retryCount * 0.1));
    
    // 最終スコア
    const finalScore = Math.round(baseScore * retryPenalty * 10);
    
    // ランク決定（スコアとWPMを総合評価）
    let rank: UserRank = 'E';
    if (wpm >= 80 && accuracy >= 98 && finalScore >= 1500) {
      rank = 'S';
    } else if (wpm >= 60 && accuracy >= 95 && finalScore >= 1000) {
      rank = 'A';
    } else if (wpm >= 40 && accuracy >= 90 && finalScore >= 600) {
      rank = 'B';
    } else if (wpm >= 25 && accuracy >= 80 && finalScore >= 300) {
      rank = 'C';
    } else if (wpm >= 15 && accuracy >= 70) {
      rank = 'D';
    }
    
    return { score: Math.max(0, finalScore), rank };
  }, []);

  // 統計計算関数
  const calculateStats = useCallback((typed: string, expected: string, startTime: Date, retryCount: number = 0): TypingStats => {
    const now = new Date();
    const timeElapsed = (now.getTime() - startTime.getTime()) / 1000 / 60; // minutes
    
    let correctChars = 0;
    let incorrectChars = 0;
    
    for (let i = 0; i < typed.length; i++) {
      if (i < expected.length && typed[i] === expected[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }
    
    const totalChars = typed.length;
    const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;
    const wpm = timeElapsed > 0 ? (correctChars / 5) / timeElapsed : 0;
    
    // スコアとランクを計算
    const { score, rank } = calculateScore(Math.round(wpm), Math.round(accuracy * 100) / 100, retryCount, expected.length);
    
    return {
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy * 100) / 100,
      totalChars,
      correctChars,
      incorrectChars,
      score,
      rank,
    };
  }, [calculateScore]);

  // キーボードイベント処理（ローマ字入力用）
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    console.log('Key pressed:', e.key, 'isCompleted:', isCompleted, 'expectedRomaji:', expectedRomaji, 'typedRomaji:', typedRomaji);
    
    // 完了後は入力を受け付けない
    if (isCompleted) {
      console.log('Practice completed, ignoring input');
      return;
    }

    // 特殊キーや制御キーは無視
    if (e.ctrlKey || e.altKey || e.metaKey || 
        ['Tab', 'Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(e.key)) {
      console.log('Special key ignored:', e.key);
      return;
    }
    
    e.preventDefault();
    
    if (e.key === 'Backspace') {
      // バックスペース処理
      if (typedRomaji.length > 0) {
        const newTypedRomaji = typedRomaji.slice(0, -1);
        setTypedRomaji(newTypedRomaji);
        setHasInputError(false);
        
        if (startTime) {
          const newStats = calculateStats(newTypedRomaji, expectedRomaji, startTime, retryCount);
          setStats(newStats);
        }
      }
      return;
    }
    
    // 通常の文字入力（ローマ字）
    if (e.key.length === 1 && /[a-zA-Z.,!?()"\s]/.test(e.key)) {
      console.log('Valid character input:', e.key);
      const newTypedRomaji = typedRomaji + e.key.toLowerCase();
      console.log('New typed romaji would be:', newTypedRomaji);
      
      if (!startTime) {
        console.log('Starting timer');
        setStartTime(new Date());
      }
      
      // 期待されるローマ字と比較
      if (newTypedRomaji.length <= expectedRomaji.length) {
        const expectedChar = expectedRomaji[typedRomaji.length]; // 現在の位置の期待文字
        const inputChar = e.key.toLowerCase();
        console.log('Comparing:', inputChar, 'vs expected:', expectedChar);
        
        if (inputChar === expectedChar) {
          // 正しい入力
          console.log('Correct input!');
          setTypedRomaji(newTypedRomaji);
          setHasInputError(false);
          playCorrectSound();
          
          if (startTime) {
            const newStats = calculateStats(newTypedRomaji, expectedRomaji, startTime, retryCount);
            setStats(newStats);
          }
          
          if (newTypedRomaji === expectedRomaji) {
            setIsCompleted(true);
            playCompletionSound();
          }
        } else {
          // 間違った入力 - エラー状態にするが進ませない
          console.log('Incorrect input!');
          setHasInputError(true);
          playIncorrectSound();
          
          // 0.5秒後にエラー状態を解除
          setTimeout(() => {
            setHasInputError(false);
          }, 500);
        }
      } else {
        console.log('Input exceeds expected length');
      }
    } else {
      console.log('Invalid character input:', e.key);
    }
  }, [isCompleted, typedRomaji, expectedRomaji, startTime, retryCount, playCorrectSound, playIncorrectSound, playCompletionSound, calculateStats]);

  // キーボードイベントリスナーの設定
  useEffect(() => {
    console.log('Setting up keyboard event listener');
    const handler = (e: KeyboardEvent) => {
      console.log('Raw keyboard event detected:', e.key, e.type);
      handleKeyDown(e);
    };
    
    // documentとウィンドウの両方にイベントリスナーを追加
    document.addEventListener('keydown', handler, true); // キャプチャフェーズ
    window.addEventListener('keydown', handler, true);
    
    return () => {
      console.log('Removing keyboard event listener');
      document.removeEventListener('keydown', handler, true);
      window.removeEventListener('keydown', handler, true);
    };
  }, [handleKeyDown]);

  // 文章エリアのクリックとフォーカス管理
  const handleTextDisplayClick = () => {
    if (textDisplayRef.current) {
      textDisplayRef.current.focus();
      console.log('Text display focused');
    }
  };

  // テキスト表示エリア用のキーボードハンドラー
  const handleTextDisplayKeyDown = (e: React.KeyboardEvent) => {
    console.log('Text display keyboard event:', e.key);
    handleKeyDown(e.nativeEvent);
  };

  // 文字をひらがなに変換する関数
  const convertToHiragana = useCallback((text: string): string => {
    let result = '';
    let i = 0;
    
    while (i < text.length) {
      let matched = false;
      
      // 長い文字列から順に変換を試行
      for (let length = 6; length >= 1; length--) {
        const substr = text.substring(i, i + length);
        if (conversionMap[substr]) {
          result += conversionMap[substr];
          i += length;
          matched = true;
          break;
        }
      }
      
      // 変換対象でない文字はそのまま
      if (!matched) {
        result += text[i];
        i++;
      }
    }
    
    return result;
  }, []);

  // ひらがなをローマ字に変換する関数
  const convertToRomaji = useCallback((hiraganaText: string): string => {
    let result = '';
    let i = 0;
    
    while (i < hiraganaText.length) {
      let matched = false;
      
      // 拗音（2文字）から順に変換を試行
      for (let length = 2; length >= 1; length--) {
        const substr = hiraganaText.substring(i, i + length);
        if (hiraganaToRomajiMap[substr] !== undefined) {
          const romaji = hiraganaToRomajiMap[substr];
          
          // 促音（っ）の処理
          if (substr === 'っ' && i + 1 < hiraganaText.length) {
            const nextChar = hiraganaText[i + 1];
            const nextRomaji = hiraganaToRomajiMap[nextChar];
            if (nextRomaji && nextRomaji.length > 0) {
              result += nextRomaji[0]; // 次の子音を重ねる
            }
          } else {
            result += romaji;
          }
          
          i += length;
          matched = true;
          break;
        }
      }
      
      // 変換対象でない文字はそのまま
      if (!matched) {
        result += hiraganaText[i];
        i++;
      }
    }
    
    return result.toUpperCase();
  }, []);

  const getRandomText = useCallback((category: PracticeCategory, length: PracticeLength): string => {
    let texts: string[];
    
    if (category === 'news') {
      const todaysNews = getTodaysNews();
      texts = todaysNews[length];
    } else if (category === 'custom') {
      // カスタムカテゴリはまだ実装されていないため、一般文章を使用
      texts = textData.general[length];
    } else {
      texts = textData[category as ValidTextDataCategory][length];
    }
    
    const randomIndex = Math.floor(Math.random() * texts.length);
    return texts[randomIndex];
  }, []);

  const initializePractice = useCallback(() => {
    const text = getRandomText(category, length);
    const expectedHiragana = convertToHiragana(text);
    const romajiText = convertToRomaji(expectedHiragana);
    setCurrentText(text);
    setExpectedText(expectedHiragana);
    setExpectedRomaji(romajiText);
    setTypedRomaji('');
    setHasInputError(false);
    setStartTime(null);
    setIsCompleted(false);
    setStats({
      wpm: 0,
      accuracy: 0,
      totalChars: 0,
      correctChars: 0,
      incorrectChars: 0,
      score: 0,
      rank: 'E',
    });
    setShowResetConfirm(false);
    setCurrentTime(0);
    setRetryCount(0);
    if (textDisplayRef.current) {
      textDisplayRef.current.focus();
    }
  }, [category, length, getRandomText, convertToHiragana, convertToRomaji]);

  useEffect(() => {
    initializePractice();
    // 初期フォーカスを設定
    setTimeout(() => {
      if (textDisplayRef.current) {
        textDisplayRef.current.focus();
      }
    }, 200);
  }, [initializePractice]);

  // コンポーネントマウント後にフォーカス設定
  useEffect(() => {
    console.log('Component mounted, setting focus');
    const timer = setTimeout(() => {
      if (textDisplayRef.current) {
        textDisplayRef.current.focus();
        console.log('Focus set to text display');
      }
    }, 100);
    
    // ページの可視性が変わったときもフォーカスを再設定
    const handleVisibilityChange = () => {
      if (!document.hidden && textDisplayRef.current) {
        textDisplayRef.current.focus();
        console.log('Page visible, focus reset');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // ウィンドウフォーカス時の処理
  useEffect(() => {
    const handleWindowFocus = () => {
      if (textDisplayRef.current && !isCompleted) {
        textDisplayRef.current.focus();
        console.log('Window focused, text display focused');
      }
    };
    
    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [isCompleted]);


  const renderText = () => {
    let romajiIndex = 0;
    
    return currentText.split('').map((char, displayIndex) => {
      let className = 'char';
      
      const convertedChar = convertToHiragana(char);
      const convertedRomaji = convertToRomaji(convertedChar);
      const romajiLength = convertedRomaji.length;
      
      // ローマ字入力の進行状況に応じた色分け
      let isCompleted = false;
      let isCurrent = false;
      let hasError = false;
      
      // この文字のローマ字が完全に入力されているかチェック
      if (romajiIndex + romajiLength <= typedRomaji.length) {
        const expectedPart = expectedRomaji.substring(romajiIndex, romajiIndex + romajiLength);
        const typedPart = typedRomaji.substring(romajiIndex, romajiIndex + romajiLength);
        isCompleted = expectedPart === typedPart;
      } else if (romajiIndex < typedRomaji.length) {
        // 部分的に入力中
        isCurrent = true;
      } else if (romajiIndex === typedRomaji.length) {
        // 次に入力すべき文字
        isCurrent = true;
        hasError = hasInputError;
      }
      
      // 状況に応じてクラス名を設定
      if (isCompleted) {
        className += ' correct';
      } else if (isCurrent) {
        className += hasError ? ' error' : ' current';
      } else {
        className += ' pending';
      }
      
      // 次の文字のためにローマ字インデックスを進める
      const currentRomajiIndex = romajiIndex;
      romajiIndex += romajiLength;
      
      return (
        <span 
          key={displayIndex} 
          className={className}
          data-expected={convertedChar}
          data-romaji={convertedRomaji}
          data-index={currentRomajiIndex}
        >
          {char}
        </span>
      );
    });
  };

  const renderRomajiWithInput = useCallback(() => {
    return expectedRomaji.split('').map((char, index) => {
      let className = 'romaji-char';
      
      if (index < typedRomaji.length) {
        // 入力済み文字
        const typedChar = typedRomaji[index];
        className += typedChar === char ? ' correct' : ' incorrect';
      } else if (index === typedRomaji.length) {
        // 次に入力すべき文字
        className += hasInputError ? ' error-next' : ' current-next';
      } else {
        // 未入力文字
        className += ' pending';
      }
      
      return (
        <span key={index} className={className}>
          {index < typedRomaji.length ? typedRomaji[index] : char}
        </span>
      );
    });
  }, [expectedRomaji, typedRomaji, hasInputError]);

  const getNextKey = () => {
    if (typedRomaji.length < expectedRomaji.length) {
      return expectedRomaji[typedRomaji.length].toLowerCase();
    }
    return null;
  };

  const getFingerForKey = (key: string) => {
    const fingerMap: { [key: string]: string } = {
      'q': 'left-pinky', 'w': 'left-ring', 'e': 'left-middle', 'r': 'left-index', 't': 'left-index',
      'y': 'right-index', 'u': 'right-index', 'i': 'right-middle', 'o': 'right-ring', 'p': 'right-pinky',
      'a': 'left-pinky', 's': 'left-ring', 'd': 'left-middle', 'f': 'left-index', 'g': 'left-index',
      'h': 'right-index', 'j': 'right-index', 'k': 'right-middle', 'l': 'right-ring',
      'z': 'left-pinky', 'x': 'left-ring', 'c': 'left-middle', 'v': 'left-index', 'b': 'left-index',
      'n': 'right-index', 'm': 'right-index', ',': 'right-middle', '.': 'right-ring',
    };
    return fingerMap[key] || '';
  };

  const renderVirtualKeyboard = () => {
    const nextKey = getNextKey();
    const keyboardLayout = [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.']
    ];

    return (
      <div className="virtual-keyboard">
        <h3>キーボード</h3>
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key) => (
              <div
                key={key}
                className={`key ${nextKey === key ? 'highlighted' : ''}`}
              >
                {key.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };


  const handleResetClick = () => {
    if (typedRomaji.length > 0) {
      setShowResetConfirm(true);
    } else {
      initializePractice();
    }
  };

  const confirmReset = () => {
    if (typedRomaji.length > 0) {
      setRetryCount(prev => prev + 1);
    }
    initializePractice();
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  const handleGenerateCustomText = async () => {
    if (!customPrompt.trim()) return;
    
    setGeneratingText(true);
    try {
      // デモ用のモック実装（本来はOpenAI APIを呼び出し）
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockGeneratedTexts = [
        `${customPrompt.trim()}に関する文章です。これは生成AIによって作成された練習用のテキストで、タイピングスキルの向上を目的としています。`,
        `${customPrompt.trim()}について考えると、多くのことを学ぶことができます。この文章は日本語タイピング練習のために生成されました。`,
        `${customPrompt.trim()}をテーマにした文章を作成しました。ユーザーの入力したキーワードを基に、適切な長さのタイピング練習文を提供します。`
      ];
      
      const randomIndex = Math.floor(Math.random() * mockGeneratedTexts.length);
      const generatedText = mockGeneratedTexts[randomIndex];
      
      // 生成された文章をセット
      const expectedHiragana = convertToHiragana(generatedText);
      const romajiText = convertToRomaji(expectedHiragana);
      
      setCurrentText(generatedText);
      setExpectedText(expectedHiragana);
      setExpectedRomaji(romajiText);
      setTypedRomaji('');
      setHasInputError(false);
      setStartTime(null);
      setIsCompleted(false);
      setStats({
        wpm: 0,
        accuracy: 0,
        totalChars: 0,
        correctChars: 0,
        incorrectChars: 0,
        score: 0,
        rank: 'E',
      });
      setShowResetConfirm(false);
      setCurrentTime(0);
      setRetryCount(0);
      
      setShowCustomModal(false);
      setCustomPrompt('');
      
      if (textDisplayRef.current) {
        textDisplayRef.current.focus();
      }
    } catch (error) {
      console.error('文章生成エラー:', error);
      alert('文章の生成に失敗しました。もう一度お試しください。');
    } finally {
      setGeneratingText(false);
    }
  };

  return (
    <div className="typing-practice">
      {/* Main Content */}
      <div className="main-content">
        <div className="header-container">
        <div className="header">
        <h1>日本語タイピング練習</h1>
        
        <div className="category-selector">
          <h3>ジャンル選択</h3>
          <div className="selector-buttons">
            <button
              className={category === 'general' ? 'active' : ''}
              onClick={() => onCategoryChange('general')}
            >
              一般文章
            </button>
            <button
              className={category === 'news' ? 'active' : ''}
              onClick={() => onCategoryChange('news')}
            >
              今日のニュース
            </button>
            <button
              className={category === 'yamanashi' ? 'active' : ''}
              onClick={() => onCategoryChange('yamanashi')}
            >
              山梨県のお題
            </button>
            <button
              className={category === 'literature' ? 'active' : ''}
              onClick={() => onCategoryChange('literature')}
            >
              日本文学
            </button>
            <button
              className={category === 'it' ? 'active' : ''}
              onClick={() => onCategoryChange('it')}
            >
              IT用語
            </button>
            <button
              className={category === 'custom' ? 'active' : ''}
              onClick={() => {
                onCategoryChange('custom');
                setShowCustomModal(true);
              }}
            >
              カスタム文章
            </button>
          </div>
        </div>

        <div className="length-selector">
          <h3>文章の長さ</h3>
          <div className="selector-buttons">
            <button
              className={length === 'short' ? 'active' : ''}
              onClick={() => onLengthChange('short')}
            >
              短文
            </button>
            <button
              className={length === 'long' ? 'active' : ''}
              onClick={() => onLengthChange('long')}
            >
              長文
            </button>
          </div>
        </div>
        </div>

      </div>


      <div className="practice-container">
        {/* Real-time Statistics Bar */}
        {!isCompleted && startTime && (
          <div className="realtime-stats-bar">
            <div className="stat-item-live">
              <span className="stat-icon">⚡</span>
              <div className="stat-content">
                <span className="stat-value-live">{stats.wpm}</span>
                <span className="stat-label-live">WPM</span>
              </div>
            </div>
            <div className="stat-item-live">
              <span className="stat-icon">🎯</span>
              <div className="stat-content">
                <span className="stat-value-live">{stats.accuracy.toFixed(1)}</span>
                <span className="stat-label-live">正確率%</span>
              </div>
            </div>
            <div className="stat-item-live">
              <span className="stat-icon">⏱️</span>
              <div className="stat-content">
                <span className="stat-value-live">{currentTime}</span>
                <span className="stat-label-live">秒</span>
              </div>
            </div>
            <div className="stat-item-live">
              <span className="stat-icon">📊</span>
              <div className="stat-content">
                <span className="stat-value-live">{typedRomaji.length}/{expectedRomaji.length}</span>
                <span className="stat-label-live">進捗</span>
              </div>
            </div>
          </div>
        )}
        
        <div 
          ref={textDisplayRef}
          className={`text-display font-size-${fontSize} ${!isCompleted ? 'interactive' : 'completed'}`}
          onClick={handleTextDisplayClick}
          onKeyDown={handleTextDisplayKeyDown}
          tabIndex={0}
          role="textbox"
          aria-label="タイピング練習エリア"
        >
          <div className="single-tier-display">
            <div className="tier-japanese">
              {renderText()}
            </div>
          </div>
        </div>

        <div className="controls">
          <button onClick={handleResetClick} className="reset-button">
            リセット
          </button>
        </div>

        {/* Virtual Keyboard */}
        {!isCompleted && (
          <div className="keyboard-section">
            {renderVirtualKeyboard()}
          </div>
        )}
      </div>

      {showResetConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>リセット確認</h3>
            <p>練習の進捗がすべて削除されます。<br />本当にリセットしますか？</p>
            <div className="modal-buttons">
              <button onClick={cancelReset} className="modal-button-cancel">
                キャンセル
              </button>
              <button onClick={confirmReset} className="modal-button-confirm">
                リセット
              </button>
            </div>
          </div>
        </div>
      )}

      {showCustomModal && (
        <div className="modal-overlay">
          <div className="modal-content custom-modal">
            <h3>カスタム文章を作成</h3>
            <p>AIが生成する文章のテーマやキーワードを入力してください。</p>
            <div className="custom-prompt-section">
              <textarea
                className="custom-prompt-input"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="例：「桜の季節について」「プログラミングの楽しさ」「宇宙への憧れ」など"
                rows={3}
                maxLength={200}
              />
              <div className="character-count">
                {customPrompt.length}/200文字
              </div>
            </div>
            <div className="modal-buttons">
              <button 
                onClick={() => {
                  setShowCustomModal(false);
                  setCustomPrompt('');
                  if (category === 'custom') {
                    onCategoryChange('general');
                  }
                }}
                className="modal-button-cancel"
              >
                キャンセル
              </button>
              <button 
                onClick={() => handleGenerateCustomText()}
                disabled={!customPrompt.trim() || generatingText}
                className="modal-button-confirm"
              >
                {generatingText ? '生成中...' : '文章を生成'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="completion-message">
          <h2>完了しました！</h2>
          
          {/* ランク結果表示 */}
          <div className="completion-rank">
            <div 
              className="completion-rank-badge" 
              style={{ backgroundColor: getRankColor(stats.rank) }}
            >
              {stats.rank}
            </div>
            <div className="completion-rank-info">
              <div className="completion-rank-title">練習完了</div>
              <div className="completion-rank-score">総合スコア: {stats.score}点</div>
            </div>
          </div>
          
          <div className="stats-display">
            <div className="stat-item">
              <span className="stat-label">最終速度</span>
              <span className="stat-value">{stats.wpm} WPM</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">正確率</span>
              <span className="stat-value">{stats.accuracy}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">文字数</span>
              <span className="stat-value">{stats.totalChars}</span>
            </div>
            {retryCount > 0 && (
              <div className="stat-item">
                <span className="stat-label">リトライ回数</span>
                <span className="stat-value">{retryCount}</span>
              </div>
            )}
          </div>
        </div>
      )}

      </div>

      {/* Right Sidebar - Only show after completion */}
      {isCompleted && (
        <div className="right-sidebar">
          <h3 className="sidebar-title">📊 今回の成績</h3>
          <div className="sidebar-content">
            <div className="current-stats">
              {/* ランク表示 */}
              <div className="rank-display">
                <div 
                  className="rank-badge" 
                  style={{ backgroundColor: getRankColor(stats.rank) }}
                >
                  {stats.rank}
                </div>
                <div className="rank-info">
                  <div className="rank-title">練習完了</div>
                  <div className="rank-score">スコア: {stats.score}</div>
                </div>
              </div>
              
              {/* 統計情報 */}
              <div className="sidebar-stat">
                <div className="sidebar-stat-label">最終WPM</div>
                <div className="sidebar-stat-value">{stats.wpm}</div>
              </div>
              <div className="sidebar-stat">
                <div className="sidebar-stat-label">正確率</div>
                <div className="sidebar-stat-value">{stats.accuracy}%</div>
              </div>
              <div className="sidebar-stat">
                <div className="sidebar-stat-label">完了時間</div>
                <div className="sidebar-stat-value">{currentTime}秒</div>
              </div>
              <div className="sidebar-stat">
                <div className="sidebar-stat-label">間違い</div>
                <div className="sidebar-stat-value">{stats.incorrectChars}</div>
              </div>
              {retryCount > 0 && (
                <div className="sidebar-stat">
                  <div className="sidebar-stat-label">リトライ回数</div>
                  <div className="sidebar-stat-value">{retryCount}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypingPractice;