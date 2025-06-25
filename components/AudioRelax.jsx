import React, { useState, useRef, useEffect } from 'react';
import './AudioRelax.css';

const soundTracks = [
  { id: '1', title: 'Белый шум', icon: '☁️', colors: ['#8EC5FC', '#E0C3FC'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '2', title: 'Лес', icon: '🌿', colors: ['#D4FC79', '#96E6A1'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: '3', title: 'Дождь', icon: '🌧️', colors: ['#A1C4FD', '#C2E9FB'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: '4', title: 'Океан', icon: '🌊', colors: ['#89F7FE', '#66A6FF'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: '5', title: 'Костер', icon: '🔥', colors: ['#FF9A9E', '#FAD0C4'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: '6', title: 'Гроза', icon: '⚡', colors: ['#4B79CF', '#283E51'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { id: '7', title: 'Ручей', icon: '💧', colors: ['#1D976C', '#93F9B9'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { id: '8', title: 'Птицы', icon: '🐦', colors: ['#FFAFBD', '#FFC3A0'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: '9', title: 'Ветер', icon: '🎐', colors: ['#ACB6E5', '#86FDE8'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
  { id: '10', title: 'Ночной лес', icon: '🌙', colors: ['#0F2027', '#203A43'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
  { id: '11', title: 'Камин', icon: '🪵', colors: ['#F46B45', '#EEA849'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
  { id: '12', title: 'Тропики', icon: '🌴', colors: ['#CAC531', '#F3F9A7'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
  { id: '13', title: 'Тибетские чаши', icon: '🎶', colors: ['#7F00FF', '#E100FF'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' },
  { id: '14', title: 'Сердцебиение', icon: '❤️', colors: ['#FF416C', '#FF4B2B'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3' },
  { id: '15', title: 'Космос', icon: '🪐', colors: ['#0F0C29', '#302B63'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3' },
  { id: '16', title: 'Флейта', icon: '🎵', colors: ['#56CCF2', '#2F80ED'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3' },
  { id: '17', title: 'Снегопад', icon: '❄️', colors: ['#E6DADA', '#274046'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3' },
  { id: '18', title: 'Мантры', icon: '🕉️', colors: ['#C9D6FF', '#E2E2E2'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3' },
  { id: '19', title: 'Водопад', icon: '💦', colors: ['#2193B0', '#6DD5ED'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3' },
  { id: '20', title: 'Поющие чаши', icon: '🎵', colors: ['#FFD89B', '#19547B'], uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3' },
];

const AudioRelax = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // Инициализация аудио элемента и подписка на события
  useEffect(() => {
    audioRef.current = new Audio();
    
    const handleLoadedMetadata = () => {
      setDuration(audioRef.current.duration || 1);
    };
    
    const handleTimeUpdate = () => {
      setPosition(audioRef.current.currentTime);
    };
    
    const handleEnded = () => {
      handleNextTrack();
    };
    
    const handleError = () => {
      setError('Не удалось загрузить аудио');
      setIsLoading(false);
      setIsPlaying(false);
    };
    
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('ended', handleEnded);
    audioRef.current.addEventListener('error', handleError);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current = null;
      }
    };
  }, []);

  // Загрузка и воспроизведение аудио
  const loadAudio = async (index) => {
    if (isLoading || currentTrackIndex === index) return;
    
    setIsLoading(true);
    setError(null);
    setCurrentTrackIndex(index);
    
    try {
      // Пауза текущего воспроизведения
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // Установка нового источника
      audioRef.current.src = soundTracks[index].uri;
      
      // Загрузка метаданных
      await new Promise((resolve, reject) => {
        audioRef.current.addEventListener('loadedmetadata', resolve, { once: true });
        audioRef.current.addEventListener('error', reject, { once: true });
      });
      
      // Попытка воспроизведения
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error('Ошибка воспроизведения:', err);
      setError('Ошибка загрузки или воспроизведения аудио');
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Управление воспроизведением (play/pause)
  const handlePlayPause = async () => {
    if (!audioRef.current || currentTrackIndex === null) return;
    
    try {
      if (isPlaying) {
        await audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Ошибка управления воспроизведением:', err);
      setError('Ошибка при попытке воспроизведения');
    }
  };

  // Следующий трек
  const handleNextTrack = () => {
    if (currentTrackIndex === null) return;
    const nextIndex = (currentTrackIndex + 1) % soundTracks.length;
    loadAudio(nextIndex);
  };

  // Предыдущий трек
  const handlePrevTrack = () => {
    if (currentTrackIndex === null) return;
    const prevIndex = (currentTrackIndex - 1 + soundTracks.length) % soundTracks.length;
    loadAudio(prevIndex);
  };

  // Форматирование времени (минуты:секунды)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="audio-relax-container">
      <h1 className="audio-relax-header">Аудио Релаксация</h1>
      
      {error && (
        <div className="audio-error">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="audio-error-close"
            aria-label="Закрыть сообщение об ошибке"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="audio-tracks-grid">
        {soundTracks.map((track, index) => (
          <div
            key={track.id}
            className={`audio-track-card ${currentTrackIndex === index ? 'active' : ''}`}
            style={{ 
              background: `linear-gradient(135deg, ${track.colors[0]}, ${track.colors[1]})`,
              cursor: isLoading ? 'wait' : 'pointer'
            }}
            onClick={() => !isLoading && loadAudio(index)}
            aria-label={`Воспроизвести ${track.title}`}
          >
            <span className="audio-track-icon">{track.icon}</span>
            <h3 className="audio-track-title">{track.title}</h3>
            {currentTrackIndex === index && (
              <div className="audio-track-playing-indicator">
                {isPlaying ? '🔊' : '🔇'}
              </div>
            )}
          </div>
        ))}
      </div>

      {currentTrackIndex !== null && (
        <div className="audio-player">
          <h3 className="audio-player-title">
            {soundTracks[currentTrackIndex].title}
          </h3>
          
          <div className="audio-time-display">
            <span>{formatTime(position)}</span>
            <input
              type="range"
              min="0"
              max={duration || 1}
              value={position}
              onChange={(e) => {
                const newPosition = parseFloat(e.target.value);
                setPosition(newPosition);
                audioRef.current.currentTime = newPosition;
              }}
              className="audio-seek-slider"
              disabled={isLoading}
              aria-label="Прогресс воспроизведения"
            />
            <span>{formatTime(duration)}</span>
          </div>
          
          <div className="audio-controls">
            <button 
              onClick={handlePrevTrack}
              disabled={isLoading}
              className="audio-control-button"
              aria-label="Предыдущий трек"
            >
              ⏮️
            </button>
            
            <button 
              onClick={handlePlayPause}
              disabled={isLoading || !audioRef.current}
              className="audio-control-button play-pause"
              aria-label={isPlaying ? 'Пауза' : 'Воспроизведение'}
            >
              {isPlaying ? '⏸️' : '⏵️'}
            </button>
            
            <button 
              onClick={handleNextTrack}
              disabled={isLoading}
              className="audio-control-button"
              aria-label="Следующий трек"
            >
              ⏭️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRelax;