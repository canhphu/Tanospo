import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { locations } from '../lib/locationsData';
import { postsAPI } from '../api/posts';
import { usersAPI } from '../api/users';
import '../styles/LocationDetailPage.css';

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export default function LocationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const locationState = useLocation();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [showPosts, setShowPosts] = useState(false);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          setUserLocation({ lat: 21.0285, lng: 105.8542 }); // Fallback to Hanoi
        }
      );
    } else {
      setUserLocation({ lat: 21.0285, lng: 105.8542 });
    }
  }, []);

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
    
    if (foundLocation && locationId) {
      // Use the new getByLocation API method
      postsAPI.getByLocation(locationId)
        .then(async (locationPosts) => {
          // Get unique user IDs from posts
          const uniqueUserIds = Array.from(new Set((locationPosts || []).map(p => p.userId).filter(Boolean)));
          const userMap = {};
          
          // Fetch user data for all authors
          await Promise.all(uniqueUserIds.map(async (uid) => {
            try {
              const u = await usersAPI.getById(uid);
              userMap[uid] = u;
            } catch { /* ignore missing users */ }
          }));
          
          // Adapt posts for display
          const adapted = (locationPosts || []).map(p => ({
            id: p.id,
            author: {
              name: (userMap[p.userId]?.name) || (userMap[p.userId]?.email?.split('@')[0]) || 'ユーザー',
              avatar: userMap[p.userId]?.avatarUrl || 'https://picsum.photos/seed/avatar123/36/48.jpg',
              location: foundLocation.name,
            },
            content: p.content,
            image: p.imageUrl ? { src: p.imageUrl, alt: 'post' } : null,
            timestamp: p.createdAt || new Date().toISOString(),
            likes: Array.isArray(p.likedBy) ? p.likedBy.length : 0,
          }));
          
          setPosts(adapted);
        })
        .catch(err => {
          console.error('Failed to load posts for location:', err);
          // Fallback to filtering all posts if the specific endpoint fails
          postsAPI.getAll({ limit: 50, offset: 0 })
            .then(async (all) => {
              const filtered = (all || []).filter(p => p.locationId === locationId);
              
              const uniqueUserIds = Array.from(new Set(filtered.map(p => p.userId).filter(Boolean)));
              const userMap = {};
              
              await Promise.all(uniqueUserIds.map(async (uid) => {
                try {
                  const u = await usersAPI.getById(uid);
                  userMap[uid] = u;
                } catch { /* ignore */ }
              }));
              
              const adapted = filtered.map(p => ({
                id: p.id,
                author: {
                  name: (userMap[p.userId]?.name) || (userMap[p.userId]?.email?.split('@')[0]) || 'ユーザー',
                  avatar: userMap[p.userId]?.avatarUrl || 'https://picsum.photos/seed/avatar123/36/48.jpg',
                  location: foundLocation.name,
                },
                content: p.content,
                image: p.imageUrl ? { src: p.imageUrl, alt: 'post' } : null,
                timestamp: p.createdAt || new Date().toISOString(),
                likes: Array.isArray(p.likedBy) ? p.likedBy.length : 0,
              }));
              
              setPosts(adapted);
            })
            .catch(fallbackErr => console.error('Fallback also failed:', fallbackErr));
        });
    }
    
    setLoading(false);
  }, [id, locationState.state]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleTogglePosts = () => {
    setShowPosts(!showPosts);
  };

  const getDistance = () => {
    if (!userLocation || !location || !location.lat || !location.lng) {
      return location?.distance || '不明';
    }
    const distance = calculateDistance(userLocation.lat, userLocation.lng, location.lat, location.lng);
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
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
            <div className="meta-item">
              <span className="meta-label">距離:</span>
              <span className="meta-value">{getDistance()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn-review" onClick={handleTogglePosts}>
            {showPosts ? '投稿を隠す' : 'この場所の投稿を見る'}
          </button> 
          <button className="btn-maps" onClick={handleViewOnGoogleMaps}>
            マップで見る
          </button>
        </div>
      </div>

      {/* Posts Section */}
      {showPosts && (
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
      )}
    </div>
  );
}