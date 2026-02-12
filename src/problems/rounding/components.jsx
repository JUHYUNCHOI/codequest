import { useState, useRef } from "react";
import { C, t } from "../../theme";
import { CodeBlock, highlight } from "../../components/shared";
import { calcBessie, calcElsie } from "./chapters";

/* ================================================================
   Brute force code arrays (used by CodeCompare3)
   ================================================================ */
const BRUTE_CODE_ORIG = [
  "T = int(input())",
  "for _ in range(T):",
  "  N = int(input())",
  "  count = 0",
  "  for x in range(2, N+1):",
  "    if x >= 10:",
  "      str_x = str(x)",
  "      b = len(str_x)",
  "      bessie = (x // 10**b) * 10**b",
  "      if int(str_x[-(b)]) >= 5:",
  "        bessie += 10**b",
  "      elsie = x",
  "      for position in range(1, b+1):",
  "        str_x = str(elsie)",
  "        if int(str_x[-(position)]) >= 5:",
  "          elsie += 10**position",
  "        elsie = (elsie // 10**position) * 10**position",
  "      if bessie != elsie:",
  "        count += 1",
  "  print(count)",
];

const BRUTE_CODE_CLEAN = [
  "T = int(input())",
  "for _ in range(T):",
  "  N = int(input())",
  "  count = 0",
  "  for x in range(2, N+1):",
  "    if x >= 10:",
  "      b = len(str(x))",
  "      bessie = 0",
  "      if int(str(x)[0]) >= 5:",
  "        bessie = 10**b",
  "      elsie = x",
  "      for pos in range(1, b+1):",
  "        d = (elsie // 10**(pos-1)) % 10",
  "        if d >= 5:",
  "          elsie += 10**pos",
  "        elsie = (elsie//10**pos)*10**pos",
  "      if bessie != elsie:",
  "        count += 1",
  "  print(count)",
];


/* ================================================================
   CodeCompare3 — 3-tab code viewer (pseudo / original / clean)
   ================================================================ */
export function CodeCompare3({ E }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab]   = useState(0);

  const pseudoLines = E ? [
    "for each x from 2 to N:",
    "  if x has 2+ digits:",
    "    b = number of digits",
    "",
    "    # Bessie: check first digit only",
    "    if first digit >= 5:",
    "      bessie = 10^b",
    "    else:",
    "      bessie = 0",
    "",
    "    # Elsie: round step by step",
    "    elsie = x",
    "    for each position 1 to b:",
    "      look at that digit",
    "      if digit >= 5: round up",
    "      zero out that position",
    "",
    "    if bessie != elsie:",
    "      count += 1",
  ] : [
    "x를 2부터 N까지 반복:",
    "  x가 2자리 이상이면:",
    "    b = 자릿수",
    "",
    "    # Bessie: 첫째 자리만 확인",
    "    만약 첫째 자리 >= 5:",
    "      bessie = 10^b",
    "    아니면:",
    "      bessie = 0",
    "",
    "    # Elsie: 순서대로 반올림",
    "    elsie = x",
    "    1번째부터 b번째까지:",
    "      그 자리 숫자를 확인",
    "      만약 >= 5: 올림",
    "      그 자리 이하를 0으로",
    "",
    "    만약 bessie != elsie:",
    "      count += 1",
  ];

  const tabs = [
    { label: t(E, "💭 Pseudo", "💭 의사코드"), lines: pseudoLines,
      note: t(E, "The idea — not real code yet.", "아이디어만 정리 — 아직 코드 아님.") },
    { label: t(E, "📝 Original", "📝 원본"), lines: BRUTE_CODE_ORIG,
      note: t(E, "Passed all 13 USACO test cases! ✅", "USACO 13개 테스트 전부 통과! ✅") },
    { label: t(E, "✨ Cleaned", "✨ 정리"), lines: BRUTE_CODE_CLEAN,
      note: t(E, "Same logic, ~1.5x faster. Math instead of str().", "같은 로직, ~1.5배 빠름. str() 대신 수학 연산.") },
  ];

  return (
    <div style={{ padding: 16 }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", padding: "14px 16px", borderRadius: 12, cursor: "pointer",
        fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        background: open ? "#f8f9fc" : C.accent, color: open ? C.accent : "#fff",
        border: `2px solid ${C.accent}`, transition: "all .2s",
      }}>
        <span>{open ? "▲" : "▼"}</span>{t(E, "Show code (3 versions)", "코드 보기 (3단계)")}
      </button>
      {open && (
        <div style={{ marginTop: 12, animation: "popIn .3s cubic-bezier(.34,1.56,.64,1)" }}>
          <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
            {tabs.map((tb, i) => (
              <button key={i} onClick={() => setTab(i)} style={{
                flex: 1, padding: "7px 0", borderRadius: 8, cursor: "pointer",
                fontSize: 11, fontWeight: 700, border: `2px solid ${tab === i ? C.accent : C.border}`,
                background: tab === i ? C.accentBg : C.card,
                color: tab === i ? C.accent : C.dim,
              }}>{tb.label}</button>
            ))}
          </div>
          <CodeBlock lines={tabs[tab].lines} />
          <div style={{
            marginTop: 8, padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, lineHeight: 1.7,
            background: tab === 0 ? C.accentBg : tab === 1 ? C.carryBg : C.okBg,
            border: `1.5px solid ${tab === 0 ? C.accentBd : tab === 1 ? C.carryBd : C.okBd}`,
            color: tab === 0 ? C.accent : tab === 1 ? C.carry : C.ok,
          }}>{tabs[tab].note}</div>
        </div>
      )}
    </div>
  );
}


