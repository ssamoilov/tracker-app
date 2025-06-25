import React, { useState, useEffect } from 'react';
import './Notes.css';

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

  // Загрузка заметок
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  // Сохранение заметок
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Добавление заметки
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

  // Фильтрация заметок по дате
  const filteredNotes = selectedDate
    ? notes.filter(note => note.date === selectedDate)
    : [...notes].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Форматирование даты
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h1>Мои заметки</h1>
        <button 
          className="calendar-btn"
          onClick={() => setShowCalendar(true)}
        >
          📅
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

      {/* Календарь */}
      {showCalendar && (
        <div className="modal-overlay">
          <div className="calendar-modal">
            <div className="calendar-wrapper">
              {/* Здесь можно подключить react-calendar */}
              <input 
                type="date" 
                value={selectedDate || new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setShowCalendar(false);
                }}
              />
            </div>
            <button 
              className="close-btn"
              onClick={() => setShowCalendar(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Модальное окно добавления */}
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
                className="cancel-btn"
                onClick={() => setShowAddModal(false)}
              >
                Отмена
              </button>
              <button 
                className="save-btn"
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

export default Notes;