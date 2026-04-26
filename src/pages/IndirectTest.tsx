import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { INDIRECT_ITEMS } from '../data';
import CartoonModal from '../components/CartoonModal';

const IndirectTest: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([0, 0, 0, 0, 0]);
  const [modalOpen, setModalOpen] = useState(false);

  // 每次進入測試，清除上一次殘留資料
  useEffect(() => {
    localStorage.removeItem('guss_t_indirect');
    localStorage.removeItem('guss_t_semi');
    localStorage.removeItem('guss_t_liquid');
    localStorage.removeItem('guss_t_result');
    localStorage.removeItem('guss_t_info');
  }, []);

  const currentItem = INDIRECT_ITEMS[step];
  const cartoonImg = `/cartoon/indirect-${step + 1}.png`;

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers];
    newAnswers[step] = score;
    setAnswers(newAnswers);

    if (step < INDIRECT_ITEMS.length - 1) {
      setStep(step + 1);
    } else {
      // 全部五題作答完畢，計算總分
      const finalScore = newAnswers.reduce((acc, v) => acc + v, 0);
      localStorage.setItem('guss_t_indirect', JSON.stringify({ answers: newAnswers, score: finalScore }));
      if (finalScore < 5) {
        // 低於5分：停止，直接顯示結果
        localStorage.setItem('guss_t_result', JSON.stringify({
          stop: true,
          stopPhase: 'indirect',
          scores: { semiSolid: 0, liquid: 0, solid: 0 },
          indirectScore: finalScore,
          total: finalScore,
          semiSolid: 0, liquid: 0, solid: 0,
        }));
        navigate('/result');
      } else {
        // 5分及以上：進入直接測試
        navigate('/direct-test/semi-solid');
      }
    }
  };

  const progress = ((step + 1) / INDIRECT_ITEMS.length) * 100;

  return (
    <div className="page">
      <div className="header">
        <span className="header-icon">🌙</span>
        <h1>間接吞嚥測試</h1>
        <p>第一部分：觀察患者的基本吞嚥能力（全部 {INDIRECT_ITEMS.length} 題）</p>
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

        <div
          className="cartoon-box"
          style={{ cursor: 'pointer' }}
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
              className="option-btn"
              onClick={() => handleAnswer(opt.score)}
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

      {modalOpen && (
        <CartoonModal
          src={cartoonImg}
          alt={currentItem.question}
          caption={currentItem.cartoonHint}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default IndirectTest;
