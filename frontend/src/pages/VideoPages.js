import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPlay, FaYoutube } from 'react-icons/fa';
import '../styles/VideoPage.css';
import { getVideos } from '../lib/videoData';

export default function VideoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sportId, sportName } = location.state || {};

  const videos = getVideos(sportId);

  return (
    <div className="video-page">
      <div className="video-header">
        <button className="back-btn" onClick={() => navigate('/sports')}>
          ←
        </button>
        <h2>{sportName}</h2>
      </div>
      
      <div className="video-intro">
        <p>あなたの自由時間に応じて、適切なエクササイズをいくつか紹介します。</p>
      </div>

      <div className="video-list">
        {videos.map((video) => (
          <div key={video.id} className="video-item">
            <div className="video-thumbnail">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/320x180/4d73ff/ffffff?text=${encodeURIComponent(video.title)}`;
                }}
              />
              <div className="play-icon">
                <FaPlay />
              </div>
            </div>
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              <div className="video-duration">{video.duration}</div>
            </div>
            <button 
              className="youtube" 
              onClick={() => {
                // Save to video history when clicking YouTube button
                const currentHistory = JSON.parse(localStorage.getItem('videoHistory') || '[]');
                const videoEntry = {
                  id: video.id,
                  title: video.title,
                  thumbnail: video.thumbnail,
                  youtubeUrl: video.youtubeUrl,
                  timestamp: Date.now()
                };
                // Check if already exists (by youtubeUrl) - only save once
                const exists = currentHistory.some(v => v.youtubeUrl === video.youtubeUrl);
                if (!exists) {
                  const updatedHistory = [videoEntry, ...currentHistory].slice(0, 20);
                  localStorage.setItem('videoHistory', JSON.stringify(updatedHistory));
                }
                window.open(video.youtubeUrl, '_blank');
              }}
            > 
              <FaYoutube />
            </button>
            <button 
              className="review-btn"
              onClick={() => {
                // Save to video history when clicking review button
                const currentHistory = JSON.parse(localStorage.getItem('videoHistory') || '[]');
                const videoEntry = {
                  id: video.id,
                  title: video.title,
                  thumbnail: video.thumbnail,
                  youtubeUrl: video.youtubeUrl,
                  timestamp: Date.now()
                };
                // Check if already exists (by youtubeUrl) - only save once
                const exists = currentHistory.some(v => v.youtubeUrl === video.youtubeUrl);
                if (!exists) {
                  const updatedHistory = [videoEntry, ...currentHistory].slice(0, 20);
                  localStorage.setItem('videoHistory', JSON.stringify(updatedHistory));
                }
                // Navigate to video player or review page
                navigate('/video-layer', { state: { video, sportId, sportName } });
              }}
            >
              レビューを見る
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}