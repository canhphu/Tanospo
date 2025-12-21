import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaClock, FaStar, FaTimes } from "react-icons/fa";
import "../styles/VideoHistory.css";
import "../styles/Dashboard.css"; 

export default function VideoHistory() {
  const navigate = useNavigate();
  const [videoHistory, setVideoHistory] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

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

  const clearHistory = () => {
    if (window.confirm('動画の視聴履歴をすべて削除しますか？')) {
      localStorage.removeItem('videoHistory');
      setVideoHistory([]);
    }
  };

  const handleReviewClick = (video) => {
    setCurrentVideo(video);
    setShowReviewModal(true);
    // Load existing review if any
    const reviews = JSON.parse(localStorage.getItem('videoReviews') || '[]');
    const existingReview = reviews.find(r => r.videoId === video.id);
    if (existingReview) {
      setRating(existingReview.rating);
      setReviewText(existingReview.review || '');
    } else {
      setRating(0);
      setReviewText('');
    }
  };

  const handleSubmitReview = () => {
    if (!currentVideo) return;
    
    const reviews = JSON.parse(localStorage.getItem('videoReviews') || '[]');
    const reviewIndex = reviews.findIndex(r => r.videoId === currentVideo.id);
    
    const newReview = {
      videoId: currentVideo.id,
      videoTitle: currentVideo.title,
      rating,
      review: reviewText,
      timestamp: Date.now()
    };

    if (reviewIndex >= 0) {
      reviews[reviewIndex] = newReview;
    } else {
      reviews.push(newReview);
    }

    localStorage.setItem('videoReviews', JSON.stringify(reviews));
    setShowReviewModal(false);
    alert('レビューを保存しました！');
  };

  const handlePlayVideo = (video) => {
    // Navigate to video player or open in modal
    navigate('/video-player', { state: { video } });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header video-history-header">
        <div className="user-info">
          <button 
            className="back-btn" 
            onClick={() => navigate('/profile')}
          >
            ← 動画視聴履歴
          </button>
        </div>
        
        {videoHistory.length > 0 && (
          <button 
            className="clear-history-btn"
            onClick={clearHistory}
          >
            履歴をクリア
          </button>
        )}
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
              <div className="review-content" onClick={() => handlePlayVideo(video)}>
                <div className="review-header">
                  <div className="video-icon">
                    <FaPlay color="#666" />
                  </div>
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
                <div className="review-image-wrapper" onClick={() => handlePlayVideo(video)}>
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
                  handleReviewClick(video);
                }}
              >
                レビューを書く
              </button>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && currentVideo && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="review-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{currentVideo.title} のレビュー</h3>
              <button className="close-button" onClick={() => setShowReviewModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="rating-section">
                <h4>評価</h4>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`star ${star <= (hoveredStar || rating) ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                    />
                  ))}
                </div>
              </div>
              
              <div className="review-section">
                <h4>レビュー</h4>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="この動画についてどう思いましたか？"
                  rows="5"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="submit-button"
                onClick={handleSubmitReview}
                disabled={!rating || !reviewText.trim()}
              >
                レビューを保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}