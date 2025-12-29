import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import "../styles/VideoHistory.css";
import "../styles/Dashboard.css"; 

export default function VideoHistory() {
  const navigate = useNavigate();
  const [videoHistory, setVideoHistory] = useState([]);

  // Load video history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('videoHistory');
    if (savedHistory) {
      setVideoHistory(JSON.parse(savedHistory));
    }
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePlayVideo = (video) => {
    navigate('/video-player', { state: { video } });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header video-history-header">
        <div className="video-history-header">
          <button 
            className="back-btn" 
            onClick={() => navigate('/profile')}
          >
            ← 動画視聴履歴
          </button>
        </div>
      </header>

      <div className="review-section">
        {videoHistory.length === 0 ? (
          <div className="empty-state">
            <h3>まだ視聴履歴がありません</h3>
            <p>動画を視聴すると、ここに履歴が表示されます</p>
          </div>
        ) : (
          videoHistory.map((video, index) => (
            <div key={index} className="review-card video-card">
              <div className="review-content">
                <div className="review-header">
                  <div className="video-info">
                    <div className="review-name">{video.title || '無題の動画'}</div>
                    <div className="video-meta">
                      <FaClock className="clock-icon" />
                      {formatDate(video.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
              {video.thumbnail && (
                <div 
                  className="review-image-wrapper" 
                  onClick={() => handlePlayVideo(video)}
                >
                  <img
                    src={video.thumbnail}
                    alt="Thumbnail"
                    className="review-image"
                  />
                </div>
              )}
                          <button 
              className="review-button"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/post', { 
                  state: { 
                    videoUrl: video.videoUrl || video.url,
                    location: video.location || video.address || '', // Try multiple possible location properties
                    locationName: video.locationName || video.name || video.title || '', // Add location name if available
                    thumbnail: video.thumbnail || '',
                    title: video.title || '無題の動画'
                  } 
                });
              }}
            >
              レビューを書く
            </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}