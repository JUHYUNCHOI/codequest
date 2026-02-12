import { useState, useEffect, useRef } from "react";
import { C, t } from "../../theme";

export function Cube3D({ N, carved, E }) {
  const [rotX, setRotX] = useState(-30);
  const [rotY, setRotY] = useState(40);
  const dragRef = useRef(null);

  const onPD = (e) => {
    e.preventDefault();
    dragRef.current = { x: e.clientX, y: e.clientY, rx: rotX, ry: rotY };
  };

  useEffect(() => {
    const mv = (e) => {
      if (!dragRef.current) return;
      setRotY(dragRef.current.ry + (e.clientX - dragRef.current.x) * 0.5);
      setRotX(Math.max(-80, Math.min(10, dragRef.current.rx - (e.clientY - dragRef.current.y) * 0.5)));
    };
    const up = () => { dragRef.current = null; };
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
  }, []);

  const S = 52, gap = 3, unit = S + gap, half = S / 2;
  const total = N * unit;
  const isC = (x, y, z) => carved.some(c => c[0] === x && c[1] === y && c[2] === z);

  const cells = [];
  for (let x = 0; x < N; x++)
    for (let y = 0; y < N; y++)
      for (let z = 0; z < N; z++)
        cells.push([x, y, z]);

  // Label shown on all 6 faces
  const mkLabel = (x, y, z, color) => (
    <span style={{
      fontSize: 10, fontWeight: 700,
      fontFamily: "'JetBrains Mono',monospace",
      color, pointerEvents: "none",
    }}>{x},{y},{z}</span>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 8 }}>
      <div onPointerDown={onPD} style={{
        perspective: 600, width: total * 2.4, height: total * 2.4,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "grab", touchAction: "none",
      }}>
        <div style={{
          width: total, height: total, position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        }}>
          {cells.map(([x, y, z], i) => {
            if (isC(x, y, z)) return null;

            // Mapping: x→CSS-X, y→CSS-Z(depth), z→CSS-Y(up, flipped)
            const cx = x * unit + half;
            const cy = (N - 1 - z) * unit + half;
            const cz = y * unit + half;

            const topC = "#fde047", frC = "#eab308", sideC = "#ca8a04";
            const brd = "1px solid rgba(120,80,0,0.25)", txtC = "#78510a";

            const lbl = mkLabel(x, y, z, txtC);

            // Each face: S×S div, centered on the cube via wrapper translate3d
            // Then offset from center by ±half in the appropriate axis
            const face = (bg, transform) => (
              <div style={{
                position: "absolute", width: S, height: S,
                left: -half, top: -half,
                background: bg, border: brd, borderRadius: 2,
                display: "flex", alignItems: "center", justifyContent: "center",
                backfaceVisibility: "hidden",
                transform,
              }}>{lbl}</div>
            );

            return (
              <div key={i} style={{
                position: "absolute",
                transformStyle: "preserve-3d",
                // Move wrapper to the CENTER of this unit cube in 3D space
                transform: `translate3d(${cx}px, ${cy}px, ${cz}px)`,
              }}>
                {face(frC, `translateZ(${half}px)`)}
                {face(frC, `translateZ(${-half}px) rotateY(180deg)`)}
                {face(topC, `translateY(${-half}px) rotateX(90deg)`)}
                {face(sideC, `translateY(${half}px) rotateX(-90deg)`)}
                {face(sideC, `translateX(${half}px) rotateY(90deg)`)}
                {face(sideC, `translateX(${-half}px) rotateY(-90deg)`)}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ fontSize: 11, color: C.dim }}>{"🖱️"} {E ? "Drag to rotate" : "드래그로 회전"}</div>
    </div>
  );
}

