import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Weather.css";

export default function Weather() {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const locations = [
    { 
      id: 1, 
      name: "トンニャット公園", 
      distance: "500m",
      address: "ハノイ市ドンダー区トンニャット通り",
      description: "美しい公園で、ジョギングや散歩に最適です。朝夕の時間帯は多くの地元住民で賑わっています。",
      facilities: ["ジョギングコース", "子供用遊具", "ベンチ", "トイレ"],
      openTime: "5:00 - 22:00",
      rating: 4.5
    },
    { 
      id: 2, 
      name: "ミンカイ通り368番地", 
      distance: "1.0km",
      address: "ハノイ市ホアンキエム区ミンカイ通り368",
      description: "市街地中心部に位置するスポーツ施設。最新の設備が整っており、様々なスポーツを楽しめます。",
      facilities: ["サッカー場", "バスケットボールコート", "シャワー", "駐車場"],
      openTime: "6:00 - 23:00",
      rating: 4.8
    },
    { 
      id: 3, 
      name: "ハノイ工科大学", 
      distance: "1.6km",
      address: "ハノイ市ロンビエン区ハノイ工科大学",
      description: "大学のキャンパス内にある広大なグラウンド。学生だけでなく、地域住民も利用できます。",
      facilities: ["サッカー場", "陸上トラック", "ウェイトルーム", "更衣室"],
      openTime: "平日 16:00 - 20:00, 土日 8:00 - 18:00",
      rating: 4.3
    },
    { 
      id: 4, 
      name: "タン・ニャ文化会館", 
      distance: "2.1km",
      address: "ハノイ市ドンバ区タン・ニャ通り",
      description: "多目的文化施設で、スポーツイベントや文化活動が開催されています。",
      facilities: ["多目的グラウンド", "屋内体育館", "会議室", "カフェテリア"],
      openTime: "8:00 - 22:00",
      rating: 4.6
    }
  ];

  useEffect(() => {
    // Get user's location and weather data
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchWeatherData(latitude, longitude);
        },
        (err) => {
          console.error("Error getting location:", err);
          // Fallback to Hanoi coordinates
          fetchWeatherData(21.0285, 105.8542);
        }
      );
    } else {
      // Fallback to Hanoi coordinates
      fetchWeatherData(21.0285, 105.8542);
    }
  }, []);

  const fetchWeatherData = async (lat, lon) => {
    try {
      // Using OpenWeatherMap API (you'll need to get a free API key)
      const API_KEY = 'YOUR_API_KEY'; // Replace with actual API key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ja`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      // Set mock data as fallback
      setWeatherData({
        name: 'ハノイ',
        main: {
          temp: 28,
          feels_like: 30,
          humidity: 65
        },
        weather: [{
          main: 'Clear',
          description: '晴れ',
          icon: '01d'
        }],
        wind: {
          speed: 3.5
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getAirQuality = (humidity) => {
    if (humidity < 40) return { text: '良好', color: '#16a34a' };
    if (humidity < 60) return { text: '普通', color: '#ca8a04' };
    return { text: 'やや悪い', color: '#dc2626' };
  };

  const getWeatherIcon = (iconCode) => {
    // Map weather icon codes to emoji or images
    const iconMap = {
      '01d': '☀️', // clear sky day
      '01n': '🌙', // clear sky night
      '02d': '⛅', // few clouds day
      '02n': '☁️', // few clouds night
      '03d': '☁️', // scattered clouds
      '04d': '☁️', // broken clouds
      '09d': '🌧️', // shower rain
      '10d': '🌧️', // rain day
      '11d': '⛈️', // thunderstorm
      '13d': '❄️', // snow
      '50d': '🌫️'  // mist
    };
    return iconMap[iconCode] || '☀️';
  };

  const handleBack = () => {
    navigate('/sports');
  };

  const handleLocationDetail = (location) => {
    setSelectedLocation(location);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLocation(null);
  };

  const handleMapNavigation = () => {
    if (selectedLocation) {
      navigate('/map', { state: { location: selectedLocation } });
      closeModal();
    }
  };

  return (
    <div className="w-container">
      <div className="weather-header">
        <button className="back-btn" onClick={handleBack}>← 戻る</button>
      </div>
      
      {/* Weather Section */}
      {loading ? (
        <div className="loading">天気データを読み込み中...</div>
      ) : (
        <>
          <div className="weather-box">
            <div className="weather-icon-large">
              {getWeatherIcon(weatherData?.weather?.[0]?.icon)}
            </div>

            <div>
              <h2 className="weather-title">
                {weatherData?.name || '現在地'}の天気：{weatherData?.weather?.[0]?.description || '晴れ'}
              </h2>
              <p className="temperature">
                {Math.round(weatherData?.main?.temp || 28)}°C 
                <span className="feels-like">（体感温度：{Math.round(weatherData?.main?.feels_like || 30)}°C）</span>
              </p>
              <p className="air-quality">
                湿度：{weatherData?.main?.humidity || 65}% | 
                風速：{(weatherData?.wind?.speed || 3.5).toFixed(1)}m/s | 
                空気の質：<span className="good-text" style={{ color: getAirQuality(weatherData?.main?.humidity || 65).color }}>
                  {getAirQuality(weatherData?.main?.humidity || 65).text}
                </span>
              </p>
            </div>

            <div className="status-box">
              <div className="status-emoji">
                {weatherData?.main?.temp > 30 ? '🥵' : weatherData?.main?.temp > 20 ? '😊' : '🥶'}
              </div>
              <p className="status-text">
                {weatherData?.main?.temp > 30 ? '暑い' : weatherData?.main?.temp > 20 ? 'Good' : '寒い'}
              </p>
            </div>
          </div>
        </>
      )}

      <h3 className="subtitle">最寄りのサッカー場の提案</h3>

      {/* List Suggestion */}
      <div className="list">
        {locations.map((loc) => (
          <div className="item" key={loc.id}>
            <div className="info">
              <span className="pin">📍</span>
              <span className="text">目的地：{loc.name}</span>
            </div>

            <div className="place">
              <span className="distance">距離: {loc.distance}</span>
              <button className="btn" onClick={() => handleLocationDetail(loc)}>場所の詳細を見る</button>
            </div>
          </div>
        ))}
      </div>

      <p className="footer">
        または、次のリンクを参照してください。 <a href="https://www.google.com">Link</a>
      </p>

      {/* Location Details Modal */}
      {showModal && selectedLocation && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedLocation.name}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="location-info-section">
                <div className="info-item">
                  <span className="info-label">📍 住所：</span>
                  <span className="info-value">{selectedLocation.address}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📏 距離：</span>
                  <span className="info-value">{selectedLocation.distance}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">⏰ 営業時間：</span>
                  <span className="info-value">{selectedLocation.openTime}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">⭐ 評価：</span>
                  <span className="info-value rating">
                    {selectedLocation.rating} ⭐
                  </span>
                </div>
              </div>

              <div className="description-section">
                <h3 className="section-title">施設概要</h3>
                <p className="description-text">{selectedLocation.description}</p>
              </div>

              <div className="facilities-section">
                <h3 className="section-title">設備</h3>
                <div className="facilities-list">
                  {selectedLocation.facilities.map((facility, index) => (
                    <span key={index} className="facility-tag">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={closeModal}>
                閉じる
              </button>
              <button className="modal-btn primary" onClick={handleMapNavigation}>
                地図で見る
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
