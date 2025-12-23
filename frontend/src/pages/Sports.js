import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sports.css";

export default function Sports() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const sports = [
    { id: 1, name: "ウォーキング", icon: "👟" },
    { id: 2, name: "フットボール", icon: "⚽" },
    { id: 3, name: "バドミントン", icon: "🏸" },
    { id: 4, name: "サイクリング", icon: "🚴" },
    { id: 5, name: "ヨガ", icon: "🧘" },
    { id: 6, name: "筋トレ", icon: "💪" }
  ];

  const handleNext = () => {
    if (selected) {
      // For Yoga (ID: 5) and Gym (ID: 6), navigate to video page
      if (selected === 5 || selected === 6) {
        navigate('/video-page', { 
          state: { 
            sportId: selected,
            sportName: sports.find(sport => sport.id === selected).name
          } 
        });
      } else {
        // For other sports, go to weather page as before
        navigate('/weather', { state: { sportId: selected } });
      }
    } else {
      alert('スポーツを選択してください');
    }
  };

  return (
    <div className="container">
      <h2 className="title">今プレイしたいスポーツを選択してください</h2>

      <div className="grid">
        {sports.map((sport) => (
          <div
            key={sport.id}
            className={`card ${selected === sport.id ? "active" : ""}`}
            onClick={() => setSelected(sport.id)}
          >
            <div className="icon">{sport.icon}</div>
            <p>{sport.name}</p>
          </div>
        ))}
      </div>

      <div className="button-group">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>戻る</button>
        <button className="next-btn" onClick={handleNext}>次へ</button>
      </div>
    </div>
  );
}
