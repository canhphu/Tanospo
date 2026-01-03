import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaYoutube, FaArrowLeft } from "react-icons/fa";
import "../styles/VideoReview.css";

export default function VideoReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { video } = location.state || {};

  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!video) return;
    const stored = JSON.parse(localStorage.getItem("videoPosts") || "[]");
    const videoPosts = stored.filter((p) => p.videoId === video.id);
    videoPosts.sort((a, b) => b.timestamp - a.timestamp);
    setPosts(videoPosts);
  }, [video]);

  const formatDate = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString("ja-JP");
    } catch {
      return "";
    }
  };

  const handleSubmitPost = () => {
    if (!post.trim()) return;
    
    const posts = JSON.parse(localStorage.getItem("videoPosts") || "[]");
    const newPost = {
      id: Date.now(),
      videoId: video.id,
      videoTitle: video.title,
      content: post,
      author: "ユーザー",
      likes: 0,
      comments: [],
      timestamp: Date.now(),
    };
    const updated = [newPost, ...posts];
    localStorage.setItem("videoPosts", JSON.stringify(updated));
    setPosts(updated);
    setPost("");
  };

  return (
    <div className="video-review-page">
      <div className="review-card">
        <div className="review-content">
          <div className="review-header">
            <button
              onClick={() =>
                navigate("/video-page", { state: { sportId: 5, sportName: "ヨガ" } })
              }
              className="back-btn"
            >
              <FaArrowLeft />
            </button>
            <h2>動画投稿</h2>
          </div>

          {video && (
            <>
              <h3 className="video-title">{video.title}</h3>
            </>
          )}

          <div className="post-section">
            <h4>投稿</h4>
            <textarea
              value={post}
              onChange={(e) => setPost(e.target.value)}
              placeholder="この動画についてどう思いましたか？"
              rows="5"
            />
          </div>

          <div className="post-actions">
            <button
              onClick={handleSubmitPost}
              className="comment-btn submit-btn"
              disabled={!post.trim()}
            >
              投稿する
            </button>
          </div>

          {posts.length > 0 && (
            <div className="post-list">
              <h4 className="post-list-title">この動画の投稿</h4>
              {posts.map((p) => (
                <div key={p.id} className="post-item">
                  <div className="post-item-header">
                    <span className="post-author">{p.author}</span>
                    <span className="post-date">{formatDate(p.timestamp)}</span>
                  </div>
                  <p className="post-content">{p.content}</p>
                  <div className="post-likes">
                    <span>❤️  いいね</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="review-image-wrapper">
          {video && video.thumbnail ? (
            <img className="review-image" src={video.thumbnail} alt={video.title} />
          ) : (
            <div className="placeholder-thumbnail">
              <FaYoutube />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}