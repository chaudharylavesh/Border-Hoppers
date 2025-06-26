import React, { useEffect } from 'react';
import './AchievementToast.css';

const AchievementToast = ({ achievement, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 6000); // 6 seconds

    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!achievement) return null;

  return (
    <div className="achievement-toast">
      <div className="achievement-toast-content">
        <div className="achievement-toast-header">
          <span className="achievement-unlocked-text">🎉 Achievement Unlocked!</span>
        </div>
        <div className="achievement-toast-body">
          <div className="achievement-icon-large">
            {achievement.icon}
          </div>
          <div className="achievement-details">
            <h3 className="achievement-name">{achievement.name}</h3>
            <p className="achievement-description">{achievement.description}</p>
          </div>
        </div>
        <div className="achievement-toast-progress">
          <div className="achievement-toast-progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default AchievementToast;