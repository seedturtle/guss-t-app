import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DIRECT_ITEMS_SEMI_SOLID, DIRECT_ITEMS_LIQUID, DIRECT_ITEMS_SOLID } from '../data';
import CartoonModal from '../components/CartoonModal';

const CARTOON_MAP: Record<string, Record<number, string>> = {
  'semi-solid': { 0: '/cartoon/semi-1.png', 1: '/cartoon/semi-2.png', 2: '/cartoon/semi-3.png', 3: '/cartoon/semi-4.png' },
  liquid:      { 0: '/cartoon/liquid-1.png', 1: '/cartoon/liquid-2.png', 2: '/cartoon/semi-3.png', 3: '/cartoon/semi-4.png' },
  solid:       { 0: '/cartoon/solid-1.png', 1: '/cartoon/solid-2.png', 2: '/cartoon/semi-3.png', 3: '/cartoon/semi-4.png' },
};

const DirectTest: React.FC = () => {
  const { phase } = useParams<{phase: string}>();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ semiSolid: 0, liquid: 0, solid: 0 });
  const [stopped, setStopped] = useState(false);
  const [stopInfo, setStopInfo] = useState({ phase: '', reason: '' });
  const [phaseScore, setPhaseScore] = useState(0);
  const [indirectScore, setIndirectScore] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

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
    if (phase === 'liquid') return { icon: '💧', label: '液體測試', cls: 'liquid' };
    if (phase === 'solid') return { icon: '🍞', label: '固體測試', cls: 'solid' };
    return { icon: '🥣', label: '半固體測試', cls: 'semi-solid' };
  };

  const phaseInfo = getPhaseLabel();
  const currentPhase = phase || 'semi-solid';
  const cartoonImg = CARTOON_MAP[currentPhase]?.[step] || '/cartoon/semi-1.png';

  const saveResult = (finalScores: typeof scores, totalScore: number, stop: boolean, stopReason?: string, stopPhase?: string) => {
    localStorage.setItem('guss_t_result', JSON.stringify({
      stop,
      stopReason,
      stopPhase,
      scores: finalScores,
      indirectScore,
      total: totalScore,
      semiSolid: finalScores.semiSolid,
      liquid: finalScores.liquid,
      solid: finalScores.solid,
    }));
  };

  const handleAnswer = (score: number, stop?: boolean) => {
    const newPhaseScore = phaseScore + score;
    setPhaseScore(newPhaseScore);

    if (stop) {
      // 停止：將「此題得 0 分」加入，並立即跳轉結果頁
      const phaseKey = currentPhase === 'liquid' ? 'liquid' : currentPhase === 'solid' ? 'solid' : 'semiSolid';
      const updatedScores = { ...scores, [phaseKey]: newPhaseScore };
      setScores(updatedScores);
      localStorage.setItem(`guss_t_${phaseKey}`, JSON.stringify(newPhaseScore));
      const totalScore = indirectScore + newPhaseScore;
      saveResult(updatedScores, totalScore, true, items[step].question, phaseInfo.label);
      navigate('/result');
      return;
    }

    if (step < items.length - 1) {
      setStep(step + 1);
    } else {
      // 本階段全部完成，根據分數決定下一步
      const phaseKey = currentPhase === 'liquid' ? 'liquid' : currentPhase === 'solid' ? 'solid' : 'semiSolid';
      const updatedScores = { ...scores, [phaseKey]: newPhaseScore };
      setScores(updatedScores);
      localStorage.setItem(`guss_t_${phaseKey}`, JSON.stringify(newPhaseScore));

      if (newPhaseScore < 5) {
        // 1-4 分：停止，直接顯示結果
        saveResult(updatedScores, indirectScore + newPhaseScore, false);
        navigate('/result');
      } else {
        // 5 分：進入下一階段
        if (currentPhase === 'semi-solid') {
          saveResult(updatedScores, indirectScore + newPhaseScore, false);
          setTimeout(() => navigate('/direct-test/liquid'), 500);
        } else if (currentPhase === 'liquid') {
          saveResult(updatedScores, indirectScore + newPhaseScore, false);
          setTimeout(() => navigate('/direct-test/solid'), 500);
        } else {
          saveResult(updatedScores, indirectScore + newPhaseScore, false);
          navigate('/result');
        }
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
          <div key={p} className={`phase-dot ${p === phase ? 'current' : scores[p === 'semi-solid' ? 'semiSolid' : p === 'liquid' ? 'liquid' : 'solid'] !== 0 ? 'completed' : 'pending'}`} />
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

        <div className="cartoon-box" style={{ cursor: 'pointer' }} onClick={() => setModalOpen(true)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setModalOpen(true)} aria-label="點擊查看操作示意圖">
          <span className="cartoon-icon">📖</span>
          <div className="cartoon-text">
            <strong>📌 操作提示 — 點我看圖</strong>
            <div style={{ marginTop: 4, fontSize: 12, color: '#888' }}>{item.cartoonHint}</div>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 20, flexShrink: 0 }}>🔍</span>
        </div>

        <div className="options">
          {item.options.map((opt, i) => (
            <button key={i} className={`option-btn ${opt.stop ? 'stop-warning' : ''}`} onClick={() => handleAnswer(opt.score, opt.stop)}>
              <span className="option-icon">{i === 0 ? '🔴' : i === 1 ? '⚠️' : '✅'}</span>
              <span className="option-label">{opt.label}</span>
              <span className="option-score">({opt.score}分){opt.stop ? ' ⚠️停止' : ''}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="btn-group" style={{marginTop:8}}>
        <button className="btn btn-secondary" onClick={() => currentPhase === 'semi-solid' ? navigate('/indirect-test') : navigate('/direct-test/semi-solid')}>
          ← 上一步
        </button>
      </div>

      {modalOpen && (
        <CartoonModal
          src={cartoonImg}
          alt={item.question}
          caption={item.cartoonHint}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};
export default DirectTest;