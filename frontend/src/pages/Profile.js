import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api/auth";
import "../styles/ProfilePage.css";

function fixUnicode(str) {
  try {
    return decodeURIComponent(escape(str));
  } catch {
    return str;
  }
}

export default function ProfilePage() {
  const { user, logout, authenticate } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [postDescription, setPostDescription] = useState("まだ投稿はありません。");
  const [profile, setProfile] = useState(null);

  const handleLogout = () => {
    logout();
  };
  const handleVideoHistory = () => {
    navigate('/video-history');
  }
  const handleFavorites = () => {
    navigate('/favorites');
  };

  const handleMyPosts = () => {
    navigate('/my-posts');
  };
  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleEditDescription = () => {
    setIsEditing(true);
  };

  const handleSaveDescription = () => {
    setIsEditing(false);
    // Here you could save to backend or localStorage
    localStorage.setItem('postDescription', postDescription);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset to saved description
    const savedDescription = localStorage.getItem('postDescription');
    if (savedDescription) {
      setPostDescription(savedDescription);
    } else {
      setPostDescription("まだ投稿はありません。");
    }
  };

  useEffect(() => {
    // Load saved description from localStorage
    const savedDescription = localStorage.getItem('postDescription');
    if (savedDescription) {
      setPostDescription(savedDescription);
    }
  }, []);

  // Prevent multiple requests (React 18 StrictMode runs effects twice in dev)
  const fetchedRef = useRef(false);
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    const loadProfile = async () => {
      try {
        const p = await authAPI.getProfile();
        setProfile(p);
        // keep existing token and update local user for consistency
        if (user?.token) {
          authenticate({ ...p, token: user.token });
        }
      } catch (e) {
        // ignore if unauthorized (no token)
        console.debug('Profile fetch failed or unauthorized:', e.message);
      }
    };
    loadProfile();
  }, []);

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      {/* TOP BAR */}
      <div className="top-bar">
        <button className="back-btn" onClick={handleBack}>←</button>
        <button className="logout-btn" onClick={handleLogout}>ログアウト</button>
      </div>

      {/* USER INFO */}
      <div className="user-info">
        <img
          src={(profile?.avatarUrl) || user.picture || "https://picsum.photos/seed/avatar123/48/48.jpg"}
          alt="avatar"
          className="user-avatar"
        />

        <div className="user-text">
          <h2 className="user-name">
            {fixUnicode((profile?.name) || user.name || user.email?.split("@")[0] || "User")}
          </h2>
          <p className="user-email">{(profile?.email) || user.email}</p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="menu-buttons">
        <button className="btn btn-blue" onClick={handleMyPosts}>投稿</button>
        <button className="btn btn-yellow" onClick={handleVideoHistory}>動画レビュー</button>
        <button className="btn btn-red" onClick={handleFavorites}>お気に入り</button>
      </div>

      {/* POST LIST */}
      <div className="post-box">
        {isEditing ? (
          <div className="edit-description">
            <textarea
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
              className="description-textarea"
              placeholder="投稿の説明を入力..."
              rows={3}
            />
            <div className="edit-buttons">
              <button className="save-btn" onClick={handleSaveDescription}>保存</button>
              <button className="cancel-btn" onClick={handleCancelEdit}>キャンセル</button>
            </div>
          </div>
        ) : (
          <div className="description-content">
            <p>{postDescription}</p>
            <button className="edit-btn" onClick={handleEditDescription}>編集</button>
          </div>
        )}
      </div>
    </div>
  );
}
