import { useState, useEffect, useRef } from "react";
import { C } from "../theme";

export function useTyping(text, speed = 28) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return shown;
}

export function Narration({ text, color = C.accent, bg = C.accentBg, bd = C.accentBd }) {
  const shown = useTyping(text);
  return (
    <div
      style={{
        background: bg, border: `2px solid ${bd}`, borderRadius: 12,
        padding: "10px 14px", fontSize: 14, fontWeight: 600,
        color, whiteSpace: "pre-line", marginBottom: 10, lineHeight: 1.6,
        minHeight: 40, fontFamily: "'Noto Sans KR', sans-serif",
      }}
    >{shown}</div>
  );
}

export function Quiz({ question, hint, options, correct, explain, answered, onAnswer }) {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: C.text }}>{question}</div>
      {hint && <div style={{ fontSize: 12, color: C.carry, marginBottom: 8, fontWeight: 600 }}>💡 {hint}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {options.map((o, i) => {
          const picked = answered === i;
          const isCorrect = i === correct;
          const showResult = answered != null;
          let bg = C.card, bd = C.border, color = C.text;
          if (showResult && isCorrect) { bg = C.okBg; bd = C.okBd; color = C.ok; }
          else if (showResult && picked && !isCorrect) { bg = C.noBg; bd = C.noBd; color = C.no; }
          return (
            <button key={i} onClick={() => onAnswer(i)} disabled={showResult}
              style={{ textAlign: "left", padding: "10px 14px", borderRadius: 10,
                border: `2px solid ${bd}`, background: bg, fontSize: 13,
                fontWeight: 700, cursor: showResult ? "default" : "pointer",
                color, transition: "all .2s",
              }}
            >{showResult && isCorrect ? "✅ " : showResult && picked ? "❌ " : ""}{o}</button>
          );
        })}
      </div>
      {answered != null && explain && (
        <div style={{ marginTop: 10, padding: "8px 12px", background: C.okBg,
          borderRadius: 8, border: `1.5px solid ${C.okBd}`, fontSize: 12,
          fontWeight: 600, color: C.ok,
        }}>{explain}</div>
      )}
    </div>
  );
}

export function NumInput({ question, hint, answer, E, onSolve }) {
  const [val, setVal] = useState("");
  const [wrong, setWrong] = useState(false);
  const [correct, setCorrect] = useState(false);
  const submit = () => {
    const n = parseInt(val, 10);
    if (n === answer) { setCorrect(true); setWrong(false); onSolve && onSolve(); }
    else setWrong(true);
  };
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: C.text }}>{question}</div>
      {hint && <div style={{ fontSize: 12, color: C.carry, marginBottom: 8, fontWeight: 600 }}>💡 {hint}</div>}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <input value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          style={{
            width: 80, padding: "8px 12px", borderRadius: 8,
            border: `2px solid ${correct ? C.okBd : wrong ? C.noBd : C.border}`,
            fontSize: 18, fontWeight: 900, textAlign: "center",
            fontFamily: "'JetBrains Mono',monospace", outline: "none",
            background: correct ? C.okBg : wrong ? C.noBg : "#fff",
          }}
          disabled={correct}
        />
        {!correct && (
          <button onClick={submit} style={{
            padding: "8px 16px", borderRadius: 8, border: `2px solid ${C.accent}`,
            background: C.accent, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>{E ? "Check" : "확인"}</button>
        )}
        {correct && <span style={{ fontSize: 20 }}>✅</span>}
        {wrong && !correct && <span style={{ fontSize: 12, color: C.no, fontWeight: 700 }}>{E ? "Try again!" : "다시!"}</span>}
      </div>
    </div>
  );
}

export function highlight(line) {
  const keywords = ["def", "return", "for", "if", "else", "elif", "while", "import", "from", "in", "range", "not", "and", "or", "True", "False", "None", "print", "int", "map", "input", "split", "len", "all", "abs", "round"];
  const parts = [];
  let rest = line;
  const commentIdx = rest.indexOf("#");
  let comment = "";
  if (commentIdx >= 0) { comment = rest.slice(commentIdx); rest = rest.slice(0, commentIdx); }
  const re = /(\b\w+\b|"[^"]*"|'[^']*'|\d+|[^\w\s]|\s+)/g;
  let m;
  while ((m = re.exec(rest)) !== null) {
    const tok = m[0];
    if (keywords.includes(tok)) parts.push(<span key={m.index} style={{ color: "#c084fc" }}>{tok}</span>);
    else if (/^\d+$/.test(tok)) parts.push(<span key={m.index} style={{ color: "#fbbf24" }}>{tok}</span>);
    else if (/^["']/.test(tok)) parts.push(<span key={m.index} style={{ color: "#34d399" }}>{tok}</span>);
    else parts.push(<span key={m.index} style={{ color: "#e2e8f0" }}>{tok}</span>);
  }
  if (comment) parts.push(<span key="cmt" style={{ color: "#6b7280", fontStyle: "italic" }}>{comment}</span>);
  return parts;
}

export function CodeBlock({ lines }) {
  return (
    <div style={{
      background: C.codeBg, borderRadius: 10, padding: "12px 8px",
      overflowX: "auto", fontSize: 12, lineHeight: 1.7,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {lines.map((l, i) => (
        <div key={i} style={{ display: "flex", minHeight: 20 }}>
          <span style={{ color: "#4b5563", width: 28, textAlign: "right", marginRight: 10, flexShrink: 0, userSelect: "none", fontSize: 10 }}>{i + 1}</span>
          <span style={{ whiteSpace: "pre" }}>{highlight(l)}</span>
        </div>
      ))}
    </div>
  );
}

export function CodeReveal({ label, lines }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: 12 }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", padding: "10px 14px", borderRadius: 10,
        border: `2px solid ${C.accentBd}`, background: C.accentBg,
        fontSize: 13, fontWeight: 700, cursor: "pointer", color: C.accent,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span>{label}</span>
        <span style={{ fontSize: 16 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && <div style={{ marginTop: 8 }}><CodeBlock lines={lines} /></div>}
    </div>
  );
}
