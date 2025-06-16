import React from 'react';
import './PostJourneyDebrief.css';

const PostJourneyDebrief = ({ 
  finalGameTime, 
  finalPlayerPath, 
  finalOptimalPath, 
  onPlayAgain 
}) => {
  // Medal logic based on path efficiency
  const getMedal = () => {
    const playerSteps = finalPlayerPath.length;
    const optimalSteps = finalOptimalPath.length;
    
    if (playerSteps === optimalSteps) {
      return { type: 'GOLD', emoji: '🥇', color: '#FFD700' };
    } else if (playerSteps <= optimalSteps + 2) {
      return { type: 'SILVER', emoji: '🥈', color: '#C0C0C0' };
    } else {
      return { type: 'BRONZE', emoji: '🥉', color: '#CD7F32' };
    }
  };

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate efficiency percentage
  const getEfficiency = () => {
    if (finalOptimalPath.length === 0) return 0;
    return Math.round((finalOptimalPath.length / finalPlayerPath.length) * 100);
  };

  const medal = getMedal();
  const efficiency = getEfficiency();

  return (
    <div className="debrief-overlay">
      <div className="debrief-modal">
        {/* Header with Medal */}
        <div className="debrief-header">
          <div className="medal-container">
            <div className="medal-icon" style={{ color: medal.color }}>
              {medal.emoji}
            </div>
            <h2 className="medal-title">{medal.type} MEDAL!</h2>
            <p className="medal-subtitle">Journey Complete</p>
          </div>
        </div>

        {/* Performance Stats Dashboard */}
        <div className="stats-dashboard">
          <div className="stat-card primary">
            <div className="stat-value">{formatTime(finalGameTime)}</div>
            <div className="stat-label">Game Time</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{finalPlayerPath.length}</div>
            <div className="stat-label">Your Path Length</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{finalOptimalPath.length}</div>
            <div className="stat-label">Optimal Path Length</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{efficiency}%</div>
            <div className="stat-label">Efficiency</div>
          </div>
        </div>

        {/* Path Visualization */}
        <div className="paths-section">
          <div className="path-container">
            <h3 className="path-title">Your Journey</h3>
            <div className="path-display your-path">
              {finalPlayerPath.map((country, index) => (
                <React.Fragment key={index}>
                  <span className="country-name">{country}</span>
                  {index < finalPlayerPath.length - 1 && (
                    <span className="path-arrow">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="path-container">
            <h3 className="path-title">Optimal Route</h3>
            <div className="path-display optimal-path">
              {finalOptimalPath.map((country, index) => (
                <React.Fragment key={index}>
                  <span className="country-name">{country}</span>
                  {index < finalOptimalPath.length - 1 && (
                    <span className="path-arrow">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Message */}
        <div className="performance-message">
          {medal.type === 'GOLD' && (
            <p>🎉 Perfect! You found the optimal path!</p>
          )}
          {medal.type === 'SILVER' && (
            <p>🌟 Excellent! You were very close to the optimal route!</p>
          )}
          {medal.type === 'BRONZE' && (
            <p>👍 Good job! You completed the journey. Try to find a shorter path next time!</p>
          )}
        </div>

        {/* Play Again Button */}
        <button className="play-again-button" onClick={onPlayAgain}>
          🌍 Play Again
        </button>
      </div>
    </div>
  );
};

export default PostJourneyDebrief;