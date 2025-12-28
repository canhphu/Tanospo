import React, { useState, useEffect } from "react";
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
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!video) return;
    const stored = JSON.parse(localStorage.getItem("videoReviews") || "[]");
    const videoReviews = stored.filter((r) => r.videoId === video.id);
    // Hiển thị review mới nhất trước
    videoReviews.sort((a, b) => b.timestamp - a.timestamp);
    setReviews(videoReviews);
  }, [video]);

  const formatDate = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString("ja-JP");
    } catch {
      return "";
    }
  };

  const handleSubmitReview = () => {
    const reviews = JSON.parse(localStorage.getItem("videoReviews") || "[]");
    const newReview = {
      videoId: video.id,
      videoTitle: video.title,
      rating,
      review,
      timestamp: Date.now(),
    };
    const updated = [newReview, ...reviews];
    localStorage.setItem("videoReviews", JSON.stringify(updated));
    setReviews((prev) => [newReview, ...prev]);
    setReview("");
    setRating(0);
  };

  return (
    <div className="video-review-page">
      <div className="review-card">
        <div className="review-content">
          <div className="review-header">
            <button
              onClick={() =>
                navigate("/video-page", { state: { sportId: 5, sportName: "ヨガ" } })
              }
              className="back-btn"
            >
              <FaArrowLeft />
            </button>
            <h2>動画レビュー</h2>
          </div>

          {video && (
            <>
              <h3 className="video-title">{video.title}</h3>
            </>
          )}

          <div className="rating-section">
            <h4>評価</h4>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`star ${star <= (hoveredStar || rating) ? "active" : ""}`}
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

          <div className="review-actions">
            <button
              onClick={handleSubmitReview}
              className="comment-btn submit-btn"
              disabled={!rating || !review.trim()}
            >
              レビューを投稿
            </button>
          </div>

          {reviews.length > 0 && (
            <div className="review-list">
              <h4 className="review-list-title">この動画のレビュー</h4>
              {reviews.map((r) => (
                <div key={r.timestamp} className="review-item">
                  <div className="review-item-header">
                    <span className="review-item-title">{r.videoTitle}</span>
                    <span className="review-item-date">{formatDate(r.timestamp)}</span>
                  </div>
                  <div className="review-item-rating">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FaStar
                        key={i}
                        className={`star ${i + 1 <= r.rating ? "active" : ""}`}
                      />
                    ))}
                    <span className="review-item-rating-text">{r.rating}/5</span>
                  </div>
                  <p className="review-item-text">{r.review}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="review-image-wrapper">
          {video && video.thumbnail ? (
            <img className="review-image" src={video.thumbnail} alt={video.title} />
          ) : (
            <div className="placeholder-thumbnail">
              <FaYoutube />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}