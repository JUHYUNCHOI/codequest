import { C, t } from "../../theme";

/* ================================================================
   HELPERS
   ================================================================ */
export const pw = p => Math.pow(10, p);
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
export const sup = n => String(n).split("").map(c => SUP[+c]).join("");

export function posName(pos, E) {
  if (pos === 1) return E ? "ones" : "1의자리";
  if (pos === 2) return E ? "tens" : "10의자리";
  if (pos === 3) return E ? "hundreds" : "100의자리";
  if (pos === 4) return E ? "thousands" : "1000의자리";
  return `10${sup(pos - 1)}`;
}

export function calcBessie(x) {
  const s = String(x), len = s.length, top = +s[0];
  return top >= 5 ? pw(len) : 0;
}

export function calcElsie(x) {
  const s = String(x), len = s.length;
  let cur = x;
  for (let pos = 1; pos <= len; pos++) {
    const d = Math.floor(cur / pw(pos - 1)) % 10;
    if (d >= 5) cur += pw(pos);
    cur = Math.floor(cur / pw(pos)) * pw(pos);
  }
  return cur;
}

/* ================================================================
   CHAPTER DATA
   Step types: "reveal" | "quiz" | "input" | "runner" | "code" | "compare3"
   ================================================================ */

// --- Sim case list (used by RoundingApp) ---
export const SIM_CASES = [
  { num: 48, diff: true }, { num: 67, diff: false }, { num: 38, diff: false },
  { num: 445, diff: true }, { num: 435, diff: false }, { num: 4459, diff: true },
];

// ═══════════════════════════════════════════════
// Chapter 1: 📋 Problem Introduction (5 steps)
// ═══════════════════════════════════════════════
export function makeCh1(E) {
  return [
    // 1-1: Title
    { type: "reveal", narr: t(E, "USACO 2024 December Bronze — Problem 1!", "USACO 2024 December Bronze 첫 번째 문제야! 같이 풀어보자!"),
      content: (
        <div style={{ padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.accent }}>Roundabout Rounding</div>
          <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>USACO 2024 December Bronze #1</div>
        </div>
      ),
    },
    // 1-2: What's given
    { type: "reveal", narr: t(E, "Bessie has rounding homework! Round positive integers to powers of 10.", "Bessie가 반올림 숙제를 하고 있어! 숫자를 깔끔한 수(10, 100, 1000 등)로 반올림하는 거야."),
      content: (
        <div style={{ padding: 16 }}>
          <div style={{ background: C.accentBg, border: `2px solid ${C.accentBd}`, borderRadius: 14, padding: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.accent, marginBottom: 8 }}>{t(E, "📋 Given", "📋 주어진 것")}</div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 2 }}>
              {t(E, "A number x (2 to N)", "수 x (2부터 N까지)")}<br />
              {t(E, "Find the nearest \"clean\" number (10, 100, 1000...)", "x보다 크거나 같은 깔끔한 수 (10, 100, 1000...) 찾기")}<br />
              {t(E, "Round x to that number!", "그 수로 반올림!")}
            </div>
          </div>
        </div>
      ),
    },
    // 1-3: Two methods
    { type: "reveal", narr: t(E, "Two different rounding methods!", "Bessie와 Elsie가 반올림하는 방법이 서로 달라! 누가 맞을까?"),
      content: (
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1, background: C.bessieBg, borderRadius: 14, padding: "14px 10px", border: `2px solid ${C.bessieBd}` }}>
              <div style={{ fontSize: 32, textAlign: "center" }}>🐄</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: C.bessie, textAlign: "center", fontFamily: "'JetBrains Mono',monospace" }}>Bessie</div>
              <div style={{ fontSize: 12, color: C.bessie, marginTop: 8, lineHeight: 1.8, fontWeight: 600 }}>
                {E ? <>P-th digit only.<br /><strong>Just once!</strong></> : <>P번째 자리만 보고<br /><strong>딱 한 번</strong> 반올림!</>}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", fontSize: 18, fontWeight: 900, color: C.dimLight }}>VS</div>
            <div style={{ flex: 1, background: C.elsieBg, borderRadius: 14, padding: "14px 10px", border: `2px solid ${C.elsieBd}` }}>
              <div style={{ fontSize: 32, textAlign: "center" }}>🐮</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: C.elsie, textAlign: "center", fontFamily: "'JetBrains Mono',monospace" }}>Elsie</div>
              <div style={{ fontSize: 12, color: C.elsie, marginTop: 8, lineHeight: 1.8, fontWeight: 600 }}>
                {E ? <>1st → 2nd → … → P-th<br /><strong>Step by step!</strong></> : <>1번째 → P번째까지<br /><strong>순서대로</strong> 반올림!</>}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // 1-4: Example 48
    { type: "reveal", narr: t(E, "Example: rounding 48 to 10² — different results!", "예시: 48을 10²로 반올림하면 — 결과가 다르다!"),
      content: (
        <div style={{ padding: 16 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 2.2 }}>
            <div style={{ color: C.dim, marginBottom: 4 }}>48 → 10² {t(E, "rounding", "반올림")} (P=2)</div>
            <div style={{ color: C.bessie }}>🐄 {t(E, "tens", "10의 자리")}=4 → 4&lt;5 → <strong>0</strong></div>
            <div style={{ color: C.elsie }}>🐮 8≥5→50, 5≥5→<strong>100</strong></div>
            <div style={{ marginTop: 8, padding: "6px 12px", background: C.noBg, borderRadius: 8, color: C.no, fontWeight: 800, textAlign: "center" }}>
              ❌ 0 vs 100 — {t(E, "Different!", "다르다!")}
            </div>
          </div>
        </div>
      ),
    },
    // 1-5: Goal
    { type: "reveal", narr: t(E, "Goal: among 2 to N, count x where Bessie ≠ Elsie!", "목표: 2부터 N까지 수 중에서, Bessie랑 Elsie의 답이 다른 수가 몇 개인지 구해!"),
      content: (
        <div style={{ padding: 16, textAlign: "center" }}>
          <div style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)", borderRadius: 16, padding: "20px 16px", boxShadow: "0 4px 20px rgba(79,70,229,.3)" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", fontWeight: 700, marginBottom: 6 }}>{t(E, "Find", "구해야 하는 것")}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", lineHeight: 1.6 }}>
              {E ? <>Among 2 ≤ x ≤ N,<br />how many give<br />different answers?</> : <>2부터 N까지 수 중<br />Bessie와 Elsie의 답이<br /><u>다른 수</u>는 몇 개?</>}
            </div>
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: C.dim }}>T {t(E, "test cases", "개 테스트케이스")}, N ≤ 10⁹</div>
        </div>
      ),
    },
  ];
}


