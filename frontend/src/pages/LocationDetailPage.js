import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { locations } from '../lib/locationsData';
import { postsAPI } from '../api/posts';
import '../styles/LocationDetailPage.css';

export default function LocationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const locationState = useLocation();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let foundLocation = null;
    let locationId = null;
    
    if (locationState.state?.location) {
      foundLocation = locationState.state.location;
      locationId = foundLocation.id;
    } else if (id) {
      locationId = parseInt(id);
      foundLocation = locations.find(loc => loc.id === locationId);
    }
    
    setLocation(foundLocation);
    
    if (foundLocation) {
      // Fetch posts and filter by location match (content or `locationId` string match)
      postsAPI.getAll({ limit: 50, offset: 0 })
        .then(all => {
          const adapted = (all || []).map(p => ({
            id: p.id,
            author: {
              name: p.userId?.slice(0, 6) || 'ユーザー',
              avatar: 'https://picsum.photos/seed/avatar123/36/48.jpg',
              location: p.locationId || '—',
            },
            content: p.content,
            image: p.imageUrl ? { src: p.imageUrl, alt: 'post' } : null,
            timestamp: p.createdAt || new Date().toISOString(),
            likes: Array.isArray(p.likedBy) ? p.likedBy.length : 0,
          }));
          const locationPosts = adapted.filter(post => 
            (typeof post.author.location === 'string' && post.author.location.includes(foundLocation.name)) ||
            (typeof post.content === 'string' && post.content.includes(foundLocation.name))
          );
          setPosts(locationPosts);
        })
        .catch(err => console.error('Failed to load posts for location:', err));
    }
    
    setLoading(false);
  }, [id, locationState.state]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleReadPosts = () => {
    document.getElementById('posts-section').scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewOnGoogleMaps = () => {
    if (location) {
      navigate('/map', { state: { location } });
    } else {
      console.error('Location is not defined');
    }
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (!location) {
    return <div className="error">場所が見つかりません</div>;
  }

  return (
    <div className="location-detail">
      <div className="location-header">
        <button onClick={handleBack} className="back-button">
          &larr; 戻る
        </button>
        <h1>{location.name}</h1>
      </div>

      <div className="location-content">
        <div className="location-image">
          <img src={location.image} alt={location.name} />
        </div>
        
        <div className="location-info">
          <p className="location-description">{location.description}</p>
          
          <div className="location-meta">
            <div className="meta-item">
              <span className="meta-label">住所:</span>
              <span className="meta-value">{location.address}</span>
            </div>
            {/*<div className="meta-item">
              <span className="meta-label">営業時間:</span>
              <span className="meta-value">{location.hours || '情報なし'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">アクセス:</span>
              <span className="meta-value">{location.access || '情報なし'}</span>
            </div> */}
            <div className="meta-item">
              <span className="meta-label">距離:</span>
              <span className="meta-value">{location.distance}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn-review" onClick={handleReadPosts}>
            この場所の投稿を見る
          </button> 
          <button className="btn-maps" onClick={handleViewOnGoogleMaps}>
           マップで見る
          </button>
        </div>
      </div>

      {/* Posts Section */}
      <div id="posts-section" className="posts-section">
        <h2 className="posts-title">この場所の投稿</h2>
        
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
                <div className="post-footer">
                  <span className="post-likes">❤️ {post.likes} いいね</span>
                  <span className="post-time">
                    {new Date(post.timestamp).toLocaleString('ja-JP')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-posts">この場所に関する投稿はまだありません</p>
        )}
      </div>
    </div>
  );
}