/* ================================================================
   BruteRunner — interactive brute force runner
   ================================================================ */
export function BruteRunner({ E }) {
  const [n, setN] = useState(100);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const alive = useRef(false);

  const run = () => {
    const N = Math.min(Math.max(parseInt(n) || 10, 10), 100000);
    setN(N); setRunning(true); setResults(null); setProgress(0);
    alive.current = true;
    const found = []; let idx = 2;
    const tick = () => {
      if (!alive.current) { setRunning(false); return; }
      const end = Math.min(idx + 500, N + 1);
      for (; idx < end; idx++) {
        if (idx >= 10) {
          const b = calcBessie(idx), e = calcElsie(idx);
          if (b !== e) found.push({ x: idx, b, e });
        }
      }
      setProgress(Math.floor((idx - 2) / (N - 1) * 100));
      if (idx > N) { setRunning(false); setResults({ found, total: found.length, N }); alive.current = false; }
      else setTimeout(tick, N > 5000 ? 1 : 16);
    };
    setTimeout(tick, 50);
  };
  const stop = () => { alive.current = false; setRunning(false); };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.dim }}>N =</span>
        <input type="number" value={n} onChange={e => setN(e.target.value)} disabled={running}
          style={{
            width: 80, padding: "8px 10px", borderRadius: 8, border: `2px solid ${C.border}`,
            fontSize: 16, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace",
            color: C.accent, textAlign: "center", outline: "none",
          }} />
        <button onClick={running ? stop : run} style={{
          flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer",
          fontSize: 14, fontWeight: 800, background: running ? C.no : C.accent, color: "#fff",
        }}>
          {running ? t(E, "⏹ Stop", "⏹ 중지") : t(E, "▶ Run", "▶ 실행!")}
        </button>
      </div>

      {running && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", background: C.accent, borderRadius: 3, width: `${progress}%`, transition: "width .1s" }} />
          </div>
          <div style={{ textAlign: "center", fontSize: 11, color: C.dim, marginTop: 4 }}>{progress}%</div>
        </div>
      )}

      {results && (
        <div>
          <div style={{ textAlign: "center", padding: "12px 0", marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: C.dim, fontWeight: 700 }}>{t(E, `2 ~ ${results.N} checked`, `2 ~ ${results.N} 확인 완료`)}</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: C.accent, fontFamily: "'JetBrains Mono',monospace" }}>{results.total}</div>
            <div style={{ fontSize: 12, color: C.dim }}>{t(E, "different results", "개 발견")}</div>
          </div>

          {results.found.length > 0 && (
            <div style={{ maxHeight: 200, overflowY: "auto", borderRadius: 10, border: `1.5px solid ${C.border}` }}>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr", fontSize: 11, fontWeight: 700,
                color: C.dim, padding: "6px 10px", background: "#f8f9fc",
                borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0,
              }}>
                <span>x</span><span>🐄</span><span>🐮</span>
              </div>
              {results.found.slice(0, 50).map((r, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr 1fr", fontSize: 13, fontWeight: 600,
                  padding: "5px 10px", borderBottom: `1px solid ${C.border}`,
                  fontFamily: "'JetBrains Mono',monospace", background: i % 2 === 0 ? "#fff" : "#fafbff",
                }}>
                  <span style={{ color: C.text }}>{r.x}</span>
                  <span style={{ color: C.bessie }}>{r.b}</span>
                  <span style={{ color: C.elsie }}>{r.e}</span>
                </div>
              ))}
              {results.found.length > 50 && (
                <div style={{ textAlign: "center", padding: 8, fontSize: 11, color: C.dim }}>
                  … {t(E, `${results.found.length - 50} more`, `외 ${results.found.length - 50}개`)}
                </div>
              )}
            </div>
          )}

          {results.N >= 5000 && (
            <div style={{ marginTop: 10, padding: "8px 12px", background: C.carryBg, borderRadius: 8, fontSize: 12, color: C.carry, fontWeight: 700, textAlign: "center" }}>
              {t(E, "Feel the slowness? That's why we need O(log N)!", "느려지는 거 느껴져? 이래서 O(log N)이 필요해!")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
