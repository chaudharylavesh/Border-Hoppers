import React from 'react';

import GuessesListPropTypes from './GuessesList.propTypes';

const GuessesList = ({ guessedCountries }) => (
  <div className="guesses-container">
    <h2>Your Journey So Far:</h2>
    <ul className="guessed-countries">
      {guessedCountries.map((country, index) => (
        <li key={index}>{country}</li>
      ))}
    </ul>
  </div>
);

GuessesList.propTypes = GuessesListPropTypes;

export default GuessesList;