// ═══════════════════════════════════════════════
// Chapter 2: 🔄 Simulator (dynamic steps)
// ═══════════════════════════════════════════════
export function buildSimSteps(x, E) {
  const s = String(x), len = s.length, digits = s.split("").map(Number);
  const top = digits[0], bResult = top >= 5 ? pw(len) : 0;
  const pn = p => posName(p, E);
  const steps = [];

  // Find P
  steps.push({ phase: "findP", narr: t(E, `Find P for ${x}!`, `${x}에서 P를 찾자!`), pList: [], pFound: -1, number: x });
  for (let p = 1; p <= len; p++) {
    const v = pw(p), ok = v >= x;
    steps.push({
      phase: "findP",
      narr: ok ? `10${sup(p)}=${v} ≥ ${x} → P=${p}!` : `10${sup(p)}=${v}… ${t(E, "too small!", "작다!")}`,
      pList: Array.from({ length: p }, (_, i) => ({ p: i + 1, v: pw(i + 1), ok: pw(i + 1) >= x })),
      pFound: ok ? p : -1, number: x,
    });
    if (ok) break;
  }

  // Explain P
  steps.push({
    phase: "findP_explain", number: x, P: len,
    possibleResults: [0, pw(len)], digits,
    narr: t(E, `P=${len} → round to 10${sup(len)}! Result is 0 or ${pw(len)}.`, `P=${len} → 10${sup(len)}로 반올림! 결과는 0 또는 ${pw(len)}.`),
  });

  // Bessie
  steps.push({ phase: "splash", who: "bessie",
    method: t(E, `P=${len}\nCheck ${pn(len)}\njust once!`, `P=${len}이니까\n${pn(len)}(P번째 자리)만\n딱 한 번 확인!`),
  });
  steps.push({ phase: "bessie", narr: t(E, `Bessie! Look at ${pn(len)}.`, `Bessie! P번째 자리(${pn(len)})를 보자.`),
    digits, focusIdx: 0, bubble: "👀", bubbleType: "look", resultVal: null });
  steps.push({ phase: "bessie",
    narr: top >= 5 ? t(E, `${top}≥5 → round up!`, `${top}≥5 → 올린다!`) : t(E, `${top}<5 → round down.`, `${top}<5 → 버린다.`),
    digits, focusIdx: 0,
    bubble: top >= 5 ? t(E, "≥5\nUp!", "≥5\n올린다!") : t(E, "<5\nDown", "<5\n패스"),
    bubbleType: top >= 5 ? "carry" : "dim", resultVal: null,
  });
  steps.push({ phase: "bessie_result", narr: t(E, "Bessie's result…", "Bessie의 결과는…"), result: bResult, number: x });

  // Elsie
  steps.push({ phase: "splash", who: "elsie",
    method: t(E, `10¹→10²→…→10${sup(len)}\nStep by step!`, `10¹→10²→…→10${sup(len)}\n순서대로 반올림!`),
  });
  steps.push({ phase: "elsie", narr: t(E, "Elsie's turn! Start from 1st.", "Elsie 차례! 1번째부터 올라가자."),
    digits, focusIdx: -1, bubble: "", bubbleType: "look", resultVal: null, bRef: bResult });

  let cur = x, curD = [...digits];
  for (let pos = 1; pos <= len; pos++) {
    const idx = curD.length - pos, dd = curD[idx], up = dd >= 5;
    steps.push({ phase: "elsie", narr: t(E, `Step ${pos}/${len}: ${pn(pos)}=${dd}`, `${pos}/${len}단계: ${pn(pos)}=${dd}`),
      digits: [...curD], focusIdx: idx, bubble: `${dd}`, bubbleType: "look", resultVal: null, bRef: bResult });
    steps.push({ phase: "elsie",
      narr: up ? t(E, `${dd}≥5 → round up!`, `${dd}≥5 → 올린다!`) : t(E, `${dd}<5 → skip.`, `${dd}<5 → 패스.`),
      digits: [...curD], focusIdx: idx,
      bubble: up ? t(E, "≥5\nUp!⬆", "≥5\n올린다!⬆") : t(E, "<5\nSkip", "<5\n패스"),
      bubbleType: up ? "carry" : "dim", resultVal: null, bRef: bResult });
    if (up) cur += pw(pos);
    cur = Math.floor(cur / pw(pos)) * pw(pos);
    const nD = String(cur).padStart(len, "0").split("").map(Number);
    steps.push({ phase: "elsie",
      narr: `→ ${cur}${up && pos < len ? " carry↗!" : ""}`,
      digits: [...nD], focusIdx: up && pos < len ? idx - 1 : -1,
      bubble: up && pos < len ? "+1↗" : "", bubbleType: "carry", resultVal: cur, bRef: bResult });
    curD = [...nD];
  }

  const eResult = cur, isDiff = bResult !== eResult;
  steps.push({ phase: "elsie_result", narr: t(E, "Elsie's result…", "Elsie의 결과는…"), result: eResult, number: x });
  steps.push({ phase: "compare",
    narr: isDiff
      ? t(E, `❌ ${bResult} vs ${eResult} — Different!`, `❌ ${bResult} vs ${eResult} — 달라!`)
      : t(E, `✅ Both ${bResult} — Same!`, `✅ 둘 다 ${bResult} — 같아!`),
    bessie: bResult, elsie: eResult, isDiff });

  return steps;
}


