import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INDIRECT_ITEMS } from '../data';
import CartoonModal from '../components/CartoonModal';

const IndirectTest: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([0, 0, 0, 0, 0]);
  const [stopped, setStopped] = useState(false);
  const [stopReason, setStopReason] = useState('');
  const [indirectScore, setIndirectScore] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const currentItem = INDIRECT_ITEMS[step];
  const cartoonImg = `/cartoon/indirect-${step + 1}.png`;

  const handleAnswer = (score: number, next?: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = score;
    setAnswers(newAnswers);
    const label = currentItem.question;
    if (next === 'stop') {
      const s = newAnswers.reduce((acc, v) => acc + v, 0);
      setIndirectScore(s);
      setStopReason(label);
      setStopped(true);
      return;
    }
    if (step < INDIRECT_ITEMS.length - 1) {
      setStep(step + 1);
    } else {
      const finalScore = newAnswers.reduce((acc, v) => acc + v, 0);
      setIndirectScore(finalScore);
      localStorage.setItem('guss_t_indirect', JSON.stringify({ answers: newAnswers, score: finalScore }));
      if (finalScore >= 5) navigate('/direct-test/semi-solid');
      else navigate('/result');
    }
  };

  const progress = ((step + 1) / INDIRECT_ITEMS.length) * 100;

  return (
    <div className="page">
      <div className="header">
        <span className="header-icon">🌙</span>
        <h1>間接吞嚥測試</h1>
        <p>第一部分：觀察患者的基本吞嚥能力</p>
      </div>

      <div className="step-counter">第 {step + 1} / {INDIRECT_ITEMS.length} 題</div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="card">
        <div className="card-title">
          <span className="step-badge">{step + 1}</span>
          {currentItem.icon} {currentItem.question}
        </div>
        {currentItem.description && <div className="question-desc">{currentItem.description}</div>}

        {/* Cartoon Box — clickable */}
        <div
          className="cartoon-box"
          style={{ cursor: 'pointer', position: 'relative' }}
          onClick={() => setModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setModalOpen(true)}
          aria-label="點擊查看操作示意圖"
        >
          <span className="cartoon-icon">📖</span>
          <div className="cartoon-text">
            <strong>📌 操作提示 — 點我看圖</strong>
            <div style={{ marginTop: 4, fontSize: 12, color: '#888' }}>{currentItem.cartoonHint}</div>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 20, flexShrink: 0 }}>🔍</span>
        </div>

        <div className="options">
          {currentItem.options.map((opt) => (
            <button
              key={opt.value}
              className={`option-btn ${opt.next === 'stop' ? 'stop-warning' : ''}`}
              onClick={() => handleAnswer(opt.score, opt.next)}
            >
              <span className="option-icon">{opt.score === 1 ? '✅' : '❌'}</span>
              <span className="option-label">{opt.label}</span>
              <span className="option-score">({opt.score}分)</span>
            </button>
          ))}
        </div>
      </div>

      <div className="btn-group" style={{ marginTop: 8 }}>
        <button className="btn btn-secondary" onClick={() => navigate('/patient-info')}>← 患者資料</button>
      </div>

      {/* Cartoon Modal */}
      {modalOpen && (
        <CartoonModal
          src={cartoonImg}
          alt={currentItem.question}
          caption={currentItem.cartoonHint}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Stopped Banner */}
      {stopped && (
        <div className="stop-banner">
          <span className="stop-banner-icon">🛑</span>
          <h3>測試停止</h3>
          <p>異常項目：<strong>{stopReason}</strong></p>
          <p>間接測試分數：<strong>{indirectScore} / 5</strong></p>
          <button className="btn btn-danger" onClick={() => navigate('/result')}>查看評估結果 →</button>
        </div>
      )}
    </div>
  );
};

export default IndirectTest;
