import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postsAPI } from "../api/posts";
import "../styles/PostPage.css";

export default function PostPage() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
    const handleSubmit = async () => {
      setError("");
      setSubmitting(true);
      try {
        // Minimal create using postType 'status'. Image upload not implemented, so send preview URL if present.
        await postsAPI.create({ postType: 'status', content: content || title || ' ', imageUrl: image || undefined });
        navigate('/dashboard');
      } catch (e) {
        console.error('Failed to create post:', e);
        setError('投稿に失敗しました');
      } finally {
        setSubmitting(false);
      }
    };
   const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="post-container">
      <div className="back-button">
        <button onClick={handleBack}> 戻る</button>
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

        <label>コンテンツ</label>
        <textarea className="text-area" value={content} onChange={(e) => setContent(e.target.value)} />
        {error && <div className="error-text">{error}</div>}
        <button className="submit-button" onClick={handleSubmit} disabled={submitting}>{submitting ? '送信中...' : '投稿'}</button>
      </div>
    </div>
  );
}
