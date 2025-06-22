/**
 * Achievement Service for Border Hoppers Game
 * Handles achievement checking and unlocking logic
 */

import { achievements } from '../data/achievements.js';
import { getPlayerStats, savePlayerStats } from './statsService.js';

/**
 * Checks all achievements against current player stats and unlocks any newly earned ones
 * @returns {Array} Array of newly unlocked achievement objects
 */
export const checkAndUnlockAchievements = () => {
  try {
    // Get current player statistics
    const currentStats = getPlayerStats();
    
    // Initialize array to track newly unlocked achievements
    const newlyUnlocked = [];
    
    // Create a copy of stats to modify
    const updatedStats = { ...currentStats };
    
    // Ensure unlockedAchievements array exists
    if (!Array.isArray(updatedStats.unlockedAchievements)) {
      updatedStats.unlockedAchievements = [];
    }
    
    // Check each achievement
    achievements.forEach(achievement => {
      // Skip if already unlocked
      if (updatedStats.unlockedAchievements.includes(achievement.id)) {
        return;
      }
      
      // Check if achievement condition is met
      try {
        if (achievement.condition(currentStats)) {
          // Achievement unlocked!
          newlyUnlocked.push(achievement);
          updatedStats.unlockedAchievements.push(achievement.id);
        }
      } catch (conditionError) {
        console.error(`Error checking condition for achievement ${achievement.id}:`, conditionError);
      }
    });
    
    // Save updated stats if any achievements were unlocked
    if (newlyUnlocked.length > 0) {
      savePlayerStats(updatedStats);
    }
    
    return newlyUnlocked;
    
  } catch (error) {
    console.error('Error in checkAndUnlockAchievements:', error);
    return [];
  }
};

/**
 * Gets all unlocked achievements with their full details
 * @returns {Array} Array of unlocked achievement objects
 */
export const getUnlockedAchievements = () => {
  try {
    const currentStats = getPlayerStats();
    const unlockedIds = currentStats.unlockedAchievements || [];
    
    return achievements.filter(achievement => 
      unlockedIds.includes(achievement.id)
    );
  } catch (error) {
    console.error('Error getting unlocked achievements:', error);
    return [];
  }
};

/**
 * Gets achievement progress for display purposes
 * @returns {Object} Object containing achievement progress data
 */
export const getAchievementProgress = () => {
  try {
    const currentStats = getPlayerStats();
    const unlockedCount = (currentStats.unlockedAchievements || []).length;
    const totalCount = achievements.length;
    const progressPercentage = Math.round((unlockedCount / totalCount) * 100);
    
    return {
      unlocked: unlockedCount,
      total: totalCount,
      percentage: progressPercentage,
      remaining: totalCount - unlockedCount
    };
  } catch (error) {
    console.error('Error getting achievement progress:', error);
    return {
      unlocked: 0,
      total: achievements.length,
      percentage: 0,
      remaining: achievements.length
    };
  }
};

/**
 * Checks if a specific achievement is unlocked
 * @param {string} achievementId - The ID of the achievement to check
 * @returns {boolean} True if the achievement is unlocked
 */
export const isAchievementUnlocked = (achievementId) => {
  try {
    const currentStats = getPlayerStats();
    return (currentStats.unlockedAchievements || []).includes(achievementId);
  } catch (error) {
    console.error('Error checking if achievement is unlocked:', error);
    return false;
  }
};

/**
 * Gets achievements that are close to being unlocked (for hints/motivation)
 * @param {number} threshold - How close the player needs to be (default: 0.8 = 80%)
 * @returns {Array} Array of nearly unlocked achievements with progress info
 */
export const getNearlyUnlockedAchievements = (threshold = 0.8) => {
  try {
    const currentStats = getPlayerStats();
    const unlockedIds = currentStats.unlockedAchievements || [];
    const nearlyUnlocked = [];
    
    achievements.forEach(achievement => {
      // Skip already unlocked achievements
      if (unlockedIds.includes(achievement.id)) {
        return;
      }
      
      // For simple numeric conditions, calculate progress
      // This is a simplified approach - could be expanded for more complex conditions
      try {
        const conditionString = achievement.condition.toString();
        
        // Look for patterns like "stats.totalGamesCompleted >= 10"
        const numericMatch = conditionString.match(/stats\.(\w+)\s*>=\s*(\d+)/);
        
        if (numericMatch) {
          const [, statKey, targetValue] = numericMatch;
          const currentValue = currentStats[statKey] || 0;
          const target = parseInt(targetValue);
          const progress = currentValue / target;
          
          if (progress >= threshold && progress < 1) {
            nearlyUnlocked.push({
              ...achievement,
              progress: {
                current: currentValue,
                target: target,
                percentage: Math.round(progress * 100)
              }
            });
          }
        }
      } catch (parseError) {
        // Skip achievements we can't parse
        console.warn(`Could not parse condition for achievement ${achievement.id}`);
      }
    });
    
    return nearlyUnlocked;
  } catch (error) {
    console.error('Error getting nearly unlocked achievements:', error);
    return [];
  }
};