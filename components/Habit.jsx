import React from 'react';
import './Habit.css';

const Habit = ({ 
  habit, 
  onDelete, 
  onProgressChange,
  currentDate 
}) => {
  const handleCheckboxChange = (e) => {
    onProgressChange(habit.id, e.target.checked ? 100 : 0);
  };

  const handleNumberChange = (e) => {
    const value = Math.min(
      Number(e.target.value), 
      habit.target ? Number(habit.target) : 100
    );
    onProgressChange(habit.id, value);
  };

  return (
    <motion.div 
      className="futuristic-habit-tracker"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.header 
        className="tracker-header"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <h1 className="neon-text">Трекер привычек</h1>
        <motion.button
          className="holographic-button"
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + Добавить привычку
        </motion.button>
      </motion.header>

      {habits.length === 0 ? (
        <motion.div 
          className="empty-state"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <p>У вас пока нет привычек. Добавьте первую!</p>
          <div className="holographic-orb float"></div>
        </motion.div>
      ) : (
        <motion.div className="habits-grid">
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              className="holographic-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* ... содержимое привычки ... */}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ... модальное окно с анимациями ... */}
    </motion.div>
);
};

// Вспомогательная функция для цвета прогресса
function getProgressColor(progress, target) {
  const percentage = target ? (progress / target) * 100 : progress;
  if (percentage >= 100) return '#2ecc71';
  if (percentage >= 50) return '#f39c12';
  return '#e74c3c';
}

export default Habit;