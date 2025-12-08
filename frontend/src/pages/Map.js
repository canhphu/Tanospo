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
    window.open(`https://www.google.co.jp/maps/search/?api=1&query=${query}`, '_blank');
  };

  // Generate map URL with selected location coordinates
  const getMapUrl = () => {
    const lat = selectedLocation?.lat || 21.0285;
    const lng = selectedLocation?.lng || 105.8542;
    
    // Create a small bounding box around the location for better zoom
    const bbox = `${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}`;
    
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  };

  return (
    <div className="map-fullscreen">
      {/* Full Screen Map */}
      <div className="map-background">
        {/* eslint-disable jsx-a11y/iframe-has-title */}
        <iframe
          title="OpenStreetMap interactive map displaying selected location"
          src={getMapUrl()}
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
