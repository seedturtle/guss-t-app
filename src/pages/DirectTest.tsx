import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DIRECT_ITEMS_SEMI_SOLID, DIRECT_ITEMS_LIQUID, DIRECT_ITEMS_SOLID } from '../data';

const DirectTest: React.FC = () => {
  const { phase } = useParams<{phase: string}>();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ semiSolid: 0, liquid: 0, solid: 0 });
  const [stopped, setStopped] = useState(false);
  const [stopInfo, setStopInfo] = useState({ phase: '', reason: '' });
  const [phaseScore, setPhaseScore] = useState(0);
  const [indirectScore, setIndirectScore] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('guss_t_indirect');
    if (stored) setIndirectScore(JSON.parse(stored).score);
    const semi = localStorage.getItem('guss_t_semi');
    const liq = localStorage.getItem('guss_t_liquid');
    if (semi) setScores(s => ({...s, semiSolid: JSON.parse(semi)}));
    if (liq) setScores(s => ({...s, liquid: JSON.parse(liq)}));
  }, []);

  const getItems = () => {
    if (phase === 'liquid') return DIRECT_ITEMS_LIQUID;
    if (phase === 'solid') return DIRECT_ITEMS_SOLID;
    return DIRECT_ITEMS_SEMI_SOLID;
  };

  const items = getItems();

  const getPhaseLabel = () => {
    if (phase === 'liquid') return { icon: '💧', label: '液體測試', cls: 'liquid', hint: '使用杯子，依序給予 3 → 5 → 10 → 20 → 50 毫升的水' };
    if (phase === 'solid') return { icon: '🍞', label: '固體測試', cls: 'solid', hint: '給予去邊吐司、去皮饅頭或餅乾（不超過 1.5cm × 1.5cm）' };
    return { icon: '🥣', label: '半固體測試', cls: 'semi-solid', hint: '給予半茶匙（約 2.5ml）增稠水，然後可再給予 3-5 茶匙' };
  };

  const phaseInfo = getPhaseLabel();

  const handleAnswer = (score: number, stop?: boolean, _value?: string) => {
    const newScore = phaseScore + score;
    setPhaseScore(newScore);

    if (stop) {
      setStopped(true);
      const phaseKey = phase === 'liquid' ? 'liquid' : phase === 'solid' ? 'solid' : 'semiSolid';
      const updatedScores = { ...scores, [phaseKey]: score };
      localStorage.setItem(`guss_t_${phaseKey}`, JSON.stringify(score));
      localStorage.setItem('guss_t_result', JSON.stringify({
        stop: true,
        stopPhase: phase,
        stopReason: items[step].question,
        scores: updatedScores,
        indirectScore,
        total: indirectScore + score,
      }));
      setScores(updatedScores);
      setStopInfo({ phase: phaseInfo.label, reason: items[step].question });
      return;
    }

    if (step < items.length - 1) {
      setStep(step + 1);
    } else {
      const phaseKey = phase === 'liquid' ? 'liquid' : phase === 'solid' ? 'solid' : 'semiSolid';
      const updatedScores = { ...scores, [phaseKey]: newScore };
      setScores(updatedScores);
      localStorage.setItem(`guss_t_${phaseKey}`, JSON.stringify(newScore));

      if (phase === 'semi-solid') {
        if (newScore < 5) { navigate('/result'); return; }
        setTimeout(() => navigate('/direct-test/liquid'), 500);
      } else if (phase === 'liquid') {
        if (newScore < 5) { navigate('/result'); return; }
        setTimeout(() => navigate('/direct-test/solid'), 500);
      } else {
        localStorage.setItem('guss_t_result', JSON.stringify({
          stop: false,
          scores: updatedScores,
          indirectScore,
          total: indirectScore + newScore,
          semiSolid: updatedScores.semiSolid,
          liquid: updatedScores.liquid,
          solid: newScore,
        }));
        navigate('/result');
      }
    }
  };

  const item = items[step];

  if (stopped) {
    return (
      <div className="page">
        <div className="header">
          <span className="header-icon">🛑</span>
          <h1>直接測試 - {phaseInfo.label} 停止</h1>
          <p>根據 GUSS-T，由於觀察到異常指標，需終止測試</p>
        </div>
        <div className="stop-banner">
          <span className="stop-banner-icon">🛑</span>
          <h3>測試在「{phaseInfo.label}」中斷</h3>
          <p>異常項目：<strong>{stopInfo.reason}</strong></p>
          <p>此階段分數：<strong>{phaseScore}</strong></p>
        </div>
        <button className="btn btn-danger" style={{width:'100%'}} onClick={()=>navigate('/result')}>
          📊 查看評估結果
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="header">
        <span className="header-icon">🍽️</span>
        <h1>{phaseInfo.label}</h1>
        <p>第二部分：直接觀察患者進食情況</p>
      </div>

      <div className="phase-dots">
        {['semi-solid','liquid','solid'].map(p => (
          <div key={p} className={`phase-dot ${p === phase ? 'current' : scores[p === 'semi-solid' ? 'semiSolid' : p === 'liquid' ? 'liquid' : 'solid'] !== undefined ? 'completed' : 'pending'}`} />
        ))}
      </div>

      <div className="step-counter">第 {step + 1} / {items.length} 題 · {phaseInfo.label}</div>
      <div className="progress-bar"><div className="progress-fill" style={{width:`${((step+1)/items.length)*100}%`}} /></div>

      <div className="card">
        <span className={`phase-badge ${phaseInfo.cls}`}>{phaseInfo.icon} {phaseInfo.label}</span>
        <div className="card-title" style={{marginTop:8}}>
          <span className="step-badge">{step+1}</span>
          {item.icon} {item.question}
        </div>
        {item.volumeHint && (
          <div style={{fontSize:13, color:'#0081a7', fontWeight:600, marginBottom:8, background:'#e3f2fd', padding:'6px 12px', borderRadius:8, display:'inline-block'}}>
            📏 {item.volumeHint}
          </div>
        )}
        <div className="question-desc">{item.description}</div>
        <div className="cartoon-box">
          <span className="cartoon-icon">{item.typeIcon}</span>
          <div className="cartoon-text"><strong>📌 操作提示</strong>{item.cartoonHint}</div>
        </div>
        <div className="options">
          {item.options.map((opt, i) => (
            <button key={i} className={`option-btn ${opt.stop ? 'stop-warning' : ''}`} onClick={() => handleAnswer(opt.score, opt.stop, opt.value)}>
              <span className="option-icon">{i === 0 ? '🔴' : i === 1 ? '⚠️' : '✅'}</span>
              <span className="option-label">{opt.label}</span>
              <span className="option-score">({opt.score}分){opt.stop ? ' ⚠️停止' : ''}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="btn-group" style={{marginTop:8}}>
        <button className="btn btn-secondary" onClick={() => phase === 'semi-solid' ? navigate('/indirect-test') : navigate('/direct-test/semi-solid')}>
          ← 上一步
        </button>
      </div>
    </div>
  );
};
export default DirectTest;
