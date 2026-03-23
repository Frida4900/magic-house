import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { loginUser } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await loginUser(formData);
      saveAuth(response.token, response.user);
      navigate("/");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container narrow">
      <section className="auth-card">
        <p className="section-label">欢迎回来</p>
        <h1>登录账号</h1>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            邮箱
            <input
              type="email"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            密码
            <input
              type="password"
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              placeholder="请输入密码"
              required
            />
          </label>
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? "登录中..." : "登录"}
          </button>
          {error ? <p className="form-feedback">{error}</p> : null}
        </form>
        <p className="muted-text">
          还没有账号？
          <Link to="/register" className="inline-link">
            立即注册
          </Link>
        </p>
      </section>
    </div>
  );
}

