import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import { getVideos } from '../lib/videoData';
import "../styles/VideoHistory.css";
import "../styles/Dashboard.css"; 

export default function VideoHistory() {
  const navigate = useNavigate();
  const [videoHistory, setVideoHistory] = useState([]);

  // Load video history from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('videoHistory') || '[]');
    if (stored && stored.length > 0) {
      setVideoHistory(stored);
    } else {
      // If no history, show empty state
      setVideoHistory([]);
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
    // Open YouTube URL in new tab
    const youtubeUrl = video.youtubeUrl || video.url || video.videoUrl;
    if (youtubeUrl) {
      // Save to video history when clicking to watch
      const currentHistory = JSON.parse(localStorage.getItem('videoHistory') || '[]');
      const videoEntry = {
        id: video.id || Date.now(),
        title: video.title || '無題の動画',
        thumbnail: video.thumbnail || `https://img.youtube.com/vi/${extractYouTubeId(youtubeUrl)}/hqdefault.jpg`,
        youtubeUrl: youtubeUrl,
        timestamp: Date.now()
      };
      // Check if already exists (by youtubeUrl) - only save once
      const exists = currentHistory.some(v => v.youtubeUrl === youtubeUrl);
      if (!exists) {
        const updatedHistory = [videoEntry, ...currentHistory].slice(0, 20);
        localStorage.setItem('videoHistory', JSON.stringify(updatedHistory));
        // Update state to reflect new history
        setVideoHistory(updatedHistory);
      }
      window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.error('No YouTube URL found for video:', video);
    }
  };

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url) => {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : '';
  };

  const handleClearHistory = () => {
    if (window.confirm('履歴をクリアしますか？')) {
      setVideoHistory([]);
      localStorage.removeItem('videoHistory');
    }
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
          {videoHistory.length > 0 && (
            <button 
              className="clear-btn" 
              onClick={handleClearHistory}
            >
              履歴をクリア
            </button>
          )}
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
                  navigate('/video-review', { 
                    state: { 
                      video: {
                        id: video.id || Date.now(),
                        title: video.title || '無題の動画',
                        thumbnail: video.thumbnail || '',
                        youtubeUrl: video.youtubeUrl || video.url || video.videoUrl,
                        url: video.youtubeUrl || video.url || video.videoUrl,
                        videoUrl: video.youtubeUrl || video.url || video.videoUrl,
                        description: video.description || '',
                        category: video.category || 'ヨガ',
                        uploadDate: video.uploadDate || video.timestamp
                      }
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