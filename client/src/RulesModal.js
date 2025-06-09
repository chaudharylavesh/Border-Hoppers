import React from 'react';
import RulesModalPropTypes from './RulesModal.propTypes';

const RulesModal = ({ show, onClose, colorScheme }) => {
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: colorScheme.background,
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.5)',
      zIndex: 1000
    }}>
      <h2>Game Rules</h2>
      <ul>
        <li>Your goal is to find a path from the start country to the end country.</li>
        <li>You can only move to neighboring countries.</li>
        <li>You have a limited number of turns to reach the destination.</li>
        <li>The optimal path is the shortest route between the two countries.</li>
        <li>Use hints wisely - you only get one per game!</li>
      </ul>
      <button onClick={onClose} style={{ backgroundColor: colorScheme.button, color: colorScheme.text }}>Close</button>
    </div>
  );
};

RulesModal.propTypes = RulesModalPropTypes;

export default RulesModal;
