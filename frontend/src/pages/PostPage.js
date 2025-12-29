import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PostPage.css";
import { locations } from "../lib/locationsData";
import { postAPI } from "../lib/api";

// Format location for display
const formatLocation = (location) => {
  return `${location.name}, ${location.address}`;
};

export default function PostPage() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
   const handleBack = () => {
    navigate(-1);
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    
    if (value.length > 0) {
      const filtered = locations.filter(loc => 
        loc.name.toLowerCase().includes(value.toLowerCase()) ||
        loc.address.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (location) => {
    setLocation(formatLocation(location));
    setShowSuggestions(false);
  };

  return (
    <div className="post-container">
      <div className="back-button">
        <button onClick={handleBack}>戻る</button>
      </div>
      <h1 className="post-title">投稿</h1>
      <div className="image-upload-wrapper">
        <label htmlFor="imageUpload">
          <img
            src={image || "/placeholder.png"}
            alt="upload preview"
            className="preview-image"
          />
          <p className="upload-text">クリックして写真をアップロード</p>
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
      </div>

      <div className="form-wrapper">
        <label>タイトル</label>
        <input type="text" className="input-box" value={title} onChange={(e) => setTitle(e.target.value)} />

       

        <div className="location-input-wrapper" ref={suggestionsRef}>
          <label>場所</label>
          <input 
            type="text" 
            className="input-box" 
            value={location}
            onChange={handleLocationChange}
            placeholder="場所を入力..."
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((location) => (
                <li 
                  key={location.id}
                  onClick={() => handleSuggestionClick(location)}
                  className="suggestion-item"
                >
                  <div className="suggestion-name">{location.name}</div>
                  <div className="suggestion-address">{location.address}</div>
                  {location.distance && (
                    <div className="suggestion-distance">{location.distance} 近く</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
           <label>コンテンツ</label>
        <textarea 
          className="text-area" 
          placeholder="投稿内容を入力してください..." 
          rows="4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="submit-button">投稿</button>
      </div>
    </div>
  );
}
