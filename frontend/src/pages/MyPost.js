import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaRegHeart, FaYoutube } from "react-icons/fa";
import { postsAPI } from "../api/posts";
import { locationsAPI } from "../api/locations";
import "../styles/Dashboard.css";

// Extract YouTube video ID from URL
const extractYouTubeId = (url) => {
  if (!url) return '';
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : '';
};

export default function MyPost() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [showCommentModal, setShowCommentModal] = useState(null);
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    // Load my posts from backend and liked posts from localStorage
    const savedLikedPosts = localStorage.getItem('likedPosts');
    if (savedLikedPosts) {
      setLikedPosts(new Set(JSON.parse(savedLikedPosts)));
    }
    const load = async () => {
      try {
        if (!user) return;
        const list = await postsAPI.getByUser(user.id || user.userId || '');
        const uniqueLocationIds = Array.from(new Set((list || []).map(p => p.locationId).filter(id => !!id)));
        const locationMap = {};
        await Promise.all(uniqueLocationIds.map(async (lid) => {
          try {
            const l = await locationsAPI.getById(lid);
            locationMap[lid] = l;
          } catch { /* ignore missing locations */ }
        }));
        // Parse title and content
        const adapted = (list || []).map(p => {
          let title = '';
          let content = p.content || '';
          const parts = content.split('\n\n');
          if (parts.length >= 2 && parts[0].length < 100) {
            title = parts[0].trim();
            content = parts.slice(1).join('\n\n').trim();
          }
          
          return {
            id: p.id,
            author: {
              name: user.name || user.email?.split('@')[0] || 'ユーザー',
              avatar: 'https://picsum.photos/seed/avatar123/36/48.jpg',
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
        setMyPosts(adapted);
      } catch (e) {
        console.error('Failed to load my posts:', e);
      }
    };
    load();
  }, [user]);

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
      localStorage.setItem('likedPosts', JSON.stringify([...newLikedPosts]));
      setMyPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + (newLikedPosts.has(postId) ? 1 : -1) } : p));
    } catch (e) {
      console.error('Failed to toggle like:', e);
    }
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

  const handleCreatePost = () => {
    navigate('/post');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="myPost-header">
          <button 
            className="back-btn" 
            onClick={() => navigate('/profile')}
          >
            ← マイ投稿
          </button>
        </div>
        
        <button className="start-btn" onClick={() => navigate('/dashboard')}>ダッシュボード</button>
      </header>

      <div className="review-section">

        {myPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
            <h3>まだ投稿がありません</h3>
            <p>新しい投稿を作成して、あなたの活動をシェアしましょう！</p>
            <button 
              className="write-btn" 
              onClick={handleCreatePost}
              style={{ marginTop: '20px' }}
            >
              新しい投稿を作成
            </button>
          </div>
        ) : (
          myPosts.map(post => (
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
                        // Check if already exists (by youtubeUrl) - only save once
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
          ))
        )}
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