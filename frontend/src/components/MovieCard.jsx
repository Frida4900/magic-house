import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate, formatRating } from "../lib/format";

export default function MovieCard({ movie }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link to={`/movies/${movie.id}`} className="movie-card">
      <div className="movie-poster-shell">
        {movie.posterUrl && !imageError ? (
          <img
            src={movie.posterUrl}
            alt={`${movie.title} 海报`}
            className="movie-poster"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="poster-placeholder">暂无海报</div>
        )}
      </div>

      <div className="movie-card-body">
        <h3>{movie.title}</h3>
        <p className="movie-meta">{formatDate(movie.releaseDate)}</p>
        <div className="rating-row">
          <span className="rating-pill tmdb">TMDB {formatRating(movie.tmdbRating)}</span>
          <span className="rating-pill site">本站 {formatRating(movie.siteRating)}</span>
        </div>
      </div>
    </Link>
  );
}

