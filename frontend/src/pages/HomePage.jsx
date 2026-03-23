import { useEffect, useState } from "react";
import MovieSection from "../components/MovieSection";
import { fetchHomeData } from "../lib/api";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sections, setSections] = useState({
    nowPlaying: [],
    popular: [],
    recommended: []
  });

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchHomeData();
        setSections(data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  return (
    <div className="container">
      <section className="hero-banner">
        <div className="hero-copy">
          <p className="section-label">中文电影评分网站</p>
          <h1>正在上映、热门口碑、一页看完</h1>
          <p>
            Frida的电影小站自动同步 TMDB
            正在上映片单，用简洁中文界面展示电影资料，并支持本站用户打分和写短评。
          </p>
        </div>
        <div className="hero-note">
          <span>数据来源：TMDB</span>
          <span>界面语言：zh-CN</span>
          <span>用户评分：本站本地系统</span>
        </div>
      </section>

      {loading ? <div className="status-card">正在加载电影列表...</div> : null}
      {error ? <div className="status-card error-card">{error}</div> : null}

      {!loading && !error ? (
        <>
          <MovieSection
            id="now-playing"
            title="正在上映"
            subtitle="Now Playing"
            movies={sections.nowPlaying}
          />
          <MovieSection
            id="popular"
            title="热门电影"
            subtitle="Popular Picks"
            movies={sections.popular}
          />
          <MovieSection
            id="recommended"
            title="口碑推荐"
            subtitle="Sorted By Rating"
            movies={sections.recommended}
          />
        </>
      ) : null}
    </div>
  );
}
