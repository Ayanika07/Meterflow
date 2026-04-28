import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";

const Billing = () => {
  const [summary, setSummary] = useState(null);
  const [apis, setApis] = useState([]);

  const refresh = async () => {
    axios.get("/billing/summary").then(res => setSummary(res.data)).catch(() => {});
    axios.get("/apis").then(res => setApis(res.data)).catch(() => {});
  };

  useEffect(() => { refresh(); }, []);

  const generateBill = async (apiId) => {
    await axios.post(`/billing/generate/${apiId}`);
    refresh();
  };

  const markPaid = async (billId) => {
    await axios.patch(`/billing/pay/${billId}`);
    refresh();
  };

  return (
    <div style={styles.layout}>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Billing</h1>
            <p style={styles.subtitle}>Track usage costs and manage payments</p>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div style={styles.statsGrid}>
            {[
              { label: "Total Due", value: summary.totalDue, color: "#ef4444", bg: "#fee2e2" },
              { label: "Total Paid", value: summary.totalPaid, color: "#16a34a", bg: "#dcfce7" },
              { label: "Total Bills", value: summary.totalBills, color: "#6c63ff", bg: "#ede9fe" }
            ].map((s, i) => (
              <div key={i} style={styles.statCard}>
                <div style={{ ...styles.statIcon, background: s.bg, color: s.color }}>₹</div>
                <div>
                  <p style={styles.statLabel}>{s.label}</p>
                  <h2 style={{ ...styles.statValue, color: s.color }}>{s.value}</h2>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Generate Bills */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Generate Bill</h3>
          <div style={styles.apiGrid}>
            {apis.map(api => (
              <div key={api._id} style={styles.apiCard}>
                <div style={styles.apiIcon}>{api.name[0]}</div>
                <div style={styles.apiInfo}>
                  <p style={styles.apiName}>{api.name}</p>
                  <p style={styles.apiUrl}>{api.baseUrl}</p>
                </div>
                <button style={styles.genBtn} onClick={() => generateBill(api._id)}>
                  Generate
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bills List */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Payment History</h3>
          {summary?.bills?.length === 0 ? (
            <p style={styles.empty}>No bills yet. Generate one above!</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>{["API", "Period", "Requests", "Free", "Billable", "Amount", "Status", ""].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {summary?.bills?.map(bill => (
                  <tr key={bill._id} style={styles.tr}>
                    <td style={styles.td}><span style={styles.apiLabel}>{bill.apiId?.name}</span></td>
                    <td style={{ ...styles.td, fontSize: "12px", color: "#94a3b8" }}>
                      {new Date(bill.billingPeriodStart).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>{bill.totalRequests}</td>
                    <td style={styles.td}>{bill.freeLimit}</td>
                    <td style={styles.td}>{bill.billableRequests}</td>
                    <td style={{ ...styles.td, fontWeight: "600", color: "#1a1a2e" }}>
                      ₹{bill.totalAmount.toFixed(2)}
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: bill.status === "paid" ? "#dcfce7" : "#fef9c3", color: bill.status === "paid" ? "#16a34a" : "#ca8a04" }}>
                        {bill.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {bill.status === "unpaid" && (
                        <button style={styles.payBtn} onClick={() => markPaid(bill._id)}>Pay</button>
                      )}
                    </td>
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
  header: { marginBottom: "1.5rem" },
  title: { fontSize: "24px", fontWeight: "700", color: "#1a1a2e" },
  subtitle: { color: "#94a3b8", fontSize: "14px", marginTop: "2px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" },
  statCard: {
    background: "white", borderRadius: "16px", padding: "1.25rem",
    boxShadow: "0 1px 10px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "1rem"
  },
  statIcon: { width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "700", flexShrink: 0 },
  statLabel: { fontSize: "13px", color: "#94a3b8", margin: "0 0 4px", fontWeight: "500" },
  statValue: { fontSize: "22px", fontWeight: "700", margin: 0 },
  card: { background: "white", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 1px 10px rgba(0,0,0,0.05)", marginBottom: "1.5rem" },
  cardTitle: { fontSize: "15px", fontWeight: "600", color: "#1a1a2e", marginBottom: "1.25rem" },
  apiGrid: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  apiCard: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "12px", background: "#f8fafc", borderRadius: "12px"
  },
  apiIcon: {
    width: "40px", height: "40px", borderRadius: "10px", background: "#ede9fe",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#6c63ff", fontWeight: "700", fontSize: "18px", flexShrink: 0
  },
  apiInfo: { flex: 1 },
  apiName: { fontSize: "14px", fontWeight: "600", color: "#1a1a2e", margin: 0 },
  apiUrl: { fontSize: "12px", color: "#94a3b8", margin: 0 },
  genBtn: {
    padding: "7px 16px", borderRadius: "8px",
    background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
    color: "white", fontWeight: "600", fontSize: "13px", border: "none", cursor: "pointer"
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", fontSize: "11px", color: "#94a3b8", fontWeight: "600", borderBottom: "1px solid #f1f5f9", textTransform: "uppercase", letterSpacing: "0.05em" },
  tr: { borderBottom: "1px solid #f8fafc" },
  td: { padding: "12px", fontSize: "14px", color: "#334155" },
  apiLabel: { fontWeight: "600", color: "#6c63ff" },
  badge: { padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  payBtn: {
    padding: "5px 14px", borderRadius: "8px", background: "#dcfce7",
    color: "#16a34a", fontWeight: "600", fontSize: "12px", border: "none", cursor: "pointer"
  },
  empty: { color: "#94a3b8", fontSize: "14px" }
};

export default Billing;