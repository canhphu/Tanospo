import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { locations } from "../lib/locationsData";
import "../styles/Weather.css";

export default function Weather() {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const location = useLocation();
  const sportId = location.state?.sportId;
  
  // Filter locations based on selected sport
  useEffect(() => {
    if (sportId) {
      const filtered = locations.filter(loc => loc.sportIds.includes(sportId));
      setFilteredLocations(filtered);
      
      // Set the sport name for display
      const sports = [
        { id: 1, name: "ウォーキング" },
        { id: 2, name: "フットボール" },
        { id: 3, name: "バドミントン" },
        { id: 4, name: "サイクリング" },
        { id: 5, name: "ヨガ" },
        { id: 6, name: "筋トレ" }
      ];
      const sport = sports.find(s => s.id === sportId);
      setSelectedSport(sport ? sport.name : '');
    } else {
      setFilteredLocations(locations); // Show all locations if no sport is selected
    }
  }, [sportId]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(coords);
          fetchWeatherData(coords.lat, coords.lng);
        },
        () => {
          const fallbackCoords = { lat: 21.0285, lng: 105.8542 };
          setUserLocation(fallbackCoords);
          fetchWeatherData(fallbackCoords.lat, fallbackCoords.lng);
        }
      );
    } else {
      const fallbackCoords = { lat: 21.0285, lng: 105.8542 };
      setUserLocation(fallbackCoords);
      fetchWeatherData(fallbackCoords.lat, fallbackCoords.lng);
    }
  }, []);

  const fetchWeatherData = async (lat, lon) => {
    try {
      const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

      if (!API_KEY) {
        throw new Error("Missing API key");
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ja`
      );

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      setWeatherData(data);

    } catch (err) {
      console.error("Weather error:", err.message);

      // fallback mock data
      setWeatherData({
        name: "ハノイ",
        main: { temp: 28, feels_like: 30, humidity: 65 },
        weather: [{ main: "Clear", description: "晴れ", icon: "01d" }],
        wind: { speed: 3.5 }
      });
    } finally {
      setLoading(false);
    }
  };

  const getAirQuality = (h) => {
    if (h < 40) return { text: "良好", color: "#16a34a" };
    if (h < 60) return { text: "普通", color: "#ca8a04" };
    return { text: "やや悪い", color: "#dc2626" };
  };

  const getWeatherIcon = (code) => {
    const map = {
      "01d": "☀️", "01n": "🌙",
      "02d": "⛅", "02n": "☁️",
      "03d": "☁️", "04d": "☁️",
      "09d": "🌧️", "10d": "🌧️",
      "11d": "⛈️", "13d": "❄️",
      "50d": "🌫️"
    };
    return map[code] || "☀️";
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const handleLocationDetail = (loc) => {
    navigate(`/location/${loc.id}`);
  };

  return (
    <div className="w-container">
      <div className="weather-header">
        <button className="back-btn" onClick={() => navigate("/sports")}>← 戻る</button>
      </div>

      {loading ? (
        <div className="loading">天気データを読み込み中...</div>
      ) : (
        <div className="weather-box">
          <div className="weather-icon-large">
            {getWeatherIcon(weatherData.weather[0].icon)}
          </div>

          <div>
            <h2 className="weather-title">
              {weatherData.name}の天気：{weatherData.weather[0].description}
            </h2>

            <p className="temperature">
              {Math.round(weatherData.main.temp)}°C
              <span className="feels-like">
                （体感温度：{Math.round(weatherData.main.feels_like)}°C）
              </span>
            </p>

            <p className="air-quality">
              湿度：{weatherData.main.humidity}% |
              風速：{weatherData.wind.speed.toFixed(1)}m/s |
              空気の質：
              <span style={{ color: getAirQuality(weatherData.main.humidity).color }}>
                {getAirQuality(weatherData.main.humidity).text}
              </span>
            </p>
          </div>

          <div className="status-box">
            <div className="status-emoji">
              {weatherData.main.temp > 30 ? "🥵" : weatherData.main.temp > 20 ? "😊" : "🥶"}
            </div>
            <p className="status-text">
              {weatherData.main.temp > 30 ? "暑い" : weatherData.main.temp > 20 ? "Good" : "寒い"}
            </p>
          </div>
        </div>
      )}

      <h3 className="subtitle">
        {selectedSport ? `${selectedSport}ができる場所` : '最寄りのスポーツ施設'}
      </h3>

      {/* List */}
      <div className="list">
        {filteredLocations.length > 0 ? (
          filteredLocations.map((loc) => {
          const calculatedDistance = userLocation 
            ? calculateDistance(userLocation.lat, userLocation.lng, loc.lat, loc.lng)
            : null;
          const distanceText = calculatedDistance 
            ? (calculatedDistance < 1 
                ? `${Math.round(calculatedDistance * 1000)}m`
                : `${calculatedDistance.toFixed(1)}km`)
            : loc.distance;
          
          return (
            <div key={loc.id} className="item">
              <div className="info">
                <span className="pin">📍</span>
                <span className="text">目的地：{loc.name}</span>
              </div>

              <div className="place">
                <span className="distance">距離: {distanceText}</span>
                <button className="btn" onClick={() => handleLocationDetail(loc)}>
                  場所の詳細を見る
              </button>
            </div>
          </div>
          );
          })
        ) : (
          <div className="no-locations">
            <p>該当する施設が見つかりませんでした。</p>
            <button onClick={() => navigate('/sports')} className="back-to-sports">
              別のスポーツを選ぶ
            </button>
          </div>
        )}
      </div>

      <p className="footer">
        または、次のリンクを参照してください。 <a href="https://www.google.com">Link</a>
      </p>

      {/* Modal */}
      {showModal && selectedLocation && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedLocation.name}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="info-item">
                <strong>📍 住所：</strong> {selectedLocation.address}
              </div>
              <div className="info-item">
                <strong>距離：</strong> {
                  userLocation && selectedLocation.lat && selectedLocation.lng
                    ? (() => {
                        const distance = calculateDistance(userLocation.lat, userLocation.lng, selectedLocation.lat, selectedLocation.lng);
                        return distance < 1 
                          ? `${Math.round(distance * 1000)}m`
                          : `${distance.toFixed(1)}km`;
                      })()
                    : selectedLocation.distance
                }
              </div>
              <div className="info-item">
                <strong>⏰ 営業時間：</strong> {selectedLocation.openTime}
              </div>
              <div className="info-item">
                <strong>⭐ 評価：</strong> {selectedLocation.rating} ⭐
              </div>

              <h3>施設概要</h3>
              <p>{selectedLocation.description}</p>

              <h3>設備</h3>
              <div className="facilities-list">
                {selectedLocation.facilities.map((f, i) => (
                  <span key={i} className="facility-tag">{f}</span>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowModal(false)}>閉じる</button>
              <button className="modal-btn primary" onClick={() => navigate("/map", { state: { location: selectedLocation } })}>
                地図で見る
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
