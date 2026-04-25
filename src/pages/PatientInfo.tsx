import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PatientInfo: React.FC = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState({ patientName: '', date: '', examiner: '' });

  const handleNext = () => {
    if (!info.patientName || !info.date || !info.examiner) { alert('請填寫所有欄位'); return; }
    localStorage.setItem('guss_t_info', JSON.stringify(info));
    navigate('/indirect-test');
  };

  return (
    <div className="page">
      <div className="header">
        <span className="header-icon">📋</span>
        <h1>基本資料</h1><p>填寫患者與檢查人員資訊</p>
      </div>
      <div className="progress-bar"><div className="progress-fill" style={{width:'10%'}} /></div>
      <div className="card">
        <div className="card-title">👤 患者與檢查資訊</div>
        <div className="form-group">
          <label className="form-label">患者姓名</label>
          <input className="form-input" type="text" placeholder="請輸入患者姓名" value={info.patientName} onChange={e=>setInfo({...info,patientName:e.target.value})} />
        </div>
        <div className="form-group">
          <label className="form-label">檢查日期</label>
          <input className="form-input" type="date" value={info.date} onChange={e=>setInfo({...info,date:e.target.value})} />
        </div>
        <div className="form-group">
          <label className="form-label">檢查人員</label>
          <input className="form-input" type="text" placeholder="請輸入檢查人員姓名" value={info.examiner} onChange={e=>setInfo({...info,examiner:e.target.value})} />
        </div>
      </div>
      <div className="btn-group" style={{marginTop:8}}>
        <button className="btn btn-secondary" onClick={()=>navigate('/')}>← 上一步</button>
        <button className="btn btn-primary" onClick={handleNext}>開始間接測試 →</button>
      </div>
    </div>
  );
};
export default PatientInfo;
