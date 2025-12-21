import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { getAllPosts } from "../lib/posts";
import "../styles/Dashboard.css";

const UserDropdown = ({ onLogout, onGoToProfile }) => {
  return (
    <div className="user-dropdown">
      <button className="dropdown-item" onClick={onGoToProfile}>
        Profile
      </button>
      <button className="dropdown-item logout-item" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [showCommentModal, setShowCommentModal] = useState(null);
  const posts = getAllPosts();

  useEffect(() => {
    // Load liked posts from localStorage
    const savedLikedPosts = localStorage.getItem('likedPosts');
    if (savedLikedPosts) {
      setLikedPosts(new Set(JSON.parse(savedLikedPosts)));
    }
  }, []);

  useEffect(() => {
    // Save liked posts to localStorage
    localStorage.setItem('likedPosts', JSON.stringify(Array.from(likedPosts)));
  }, [likedPosts]);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    alert("Đang đăng xuất...");
    logout();
    navigate('/login'); 
    setIsDropdownOpen(false); 
  };

  const handleGoToProfile = () => {
    navigate('/profile'); 
    setIsDropdownOpen(false); 
  };

  const toggleLike = (postId) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  const handleComment = (postId) => {
    setShowCommentModal(postId);
  };

  const handleCloseModal = () => {
    setShowCommentModal(null);
  };

  const handleAddComment = (postId) => {
    const commentText = newComments[postId];
    if (commentText && commentText.trim()) {
      const newComment = {
        id: Date.now(),
        text: commentText.trim(),
        author: user?.name || user?.email?.split('@')[0] || 'User',
        timestamp: new Date().toLocaleString()
      };
      
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }));
      
      setNewComments(prev => ({
        ...prev,
        [postId]: ''
      }));
    }
  };

  const handleCommentChange = (postId, value) => {
    setNewComments(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="user-info">
          <img
            src="https://picsum.photos/seed/avatar123/48/48.jpg"
            alt="User avatar"
            className="avatar"
            onClick={toggleDropdown}
          />
          <span className="welcome-text">
            {`${user?.name || (user?.email ? user.email.split('@')[0] : 'ゲスト')}さん、おはよう！頑張って先輩できるように練習を始めましょう。`}
          </span>
          {isDropdownOpen && (
            <UserDropdown 
              onLogout={handleLogout} 
              onGoToProfile={handleGoToProfile} 
            />
          )}
        </div>
        
        <button className="start-btn" onClick={() => navigate('/sports')}>スタート</button>
      </header>

      <div className="review-section">
        <button className="write-btn" onClick={() => navigate('/post')}>レビューを書く</button>

        {posts.map(post => (
          <div key={post.id} className="review-card">
            <div className="review-content">
              <div className="review-header">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="review-avatar"
                />
                <span className="review-name">{post.author.name} - {post.author.location}</span>
              </div>
              <p className="review-text">{post.content}</p>
              <div className="review-actions">
                {likedPosts.has(post.id) ? (
                  <FaHeart 
                    className="heart liked"
                    onClick={() => toggleLike(post.id)}
                  />
                ) : (
                  <FaRegHeart 
                    className="heart"
                    onClick={() => toggleLike(post.id)}
                  />
                )}
                <button className="comment-btn" onClick={() => handleComment(post.id)}>Comment</button>
              </div>
            </div>
            <div className="review-image-wrapper">
              <img
                src={post.image.src}
                alt={post.image.alt}
                className="review-image"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="comment-modal-overlay" onClick={handleCloseModal}>
          <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="comment-modal-header">
              <h3>Comments</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="comments-list">
              {comments[showCommentModal]?.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-author">{comment.author}</div>
                  <div className="comment-text">{comment.text}</div>
                  <div className="comment-time">{comment.timestamp}</div>
                </div>
              )) || <p className="no-comments">No comments yet. Be the first to comment!</p>}
            </div>
            
            <div className="comment-input-section">
              <textarea
                className="comment-input"
                placeholder="Write a comment..."
                value={newComments[showCommentModal] || ''}
                onChange={(e) => handleCommentChange(showCommentModal, e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleAddComment(showCommentModal);
                  }
                }}
              />
              <button 
                className="send-comment-btn"
                onClick={() => handleAddComment(showCommentModal)}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}