/* --- Brute Force Runner --- */
export function CheeseBruteRunner({ E }) {
  const [N, setN] = useState(3);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  const run = () => {
    if (N < 2 || N > 50) return;
    setRunning(true); setResult(null);
    const t0 = performance.now();
    // Brute: random Q removals, check all lines each time
    const Q = Math.min(N * N * N, 30);
    const allCells = [];
    for (let x = 0; x < N; x++)
      for (let y = 0; y < N; y++)
        for (let z = 0; z < N; z++) allCells.push([x,y,z]);
    // shuffle
    for (let i = allCells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
    }
    const carved = [];
    const answers = [];
    const isC = new Set();
    for (let q = 0; q < Q; q++) {
      const [x,y,z] = allCells[q];
      carved.push([x,y,z]);
      isC.add(`${x},${y},${z}`);
      // Brute: check all 3N² lines
      let count = 0;
      for (let a = 0; a < N; a++)
        for (let b = 0; b < N; b++) {
          let ok = true;
          for (let c = 0; c < N; c++) if (!isC.has(`${a},${b},${c}`)) { ok = false; break; }
          if (ok) count++;
        }
      for (let b = 0; b < N; b++)
        for (let c = 0; c < N; c++) {
          let ok = true;
          for (let a = 0; a < N; a++) if (!isC.has(`${a},${b},${c}`)) { ok = false; break; }
          if (ok) count++;
        }
      for (let a = 0; a < N; a++)
        for (let c = 0; c < N; c++) {
          let ok = true;
          for (let b = 0; b < N; b++) if (!isC.has(`${a},${b},${c}`)) { ok = false; break; }
          if (ok) count++;
        }
      answers.push(count);
    }
    const ms = performance.now() - t0;
    setElapsed(ms);
    setResult({ Q, answers, lastAnswer: answers[answers.length - 1] });
    setRunning(false);
  };

  return (
    <div style={{ padding: "12px 8px" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.dim }}>N =</span>
        <input type="number" min={2} max={50} value={N}
          onChange={e => { setN(+e.target.value); setResult(null); }}
          style={{ width: 60, padding: "6px 8px", borderRadius: 8, border: `2px solid ${C.border}`,
            fontSize: 16, fontWeight: 800, textAlign: "center", fontFamily: "'JetBrains Mono',monospace" }} />
        <button onClick={run} disabled={running || N < 2 || N > 50} style={{
          padding: "8px 20px", borderRadius: 10, border: "none",
          background: running ? "#e5e7eb" : "linear-gradient(135deg,#fbbf24,#d97706)",
          color: "#fff", fontSize: 14, fontWeight: 800, cursor: running ? "default" : "pointer",
        }}>{running ? "..." : E ? "Run Brute!" : "브루트 실행!"}</button>
      </div>
      {N > 20 && <div style={{ textAlign: "center", fontSize: 12, color: C.carry, fontWeight: 700, marginBottom: 8 }}>
        {E ? "⚠️ N>20 may be slow!" : "⚠️ N>20이면 느릴 수 있어!"}
      </div>}
      {result && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, color: C.dim, marginBottom: 4 }}>
            {E ? `${result.Q} removals in` : `${result.Q}번 제거 →`}{" "}
            <span style={{ fontWeight: 800, color: elapsed > 100 ? C.no : C.ok }}>{elapsed.toFixed(1)}ms</span>
          </div>
          <div style={{ fontSize: 11, color: C.dim }}>
            {E ? `Final answer: ${result.lastAnswer}` : `최종 답: ${result.lastAnswer}`}
          </div>
          {elapsed > 100 && (
            <div style={{ marginTop: 6, fontSize: 12, color: C.no, fontWeight: 700 }}>
              {E ? "Imagine N=1000 with 200K queries... 💀" : "N=1000에 20만 쿼리면... 💀"}
            </div>)}
        </div>)}
    </div>
  );
}

/* --- Interactive Simulator --- */
export function CheeseSim2({ E }) {
  const N = 2;
  const order = [[0,0,0],[1,1,1],[0,1,0],[1,0,0],[1,1,0]];
  const expectedAns = [0,0,1,2,5];

  const mkGrid = () => Array.from({length:N}, ()=>Array(N).fill(N));
  const initState = () => ({
    step: 0, xy: mkGrid(), yz: mkGrid(), xz: mkGrid(),
    total: 0, history: [], carved: [], lastCarved: null,
  });

  const [state, setState] = useState(initState);

  const doCarve = () => {
    if (state.step >= order.length) return;
    const [x,y,z] = order[state.step];
    const xy = state.xy.map(r=>[...r]);
    const yz = state.yz.map(r=>[...r]);
    const xz = state.xz.map(r=>[...r]);
    let newHits = 0;
    const details = [];
    xy[x][y] -= 1; if (xy[x][y] === 0) { newHits++; details.push("z"); }
    yz[y][z] -= 1; if (yz[y][z] === 0) { newHits++; details.push("x"); }
    xz[x][z] -= 1; if (xz[x][z] === 0) { newHits++; details.push("y"); }
    const newTotal = state.total + newHits;
    setState({
      step: state.step + 1, xy, yz, xz, total: newTotal,
      history: [...state.history, { coord: [x,y,z], hits: newHits, total: newTotal, details }],
      carved: [...state.carved, [x,y,z]], lastCarved: [x,y,z],
    });
  };

  const reset = () => setState(initState());
  const cur = state.step < order.length ? order[state.step] : null;

  return (
    <div style={{ padding: "12px 8px" }}>
      <Cube3D N={N} carved={state.carved} E={E} />

      {/* Answer display */}
      {state.step > 0 && (
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: C.dim, fontWeight: 600, marginBottom: 2 }}>
            {E ? "Bricks that fit:" : "들어갈 수 있는 막대:"}
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", color: C.accent }}>
            {state.total}
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 14 }}>
        {cur && (
          <div style={{ fontSize: 14, color: C.text, marginBottom: 8, fontWeight: 700 }}>
            {state.step + 1}/5: ({cur[0]},{cur[1]},{cur[2]}) {E ? "to remove" : "제거 예정"}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {state.step < order.length ? (
            <button onClick={doCarve} style={{
              padding: "12px 28px", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg,#fbbf24,#d97706)",
              color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer",
              boxShadow: "0 3px 12px #fbbf2440",
            }}>{"🧀"} {E ? "Carve!" : "제거!"}</button>
          ) : (
            <div style={{ fontSize: 16, fontWeight: 800, color: C.ok }}>
              {"🎉"} {E ? "All 5 answers match!" : "5개 전부 정답!"}
            </div>
          )}
          <button onClick={reset} style={{
            padding: "12px 16px", borderRadius: 10,
            border: `2px solid ${C.border}`, background: C.card,
            fontSize: 13, fontWeight: 700, cursor: "pointer", color: C.dim,
          }}>{"↻"}</button>
        </div>
      </div>
    </div>
  );
}
