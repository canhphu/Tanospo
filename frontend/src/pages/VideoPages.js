import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlay, FaYoutube } from "react-icons/fa";
import "../styles/VideoPage.css";

export default function VideoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sportId, sportName } = location.state || {};

  // Sample video data based on sport
  const getVideos = (sportId) => {
    if (sportId === 5) { // Yoga
      return [
        {
          id: 1,
          title: "初心者向けヨガ - 15分",
          description: "ヨガを始めたばかりの方に最適な基本ポーズ集",
          duration: "15分",
          thumbnail: "https://i.ytimg.com/vi/v7AYKMP6rOE/hqdefault.jpg",
          youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"
        },
        {
          id: 2,
          title: "朝のヨガルーティン",
          description: "一日を元気に始めるための簡単なヨガ",
          duration: "10分",
          thumbnail: "https://i.ytimg.com/vi/oBu-pQG6sTY/hqdefault.jpg",
          youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"
        },
        {
          id: 3,
          title: "リラックスヨガ",
          description: "ストレス解消に効果的なゆったりとしたヨガ",
          duration: "20分",
          thumbnail: "https://i.ytimg.com/vi/insFAL9yLc8/hqdefault.jpg",
          youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"
        }
      ];
    } else if (sportId === 6) { // Gym
      return [
        {
          id: 1,
          title: "自宅でできる筋トレ - 上半身",
          description: "胸、背中、腕の筋トレメニュー",
          duration: "15分",
          thumbnail: "https://i.ytimg.com/vi/2mjLTIfirS4/hqdefault.jpg",
          youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"
        },
        {
          id: 2,
          title: "腹筋トレーニング",
          description: "引き締まった腹筋を手に入れるためのトレーニング",
          duration: "10分",
          thumbnail: "https://i.ytimg.com/vi/XjwevJIC6Es/hqdefault.jpg",
          youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"
        },
        {
          id: 3,
          title: "足と腰の筋トレ",
          description: "走る、ジャンプするための足と腰の筋トレ",
          duration: "20分",
          thumbnail: "https://i.ytimg.com/vi/k4XukpN3wtA/hqdefault.jpg",
          youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"
        }
      ];
    } else {
      return [];
    }
  };

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
            <button className="youtube" onClick={() => window.open(video.youtubeUrl, '_blank')}> <FaYoutube /></button>
            <button 
              className="review-btn"
              onClick={() => {
                // Add to video history
                const currentHistory = JSON.parse(localStorage.getItem('videoHistory') || '[]');
                const newEntry = {
                  id: video.id,
                  title: video.title,
                  thumbnail: video.thumbnail,
                  youtubeUrl: video.youtubeUrl,
                  timestamp: Date.now()
                };
                const updatedHistory = [newEntry, ...currentHistory].slice(0, 20); // Keep last 20 videos
                localStorage.setItem('videoHistory', JSON.stringify(updatedHistory));
                // Navigate to video player or review page
                navigate('/video-review', { state: { video } });
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