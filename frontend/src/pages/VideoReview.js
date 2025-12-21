import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaYoutube, FaStar, FaArrowLeft } from "react-icons/fa";
import "../styles/VideoReview.css";

export default function VideoReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { video } = location.state || {};

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmitReview = () => {
    const reviews = JSON.parse(localStorage.getItem('videoReviews') || '[]');
    const newReview = {
      videoId: video.id,
      videoTitle: video.title,
      rating,
      review,
      timestamp: Date.now()
    };
    localStorage.setItem('videoReviews', JSON.stringify([...reviews, newReview]));
    alert('レビューを投稿しました！');
    navigate('/video-page', { state: { sportId: 5, sportName: 'ヨガ' } });
  };

  return (
    <div className="video-review">
      <div className="review-header">
        <button onClick={() => navigate('/video-page', { state: { sportId: 5, sportName: 'ヨガ' } })} className="back-btn">
          <FaArrowLeft />
        </button>
        <h2>動画レビュー</h2>
      </div>
      
      {video && (
        <div className="video-info">
          <div className="video-thumbnail">
            {video.thumbnail ? (
              <img src={video.thumbnail} alt={video.title} />
            ) : (
              <div className="placeholder-thumbnail">
                <FaYoutube />
              </div>
            )}
          </div>
          <h3>{video.title}</h3>
        </div>
      )}
      
      <div className="review-form">
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
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="この動画についてどう思いましたか？"
            rows="5"
          />
        </div>
        
        <button 
          onClick={handleSubmitReview}
          className="submit-btn"
          disabled={!rating || !review.trim()}
        >
          レビューを投稿
        </button>
      </div>
    </div>
  );
}