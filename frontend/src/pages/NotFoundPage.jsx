import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="container narrow">
      <section className="auth-card">
        <p className="section-label">404</p>
        <h1>页面不存在</h1>
        <p className="muted-text">你访问的页面没有找到，可以返回首页继续浏览电影。</p>
        <Link to="/" className="primary-button link-button">
          返回首页
        </Link>
      </section>
    </div>
  );
}
