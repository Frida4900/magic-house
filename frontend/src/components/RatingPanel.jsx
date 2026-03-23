import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { submitComment, submitRating } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

export default function RatingPanel({ movie, onUpdated }) {
  const { token, isAuthenticated } = useAuth();
  const [score, setScore] = useState(movie.userRating || 8);
  const [comment, setComment] = useState("");
  const [ratingMessage, setRatingMessage] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    setScore(movie.userRating || 8);
  }, [movie.userRating]);

  async function handleRatingSubmit(event) {
    event.preventDefault();
    setRatingLoading(true);
    setRatingMessage("");

    try {
      const response = await submitRating(movie.id, Number(score), token);
      setRatingMessage(response.message);
      await onUpdated();
    } catch (error) {
      setRatingMessage(error.message);
    } finally {
      setRatingLoading(false);
    }
  }

  async function handleCommentSubmit(event) {
    event.preventDefault();
    setCommentLoading(true);
    setCommentMessage("");

    try {
      const response = await submitComment(movie.id, comment, token);
      setComment("");
      setCommentMessage(response.message);
      await onUpdated();
    } catch (error) {
      setCommentMessage(error.message);
    } finally {
      setCommentLoading(false);
    }
  }

  return (
    <aside className="side-panel">
      <div className="panel-card">
        <h3>我的评分</h3>
        {!isAuthenticated ? (
          <p className="muted-text">
            <Link to="/login" className="inline-link">
              登录
            </Link>
            后即可为本片评分与评论。
          </p>
        ) : (
          <form className="form-stack" onSubmit={handleRatingSubmit}>
            <label>
              分数（1-10）
              <select value={score} onChange={(event) => setScore(event.target.value)}>
                {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
                  <option key={value} value={value}>
                    {value} 分
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="primary-button" disabled={ratingLoading}>
              {ratingLoading ? "提交中..." : movie.userRating ? "更新评分" : "提交评分"}
            </button>
            {ratingMessage ? <p className="form-feedback">{ratingMessage}</p> : null}
          </form>
        )}
      </div>

      <div className="panel-card">
        <h3>写短评</h3>
        {!isAuthenticated ? (
          <p className="muted-text">登录后可发布 500 字以内的中文短评。</p>
        ) : (
          <form className="form-stack" onSubmit={handleCommentSubmit}>
            <label>
              评论内容
              <textarea
                rows="5"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="说说你对这部电影的看法..."
              />
            </label>
            <button type="submit" className="primary-button" disabled={commentLoading}>
              {commentLoading ? "发布中..." : "发布评论"}
            </button>
            {commentMessage ? <p className="form-feedback">{commentMessage}</p> : null}
          </form>
        )}
      </div>
    </aside>
  );
}

