import { useState } from "react";
import { C, t } from "../../theme";
import { Narration, Quiz, NumInput, CodeReveal } from "../../components/shared";
import { CheeseSim2, CheeseBruteRunner } from "./components";
import { makeCheeseCh1, makeCheeseCh2, makeCheeseCh3, makeCheeseCh4, makeCheeseCh5 } from "./chapters";

export default function CheeseApp() {
  const [lang, setLang] = useState("ko");
  const E = lang === "en";
  const [tab, setTab] = useState(0);
  const [si, setSi] = useState(0);

  // Quiz/input state per chapter (all chapters with quiz/input)
  const [ch1Q, setCh1Q] = useState(() => makeCheeseCh1(false));
  const [ch2Q, setCh2Q] = useState(() => makeCheeseCh2(false));
  const [ch3Q, setCh3Q] = useState(() => makeCheeseCh3(false));
  const [ch4Q, setCh4Q] = useState(() => makeCheeseCh4(false));
  const [ch5Q, setCh5Q] = useState(() => makeCheeseCh5(false));

  // Tab order: 문제 → 시뮬 → 브루트(느린 걸 체감) → 패턴(해결 발견) → 코드
  const TABS = E
    ? ["📋 Problem", "🧀 Sim", "🐍 Brute", "💡 Pattern", "⚡ Code"]
    : ["📋 문제", "🧀 시뮬", "🐍 브루트", "💡 패턴", "⚡ 코드"];

  const setters = { 0: setCh1Q, 1: setCh2Q, 2: setCh4Q, 3: setCh3Q, 4: setCh5Q };
  const states  = { 0: ch1Q,    1: ch2Q,    2: ch4Q,    3: ch3Q,    4: ch5Q };
  const makers  = { 0: makeCheeseCh1, 1: makeCheeseCh2, 2: makeCheeseCh4, 3: makeCheeseCh3, 4: makeCheeseCh5 };

  const switchLang = nl => {
    const ne = nl === "en"; setLang(nl); setSi(0);
    for (const k of [0,1,2,3,4]) setters[k](makers[k](ne));
  };
  const changeTab = idx => {
    setTab(idx); setSi(0);
    setters[idx](makers[idx](E));
  };

  const steps = states[tab];
  const cur = Math.min(si, steps.length - 1);
  const step = steps[cur];

  const handleAnswer = optIdx => {
    if (step.answered != null) return;
    const setter = setters[tab], state = states[tab];
    const u = [...state]; u[cur] = { ...u[cur], answered: optIdx };
    setter(u);
  };

  const handleSolve = () => {
    const setter = setters[tab], state = states[tab];
    const u = [...state]; u[cur] = { ...u[cur], solved: true };
    setter(u);
  };

  const isBlocked = (step.type === "quiz" && step.answered == null) || (step.type === "input" && !step.solved);
  const canNext = !isBlocked && cur < steps.length - 1;
  const next = () => { if (canNext) setSi(cur + 1); };
  const prev = () => { setSi(Math.max(0, cur - 1)); };

  const renderContent = () => {
    if (step.type === "quiz") return <Quiz {...step} onAnswer={handleAnswer} />;
    if (step.type === "input") return <NumInput key={`${tab}-${cur}-${lang}`} question={step.question} hint={step.hint} answer={step.answer} E={E} onSolve={handleSolve} />;
    if (step.type === "code") return <CodeReveal label={step.label} lines={step.code} />;
    if (step.type === "reveal") return <div style={{ padding: 16 }}>{step.content}</div>;
    if (step.type === "cheeseSim2") return <CheeseSim2 E={E} />;
    if (step.type === "cheeseRunner") return <CheeseBruteRunner E={E} />;
    return null;
  };

  return (
    <div style={{ maxWidth: 440, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h1 style={{ fontSize: 16, fontWeight: 800, color: "#d97706", margin: 0, fontFamily: "'Jua',sans-serif" }}>🧀 Cheese Block</h1>
        <div style={{ display: "flex", gap: 2, background: C.card, borderRadius: 8, border: `1.5px solid ${C.border}`, padding: 2 }}>
          {[["ko", "🇰🇷"], ["en", "🇺🇸"]].map(([v, flag]) =>
            <button key={v} onClick={() => switchLang(v)} style={{
              background: lang === v ? C.accent : "transparent", border: "none", borderRadius: 6,
              padding: "4px 8px", cursor: "pointer", fontSize: 14, color: lang === v ? "#fff" : C.dim,
            }}>{flag}</button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 3, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
        {TABS.map((label, i) =>
          <button key={i} onClick={() => changeTab(i)} style={{
            flex: "0 0 auto", borderRadius: 8, padding: "6px 10px", cursor: "pointer",
            fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
            background: i === tab ? "#d97706" : "transparent",
            border: `1.5px solid ${i === tab ? "#d97706" : C.border}`,
            color: i === tab ? "#fff" : C.dim,
          }}>{label}</button>
        )}
      </div>

      {/* Narration */}
      {step.narr && <Narration key={`cheese-${tab}-${cur}-${lang}`} text={step.narr} />}

      {/* Content */}
      <div style={{
        background: C.card, borderRadius: 14, border: `2px solid ${C.border}`,
        marginBottom: 10, boxShadow: "0 2px 10px rgba(0,0,0,.04)", overflow: "hidden",
      }}>
        {renderContent()}
      </div>

      {/* Blocked indicator */}
      {isBlocked && (
        <div style={{ textAlign: "center", fontSize: 13, color: C.carry, fontWeight: 700, marginBottom: 8, animation: "pulse 1.5s ease infinite" }}>
          {E ? "👆 Answer first!" : "👆 먼저 답해봐!"}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
        <button onClick={prev} disabled={cur === 0} style={{
          background: cur === 0 ? "#e5e7eb" : C.card,
          border: `2px solid ${cur === 0 ? "#e5e7eb" : "#d97706"}`,
          borderRadius: 9, padding: "10px 22px", fontSize: 14, fontWeight: 800,
          cursor: cur === 0 ? "default" : "pointer", color: cur === 0 ? "#b0b5c3" : "#d97706",
        }}>←</button>
        <span style={{ fontSize: 12, color: C.dim, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", minWidth: 56, textAlign: "center" }}>
          {cur + 1}/{steps.length}
        </span>
        <button onClick={next} disabled={!canNext} style={{
          background: !canNext ? "#e5e7eb" : "#d97706",
          border: `2px solid ${!canNext ? "#e5e7eb" : "#d97706"}`,
          borderRadius: 9, padding: "10px 22px", fontSize: 14, fontWeight: 800,
          cursor: !canNext ? "default" : "pointer", color: !canNext ? "#b0b5c3" : "#fff",
        }}>→</button>
      </div>
      <div style={{ marginTop: 6, height: 3, background: "#e5e7eb", borderRadius: 2 }}>
        <div style={{ height: "100%", background: "#d97706", borderRadius: 2, width: `${((cur + 1) / steps.length) * 100}%`, transition: "width .3s" }} />
      </div>
    </div>
  );
}
