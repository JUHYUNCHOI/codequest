import { useState } from "react";
import { C, t } from "../../theme";
import { Narration, Quiz, NumInput, CodeReveal } from "../../components/shared";
import { MooSim, MooBruteRunner } from "./components";
import { makeMooCh1, makeMooCh2, makeMooCh3, makeMooCh4, makeMooCh5 } from "./chapters";

export default function MooApp() {
  const [lang, setLang] = useState("ko");
  const E = lang === "en";
  const [tab, setTab] = useState(0);
  const [si, setSi] = useState(0);

  const [ch1Q, setCh1Q] = useState(() => makeMooCh1(false));
  const [ch2Q, setCh2Q] = useState(() => makeMooCh2(false));
  const [ch3Q, setCh3Q] = useState(() => makeMooCh3(false));
  const [ch4Q, setCh4Q] = useState(() => makeMooCh4(false));
  const [ch5Q, setCh5Q] = useState(() => makeMooCh5(false));

  const TABS = E
    ? ["\ud83d\udccb Problem", "\ud83d\udd0d Sim", "\ud83d\udc0d Brute", "\ud83d\udca1 Pattern", "\u26a1 Code"]
    : ["\ud83d\udccb \ubb38\uc81c", "\ud83d\udd0d \uc2dc\ubbac", "\ud83d\udc0d \ube0c\ub8e8\ud2b8", "\ud83d\udca1 \ud328\ud134", "\u26a1 \ucf54\ub4dc"];

  const setters = { 0: setCh1Q, 1: setCh2Q, 2: setCh3Q, 3: setCh4Q, 4: setCh5Q };
  const states  = { 0: ch1Q,    1: ch2Q,    2: ch3Q,    3: ch4Q,    4: ch5Q };
  const makers  = { 0: makeMooCh1, 1: makeMooCh2, 2: makeMooCh3, 3: makeMooCh4, 4: makeMooCh5 };

  const switchLang = nl => {
    const ne = nl === "en"; setLang(nl); setSi(0);
    for (const k of [0,1,2,3,4]) setters[k](makers[k](ne));
  };
  const changeTab = idx => { setTab(idx); setSi(0); setters[idx](makers[idx](E)); };

  const steps = states[tab];
  const cur = Math.min(si, steps.length - 1);
  const step = steps[cur];

  const handleAnswer = optIdx => {
    if (step.answered != null) return;
    const u = [...states[tab]]; u[cur] = { ...u[cur], answered: optIdx };
    setters[tab](u);
  };
  const handleSolve = () => {
    const u = [...states[tab]]; u[cur] = { ...u[cur], solved: true };
    setters[tab](u);
  };

  const isBlocked = (step.type === "quiz" && step.answered == null) || (step.type === "input" && !step.solved);
  const canNext = !isBlocked && cur < steps.length - 1;

  const renderContent = () => {
    if (step.type === "quiz") return <Quiz {...step} onAnswer={handleAnswer} />;
    if (step.type === "input") return <NumInput key={`${tab}-${cur}-${lang}`} question={step.question} hint={step.hint} answer={step.answer} E={E} onSolve={handleSolve} />;
    if (step.type === "code") return <CodeReveal label={step.label} lines={step.code} />;
    if (step.type === "reveal") return <div style={{ padding: 16 }}>{step.content}</div>;
    if (step.type === "mooSim") return <MooSim E={E} />;
    if (step.type === "mooRunner") return <MooBruteRunner E={E} />;
    return null;
  };

  const A = "#7c5cfc";
  return (
    <div style={{ maxWidth: 440, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h1 style={{ fontSize: 16, fontWeight: 800, color: A, margin: 0, fontFamily: "'Jua',sans-serif" }}>
          {"\ud83d\udc04"} It's Mooin' Time
        </h1>
        <div style={{ display: "flex", gap: 2, background: C.card, borderRadius: 8, border: `1.5px solid ${C.border}`, padding: 2 }}>
          {[["ko","\ud83c\uddf0\ud83c\uddf7"],["en","\ud83c\uddfa\ud83c\uddf8"]].map(([v, flag]) =>
            <button key={v} onClick={() => switchLang(v)} style={{
              background: lang === v ? A : "transparent", border: "none", borderRadius: 6,
              padding: "4px 8px", cursor: "pointer", fontSize: 14, color: lang === v ? "#fff" : C.dim,
            }}>{flag}</button>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 3, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
        {TABS.map((label, i) =>
          <button key={i} onClick={() => changeTab(i)} style={{
            flex: "0 0 auto", borderRadius: 8, padding: "6px 10px", cursor: "pointer",
            fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
            background: i === tab ? A : "transparent",
            border: `1.5px solid ${i === tab ? A : C.border}`,
            color: i === tab ? "#fff" : C.dim,
          }}>{label}</button>
        )}
      </div>

      {step.narr && <Narration key={`moo-${tab}-${cur}-${lang}`} text={step.narr} />}

      <div style={{
        background: C.card, borderRadius: 14, border: `2px solid ${C.border}`,
        marginBottom: 10, boxShadow: "0 2px 10px rgba(0,0,0,.04)", overflow: "hidden",
      }}>
        {renderContent()}
      </div>

      {isBlocked && (
        <div style={{ textAlign: "center", fontSize: 13, color: C.carry, fontWeight: 700, marginBottom: 8 }}>
          {E ? "\ud83d\udc46 Answer first!" : "\ud83d\udc46 \uba3c\uc800 \ub2f5\ud574\ubd10!"}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
        <button onClick={() => setSi(Math.max(0, cur - 1))} disabled={cur === 0} style={{
          background: cur === 0 ? "#e5e7eb" : C.card,
          border: `2px solid ${cur === 0 ? "#e5e7eb" : A}`,
          borderRadius: 9, padding: "10px 22px", fontSize: 14, fontWeight: 800,
          cursor: cur === 0 ? "default" : "pointer", color: cur === 0 ? "#b0b5c3" : A,
        }}>{"\u2190"}</button>
        <span style={{ fontSize: 12, color: C.dim, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", minWidth: 56, textAlign: "center" }}>
          {cur + 1}/{steps.length}
        </span>
        <button onClick={() => canNext && setSi(cur + 1)} disabled={!canNext} style={{
          background: !canNext ? "#e5e7eb" : A,
          border: `2px solid ${!canNext ? "#e5e7eb" : A}`,
          borderRadius: 9, padding: "10px 22px", fontSize: 14, fontWeight: 800,
          cursor: !canNext ? "default" : "pointer", color: !canNext ? "#b0b5c3" : "#fff",
        }}>{"\u2192"}</button>
      </div>
      <div style={{ marginTop: 6, height: 3, background: "#e5e7eb", borderRadius: 2 }}>
        <div style={{ height: "100%", background: A, borderRadius: 2, width: `${((cur + 1) / steps.length) * 100}%`, transition: "width .3s" }} />
      </div>
    </div>
  );
}
