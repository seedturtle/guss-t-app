import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INDIRECT_ITEMS } from '../data';

const IndirectTest: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number)[]>([0, 0, 0, 0, 0]);
  const [stopped, setStopped] = useState(false);
  const [stopReason, setStopReason] = useState('');
  const [indirectScore, setIndirectScore] = useState(0);

  const handleAnswer = (score: number, next?: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = score;
    setAnswers(newAnswers);
    const label = INDIRECT_ITEMS[step].question;
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

  const item = INDIRECT_ITEMS[step];
  const progress = ((step + 1) / INDIRECT_ITEMS.length) * 100;

  if (stopped) {
    return (
      <div className="page">
        <div className="header"><span className="header-icon">🛑</span><h1>間接測試 - 需停止</h1></div>
        <div className="stop-banner">
          <span className="stop-banner-icon">🛑</span>
          <h3>測試停止</h3>
          <p>異常項目：<strong>{stopReason}</strong></p>
          <p>間接測試分數：<strong>{indirectScore} / 5</strong></p>
        </div>
        <div className="btn-group">
          <button className="btn btn-danger" onClick={() => navigate('/result')}>查看評估結果 →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="header">
        <span className="header-icon">🌙</span>
        <h1>間接吞嚥測試</h1><p>第一部分：觀察患者的基本吞嚥能力</p>
      </div>
      <div className="step-counter">第 {step + 1} / {INDIRECT_ITEMS.length} 題</div>
      <div className="progress-bar"><div className="progress-fill" style={{width: `${progress}%`}} /></div>
      <div className="card">
        <div className="card-title">
          <span className="step-badge">{step + 1}</span>
          {item.icon} {item.question}
        </div>
        {item.description && <div className="question-desc">{item.description}</div>}
        <div className="cartoon-box">
          <span className="cartoon-icon">👩‍⚕️</span>
          <div className="cartoon-text"><strong>📌 操作提示</strong>{item.cartoonHint}</div>
        </div>
        <div className="options">
          {item.options.map((opt) => (
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
      <div className="btn-group" style={{marginTop: 8}}>
        <button className="btn btn-secondary" onClick={() => navigate('/patient-info')}>← 患者資料</button>
      </div>
    </div>
  );
};
export default IndirectTest;
