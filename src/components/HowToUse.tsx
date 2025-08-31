import React from 'react';
import './HowToUse.css';

const HowToUse: React.FC = () => {
  return (
    <div className="how-to-use">
      <div className="how-to-use-container">
        <h1>タイピングの使い方ガイド</h1>
        
        {/* ホームポジションセクション */}
        <section className="home-position-section">
          <h2>📍 正しい指の配置（ホームポジション）</h2>
          
          <div className="section-content">
            <p className="intro-text">
              タイピングの基本は<strong>「正しい指の配置（ホームポジション）」</strong>です。
              これをマスターすることで、効率的で正確なタイピングが可能になります。
            </p>
            
            <div className="position-guide">
              <h3>基本の構え方</h3>
              <ul>
                <li>
                  <span className="key-highlight">F</span>と<span className="key-highlight">J</span>キーの突起を目印にしましょう
                  <p className="sub-text">ほとんどのキーボードには、この2つのキーに小さな突起があります</p>
                </li>
              </ul>
              
              <div className="finger-placement">
                <h3>各指の配置</h3>
                <div className="hand-positions">
                  <div className="left-hand">
                    <h4>👈 左手</h4>
                    <ul>
                      <li><span className="finger">小指</span>：<span className="key">A</span>キー</li>
                      <li><span className="finger">薬指</span>：<span className="key">S</span>キー</li>
                      <li><span className="finger">中指</span>：<span className="key">D</span>キー</li>
                      <li><span className="finger">人差し指</span>：<span className="key">F</span>キー</li>
                    </ul>
                  </div>
                  
                  <div className="right-hand">
                    <h4>👉 右手</h4>
                    <ul>
                      <li><span className="finger">人差し指</span>：<span className="key">J</span>キー</li>
                      <li><span className="finger">中指</span>：<span className="key">K</span>キー</li>
                      <li><span className="finger">薬指</span>：<span className="key">L</span>キー</li>
                      <li><span className="finger">小指</span>：<span className="key">;</span>キー</li>
                    </ul>
                  </div>
                </div>
                
                <div className="thumb-position">
                  <p>👍 <strong>親指</strong>は両手とも<span className="key-highlight">スペースキー</span>の上に軽く置きます</p>
                </div>
              </div>
            </div>
            
            <div className="position-tips">
              <h3>💡 ポイント</h3>
              <ul>
                <li>手首はまっすぐに保ち、力を入れすぎないようにしましょう</li>
                <li>指は軽く曲げて、キーの上に自然に置きます</li>
                <li>肘は体の横に自然に下ろし、肩の力を抜きましょう</li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* 練習方法セクション */}
        <section className="practice-method-section">
          <h2>🎯 上達するための練習方法</h2>
          
          <div className="section-content">
            <div className="practice-step">
              <h3>1️⃣ 基礎練習から始めよう</h3>
              <p>
                最初は短い単語や文章から始めることが重要です。
                いきなり長文に挑戦するのではなく、基本的な単語を確実に打てるようになることを目指しましょう。
              </p>
              <ul>
                <li>まずは「あいうえお」などの基本的な文字から</li>
                <li>次に2〜3文字の短い単語へ</li>
                <li>慣れてきたら短い文章に挑戦</li>
              </ul>
            </div>
            
            <div className="practice-step">
              <h3>2️⃣ 画面だけを見て入力する</h3>
              <p>
                <strong>キーボードを見ずに画面だけを見て練習すること</strong>が上達の鍵です。
                最初は遅くても構いません。正確性を重視しましょう。
              </p>
              <ul>
                <li>ホームポジションを崩さないように意識</li>
                <li>間違えても焦らず、正しい指で打ち直す</li>
                <li>徐々にスピードは自然に上がっていきます</li>
              </ul>
            </div>
            
            <div className="practice-step">
              <h3>3️⃣ 指の役割を意識する</h3>
              <p>
                各キーを担当する指を意識しながら練習しましょう。
                正しい指使いを身につけることで、効率的なタイピングが可能になります。
              </p>
              <ul>
                <li>各指が担当するキーを覚える</li>
                <li>間違った指で打ったらやり直す習慣を</li>
                <li>指の動きを最小限に抑えることを意識</li>
              </ul>
            </div>
            
            <div className="practice-step">
              <h3>4️⃣ 毎日続けることが大切</h3>
              <p>
                タイピングスキルの向上には<strong>継続的な練習</strong>が不可欠です。
                1日10分でも良いので、毎日練習する習慣をつけましょう。
              </p>
              <ul>
                <li>毎日同じ時間に練習する習慣を作る</li>
                <li>短時間でも集中して取り組む</li>
                <li>自分の成長を記録して、モチベーションを保つ</li>
              </ul>
            </div>
            
            <div className="motivation-message">
              <p>
                🌟 タイピングは練習すれば必ず上達します。<br />
                焦らず、楽しみながら続けていきましょう！
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowToUse;