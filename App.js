import { useState } from "react";

const SEVERITY_POINTS = { Lowest: 1, Low: 2, Medium: 3, High: 4, Critical: 5 };
const SEVERITY_COLORS = { Lowest: "#94a3b8", Low: "#4ade80", Medium: "#facc15", High: "#fb923c", Critical: "#f87171" };
const ADMIN_PASSWORD = "admin123";

const DEFAULT_PARTICIPANTS = [
  { id: "1",  name: "Yossi Hershko",        email: "yossi.hershko@cialdnb.com",      points: 0, bugs: [] },
  { id: "2",  name: "Raissa Scarpa Pereira", email: "raissa.pereira@cialdnb.com",     points: 0, bugs: [] },
  { id: "3",  name: "Nicole Bineck",         email: "nicole.bineck@cialdnb.com",      points: 0, bugs: [] },
  { id: "4",  name: "Luiz Souza",            email: "luiz.souza@cialdnb.com",         points: 0, bugs: [] },
  { id: "5",  name: "Jorge Dabah",           email: "jorge.dabah@cialdnb.com",        points: 0, bugs: [] },
  { id: "6",  name: "Danilo Silva",          email: "danilo.silva@cialdnb.com",       points: 0, bugs: [] },
  { id: "7",  name: "Felipe Marçal",         email: "felipe.marcal@cialdnb.com",      points: 0, bugs: [] },
  { id: "8",  name: "Giulia Saldanha",       email: "giulia.saldanha@cialdnb.com",    points: 0, bugs: [] },
  { id: "9",  name: "João Paulo Oliveira",   email: "joaopaulo.oliveira@cialdnb.com", points: 0, bugs: [] },
  { id: "10", name: "Matheus da Silva",      email: "matheus.dasilva@cialdnb.com",    points: 0, bugs: [] },
  { id: "11", name: "Priscilla Nogueira",    email: "priscilla.nogueira@cialdnb.com", points: 0, bugs: [] },
  { id: "12", name: "Lorena Diaz",           email: "lorena.diaz@cialdnb.com",        points: 0, bugs: [] },
  { id: "13", name: "Shai Lelchuk",          email: "shail@trustedpartners.com",      points: 0, bugs: [] },
];

function genId() { return Math.random().toString(36).slice(2, 9); }

