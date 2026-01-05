import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { postsAPI } from '../api/posts';
import { usersAPI } from '../api/users';
import '../styles/VideoDetailPage.css';

// Extract YouTube video ID from URL
const extractYouTubeId = (url) => {
  if (!url) return '';
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : '';
};

export default function VideoDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { video, sportId, sportName } = location.state || {};
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!video) {
      setLoading(false);
      return;
    }

    // Load posts from backend
    const loadPosts = async () => {
      try {
        const videoUrl = video.youtubeUrl || video.url || video.videoUrl;
        const allPosts = await postsAPI.getAll({ limit: 50, offset: 0 });
        
        // Filter posts by videoUrl or video title in content
        const videoPosts = (allPosts || []).filter(p => 
          p.postType === 'video' && (
            (videoUrl && p.videoUrl === videoUrl) ||
            (video.title && p.content && p.content.includes(video.title))
          )
        );
        
        // Get user info for posts
        const uniqueUserIds = Array.from(new Set(videoPosts.map(p => p.userId).filter(Boolean)));
        const userMap = {};
        await Promise.all(uniqueUserIds.map(async (uid) => {
          try {
            const u = await usersAPI.getById(uid);
            userMap[uid] = u;
          } catch { /* ignore */ }
        }));
        
        // Adapt posts - parse title and content
        const adaptedPosts = videoPosts.map(post => {
          let title = '';
          let content = post.content || '';
          const parts = content.split('\n\n');
          if (parts.length >= 2 && parts[0].length < 100) {
            title = parts[0].trim();
            content = parts.slice(1).join('\n\n').trim();
          }
          
          return {
            id: post.id,
            author: {
              name: (userMap[post.userId]?.name) || (userMap[post.userId]?.email?.split('@')[0]) || 'ユーザー',
              avatar: userMap[post.userId]?.avatarUrl || 'https://picsum.photos/seed/avatar' + post.id + '/36/48.jpg',
              location: '—',
            },
            title: title,
            content: content,
            image: post.imageUrl ? { src: post.imageUrl, alt: 'post' } : null,
            videoUrl: post.videoUrl,
            timestamp: post.createdAt || new Date().toISOString(),
            likes: Array.isArray(post.likedBy) ? post.likedBy.length : 0,
          };
        });
        
        // Sort by timestamp (newest first)
        adaptedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setPosts(adaptedPosts);
      } catch (e) {
        console.error('Failed to load video posts:', e);
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
  }, [video]);

  const handleBack = () => {
    if (sportId && sportName) {
      navigate('/video-page', { state: { sportId, sportName } });
    } else {
      navigate('/video-page', { state: { sportId: 5, sportName: "ヨガ" } });
    }
  };

  const handleLike = (postId) => {
    // Update posts state
    const updatedPosts = posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updatedPosts);
    
    // Update localStorage
    const stored = JSON.parse(localStorage.getItem("videoPosts") || "[]");
    const updated = stored.map(post => 
      post.id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
    );
    localStorage.setItem("videoPosts", JSON.stringify(updated));
  };

  const formatDate = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString('ja-JP');
    } catch {
      return "";
    }
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (!video) {
    return <div className="error">動画が見つかりません</div>;
  }

  return (
    <div className="video-detail">
      <div className="video-header">
        <button onClick={handleBack} className="back-button">
          &larr; 戻る
        </button>
        <h1>{video.title}</h1>
      </div>

      <div className="video-content">
        <div className="video-image">
          {video.thumbnail ? (
            <img src={video.thumbnail} alt={video.title} />
          ) : (
            <div className="placeholder-thumbnail">
              <div className="video-icon">📹</div>
            </div>
          )}
        </div>
        
        <div className="video-info">
          <p className="video-description">{video.description || 'この動画についての説明はありません'}</p>
          
          <div className="video-meta">
            <div className="meta-item">
              <span className="meta-label">カテゴリ:</span>
              <span className="meta-value">{video.category || 'ヨガ'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">投稿日:</span>
              <span className="meta-value">{video.uploadDate ? formatDate(video.uploadDate) : '情報なし'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div id="posts-section" className="posts-section">
        <h2 className="posts-title">この動画のレビュー</h2>
        
        {posts.length > 0 ? (
          <div className="posts-list">
            {posts.map(post => (
              <div key={post.id} className="post-item">
                <div className="post-header">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name} 
                    className="post-avatar"
                  />
                  <div className="post-author">
                    <span className="author-name">{post.author.name}</span>
                    <span className="post-location">{post.author.location}</span>
                  </div>
                </div>
                {post.title && (
                  <h4 style={{ marginBottom: '8px', fontWeight: '600', fontSize: '16px' }}>{post.title}</h4>
                )}
                <p className="post-content">{post.content}</p>
                {post.image && (
                  <img 
                    src={post.image.src} 
                    alt={post.image.alt} 
                    className="post-image"
                  />
                )}
                {post.videoUrl && (
                  <div style={{ marginTop: '10px' }}>
                    <a 
                      href={post.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ display: 'inline-block' }}
                      onClick={() => {
                        // Save to video history
                        const currentHistory = JSON.parse(localStorage.getItem('videoHistory') || '[]');
                        const videoEntry = {
                          id: post.id || Date.now(),
                          title: post.title || post.content?.substring(0, 50) || '動画',
                          thumbnail: post.image?.src || `https://img.youtube.com/vi/${extractYouTubeId(post.videoUrl)}/hqdefault.jpg`,
                          youtubeUrl: post.videoUrl,
                          timestamp: Date.now()
                        };
                        const exists = currentHistory.some(v => v.youtubeUrl === post.videoUrl);
                        if (!exists) {
                          const updatedHistory = [videoEntry, ...currentHistory].slice(0, 20);
                          localStorage.setItem('videoHistory', JSON.stringify(updatedHistory));
                        }
                      }}
                    >
                      <button style={{ padding: '8px 16px', background: '#ff0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        📺 YouTube で見る
                      </button>
                    </a>
                  </div>
                )}
                
                {/* Comments Section */}
                {post.comments && post.comments.length > 0 && (
                  <div className="comments-section">
                    <h4 className="comments-title">コメント</h4>
                    {post.comments.map(comment => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-header">
                          <span className="comment-author">{comment.author}</span>
                          <span className="comment-time">{formatDate(comment.timestamp)}</span>
                        </div>
                        <p className="comment-content">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="post-footer">
                  <button 
                    className="post-likes-btn"
                    onClick={() => handleLike(post.id)}
                  >
                    ❤️ {post.likes} いいね
                  </button>
                  <span className="post-time">
                    {formatDate(post.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-posts">この動画に関するレビューはまだありません</p>
        )}
      </div>
    </div>
  );
}
