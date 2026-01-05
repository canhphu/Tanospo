import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaYoutube, FaArrowLeft } from "react-icons/fa";
import { postsAPI } from "../api/posts";
import "../styles/VideoReview.css";
import "../styles/PostPage.css";

// Convert file to base64 data URL
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function VideoReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { video } = location.state || {};
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (video) {
      setVideoUrl(video.youtubeUrl || video.url || video.videoUrl || "");
    }
  }, [video]);

  useEffect(() => {
    // Load posts from backend
    const loadPosts = async () => {
      try {
        const allPosts = await postsAPI.getAll({ limit: 50, offset: 0 });
        const videoPosts = (allPosts || []).filter(p => 
          p.videoUrl && video && (
            p.videoUrl === video.youtubeUrl || 
            p.videoUrl === video.url || 
            p.videoUrl === video.videoUrl ||
            (video.id && p.content.includes(video.title))
          )
        );
        setPosts(videoPosts);
      } catch (e) {
        console.error('Failed to load video posts:', e);
      }
    };
    loadPosts();
  }, [video]);

  const formatDate = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString("ja-JP");
    } catch {
      return "";
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitPost = async () => {
    if (!user) {
      alert("投稿するにはログインが必要です。");
      navigate("/login");
      return;
    }

    if (!content.trim() && !title.trim()) {
      alert("コンテンツを入力してください。");
      return;
    }

    if (!videoUrl.trim()) {
      alert("YouTubeリンクを入力してください。");
      return;
    }

    try {
      setIsSubmitting(true);

      // Convert image file to base64 data URL if exists
      let imageUrl = undefined;
      if (imageFile) {
        imageUrl = await fileToBase64(imageFile);
      }

      // Backend requires: postType, content (required), optional imageUrl & videoUrl.
      const payloadContent = title
        ? `${title}\n\n${content}`.trim()
        : content.trim();

      await postsAPI.create({
        postType: "video",
        content: payloadContent,
        imageUrl: imageUrl,
        videoUrl: videoUrl,
      });

      // Reload posts
      const allPosts = await postsAPI.getAll({ limit: 50, offset: 0 });
      const videoPosts = (allPosts || []).filter(p => 
        p.videoUrl && (
          p.videoUrl === videoUrl ||
          (video && p.content.includes(video.title))
        )
      );
      setPosts(videoPosts);

      // Reset form
      setTitle("");
      setContent("");
      setImageFile(null);
      setImagePreview(null);
      
      alert("投稿が完了しました！");
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("投稿に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
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

          {/* Image Upload */}
          <div className="image-upload-wrapper" style={{ marginBottom: '20px' }}>
            <label htmlFor="videoImageUpload">
              <img
                src={imagePreview || video?.thumbnail || "/placeholder.png"}
                alt="upload preview"
                className="preview-image"
                style={{ maxHeight: '200px', objectFit: 'cover' }}
              />
              <p className="upload-text">クリックして写真をアップロード</p>
            </label>
            <input
              id="videoImageUpload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </div>

          {/* YouTube Link */}
          <div className="post-section">
            <h4>YouTubeリンク</h4>
            <input
              type="text"
              className="input-box"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {videoUrl && (
              <a 
                href={videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ display: 'inline-block', marginTop: '10px' }}
              >
                <button style={{ padding: '8px 16px', background: '#ff0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaYoutube /> YouTube で見る
                </button>
              </a>
            )}
          </div>

          {/* Title */}
          <div className="post-section">
            <h4>タイトル</h4>
            <input
              type="text"
              className="input-box"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="投稿のタイトルを入力..."
            />
          </div>

          {/* Content */}
          <div className="post-section">
            <h4>投稿</h4>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="この動画についてどう思いましたか？"
              rows="5"
              className="text-area"
            />
          </div>

          <div className="post-actions">
            <button
              onClick={handleSubmitPost}
              className="comment-btn submit-btn"
              disabled={!content.trim() && !title.trim() || !videoUrl.trim() || isSubmitting}
            >
              {isSubmitting ? "投稿中..." : "投稿する"}
            </button>
          </div>

          {posts.length > 0 && (
            <div className="post-list">
              <h4 className="post-list-title">この動画の投稿</h4>
              {posts.map((p) => (
                <div key={p.id} className="post-item">
                  <div className="post-item-header">
                    <span className="post-author">{p.userId?.slice(0, 6) || 'ユーザー'}</span>
                    <span className="post-date">{formatDate(p.createdAt || p.timestamp)}</span>
                  </div>
                  <p className="post-content">{p.content}</p>
                  {p.imageUrl && (
                    <img src={p.imageUrl} alt="post" style={{ maxWidth: '100%', marginTop: '10px', borderRadius: '8px' }} />
                  )}
                  {p.videoUrl && (
                    <a 
                      href={p.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ display: 'inline-block', marginTop: '10px' }}
                    >
                      <button style={{ padding: '8px 16px', background: '#ff0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaYoutube /> YouTube で見る
                      </button>
                    </a>
                  )}
                  <div className="post-likes">
                    <span>❤️ {Array.isArray(p.likedBy) ? p.likedBy.length : 0} いいね</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="review-image-wrapper">
          {imagePreview || (video && video.thumbnail) ? (
            <img 
              className="review-image" 
              src={imagePreview || video.thumbnail} 
              alt={video?.title || 'Video thumbnail'} 
            />
          ) : (
            <div className="placeholder-thumbnail">
              <FaYoutube />
            </div>
          )}
          {videoUrl && (
            <a 
              href={videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'block', marginTop: '15px', textAlign: 'center' }}
            >
              <button style={{ padding: '10px 20px', background: '#ff0000', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
                <FaYoutube /> YouTube で見る
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}