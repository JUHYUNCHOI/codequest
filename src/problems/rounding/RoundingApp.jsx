import { useState, useEffect, useRef } from "react";
import { C, t } from "../../theme";
import { Narration, Quiz, NumInput, CodeReveal } from "../../components/shared";
import { CodeCompare3, BruteRunner } from "./components";
import {
  makeCh1, buildSimSteps, makePatternSteps, makeBruteSteps, makeOptSteps,
  FindPView, FindPExplainView, DigitsView, ResultView, CompareView,
  SIM_CASES,
} from "./chapters";

export default function RoundingApp() {
  // --- Language ---
  const [lang, setLang] = useState("ko");
  const E = lang === "en";

  // --- Navigation ---
  const [tab, setTab] = useState(0);
  const [si, setSi]   = useState(0);
  const [simCase, setSimCase] = useState(0);
  const [splash, setSplash]   = useState(null);

  // --- Quiz state (mutable copies for answered tracking) ---
  const [patternQ, setPatternQ] = useState(() => makePatternSteps(false));
  const [bruteQ, setBruteQ]     = useState(() => makeBruteSteps(false));
  const [optQ, setOptQ]         = useState(() => makeOptSteps(false));

  // --- Tab labels ---
  const TABS = E
    ? ["📋 Problem", "🔄 Sim", "💡 Pattern", "🐍 Code", "⚡ Optimize"]
    : ["📋 문제", "🔄 시뮬", "💡 패턴", "🐍 코드", "⚡ 최적화"];

  // --- Build steps ---
  const ch1   = makeCh1(E);
  const sim   = buildSimSteps(SIM_CASES[simCase].num, E);
  const all   = [ch1, sim, patternQ, bruteQ, optQ];
  const steps = all[tab];
  const cur   = Math.min(si, steps.length - 1);
  const step  = steps[cur];

  // --- Actions ---
  const switchLang = nl => {
    const ne = nl === "en";
    setLang(nl); setSi(0); setSplash(null);
    setPatternQ(makePatternSteps(ne));
    setBruteQ(makeBruteSteps(ne));
    setOptQ(makeOptSteps(ne));
  };
  const changeTab = idx => {
    setTab(idx); setSi(0); setSplash(null);
    if (idx === 2) setPatternQ(makePatternSteps(E));
    if (idx === 3) setBruteQ(makeBruteSteps(E));
    if (idx === 4) setOptQ(makeOptSteps(E));
  };
  const changeCase = i => { setSimCase(i); setSi(0); setSplash(null); };

  // --- Quiz/input answer handler ---
  const handleAnswer = optIdx => {
    if (step.answered != null) return;
    const update = arr => { const u = [...arr]; u[cur] = { ...u[cur], answered: optIdx }; return u; };
    if (tab === 2) setPatternQ(update(patternQ));
    if (tab === 3) setBruteQ(update(bruteQ));
    if (tab === 4) setOptQ(update(optQ));
  };
  const handleSolve = () => {
    const update = arr => { const u = [...arr]; u[cur] = { ...u[cur], solved: true }; return u; };
    if (tab === 3) setBruteQ(update(bruteQ));
    if (tab === 4) setOptQ(update(optQ));
  };

  // --- Navigation logic ---
  const isBlocked =
    ((tab >= 2) && step.type === "quiz" && step.answered == null) ||
    ((tab >= 3) && step.type === "input" && !step.solved);

  const canNext = !isBlocked && cur < steps.length - 1;

  const next = () => {
    if (!canNext) return;
    const ni = cur + 1;
    if (tab === 1 && steps[ni]?.phase === "splash") {
      setSplash({ who: steps[ni].who, method: steps[ni].method });
      setSi(ni + 1);
    } else setSi(ni);
  };
  const prev = () => {
    setSplash(null);
    let ni = cur - 1;
    if (tab === 1) { while (ni >= 0 && steps[ni].phase === "splash") ni--; }
    setSi(Math.max(0, ni));
  };

  // --- Narration color by context ---
  const nc = tab === 1 ? (
    step.phase?.startsWith("bessie") ? { c: C.bessie, bg: C.bessieBg, bd: C.bessieBd } :
    step.phase?.startsWith("elsie")  ? { c: C.elsie,  bg: C.elsieBg,  bd: C.elsieBd } :
    step.phase === "compare" ? (step.isDiff
      ? { c: C.no, bg: C.noBg, bd: C.noBd }
      : { c: C.ok, bg: C.okBg, bd: C.okBd }) :
    { c: C.accent, bg: C.accentBg, bd: C.accentBd }
  ) : { c: C.accent, bg: C.accentBg, bd: C.accentBd };

  // --- Render step content ---
  const renderContent = () => {
    // Ch1
    if (tab === 0) return step.content;

    // Ch2 Sim
    if (tab === 1) {
      if (step.phase === "findP")         return <FindPView step={step} />;
      if (step.phase === "findP_explain")  return <FindPExplainView step={step} />;
      if (step.phase === "bessie" || step.phase === "elsie") return <DigitsView step={step} E={E} />;
      if (step.phase === "bessie_result" || step.phase === "elsie_result") return <ResultView step={step} />;
      if (step.phase === "compare")        return <CompareView step={step} />;
    }

    // Ch3/4/5 universal types
    if (step.type === "quiz")   return <Quiz {...step} onAnswer={handleAnswer} />;
    if (step.type === "reveal") return <div style={{ padding: 16 }}>{step.content}</div>;
    if (step.type === "input")  return <NumInput key={`${tab}-${cur}-${lang}`} question={step.question} hint={step.hint} answer={step.answer} E={E} onSolve={handleSolve} />;
    if (step.type === "code")     return <CodeReveal label={step.label} lines={step.code} />;
    if (step.type === "compare3") return <CodeCompare3 E={E} />;
    if (step.type === "runner")   return <BruteRunner E={E} />;

    return null;
  };

  return (
    <div>

      {/* --- Splash screen (Bessie/Elsie intro) --- */}
      {splash && (
        <div onClick={() => setSplash(null)} style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, cursor: "pointer",
          background: splash.who === "bessie"
            ? "linear-gradient(160deg,#fdf2f8,#fce7f3,#fbcfe8)"
            : "linear-gradient(160deg,#f0fdf4,#dcfce7,#bbf7d0)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          animation: "fadeIn .25s",
        }}>
          <div style={{ fontSize: 100, animation: "bounceIn .5s cubic-bezier(.34,1.56,.64,1)" }}>
            {splash.who === "bessie" ? "🐄" : "🐮"}
          </div>
          <div style={{
            fontSize: 42, fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", marginTop: 12,
            color: splash.who === "bessie" ? C.bessie : C.elsie,
            animation: "bounceIn .5s cubic-bezier(.34,1.56,.64,1) .1s both",
          }}>
            {splash.who === "bessie" ? "Bessie" : "Elsie"}
          </div>
          <div style={{
            marginTop: 20, padding: "16px 28px", background: "rgba(255,255,255,.7)", borderRadius: 16,
            border: `2px solid ${splash.who === "bessie" ? C.bessieBd : C.elsieBd}`,
            fontSize: 16, fontWeight: 700, textAlign: "center",
            color: splash.who === "bessie" ? C.bessie : C.elsie,
            lineHeight: 1.8, whiteSpace: "pre-line",
            animation: "bounceIn .5s cubic-bezier(.34,1.56,.64,1) .2s both",
          }}>{splash.method}</div>
          <div style={{
            marginTop: 36, fontSize: 14, fontWeight: 600,
            color: splash.who === "bessie" ? "#e879a0" : "#6ee7a0",
            animation: "pulse 1.5s ease infinite .6s",
          }}>
            {t(E, "Tap to start →", "탭하여 시작 →")}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        {/* --- Header + Language toggle --- */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h1 style={{ fontSize: 16, fontWeight: 800, color: C.accent, margin: 0, fontFamily: "'Jua',sans-serif" }}>🔄 Roundabout Rounding</h1>
          <div style={{ display: "flex", gap: 2, background: C.card, borderRadius: 8, border: `1.5px solid ${C.border}`, padding: 2 }}>
            {[["ko","🇰🇷"],["en","🇺🇸"]].map(([v, flag]) => (
              <button key={v} onClick={() => switchLang(v)} style={{
                background: lang === v ? C.accent : "transparent", border: "none", borderRadius: 6,
                padding: "4px 8px", cursor: "pointer", fontSize: 14, color: lang === v ? "#fff" : C.dim,
              }}>{flag}</button>
            ))}
          </div>
        </div>

        {/* --- Tab navigation --- */}
        <div style={{ display: "flex", gap: 3, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
          {TABS.map((label, i) => (
            <button key={i} onClick={() => changeTab(i)} style={{
              flex: "0 0 auto", borderRadius: 8, padding: "6px 10px", cursor: "pointer",
              fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
              background: i === tab ? C.accent : "transparent",
              border: `1.5px solid ${i === tab ? C.accent : C.border}`,
              color: i === tab ? "#fff" : C.dim,
            }}>{label}</button>
          ))}
        </div>

        {/* --- Sim case selector --- */}
        {tab === 1 && (
          <div style={{ display: "flex", gap: 4, marginBottom: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {SIM_CASES.map((cs, i) => (
              <button key={i} onClick={() => changeCase(i)} style={{
                background: i === simCase ? C.card : "transparent",
                border: `2px solid ${i === simCase ? C.accent : C.border}`,
                borderRadius: 8, padding: "4px 8px", cursor: "pointer",
              }}>
                <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: i === simCase ? C.accent : C.dim }}>{cs.num}</span>
                <span style={{ fontSize: 9, marginLeft: 2, fontWeight: 700, color: cs.diff ? C.no : C.ok }}>{cs.diff ? "❌" : "✅"}</span>
              </button>
            ))}
          </div>
        )}

        {/* --- Narration --- */}
        {step.narr && <Narration key={`${tab}-${cur}-${simCase}-${lang}`} text={step.narr} color={nc.c} bg={nc.bg} bd={nc.bd} />}

        {/* --- Content card --- */}
        <div style={{
          background: C.card, borderRadius: 14, border: `2px solid ${C.border}`,
          marginBottom: 10, boxShadow: "0 2px 10px rgba(0,0,0,.04)", overflow: "hidden",
        }}>
          {renderContent()}
        </div>

        {/* --- Blocked indicator --- */}
        {isBlocked && (
          <div style={{ textAlign: "center", fontSize: 13, color: C.carry, fontWeight: 700, marginBottom: 8, animation: "pulse 1.5s ease infinite" }}>
            {t(E, "👆 Answer first!", "👆 먼저 답해봐!")}
          </div>
        )}

        {/* --- Prev / Next buttons --- */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
          <button onClick={prev} disabled={cur === 0} style={{
            background: cur === 0 ? "#e5e7eb" : C.card,
            border: `2px solid ${cur === 0 ? "#e5e7eb" : C.accent}`,
            borderRadius: 9, padding: "10px 22px", fontSize: 14, fontWeight: 800,
            cursor: cur === 0 ? "default" : "pointer",
            color: cur === 0 ? "#b0b5c3" : C.accent,
          }}>←</button>
          <span style={{ fontSize: 12, color: C.dim, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", minWidth: 56, textAlign: "center" }}>
            {cur + 1}/{steps.length}
          </span>
          <button onClick={next} disabled={!canNext} style={{
            background: !canNext ? "#e5e7eb" : C.accent,
            border: `2px solid ${!canNext ? "#e5e7eb" : C.accent}`,
            borderRadius: 9, padding: "10px 22px", fontSize: 14, fontWeight: 800,
            cursor: !canNext ? "default" : "pointer",
            color: !canNext ? "#b0b5c3" : "#fff",
          }}>→</button>
        </div>

        {/* --- Progress bar --- */}
        <div style={{ marginTop: 6, height: 3, background: "#e5e7eb", borderRadius: 2 }}>
          <div style={{ height: "100%", background: C.accent, borderRadius: 2, width: `${((cur + 1) / steps.length) * 100}%`, transition: "width .3s" }} />
        </div>
      </div>
    </div>
  );
}

