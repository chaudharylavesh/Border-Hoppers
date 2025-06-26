import React from 'react';
import { achievements } from '../../data/achievements';
import { getPlayerStats } from '../../services/statsService';
import './Awards.css';

const AwardsPage = ({ onClose }) => {
  const playerStats = getPlayerStats();
  const unlockedAchievementIds = playerStats.unlockedAchievements || [];
  
  // Calculate progress statistics
  const totalAchievements = achievements.length;
  const unlockedCount = unlockedAchievementIds.length;
  const progressPercentage = Math.round((unlockedCount / totalAchievements) * 100);
  
  // Group achievements by category for better organization
  const achievementCategories = {
    'Beginner': achievements.filter(a => ['firstGame', 'firstGold', 'firstSilver', 'firstBronze'].includes(a.id)),
    'Games Completed': achievements.filter(a => a.id.startsWith('games')),
    'Gold Medals': achievements.filter(a => a.id.startsWith('gold')),
    'Silver Medals': achievements.filter(a => a.id.startsWith('silver')),
    'Bronze Medals': achievements.filter(a => a.id.startsWith('bronze')),
    'Login Streaks': achievements.filter(a => a.id.startsWith('streak')),
    'Special': achievements.filter(a => ['allMedals', 'perfectionist', 'consistent', 'determined'].includes(a.id)),
    'Collections': achievements.filter(a => a.id.startsWith('medals'))
  };

  return (
    <div className="awards-overlay">
      <div className="awards-modal">
        {/* Header */}
        <div className="awards-header">
          <div className="awards-title-section">
            <h1 className="awards-title">🏆 Your Achievements</h1>
            <button className="awards-close-button" onClick={onClose}>
              ✕
            </button>
          </div>
          
          {/* Progress Summary */}
          <div className="awards-progress-summary">
            <div className="progress-stats">
              <div className="progress-stat">
                <span className="progress-number">{unlockedCount}</span>
                <span className="progress-label">Unlocked</span>
              </div>
              <div className="progress-stat">
                <span className="progress-number">{totalAchievements - unlockedCount}</span>
                <span className="progress-label">Remaining</span>
              </div>
              <div className="progress-stat">
                <span className="progress-number">{progressPercentage}%</span>
                <span className="progress-label">Complete</span>
              </div>
            </div>
            
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="progress-text">{unlockedCount} of {totalAchievements} achievements</span>
            </div>
          </div>
        </div>

        {/* Achievement Categories */}
        <div className="awards-content">
          {Object.entries(achievementCategories).map(([categoryName, categoryAchievements]) => {
            if (categoryAchievements.length === 0) return null;
            
            const categoryUnlocked = categoryAchievements.filter(a => 
              unlockedAchievementIds.includes(a.id)
            ).length;
            
            return (
              <div key={categoryName} className="achievement-category">
                <div className="category-header">
                  <h2 className="category-title">{categoryName}</h2>
                  <span className="category-progress">
                    {categoryUnlocked}/{categoryAchievements.length}
                  </span>
                </div>
                
                <div className="achievements-grid">
                  {categoryAchievements.map(achievement => {
                    const isUnlocked = unlockedAchievementIds.includes(achievement.id);
                    
                    return (
                      <div 
                        key={achievement.id} 
                        className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                      >
                        <div className="achievement-card-icon">
                          {achievement.icon}
                        </div>
                        <div className="achievement-card-content">
                          <h3 className="achievement-card-name">
                            {achievement.name}
                          </h3>
                          <p className="achievement-card-description">
                            {isUnlocked ? achievement.description : '???'}
                          </p>
                        </div>
                        {isUnlocked && (
                          <div className="achievement-unlocked-badge">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AwardsPage;