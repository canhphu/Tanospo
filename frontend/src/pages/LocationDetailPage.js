import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { locations } from "../lib/locationsData";
import { getCommentsByLocationId, addComment } from "../lib/comments";
import "../styles/LocationDetailPage.css";

export default function LocationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);

  const [newComment, setNewComment] = useState({
    content: "",
    rating: 5
  });

  useEffect(() => {
    const locationId = parseInt(id);
    const foundLocation = locations.find(loc => loc.id === locationId);
    setLocation(foundLocation);
    
    // Load comments for this location
    const locationComments = getCommentsByLocationId(locationId);
    setComments(locationComments);
    
    setLoading(false);
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddComment = () => {
    if (newComment.content && location) {
      const commentData = {
        locationId: location.id,
        author: "自分",
        rating: 5,
        content: newComment.content
      };
      const addedComment = addComment(commentData);
      setComments([addedComment, ...comments]);
      setNewComment({ content: "" });
    }
  };

  const handleReadReviews = () => {
    // Scroll to comments section
    document.getElementById('comments-section').scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewOnGoogleMaps = () => {
    // Navigate to Map page with location data
    if (location) {
      navigate('/map', { state: { location } });
    } else {
      console.error('Location is not defined');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!location) {
    return <div className="error">Location not found</div>;
  }

  return (
    <div className="location-detail-container">
      {/* Header Image */}
      <div className="location-header">
        <button className="back-button" onClick={handleBack}>
          ← 戻る
        </button>
        <img 
          src={location.image || "/bike-shop-placeholder.jpg"} 
          alt={location.name}
          className="location-image"
        />
      </div>

      {/* Location Info */}
      <div className="location-info">
        <h1 className="location-name">{location.name}</h1>
        
        <div className="location-details">
          <div className="detail-item">
            <span className="detail-icon"></span>
            <span className="detail-text">{location.address}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon"></span>
            <span className="detail-text">営業時間: {location.openTime}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon"></span>
            <span className="detail-text">評価: {location.rating}/5.0</span>
          </div>
          
          {location.facilities && location.facilities.length > 0 && (
            <div className="detail-item facilities">
              <span className="detail-icon"></span>
              <div className="facilities-list">
                {location.facilities.map((facility, index) => (
                  <span key={index} className="facility-tag">{facility}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn-review" onClick={handleReadReviews}>
            場所についてのレビューを読む
          </button>
          <button className="btn-maps" onClick={handleViewOnGoogleMaps}>
            Googleマップでレビューを見る
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div id="comments-section" className="comments-section">
        <h2 className="comments-title">レビュー</h2>
        
        {/* Add Comment Form */}
        <div className="add-comment">
          <h3>レビューを追加</h3>
          <div className="comment-form">
                        
            <div className="rating-input">
              <label>評価:</label>
              <select
                value={newComment.rating}
                onChange={(e) => setNewComment({...newComment, rating: parseInt(e.target.value)})}
                className="rating-select"
              >
                <option value={5}>⭐⭐⭐⭐⭐</option>
                <option value={4}>⭐⭐⭐⭐</option>
                <option value={3}>⭐⭐⭐</option>
                <option value={2}>⭐⭐</option>
                <option value={1}>⭐</option>
              </select>
            </div>
            
            <textarea
              placeholder="レビューを書いてください..."
              value={newComment.content}
              onChange={(e) => setNewComment({...newComment, content: e.target.value})}
              className="comment-textarea"
            />
            
            <button onClick={handleAddComment} className="btn-submit-comment">
              レビューを投稿
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-date">{comment.date}</span>
              </div>
              <div className="comment-rating">
                {'⭐'.repeat(comment.rating)}
              </div>
              <div className="comment-content">{comment.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
