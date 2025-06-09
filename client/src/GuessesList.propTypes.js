import PropTypes from 'prop-types';

const GuessesListPropTypes = {
  guessedCountries: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default GuessesListPropTypes;
