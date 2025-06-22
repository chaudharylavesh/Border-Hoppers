export const achievements = [
  // Beginner Achievements
  {
    id: 'firstGame',
    name: 'First Steps',
    description: 'Complete your first game.',
    icon: '👟',
    condition: (stats) => stats.totalGamesCompleted >= 1,
  },
  {
    id: 'firstGold',
    name: 'Golden Debut',
    description: 'Earn your first Gold Medal.',
    icon: '🥇',
    condition: (stats) => stats.totalGoldMedals >= 1,
  },
  {
    id: 'firstSilver',
    name: 'Silver Lining',
    description: 'Earn your first Silver Medal.',
    icon: '🥈',
    condition: (stats) => stats.totalSilverMedals >= 1,
  },
  {
    id: 'firstBronze',
    name: 'Bronze Beginner',
    description: 'Earn your first Bronze Medal.',
    icon: '🥉',
    condition: (stats) => stats.totalBronzeMedals >= 1,
  },

  // Game Completion Milestones
  {
    id: 'games5',
    name: 'Getting Started',
    description: 'Complete 5 games.',
    icon: '🎮',
    condition: (stats) => stats.totalGamesCompleted >= 5,
  },
  {
    id: 'games10',
    name: 'Dedicated Player',
    description: 'Complete 10 games.',
    icon: '🎯',
    condition: (stats) => stats.totalGamesCompleted >= 10,
  },
  {
    id: 'games25',
    name: 'Geography Enthusiast',
    description: 'Complete 25 games.',
    icon: '🌍',
    condition: (stats) => stats.totalGamesCompleted >= 25,
  },
  {
    id: 'games50',
    name: 'Border Hopper',
    description: 'Complete 50 games.',
    icon: '🗺️',
    condition: (stats) => stats.totalGamesCompleted >= 50,
  },
  {
    id: 'games100',
    name: 'World Traveler',
    description: 'Complete 100 games.',
    icon: '✈️',
    condition: (stats) => stats.totalGamesCompleted >= 100,
  },

  // Gold Medal Achievements
  {
    id: 'gold5',
    name: 'Gold Rush',
    description: 'Earn 5 Gold Medals.',
    icon: '🏆',
    condition: (stats) => stats.totalGoldMedals >= 5,
  },
  {
    id: 'gold10',
    name: 'Gold Standard',
    description: 'Earn 10 Gold Medals.',
    icon: '👑',
    condition: (stats) => stats.totalGoldMedals >= 10,
  },
  {
    id: 'gold25',
    name: 'Golden Master',
    description: 'Earn 25 Gold Medals.',
    icon: '🌟',
    condition: (stats) => stats.totalGoldMedals >= 25,
  },
  {
    id: 'gold50',
    name: 'Midas Touch',
    description: 'Earn 50 Gold Medals.',
    icon: '💫',
    condition: (stats) => stats.totalGoldMedals >= 50,
  },

  // Silver Medal Achievements
  {
    id: 'silver10',
    name: 'Silver Streak',
    description: 'Earn 10 Silver Medals.',
    icon: '🌙',
    condition: (stats) => stats.totalSilverMedals >= 10,
  },
  {
    id: 'silver25',
    name: 'Silver Specialist',
    description: 'Earn 25 Silver Medals.',
    icon: '⭐',
    condition: (stats) => stats.totalSilverMedals >= 25,
  },

  // Bronze Medal Achievements
  {
    id: 'bronze10',
    name: 'Bronze Collector',
    description: 'Earn 10 Bronze Medals.',
    icon: '🎖️',
    condition: (stats) => stats.totalBronzeMedals >= 10,
  },
  {
    id: 'bronze25',
    name: 'Persistent Player',
    description: 'Earn 25 Bronze Medals.',
    icon: '🏅',
    condition: (stats) => stats.totalBronzeMedals >= 25,
  },

  // Login Streak Achievements
  {
    id: 'streak3',
    name: 'Three Days Strong',
    description: 'Log in for 3 consecutive days.',
    icon: '🔥',
    condition: (stats) => stats.loginStreak >= 3,
  },
  {
    id: 'streak5',
    name: 'On a Roll!',
    description: 'Log in for 5 consecutive days.',
    icon: '🚀',
    condition: (stats) => stats.loginStreak >= 5,
  },
  {
    id: 'streak7',
    name: 'Week Warrior',
    description: 'Log in for 7 consecutive days.',
    icon: '⚡',
    condition: (stats) => stats.loginStreak >= 7,
  },
  {
    id: 'streak14',
    name: 'Two Week Champion',
    description: 'Log in for 14 consecutive days.',
    icon: '💪',
    condition: (stats) => stats.loginStreak >= 14,
  },
  {
    id: 'streak30',
    name: 'Monthly Master',
    description: 'Log in for 30 consecutive days.',
    icon: '🏆',
    condition: (stats) => stats.loginStreak >= 30,
  },

  // Mixed Medal Achievements
  {
    id: 'allMedals',
    name: 'Triple Threat',
    description: 'Earn at least one of each medal type.',
    icon: '🎨',
    condition: (stats) => stats.totalGoldMedals >= 1 && stats.totalSilverMedals >= 1 && stats.totalBronzeMedals >= 1,
  },
  {
    id: 'medals25',
    name: 'Medal Collector',
    description: 'Earn 25 medals of any type.',
    icon: '🏛️',
    condition: (stats) => (stats.totalGoldMedals + stats.totalSilverMedals + stats.totalBronzeMedals) >= 25,
  },
  {
    id: 'medals50',
    name: 'Medal Hoarder',
    description: 'Earn 50 medals of any type.',
    icon: '💎',
    condition: (stats) => (stats.totalGoldMedals + stats.totalSilverMedals + stats.totalBronzeMedals) >= 50,
  },
  {
    id: 'medals100',
    name: 'Medal Legend',
    description: 'Earn 100 medals of any type.',
    icon: '👑',
    condition: (stats) => (stats.totalGoldMedals + stats.totalSilverMedals + stats.totalBronzeMedals) >= 100,
  },

  // Special Achievements
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Earn 10 Gold Medals with zero Silver or Bronze.',
    icon: '💯',
    condition: (stats) => stats.totalGoldMedals >= 10 && stats.totalSilverMedals === 0 && stats.totalBronzeMedals === 0,
  },
  {
    id: 'consistent',
    name: 'Mr. Consistent',
    description: 'Earn 20 Silver Medals.',
    icon: '🎯',
    condition: (stats) => stats.totalSilverMedals >= 20,
  },
  {
    id: 'determined',
    name: 'Never Give Up',
    description: 'Complete 20 games and earn at least 5 Bronze Medals.',
    icon: '💪',
    condition: (stats) => stats.totalGamesCompleted >= 20 && stats.totalBronzeMedals >= 5,
  },
];