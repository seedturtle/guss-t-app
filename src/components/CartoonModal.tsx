import React, { useEffect, useRef } from 'react';

interface CartoonModalProps {
  src: string;
  alt: string;
  caption: string;
  onClose: () => void;
}

const CartoonModal: React.FC<CartoonModalProps> = ({ src, alt, caption, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.showModal();
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) onClose();
      });
    }
    return () => dialog?.close();
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      style={{
        border: 'none',
        borderRadius: '20px',
        padding: 0,
        maxWidth: '680px',
        width: '92vw',
        background: 'transparent',
        boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
      }}
    >
      <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#0081a7,#00afb9)', padding: '16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ color:'white', fontWeight:700, fontSize:15 }}>📌 操作示意圖</span>
          <button
            onClick={onClose}
            style={{ background:'rgba(255,255,255,0.25)', border:'none', borderRadius:'50%', width:32, height:32, color:'white', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
          >×</button>
        </div>
        {/* Image */}
        <div style={{ background: '#f0f9fb', padding: '12px', textAlign:'center' }}>
          <img
            src={src}
            alt={alt}
            style={{ width:'100%', maxHeight:'360px', objectFit:'contain', borderRadius:'12px', display:'block' }}
          />
        </div>
        {/* Caption */}
        <div style={{ padding: '16px 20px 20px', background:'linear-gradient(135deg,#fdfcdc,#fff9e6)', borderTop:'1px solid #f0e68c' }}>
          <div style={{ fontSize:13, color:'#0081a7', fontWeight:700, marginBottom:6 }}>操作說明</div>
          <div style={{ fontSize:14, color:'#444', lineHeight:1.7 }}>{caption}</div>
        </div>
        {/* Footer hint */}
        <div style={{ padding: '8px 20px 16px', textAlign:'center' }}>
          <span style={{ fontSize:11, color:'#aaa' }}>點擊外部區域或右上角 ✕ 關閉</span>
        </div>
      </div>
    </dialog>
  );
};

export default CartoonModal;
