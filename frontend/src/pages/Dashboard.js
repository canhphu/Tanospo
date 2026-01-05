import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaRegHeart, FaYoutube } from "react-icons/fa";
import { postsAPI } from "../api/posts";
import { usersAPI } from "../api/users";
import { locationsAPI } from "../api/locations";
import "../styles/Dashboard.css";

// Extract YouTube video ID from URL
const extractYouTubeId = (url) => {
  if (!url) return '';
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : '';
};

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
    // Fetch posts from backend and sync liked posts
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
        
        // Sync liked posts from backend (check likedBy array for current user)
        if (user) {
          const userId = user.id || user.userId;
          const backendLikedPosts = new Set();
          (data || []).forEach(p => {
            if (Array.isArray(p.likedBy) && p.likedBy.includes(userId)) {
              backendLikedPosts.add(p.id);
            }
          });
          setLikedPosts(backendLikedPosts);
          localStorage.setItem('likedPosts', JSON.stringify([...backendLikedPosts]));
        }
        
        // Parse title and content - split by double newline
        const adapted = (data || []).map(p => {
          let title = '';
          let content = p.content || '';
          // Check if content has title format (title\n\ncontent)
          const parts = content.split('\n\n');
          if (parts.length >= 2 && parts[0].length < 100) {
            // First part is likely title if it's short
            title = parts[0].trim();
            content = parts.slice(1).join('\n\n').trim();
          }
          
          return {
            id: p.id,
            author: {
              name: (userMap[p.userId]?.name) || (userMap[p.userId]?.email?.split('@')[0]) || 'ユーザー',
              avatar: userMap[p.userId]?.avatarUrl || 'https://picsum.photos/seed/avatar123/36/48.jpg',
              location: locationMap[p.locationId]?.name || '—',
            },
            title: title,
            content: content,
            image: p.imageUrl ? { src: p.imageUrl, alt: 'post' } : null,
            videoUrl: p.videoUrl,
            timestamp: p.createdAt || new Date().toISOString(),
            likes: Array.isArray(p.likedBy) ? p.likedBy.length : 0,
          };
        });
        setPosts(adapted);
      } catch (e) {
        console.error('Failed to load posts:', e);
      }
    };
    fetchPosts();
  }, [user]);

  // Sync liked posts to localStorage when changed
  useEffect(() => {
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
              {post.title && (
                <h3 className="review-title" style={{ marginBottom: '10px', fontWeight: '600', fontSize: '18px' }}>{post.title}</h3>
              )}
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
                {post.videoUrl && (
                  <a 
                    href={post.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                    onClick={() => {
                      // Save to video history when clicking YouTube button
                      const currentHistory = JSON.parse(localStorage.getItem('videoHistory') || '[]');
                      const videoEntry = {
                        id: post.id || Date.now(),
                        title: post.title || post.content?.substring(0, 50) || '動画',
                        thumbnail: post.image?.src || `https://img.youtube.com/vi/${extractYouTubeId(post.videoUrl)}/hqdefault.jpg`,
                        youtubeUrl: post.videoUrl,
                        timestamp: Date.now()
                      };
                      // Check if already exists (by youtubeUrl)
                      const exists = currentHistory.some(v => v.youtubeUrl === post.videoUrl);
                      if (!exists) {
                        const updatedHistory = [videoEntry, ...currentHistory].slice(0, 20);
                        localStorage.setItem('videoHistory', JSON.stringify(updatedHistory));
                      }
                    }}
                  >
                    <button style={{ padding: '8px 16px', background: '#ff0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', marginLeft: '10px' }}>
                      <FaYoutube /> YouTube
                    </button>
                  </a>
                )}
              </div>
            </div>
            <div className="review-image-wrapper">
              {post.videoUrl ? (
                <a 
                  href={post.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ display: 'block', position: 'relative' }}
                >
                  <img
                    src={post.image?.src || `https://img.youtube.com/vi/${extractYouTubeId(post.videoUrl)}/maxresdefault.jpg`}
                    alt="YouTube thumbnail"
                    className="review-image"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = `https://img.youtube.com/vi/${extractYouTubeId(post.videoUrl)}/hqdefault.jpg`;
                    }}
                  />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.7)', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaYoutube style={{ color: 'white', fontSize: '30px' }} />
                  </div>
                </a>
              ) : post.image ? (
                <img
                  src={post.image.src}
                  alt={post.image.alt}
                  className="review-image"
                />
              ) : null}
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