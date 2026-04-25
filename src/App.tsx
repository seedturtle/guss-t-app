import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PatientInfo from './pages/PatientInfo';
import IndirectTest from './pages/IndirectTest';
import DirectTest from './pages/DirectTest';
import Result from './pages/Result';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patient-info" element={<PatientInfo />} />
          <Route path="/indirect-test" element={<IndirectTest />} />
          <Route path="/direct-test/:phase" element={<DirectTest />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;