// ═══════════════════════════════════════════════
// Chapter 3: 💡 Pattern Discovery (12 steps)
// Removed old 3-9 (redundant "digit≥?" quiz)
// ═══════════════════════════════════════════════
export function makePatternSteps(E) {
  return [
    // 3-1: Review all 6 cases
    { type: "reveal",
      narr: t(E, "We saw all 6 cases. Let's find the pattern!", "시뮬레이터에서 6개를 해봤어. 이제 규칙을 찾아보자! ✅ 표는 답이 같은 것, ❌는 답이 다른 것!"),
      content: (
        <div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14 }}>
          {[[48,"❌"],[67,"✅"],[38,"✅"],[445,"❌"],[435,"✅"],[4459,"❌"]].map(([n,r],i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 12px", marginBottom:4,
              background: r==="❌" ? C.noBg : C.okBg, borderRadius:8,
              border: `1.5px solid ${r==="❌" ? C.noBd : C.okBd}` }}>
              <span style={{ fontWeight:800 }}>{n}</span><span>{r}</span>
            </div>))}
        </div></div>),
    },
    // 3-2: Common feature
    { type: "quiz",
      narr: t(E, "Look at only ❌: 48, 445, 4459", "❌인 수만 모아봤: 48, 445, 4459. 이 세 수의 공통점이 보여?"),
      question: t(E, "What do these three have in common?", "이 세 수의 공통점은?"),
      hint: t(E, "Look at the first digit!", "첫째 자리를 봐!"),
      options: t(E,
        ["First digit always even", "First digit always 4", "All divisible by 8", "Even number of digits"],
        ["첫째 자리가 짝수", "첫째 자리가 전부 4", "전부 8의 배수", "자릿수가 짝수"]),
      correct: 1,
      explain: t(E, "All start with 4! That's the key.", "전부 4로 시작해! 이게 핵심이야."),
    },
    // 3-3: Why 4?
    { type: "quiz",
      narr: t(E, "Why 4? Remember, Bessie only checks the first digit.", "왜 4일까? Bessie는 첫째 자리만 보잖아."),
      question: t(E, "First digit is 4 — Bessie rounds up or down?", "첫째 자리가 4면, Bessie는 올릴까 버릴까?"),
      options: t(E, ["Up (4 ≥ 5)", "Down (4 < 5)"], ["올린다 (4 ≥ 5)", "버린다 (4 < 5)"]),
      correct: 1,
      explain: t(E, "4 < 5 → Bessie rounds down → result 0!", "4 < 5 → 버린다 → 결과 0!"),
    },
    // 3-4: Elsie's carry
    { type: "reveal",
      narr: t(E, "But look at Elsie with 48:", "그런데 Elsie의 48을 봐:"),
      content: (
        <div style={{ padding: 4 }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, lineHeight:2.2, padding:10, background:C.elsieBg, borderRadius:10, border:`1.5px solid ${C.elsieBd}` }}>
            <div style={{ fontWeight:800, color:C.elsie, marginBottom:4 }}>{t(E, "🐮 Elsie rounding 48:", "🐮 Elsie의 48 반올림:")}</div>
            <div>{t(E, "Step 1: ones=", "1단계: 1의자리=")}<strong>8</strong> ≥ 5 → {t(E, "up!", "올림!")} → 50</div>
            <div>{t(E, "Step 2: tens=", "2단계: 10의자리=")}<strong>5</strong> ≥ 5 → {t(E, "up!", "올림!")} → 100</div>
            <div style={{ marginTop:8, fontWeight:800, color:C.no }}>{t(E, "Tens was 4, but carry from 8 made it 5!", "4였던 10의자리가 carry 때문에 5가 됐어!")}</div>
          </div>
        </div>),
    },
    // 3-5: 4+1=5 threshold
    { type: "quiz",
      narr: t(E, "Key! Carry (+1) hits digit 4 → becomes 5.", "핵심! 4에 carry(+1) → 5가 돼."),
      question: t(E, "Does 5 meet the threshold (≥5)?", "5는 반올림 기준(≥5)을 넘을까?"),
      options: t(E, ["Yes! 5≥5 → only Elsie rounds up → different!", "No, 5<5"], ["넘는다! 5≥5 → Elsie만 올림 → 달라진다!", "안 넘는다"]),
      correct: 0,
      explain: t(E, "5≥5 → Elsie rounds up, Bessie didn't → different!", "5≥5 → Elsie만 올려서 달라져!"),
    },
    // 3-6: What about 3+1=4?
    { type: "quiz",
      narr: t(E, "What about 38? First digit 3, carry → 3+1=4", "38은? 첫째 3, carry → 3+1=4"),
      question: t(E, "Does 4 meet ≥5?", "4는 ≥5를 넘을까?"),
      options: t(E, ["No. 4<5 → same result ✅", "Yes. 4≥5 → different"], ["안 넘는다. 4<5 → 같다 ✅", "넘는다 → 달라진다"]),
      correct: 0,
      explain: t(E, "3+1=4, 4<5 → no round up. Same result! ✅", "3+1=4, 4<5 → 안 올라감. 같다! ✅"),
    },
    // 3-7: What about 5~9?
    { type: "quiz",
      narr: t(E, "What if the first digit is 5 or higher? Bessie sees 5→ rounds up. Elsie also rounds up.", "첫째가 5 이상이면? Bessie도 5→올림. Elsie도 올림."),
      question: t(E, "First digit ≥5: Bessie and Elsie same or different?", "첫째 ≥5: Bessie와 Elsie 같을까 다를까?"),
      options: t(E, ["Same ✅ (both round up)", "Different ❌"], ["같다 ✅ (둘 다 올림)", "다르다 ❌"]),
      correct: 0,
      explain: t(E, "Both round up → same result! Only first=4 causes trouble.", "둘 다 올리니까 같아! 첫째=4일 때만 문제."),
    },
    // 3-8: Summary table by first digit
    { type: "reveal",
      narr: t(E, "Let's organize by first digit:", "첫째 자리별로 정리해보자:"),
      content: (
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, lineHeight:2.4 }}>
          <div style={{ color:C.dim }}>1~3: +1 → 2~4 → <span style={{ color:C.ok, fontWeight:700 }}>{t(E,"<5 → same ✅","5 안 넘음 → 같다 ✅")}</span></div>
          <div style={{ background:C.carryBg, borderRadius:8, padding:"4px 10px", fontWeight:800, color:C.carry }}>
            4: +1 → 5 → <span style={{ color:C.no }}>{t(E,"≥5 → different! ❌","5 넘음 → 달라진다! ❌")}</span>
          </div>
          <div style={{ color:C.dim }}>5~9: {t(E,"both round up →","둘 다 올려서 →")} <span style={{ color:C.ok, fontWeight:700 }}>{t(E,"same ✅","같다 ✅")}</span></div>
          <div style={{ marginTop:10, padding:"8px 12px", background:C.accentBg, borderRadius:8, color:C.accent, fontWeight:700, textAlign:"center", fontSize:12 }}>
            {t(E, "Only first digit = 4 causes different results!", "첫째 자리가 4일 때만 결과가 달라져!")}
          </div>
        </div>),
    },

    // 3-9: Carry propagation — 445 vs 435
    { type: "quiz",
      narr: t(E,
        "But just first=4 isn't enough! Carry must REACH the first digit. Compare 445 vs 435.",
        "근데 첫째=4만으로는 부족해! carry가 첫째까지 도달해야 해. 445 vs 435를 비교해봐."),
      question: t(E, "445 is ❌ but 435 is ✅. Why?", "445는 ❌인데 435는 ✅. 왜?"),
      hint: t(E, "Middle digit: 4 vs 3", "중간 자리: 4 vs 3"),
      options: t(E,
        ["445: mid 4+1→5≥5 propagates! / 435: mid 3+1→4<5 stops!", "445 is bigger", "Odd vs even"],
        ["445: 중간 4+1→5≥5 전파! / 435: 중간 3+1→4<5 멈춤!", "445가 더 크니까", "홀짝 차이"]),
      correct: 0,
      explain: t(E, "Middle must be ≥4 for carry to keep going!", "중간이 ≥4여야 carry가 계속 전파돼!"),
    },
    // 3-9: Complete condition
    { type: "reveal",
      narr: t(E, "✅ Complete condition found!", "✅ 완전한 조건을 찾았어!"),
      content: (
        <div style={{ background:C.card, borderRadius:14, padding:16, border:`2px solid ${C.accent}`, boxShadow:"0 4px 16px rgba(79,70,229,.1)" }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, lineHeight:2.4 }}>
            <div><span style={{ display:"inline-block", width:100, color:C.dim }}>{t(E,"First:","첫째:")}</span><span style={{ fontWeight:800, color:C.no }}>{t(E,"must be 4","반드시 4")}</span></div>
            <div><span style={{ display:"inline-block", width:100, color:C.dim }}>{t(E,"Middle:","중간:")}</span><span style={{ fontWeight:800, color:C.carry }}>4~9</span> <span style={{ color:C.dim }}>{t(E,"(6 each)","(6가지)")}</span></div>
            <div><span style={{ display:"inline-block", width:100, color:C.dim }}>{t(E,"Last:","마지막:")}</span><span style={{ fontWeight:800, color:C.look }}>5~9</span> <span style={{ color:C.dim }}>{t(E,"(5, starts carry!)","(5가지)")}</span></div>
          </div>
        </div>),
    },
    // 3-10: Count 2-digit
    { type: "quiz",
      narr: t(E, "Now let's COUNT! 2-digit: first=4, last=5~9.", "이제 세자! 2자리: 첫째=4, 마지막=5~9."),
      question: t(E, "How many 2-digit numbers? (45,46,47,48,49)", "2자리 수 몇 개? (45,46,47,48,49)"),
      options: t(E, ["4","5","6","10"], ["4개","5개","6개","10개"]),
      correct: 1,
      explain: t(E, "45~49 → 5!", "45~49 → 5개!"),
    },
    // 3-11: Count 3-digit
    { type: "input",
      narr: t(E, "3-digit: first=4, middle=4~9 (6), last=5~9 (5).", "3자리: 첫째=4, 중간=4~9(6), 마지막=5~9(5)."),
      question: t(E, "How many 3-digit? 1 × 6 × 5 = ?", "3자리 몇 개? 1 × 6 × 5 = ?"),
      answer: 30,
    },
    // 3-12: Formula
    { type: "reveal",
      narr: t(E, "Pattern! d-digit = 5 × 6^(d−2)!", "패턴! d자리 = 5 × 6^(d−2)!"),
      content: (
        <div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13 }}>
            {[[2,"[4][5~9]","1×5","5"],[3,"[4][4~9][5~9]","1×6×5","30"],[4,"[4][4~9][4~9][5~9]","1×6²×5","180"]].map(([d,p,f,r],i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", marginBottom:4, background:C.accentBg, borderRadius:8 }}>
                <span style={{ color:C.dim }}>{d}{t(E,"-dig","자리")}</span>
                <span style={{ color:C.dim, fontSize:11 }}>{p}</span>
                <span style={{ color:C.accent, fontSize:11 }}>{f}</span>
                <span style={{ fontWeight:800, color:C.accent }}>{r}</span>
              </div>))}
          </div>
          <div style={{ textAlign:"center", marginTop:12, padding:"10px 16px", background:"linear-gradient(135deg,#4f46e5,#6366f1)", borderRadius:12 }}>
            <span style={{ fontSize:18, fontWeight:900, color:"#fff", fontFamily:"'JetBrains Mono',monospace" }}>5 × 6<sup>d−2</sup></span>
          </div>
        </div>),
    },
  ];
}


