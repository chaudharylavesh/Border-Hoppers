import PropTypes from 'prop-types';

const GuessInputPropTypes = {
  currentGuess: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onGuess: PropTypes.func.isRequired,
  onSuggestionClick: PropTypes.func.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  remainingTurns: PropTypes.number.isRequired,
  gameOver: PropTypes.bool.isRequired,
  colorScheme: PropTypes.object.isRequired,
};

export default GuessInputPropTypes;
