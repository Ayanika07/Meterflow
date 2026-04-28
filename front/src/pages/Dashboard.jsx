import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const [summary, setSummary] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get("/logs/summary").then(res => setSummary(res.data)).catch(() => {});
    axios.get("/logs").then(res => setLogs(res.data.slice(0, 20))).catch(() => {});
  }, []);

  const chartData = logs.map((log, i) => ({ name: `#${i + 1}`, latency: log.latency }));
  const totalRequests = summary.reduce((s, a) => s + a.totalRequests, 0);
  const totalSuccess = summary.reduce((s, a) => s + a.successCount, 0);
  const totalErrors = summary.reduce((s, a) => s + a.errorCount, 0);
  const pieData = [
    { name: "Success", value: totalSuccess },
    { name: "Errors", value: totalErrors }
  ];

  return (
    <div style={styles.layout}>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>Monitor your API usage and performance</p>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            { label: "Total Requests", value: totalRequests, color: "#6c63ff" },
            { label: "Successful", value: totalSuccess, color: "#10b981" },
            { label: "Errors", value: totalErrors, color: "#ef4444" },
            { label: "APIs Tracked", value: summary.length, color: "#f59e0b" }
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <p style={styles.statLabel}>{s.label}</p>
              <h2 style={{ ...styles.statValue, color: s.color }}>{s.value}</h2>
            </div>
          ))}
        </div>

        <div style={styles.chartsRow}>
          {/* Line Chart */}
          <div style={{ ...styles.card, flex: 2 }}>
            <h3 style={styles.cardTitle}>Request Latency</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="latency" stroke="#6c63ff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div style={{ ...styles.card, flex: 1 }}>
            <h3 style={styles.cardTitle}>Success Rate</h3>
            <PieChart width={180} height={180}>
              <Pie data={pieData} cx={90} cy={90} innerRadius={55} outerRadius={80} dataKey="value">
                <Cell fill="#6c63ff" />
                <Cell fill="#ef4444" />
              </Pie>
            </PieChart>
            <div style={styles.pieLegend}>
              <span style={{ color: "#6c63ff" }}>● Success</span>
              <span style={{ color: "#ef4444" }}>● Errors</span>
            </div>
          </div>
        </div>

        {/* API Summary */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Your APIs</h3>
          {summary.length === 0 ? (
            <p style={styles.empty}>No API data yet. Make some requests through the gateway!</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>{["API", "Total Requests", "Avg Latency", "Success", "Errors"].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {summary.map((s, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.td}><span style={styles.apiName}>{s.apiName}</span></td>
                    <td style={styles.td}>{s.totalRequests}</td>
                    <td style={styles.td}>{s.avgLatency}ms</td>
                    <td style={styles.td}><span style={styles.success}>{s.successCount}</span></td>
                    <td style={styles.td}><span style={styles.error}>{s.errorCount}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Logs */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Recent Logs</h3>
          {logs.length === 0 ? (
            <p style={styles.empty}>No logs yet.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>{["Endpoint", "Method", "Status", "Latency", "Time"].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={{ ...styles.td, fontFamily: "monospace", fontSize: "13px" }}>{log.endpoint}</td>
                    <td style={styles.td}><span style={styles.method}>{log.method}</span></td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: log.status < 400 ? "#dcfce7" : "#fee2e2", color: log.status < 400 ? "#16a34a" : "#dc2626" }}>
                        {log.status}
                      </span>
                    </td>
                    <td style={styles.td}>{log.latency}ms</td>
                    <td style={{ ...styles.td, color: "#94a3b8", fontSize: "12px" }}>{new Date(log.createdAt).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

const styles = {
  layout: { display: "flex", minHeight: "100vh", background: "#f0f2f8" },
  main: { marginLeft: "220px", flex: 1, padding: "2rem" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" },
  title: { fontSize: "24px", fontWeight: "700", color: "#1a1a2e" },
  subtitle: { color: "#94a3b8", fontSize: "14px", marginTop: "2px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" },
  statCard: { background: "white", borderRadius: "16px", padding: "1.25rem", boxShadow: "0 1px 10px rgba(0,0,0,0.05)" },
  statLabel: { fontSize: "13px", color: "#94a3b8", marginBottom: "8px", fontWeight: "500" },
  statValue: { fontSize: "28px", fontWeight: "700" },
  chartsRow: { display: "flex", gap: "1rem", marginBottom: "1.5rem" },
  card: { background: "white", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 1px 10px rgba(0,0,0,0.05)", marginBottom: "1.5rem" },
  cardTitle: { fontSize: "15px", fontWeight: "600", color: "#1a1a2e", marginBottom: "1rem" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", fontSize: "12px", color: "#94a3b8", fontWeight: "600", borderBottom: "1px solid #f1f5f9", textTransform: "uppercase", letterSpacing: "0.05em" },
  tr: { borderBottom: "1px solid #f8fafc" },
  td: { padding: "12px", fontSize: "14px", color: "#334155" },
  apiName: { fontWeight: "600", color: "#6c63ff" },
  success: { background: "#dcfce7", color: "#16a34a", padding: "2px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" },
  error: { background: "#fee2e2", color: "#dc2626", padding: "2px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" },
  method: { background: "#ede9fe", color: "#6c63ff", padding: "2px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" },
  badge: { padding: "2px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" },
  pieLegend: { display: "flex", gap: "1rem", justifyContent: "center", fontSize: "13px", color: "#94a3b8" },
  empty: { color: "#94a3b8", fontSize: "14px", padding: "1rem 0" }
};

export default Dashboard;