import React, { useState } from 'react';
import './GameModeSelector.css';

const GameModeSelector = ({ onModeSelect, onCancel }) => {
  const [selectedMode, setSelectedMode] = useState('classic');

  const modes = [
    {
      id: 'classic',
      name: 'Classic Mode',
      icon: '🌍',
      description: 'Start with a known country and find the optimal path to your destination.',
      difficulty: 'easy'
    },
    {
      id: 'mystery',
      name: 'Geo-Mystery Mode',
      icon: '🕵️',
      description: 'Solve clues to discover your starting location, then begin your journey.',
      difficulty: 'challenging'
    }
  ];

  const handleModeClick = (modeId) => {
    setSelectedMode(modeId);
  };

  const handleStart = () => {
    onModeSelect(selectedMode);
  };

  return (
    <div className="mode-selector-overlay">
      <div className="mode-selector-container">
        <div className="mode-selector-header">
          <h1 className="mode-selector-title">Choose Your Adventure</h1>
          <p className="mode-selector-subtitle">
            Select a game mode to begin your border-hopping journey
          </p>
        </div>

        <div className="mode-options">
          {modes.map((mode) => (
            <div
              key={mode.id}
              className={`mode-card ${selectedMode === mode.id ? 'selected' : ''}`}
              onClick={() => handleModeClick(mode.id)}
            >
              <span className="mode-icon">{mode.icon}</span>
              <h3 className="mode-name">{mode.name}</h3>
              <p className="mode-description">{mode.description}</p>
              <span className={`mode-difficulty difficulty-${mode.difficulty}`}>
                {mode.difficulty}
              </span>
            </div>
          ))}
        </div>

        <div className="mode-selector-actions">
          <button className="action-button cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button 
            className="action-button start-button" 
            onClick={handleStart}
            disabled={!selectedMode}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModeSelector;