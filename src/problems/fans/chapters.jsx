import { C, t } from "../../theme";

/* ================================================================
   SOLUTION CODE
   ================================================================ */
export const SOLUTION_CODE = [
  "T = int(input())",
  "for _ in range(T):",
  "    N = int(input())",
  "    c = list(map(int, input().split()))",
  "    total = sum(c)",
  "    max_c = max(c)",
  "    rest = total - max_c",
  "    print(min(total, 2 * rest + 1))",
];


/* ═══════════════════════════════════════════════════════════════
   Chapter 1: 📋 문제 이해 (7 steps)
   ═══════════════════════════════════════════════════════════════ */
export function makeFansCh1(E) {
  return [
    // 1-1: Title
    {
      type: "reveal",
      narr: t(E,
        "Let's make a colorful fan! We have sticks of different colors and need to line them up so no two same-color sticks touch. How many can we use? 🪭",
        "알록달록 부채를 만들자! 여러 색깔의 막대를 같은 색끼리 안 닿게 줄 세워야 해. 최대 몇 개 쓸 수 있을까? 🪭"),
      content: (
        <div style={{ padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🪭</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#d97706" }}>Fans</div>
          <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>MCC 2025 P2</div>
          <div style={{ marginTop: 12, background: "#fffbeb", border: "2px solid #fbbf24", borderRadius: 12, padding: 12, fontSize: 13, color: C.text, lineHeight: 1.8 }}>
            {t(E,
              "N colors of sticks → line them up → no two adjacent same color → maximize length!",
              "N가지 색 막대 → 한 줄로 배치 → 인접한 같은 색 금지 → 최대 길이!")}
          </div>
        </div>),
    },
    // 1-2: Rule explanation with visual
    {
      type: "reveal",
      narr: t(E,
        "The rule is simple: no two sticks next to each other can be the same color! Let's see what's OK and what's NOT.",
        "규칙은 간단해: 옆에 같은 색 막대가 오면 안 돼! 뭐가 되고 뭐가 안 되는지 보자."),
      content: (() => {
        const colors = ["#ef4444", "#3b82f6", "#ef4444", "#22c55e", "#3b82f6"];
        const bad = ["#ef4444", "#ef4444", "#3b82f6", "#22c55e", "#3b82f6"];
        const stickW = 28, stickH = 50, gap = 4;
        const renderSticks = (arr, label, ok) => (
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "center", gap, marginBottom: 4 }}>
              {arr.map((col, i) => (
                <div key={i} style={{
                  width: stickW, height: stickH, borderRadius: 6,
                  background: col, border: `2px solid ${col}`,
                  boxShadow: `0 2px 6px ${col}44`,
                }} />
              ))}
            </div>
            <div style={{
              fontSize: 12, fontWeight: 800,
              color: ok ? "#16a34a" : "#dc2626",
            }}>{ok ? "✅ " : "❌ "}{label}</div>
          </div>
        );
        return (
          <div style={{ padding: 16 }}>
            {renderSticks(colors, t(E, "OK! All neighbors differ", "OK! 옆 색이 다 다름"), true)}
            {renderSticks(bad, t(E, "NO! Red-Red adjacent!", "안 돼! 빨강-빨강 인접!"), false)}
            <div style={{
              background: "#fef3c7", borderRadius: 8, padding: "8px 10px",
              border: "1.5px solid #fbbf24", fontSize: 12, color: "#92400e",
              fontWeight: 700, textAlign: "center",
            }}>
              💡 {t(E,
                "Adjacent = right next to each other. Same color neighbors are NOT allowed!",
                "인접 = 바로 옆. 같은 색이 옆에 오면 안 돼!")}
            </div>
          </div>
        );
      })(),
    },
    // 1-3: Quiz — understanding the rule
    {
      type: "quiz",
      narr: t(E,
        "Quick check! Which arrangement follows the rule?",
        "확인! 어떤 배치가 규칙을 따를까?"),
      question: t(E,
        "4 sticks: 2 red, 2 blue. Which is valid?",
        "막대 4개: 빨강 2, 파랑 2. 어떤 게 맞아?"),
      options: [
        t(E, "Red Red Blue Blue", "빨빨파파"),
        t(E, "Red Blue Blue Red", "빨파파빨"),
        t(E, "Red Blue Red Blue", "빨파빨파"),
      ],
      correct: 2,
      explain: t(E,
        "Red Blue Red Blue — every neighbor is different! The other two have same-color neighbors.",
        "빨파빨파 — 모든 이웃이 다른 색! 나머지는 같은 색이 붙어 있어."),
    },
    // 1-4: The "dominant color" problem
    {
      type: "reveal",
      narr: t(E,
        "What if one color has WAY more sticks than the others? That's the key challenge!",
        "한 색이 다른 색보다 훨씬 많으면 어떻게 될까? 이게 핵심이야!"),
      content: (() => {
        const R = "#ef4444", B = "#3b82f6", G = "#22c55e";
        return (
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#d97706", marginBottom: 8 }}>
              {t(E, "Example: Red=7, Blue=2, Green=2", "예시: 빨강=7, 파랑=2, 초록=2")}
            </div>
            {/* All sticks available */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: C.dim, fontWeight: 700, marginBottom: 4 }}>
                {t(E, "Available sticks:", "사용 가능한 막대:")}
              </div>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center" }}>
                {Array(7).fill(R).concat(Array(2).fill(B), Array(2).fill(G)).map((col, i) => (
                  <div key={i} style={{
                    width: 24, height: 36, borderRadius: 4,
                    background: col, border: `1.5px solid ${col}`,
                  }} />
                ))}
              </div>
              <div style={{ fontSize: 10, color: C.dim, marginTop: 2, textAlign: "center" }}>
                {t(E, "Total: 11 sticks", "총합: 11개")}
              </div>
            </div>
            {/* Best arrangement */}
            <div style={{
              background: "#ecfdf5", borderRadius: 10, padding: 10,
              border: "2px solid #6ee7b7",
            }}>
              <div style={{ fontSize: 11, color: "#059669", fontWeight: 700, marginBottom: 4 }}>
                {t(E, "Best arrangement (5 sticks):", "최선의 배치 (5개):")}
              </div>
              <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                {[R, B, R, G, R].map((col, i) => (
                  <div key={i} style={{
                    width: 28, height: 42, borderRadius: 5,
                    background: col, border: `2px solid ${col}`,
                    boxShadow: `0 2px 6px ${col}44`,
                  }} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: "#059669", fontWeight: 800, marginTop: 6, textAlign: "center" }}>
                {t(E,
                  "R B R G R — only 5 out of 11! 😢",
                  "빨 파 빨 초 빨 — 11개 중 5개만! 😢")}
              </div>
            </div>
            <div style={{ fontSize: 11, color: C.dim, marginTop: 8, textAlign: "center", lineHeight: 1.6 }}>
              {t(E,
                "Red has too many! The 'others' (4 sticks) act as separators. Each separator lets us place 1 more red.",
                "빨강이 너무 많아! '나머지' (4개)가 분리자 역할. 분리자 1개당 빨강 1개 더 놓을 수 있어.")}
            </div>
          </div>
        );
      })(),
    },
    // 1-5: The formula concept
    {
      type: "reveal",
      narr: t(E,
        "Here's the key insight: the 'rest' sticks (everything except the biggest group) are separators for the dominant color!",
        "핵심 아이디어: '나머지' 막대(가장 많은 색 제외)가 가장 많은 색의 분리자야!"),
      content: (() => {
        const R = "#ef4444", G = "#d1d5db";
        return (
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#d97706", marginBottom: 10 }}>
              {t(E, "Separator concept", "분리자 개념")}
            </div>
            {/* Visual: slots */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: C.dim, fontWeight: 700, marginBottom: 4, textAlign: "center" }}>
                {t(E, "rest = 2 separators → can place 3 dominant", "나머지 = 2개 분리자 → 가장 많은 색 3개 배치 가능")}
              </div>
              <div style={{ display: "flex", gap: 3, justifyContent: "center", alignItems: "center" }}>
                {[R, G, R, G, R].map((col, i) => (
                  <div key={i} style={{
                    width: 32, height: 44, borderRadius: 5,
                    background: col === R ? col : "transparent",
                    border: `2.5px ${col === R ? "solid" : "dashed"} ${col === R ? col : "#9ca3af"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800, color: col === R ? "#fff" : "#9ca3af",
                  }}>{col === R ? t(E, "MAX", "최대") : t(E, "sep", "분리")}</div>
                ))}
              </div>
            </div>
            {/* Formula box */}
            <div style={{
              background: "#fffbeb", borderRadius: 10, padding: 12,
              border: "2px solid #fbbf24", textAlign: "center",
            }}>
              <div style={{ fontSize: 12, color: C.dim, fontWeight: 700, marginBottom: 6 }}>
                {t(E, "The formula:", "공식:")}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 900, color: "#d97706", lineHeight: 2 }}>
                total = {t(E, "sum of all", "전체 합")}<br />
                max_c = {t(E, "biggest group", "가장 큰 그룹")}<br />
                rest = total - max_c<br />
                <span style={{ fontSize: 16 }}>
                  {t(E, "answer", "답")} = min(total, 2×rest+1)
                </span>
              </div>
            </div>
          </div>
        );
      })(),
    },
    // 1-6: Quiz — apply the formula
    {
      type: "quiz",
      narr: t(E,
        "Let's verify! Counts = [3, 7, 2]. Total = 12, max = 7, rest = 5. What's the answer?",
        "확인해보자! 개수 = [3, 7, 2]. 합계 = 12, 최대 = 7, 나머지 = 5. 답은?"),
      question: t(E,
        "min(12, 2×5+1) = min(12, 11) = ?",
        "min(12, 2×5+1) = min(12, 11) = ?"),
      options: [
        t(E, "12 (use all)", "12 (전부 사용)"),
        t(E, "11", "11"),
        t(E, "10", "10"),
      ],
      correct: 1,
      explain: t(E,
        "min(12, 11) = 11! The dominant color (7) is too many — we can only use 11 sticks.",
        "min(12, 11) = 11! 가장 많은 색(7)이 너무 많아서 11개만 쓸 수 있어."),
    },
    // 1-7: Quiz — when all fit
    {
      type: "quiz",
      narr: t(E,
        "Another example! Counts = [3, 3, 3]. Total = 9, max = 3, rest = 6. Can we use all 9?",
        "다른 예시! 개수 = [3, 3, 3]. 합계 = 9, 최대 = 3, 나머지 = 6. 9개 다 쓸 수 있을까?"),
      question: t(E,
        "min(9, 2×6+1) = min(9, 13) = ?",
        "min(9, 2×6+1) = min(9, 13) = ?"),
      options: [
        t(E, "13", "13"),
        t(E, "9 (use all!)", "9 (전부 사용!)"),
        t(E, "7", "7"),
      ],
      correct: 1,
      explain: t(E,
        "min(9, 13) = 9! rest (6) is large enough, so all sticks fit. ABCABCABC works!",
        "min(9, 13) = 9! 나머지(6)가 충분해서 전부 사용 가능. ABCABCABC로 배치!"),
    },
  ];
}


/* ═══════════════════════════════════════════════════════════════
   Chapter 2: 🏗️ 시뮬레이션 (4 steps)
   ═══════════════════════════════════════════════════════════════ */
export function makeFansCh2(E) {
  return [
    // 2-1: Interactive stick arranger
    {
      type: "fanSimulator",
      narr: t(E,
        "Try it! Adjust the stick counts and see how the formula works. Watch the sticks arrange themselves! 🪭",
        "해봐! 막대 수를 조정하고 공식이 어떻게 작동하는지 봐. 막대가 배치되는 걸 봐! 🪭"),
    },
    // 2-2: Observation quiz
    {
      type: "quiz",
      narr: t(E,
        "When the biggest group has fewer sticks than all other groups combined (plus 1), what happens?",
        "가장 큰 그룹이 나머지 그룹 합(+1)보다 적으면 어떻게 될까?"),
      question: t(E,
        "If max_c <= rest + 1, the answer is...?",
        "max_c <= rest + 1이면 답은...?"),
      options: [
        t(E, "2 × rest + 1", "2 × rest + 1"),
        t(E, "max_c only", "max_c만"),
        t(E, "total (use everything!)", "total (전부 사용!)"),
      ],
      correct: 2,
      explain: t(E,
        "When the dominant color isn't too greedy, we can use ALL sticks! The rest provides enough separators.",
        "가장 많은 색이 너무 많지 않으면 전부 사용 가능! 나머지가 충분한 분리자 역할을 해."),
    },
    // 2-3: Hand calculation 1
    {
      type: "input",
      narr: t(E,
        "Try it yourself! Counts = [5, 1, 1]. Total = 7, max = 5, rest = 2.",
        "직접 해봐! 개수 = [5, 1, 1]. 합계 = 7, 최대 = 5, 나머지 = 2."),
      question: t(E,
        "min(7, 2×2+1) = ?",
        "min(7, 2×2+1) = ?"),
      answer: 5,
    },
    // 2-4: Hand calculation 2
    {
      type: "input",
      narr: t(E,
        "One more! Counts = [4, 4, 4]. Total = 12, max = 4, rest = 8.",
        "하나 더! 개수 = [4, 4, 4]. 합계 = 12, 최대 = 4, 나머지 = 8."),
      question: t(E,
        "min(12, 2×8+1) = ?",
        "min(12, 2×8+1) = ?"),
      answer: 12,
    },
  ];
}


/* ═══════════════════════════════════════════════════════════════
   Chapter 3: ⚡ 코드 — step-by-step code building
   ═══════════════════════════════════════════════════════════════ */

/* Helper: code snippet box */
const CodeSnippet = ({ lines, highlight: hl }) => (
  <div style={{
    background: "#1e293b", borderRadius: 10, padding: "10px 8px",
    overflowX: "auto", fontSize: 12, lineHeight: 1.8,
    fontFamily: "'JetBrains Mono', monospace", marginTop: 8,
  }}>
    {lines.map((l, i) => (
      <div key={i} style={{
        display: "flex", minHeight: 20,
        background: hl && hl.includes(i) ? "rgba(217,119,6,.15)" : "transparent",
        borderRadius: 4, padding: "0 4px",
      }}>
        <span style={{ color: "#4b5563", width: 24, textAlign: "right", marginRight: 10, flexShrink: 0, userSelect: "none", fontSize: 10 }}>{i + 1}</span>
        <span style={{ whiteSpace: "pre", color: hl && hl.includes(i) ? "#fbbf24" : "#e2e8f0" }}>{l}</span>
      </div>
    ))}
  </div>
);

export function makeFansCh3(E) {
  return [
    // 3-1: Read T and loop
    {
      type: "reveal",
      narr: t(E,
        "Let's build the code! First, we have T test cases. We read T and loop through each one.",
        "코드를 만들어보자! 먼저 T개의 테스트 케이스가 있어. T를 읽고 반복해."),
      content: (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#d97706", marginBottom: 6 }}>
            {t(E, "Step 1: Handle test cases", "1단계: 테스트 케이스 처리")}
          </div>
          <div style={{ fontSize: 12, color: C.dim, marginBottom: 4, lineHeight: 1.6 }}>
            {t(E,
              "Input starts with T (number of test cases). We loop T times.",
              "입력 첫 줄에 T(테스트 케이스 수). T번 반복해.")}
          </div>
          <CodeSnippet
            lines={["T = int(input())", "for _ in range(T):"]}
            highlight={[0, 1]}
          />
          <div style={{ fontSize: 11, color: C.dim, marginTop: 6, lineHeight: 1.5 }}>
            {t(E,
              "The _ means we don't need the loop variable — we just repeat T times.",
              "_ 는 루프 변수가 필요 없다는 뜻 — 그냥 T번 반복해.")}
          </div>
        </div>),
    },
    // 3-2: Read N and counts
    {
      type: "reveal",
      narr: t(E,
        "For each test case, read N (number of colors) and then the list of stick counts.",
        "각 테스트 케이스마다 N(색 수)을 읽고, 막대 수 리스트를 읽어."),
      content: (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#d97706", marginBottom: 6 }}>
            {t(E, "Step 2: Read the data", "2단계: 데이터 읽기")}
          </div>
          <CodeSnippet
            lines={[
              "T = int(input())",
              "for _ in range(T):",
              "    N = int(input())",
              "    c = list(map(int, input().split()))",
            ]}
            highlight={[2, 3]}
          />
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 10 }}>
            {[3, 7, 2].map((v, i) => (
              <div key={i} style={{
                width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 6, fontSize: 14, fontWeight: 900,
                fontFamily: "'JetBrains Mono',monospace",
                background: "#fffbeb", border: "2px solid #fbbf24", color: "#d97706",
              }}>{v}</div>
            ))}
          </div>
          <div style={{ textAlign: "center", fontSize: 10, color: C.dim, marginTop: 4 }}>
            c = [3, 7, 2]
          </div>
        </div>),
    },
    // 3-3: Compute total, max, rest
    {
      type: "reveal",
      narr: t(E,
        "Now compute the three key values: total, max_c, and rest!",
        "이제 세 가지 핵심 값을 계산해: total, max_c, rest!"),
      content: (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#d97706", marginBottom: 6 }}>
            {t(E, "Step 3: The three key values", "3단계: 세 가지 핵심 값")}
          </div>
          <CodeSnippet
            lines={[
              "T = int(input())",
              "for _ in range(T):",
              "    N = int(input())",
              "    c = list(map(int, input().split()))",
              "    total = sum(c)",
              "    max_c = max(c)",
              "    rest = total - max_c",
            ]}
            highlight={[4, 5, 6]}
          />
          {/* Visual trace with [3,7,2] */}
          <div style={{
            marginTop: 10, background: "#fffbeb", borderRadius: 10,
            padding: 10, border: "2px solid #fbbf24",
          }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#d97706", marginBottom: 4 }}>
              {t(E, "Example: c = [3, 7, 2]", "예시: c = [3, 7, 2]")}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: 13,
              fontWeight: 700, color: C.text, lineHeight: 2,
            }}>
              total = 3 + 7 + 2 = <span style={{ color: "#d97706", fontWeight: 900 }}>12</span><br />
              max_c = max(3, 7, 2) = <span style={{ color: "#dc2626", fontWeight: 900 }}>7</span><br />
              rest = 12 - 7 = <span style={{ color: "#059669", fontWeight: 900 }}>5</span>
            </div>
          </div>
        </div>),
    },
    // 3-4: The formula line
    {
      type: "reveal",
      narr: t(E,
        "Finally, apply the formula and print! Just one line: min(total, 2*rest+1).",
        "마지막으로 공식 적용하고 출력! 한 줄이면 돼: min(total, 2*rest+1)."),
      content: (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#d97706", marginBottom: 6 }}>
            {t(E, "Step 4: Apply the formula!", "4단계: 공식 적용!")}
          </div>
          <CodeSnippet
            lines={[
              "T = int(input())",
              "for _ in range(T):",
              "    N = int(input())",
              "    c = list(map(int, input().split()))",
              "    total = sum(c)",
              "    max_c = max(c)",
              "    rest = total - max_c",
              "    print(min(total, 2 * rest + 1))",
            ]}
            highlight={[7]}
          />
          <div style={{
            marginTop: 10, background: "#d1fae5", borderRadius: 10,
            padding: "8px 12px", border: "2px solid #6ee7b7", textAlign: "center",
          }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#059669" }}>
              {t(E, "That's the complete code! Just 8 lines! 🎉", "이게 전체 코드! 단 8줄! 🎉")}
            </div>
          </div>
        </div>),
    },
    // 3-5: Walkthrough — formula visualizer
    {
      type: "formulaTrace",
      narr: t(E,
        "Let's trace through sample inputs step by step! Watch how the formula computes the answer.",
        "샘플 입력을 하나씩 따라가 보자! 공식이 어떻게 답을 계산하는지 봐."),
    },
    // 3-6: Full code reveal
    {
      type: "code",
      narr: t(E,
        "Here's the complete solution! Simple and elegant. 🎉",
        "전체 풀이 코드야! 간단하고 깔끔해. 🎉"),
      code: SOLUTION_CODE,
      label: t(E, "Show complete code", "전체 코드 보기"),
    },
  ];
}