// ═══════════════════════════════════════════════
// Chapter 4: 🐍 Brute Force Verification (4 steps)
// Removed old 4-2~4-6 (48 hand calculation, duplicated sim tab)
// ═══════════════════════════════════════════════
export function makeBruteSteps(E) {
  return [
    // 4-1: Idea + sample
    { type: "reveal",
      narr: t(E,
        "We found the pattern! But let's verify with brute force. Sample: N=100, answer=5 (those are 45~49).",
        "패턴을 알아냈어! 브루트포스로 검증하자. 예제: N=100, 답=5 (45~49가 해당)."),
      content: (
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 2.2 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.dim, marginBottom: 4 }}>{t(E,"Sample","예제")}</div>
              <div style={{ background: "#f8f9fc", borderRadius: 8, padding: "8px 12px", border: `1.5px solid ${C.border}` }}>N = 100 → <strong style={{ color: C.ok }}>5</strong></div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.dim, marginBottom: 4 }}>{t(E,"Those 5","해당 5개")}</div>
              <div style={{ background: C.noBg, borderRadius: 8, padding: "8px 12px", border: `1.5px solid ${C.noBd}`, fontWeight: 800, color: C.no }}>45, 46, 47, 48, 49</div>
            </div>
          </div>
        </div>),
    },
    // 4-2: Runner
    { type: "runner",
      narr: t(E,
        "Try it! Enter N and run the brute force. Try N=10000+ to feel the slowness!",
        "N을 넣고 실행해봐! N=10000 이상 넣어서 느린 걸 체감해봐!"),
    },
    // 4-3: How slow?
    { type: "input",
      narr: t(E,
        "N=10⁹ means checking 1 billion numbers. At ~10⁸/sec, how many seconds?",
        "N=10⁹이면 10억 개 확인. 초당 ~10⁸개면 몇 초?"),
      question: t(E, "10⁹ ÷ 10⁸ = ? seconds", "10⁹ ÷ 10⁸ = ? 초"),
      answer: 10,
    },
    // 4-4: Code comparison (3 levels)
    { type: "compare3",
      narr: t(E,
        "10 sec is too slow! (limit ≈ 1~2s) But let's see the code — from idea to real code.",
        "10초는 너무 느려! (보통 1~2초 제한) 코드를 보자 — 아이디어에서 실제 코드까지."),
    },
  ];
}


