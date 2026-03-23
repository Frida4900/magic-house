import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function navClassName({ isActive }) {
  return isActive ? "nav-link is-active" : "nav-link";
}

export default function Layout() {
  const { ready, user, isAuthenticated, clearAuth } = useAuth();

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            Frida的电影小站
          </Link>
          <nav className="main-nav" aria-label="主导航">
            <NavLink to="/" end className={navClassName}>
              首页
            </NavLink>
            <a className="nav-link" href="/#now-playing">
              正在上映
            </a>
            <a className="nav-link" href="/#popular">
              热门电影
            </a>
          </nav>
          <div className="header-actions">
            {!ready ? null : isAuthenticated ? (
              <>
                <span className="welcome-text">你好，{user?.username}</span>
                <button type="button" className="ghost-button" onClick={clearAuth}>
                  退出登录
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="ghost-button link-button">
                  登录
                </Link>
                <Link to="/register" className="primary-button link-button">
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="page-shell">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>Frida的电影小站使用 TMDB 公开电影资料，不使用豆瓣数据。</p>
          <p>用户评分与评论由本站本地系统维护。</p>
        </div>
      </footer>
    </>
  );
}
