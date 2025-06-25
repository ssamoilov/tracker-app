import React, { useState } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaList, FaTimes, FaTrash, FaSave } from 'react-icons/fa';
import './MoodCalendar.css';

const MoodCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNotesModalVisible, setIsNotesModalVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [allNotes, setAllNotes] = useState({});

  const handleDayClick = (date) => {
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(dateString);
    
    if (allNotes[dateString]) {
      setMood(allNotes[dateString].mood);
      setNote(allNotes[dateString].note);
      setIsModalVisible(true);
    } else {
      setMood(null);
      setNote('');
      setIsModalVisible(true);
    }
  };

  const saveMood = () => {
    if (selectedDate && mood) {
      const newNote = { mood, note };
      setAllNotes(prev => ({ ...prev, [selectedDate]: newNote }));
      
      setMarkedDates({
        ...markedDates,
        [selectedDate]: {
          className: `mood-${mood}`,
        },
      });
      
      setIsModalVisible(false);
      setMood(null);
      setNote('');
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setMood(null);
    setNote('');
  };

  const deleteNote = () => {
    if (selectedDate) {
      const newAllNotes = { ...allNotes };
      delete newAllNotes[selectedDate];
      setAllNotes(newAllNotes);

      const newMarkedDates = { ...markedDates };
      delete newMarkedDates[selectedDate];
      setMarkedDates(newMarkedDates);

      setIsModalVisible(false);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      if (markedDates[dateString]) {
        return <div className="mood-indicator">{allNotes[dateString]?.mood}</div>;
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      return markedDates[dateString]?.className || '';
    }
    return '';
  };

  const formattedNotes = Object.keys(allNotes).map(date => ({
    date,
    mood: allNotes[date].mood,
    note: allNotes[date].note,
  }));

  return (
    <div className="mood-calendar-container">
      <h1 className="calendar-title">Наблюдайте за своим настроением</h1>
      
      <Calendar
        onChange={handleDayClick}
        value={selectedDate ? new Date(selectedDate) : null}
        tileContent={tileContent}
        tileClassName={tileClassName}
        locale="ru-RU"
      />
      
      <button 
        className="show-notes-button"
        onClick={() => setIsNotesModalVisible(true)}
      >
        <FaList /> Показать все заметки
      </button>

      {isModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">
              {allNotes[selectedDate] ? 'Ваше настроение' : 'Выберите настроение'}
            </h2>
            
            {allNotes[selectedDate] ? (
              <div className="view-mood-container">
                <p className="view-mood">Настроение: {allNotes[selectedDate].mood}</p>
                <p className="view-note">Заметка: {allNotes[selectedDate].note || '—'}</p>
              </div>
            ) : (
              <div className="mood-selection">
                {['😊', '😐', '😔'].map(emoji => (
                  <button
                    key={emoji}
                    className={`mood-button ${mood === emoji ? 'selected' : ''}`}
                    onClick={() => setMood(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
            
            {!allNotes[selectedDate] && (
              <textarea
                className="note-input"
                placeholder="Заметка..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            )}
            
            <div className="modal-buttons">
              {allNotes[selectedDate] ? (
                <button className="delete-button" onClick={deleteNote}>
                  <FaTrash /> Удалить
                </button>
              ) : (
                <button 
                  className="save-button" 
                  onClick={saveMood}
                  disabled={!mood}
                >
                  <FaSave /> Сохранить
                </button>
              )}
              <button className="cancel-button" onClick={closeModal}>
                <FaTimes /> Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {isNotesModalVisible && (
        <div className="modal-overlay">
          <div className="notes-modal-content">
            <h2 className="modal-title">Все заметки</h2>
            
            {formattedNotes.length > 0 ? (
              <div className="notes-list">
                {formattedNotes.map(note => (
                  <div key={note.date} className="note-item">
                    <p className="note-date">{note.date}</p>
                    <p className="note-mood">Настроение: {note.mood}</p>
                    <p className="note-text">Заметка: {note.note || '—'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-notes">Нет сохраненных заметок</p>
            )}
            
            <button 
              className="close-button"
              onClick={() => setIsNotesModalVisible(false)}
            >
              <FaTimes /> Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodCalendar;