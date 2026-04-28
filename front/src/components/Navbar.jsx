import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/apikeys", label: "API Keys" },
    { path: "/billing", label: "Billing" },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <span style={styles.logoIcon}>M</span>
        <span style={styles.logoText}>MeterFlow</span>
      </div>
      <nav style={styles.nav}>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.navItem,
              ...(location.pathname === item.path ? styles.navItemActive : {})
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <button onClick={logout} style={styles.logoutBtn}>Logout</button>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    minHeight: "100vh",
    background: "#1e1e3f",
    display: "flex",
    flexDirection: "column",
    padding: "2rem 1rem",
    position: "fixed",
    top: 0, left: 0
  },
  logo: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "2.5rem", paddingLeft: "0.5rem" },
  logoIcon: {
    width: "36px", height: "36px", borderRadius: "10px",
    background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "white", fontWeight: "700", fontSize: "18px"
  },
  logoText: { color: "white", fontWeight: "700", fontSize: "18px" },
  nav: { display: "flex", flexDirection: "column", gap: "4px", flex: 1 },
  navItem: {
    padding: "10px 14px", borderRadius: "10px", color: "#94a3b8",
    fontSize: "14px", fontWeight: "500", transition: "all 0.2s"
  },
  navItemActive: { background: "rgba(108,99,255,0.2)", color: "#a78bfa" },
  logoutBtn: {
    padding: "10px 14px", borderRadius: "10px", color: "#94a3b8",
    fontSize: "14px", fontWeight: "500", background: "none",
    border: "none", cursor: "pointer", textAlign: "left"
  }
};

export default Navbar;