export default function App() {
  const [dark, setDark] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);

  const [participants, setParticipants] = useState(DEFAULT_PARTICIPANTS);
  const [view, setView] = useState("leaderboard");
  const [selectedId, setSelectedId] = useState(null);
  const [editBug, setEditBug] = useState(null);

  const [pForm, setPForm] = useState({ name: "", email: "" });
  const [bForm, setBForm] = useState({ title: "", jiraLink: "", severity: "Medium", bonusPoints: "", participantId: "" });
  const [pError, setPError] = useState("");
  const [bError, setBError] = useState("");

  const bg = dark ? "#0f172a" : "#f1f5f9";
  const card = dark ? "#1e293b" : "#ffffff";
  const text = dark ? "#e2e8f0" : "#1e293b";
  const sub = dark ? "#94a3b8" : "#64748b";
  const border = dark ? "#334155" : "#e2e8f0";
  const accent = "#6366f1";

  const sorted = [...participants].sort((a, b) => b.points - a.points);

  const s = {
    app: { minHeight: "100vh", background: bg, color: text, fontFamily: "'Inter',sans-serif", paddingBottom: 40 },
    header: { background: dark ? "#1e293b" : "#6366f1", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 12px rgba(0,0,0,0.2)" },
    btn: (col = accent) => ({ background: col, color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 600, fontSize: 13 }),
    outBtn: { background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.7)", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13 },
    card: { background: card, borderRadius: 12, padding: "20px 24px", marginBottom: 16, border: `1px solid ${border}` },
    input: { background: dark ? "#0f172a" : "#f8fafc", border: `1.5px solid ${border}`, borderRadius: 8, padding: "9px 12px", color: text, fontSize: 14, width: "100%", boxSizing: "border-box", outline: "none" },
    label: { fontSize: 12, fontWeight: 600, color: sub, marginBottom: 4, display: "block", textTransform: "uppercase", letterSpacing: "0.5px" },
    error: { color: "#f87171", fontSize: 13, marginTop: 6 },
    row: { display: "flex", gap: 12, flexWrap: "wrap" },
    tag: (sev) => ({ background: SEVERITY_COLORS[sev] + "22", color: SEVERITY_COLORS[sev], border: `1px solid ${SEVERITY_COLORS[sev]}44`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }),
    overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
    modal: { background: card, borderRadius: 14, padding: 32, width: 340, border: `1px solid ${border}` },
  };

  function tryAdminLogin() {
    if (adminInput === ADMIN_PASSWORD) {
      setIsAdmin(true); setShowAdminModal(false); setAdminInput(""); setAdminError("");
      setView("addParticipant");
    } else setAdminError("Wrong password.");
  }

  function addParticipant() {
    if (!pForm.name.trim()) return setPError("Name is required.");
    if (!pForm.email.trim() || !pForm.email.includes("@")) return setPError("Valid email is required.");
    if (participants.find(p => p.email.toLowerCase() === pForm.email.toLowerCase())) return setPError("Email already registered.");
    setParticipants(prev => [...prev, { id: genId(), name: pForm.name.trim(), email: pForm.email.trim(), points: 0, bugs: [] }]);
    setPForm({ name: "", email: "" }); setPError(""); setView("leaderboard");
  }

  function addBug() {
    if (!bForm.participantId) return setBError("Select a participant.");
    if (!bForm.title.trim()) return setBError("Bug title is required.");
    const bonus = bForm.bonusPoints ? parseInt(bForm.bonusPoints) : 0;
    if (bForm.bonusPoints && (isNaN(bonus) || bonus < 0)) return setBError("Bonus points must be a positive number.");
    const basePts = SEVERITY_POINTS[bForm.severity];
    const totalPts = basePts + bonus;
    const bug = { id: genId(), title: bForm.title.trim(), jiraLink: bForm.jiraLink.trim(), severity: bForm.severity, basePoints: basePts, bonusPoints: bonus, points: totalPts };
    setParticipants(prev => prev.map(p => p.id === bForm.participantId
      ? { ...p, bugs: [...p.bugs, bug], points: p.points + totalPts } : p));
    setBForm(f => ({ ...f, title: "", jiraLink: "", bonusPoints: "" })); setBError("");
    setView("leaderboard");
  }

  function deleteBug(participantId, bug) {
    setParticipants(prev => prev.map(p => p.id !== participantId ? p :
      { ...p, bugs: p.bugs.filter(b => b.id !== bug.id), points: p.points - bug.points }));
  }

  function saveEditBug(participantId) {
    const bonus = parseInt(editBug.bonusPoints) || 0;
    const total = SEVERITY_POINTS[editBug.severity] + bonus;
    const updated = { ...editBug, basePoints: SEVERITY_POINTS[editBug.severity], bonusPoints: bonus, points: total };
    setParticipants(prev => prev.map(p => {
      if (p.id !== participantId) return p;
      const old = p.bugs.find(b => b.id === editBug.id);
      return { ...p, points: p.points + (total - old.points), bugs: p.bugs.map(b => b.id === editBug.id ? updated : b) };
    }));
    setEditBug(null);
  }

  function deleteParticipant(id) { setParticipants(prev => prev.filter(p => p.id !== id)); setView("leaderboard"); }

  function exportCSV() {
    const rows = [["Name", "Email", "Total Points", "Bug Title", "Jira Link", "Severity", "Base Points", "Bonus Points", "Total Bug Points"]];
    participants.forEach(p => {
      if (!p.bugs.length) rows.push([p.name, p.email, p.points, "", "", "", "", "", ""]);
      else p.bugs.forEach(b => rows.push([p.name, p.email, p.points, b.title, b.jiraLink, b.severity, b.basePoints, b.bonusPoints, b.points]));
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv," + encodeURIComponent(csv); a.download = "bugathon.csv"; a.click();
  }

  const medal = i => ["🥇", "🥈", "🥉"][i] ?? `${i + 1}.`;
  const selectedP = participants.find(p => p.id === selectedId);

  return (
    <div style={s.app}>
      {showAdminModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>🔐 Admin Login</h2>
            <p style={{ color: sub, fontSize: 13, marginBottom: 20 }}>Enter the admin password to manage participants.</p>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="Enter password" value={adminInput}
              onChange={e => setAdminInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && tryAdminLogin()} />
            {adminError && <div style={s.error}>{adminError}</div>}
            <div style={{ ...s.row, marginTop: 20 }}>
              <button style={s.btn()} onClick={tryAdminLogin}>Login</button>
              <button style={s.outBtn} onClick={() => { setShowAdminModal(false); setAdminInput(""); setAdminError(""); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={s.header}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff" }}>🐛 Bugathon Leaderboard</h1>
          <div style={{ color: dark ? "#94a3b8" : "#c7d2fe", fontSize: 12, marginTop: 2 }}>
            {participants.length} participants · {participants.reduce((a, p) => a + p.bugs.length, 0)} bugs logged
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button style={s.outBtn} onClick={() => setView("leaderboard")}>🏆 Leaderboard</button>
          <button style={s.outBtn} onClick={exportCSV}>⬇ CSV</button>
          <button style={{ ...s.btn(), background: "#10b981" }} onClick={() => { setBForm(f => ({ ...f, participantId: "" })); setView("addBug"); }}>+ Bug</button>
          {isAdmin
            ? <button style={s.btn()} onClick={() => setView("addParticipant")}>+ Participant</button>
            : <button style={s.btn()} onClick={() => setShowAdminModal(true)}>🔐 Admin</button>}
          <button onClick={() => setDark(d => !d)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 20 }}>{dark ? "☀️" : "🌙"}</button>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 16px" }}>

        {view === "leaderboard" && sorted.map((p, i) => (
          <div key={p.id} style={{ ...s.card, cursor: "pointer", borderLeft: `4px solid ${["#fbbf24", "#94a3b8", "#b45309"][i] ?? border}` }}
            onClick={() => { setSelectedId(p.id); setView("detail"); }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 22, minWidth: 32 }}>{medal(i)}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{p.name}</div>
                  <div style={{ color: sub, fontSize: 12, marginTop: 2 }}>{p.email} · {p.bugs.length} bug{p.bugs.length !== 1 ? "s" : ""}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: accent }}>{p.points}</div>
                <div style={{ color: sub, fontSize: 11 }}>pts</div>
              </div>
            </div>
            {p.bugs.length > 0 && (
              <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {p.bugs.slice(0, 5).map(b => (
                  <span key={b.id} style={s.tag(b.severity)}>
                    {b.severity} +{b.points}pt{b.bonusPoints > 0 ? ` (${b.basePoints}+${b.bonusPoints})` : ""}
                  </span>
                ))}
                {p.bugs.length > 5 && <span style={{ color: sub, fontSize: 11, alignSelf: "center" }}>+{p.bugs.length - 5} more</span>}
              </div>
            )}
          </div>
        ))}

        {view === "addParticipant" && isAdmin && (
          <div style={s.card}>
            <h2 style={{ margin: "0 0 20px", fontSize: 18 }}>➕ Add Participant</h2>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Full Name</label>
              <input style={s.input} placeholder="e.g. Jane Smith" value={pForm.name} onChange={e => setPForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Email</label>
              <input style={s.input} placeholder="jane@example.com" value={pForm.email} onChange={e => setPForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            {pError && <div style={s.error}>{pError}</div>}
            <div style={{ ...s.row, marginTop: 20 }}>
              <button style={s.btn()} onClick={addParticipant}>Add Participant</button>
              <button style={s.outBtn} onClick={() => { setView("leaderboard"); setPError(""); }}>Cancel</button>
            </div>
          </div>
        )}

        {view === "addBug" && (
          <div style={s.card}>
            <h2 style={{ margin: "0 0 20px", fontSize: 18 }}>🐛 Log a Bug</h2>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Participant</label>
              <select style={s.input} value={bForm.participantId} onChange={e => setBForm(f => ({ ...f, participantId: e.target.value }))}>
                <option value="">-- Select participant --</option>
                {participants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Bug Title</label>
              <input style={s.input} placeholder="e.g. Login button unresponsive on mobile" value={bForm.title} onChange={e => setBForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Jira Ticket Link</label>
              <input style={s.input} placeholder="https://yourproject.atlassian.net/browse/BUG-123" value={bForm.jiraLink} onChange={e => setBForm(f => ({ ...f, jiraLink: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Severity</label>
              <select style={s.input} value={bForm.severity} onChange={e => setBForm(f => ({ ...f, severity: e.target.value }))}>
                {Object.entries(SEVERITY_POINTS).map(([k, v]) => <option key={k} value={k}>{k} — {v} pts</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Bonus Points <span style={{ color: sub, fontWeight: 400, textTransform: "none" }}>(optional)</span></label>
              <input style={s.input} type="number" min="0" placeholder="e.g. 2" value={bForm.bonusPoints} onChange={e => setBForm(f => ({ ...f, bonusPoints: e.target.value }))} />
            </div>
            <div style={{ background: dark ? "#0f172a" : "#f1f5f9", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: sub, marginBottom: 6 }}>
              Total: <strong style={{ color: accent, fontSize: 16 }}>{SEVERITY_POINTS[bForm.severity] + (parseInt(bForm.bonusPoints) || 0)}</strong>
              <span style={{ marginLeft: 8 }}>({SEVERITY_POINTS[bForm.severity]} base{parseInt(bForm.bonusPoints) > 0 ? ` + ${parseInt(bForm.bonusPoints)} bonus` : ""})</span>
            </div>
            {bError && <div style={s.error}>{bError}</div>}
            <div style={{ ...s.row, marginTop: 20 }}>
              <button style={{ ...s.btn(), background: "#10b981" }} onClick={addBug}>Log Bug</button>
              <button style={s.outBtn} onClick={() => { setView("leaderboard"); setBError(""); }}>Cancel</button>
            </div>
          </div>
        )}

        {view === "detail" && selectedP && (
          <div>
            <button style={{ ...s.outBtn, marginBottom: 16, color: accent, borderColor: accent }} onClick={() => setView("leaderboard")}>← Back</button>
            <div style={s.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 22 }}>{selectedP.name}</h2>
                  <div style={{ color: sub, marginTop: 4 }}>{selectedP.email}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 36, fontWeight: 800, color: accent }}>{selectedP.points}</div>
                  <div style={{ color: sub, fontSize: 12 }}>total points</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                {Object.keys(SEVERITY_POINTS).map(sev => {
                  const count = selectedP.bugs.filter(b => b.severity === sev).length;
                  return count > 0 ? <span key={sev} style={s.tag(sev)}>{count}× {sev}</span> : null;
                })}
              </div>
              <div style={{ ...s.row, marginTop: 20 }}>
                <button style={{ ...s.btn(), background: "#10b981" }} onClick={() => { setBForm(f => ({ ...f, participantId: selectedP.id, title: "", jiraLink: "", severity: "Medium", bonusPoints: "" })); setView("addBug"); }}>+ Add Bug</button>
                {isAdmin && <button style={{ ...s.btn(), background: "#ef4444" }} onClick={() => deleteParticipant(selectedP.id)}>🗑 Remove</button>}
              </div>
            </div>

            <h3 style={{ margin: "8px 0 12px", fontSize: 13, color: sub, textTransform: "uppercase", letterSpacing: "0.5px" }}>Bugs ({selectedP.bugs.length})</h3>
            {!selectedP.bugs.length && <div style={{ ...s.card, color: sub, textAlign: "center" }}>No bugs logged yet.</div>}
            {selectedP.bugs.map(b => (
              <div key={b.id} style={{ ...s.card, padding: "14px 18px" }}>
                {editBug?.id === b.id ? (
                  <div>
                    <label style={s.label}>Title</label>
                    <input style={{ ...s.input, marginBottom: 10 }} value={editBug.title} onChange={e => setEditBug(eb => ({ ...eb, title: e.target.value }))} />
                    <label style={s.label}>Jira Link</label>
                    <input style={{ ...s.input, marginBottom: 10 }} value={editBug.jiraLink} onChange={e => setEditBug(eb => ({ ...eb, jiraLink: e.target.value }))} />
                    <div style={{ ...s.row, marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <label style={s.label}>Severity</label>
                        <select style={s.input} value={editBug.severity} onChange={e => setEditBug(eb => ({ ...eb, severity: e.target.value }))}>
                          {Object.entries(SEVERITY_POINTS).map(([k, v]) => <option key={k} value={k}>{k} — {v} pts</option>)}
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={s.label}>Bonus Points</label>
                        <input style={s.input} type="number" min="0" placeholder="0" value={editBug.bonusPoints} onChange={e => setEditBug(eb => ({ ...eb, bonusPoints: e.target.value }))} />
                      </div>
                    </div>
                    <div style={{ color: sub, fontSize: 12, marginBottom: 10 }}>
                      Total: <strong style={{ color: accent }}>{SEVERITY_POINTS[editBug.severity] + (parseInt(editBug.bonusPoints) || 0)} pts</strong>
                    </div>
                    <div style={s.row}>
                      <button style={s.btn()} onClick={() => saveEditBug(selectedP.id)}>Save</button>
                      <button style={{ ...s.outBtn, color: accent, borderColor: accent }} onClick={() => setEditBug(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{b.title}</div>
                      {b.jiraLink && <a href={b.jiraLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: accent, textDecoration: "none", display: "inline-block", marginTop: 3 }} onClick={e => e.stopPropagation()}>🔗 {b.jiraLink.length > 50 ? b.jiraLink.slice(0, 50) + "…" : b.jiraLink}</a>}
                      <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                        <span style={s.tag(b.severity)}>{b.severity}</span>
                        {b.bonusPoints > 0 && <span style={{ background: "#6366f122", color: "#818cf8", border: "1px solid #6366f144", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>+{b.bonusPoints} bonus</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 70 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: accent }}>+{b.points}</div>
                      {b.bonusPoints > 0 && <div style={{ color: sub, fontSize: 11 }}>{b.basePoints}+{b.bonusPoints}</div>}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ ...s.btn("#f59e0b"), padding: "6px 12px" }} onClick={() => setEditBug({ ...b, bonusPoints: b.bonusPoints.toString() })}>✏️</button>
                      <button style={{ ...s.btn("#ef4444"), padding: "6px 12px" }} onClick={() => deleteBug(selectedP.id, b)}>🗑</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
