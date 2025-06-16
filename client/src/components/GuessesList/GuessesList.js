import React from 'react';

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

export default GuessesList;