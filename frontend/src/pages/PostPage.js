import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PostPage.css";

export default function PostPage() {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
   const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="post-container">
      <h1 className="post-title">投稿</h1>
      <div className="back-button">
        <button onClick={handleBack}>← 戻る</button>
      </div>
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
        <input type="text" className="input-box" />

        <label>コンテンツ</label>
        <textarea className="text-area" />

        <button className="submit-button">投稿</button>
      </div>
    </div>
  );
}
