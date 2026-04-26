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
  const currentPhase: string = phase || 'semi-solid';

  const [step, setStep] = useState(0);
  const [phaseScores, setPhaseScores] = useState<number[]>([0, 0, 0, 0]); // scores for each of 4 items in current phase
  const [indirectScore, setIndirectScore] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  // Accumulated scores across all completed phases
  const [completedScores, setCompletedScores] = useState({ semiSolid: 0, liquid: 0, solid: 0 });

  useEffect(() => {
    const stored = localStorage.getItem('guss_t_indirect');
    if (stored) setIndirectScore(JSON.parse(stored).score);
    // Load completed phase scores from localStorage
    const semi = localStorage.getItem('guss_t_semi');
    const liq = localStorage.getItem('guss_t_liquid');
    const sol = localStorage.getItem('guss_t_solid');
    setCompletedScores({
      semiSolid: semi ? JSON.parse(semi) : 0,
      liquid: liq ? JSON.parse(liq) : 0,
      solid: sol ? JSON.parse(sol) : 0,
    });
    // Reset current phase scores — each phase starts fresh
    setPhaseScores([0, 0, 0, 0]);
    setStep(0);
  }, [currentPhase]); // ← 關鍵：每次進入不同 phase 就重置

  const getItems = () => {
    if (currentPhase === 'liquid') return DIRECT_ITEMS_LIQUID;
    if (currentPhase === 'solid') return DIRECT_ITEMS_SOLID;
    return DIRECT_ITEMS_SEMI_SOLID;
  };

  const items = getItems();
  const currentItem = items[step];
  const cartoonImg = CARTOON_MAP[currentPhase]?.[step] || '/cartoon/semi-1.png';

  const getPhaseLabel = () => {
    if (currentPhase === 'liquid') return { icon: '💧', label: '液體測試', cls: 'liquid' };
    if (currentPhase === 'solid') return { icon: '🍞', label: '固體測試', cls: 'solid' };
    return { icon: '🥣', label: '半固體測試', cls: 'semi-solid' };
  };

  const phaseInfo = getPhaseLabel();

  const handleAnswer = (score: number) => {
    const newScores = [...phaseScores];
    newScores[step] = score;
    setPhaseScores(newScores);

    if (step < items.length - 1) {
      // 還有下一題
      setStep(step + 1);
    } else {
      // 本階段全部四題作答完畢，計算階段總分
      const phaseTotal = newScores.reduce((acc, v) => acc + v, 0);
      const phaseKey = currentPhase === 'liquid' ? 'liquid' : currentPhase === 'solid' ? 'solid' : 'semiSolid';

      const updatedScores = { ...completedScores, [phaseKey]: phaseTotal };
      setCompletedScores(updatedScores);
      localStorage.setItem(`guss_t_${phaseKey}`, JSON.stringify(phaseTotal));

      if (currentPhase === 'semi-solid') {
        localStorage.setItem('guss_t_result', JSON.stringify({
          stop: false,
          scores: updatedScores,
          indirectScore,
          total: indirectScore + phaseTotal,
          semiSolid: phaseTotal, liquid: 0, solid: 0,
        }));
        // 顯示過場訊息後進入液體測試 Step 1
        setTimeout(() => { window.location.href = '/direct-test/liquid'; }, 600);
      } else if (currentPhase === 'liquid') {
        localStorage.setItem('guss_t_result', JSON.stringify({
          stop: false,
          scores: updatedScores,
          indirectScore,
          total: indirectScore + updatedScores.semiSolid + phaseTotal,
          semiSolid: updatedScores.semiSolid, liquid: phaseTotal, solid: 0,
        }));
        // 進入固體測試
        setTimeout(() => { window.location.href = '/direct-test/solid'; }, 600);
      } else {
        // 固體是最後一 phase，顯示結果
        localStorage.setItem('guss_t_result', JSON.stringify({
          stop: false,
          scores: updatedScores,
          indirectScore,
          total: indirectScore + phaseTotal + updatedScores.semiSolid + updatedScores.liquid,
          semiSolid: updatedScores.semiSolid,
          liquid: updatedScores.liquid,
          solid: phaseTotal,
        }));
        navigate('/result');
      }
    }
  };

  const phaseTotal = phaseScores.reduce((acc, v) => acc + v, 0);
  const progress = ((step + 1) / items.length) * 100;

  return (
    <div className="page">
      <div className="header">
        <span className="header-icon">🍽️</span>
        <h1>{phaseInfo.label}</h1>
        <p>第二部分：直接觀察患者進食情況</p>
      </div>

      {/* Phase progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        {['semi-solid', 'liquid', 'solid'].map(p => {
          const labels = { 'semi-solid': '🥣', liquid: '💧', solid: '🍞' };
          const isCurrent = p === currentPhase;
          const hasData = completedScores[p === 'semi-solid' ? 'semiSolid' : p as 'liquid'|'solid'] !== 0;
          return (
            <div key={p} style={{
              padding: '4px 14px', borderRadius: 20, fontSize: 18,
              background: isCurrent ? 'var(--primary)' : hasData ? 'var(--secondary)' : '#e0e0e0',
              color: isCurrent || hasData ? 'white' : '#999',
              fontWeight: isCurrent ? 700 : 400,
            }}>
              {labels[p as keyof typeof labels]}
            </div>
          );
        })}
      </div>

      <div className="step-counter">第 {step + 1} / {items.length} 題 · {phaseInfo.label}</div>
      <div className="progress-bar"><div className="progress-fill" style={{width: `${progress}%`}} /></div>

      {/* Phase score so far */}
      <div style={{ textAlign: 'center', marginBottom: 12, fontSize: 15, color: '#666' }}>
        {phaseInfo.label}目前累計：{phaseTotal} / {items.length * 2} 分
      </div>

      <div className="card">
        <span className={`phase-badge ${phaseInfo.cls}`}>{phaseInfo.icon} {phaseInfo.label}</span>
        <div className="card-title" style={{marginTop: 8}}>
          <span className="step-badge">{step + 1}</span>
          {currentItem.icon} {currentItem.question}
        </div>
        {currentItem.volumeHint && (
          <div style={{fontSize: 15, color: '#0081a7', fontWeight: 600, marginBottom: 8, background: '#e3f2fd', padding: '8px 14px', borderRadius: 10, display: 'inline-block'}}>
            📏 {currentItem.volumeHint}
          </div>
        )}
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
            <div style={{ marginTop: 4, fontSize: 15, color: '#888' }}>{currentItem.cartoonHint}</div>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 22, flexShrink: 0 }}>🔍</span>
        </div>

        <div className="options">
          {currentItem.options.map((opt, i) => (
            <button
              key={i}
              className={`option-btn ${opt.stop ? 'stop-warning' : ''}`}
              onClick={() => handleAnswer(opt.score)}
            >
              <span className="option-icon">
                {currentItem.options.length === 2
                  ? (i === 0 ? '❌' : '✅')
                  : (i === 0 ? '❌' : i === 1 ? '⚠️' : '✅')}
              </span>
              <span className="option-label">{opt.label}</span>
              <span className="option-score">({opt.score}分){opt.stop ? ' ⚠️' : ''}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="btn-group" style={{marginTop: 10}}>
        <button className="btn btn-secondary" onClick={() => currentPhase === 'semi-solid' ? navigate('/indirect-test') : navigate('/direct-test/semi-solid')}>
          ← 上一步
        </button>
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

export default DirectTest;