// ═══════════════════════════════════════════════
// Chapter 5: ⚡ Optimization (10 steps)
// ═══════════════════════════════════════════════
const OPT_CODE = [
  "def count_diff(N):",
  "  if N < 10:",
  "    return 0",
  "  s = str(N)",
  "  D = len(s)",
  "  result = 0",
  "",
  "  # 2-digit ~ (D-1)-digit: full formula",
  "  for d in range(2, D):",
  "    result += 5 * (6 ** (d - 2))",
  "",
  "  # D-digit: count up to N only",
  "  first = int(s[0])",
  "  if first > 4:",
  "    result += 5 * (6 ** (D - 2))",
  "  elif first == 4:",
  "    for i in range(1, D):",
  "      digit = int(s[i])",
  "      if i < D - 1:  # middle digit",
  "        if digit >= 4:",
  "          extra = digit - 4",
  "          rem = D - i - 2",
  "          result += extra*(6**rem)*5 if rem>=0 else extra*5",
  "        if digit < 4:",
  "          break",
  "      else:  # last digit",
  "        if digit >= 5:",
  "          result += digit - 5 + 1",
  "  return result",
];

export function makeOptSteps(E) {
  return [
    // 5-1: 2-digit formula
    { type: "input",
      narr: t(E, "Let's use the formula! 5 × 6^(d−2). For 2-digit:", "공식을 써보자! 5 × 6^(d−2). 2자리:"),
      question: "5 × 6⁰ = 5 × 1 = ?", answer: 5,
    },
    // 5-2: 3-digit
    { type: "input",
      narr: t(E, "3-digit numbers:", "3자리:"),
      question: "5 × 6¹ = ?", answer: 30,
    },
    // 5-3: N=1000 total
    { type: "input",
      narr: t(E, "N=1000 → only 2+3 digit. Total?", "N=1000 → 2자리+3자리만. 합계?"),
      question: "5 + 30 = ?", answer: 35,
    },
    // 5-4: Strategy — split by digit count
    { type: "reveal",
      narr: t(E,
        "But what if N isn't a round number like 1000? We split the counting!",
        "근데 N이 1000처럼 딱 떨어지지 않으면? 나눠서 세자!"),
      content: (
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13 }}>
          <div style={{ background:C.accentBg, borderRadius:10, padding:12, border:`1.5px solid ${C.accentBd}` }}>
            <div style={{ fontWeight:800, color:C.accent, marginBottom:8 }}>{t(E,"Strategy","전략")}</div>
            <div style={{ color:C.text, lineHeight:2.2 }}>
              <div>① {t(E,"Shorter numbers: 2-digit ~ (D-1)-digit","짧은 수: 2자리 ~ (D-1)자리")}</div>
              <div style={{ paddingLeft:16, color:C.ok, fontWeight:700 }}>→ {t(E,"full formula 5×6^(d-2)","공식 그대로 5×6^(d-2)")}</div>
              <div>② {t(E,"Same length as N: D-digit numbers ≤ N","N과 같은 자릿수: D자리 수 ≤ N")}</div>
              <div style={{ paddingLeft:16, color:C.carry, fontWeight:700 }}>→ {t(E,"careful counting, digit by digit!","자릿수 하나씩 조심히 세기!")}</div>
            </div>
          </div>
          <div style={{ marginTop:10, fontSize:12, color:C.dim, lineHeight:1.6 }}>
            {t(E, "Example: N=473 (D=3). Part ①: all 2-digit (5). Part ②: 3-digit ≤ 473 only.", "예: N=473 (D=3). ①: 2자리 전부 (5개). ②: 3자리는 473까지만.")}
          </div>
        </div>),
    },
    // 5-5: N=473 intro
    { type: "reveal",
      narr: t(E, "Let's try Part ② for N=473. First digit is 4 — we're in the danger zone!", "②를 해보자. N=473, 첫째=4 — 위험 구간이야!"),
      content: (
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13 }}>
          <div style={{ display:"flex", gap:16 }}>
            <div style={{ flex:1, background:C.okBg, borderRadius:8, padding:"8px 12px", border:`1.5px solid ${C.okBd}` }}>
              <div style={{ fontSize:11, color:C.ok, fontWeight:700 }}>① {t(E,"2-digit","2자리")}</div>
              <div style={{ fontWeight:800, color:C.ok }}>5 ✅</div>
            </div>
            <div style={{ flex:1, background:C.carryBg, borderRadius:8, padding:"8px 12px", border:`1.5px solid ${C.carryBd}` }}>
              <div style={{ fontSize:11, color:C.carry, fontWeight:700 }}>② {t(E,"3-digit ≤ 473","3자리 ≤ 473")}</div>
              <div style={{ fontWeight:800, color:C.carry }}>🤔</div>
            </div>
          </div>
        </div>),
    },
    // 5-5: Middle digits below N's
    { type: "input",
      narr: t(E,
        "N=473 starts with 4 → 4xx zone. Middle of N is 7. How many valid middle (4~9) below 7?",
        "N=473은 4로 시작 → 4xx 구간. N의 중간=7. 유효한 중간(4~9) 중 7 미만은?"),
      question: t(E, "Middle digits 4, 5, 6 (all < 7). Count = ?", "중간 자릿수 4, 5, 6 (전부 7 미만). 몇 개?"), answer: 3,
    },
    // 5-6: Multiply
    { type: "input",
      narr: t(E, "Each gets full last-digit range (5~9 = 5).", "각각에 마지막(5~9) 5가지."),
      question: "3 × 5 = ?", answer: 15,
    },
    // 5-7: Middle=7, last check
    { type: "input",
      narr: t(E,
        "Middle=7 (same as N): last digit of N=3. Valid last ≥5 AND ≤3?",
        "중간=7(N과 같을 때): N의 마지막=3. ≥5이면서 ≤3인 건?"),
      question: t(E, "How many digits both ≥5 and ≤3?", "≥5이면서 ≤3인 수?"), answer: 0,
    },
    // 5-8: Total
    { type: "input",
      narr: t(E, "Total for N=473:", "N=473 합계:"),
      question: t(E, "2-dig(5) + 3-dig(15+0) = ?", "2자리(5) + 3자리(15+0) = ?"), answer: 20,
    },
    // 5-9: Verify
    { type: "runner",
      narr: t(E, "Verify! Run N=473. Does it show 20?", "검증! N=473 돌려봐. 20 나올까?"),
    },
    // 5-10: Code
    { type: "code",
      narr: t(E, "O(log N) solution! Same logic you did by hand.", "O(log N) 풀이! 네가 손으로 한 것과 같은 로직."),
      code: OPT_CODE,
      label: t(E, "Show optimized code", "최적화 코드 보기"),
    },
  ];
}


