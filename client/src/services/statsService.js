/**
 * Statistics Service for Border Hoppers Game
 * Handles all localStorage interactions for player statistics
 */

const STATS_STORAGE_KEY = 'borderHoppersPlayerStats';

// Default structure for player statistics
const initialStats = {
  totalGamesCompleted: 0,
  totalGoldMedals: 0,
  totalSilverMedals: 0,
  totalBronzeMedals: 0,
  loginStreak: 1,
  lastLoginDate: new Date().toISOString().split('T')[0], // 'YYYY-MM-DD'
  unlockedAchievements: [] // Array of achievement IDs
};

/**
 * Retrieves player statistics from localStorage
 * @returns {Object} Player stats object or initial stats if none found
 */
export const getPlayerStats = () => {
  try {
    const storedStats = localStorage.getItem(STATS_STORAGE_KEY);
    
    if (storedStats) {
      const parsedStats = JSON.parse(storedStats);
      
      // Ensure all required properties exist (for backward compatibility)
      return {
        ...initialStats,
        ...parsedStats,
        // Ensure unlockedAchievements is always an array
        unlockedAchievements: Array.isArray(parsedStats.unlockedAchievements) 
          ? parsedStats.unlockedAchievements 
          : []
      };
    }
    
    return { ...initialStats };
  } catch (error) {
    console.error('Error retrieving player stats from localStorage:', error);
    return { ...initialStats };
  }
};

/**
 * Saves player statistics to localStorage
 * @param {Object} stats - The stats object to save
 */
export const savePlayerStats = (stats) => {
  try {
    const statsToSave = {
      ...initialStats,
      ...stats,
      // Ensure lastLoginDate is always a valid date string
      lastLoginDate: stats.lastLoginDate || new Date().toISOString().split('T')[0],
      // Ensure unlockedAchievements is always an array
      unlockedAchievements: Array.isArray(stats.unlockedAchievements) 
        ? stats.unlockedAchievements 
        : []
    };
    
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(statsToSave));
  } catch (error) {
    console.error('Error saving player stats to localStorage:', error);
  }
};

/**
 * Utility function to get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
export const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Utility function to calculate the difference in days between two dates
 * @param {string} date1 - First date in YYYY-MM-DD format
 * @param {string} date2 - Second date in YYYY-MM-DD format
 * @returns {number} Difference in days
 */
export const getDaysDifference = (date1, date2) => {
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  const timeDifference = secondDate.getTime() - firstDate.getTime();
  return Math.floor(timeDifference / (1000 * 3600 * 24));
};

/**
 * Updates login streak based on last login date
 * @param {Object} currentStats - Current player statistics
 * @returns {Object} Updated stats with correct login streak
 */
export const updateLoginStreak = (currentStats) => {
  const today = getTodayDateString();
  const lastLogin = currentStats.lastLoginDate;
  
  if (!lastLogin) {
    // First time login
    return {
      ...currentStats,
      loginStreak: 1,
      lastLoginDate: today
    };
  }
  
  const daysDifference = getDaysDifference(lastLogin, today);
  
  if (daysDifference === 0) {
    // Same day - no change needed
    return currentStats;
  } else if (daysDifference === 1) {
    // Yesterday - increment streak
    return {
      ...currentStats,
      loginStreak: currentStats.loginStreak + 1,
      lastLoginDate: today
    };
  } else {
    // More than 1 day ago - reset streak
    return {
      ...currentStats,
      loginStreak: 1,
      lastLoginDate: today
    };
  }
};

/**
 * Increments game completion stats based on medal earned
 * @param {Object} currentStats - Current player statistics
 * @param {string} medalType - Type of medal earned ('GOLD', 'SILVER', 'BRONZE')
 * @returns {Object} Updated stats with incremented counters
 */
export const incrementGameStats = (currentStats, medalType) => {
  const updatedStats = {
    ...currentStats,
    totalGamesCompleted: currentStats.totalGamesCompleted + 1
  };
  
  switch (medalType) {
    case 'GOLD':
      updatedStats.totalGoldMedals = currentStats.totalGoldMedals + 1;
      break;
    case 'SILVER':
      updatedStats.totalSilverMedals = currentStats.totalSilverMedals + 1;
      break;
    case 'BRONZE':
      updatedStats.totalBronzeMedals = currentStats.totalBronzeMedals + 1;
      break;
    default:
      console.warn('Unknown medal type:', medalType);
  }
  
  return updatedStats;
};