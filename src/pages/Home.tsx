import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="home-hero">
        <span className="home-hero-icon">🏥</span>
        <h1>GUSS-T 互動式評估系統</h1>
        <p>臺灣版古金吞嚥篩檢量表</p>
        <p style={{ marginTop: 8, opacity: 0.8, fontSize: 13 }}>
          Gugging Swallowing Screen – Taiwan Version
        </p>
      </div>

      <div className="home-steps">
        {[
          { num: '1', icon: '📋', title: '填寫基本資料', sub: '患者姓名、日期、檢查人員' },
          { num: '2', icon: '🌙', title: '間接吞嚥測試', sub: '意識、咳嗽、吞口水、嗓音評估' },
          { num: '3', icon: '🍽️', title: '直接吞嚥測試', sub: '半固體 → 液體 → 固體（三階段）' },
          { num: '4', icon: '📊', title: '評估結果出爐', sub: 'IDDSI 飲食建議、嚴重程度分級' },
        ].map((step) => (
          <div className="home-step" key={step.num}>
            <div className="home-step-num">{step.num}</div>
            <div>
              <div className="home-step-text">
                <span style={{ marginRight: 6 }}>{step.icon}</span>
                {step.title}
              </div>
              <div className="home-step-sub">{step.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/patient-info')}>
        🚀 開始評估
      </button>

      <div style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: '#aaa' }}>
        資料來源：Trapl et al. (2007) Stroke, 38, 2948<br />
        台灣版翻譯：王秋鈴、李念白
      </div>
    </div>
  );
};

export default Home;