import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaRegHeart, FaYoutube } from "react-icons/fa";
import { postsAPI } from "../api/posts";
import { usersAPI } from "../api/users";
import { locationsAPI } from "../api/locations";
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
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Load liked posts from localStorage
    const savedLikedPosts = localStorage.getItem('likedPosts');
    if (savedLikedPosts) {
      setLikedPosts(new Set(JSON.parse(savedLikedPosts)));
    }
  }, []);

  useEffect(() => {
    // Fetch posts from backend
    const fetchPosts = async () => {
      try {
        const data = await postsAPI.getAll({ limit: 50, offset: 0 });
        const uniqueUserIds = Array.from(new Set((data || []).map(p => p.userId).filter(Boolean)));
        const uniqueLocationIds = Array.from(new Set((data || []).map(p => p.locationId).filter(id => !!id)));
        const userMap = {};
        const locationMap = {};
        await Promise.all(uniqueUserIds.map(async (uid) => {
          try {
            const u = await usersAPI.getById(uid);
            userMap[uid] = u;
          } catch { /* ignore missing users */ }
        }));
        await Promise.all(uniqueLocationIds.map(async (lid) => {
          try {
            const l = await locationsAPI.getById(lid);
            locationMap[lid] = l;
          } catch { /* ignore missing locations */ }
        }));
        const adapted = (data || []).map(p => ({
          id: p.id,
          author: {
            name: (userMap[p.userId]?.name) || (userMap[p.userId]?.email?.split('@')[0]) || 'ユーザー',
            avatar: userMap[p.userId]?.avatarUrl || 'https://picsum.photos/seed/avatar123/36/48.jpg',
            location: locationMap[p.locationId]?.name || '—',
          },
          content: p.content,
          image: p.imageUrl ? { src: p.imageUrl, alt: 'post' } : null,
          videoUrl: p.videoUrl,
          timestamp: p.createdAt || new Date().toISOString(),
          likes: Array.isArray(p.likedBy) ? p.likedBy.length : 0,
        }));
        setPosts(adapted);
      } catch (e) {
        console.error('Failed to load posts:', e);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    // Save liked posts to localStorage
    localStorage.setItem('likedPosts', JSON.stringify(Array.from(likedPosts)));
  }, [likedPosts]);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate('/login'); 
    setIsDropdownOpen(false); 
  };

  const handleGoToProfile = () => {
    navigate('/profile'); 
    setIsDropdownOpen(false); 
  };

  const toggleLike = async (postId) => {
    const newLikedPosts = new Set(likedPosts);
    try {
      await postsAPI.toggleLike(postId);
      if (newLikedPosts.has(postId)) {
        newLikedPosts.delete(postId);
      } else {
        newLikedPosts.add(postId);
      }
      setLikedPosts(newLikedPosts);
      // Optimistically update likes count in UI
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + (newLikedPosts.has(postId) ? 1 : -1) } : p));
    } catch (e) {
      console.error('Failed to toggle like:', e);
    }
  };

  const handleComment = (postId) => {
    setShowCommentModal(postId);
    // Load comments from backend
    postsAPI.getComments(postId)
      .then(async (list) => {
        const uniqueUserIds = Array.from(new Set((list || []).map(c => c.userId).filter(Boolean)));
        const userMap = {};
        await Promise.all(uniqueUserIds.map(async (uid) => {
          try {
            const u = await usersAPI.getById(uid);
            userMap[uid] = u;
          } catch { /* ignore */ }
        }));
        const adapted = (list || []).map(c => ({
          id: c.id,
          author: (userMap[c.userId]?.name) || (userMap[c.userId]?.email?.split('@')[0]) || 'ユーザー',
          text: c.content,
          timestamp: new Date(c.createdAt).toLocaleString(),
        }));
        setComments(prev => ({ ...prev, [postId]: adapted }));
      })
      .catch(e => console.error('Failed to load comments:', e));
  };

  const handleCloseModal = () => {
    setShowCommentModal(null);
  };

  const handleAddComment = (postId) => {
    const commentText = newComments[postId];
    if (commentText && commentText.trim()) {
      postsAPI.addComment(postId, { content: commentText.trim(), rating: 5 })
        .then(saved => {
          const newComment = {
            id: saved.id,
            text: saved.content,
            author: user?.name || (user?.email ? user.email.split('@')[0] : 'ユーザー'),
            timestamp: new Date(saved.createdAt).toLocaleString(),
          };
          setComments(prev => ({
            ...prev,
            [postId]: [...(prev[postId] || []), newComment]
          }));
          setNewComments(prev => ({
            ...prev,
            [postId]: ''
          }));
        })
        .catch(e => console.error('Failed to add comment:', e));
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
              {post.image && (
                <img
                  src={post.image.src}
                  alt={post.image.alt}
                  className="review-image"
                />
              )}
              {post.videoUrl && (
                <a 
                  href={post.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="video-link"
                  style={{ display: 'block', marginTop: '10px', textAlign: 'center' }}
                >
                  <button style={{ padding: '8px 16px', background: '#ff0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <FaYoutube /> YouTube で見る
                  </button>
                </a>
              )}
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