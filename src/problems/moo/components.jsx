import { useState } from "react";
import { C, t } from "../../theme";
import { isMoo, findAllMoos, bruteSolve } from "./chapters";

/* ═══════════════════════════════════════════════════════════════
   MooSim — Interactive moo pattern finder
   ═══════════════════════════════════════════════════════════════ */
export function MooSim({ E }) {
  const PRESETS = ["zzmoozzmoo", "momoobaaaaaqqqcqq", "ooo", "aabbcc"];
  const [str, setStr] = useState("zzmoozzmoo");
  const [editPos, setEditPos] = useState(null);

  const arr = str.split("");
  const moos = findAllMoos(arr);
  const mooList = Object.entries(moos).sort((a, b) => b[1] - a[1]);

  const highlights = new Set();
  for (let i = 0; i <= arr.length - 3; i++) {
    if (isMoo(arr[i], arr[i + 1], arr[i + 2])) {
      highlights.add(i); highlights.add(i + 1); highlights.add(i + 2);
    }
  }

  const applyEdit = (c) => {
    if (c.length === 1 && /[a-z]/.test(c)) {
      const newArr = [...arr]; newArr[editPos] = c; setStr(newArr.join(""));
    }
    setEditPos(null);
  };

  return (
    <div style={{ padding: "12px 8px" }}>
      {/* Presets */}
      <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap", justifyContent: "center" }}>
        {PRESETS.map((p, i) => (
          <button key={i} onClick={() => { setStr(p); setEditPos(null); }}
            style={{
              padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700,
              border: `1.5px solid ${str === p ? C.accent : C.border}`,
              background: str === p ? C.accentBg : C.card,
              color: str === p ? C.accent : C.dim, cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace",
            }}>
            {p.length > 10 ? p.slice(0, 8) + "\u2026" : p}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, justifyContent: "center" }}>
        <input value={str}
          onChange={e => { setStr(e.target.value.replace(/[^a-z]/g, "")); setEditPos(null); }}
          placeholder={E ? "type lowercase letters" : "\uc18c\ubb38\uc790 \uc785\ub825"}
          style={{
            flex: 1, maxWidth: 240, padding: "6px 10px", borderRadius: 8,
            border: `2px solid ${C.border}`, fontSize: 13,
            fontFamily: "'JetBrains Mono',monospace",
          }} />
      </div>

      {/* Clickable characters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", marginBottom: 12, padding: "0 4px" }}>
        {arr.map((ch, i) => (
          <div key={i} style={{ position: "relative" }}>
            <button onClick={() => setEditPos(i)} style={{
              width: 26, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 5, cursor: "pointer", fontSize: 14, fontWeight: 800,
              fontFamily: "'JetBrains Mono',monospace",
              background: editPos === i ? "#fde68a" : highlights.has(i) ? C.accentBg : "#f8f9fc",
              border: `2px solid ${editPos === i ? "#f59e0b" : highlights.has(i) ? C.accentBd : C.border}`,
              color: editPos === i ? "#92400e" : highlights.has(i) ? C.accent : C.text,
            }}>{ch}</button>
            <div style={{ fontSize: 8, textAlign: "center", color: C.dimLight, marginTop: 1 }}>{i}</div>
          </div>
        ))}
      </div>

      {/* Edit picker */}
      {editPos !== null && (
        <div style={{
          background: "#fffbeb", border: "2px solid #fde68a", borderRadius: 10,
          padding: "10px 14px", marginBottom: 12, textAlign: "center",
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 6 }}>
            {t(E, `Change position ${editPos} (${arr[editPos]}):`, `\uc704\uce58 ${editPos} (${arr[editPos]}) \ubc14\uafb8\uae30:`)}
          </div>
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center" }}>
            {"abcdefghijklmnopqrstuvwxyz".split("").map(c => (
              <button key={c} onClick={() => applyEdit(c)} style={{
                width: 24, height: 26, borderRadius: 4, fontSize: 12, fontWeight: 800,
                border: `1.5px solid ${c === arr[editPos] ? C.accent : C.border}`,
                background: c === arr[editPos] ? C.accentBg : "#fff",
                color: c === arr[editPos] ? C.accent : C.text,
                cursor: "pointer", fontFamily: "'JetBrains Mono',monospace",
              }}>{c}</button>
            ))}
          </div>
        </div>
      )}

      {/* Moo list */}
      <div style={{ background: C.card, borderRadius: 10, border: `1.5px solid ${C.border}`, padding: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 6 }}>
          {t(E, `Moos found: ${mooList.length}`, `\ubc1c\uacac\ub41c Moo: ${mooList.length}\uac1c`)}
        </div>
        {mooList.length === 0 ? (
          <div style={{ fontSize: 12, color: C.dim }}>
            {t(E, "No moo patterns in this string.", "\uc774 \ubb38\uc790\uc5f4\uc5d0 moo \ud328\ud134\uc774 \uc5c6\uc5b4.")}
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {mooList.map(([key, count]) => (
              <div key={key} style={{
                padding: "4px 10px", borderRadius: 8,
                background: count >= 2 ? C.okBg : C.accentBg,
                border: `1.5px solid ${count >= 2 ? C.okBd : C.accentBd}`,
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 13, fontWeight: 700,
                color: count >= 2 ? C.ok : C.accent,
              }}>
                {key} ×{count}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   MooBruteRunner
   ═══════════════════════════════════════════════════════════════ */
export function MooBruteRunner({ E }) {
  const [N, setN] = useState(50);
  const [F, setF] = useState(2);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  const run = () => {
    if (N < 3 || N > 5000) return;
    setRunning(true); setResult(null);
    setTimeout(() => {
      const chars = "abcdefghij";
      let s = "";
      for (let i = 0; i < N; i++) s += chars[Math.floor(Math.random() * chars.length)];
      const t0 = performance.now();
      const res = bruteSolve(s, F);
      const ms = performance.now() - t0;
      setElapsed(ms);
      setResult({ count: res.length, sample: res.slice(0, 5) });
      setRunning(false);
    }, 50);
  };

  return (
    <div style={{ padding: "12px 8px" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", marginBottom: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.dim }}>N =</span>
        <input type="number" min={3} max={5000} value={N}
          onChange={e => { setN(+e.target.value); setResult(null); }}
          style={{ width: 70, padding: "6px 8px", borderRadius: 8, border: `2px solid ${C.border}`,
            fontSize: 16, fontWeight: 800, textAlign: "center", fontFamily: "'JetBrains Mono',monospace" }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: C.dim }}>F =</span>
        <input type="number" min={1} max={100} value={F}
          onChange={e => { setF(+e.target.value); setResult(null); }}
          style={{ width: 50, padding: "6px 8px", borderRadius: 8, border: `2px solid ${C.border}`,
            fontSize: 16, fontWeight: 800, textAlign: "center", fontFamily: "'JetBrains Mono',monospace" }} />
      </div>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <button onClick={run} disabled={running || N < 3 || N > 5000} style={{
          padding: "8px 24px", borderRadius: 10, border: "none",
          background: running ? "#e5e7eb" : "linear-gradient(135deg,#818cf8,#6366f1)",
          color: "#fff", fontSize: 14, fontWeight: 800, cursor: running ? "default" : "pointer",
        }}>{running ? "\u23f3 ..." : E ? "Run Brute!" : "\ube0c\ub8e8\ud2b8 \uc2e4\ud589!"}</button>
      </div>
      {N > 500 && <div style={{ textAlign: "center", fontSize: 12, color: C.carry, fontWeight: 700, marginBottom: 8 }}>
        {E ? "\u26a0\ufe0f N>500 may be slow!" : "\u26a0\ufe0f N>500\uc774\uba74 \ub290\ub9b4 \uc218 \uc788\uc5b4!"}
      </div>}
      {result && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, color: C.dim, marginBottom: 4 }}>
            {E ? `Found ${result.count} moos in` : `${result.count}\uac1c moo \ubc1c\uacac \u2192`}{" "}
            <span style={{ fontWeight: 800, color: elapsed > 200 ? C.no : elapsed > 50 ? C.carry : C.ok }}>
              {elapsed < 1000 ? `${elapsed.toFixed(1)}ms` : `${(elapsed / 1000).toFixed(1)}s`}
            </span>
          </div>
          {result.sample.length > 0 && (
            <div style={{ fontSize: 11, color: C.dim, fontFamily: "'JetBrains Mono',monospace" }}>
              {result.sample.join(", ")}{result.count > 5 ? "\u2026" : ""}
            </div>
          )}
          {elapsed > 200 && (
            <div style={{ marginTop: 6, fontSize: 12, color: C.no, fontWeight: 700 }}>
              {E ? "Imagine N=20,000 with brute force... \ud83d\udc80" : "N=20,000\uc744 \ube0c\ub8e8\ud2b8\ud3ec\uc2a4\ub85c... \ud83d\udc80"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
