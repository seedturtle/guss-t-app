import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateResult } from '../data';
import type { TestResult } from '../types';

const Result: React.FC = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<TestResult|null>(null);
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem('guss_t_result');
    const inf = localStorage.getItem('guss_t_info');
    if (raw) {
      const data = JSON.parse(raw);
      const info2 = inf ? JSON.parse(inf) : {};
      setInfo(info2);
      const { scores, indirectScore, stop, stopReason } = data;
      const semi = data.semiSolid ?? scores?.semiSolid ?? 0;
      const liq = data.liquid ?? scores?.liquid ?? 0;
      const sol = data.solid ?? scores?.solid ?? 0;
      const { severity, iddsiLevels, recommendations } = calculateResult(
        indirectScore, semi, liq, sol, stop ? stopReason : undefined
      );
      setResult({
        date: info2.date || new Date().toLocaleDateString('zh-TW'),
        examiner: info2.examiner || '',
        patientName: info2.patientName || '',
        indirectScore, semiSolidScore: semi, liquidScore: liq, solidScore: sol,
        totalScore: indirectScore + semi + liq + sol,
        severity, iddsiLevels, recommendations,
        stopReason: stop ? stopReason : undefined,
      });
    }
  }, []);

  if (!result) {
    return <div className="page"><div className="header"><h1>載入中...</h1></div></div>;
  }

  const isIndirectStop = result.stopReason && result.severity === 'severe';

  return (
    <div className="page">
      <div className="header">
        <span className="header-icon">📊</span>
        <h1>GUSS-T 評估結果</h1>
        <p>{info?.patientName} · {info?.date} · 檢查人員：{info?.examiner}</p>
      </div>

      {/* NPO Alert Banner — 間接測試低於5分時顯示 */}
      {isIndirectStop && (
        <div className="stop-banner" style={{ marginBottom: 16 }}>
          <span className="stop-banner-icon">🚫</span>
          <h3>間接吞嚥測試未通過（{result.indirectScore} / 5）</h3>
          <p>依 GUSS-T 規範，間接測試未達 5 分，<strong>禁止由口進食</strong>（NPO）</p>
        </div>
      )}

      {/* Score Summary */}
      <div className="score-display">
        <div className={`score-circle ${result.severity}`}>
          {result.totalScore}
        </div>
        <div style={{
          fontSize: 18, fontWeight: 700,
          color: result.severity === 'normal' ? '#2e7d32' : result.severity === 'mild' ? '#f57f17' : '#c62828'
        }}>
          {result.severity === 'normal' ? '✅ 完全正常' :
           result.severity === 'mild' ? '⚠️ 輕度障礙' :
           result.severity === 'moderate' ? '🔴 中度障礙' : '🚫 重度障礙'}
        </div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
          {isIndirectStop
            ? `間接測試：${result.indirectScore} / 5（低於標準，停止評估）`
            : `間接 + 直接測驗總分：${result.totalScore} / 20`}
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="card">
        <div className="card-title">📋 分項分數</div>
        {[
          { label: '間接吞嚥測試', score: result.indirectScore, max: 5, icon: '🌙' },
          { label: '半固體', score: result.semiSolidScore, max: 5, icon: '🥣' },
          { label: '液體', score: result.liquidScore, max: 5, icon: '💧' },
          { label: '固體', score: result.solidScore, max: 5, icon: '🍞' },
        ].map(row => (
          <div key={row.label} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #f0f0f0'}}>
            <span>{row.icon} {row.label}</span>
            <span style={{
              fontWeight: 700,
              color: row.score >= row.max ? '#2e7d32' : row.score >= row.max * 0.5 ? '#f57f17' : '#c62828'
            }}>
              {row.score} / {row.max}
            </span>
          </div>
        ))}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0 0', fontWeight:700, fontSize:16}}>
          <span>📊 總分</span>
          <span style={{
            color: result.severity === 'normal' ? '#2e7d32' : result.severity === 'mild' ? '#f57f17' : '#c62828'
          }}>
            {result.totalScore} / 20
          </span>
        </div>
      </div>

      {/* IDDSI Recommendation */}
      <div className="card">
        <div className="card-title">🍽️ IDDSI 飲食建議</div>
        {result.iddsiLevels.map((level, i) => (
          <div key={i} style={{padding:'8px 12px', background:'#e3f2fd', borderRadius:10, marginBottom:8, fontSize:14}}>
            🟦 {level}
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="card">
        <div className="card-title">💊 處置建議</div>
        <ul style={{ paddingLeft: 20, margin: '8px 0', lineHeight: 2 }}>
          {result.recommendations.map((rec, i) => (
            <li key={i} style={{ marginBottom: 6 }}>{rec}</li>
          ))}
        </ul>
      </div>

      {/* Reference */}
      <div style={{background:'#f8f9fa', borderRadius:12, padding:12, fontSize:11, color:'#aaa', marginBottom:16, textAlign:'center'}}>
        資料來源：Trapl et al. (2007) Stroke, 38, 2948 · 台灣版：王秋鈴、李念白<br/>
        本工具僅供臨床參考，不取代專業醫療判斷
      </div>

      <div className="btn-group">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>← 回到首頁</button>
        <button className="btn btn-primary" onClick={() => window.print()}>🖨️ 列印結果</button>
      </div>
    </div>
  );
};

export default Result;