// ═══════════════════════════════════════════════
// SIMULATOR VISUAL COMPONENTS
// ═══════════════════════════════════════════════

export function FindPView({ step }) {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ textAlign: "center", marginBottom: 16, fontFamily: "'JetBrains Mono',monospace" }}>
        <span style={{ fontSize: 48, fontWeight: 800, color: C.accent }}>{step.number}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 280, margin: "0 auto" }}>
        {step.pList.map((ps, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 14px", borderRadius: 10,
            background: ps.ok ? C.okBg : C.card, border: `2px solid ${ps.ok ? C.okBd : C.border}`,
            animation: i === step.pList.length - 1 ? "popIn .3s cubic-bezier(.34,1.56,.64,1)" : "none",
          }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: ps.ok ? C.ok : C.text, fontFamily: "'JetBrains Mono',monospace" }}>10{sup(ps.p)}={ps.v}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: ps.ok ? C.ok : C.no }}>{ps.ok ? `≥${step.number}✓` : `<${step.number}✗`}</span>
          </div>
        ))}
      </div>
      {step.pFound > 0 && (
        <div style={{ textAlign: "center", marginTop: 14, animation: "popIn .3s cubic-bezier(.34,1.56,.64,1)" }}>
          <span style={{ display: "inline-block", background: C.accentBg, border: `2px solid ${C.accentBd}`, borderRadius: 10, padding: "8px 22px", fontSize: 18, fontWeight: 800, color: C.accent, fontFamily: "'JetBrains Mono',monospace" }}>P={step.pFound}!</span>
        </div>
      )}
    </div>
  );
}

