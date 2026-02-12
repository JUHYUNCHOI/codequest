import { useState } from "react";
import { C, t } from "../theme";
import { Narration, Quiz, NumInput, CodeReveal } from "./shared";

/**
 * TutorialShell — 모든 튜토리얼의 공통 프레임
 *
 * Props:
 *   title       : string          - 문제 제목 ("🔄 Roundabout Rounding")
 *   titleColor  : string          - 제목 색상
 *   tabs        : [{ id, labelEn, labelKo }]
 *   chapters    : { [tabId]: steps[] }   - 각 탭의 스텝 배열
 *   renderStep  : (step, ctx) => JSX     - 기본 타입 외 커스텀 렌더링
 *   headerExtra : (tab, lang) => JSX     - 탭 아래 추가 UI (e.g. 시뮬 케이스 선택)
 *   narrationStyle : (step) => {c, bg, bd}  - 내레이션 색상 커스텀
 *   onTabChange : (tabId) => void
 *   onStepChange: (stepIdx) => void
 */
export default function TutorialShell({
  title, titleColor = C.accent,
  tabs, chapters,
  renderStep,
  headerExtra,
  narrationStyle,
  splashRenderer,
}) {
  const [lang, setLang] = useState("ko");
  const E = lang === "en";
  const [tabIdx, setTabIdx] = useState(0);
  const [si, setSi] = useState(0);
  const [splash, setSplash] = useState(null);

  // Quiz/input answer 상태를 chapter 스텝에 직접 저장
  const [chapterState, setChapterState] = useState({});

  const tabId = tabs[tabIdx].id;
  const stepsRaw = chapters(E, chapterState)[tabId] || [];
  const steps = stepsRaw;
  const cur = Math.min(si, steps.length - 1);
  const step = steps[cur] || {};

  const switchLang = nl => {
    setLang(nl); setSi(0); setSplash(null);
    setChapterState({});
  };
  const changeTab = idx => {
    setTabIdx(idx); setSi(0); setSplash(null);
  };

  // Answer handlers
  const handleAnswer = optIdx => {
    if (step.answered != null) return;
    const key = `${tabId}-${cur}`;
    setChapterState(prev => ({ ...prev, [key]: { answered: optIdx } }));
  };
  const handleSolve = () => {
    const key = `${tabId}-${cur}`;
    setChapterState(prev => ({ ...prev, [`${key}-solved`]: true }));
  };

  // Check if step has been answered/solved from state
  const stateKey = `${tabId}-${cur}`;
  const answered = chapterState[stateKey]?.answered ?? step.answered;
  const solved = chapterState[`${stateKey}-solved`] || step.solved;
  const enrichedStep = { ...step, answered, solved };

  const isBlocked =
    (enrichedStep.type === "quiz" && enrichedStep.answered == null) ||
    (enrichedStep.type === "input" && !enrichedStep.solved);

  const canNext = !isBlocked && cur < steps.length - 1;

  const next = () => {
    if (!canNext) return;
    const ni = cur + 1;
    // Splash support
    if (steps[ni]?.phase === "splash" && splashRenderer) {
      setSplash(steps[ni]);
      setSi(ni + 1);
    } else setSi(ni);
  };
  const prev = () => {
    setSplash(null);
    let ni = cur - 1;
    while (ni >= 0 && steps[ni]?.phase === "splash") ni--;
    setSi(Math.max(0, ni));
  };

  // Narration color
  const nc = narrationStyle ? narrationStyle(enrichedStep) : { c: C.accent, bg: C.accentBg, bd: C.accentBd };

  // Default renderers
  const renderDefault = () => {
    if (enrichedStep.type === "quiz")
      return <Quiz {...enrichedStep} onAnswer={handleAnswer} />;
    if (enrichedStep.type === "reveal")
      return <div style={{ padding: 16 }}>{enrichedStep.content}</div>;
    if (enrichedStep.type === "input")
      return <NumInput key={stateKey + lang} question={enrichedStep.question} hint={enrichedStep.hint} answer={enrichedStep.answer} E={E} onSolve={handleSolve} />;
    if (enrichedStep.type === "code")
      return <CodeReveal label={enrichedStep.label} lines={enrichedStep.code} />;
    return null;
  };

  const content = renderStep
    ? renderStep(enrichedStep, { E, lang, tabId, cur, handleAnswer, handleSolve }) || renderDefault()
    : renderDefault();

  const tabLabels = tabs.map(tb => E ? tb.labelEn : tb.labelKo);

  return (
    <div>
      {/* Splash overlay */}
      {splash && splashRenderer && (
        <div onClick={() => setSplash(null)} style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, cursor: "pointer",
        }}>
          {splashRenderer(splash, E)}
        </div>
      )}

      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h1 style={{ fontSize: 16, fontWeight: 800, color: titleColor, margin: 0, fontFamily: "'Jua',sans-serif" }}>{title}</h1>
          <div style={{ display: "flex", gap: 2, background: C.card, borderRadius: 8, border: `1.5px solid ${C.border}`, padding: 2 }}>
            {[["ko", "🇰🇷"], ["en", "🇺🇸"]].map(([v, flag]) => (
              <button key={v} onClick={() => switchLang(v)} style={{
                background: lang === v ? C.accent : "transparent", border: "none", borderRadius: 6,
                padding: "4px 8px", cursor: "pointer", fontSize: 14, color: lang === v ? "#fff" : C.dim,
              }}>{flag}</button>
            ))}
          </div>
        </div>

        {/* Tab navigation */}
        <div style={{ display: "flex", gap: 3, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
          {tabLabels.map((label, i) => (
            <button key={i} onClick={() => changeTab(i)} style={{
              flex: "0 0 auto", borderRadius: 8, padding: "6px 10px", cursor: "pointer",
              fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
              background: i === tabIdx ? C.accent : "transparent",
              border: `1.5px solid ${i === tabIdx ? C.accent : C.border}`,
              color: i === tabIdx ? "#fff" : C.dim,
            }}>{label}</button>
          ))}
        </div>

        {/* Header extra (e.g. sim case selector) */}
        {headerExtra && headerExtra(tabId, E, { simCase: si })}

        {/* Narration */}
        {enrichedStep.narr && (
          <Narration key={`${tabIdx}-${cur}-${lang}`} text={enrichedStep.narr} color={nc.c} bg={nc.bg} bd={nc.bd} />
        )}

        {/* Content card */}
        <div style={{
          background: C.card, borderRadius: 14, border: `2px solid ${C.border}`,
          marginBottom: 10, boxShadow: "0 2px 10px rgba(0,0,0,.04)", overflow: "hidden",
        }}>
          {content}
        </div>

        {/* Blocked indicator */}
        {isBlocked && (
          <div style={{ textAlign: "center", fontSize: 13, color: C.carry, fontWeight: 700, marginBottom: 8, animation: "pulse 1.5s ease infinite" }}>
            {t(E, "👆 Answer first!", "👆 먼저 답해봐!")}
          </div>
        )}

        {/* Prev / Next */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
          <button onClick={prev} disabled={cur === 0} style={{
            background: cur === 0 ? "#e5e7eb" : C.card,
            border: `2px solid ${cur === 0 ? "#e5e7eb" : C.accent}`,
            borderRadius: 9, padding: "10px 22px", fontSize: 14, fontWeight: 800,
            cursor: cur === 0 ? "default" : "pointer", color: cur === 0 ? "#b0b5c3" : C.accent,
          }}>←</button>
          <span style={{ fontSize: 12, color: C.dim, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", minWidth: 56, textAlign: "center" }}>
            {cur + 1}/{steps.length}
          </span>
          <button onClick={next} disabled={!canNext} style={{
            background: !canNext ? "#e5e7eb" : C.accent,
            border: `2px solid ${!canNext ? "#e5e7eb" : C.accent}`,
            borderRadius: 9, padding: "10px 22px", fontSize: 14, fontWeight: 800,
            cursor: !canNext ? "default" : "pointer", color: !canNext ? "#b0b5c3" : "#fff",
          }}>→</button>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 6, height: 3, background: "#e5e7eb", borderRadius: 2 }}>
          <div style={{ height: "100%", background: C.accent, borderRadius: 2, width: `${((cur + 1) / steps.length) * 100}%`, transition: "width .3s" }} />
        </div>
      </div>
    </div>
  );
}
