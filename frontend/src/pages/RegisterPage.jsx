import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { registerUser } from "../lib/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
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
      const response = await registerUser(formData);
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
        <p className="section-label">创建账号</p>
        <h1>注册新用户</h1>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            用户名
            <input
              type="text"
              value={formData.username}
              onChange={(event) => setFormData({ ...formData, username: event.target.value })}
              placeholder="例如：电影爱好者"
              required
            />
          </label>
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
              placeholder="至少 6 位"
              required
            />
          </label>
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? "注册中..." : "注册并登录"}
          </button>
          {error ? <p className="form-feedback">{error}</p> : null}
        </form>
        <p className="muted-text">
          已有账号？
          <Link to="/login" className="inline-link">
            去登录
          </Link>
        </p>
      </section>
    </div>
  );
}