export function FindPExplainView({ step }) {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 10 }}>
        {step.digits.map((d, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{
              width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 9, fontSize: 22, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace",
              background: i === 0 ? C.lookBg : C.carryBg,
              border: `2px solid ${i === 0 ? C.lookBd : C.carryBd}`,
              color: i === 0 ? C.look : C.carry,
            }}>{d}</div>
            <div style={{ fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: i === 0 ? C.look : C.carry }}>
              {i === 0 ? `P=${step.P}` : "→0"}
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          {step.possibleResults.map((r, i) => (
            <div key={i} style={{
              padding: "8px 20px", borderRadius: 10, background: C.accentBg,
              border: `2px solid ${C.accentBd}`, fontSize: 22, fontWeight: 800,
              color: C.accent, fontFamily: "'JetBrains Mono',monospace",
            }}>{r}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DigitsView({ step, E }) {
  const { digits, focusIdx, bubble, bubbleType, bRef } = step;
  const styles = {
    look:  { bg: C.lookBg,  bd: C.lookBd,  c: C.look },
    carry: { bg: C.carryBg, bd: C.carryBd, c: C.carry },
    dim:   { bg: "#f1f5f9", bd: "#cbd5e1", c: "#64748b" },
  };
  const bc = styles[bubbleType] || styles.look;
  const hasFocus = focusIdx >= 0;

  return (
    <div style={{ padding: "12px 16px" }}>
      <div style={{ display: "flex", justifyContent: "center", minHeight: 36, alignItems: "flex-end", paddingBottom: 4 }}>
        {hasFocus && bubble && (
          <div style={{
            background: bc.bg, border: `2px solid ${bc.bd}`, borderRadius: 10,
            padding: "4px 14px", fontSize: 14, fontWeight: 800, color: bc.c,
            fontFamily: "'JetBrains Mono',monospace", textAlign: "center",
            whiteSpace: "pre-line", lineHeight: 1.5,
            animation: "popIn .25s cubic-bezier(.34,1.56,.64,1)",
          }}>{bubble}</div>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 6 }}>
        {digits.map((d, i) => {
          const isF = i === focusIdx;
          const inactive = hasFocus && !isF;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              {isF && bubble ? <div style={{ fontSize: 12, color: bc.c, lineHeight: 1 }}>▼</div> : <div style={{ height: 12 }} />}
              <div style={{
                width: isF ? 54 : 42, height: isF ? 54 : 42,
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: isF ? 13 : 9, fontSize: isF ? 28 : 20, fontWeight: 800,
                fontFamily: "'JetBrains Mono',monospace",
                background: isF ? bc.bg : C.card,
                border: `${isF ? 3 : 2}px solid ${isF ? bc.bd : C.border}`,
                color: inactive ? C.dimLight : isF ? bc.c : C.text,
                transition: "all .35s cubic-bezier(.34,1.56,.64,1)",
              }}>{d}</div>
              <div style={{ fontSize: 9, color: inactive ? "#ddd" : C.dimLight, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>
                {posName(digits.length - i, E)}
              </div>
            </div>
          );
        })}
      </div>
      {bRef !== undefined && (
        <div style={{ textAlign: "center", marginTop: 6 }}>
          <span style={{ fontSize: 11, color: C.bessie, fontWeight: 700, background: C.bessieBg, borderRadius: 6, padding: "3px 10px", border: `1px solid ${C.bessieBd}`, fontFamily: "'JetBrains Mono',monospace" }}>🐄 {bRef}</span>
        </div>
      )}
    </div>
  );
}

export function ResultView({ step }) {
  const isB = step.phase === "bessie_result";
  const col = isB ? C.bessie : C.elsie;
  const bg  = isB ? C.bessieBg : C.elsieBg;
  const bd  = isB ? C.bessieBd : C.elsieBd;
  return (
    <div style={{ padding: "28px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.dim, marginBottom: 6 }}>{isB ? "🐄 Bessie" : "🐮 Elsie"}</div>
      <div style={{
        display: "inline-block", background: `linear-gradient(135deg,${bg},${bd}33)`,
        border: `3px solid ${bd}`, borderRadius: 20, padding: "16px 40px",
        boxShadow: `0 6px 24px ${bd}44`, animation: "popIn .4s cubic-bezier(.34,1.56,.64,1)",
      }}>
        <div style={{ fontSize: 56, fontWeight: 900, color: col, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>{step.result}</div>
      </div>
      <div style={{ marginTop: 10, fontSize: 13, color: C.dim, fontFamily: "'JetBrains Mono',monospace" }}>{step.number} → {step.result}</div>
    </div>
  );
}

export function CompareView({ step }) {
  const borderCol = step.isDiff ? C.noBd : C.okBd;
  const numCol    = step.isDiff ? C.no  : C.ok;
  return (
    <div style={{ padding: "20px 16px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, fontFamily: "'JetBrains Mono',monospace" }}>
        {[["🐄", step.bessie, C.bessieBg], ["🐮", step.elsie, C.elsieBg]].map(([emoji, val, bg], i) => (
          <div key={i} style={{ background: bg, borderRadius: 14, padding: "12px 20px", border: `2px solid ${borderCol}` }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>{emoji}</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: numCol }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
