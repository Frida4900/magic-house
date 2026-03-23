import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentList from "../components/CommentList";
import RatingPanel from "../components/RatingPanel";
import { useAuth } from "../contexts/AuthContext";
import { fetchMovieDetail } from "../lib/api";
import { formatCount, formatDate, formatRating } from "../lib/format";

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const { token } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMovieDetail() {
    try {
      setLoading(true);
      setError("");
      const data = await fetchMovieDetail(movieId, token);
      setMovie(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMovieDetail();
  }, [movieId, token]);

  if (loading) {
    return (
      <div className="container">
        <div className="status-card">电影详情加载中...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container">
        <div className="status-card error-card">{error || "电影不存在。"}</div>
      </div>
    );
  }

  return (
    <div className="container detail-layout">
      <section className="detail-hero">
        <div className="detail-poster-shell">
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={`${movie.title} 海报`} className="detail-poster" />
          ) : (
            <div className="poster-placeholder large">暂无海报</div>
          )}
        </div>

        <div className="detail-content">
          <p className="section-label">电影详情</p>
          <h1>{movie.title}</h1>
          <div className="detail-meta">
            <span>上映日期：{formatDate(movie.releaseDate)}</span>
            <span>TMDB 评分：{formatRating(movie.tmdbRating)}</span>
            <span>本站评分：{formatRating(movie.siteRating)}</span>
            <span>{formatCount(movie.ratingsCount)}</span>
          </div>
          <p className="detail-overview">{movie.overview}</p>
        </div>
      </section>

      <div className="detail-main">
        <section className="detail-comments">
          <div className="section-heading compact">
            <div>
              <p className="section-label">最新评论</p>
              <h2>用户短评</h2>
            </div>
          </div>
          <CommentList comments={movie.comments} />
        </section>

        <RatingPanel movie={movie} onUpdated={loadMovieDetail} />
      </div>
    </div>
  );
}

