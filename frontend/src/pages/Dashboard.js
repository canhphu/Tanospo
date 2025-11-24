import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";
const UserDropdown = ({ onLogout, onGoToProfile }) => {
  return (
    <div className="user-dropdown">
      <button className="dropdown-item" onClick={onGoToProfile}>
        👤 Profile
      </button>
      <button className="dropdown-item logout-item" onClick={onLogout}>
        ➡️ Logout
      </button>
    </div>
  );
};
export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        <button className="write-btn">レビューを書く</button>

        <div className="review-card">
          <div className="review-content">
            <div className="review-header">
              <img
                src="https://picsum.photos/seed/avatar123/36/48.jpg"
                alt="user1"
                className="review-avatar"
              />
              <span className="review-name">Dung - トンニャット公園にて</span>
            </div>
            <p className="review-text">
              ここでジョギングするのは最高です。みんなジョギングに来ます！
            </p>
            <div className="review-actions">
              <span className="heart">❤️</span>
               <button className="comment-btn">Comment</button>
            </div>
          </div>
          <div className="review-image-wrapper">
            <img
              src="https://picsum.photos/seed/park123/400/300.jpg"
              alt="park"
              className="review-image"
            />
          </div>
        </div>


        <div className="review-card">
          <div className="review-content">
            <div className="review-header">
              <img src="https://picsum.photos/seed/avatar123/36/48.jpg" alt="user2" className="review-avatar" />
              <span className="review-name">Bao - 自宅で</span>
            </div>
            <p className="review-text">こんな雨の日に最適いて運動するの一番です。</p>
            <div className="review-actions">
              <span className="heart">❤️</span>
              <button className="comment-btn">Comment</button>
            </div>
          </div>
          <div className="review-image-wrapper">
            <img
              src="https://picsum.photos/seed/workout123/400/300.jpg"
              alt="workout"
              className="review-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
