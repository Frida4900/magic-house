import MovieCard from "./MovieCard";

export default function MovieSection({ id, title, subtitle, movies }) {
  return (
    <section className="content-section" id={id}>
      <div className="section-heading">
        <div>
          <p className="section-label">{subtitle}</p>
          <h2>{title}</h2>
        </div>
      </div>

      {movies.length ? (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="empty-card">暂无数据，请先运行电影同步脚本。</div>
      )}
    </section>
  );
}

