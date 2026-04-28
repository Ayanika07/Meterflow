import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";

const ApiKeys = () => {
  const [apis, setApis] = useState([]);
  const [keys, setKeys] = useState([]);
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [selectedApi, setSelectedApi] = useState("");
  const [copied, setCopied] = useState(null);

  const refresh = async () => {
    axios.get("/apis").then(res => setApis(res.data));
    axios.get("/apikey").then(res => setKeys(res.data));
  };

  useEffect(() => { refresh(); }, []);

  const createApi = async () => {
    if (!name || !baseUrl) return;
    await axios.post("/apis", { name, baseUrl });
    setName(""); setBaseUrl("");
    refresh();
  };

  const generateKey = async () => {
    if (!selectedApi) return;
    await axios.post("/apikey/generate", { apiId: selectedApi });
    refresh();
  };

  const revokeKey = async (id) => {
    await axios.patch(`/apikey/revoke/${id}`);
    refresh();
  };

  const copyKey = (key, id) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={styles.layout}>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>API Keys</h1>
            <p style={styles.subtitle}>Manage your APIs and access keys</p>
          </div>
        </div>

        <div style={styles.row}>
          {/* Create API */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Register New API</h3>
            <div style={styles.field}>
              <label style={styles.label}>API Name</label>
              <input style={styles.input} placeholder="e.g. Weather API" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Base URL</label>
              <input style={styles.input} placeholder="https://api.example.com" value={baseUrl} onChange={e => setBaseUrl(e.target.value)} />
            </div>
            <button style={styles.btn} onClick={createApi}>Register API</button>
          </div>

          {/* Generate Key */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Generate API Key</h3>
            <div style={styles.field}>
              <label style={styles.label}>Select API</label>
              <select style={styles.input} value={selectedApi} onChange={e => setSelectedApi(e.target.value)}>
                <option value="">Choose an API...</option>
                {apis.map(api => <option key={api._id} value={api._id}>{api.name}</option>)}
              </select>
            </div>
            <div style={styles.apiList}>
              {apis.map(api => (
                <div key={api._id} style={styles.apiItem}>
                  <div style={styles.apiDot} />
                  <div>
                    <p style={styles.apiName}>{api.name}</p>
                    <p style={styles.apiUrl}>{api.baseUrl}</p>
                  </div>
                </div>
              ))}
            </div>
            <button style={styles.btn} onClick={generateKey}>Generate Key</button>
          </div>
        </div>

        {/* Keys List */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Your API Keys</h3>
          {keys.length === 0 ? (
            <p style={styles.empty}>No keys yet. Generate one above!</p>
          ) : keys.map(key => (
            <div key={key._id} style={styles.keyRow}>
              <div style={styles.keyLeft}>
                <div style={styles.keyIcon}>#</div>
                <div>
                  <p style={styles.keyText}>{key.key.slice(0, 32)}...</p>
                  <p style={styles.keyMeta}>{key.apiId?.name} • Created {new Date(key.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div style={styles.keyRight}>
                <span style={{ ...styles.badge, background: key.status === "active" ? "#dcfce7" : "#fee2e2", color: key.status === "active" ? "#16a34a" : "#dc2626" }}>
                  {key.status}
                </span>
                <button style={styles.copyBtn} onClick={() => copyKey(key.key, key._id)}>
                  {copied === key._id ? "Copied!" : "Copy"}
                </button>
                {key.status === "active" && (
                  <button style={styles.revokeBtn} onClick={() => revokeKey(key._id)}>Revoke</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const styles = {
  layout: { display: "flex", minHeight: "100vh", background: "#f0f2f8" },
  main: { marginLeft: "220px", flex: 1, padding: "2rem" },
  header: { marginBottom: "1.5rem" },
  title: { fontSize: "24px", fontWeight: "700", color: "#1a1a2e" },
  subtitle: { color: "#94a3b8", fontSize: "14px", marginTop: "2px" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" },
  card: { background: "white", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 1px 10px rgba(0,0,0,0.05)", marginBottom: "1.5rem" },
  cardTitle: { fontSize: "15px", fontWeight: "600", color: "#1a1a2e", marginBottom: "1.25rem" },
  field: { marginBottom: "1rem" },
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" },
  input: {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: "1.5px solid #e2e8f0", fontSize: "14px", color: "#1a1a2e",
    outline: "none", background: "#f8fafc"
  },
  btn: {
    padding: "10px 20px", borderRadius: "10px",
    background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
    color: "white", fontWeight: "600", fontSize: "14px",
    border: "none", cursor: "pointer", marginTop: "0.5rem"
  },
  apiList: { marginBottom: "1rem" },
  apiItem: { display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: "1px solid #f1f5f9" },
  apiDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#6c63ff", flexShrink: 0 },
  apiName: { fontSize: "14px", fontWeight: "500", color: "#1a1a2e", margin: 0 },
  apiUrl: { fontSize: "12px", color: "#94a3b8", margin: 0 },
  keyRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "1rem", background: "#f8fafc", borderRadius: "12px", marginBottom: "0.75rem"
  },
  keyLeft: { display: "flex", alignItems: "center", gap: "12px" },
  keyIcon: {
    width: "36px", height: "36px", borderRadius: "10px", background: "#ede9fe",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#6c63ff", fontWeight: "700", fontSize: "16px"
  },
  keyText: { fontFamily: "monospace", fontSize: "13px", color: "#334155", margin: 0 },
  keyMeta: { fontSize: "12px", color: "#94a3b8", margin: "2px 0 0" },
  keyRight: { display: "flex", gap: "8px", alignItems: "center" },
  badge: { padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  copyBtn: {
    padding: "6px 14px", borderRadius: "8px", background: "#ede9fe",
    color: "#6c63ff", fontWeight: "600", fontSize: "12px", border: "none", cursor: "pointer"
  },
  revokeBtn: {
    padding: "6px 14px", borderRadius: "8px", background: "#fee2e2",
    color: "#dc2626", fontWeight: "600", fontSize: "12px", border: "none", cursor: "pointer"
  },
  empty: { color: "#94a3b8", fontSize: "14px" }
};

export default ApiKeys;