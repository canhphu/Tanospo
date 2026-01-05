import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { postsAPI } from "../api/posts";
import { locationsAPI } from "../api/locations";
import "../styles/PostPage.css";
import { locations } from "../lib/locationsData";

// Format location for display
const formatLocation = (location) => {
  return `${location.name}, ${location.address}`;
};

// Convert file to base64 data URL
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function PostPage() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationText, setLocationText] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async () => {
    if (!user) {
      alert("投稿するにはログインが必要です。");
      navigate("/login");
      return;
    }

    if (!content.trim() && !title.trim()) {
      alert("コンテンツを入力してください。");
      return;
    }

    try {
      setIsSubmitting(true);

      // Convert image file to base64 data URL if exists
      let imageUrl = undefined;
      if (imageFile) {
        imageUrl = await fileToBase64(imageFile);
      }

      // Handle location: create or find location in backend
      let locationId = undefined;
      if (selectedLocation) {
        try {
          // Try to create location in backend (will upsert if exists)
          const locationData = {
            name: selectedLocation.name,
            address: selectedLocation.address,
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
            type: 'other', // Default type, can be improved later
            description: selectedLocation.description,
            amenities: selectedLocation.facilities || [],
            imageUrl: selectedLocation.image,
          };
          const createdLocation = await locationsAPI.create(locationData);
          locationId = createdLocation.id;
        } catch (error) {
          console.error("Error creating/finding location:", error);
          // Continue without locationId if location creation fails
        }
      }

      // Backend requires: postType, content (required), optional imageUrl & locationId.
      // Backend doesn't have title field, so include it in content if provided.
      const payloadContent = title
        ? `${title}\n\n${content}`.trim()
        : content.trim();

      await postsAPI.create({
        postType: "status",
        content: payloadContent,
        imageUrl: imageUrl,
        locationId: locationId,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("投稿に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationText(value);
    setSelectedLocation(null); // Clear selected location when user types
    
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
    setSelectedLocation(location);
    setLocationText(formatLocation(location));
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
            src={imagePreview || "/placeholder.png"}
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
            value={locationText}
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
        <button 
          className="submit-button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "投稿中..." : "投稿"}
        </button>
      </div>
    </div>
  );
}
