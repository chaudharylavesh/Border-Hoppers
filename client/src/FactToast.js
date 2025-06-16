import React from 'react';
import './FactToast.css';

const FactToast = ({ factText }) => {
  return (
    <div className="fact-toast">
      <div className="fact-toast-header">
        <span className="fact-icon">💡</span>
        <h3>Did you know?</h3>
      </div>
      <p className="fact-text">{factText}</p>
    </div>
  );
};

export default FactToast;