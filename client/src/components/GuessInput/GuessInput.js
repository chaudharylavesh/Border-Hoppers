import React from 'react';

const GuessInput = ({
  currentGuess,
  onInputChange,
  onGuess,
  onSuggestionClick,
  suggestions,
  remainingTurns,
  gameOver,
  colorScheme
}) => (
  <div className="input-container">
    <input
      type="text"
      value={currentGuess}
      onChange={onInputChange}
      onKeyPress={e => e.key === 'Enter' && onGuess()}
      placeholder="Enter a country name"
      disabled={gameOver}
      style={{ backgroundColor: colorScheme.button, color: colorScheme.text }}
    />
    <button
      onClick={onGuess}
      disabled={gameOver || remainingTurns <= 0}
      style={{ backgroundColor: colorScheme.button, color: colorScheme.text }}
    >
      Guess ({remainingTurns} turns left)
    </button>
    {suggestions.length > 0 && (
      <ul className="suggestions" style={{ backgroundColor: colorScheme.button, color: colorScheme.text }}>
        {suggestions.map((country, index) => (
          <li key={index} onClick={() => onSuggestionClick(country)}>
            {country}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default GuessInput;