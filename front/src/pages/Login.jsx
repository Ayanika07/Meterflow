import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.brand}>M</div>
        <h1 style={styles.brandName}>MeterFlow</h1>
        <p style={styles.tagline}>Usage-based API billing platform for modern developers</p>
      </div>
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.sub}>Sign in to your account</p>
          {error && <p style={styles.error}>{error}</p>}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button style={styles.btn} onClick={handleLogin}>Sign in</button>
          <p style={styles.footer}>Don't have an account? <Link to="/signup" style={styles.link}>Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { display: "flex", minHeight: "100vh" },
  left: {
    flex: 1, background: "linear-gradient(135deg, #1e1e3f, #2d2b69)",
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "3rem", color: "white"
  },
  brand: {
    width: "64px", height: "64px", borderRadius: "18px",
    background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "32px", fontWeight: "800", color: "white", marginBottom: "1rem"
  },
  brandName: { fontSize: "32px", fontWeight: "700", marginBottom: "1rem" },
  tagline: { color: "#94a3b8", textAlign: "center", maxWidth: "280px", lineHeight: "1.6" },
  right: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f8" },
  card: {
    background: "white", padding: "2.5rem", borderRadius: "20px",
    width: "100%", maxWidth: "400px", boxShadow: "0 4px 40px rgba(0,0,0,0.08)"
  },
  title: { fontSize: "24px", fontWeight: "700", marginBottom: "4px", color: "#1a1a2e" },
  sub: { color: "#94a3b8", marginBottom: "1.5rem", fontSize: "14px" },
  field: { marginBottom: "1rem" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" },
  input: {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: "1.5px solid #e2e8f0", fontSize: "14px", color: "#1a1a2e",
    outline: "none", background: "#f8fafc"
  },
  btn: {
    width: "100%", padding: "12px", borderRadius: "10px",
    background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
    color: "white", fontWeight: "600", fontSize: "15px",
    border: "none", cursor: "pointer", marginTop: "0.5rem", marginBottom: "1rem"
  },
  error: { color: "#ef4444", fontSize: "13px", marginBottom: "1rem" },
  footer: { textAlign: "center", fontSize: "13px", color: "#94a3b8" },
  link: { color: "#6c63ff", fontWeight: "600" }
};

export default Login;