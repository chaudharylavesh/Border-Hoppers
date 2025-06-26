import React, { useState, useEffect, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import './App.css';
import RulesModal from './components/RulesModal/RulesModal';
import GuessInput from './components/GuessInput/GuessInput';
import GuessesList from './components/GuessesList/GuessesList';
import GameMap from './components/GameMap/GameMap';
import PostJourneyDebrief from './components/PostJourneyDebrief/PostJourneyDebrief';
import FactToast from './components/FactToast/FactToast';
import AchievementToast from './components/AchievementToast/AchievementToast';
import AwardsPage from './components/Awards/AwardsPage';
import factsData from './data/facts.json';
import { 
  getPlayerStats, 
  savePlayerStats, 
  updateLoginStreak, 
  incrementGameStats 
} from './services/statsService';
import { checkAndUnlockAchievements } from './services/achievementService';


// Special cases that might cause issues in the game logic
const specialCases = ['Vatican City', 'San Marino', 'Monaco', 'Liechtenstein', 'Andorra'];


// Color scheme for the game - chose these for good contrast and visual appeal
const colorScheme = {
  background: '#1b1b2f',
  text: '#ffffff',
  button: '#e94560',
  optimal: '#00ff00',
  good: '#7cfc00',
  prettyGood: '#ffa500',
  notGreat: '#ff4500',
  detour: '#808080',
  start: '#ff7800',
  end: '#ff3f34',
  guess: '#00bcd4',
  optimalPath: '#8e44ad',
};


// Icons for the game controls - using local images for better asset management
const QuestionIcon = () => (
  <img src="/question.png" alt="Rules" style={{ width: '24px', height: '24px' }} />
);


const RefreshIcon = () => (
  <img src="/refresh.png" alt="Refresh" style={{ width: '24px', height: '24px' }} />
);

const TrophyIcon = () => (
  <span style={{ fontSize: '24px', cursor: 'pointer' }}>🏆</span>
);


function App() {
  // State variables - using useState for reactive updates
  const [geoJSONData, setGeoJSONData] = useState(null);
  const [countries, setCountries] = useState({});
  const [currentContinent, setCurrentContinent] = useState('Europe');
  const [startCountry, setStartCountry] = useState('');
  const [endCountry, setEndCountry] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guessedCountries, setGuessedCountries] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remainingTurns, setRemainingTurns] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [optimalPath, setOptimalPath] = useState([]);
  const [hint, setHint] = useState('');
  const [hintUsed, setHintUsed] = useState(false);
  const [showRules, setShowRules] = useState(false);

  // New state variables for Post-Journey Debrief
  const [gameTime, setGameTime] = useState(0);
  const [finalGameTime, setFinalGameTime] = useState(0);
  const [finalPlayerPath, setFinalPlayerPath] = useState([]);
  const [finalOptimalPath, setFinalOptimalPath] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [showDebrief, setShowDebrief] = useState(false);

  // Smart Facts system state
  const [currentFact, setCurrentFact] = useState(null);

  // Player statistics state
  const [playerStats, setPlayerStats] = useState(null);

  // Achievement notification system state
  const [notificationQueue, setNotificationQueue] = useState([]);
  const [currentToast, setCurrentToast] = useState(null);

  // Awards page state
  const [showAwardsPage, setShowAwardsPage] = useState(false);


  // Initialize player statistics and handle login streak on app load
  useEffect(() => {
    const initializePlayerStats = () => {
      const currentStats = getPlayerStats();
      const updatedStats = updateLoginStreak(currentStats);
      
      // Save updated stats if login streak was modified
      if (updatedStats.lastLoginDate !== currentStats.lastLoginDate || 
          updatedStats.loginStreak !== currentStats.loginStreak) {
        savePlayerStats(updatedStats);
        
        // Check for achievements after login streak update
        const newAchievements = checkAndUnlockAchievements();
        if (newAchievements.length > 0) {
          console.log('Login Achievements Unlocked!', newAchievements);
          // Add to notification queue
          setNotificationQueue(prev => [...prev, ...newAchievements]);
        }
      }
      
      setPlayerStats(updatedStats);
    };

    initializePlayerStats();
  }, []);

  // Achievement notification queue management
  useEffect(() => {
    if (currentToast === null && notificationQueue.length > 0) {
      // Take the first achievement from the queue
      const nextAchievement = notificationQueue[0];
      setCurrentToast(nextAchievement);
      
      // Remove the achievement from the queue
      setNotificationQueue(prev => prev.slice(1));
    }
  }, [notificationQueue, currentToast]);

  // Handle toast dismissal
  const handleToastDismiss = () => {
    setCurrentToast(null);
  };


  // Game timer logic - tracks elapsed time during active gameplay
  useEffect(() => {
    let interval = null;
    
    if (gameActive && !gameOver) {
      interval = setInterval(() => {
        setGameTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameActive, gameOver]);

  // Auto-dismiss logic for fact toast
  useEffect(() => {
    let timeout = null;
    
    if (currentFact) {
      timeout = setTimeout(() => {
        setCurrentFact(null);
      }, 7000); // 7 seconds
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [currentFact]);

  // Function to get a random fact for a country
  const getRandomFact = useCallback((countryName) => {
    const countryFacts = factsData[countryName];
    if (countryFacts && countryFacts.length > 0) {
      const randomIndex = Math.floor(Math.random() * countryFacts.length);
      return countryFacts[randomIndex];
    }
    return null;
  }, []);


  // Fetch country data from REST Countries API
  // Using useCallback to memoize the function and prevent unnecessary re-renders
  const fetchCountryData = useCallback(async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,borders,region,cca3');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Process the data into a more usable format for our game
      const processedData = data.reduce((acc, country) => {
        const continent = country.region;
        const countryName = country.name.common;
        const borders = country.borders || [];
        const cca3 = country.cca3;
        if (!acc[continent]) {
          acc[continent] = {};
        }
        acc[continent][countryName] = { borders, cca3 };
        return acc;
      }, {});
      setCountries(processedData);
      setIsLoading(false);
    } catch (err) {
      console.error("Error in country data fetching process:", err);
      setError(err.message);
      setIsLoading(false);
    }
  }, []);


  // Fetch GeoJSON data for map rendering
  const fetchGeoJSONData = useCallback(async () => {
    try {
      const response = await fetch('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGeoJSONData(data);
    } catch (err) {
      console.error("Error fetching GeoJSON data:", err);
    }
  }, []);


  // Use effect to fetch data when component mounts
  useEffect(() => {
    fetchCountryData();
    fetchGeoJSONData();
  }, [fetchCountryData, fetchGeoJSONData]);


  // Implementation of breadth-first search to find the shortest path between countries
  // This was tricky to get right, but it's crucial for the game logic
  const findShortestPath = useCallback((start, end, continent) => {
    const queue = [[start]];
    const visited = new Set();


    while (queue.length > 0) {
      const path = queue.shift();
      const country = path[path.length - 1];


      if (country === end) {
        return path;
      }


      if (!visited.has(country)) {
        visited.add(country);
        for (const neighborCCA3 of continent[country].borders || []) {
          const neighborName = Object.keys(continent).find(name => continent[name].cca3 === neighborCCA3);
          if (neighborName && !visited.has(neighborName)) {
            queue.push([...path, neighborName]);
          }
        }
      }
    }


    return null; // No path found
  }, []);


  // Initialize the game - this sets up a new round
  const initializeGame = useCallback(() => {
    const continentOrder = ['Europe', 'Asia', 'Africa', 'Americas'];
    const randomContinent = continentOrder[Math.floor(Math.random() * continentOrder.length)];
    const continentCountries = countries[randomContinent];


    if (!continentCountries) return;


    // Filter out special cases and countries without borders
    const mainlandCountries = Object.keys(continentCountries).filter(
      country => continentCountries[country].borders.length > 0 && !specialCases.includes(country)
    );


    // Keep generating start/end pairs until we find a valid one
    // This was tricky to get right - had to balance between challenge and playability
    let start, end, path;
    do {
      start = mainlandCountries[Math.floor(Math.random() * mainlandCountries.length)];
      end = mainlandCountries[Math.floor(Math.random() * mainlandCountries.length)];
      path = findShortestPath(start, end, continentCountries);
    } while (
      start === end ||
      path === null ||
      path.length < 3 ||
      continentCountries[start].borders.includes(continentCountries[end].cca3)
    );


    setStartCountry(start);
    setEndCountry(end);
    setGuessedCountries([start]);
    setFeedback('');
    setOptimalPath(path);
    setRemainingTurns(path.length * 2); // Giving players some wiggle room
    setGameOver(false);
    setCurrentContinent(randomContinent);
    setHint('');
    setHintUsed(false);
    
    // Reset Post-Journey Debrief state variables
    setGameTime(0);
    setFinalGameTime(0);
    setFinalPlayerPath([]);
    setFinalOptimalPath([]);
    setGameActive(true); // Start the timer
    setShowDebrief(false);

    // Reset Smart Facts state
    setCurrentFact(null);
  }, [countries, findShortestPath]);


  // Start a new game when countries data is loaded
  useEffect(() => {
    if (Object.keys(countries).length > 0) {
      initializeGame();
    }
  }, [countries, initializeGame]);


  // Handle input changes and provide suggestions
  const handleInputChange = (e) => {
    const input = e.target.value;
    setCurrentGuess(input);


    if (input.length > 0 && geoJSONData && geoJSONData.features) {
      const filteredSuggestions = geoJSONData.features
        .map(feature => feature.properties.name)
        .filter(name => name && name.toLowerCase().startsWith(input.toLowerCase()));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };


  // Handle suggestion clicks
  const handleSuggestionClick = (country) => {
    setCurrentGuess(country);
    setSuggestions([]);
  };


  // Helper function to determine medal type based on path efficiency
  const getMedalType = (playerPathLength, optimalPathLength) => {
    if (playerPathLength === optimalPathLength) {
      return 'GOLD';
    } else if (playerPathLength <= optimalPathLength + 2) {
      return 'SILVER';
    } else {
      return 'BRONZE';
    }
  };


  // Handle player guesses - this is where the main game logic happens
  const handleGuess = () => {
    if (gameOver || remainingTurns <= 0) return;
 
    const guessedCountry = currentGuess.trim();
    const continent = countries[currentContinent];
    const lastGuessedCountry = guessedCountries[guessedCountries.length - 1];
 
    // Check if the guessed country is valid
    if (!continent[guessedCountry]) {
      setFeedback("This country is not in the current continent or doesn't exist. Check your spelling and try again.");
      setCurrentGuess('');
      setSuggestions([]);
      return;
    }
 
    // Check if the guessed country is a neighbor of the last guessed country
    if (!continent[lastGuessedCountry].borders.includes(continent[guessedCountry].cca3)) {
      setFeedback(`${guessedCountry} is not a neighbor of ${lastGuessedCountry}. Try again.`);
      setCurrentGuess('');
      setSuggestions([]);
      return;
    }
 
    // Valid guess - show a fact about the country
    const fact = getRandomFact(guessedCountry);
    if (fact) {
      setCurrentFact(fact);
    }

    setGuessedCountries(prev => [...prev, guessedCountry]);
    setRemainingTurns(prev => prev - 1);
 
    const guessFeedback = getGuessFeedback(guessedCountry, lastGuessedCountry, continent);
    setFeedback(guessFeedback);
 
    // Check if the player has reached the end country
    if (continent[endCountry].borders.includes(continent[guessedCountry].cca3)) {
      const finalPath = [...guessedCountries, guessedCountry, endCountry];
      const calculatedOptimalPath = findShortestPath(startCountry, endCountry, continent);
      
      // Show a fact about the end country too
      const endCountryFact = getRandomFact(endCountry);
      if (endCountryFact) {
        // Delay the end country fact slightly so it doesn't conflict with the current guess fact
        setTimeout(() => {
          setCurrentFact(endCountryFact);
        }, 2000);
      }
      
      // Capture Post-Journey Debrief data
      setFinalGameTime(gameTime);
      setFinalPlayerPath(finalPath);
      setFinalOptimalPath(calculatedOptimalPath || []);
      setGameActive(false); // Stop the timer
      
      setFeedback(`🎉 Congratulations! You've reached ${endCountry}!`);
      setGuessedCountries(finalPath);
      setGameOver(true);
      
      // Update player statistics when game is won
      if (playerStats && calculatedOptimalPath) {
        const medalType = getMedalType(finalPath.length, calculatedOptimalPath.length);
        const updatedStats = incrementGameStats(playerStats, medalType);
        savePlayerStats(updatedStats);
        setPlayerStats(updatedStats);
        
        // Check for newly unlocked achievements
        const newAchievements = checkAndUnlockAchievements();
        if (newAchievements.length > 0) {
          console.log('🎉 New Achievements Unlocked!', newAchievements);
          // Add to notification queue
          setNotificationQueue(prev => [...prev, ...newAchievements]);
        }
      }
      
      // Show debrief after a short delay
      setTimeout(() => {
        setShowDebrief(true);
      }, 1500);
      
      return;
    }
 
    // Check if the player has run out of turns
    if (remainingTurns - 1 <= 0) {
      const calculatedOptimalPath = findShortestPath(startCountry, endCountry, continent);
      
      // Capture data even for failed games (for potential future use)
      setFinalGameTime(gameTime);
      setFinalPlayerPath([...guessedCountries, guessedCountry]);
      setFinalOptimalPath(calculatedOptimalPath || []);
      setGameActive(false); // Stop the timer
      
      setFeedback(`Game over! You've run out of turns. The optimal path was: ${calculatedOptimalPath ? calculatedOptimalPath.join(' -> ') : 'Unable to calculate'}`);
      setGameOver(true);
      return;
    }
 
    setCurrentGuess('');
    setSuggestions([]);
  };


  // Provide feedback on the player's guess
  const getGuessFeedback = (guessedCountry, lastGuessedCountry, continent) => {
    const guessedCountryCCA3 = continent[guessedCountry].cca3;
    const lastCountryBorders = continent[lastGuessedCountry].borders;
    const optimalCountry = optimalPath[guessedCountries.length];


    if (guessedCountry === optimalCountry) {
      return '✅ Guess is optimal! You\'re one step closer.';
    } else if (optimalPath.includes(guessedCountry)) {
      return '🟩 Guess is good. This guess is on the shortest path, keep it going!';
    } else if (lastCountryBorders.includes(guessedCountryCCA3)) {
      return '🟧 Guess is pretty good. This country is close, but doesn\'t get you closer.';
    } else {
      return '🟥 Guess is not great. This country is a significant detour.';
    }
  };


  // Provide a hint to the player
  const getHint = () => {
    if (!hintUsed && optimalPath.length > guessedCountries.length) {
      const nextCountry = optimalPath[guessedCountries.length];
      const initials = nextCountry[0] + nextCountry[nextCountry.length - 1];
      setHint(`Hint: The next country starts with "${initials[0]}" and ends with "${initials[1]}"`);
      setHintUsed(true);
    } else {
      setHint("No more hints available.");
    }
  };


  // Style the map based on the game state
  const mapStyle = useCallback(
    (feature) => {
      const countryName = feature.properties.name;
      const isHighlighted = guessedCountries.includes(countryName) || countryName === startCountry || countryName === endCountry;


      let fillColor = colorScheme.detour; // Default color for disconnected countries
      if (countryName === startCountry) fillColor = colorScheme.start;
      else if (countryName === endCountry) fillColor = colorScheme.end;
      else if (countryName === optimalPath[guessedCountries.length]) fillColor = colorScheme.optimal;
      else if (optimalPath.includes(countryName)) fillColor = colorScheme.good;
      else if (isHighlighted) fillColor = colorScheme.prettyGood;


      return {
        fillColor,
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: isHighlighted ? '3' : '1',
        fillOpacity: isHighlighted ? 0.7 : 0,
      };
    },
    [guessedCountries, startCountry, endCountry, optimalPath]
  );


  // Add interactivity to the map
  const onEachFeature = useCallback(
    (feature, layer) => {
      const countryName = feature.properties.name;
      const isHighlighted = guessedCountries.includes(countryName) || countryName === startCountry || countryName === endCountry;
 
      if (isHighlighted) {
        layer.bindTooltip(countryName, {
          permanent: false,
          direction: 'auto',
          className: 'country-tooltip',
        });
 
        layer.on({
          mouseover: (e) => {
            const layer = e.target;
            layer.setStyle({
              weight: 3,
              color: '#666',
              dashArray: '',
              fillOpacity: 0.9
            });
            layer.bringToFront();
          },
          mouseout: (e) => {
            const layer = e.target;
            layer.setStyle(mapStyle(feature));
          }
        });
      }
    },
    [guessedCountries, startCountry, endCountry, mapStyle]
  );


  // Toggle game rules display
  const toggleRules = () => {
    setShowRules(!showRules);
  };


  // Start a new game
  const startNewGame = () => {
    initializeGame();
    setShowRules(false);
  };

  // Handle play again from debrief
  const handlePlayAgain = () => {
    setShowDebrief(false);
    initializeGame();
  };

  // Toggle awards page
  const toggleAwardsPage = () => {
    setShowAwardsPage(!showAwardsPage);
  };


  // Render loading state
  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!countries || Object.keys(countries).length === 0) return <div className="error">No country data available</div>;


  // Main render
  return (
    <div className="app" style={{ backgroundColor: colorScheme.background, color: colorScheme.text }}>
      <h1>🌍 Border Hoppers</h1>
      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={toggleAwardsPage} style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="View Achievements">
          <TrophyIcon />
        </button>
        <button onClick={toggleRules} style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Game Rules">
          <QuestionIcon />
        </button>
        <button onClick={startNewGame} style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="New Game">
          <RefreshIcon />
        </button>
      </div>
      {showRules && (
        <RulesModal show={showRules} onClose={toggleRules} colorScheme={colorScheme} />
      )}
      {showAwardsPage && (
        <AwardsPage onClose={toggleAwardsPage} />
      )}
      <p className="journey">
        Let's travel from <strong>{startCountry}</strong> to <strong>{endCountry}</strong>!
      </p>
      <p className="subtitle">Can you find the optimal path?</p>
      
      {/* Display current game time during active gameplay */}
      {gameActive && (
        <p className="game-timer" style={{ textAlign: 'center', fontSize: '14px', color: '#bbb' }}>
          Time: {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}
        </p>
      )}

      {/* Display player statistics for debugging (can be removed later) */}
      {playerStats && (
        <div style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginBottom: '10px' }}>
          Games: {playerStats.totalGamesCompleted} | 
          🥇: {playerStats.totalGoldMedals} | 
          🥈: {playerStats.totalSilverMedals} | 
          🥉: {playerStats.totalBronzeMedals} | 
          Streak: {playerStats.loginStreak} days | 
          Achievements: {playerStats.unlockedAchievements.length}
        </div>
      )}
      
      <div className="game-container">
        <div className="input-container">
          <GuessInput
            currentGuess={currentGuess}
            onInputChange={handleInputChange}
            onGuess={handleGuess}
            onSuggestionClick={handleSuggestionClick}
            suggestions={suggestions}
            remainingTurns={remainingTurns}
            gameOver={gameOver}
            colorScheme={colorScheme}
          />
        </div>
        <p className="feedback">{feedback}</p>
        <p className="hint">{hint}</p>
        <button
          className="hint-button"
          onClick={getHint}
          disabled={gameOver || hintUsed}
          style={{ backgroundColor: colorScheme.button, color: colorScheme.text }}
        >
          Get Hint
        </button>
        <div className="map-container" style={{ height: '350px', width: '100%', marginTop: '20px' }}>
          <GameMap
            geoJSONData={geoJSONData}
            mapStyle={mapStyle}
            onEachFeature={onEachFeature}
            colorScheme={colorScheme}
          />
        </div>
        <div className="guesses-container">
          <h2>Your Journey So Far:</h2>
          <GuessesList guessedCountries={guessedCountries} />
        </div>
        
        {gameOver && !showDebrief && (
          <button
            className="new-game"
            onClick={startNewGame}
            style={{ backgroundColor: colorScheme.button, color: colorScheme.text, marginTop: '20px' }}
          >
            Play Again
          </button>
        )}
      </div>

      {/* Smart Facts Toast */}
      {currentFact && <FactToast factText={currentFact} />}

      {/* Achievement Toast */}
      {currentToast && (
        <AchievementToast 
          achievement={currentToast} 
          onDismiss={handleToastDismiss} 
        />
      )}

      {/* Post-Journey Debrief Modal */}
      {showDebrief && (
        <PostJourneyDebrief
          finalGameTime={finalGameTime}
          finalPlayerPath={finalPlayerPath}
          finalOptimalPath={finalOptimalPath}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}


export default App;