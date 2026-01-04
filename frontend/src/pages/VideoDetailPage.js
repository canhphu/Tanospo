import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/VideoDetailPage.css';

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

    // Get video posts from localStorage
    const stored = JSON.parse(localStorage.getItem("videoPosts") || "[]");
    const videoPosts = stored.filter((p) => p.videoId === video.id);
    
    // Sort by timestamp (newest first)
    videoPosts.sort((a, b) => b.timestamp - a.timestamp);
    
    // Adapt posts to match the format expected by the UI
    const adaptedPosts = videoPosts.map(post => ({
      id: post.id,
      author: {
        name: post.author || 'ユーザー',
        avatar: 'https://picsum.photos/seed/avatar' + post.id + '/36/48.jpg',
        location: '—',
      },
      content: post.content,
      image: null, // Video posts don't have images
      timestamp: post.timestamp,
      likes: post.likes || 0,
      comments: post.comments || []
    }));
    
    setPosts(adaptedPosts);
    setLoading(false);
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
              <span className="meta-label">動画ID:</span>
              <span className="meta-value">{video.id}</span>
            </div>
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
                <p className="post-content">{post.content}</p>
                {post.image && (
                  <img 
                    src={post.image.src} 
                    alt={post.image.alt} 
                    className="post-image"
                  />
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
