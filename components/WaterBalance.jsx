import React, { useState, useEffect, useRef } from 'react';
import { FaWater, FaRedo } from 'react-icons/fa';
import './WaterBalance.css';

const WaterBalance = () => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [inputValue, setInputValue] = useState('');
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const backgroundRef = useRef(null);

  // Загрузка данных из localStorage
  useEffect(() => {
    const savedWaterIntake = localStorage.getItem('waterIntake');
    const savedDailyGoal = localStorage.getItem('dailyGoal');
    if (savedWaterIntake) setWaterIntake(parseInt(savedWaterIntake, 10));
    if (savedDailyGoal) setDailyGoal(parseInt(savedDailyGoal, 10));
  }, []);

  // Сохранение данных в localStorage
  useEffect(() => {
    localStorage.setItem('waterIntake', waterIntake.toString());
  }, [waterIntake]);

  useEffect(() => {
    localStorage.setItem('dailyGoal', dailyGoal.toString());
  }, [dailyGoal]);

  // Подсветка фона при выполнении нормы
  useEffect(() => {
    if (backgroundRef.current) {
      if (waterIntake >= dailyGoal) {
        backgroundRef.current.style.backgroundColor = '#e8f5e9';
      } else {
        backgroundRef.current.style.backgroundColor = '#f8f9fa';
      }
    }
  }, [waterIntake, dailyGoal]);

  // Добавление воды
  const addWater = (amount) => {
    setWaterIntake((prev) => {
      const newAmount = prev + amount;
      if (newAmount >= dailyGoal) {
        alert('Поздравляем! Вы достигли дневной нормы воды!');
      }
      return newAmount;
    });
  };

  // Сброс воды
  const resetWater = () => {
    setWaterIntake(0);
    setIsConfirmationVisible(false);
  };

  // Установка дневной нормы
  const setGoal = () => {
    const newGoal = parseInt(inputValue, 10);
    if (!isNaN(newGoal) && newGoal > 0) {
      setDailyGoal(newGoal);
      setInputValue('');
    } else {
      alert('Пожалуйста, введите корректное число.');
    }
  };

  // Расчет процента выполнения
  const calculatePercentage = () => {
    return Math.round((waterIntake / dailyGoal) * 100);
  };

  return (
    <div className="water-balance-container" ref={backgroundRef}>
      <h1 className="water-balance-title">Водный баланс</h1>

      {/* Круг прогресса */}
      <div className="progress-circle-container">
        <div 
          className="progress-circle"
          style={{
            background: `conic-gradient(${waterIntake >= dailyGoal ? '#66bb6a' : '#3498db'} ${calculatePercentage()}%, #ecf0f1 ${calculatePercentage()}% 100%)`
          }}
        >
          <div className="progress-circle-inner">
            <span className="progress-percent">{calculatePercentage()}%</span>
          </div>
        </div>
      </div>

      <p className="water-amount">
        {waterIntake} / {dailyGoal} мл
      </p>

      {/* Кнопки для добавления воды */}
      <div className="water-buttons">
        <button className="water-button" onClick={() => addWater(250)}>
          <FaWater className="water-icon" />
          <span>250 мл</span>
        </button>
        <button className="water-button" onClick={() => addWater(500)}>
          <FaWater className="water-icon" />
          <span>500 мл</span>
        </button>
      </div>

      {/* Кнопка сброса */}
      <button className="reset-button" onClick={() => setIsConfirmationVisible(true)}>
        <FaRedo className="reset-icon" />
        <span>Сбросить</span>
      </button>

      {/* Установка дневной нормы */}
      <div className="goal-setting">
        <input
          className="goal-input"
          placeholder="Введите дневную норму (мл)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="goal-button" onClick={setGoal}>
          Установить
        </button>
      </div>

      {/* Модальное окно подтверждения */}
      {isConfirmationVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="modal-text">
              Вы действительно хотите сбросить данные о выпитой воде?
            </p>
            <div className="modal-buttons">
              <button className="modal-button cancel" onClick={() => setIsConfirmationVisible(false)}>
                Отмена
              </button>
              <button className="modal-button confirm" onClick={resetWater}>
                Сбросить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterBalance;