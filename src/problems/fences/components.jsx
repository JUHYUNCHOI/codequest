import { useState, useEffect, useRef, useCallback } from "react";
import { C, t } from "../../theme";

const A = "#059669";
const ABg = "#ecfdf5";
const ABd = "#6ee7b7";

/* ═══════════════════════════════════════════════════════════════
   Preset grids
   ═══════════════════════════════════════════════════════════════ */
const PRESETS = [
  {
    label: "4×5",
    grid: [
      [false,false,false,false,false],
      [false,false,false,true, false],
      [false,true, true, false,false],
      [false,false,false,true, false],
    ],
  },
  {
    label: "3×4",
    grid: [
      [false,true, false,true ],
      [false,false,true, true ],
      [false,true, false,true ],
    ],
  },
  {
    label: "3×3",
    grid: [
      [false,true, false],
      [false,false,false],
      [true, true, false],
    ],
  },
];

function makeRandomGrid(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() > 0.5)
  );
}

/* ═══════════════════════════════════════════════════════════════
   FenceColumnScanner — Animated column-by-column scanner + interactive mode
   ═══════════════════════════════════════════════════════════════ */
export function FenceColumnScanner({ E }) {
  const [grid, setGrid] = useState(PRESETS[0].grid.map(r => [...r]));
  const rows = grid.length;
  const cols = grid[0].length;

  // Phase: "idle" → "scanning" → "colDone" → "scanning" → ... → "done" → "interact"
  const [phase, setPhase] = useState("idle");
  const [scanCol, setScanCol] = useState(-1);
  const [scanRow, setScanRow] = useState(-1);
  const [runningCount, setRunningCount] = useState(0);     // live counter for current column
  const [revealedCounts, setRevealedCounts] = useState([]); // counts revealed so far
  const timerRef = useRef(null);

  // Full column counts (for interact mode and answer)
  const colCounts = Array.from({ length: cols }, (_, c) =>
    grid.reduce((sum, row) => sum + (row[c] ? 0 : 1), 0)
  );
  const minCount = Math.min(...colCounts);

  // Clear any pending timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  // Cleanup on unmount
  useEffect(() => () => clearTimer(), [clearTimer]);

  // ── Animation engine ──
  // Each effect run schedules exactly ONE timer that changes ONE piece of state.
  // The state change triggers re-render → useEffect runs again → next step.
  // Phase "countFlash" briefly shows the dot highlight, then moves to next row.
  const [countFlash, setCountFlash] = useState(false);

  useEffect(() => {
    if (phase !== "scanning") return;

    const schedule = (fn, ms) => {
      clearTimer();
      timerRef.current = setTimeout(fn, ms);
    };

    // 1) Kick off: start at column 0
    if (scanCol < 0) {
      schedule(() => { setScanCol(0); setScanRow(-1); setRunningCount(0); }, 200);
      return;
    }

    // 2) All columns done
    if (scanCol >= cols) {
      setPhase("done");
      setScanCol(-1);
      setScanRow(-1);
      return;
    }

    // 3) Begin a new column: wait, then go to row 0
    if (scanRow === -1) {
      schedule(() => { setScanRow(0); setCountFlash(false); }, 200);
      return;
    }

    // 4) Currently at a cell
    if (scanRow < rows) {
      const isDot = !grid[scanRow][scanCol];

      // If dot and flash hasn't fired yet → flash & count
      if (isDot && !countFlash) {
        schedule(() => {
          setRunningCount(prev => prev + 1);
          setCountFlash(true);
        }, 150);
        return;
      }

      // After flash (or fence cell) → advance to next row or finish column
      const delay = isDot ? 100 : 100;
      if (scanRow < rows - 1) {
        schedule(() => { setScanRow(scanRow + 1); setCountFlash(false); }, delay);
      } else {
        // Column done → reveal count, pause for user to press "next"
        schedule(() => {
          setRevealedCounts(prev => [...prev, colCounts[scanCol]]);
          setRunningCount(0);
          setCountFlash(false);
          setPhase("colDone");
        }, 300);
      }
      return;
    }
  }, [phase, scanCol, scanRow, countFlash, rows, cols, grid, colCounts, clearTimer]);

  // ── Actions ──
  const startScan = () => {
    clearTimer();
    setRevealedCounts([]);
    setRunningCount(0);
    setCountFlash(false);
    setScanCol(-1);
    setScanRow(-1);
    setPhase("scanning");
  };

  const nextCol = () => {
    if (scanCol + 1 >= cols) {
      // All columns done
      setScanRow(-1);
      setScanCol(-1);
      setPhase("done");
    } else {
      setScanRow(-1);
      setScanCol(scanCol + 1);
      setPhase("scanning");
    }
  };

  const goInteract = () => setPhase("interact");

  const resetToIdle = (newGrid) => {
    clearTimer();
    if (newGrid) setGrid(newGrid);
    setPhase("idle");
    setScanCol(-1);
    setScanRow(-1);
    setRevealedCounts([]);
    setRunningCount(0);
  };

  const loadPreset = (idx) => resetToIdle(PRESETS[idx].grid.map(r => [...r]));
  const randomize = () => resetToIdle(makeRandomGrid(rows, cols));

  const toggle = (r, c) => {
    if (phase !== "interact") return;
    const ng = grid.map(row => [...row]);
    ng[r][c] = !ng[r][c];
    setGrid(ng);
  };

  const cellSize = cols <= 5 ? 40 : cols <= 6 ? 36 : 32;

  // ── Cell styling based on phase ──
  const getCellStyle = (r, c, isFence) => {
    const base = {
      width: cellSize, height: cellSize, borderRadius: 6,
      fontSize: cellSize > 34 ? 18 : 14, fontWeight: 900,
      fontFamily: "'JetBrains Mono',monospace",
      transition: "all .15s",
      cursor: phase === "interact" ? "pointer" : "default",
      border: "2px solid",
    };

    // During scanning: highlight active column + active cell
    if (phase === "scanning" && c === scanCol) {
      if (r === scanRow) {
        // Cell being scanned right now
        if (isFence) {
          return { ...base, background: "#4b5563", borderColor: "#9ca3af", color: "#d1d5db",
            boxShadow: "0 0 6px rgba(156,163,175,.4)" };
        }
        return { ...base, background: "#fef3c7", borderColor: "#fbbf24", color: "#92400e",
          boxShadow: "0 0 8px rgba(251,191,36,.5)" };
      }
      if (scanRow >= 0 && r < scanRow) {
        // Already scanned in this column
        if (isFence) {
          return { ...base, background: "#374151", borderColor: "#6b7280", color: "#9ca3af" };
        }
        return { ...base, background: "#d1fae5", borderColor: A, color: "#065f46" };
      }
      // In active column but not yet scanned
      return {
        ...base,
        background: isFence ? "#374151" : "#bbf7d0",
        borderColor: A,
        color: isFence ? "#fff" : "#166534",
        boxShadow: "0 0 6px rgba(5,150,105,.3)",
      };
    }

    // colDone phase: just-finished column stays highlighted
    if (phase === "colDone" && c === scanCol) {
      return {
        ...base,
        background: isFence ? "#374151" : "#d1fae5",
        borderColor: A,
        color: isFence ? "#fff" : "#065f46",
        boxShadow: "0 0 6px rgba(5,150,105,.3)",
      };
    }

    // Done phase: highlight min column strongly, dim everything else
    if (phase === "done") {
      const isMinCol = colCounts[c] === minCount;
      if (isMinCol) {
        return {
          ...base,
          background: isFence ? "#065f46" : "#6ee7b7",
          borderColor: "#059669",
          color: isFence ? "#a7f3d0" : "#065f46",
          boxShadow: "0 0 12px rgba(5,150,105,.5)",
          transform: "scale(1.08)",
        };
      }
      return {
        ...base,
        background: isFence ? "#1f2937" : "#e5e7eb",
        borderColor: isFence ? "#374151" : "#d1d5db",
        color: isFence ? "#6b7280" : "#9ca3af",
        opacity: 0.5,
      };
    }

    // Interact mode: highlight min column
    if (phase === "interact") {
      const isMinCol = colCounts[c] === minCount;
      return {
        ...base,
        background: isFence ? "#374151" : "#bbf7d0",
        borderColor: isMinCol ? A : isFence ? "#6b7280" : "#86efac",
        color: isFence ? "#fff" : "#166534",
      };
    }

    // Idle: plain
    return {
      ...base,
      background: isFence ? "#374151" : "#bbf7d0",
      borderColor: isFence ? "#6b7280" : "#86efac",
      color: isFence ? "#fff" : "#166534",
    };
  };

  return (
    <div style={{ padding: "12px 8px" }}>
      {/* Presets */}
      <div style={{ display: "flex", gap: 4, marginBottom: 10, justifyContent: "center", flexWrap: "wrap" }}>
        {PRESETS.map((p, i) => (
          <button key={i} onClick={() => loadPreset(i)} style={{
            padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
            border: `1.5px solid ${C.border}`, background: C.card,
            color: C.dim, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace",
          }}>{p.label}</button>
        ))}
        <button onClick={randomize} style={{
          padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
          border: `1.5px solid ${ABd}`, background: ABg,
          color: A, cursor: "pointer",
        }}>🎲 {E ? "Random" : "랜덤"}</button>
      </div>

      {/* Column headers */}
      <div style={{ display: "flex", justifyContent: "center", gap: 3, marginBottom: 2 }}>
        {Array.from({ length: cols }, (_, c) => {
          const isActive = (phase === "scanning" && c === scanCol) || (phase === "colDone" && c === scanCol);
          const isDone = c < revealedCounts.length && !isActive;
          const isMinDone = (phase === "done" || phase === "interact") && colCounts[c] === minCount;
          const isDimmed = phase === "done" && !isMinDone;
          return (
            <div key={c} style={{
              width: cellSize, textAlign: "center", fontSize: isMinDone ? 11 : 10, fontWeight: 800,
              fontFamily: "'JetBrains Mono',monospace",
              color: isActive ? "#fff" : isMinDone ? "#fff" : isDimmed ? "#d1d5db" : isDone ? C.dim : C.dimLight,
              background: isActive ? A : isMinDone ? A : "transparent",
              borderRadius: 4, padding: "2px 0",
              transition: "all .2s",
              opacity: isDimmed ? 0.5 : 1,
            }}>
              {E ? `C${c + 1}` : `${c + 1}열`}
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginBottom: 8 }}>
        {grid.map((row, r) => (
          <div key={r} style={{ display: "flex", gap: 3 }}>
            {row.map((isFence, c) => (
              <button key={c} onClick={() => toggle(r, c)}
                style={getCellStyle(r, c, isFence)}>
                {isFence ? "#" : "."}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Scanning: live counter for current column */}
      {phase === "scanning" && scanCol >= 0 && scanCol < cols && scanRow >= 0 && (
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: A, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>
            {E ? `Column ${scanCol + 1}: ` : `${scanCol + 1}번째 열: `}
          </span>
          <span style={{ fontSize: 14, color: "#92400e", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace" }}>
            {E ? `${runningCount} dot${runningCount !== 1 ? "s" : ""}` : `점 ${runningCount}개`}
          </span>
        </div>
      )}

      {/* Column counts — revealed one by one during scan, or all in interact/done */}
      <div style={{ display: "flex", justifyContent: "center", gap: 3, marginBottom: 12, minHeight: cellSize + 8 }}>
        {Array.from({ length: cols }, (_, c) => {
          const isRevealed = phase === "interact" || phase === "done" || c < revealedCounts.length;
          const cnt = phase === "interact" ? colCounts[c] : (c < revealedCounts.length ? revealedCounts[c] : null);
          const finalMin = phase === "done" || phase === "interact" ? minCount : null;
          const isMin = cnt !== null && finalMin !== null && cnt === finalMin;

          const isDimmedCount = (phase === "done") && !isMin;
          return (
            <div key={c} style={{
              width: cellSize, textAlign: "center", padding: isMin && phase === "done" ? "6px 0" : "4px 0", borderRadius: 8,
              fontSize: isMin && phase === "done" ? 18 : 14, fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
              background: isMin ? (phase === "done" ? A : ABg) : isRevealed ? "#f8f9fc" : "transparent",
              border: `2px solid ${isMin ? (phase === "done" ? A : ABd) : isRevealed ? C.border : "transparent"}`,
              color: isMin ? (phase === "done" ? "#fff" : A) : isRevealed ? C.dim : "transparent",
              transition: "all .2s",
              opacity: isDimmedCount ? 0.4 : 1,
              transform: isMin && phase === "done" ? "scale(1.1)" : "none",
              boxShadow: isMin && phase === "done" ? "0 0 10px rgba(5,150,105,.4)" : "none",
            }}>{isRevealed && cnt !== null ? cnt : "\u00A0"}</div>
          );
        })}
      </div>

      {/* Phase-specific bottom area */}
      {phase === "idle" && (
        <div style={{ textAlign: "center" }}>
          <button onClick={startScan} style={{
            padding: "10px 28px", borderRadius: 12, fontSize: 15, fontWeight: 900,
            border: "none", cursor: "pointer", color: "#fff",
            background: "linear-gradient(135deg,#047857,#059669)",
            boxShadow: "0 4px 16px rgba(5,150,105,.3)",
          }}>▶ {E ? "Scan columns!" : "열별로 스캔!"}</button>
          <div style={{ fontSize: 11, color: C.dim, marginTop: 6 }}>
            {E ? "Watch how we count dots in each column" : "각 열의 점을 어떻게 세는지 봐봐"}
          </div>
        </div>
      )}

      {phase === "colDone" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, color: A, fontWeight: 800, marginBottom: 8, fontFamily: "'JetBrains Mono',monospace" }}>
            {E ? `Column ${scanCol + 1} → ${colCounts[scanCol]} dot${colCounts[scanCol] !== 1 ? "s" : ""} ✓` : `${scanCol + 1}열 → 점 ${colCounts[scanCol]}개 ✓`}
          </div>
          <button onClick={nextCol} style={{
            padding: "8px 24px", borderRadius: 10, fontSize: 14, fontWeight: 900,
            border: "none", cursor: "pointer", color: "#fff",
            background: scanCol + 1 >= cols ? "linear-gradient(135deg,#047857,#059669)" : A,
            boxShadow: "0 3px 12px rgba(5,150,105,.3)",
          }}>
            {scanCol + 1 >= cols
              ? (E ? "🎯 See result!" : "🎯 결과 보기!")
              : (E ? `Next → Column ${scanCol + 2}` : `다음 → ${scanCol + 2}열`)}
          </button>
        </div>
      )}

      {phase === "done" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12, color: C.dim, fontWeight: 700, marginBottom: 4 }}>
            {E ? "Answer (minimum)" : "답 (최솟값)"}
          </div>
          <div style={{
            display: "inline-block", padding: "8px 28px", borderRadius: 12,
            background: "linear-gradient(135deg,#047857,#059669)",
            fontSize: 32, fontWeight: 900, color: "#fff",
            fontFamily: "'JetBrains Mono',monospace",
            boxShadow: "0 4px 16px rgba(5,150,105,.3)",
            animation: "popIn .3s ease",
          }}>{minCount}</div>
          <div style={{ marginTop: 10 }}>
            <button onClick={goInteract} style={{
              padding: "8px 20px", borderRadius: 10, fontSize: 13, fontWeight: 800,
              border: `2px solid ${ABd}`, background: ABg,
              color: A, cursor: "pointer",
            }}>🖱️ {E ? "Try it yourself!" : "직접 해봐!"}</button>
          </div>
        </div>
      )}

      {phase === "interact" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12, color: C.dim, fontWeight: 700, marginBottom: 4 }}>
            {E ? "Answer (minimum)" : "답 (최솟값)"}
          </div>
          <div style={{
            display: "inline-block", padding: "8px 28px", borderRadius: 12,
            background: "linear-gradient(135deg,#047857,#059669)",
            fontSize: 32, fontWeight: 900, color: "#fff",
            fontFamily: "'JetBrains Mono',monospace",
            boxShadow: "0 4px 16px rgba(5,150,105,.3)",
          }}>{minCount}</div>
          <div style={{ marginTop: 8, fontSize: 11, color: C.dim }}>
            {E ? "Click cells to toggle! Try different grids." : "셀을 클릭해서 바꿔봐! 다른 그리드도 해봐."}
          </div>
          <div style={{ marginTop: 6 }}>
            <button onClick={() => resetToIdle(null)} style={{
              padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700,
              border: `1.5px solid ${C.border}`, background: C.card,
              color: C.dim, cursor: "pointer",
            }}>🔄 {E ? "Watch again" : "다시 보기"}</button>
          </div>
        </div>
      )}

    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   RowColumnFillViz — Step-by-step visualization of row-first loop
   filling column counters
   ═══════════════════════════════════════════════════════════════ */

const GRID_DATA = [".#.", "..#", ".#."];
const GRID_ROWS = GRID_DATA.length;
const GRID_COLS = GRID_DATA[0].length;

// Pre-compute all steps
// Step types: "init" | "readRow" | "checkCell" | "done"
function buildSteps() {
  const steps = [];
  const counts = [0, 0, 0];

  // Step 0: initial state
  steps.push({ type: "init", counts: [...counts], i: -1, j: -1, codeLine: -1 });

  for (let i = 0; i < GRID_ROWS; i++) {
    // Read row step
    steps.push({ type: "readRow", i, j: -1, counts: [...counts], codeLine: 0 });

    for (let j = 0; j < GRID_COLS; j++) {
      const ch = GRID_DATA[i][j];
      const isDot = ch === ".";
      if (isDot) counts[j] += 1;
      steps.push({
        type: "checkCell", i, j, ch, isDot,
        counts: [...counts],
        codeLine: isDot ? 2 : 1,
      });
    }
  }

  // Final step
  const minVal = Math.min(...counts);
  steps.push({ type: "done", i: -1, j: -1, counts: [...counts], codeLine: 3, minVal });

  return steps;
}

const ALL_STEPS = buildSteps();

// Code lines shown in the viz
const VIZ_CODE = [
  "for i in range(N):",
  "    row = input()",
  "    for j in range(M):",
  "        if row[j]=='.': count[j]+=1",
  "print(min(count))",
];

export function RowColumnFillViz({ E }) {
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const timerRef = useRef(null);
  const [flashCol, setFlashCol] = useState(-1);

  const cur = ALL_STEPS[step];
  const isDone = step >= ALL_STEPS.length - 1;

  // Track which counter just changed for flash effect
  useEffect(() => {
    if (step === 0) { setFlashCol(-1); return; }
    const prev = ALL_STEPS[Math.max(0, step - 1)];
    const now = ALL_STEPS[step];
    for (let c = 0; c < GRID_COLS; c++) {
      if (now.counts[c] !== prev.counts[c]) {
        setFlashCol(c);
        const t = setTimeout(() => setFlashCol(-1), 400);
        return () => clearTimeout(t);
      }
    }
    setFlashCol(-1);
  }, [step]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || isDone) {
      if (timerRef.current) clearInterval(timerRef.current);
      setAutoPlay(false);
      return;
    }
    timerRef.current = setInterval(() => {
      setStep(s => {
        if (s >= ALL_STEPS.length - 1) { setAutoPlay(false); return s; }
        return s + 1;
      });
    }, 500);
    return () => clearInterval(timerRef.current);
  }, [autoPlay, isDone]);

  const next = () => { if (!isDone) setStep(s => s + 1); };
  const reset = () => { setStep(0); setAutoPlay(false); setFlashCol(-1); };
  const play = () => { if (!isDone) setAutoPlay(true); };

  // Min value for final highlight
  const finalMin = cur.type === "done" ? cur.minVal : null;

  return (
    <div style={{ padding: "10px 6px" }}>
      {/* Variable state display */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 12, marginBottom: 8,
        fontSize: 12, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace",
      }}>
        {cur.i >= 0 && (
          <span style={{
            background: "#ecfdf5", border: "1.5px solid #6ee7b7",
            borderRadius: 6, padding: "2px 8px", color: A,
          }}>i={cur.i}</span>
        )}
        {cur.j >= 0 && (
          <span style={{
            background: "#fef3c7", border: "1.5px solid #fbbf24",
            borderRadius: 6, padding: "2px 8px", color: "#92400e",
          }}>j={cur.j}</span>
        )}
        {cur.type === "checkCell" && (
          <span style={{
            background: cur.isDot ? "#d1fae5" : "#fee2e2",
            border: `1.5px solid ${cur.isDot ? "#6ee7b7" : "#fca5a5"}`,
            borderRadius: 6, padding: "2px 8px",
            color: cur.isDot ? "#059669" : "#dc2626",
          }}>
            row[{cur.j}]='{cur.ch}' {cur.isDot ? "→ +1" : "→ skip"}
          </span>
        )}
      </div>

      {/* Code section */}
      <div style={{
        background: "#1e293b", borderRadius: 10, padding: "6px 4px",
        marginBottom: 10, fontSize: 11, lineHeight: 1.7,
        fontFamily: "'JetBrains Mono',monospace",
      }}>
        {VIZ_CODE.map((line, idx) => {
          const isActive = cur.codeLine === idx ||
            (cur.type === "readRow" && idx === 1) ||
            (cur.type === "checkCell" && (idx === 2 || idx === 3));

          // More specific highlighting
          let highlighted = false;
          if (cur.type === "readRow" && idx === 1) highlighted = true;
          if (cur.type === "checkCell" && idx === 3) highlighted = true;
          if (cur.type === "done" && idx === 4) highlighted = true;
          // outer for when reading row
          if (cur.type === "readRow" && idx === 0) highlighted = true;
          // inner for when checking cell
          if (cur.type === "checkCell" && idx === 2) highlighted = true;

          return (
            <div key={idx} style={{
              display: "flex", alignItems: "center", minHeight: 18,
              background: highlighted ? "rgba(5,150,105,.18)" : "transparent",
              borderRadius: 4, padding: "0 4px",
              transition: "background .15s",
            }}>
              <span style={{
                width: 14, fontSize: 9, color: highlighted ? "#6ee7b7" : "transparent",
                flexShrink: 0, textAlign: "center",
              }}>{highlighted ? "►" : ""}</span>
              <span style={{
                whiteSpace: "pre",
                color: highlighted ? "#6ee7b7" : "#94a3b8",
                fontWeight: highlighted ? 700 : 400,
                transition: "color .15s",
              }}>{line}</span>
            </div>
          );
        })}
      </div>

      {/* Grid with column headers and counts */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Column headers */}
        <div style={{ display: "flex", gap: 4, marginBottom: 2 }}>
          <div style={{ width: 28 }} /> {/* spacer for row labels */}
          {Array.from({ length: GRID_COLS }, (_, c) => (
            <div key={c} style={{
              width: 40, textAlign: "center", fontSize: 10, fontWeight: 800,
              fontFamily: "'JetBrains Mono',monospace",
              color: (cur.type === "checkCell" && cur.j === c) ? "#fff" : "#9ca3af",
              background: (cur.type === "checkCell" && cur.j === c) ? A : "transparent",
              borderRadius: 4, padding: "1px 0",
              transition: "all .15s",
            }}>{E ? `C${c + 1}` : `${c + 1}열`}</div>
          ))}
        </div>

        {/* Grid rows */}
        {GRID_DATA.map((rowStr, r) => {
          const isActiveRow = cur.i === r;
          const isPastRow = cur.i > r || cur.type === "done";
          return (
            <div key={r} style={{
              display: "flex", gap: 4, marginBottom: 4, alignItems: "center",
              opacity: (!isActiveRow && !isPastRow && cur.type !== "init") ? 0.35 : 1,
              transition: "opacity .2s",
            }}>
              {/* Row label */}
              <div style={{
                width: 28, fontSize: 9, fontWeight: 700, textAlign: "right",
                fontFamily: "'JetBrains Mono',monospace",
                color: isActiveRow ? A : "#d1d5db",
                paddingRight: 4,
              }}>{E ? `R${r + 1}` : `${r + 1}행`}</div>

              {/* Cells */}
              {rowStr.split("").map((ch, c) => {
                const isFence = ch === "#";
                const isCurrentCell = cur.type === "checkCell" && cur.i === r && cur.j === c;
                const wasChecked = cur.type === "checkCell" && cur.i === r && cur.j > c;
                const wasCheckedPrevRow = (cur.i > r) || (cur.type === "done");

                // Determine cell style
                let bg = isFence ? "#374151" : "#bbf7d0";
                let border = isFence ? "#6b7280" : "#86efac";
                let color = isFence ? "#fff" : "#166534";
                let shadow = "none";
                let transform = "none";

                if (isCurrentCell) {
                  if (isFence) {
                    bg = "#fee2e2"; border = "#f87171"; color = "#991b1b";
                    shadow = "0 0 8px rgba(248,113,113,.5)";
                  } else {
                    bg = "#fef3c7"; border = "#fbbf24"; color = "#92400e";
                    shadow = "0 0 8px rgba(251,191,36,.5)";
                    transform = "scale(1.08)";
                  }
                } else if (wasChecked || wasCheckedPrevRow) {
                  // Already processed cells: slightly dimmed
                  if (isFence) {
                    bg = "#1f2937"; border = "#4b5563"; color = "#6b7280";
                  } else {
                    bg = "#d1fae5"; border = "#6ee7b7"; color = "#065f46";
                  }
                }

                // Done phase: highlight min columns
                if (cur.type === "done") {
                  const isMinCol = cur.counts[c] === cur.minVal;
                  if (isMinCol) {
                    bg = isFence ? "#065f46" : "#6ee7b7";
                    border = "#059669";
                    shadow = "0 0 10px rgba(5,150,105,.4)";
                    transform = "scale(1.06)";
                  } else {
                    bg = isFence ? "#1f2937" : "#e5e7eb";
                    border = isFence ? "#374151" : "#d1d5db";
                    color = "#9ca3af";
                  }
                }

                return (
                  <div key={c} style={{
                    width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: 6, fontSize: 18, fontWeight: 900,
                    fontFamily: "'JetBrains Mono',monospace",
                    background: bg, border: `2.5px solid ${border}`, color,
                    boxShadow: shadow, transform,
                    transition: "all .2s",
                  }}>{ch}</div>
                );
              })}
            </div>
          );
        })}

        {/* Separator */}
        <div style={{
          width: 28 + GRID_COLS * 44, height: 2,
          background: `linear-gradient(90deg, transparent 28px, ${A} 28px)`,
          marginTop: 4, marginBottom: 4, borderRadius: 1,
        }} />

        {/* Count array */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <div style={{
            width: 28, fontSize: 8, fontWeight: 700, textAlign: "right",
            fontFamily: "'JetBrains Mono',monospace",
            color: A, paddingRight: 4,
          }}>count</div>
          {cur.counts.map((cnt, c) => {
            const isFlashing = flashCol === c;
            const isMin = finalMin !== null && cnt === finalMin;
            return (
              <div key={c} style={{
                width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 8, fontSize: isMin ? 18 : 15, fontWeight: 900,
                fontFamily: "'JetBrains Mono',monospace",
                background: isMin ? A : isFlashing ? "#d1fae5" : "#f0fdf4",
                border: `2.5px solid ${isMin ? A : isFlashing ? A : "#d1d5db"}`,
                color: isMin ? "#fff" : isFlashing ? "#059669" : "#374151",
                transform: isFlashing ? "scale(1.15)" : isMin ? "scale(1.08)" : "none",
                boxShadow: isFlashing ? "0 0 12px rgba(5,150,105,.4)" : isMin ? "0 0 10px rgba(5,150,105,.4)" : "none",
                transition: "all .2s",
              }}>{cnt}</div>
            );
          })}
        </div>

        {/* Done result */}
        {cur.type === "done" && (
          <div style={{
            marginTop: 10, textAlign: "center",
            animation: "popIn .3s ease",
          }}>
            <div style={{ fontSize: 12, color: C.dim, fontWeight: 700, marginBottom: 4 }}>
              min([{cur.counts.join(", ")}])
            </div>
            <div style={{
              display: "inline-block", padding: "6px 20px", borderRadius: 10,
              background: "linear-gradient(135deg,#047857,#059669)",
              fontSize: 24, fontWeight: 900, color: "#fff",
              fontFamily: "'JetBrains Mono',monospace",
              boxShadow: "0 3px 12px rgba(5,150,105,.3)",
            }}>= {cur.minVal}</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
        {!isDone ? (
          <>
            <button onClick={next} style={{
              padding: "8px 20px", borderRadius: 10, fontSize: 13, fontWeight: 900,
              border: "none", cursor: "pointer", color: "#fff",
              background: "linear-gradient(135deg,#047857,#059669)",
              boxShadow: "0 3px 12px rgba(5,150,105,.3)",
            }}>▶ {E ? "Next step" : "다음 스텝"}</button>
            {!autoPlay ? (
              <button onClick={play} style={{
                padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 800,
                border: `1.5px solid ${ABd}`, background: ABg,
                color: A, cursor: "pointer",
              }}>⏭ {E ? "Auto" : "자동"}</button>
            ) : (
              <button onClick={() => setAutoPlay(false)} style={{
                padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 800,
                border: "1.5px solid #fca5a5", background: "#fee2e2",
                color: "#dc2626", cursor: "pointer",
              }}>⏸ {E ? "Pause" : "멈춤"}</button>
            )}
          </>
        ) : (
          <button onClick={reset} style={{
            padding: "8px 20px", borderRadius: 10, fontSize: 13, fontWeight: 900,
            border: `2px solid ${ABd}`, background: ABg,
            color: A, cursor: "pointer",
          }}>↺ {E ? "Restart" : "처음부터"}</button>
        )}
        {step > 0 && !isDone && (
          <button onClick={reset} style={{
            padding: "8px 12px", borderRadius: 10, fontSize: 11, fontWeight: 700,
            border: `1.5px solid ${C.border}`, background: C.card,
            color: C.dim, cursor: "pointer",
          }}>↺</button>
        )}
      </div>

      {/* Step counter */}
      <div style={{
        textAlign: "center", marginTop: 6, fontSize: 10, color: C.dim,
        fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
      }}>
        {step}/{ALL_STEPS.length - 1}
      </div>
    </div>
  );
}
