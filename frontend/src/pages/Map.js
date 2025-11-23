import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Weather.css";

export default function Map() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedLocation = location.state?.location;

  const handleBack = () => {
    navigate('/weather');
  };

  const handleNavigation = () => {
    // Open Google Maps with the selected location
    const query = encodeURIComponent(selectedLocation?.name || 'Hanoi, Vietnam');
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="map-fullscreen">
      {/* Full Screen Map */}
      <div className="map-background">
        {/* eslint-disable jsx-a11y/iframe-has-title */}
        <iframe
          title="OpenStreetMap interactive map displaying selected location"
          src="https://www.openstreetmap.org/export/embed.html?bbox=105.7442,20.9785,105.9642,21.0785&layer=mapnik&marker=21.0285,105.8542"
          className="map-full"
          style={{ width: '100%', height: '100vh', border: 'none' }}
          allowFullScreen
          loading="lazy"
        />
        {/* eslint-enable jsx-a11y/iframe-has-title */}
      </div>

      {/* Info Overlay - Top Left Corner */}
      <div className="info-overlay">
        <div className="location-info">
          <h2 className="location-title">{selectedLocation?.name || '場所'}</h2>
          <p className="distance-text">距離: {selectedLocation?.distance || '不明'}</p>
          <p className="description">
            ここに場所の詳細情報が表示されます。
          </p>
        </div>

        <div className="button-overlay">
          <button className="back-btn-overlay" onClick={handleBack}>戻る</button>
          <button className="nav-btn-overlay" onClick={handleNavigation}>ナビゲーション開始</button>
        </div>
      </div>
    </div>
  );
}
