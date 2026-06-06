export const formatScore = (score) => {
  return new Intl.NumberFormat('en-US').format(score);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-red-400',
  };
  return colors[difficulty] || 'text-gray-400';
};

export const getCategoryIcon = (category) => {
  const icons = {
    arcade: '🎮',
    classic: '👾',
    puzzle: '🧩',
  };
  return icons[category] || '🎯';
};
