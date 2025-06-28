import React, { useState } from 'react';
import './DeductionScreen.css';

const DeductionScreen = ({ mystery, onSolve, onBack }) => {
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGuess = async () => {
    if (!guess.trim()) {
      setFeedback('Please enter a country name!');
      return;
    }

    setIsLoading(true);
    
    // Add a small delay for better UX
    setTimeout(() => {
      const normalizedGuess = guess.trim().toLowerCase();
      const normalizedAnswer = mystery.countryName.toLowerCase();
      
      if (normalizedGuess === normalizedAnswer) {
        setFeedback('🎉 Correct! Starting your journey...');
        setTimeout(() => {
          onSolve(mystery.countryName);
        }, 1500);
      } else {
        setFeedback('❌ Not quite right. Study the clues and try again!');
        setGuess('');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleGuess();
    }
  };

  if (!mystery) {
    return null;
  }

  return (
    <div className="deduction-overlay">
      <div className="deduction-container">
        <button className="back-button" onClick={onBack}>
          ← Back to Menu
        </button>
        
        <div className="deduction-header">
          <h1 className="deduction-title">🕵️ Geo-Mystery Mode</h1>
          <p className="deduction-subtitle">
            Study the clues carefully and deduce your starting location
          </p>
        </div>

        <div className="clues-section">
          {/* Fact Clue */}
          <div className="clue-card">
            <h3 className="clue-title">
              <span className="clue-icon">💡</span>
              Mystery Fact
            </h3>
            <p className="fact-text">"{mystery.clues.fact}"</p>
          </div>

          {/* Image Clue */}
          <div className="clue-card">
            <h3 className="clue-title">
              <span className="clue-icon">📸</span>
              Visual Clue
            </h3>
            <img 
              src={mystery.clues.imageURL} 
              alt="Mystery location" 
              className="clue-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="loading-placeholder" style={{ display: 'none' }}>
              <span>Image unavailable</span>
            </div>
          </div>

          {/* Outline Clue */}
          <div className="clue-card">
            <h3 className="clue-title">
              <span className="clue-icon">🗺️</span>
              Country Outline
            </h3>
            <div className="outline-container">
              <img 
                src={mystery.clues.outlineURL} 
                alt="Country outline" 
                className="country-outline"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="loading-placeholder" style={{ display: 'none' }}>
                <span>Outline unavailable</span>
              </div>
            </div>
          </div>

          {/* Guess Section */}
          <div className="clue-card">
            <h3 className="clue-title">
              <span className="clue-icon">🎯</span>
              Your Guess
            </h3>
            <div className="guess-input-container">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter country name..."
                className="guess-input"
                disabled={isLoading}
              />
              <button 
                onClick={handleGuess} 
                className="guess-button"
                disabled={isLoading || !guess.trim()}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Checking...
                  </>
                ) : (
                  'Guess'
                )}
              </button>
            </div>
            
            {feedback && (
              <div className={`feedback-message ${feedback.includes('Correct') ? 'success' : 'error'}`}>
                {feedback}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeductionScreen;