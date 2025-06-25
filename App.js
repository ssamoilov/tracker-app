import React, { useState, useEffect } from 'react';
import AudioRelax from './components/AudioRelax';
import MoodCalendar from './components/MoodCalendar';
import WaterBalance from './components/WaterBalance';
import './styles.css';

// Компонент для отдельной привычки
const Habit = ({ habit, onDelete, onProgressChange, currentDate }) => {
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

  const progress = habit.history[currentDate] || 0;
  const progressPercentage = habit.target 
    ? (progress / habit.target) * 100 
    : progress;

  const getProgressColor = () => {
    if (progressPercentage >= 100) return '#2ecc71';
    if (progressPercentage >= 50) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div className="habit-card">
      <div className="habit-header">
        <h3>{habit.name}</h3>
        <button 
          className="delete-button"
          onClick={() => onDelete(habit.id)}
          aria-label="Удалить привычку"
        >
          ×
        </button>
      </div>

      {habit.type === 'daily' ? (
        <div className="daily-habit">
          <label>
            <input
              type="checkbox"
              checked={progress === 100}
              onChange={handleCheckboxChange}
            />
            <span>Выполнено сегодня</span>
          </label>
        </div>
      ) : (
        <div className="measurable-habit">
          <div className="progress-container">
            <input
              type="number"
              value={progress}
              min="0"
              max={habit.target || 100}
              onChange={handleNumberChange}
            />
            {habit.target && (
              <span> / {habit.target} {habit.unit}</span>
            )}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: getProgressColor()
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент трекера привычек
const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    type: 'daily',
    target: '',
    unit: ''
  });
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) setHabits(JSON.parse(savedHabits));
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (!newHabit.name.trim()) return;
    
    const habit = {
      id: Date.now(),
      name: newHabit.name.trim(),
      type: newHabit.type,
      target: newHabit.type === 'measurable' ? Number(newHabit.target) : null,
      unit: newHabit.type === 'measurable' ? newHabit.unit.trim() : null,
      history: {}
    };
    
    setHabits([...habits, habit]);
    setNewHabit({ name: '', type: 'daily', target: '', unit: '' });
    setShowModal(false);
  };

  const updateProgress = (id, value) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        return {
          ...habit,
          history: {
            ...habit.history,
            [currentDate]: Number(value)
          }
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  return (
    <div className="habit-tracker">
      <header className="habit-header">
        <h1>Трекер привычек</h1>
        <button 
          className="add-button"
          onClick={() => setShowModal(true)}
        >
          + Добавить привычку
        </button>
      </header>

      <div className="habits-list">
        {habits.length === 0 ? (
          <div className="empty-state">
            <p>У вас пока нет привычек. Добавьте первую!</p>
          </div>
        ) : (
          habits.map(habit => (
            <Habit
              key={habit.id}
              habit={habit}
              onDelete={deleteHabit}
              onProgressChange={updateProgress}
              currentDate={currentDate}
            />
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Новая привычка</h2>
            
            <div className="form-group">
              <label>Название:</label>
              <input
                type="text"
                value={newHabit.name}
                onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                placeholder="Например: Пить воду"
              />
            </div>
            
            <div className="form-group">
              <label>Тип:</label>
              <select
                value={newHabit.type}
                onChange={(e) => setNewHabit({...newHabit, type: e.target.value})}
              >
                <option value="daily">Ежедневная</option>
                <option value="measurable">Измеряемая</option>
              </select>
            </div>
            
            {newHabit.type === 'measurable' && (
              <>
                <div className="form-group">
                  <label>Целевое значение:</label>
                  <input
                    type="number"
                    value={newHabit.target}
                    onChange={(e) => setNewHabit({...newHabit, target: e.target.value})}
                    placeholder="Например: 8"
                  />
                </div>
                
                <div className="form-group">
                  <label>Единица измерения:</label>
                  <input
                    type="text"
                    value={newHabit.unit}
                    onChange={(e) => setNewHabit({...newHabit, unit: e.target.value})}
                    placeholder="Например: стаканов"
                  />
                </div>
              </>
            )}
            
            <div className="modal-buttons">
              <button 
                className="cancel-button"
                onClick={() => setShowModal(false)}
              >
                Отмена
              </button>
              <button 
                className="save-button"
                onClick={addHabit}
                disabled={!newHabit.name.trim()}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент заметок
const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    text: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!newNote.title.trim()) return;
    
    const note = {
      id: Date.now().toString(),
      ...newNote,
      createdAt: new Date().toISOString()
    };
    
    setNotes([...notes, note]);
    setShowAddModal(false);
    setNewNote({ title: '', text: '', date: new Date().toISOString().split('T')[0] });
  };

  const filteredNotes = selectedDate
    ? notes.filter(note => note.date === selectedDate)
    : [...notes].sort((a, b) => new Date(b.date) - new Date(a.date));

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h1>Мои заметки</h1>
        <button 
          className="calendar-button"
          onClick={() => setShowCalendar(true)}
        >
          📅 Календарь
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="empty-notes">
          <p>Нет заметок</p>
        </div>
      ) : (
        <div className="notes-list">
          {filteredNotes.map(note => (
            <div key={note.id} className="note-card">
              <div className="note-date">{formatDate(note.date)}</div>
              <h3 className="note-title">{note.title}</h3>
              <p className="note-text">{note.text}</p>
            </div>
          ))}
        </div>
      )}

      {showCalendar && (
        <div className="modal-overlay">
          <div className="calendar-modal">
            <input 
              type="date" 
              value={selectedDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setShowCalendar(false);
              }}
            />
            <button 
              className="close-btn"
              onClick={() => setShowCalendar(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="add-note-modal">
            <h2>Новая заметка</h2>
            
            <div className="form-group">
              <label>Дата</label>
              <input
                type="date"
                value={newNote.date}
                onChange={(e) => setNewNote({...newNote, date: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Заголовок*</label>
              <input
                type="text"
                placeholder="Название заметки"
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Текст заметки</label>
              <textarea
                placeholder="Ваши мысли..."
                value={newNote.text}
                onChange={(e) => setNewNote({...newNote, text: e.target.value})}
              />
            </div>
            
            <div className="modal-buttons">
              <button 
                className="cancel-button"
                onClick={() => setShowAddModal(false)}
              >
                Отмена
              </button>
              <button 
                className="save-button"
                onClick={addNote}
                disabled={!newNote.title.trim()}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        className="add-note-btn"
        onClick={() => setShowAddModal(true)}
      >
        +
      </button>
    </div>
  );
};

// Главный компонент приложения
const App = () => {
  const [activeTab, setActiveTab] = useState('habits');

  return (
    <div className="app">
      <div className="tabs">

        <button
          className={`tab-btn ${activeTab === 'habits' ? 'active' : ''}`}
          onClick={() => setActiveTab('habits')}
        >
          Трекер привычек
        </button>

        <button
          className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Мои заметки
        </button>

        <button
          className={`tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
          onClick={() => setActiveTab('audio')}
        >
          Аудио
        </button>

        <button
          className={`tab-btn ${activeTab === 'mood' ? 'active' : ''}`}
          onClick={() => setActiveTab('mood')}
        >
          Календарь настроения
        </button>

          <button
          className={`tab-btn ${activeTab === 'water' ? 'active' : ''}`}
          onClick={() => setActiveTab('water')}
        >
          Водный баланс
        </button>

      </div>

      {activeTab === 'habits' ? (
        <HabitTracker />
      ) : activeTab === 'notes' ? (
        <Notes />
      ) : activeTab === 'audio' ? (
        <AudioRelax />
      ) : activeTab === 'mood' ? (
        <MoodCalendar />
      ) : (
        <WaterBalance />
      ) }
    </div>
  );
};

export default App;