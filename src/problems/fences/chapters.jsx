import { C, t } from "../../theme";

/* ================================================================
   CODE BLOCK
   ================================================================ */
export const SOLUTION_CODE = [
  "N, M = map(int, input().split())",
  "count = [0] * M  # dots per column",
  "",
  "for i in range(N):",
  "    row = input()",
  "    for j in range(M):",
  "        if row[j] == '.':",
  "            count[j] += 1",
  "",
  "print(min(count))",
];


/* ═══════════════════════════════════════════════════════════════
   Chapter 1: 📋 문제 이해 (5 steps)
   ═══════════════════════════════════════════════════════════════ */
export function makeFencesCh1(E) {
  return [
    // 1-1: Title
    {
      type: "reveal",
      narr: t(E,
        "A grassy field needs fencing! Can you figure out the cheapest column to build a full fence? Let's find out! 🏗️",
        "풀밭에 울타리를 세워야 해! 가장 적은 비용으로 울타리를 완성할 열을 찾을 수 있을까? 알아보자! 🏗️"),
      content: (
        <div style={{ padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏗️</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#059669" }}>Building Fences</div>
          <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>MCC 2025 P1</div>
          <div style={{ marginTop: 12, background: "#ecfdf5", border: "2px solid #6ee7b7", borderRadius: 12, padding: 12, fontSize: 13, color: C.text, lineHeight: 1.8 }}>
            {t(E,
              "N×M grid of grass (.) and fences (#) → pick ONE column → make it ALL fences → minimize cost!",
              "N×M 그리드에 풀(.)과 울타리(#) → 열 하나를 골라 → 전부 울타리로 → 최소 비용!")}
          </div>
        </div>),
    },
    // 1-2: Grid explanation — full grid with animated pink column trace
    {
      type: "reveal",
      narr: t(E,
        "The field is a grid with N rows and M columns. Each cell is either grass (.) or already a fence (#). We pick ONE column (vertical!) and make it ALL fences!",
        "밭은 N행 M열 그리드야. 각 칸은 풀(.) 또는 이미 울타리(#). 열(세로줄!) 하나를 골라서 전부 울타리로 만들어야 해!"),
      content: (() => {
        const demo = [
          [".",".","#","."],
          [".","#",".","."],
          [".",".","#","."],
        ];
        const hiliteCol = 3;
        return (
          <div style={{ padding: 16 }}>
            <div style={{ background: "#ecfdf5", border: "2px solid #6ee7b7", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#059669", marginBottom: 10 }}>
                {t(E, "📋 What's Given", "📋 주어진 것")}
              </div>
              {/* Column labels */}
              <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 2 }}>
                {demo[0].map((_, c) => (
                  <div key={c} style={{
                    width: 36, textAlign: "center", fontSize: 10, fontWeight: 800,
                    fontFamily: "'JetBrains Mono',monospace",
                    color: c === hiliteCol ? "#fff" : "#9ca3af",
                    background: c === hiliteCol ? "#ec4899" : "transparent",
                    borderRadius: 4, padding: "1px 0",
                    animation: c === hiliteCol ? "popIn .4s ease both" : "none",
                    animationDelay: c === hiliteCol ? ".2s" : "0s",
                  }}>{t(E, `C${c+1}`, `${c+1}열`)}</div>
                ))}
              </div>
              {/* Grid rows */}
              {demo.map((row, r) => (
                <div key={r} style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 4 }}>
                  {row.map((ch, c) => {
                    const isFence = ch === "#";
                    const isHilite = c === hiliteCol;
                    return (
                      <div key={c} style={{
                        width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 800,
                        background: isFence ? "#374151" : "#bbf7d0",
                        border: `2.5px solid ${isFence ? "#6b7280" : "#4ade80"}`,
                        color: isFence ? "#fff" : "#166534",
                        animation: isHilite ? "colTrace .5s ease both" : "none",
                        animationDelay: isHilite ? `${0.4 + r * 0.35}s` : "0s",
                      }}>{ch}</div>
                    );
                  })}
                </div>
              ))}
              {/* Arrow + label — appears after cells animate */}
              <div style={{
                textAlign: "center", marginTop: 6, fontSize: 12, fontWeight: 800, color: "#ec4899",
                animation: "fadeIn .4s ease both", animationDelay: "1.6s",
              }}>
                ↑ {t(E, "This is one column (vertical!)", "이게 열 하나야 (세로줄!)")}
              </div>
              <div style={{
                fontSize: 12, color: "#059669", fontWeight: 700, textAlign: "center", marginTop: 8,
                animation: "fadeIn .4s ease both", animationDelay: "2s",
              }}>
                {t(E, "Make all 3 cells in this column → #", "이 열의 3칸을 전부 → # 으로!")}
              </div>
              <div style={{ marginTop: 10, fontSize: 13, color: C.text, lineHeight: 1.8, textAlign: "center" }}>
                <span style={{ background: "#bbf7d0", borderRadius: 4, padding: "2px 6px", fontWeight: 700, color: "#166534" }}>.</span>
                {t(E, " = grass (need to convert) ", " = 풀 (변환 필요) ")}
                <span style={{ background: "#374151", borderRadius: 4, padding: "2px 6px", fontWeight: 700, color: "#fff" }}>#</span>
                {t(E, " = fence (already done!)", " = 울타리 (이미 완료!)")}
              </div>
            </div>
          </div>
        );
      })(),
    },
    // 1-3: Quiz — full fence column
    {
      type: "quiz",
      narr: t(E,
        "A 'full fence column' means every cell in that column is a fence. Even one grass cell means it's not complete!",
        "'완전한 울타리 열'은 그 열의 모든 칸이 울타리란 뜻이야. 풀이 1개라도 있으면 미완성!"),
      question: t(E,
        "For a column to be a 'full fence column', what must be true?",
        "열이 '완전한 울타리 열'이 되려면?"),
      options: [
        t(E, "At least half must be #", "절반 이상이 #이면 된다"),
        t(E, "Just the top and bottom must be #", "맨 위와 맨 아래만 #이면 된다"),
        t(E, "Every cell in the column must be #", "열의 모든 칸이 #이어야 한다"),
      ],
      correct: 2,
      explain: t(E,
        "Right! ALL N cells must be fence. Even one grass cell means it's incomplete!",
        "맞아! N칸 전부 울타리여야 해. 풀이 1개라도 있으면 미완성!"),
    },
    // 1-4: Cost concept — shown as a vertical column
    {
      type: "reveal",
      narr: t(E,
        "Converting grass to fence costs effort! Each '.' you convert to '#' counts as 1. Cells already '#' are free!",
        "풀을 울타리로 바꾸는 건 비용이 들어! '.' → '#' 변환 1개당 비용 1. 이미 '#'인 칸은 공짜!"),
      content: (
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, alignItems: "flex-start" }}>
            {/* Vertical column cells */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#059669", fontFamily: "'JetBrains Mono',monospace", marginBottom: 2 }}>
                {t(E, "1 column", "열 1개")}
              </div>
              {[[".", true], ["#", false], [".", true], [".", true]].map(([ch, needWork], i) => (
                <div key={i} style={{
                  width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 6, fontSize: 18, fontWeight: 900,
                  fontFamily: "'JetBrains Mono',monospace",
                  background: needWork ? "#fef3c7" : "#d1fae5",
                  border: `2.5px solid ${needWork ? "#fbbf24" : "#6ee7b7"}`,
                  color: needWork ? "#92400e" : "#059669",
                }}>{ch}</div>
              ))}
            </div>
            {/* Cost explanation */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 190 }}>
              <div style={{ fontSize: 13, color: "#92400e", fontWeight: 800, marginBottom: 8, fontFamily: "'JetBrains Mono',monospace" }}>
                <span style={{ background: "#fef3c7", borderRadius: 4, padding: "2px 6px", border: "1.5px solid #fbbf24" }}>.</span>
                {t(E, " → convert! +1", " → 변환! +1")}
              </div>
              <div style={{ fontSize: 13, color: "#059669", fontWeight: 800, marginBottom: 12, fontFamily: "'JetBrains Mono',monospace" }}>
                <span style={{ background: "#d1fae5", borderRadius: 4, padding: "2px 6px", border: "1.5px solid #6ee7b7" }}>#</span>
                {t(E, " → free! +0", " → 공짜! +0")}
              </div>
              <div style={{ background: "#ecfdf5", borderRadius: 10, padding: "8px 12px", border: "2px solid #6ee7b7", textAlign: "center" }}>
                <div style={{ fontSize: 12, color: C.dim, fontWeight: 700, marginBottom: 2 }}>
                  {t(E, "Cost for this column", "이 열의 비용")}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 900, color: "#059669" }}>
                  3 × "." → "#" = <span style={{ fontSize: 22 }}>3</span>
                </div>
              </div>
            </div>
          </div>
        </div>),
    },
    // 1-5: Goal quiz — concrete grid with visible column costs
    {
      type: "reveal",
      narr: t(E,
        "We want the column with the MINIMUM cost — the one that already has the most fences!",
        "비용이 가장 적은 열을 찾아야 해 — 이미 울타리가 가장 많은 열!"),
      content: (() => {
        const g = [
          [".", "#", ".", "#"],
          [".", ".", "#", "#"],
          [".", "#", ".", "#"],
        ];
        // dots per col: [3, 1, 2, 0]
        return (
          <div style={{ padding: 16 }}>
            <div style={{ background: "#ecfdf5", border: "2px solid #6ee7b7", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#059669", marginBottom: 8 }}>
                {t(E, "3×4 grid — count dots per column!", "3×4 그리드 — 각 열의 점을 세봐!")}
              </div>
              {/* Column labels */}
              <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 2 }}>
                {g[0].map((_, c) => (
                  <div key={c} style={{
                    width: 36, textAlign: "center", fontSize: 10, fontWeight: 800,
                    fontFamily: "'JetBrains Mono',monospace",
                    color: c === 3 ? "#fff" : "#9ca3af",
                    background: c === 3 ? "#059669" : "transparent",
                    borderRadius: 4, padding: "1px 0",
                  }}>{t(E, `C${c+1}`, `${c+1}열`)}</div>
                ))}
              </div>
              {/* Grid */}
              {g.map((row, r) => (
                <div key={r} style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 4 }}>
                  {row.map((ch, c) => {
                    const isFence = ch === "#";
                    return (
                      <div key={c} style={{
                        width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 800,
                        background: isFence ? "#374151" : "#bbf7d0",
                        border: `2.5px solid ${c === 3 ? "#059669" : isFence ? "#6b7280" : "#4ade80"}`,
                        color: isFence ? "#fff" : "#166534",
                        boxShadow: c === 3 ? "0 0 6px rgba(5,150,105,.3)" : "none",
                      }}>{ch}</div>
                    );
                  })}
                </div>
              ))}
              {/* Dot counts per column */}
              <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 6 }}>
                {[3, 1, 2, 0].map((cnt, c) => (
                  <div key={c} style={{
                    width: 36, textAlign: "center", fontSize: 13, fontWeight: 900,
                    fontFamily: "'JetBrains Mono',monospace",
                    color: c === 3 ? "#fff" : "#059669",
                    background: c === 3 ? "#059669" : "#ecfdf5",
                    borderRadius: 6, padding: "4px 0",
                    border: `2px solid ${c === 3 ? "#059669" : "#6ee7b7"}`,
                  }}>{cnt}</div>
                ))}
              </div>
              <div style={{ textAlign: "center", fontSize: 11, color: C.dim, marginTop: 4 }}>
                {t(E, "↑ dots per column (= cost)", "↑ 열별 점 수 (= 비용)")}
              </div>
              {/* Answer highlight */}
              <div style={{
                marginTop: 10, textAlign: "center", fontSize: 14, fontWeight: 900, color: "#059669",
                animation: "fadeIn .4s ease both", animationDelay: ".5s",
              }}>
                {t(E,
                  "4th column: 0 dots → cost 0 → cheapest! 🎯",
                  "4열: 점 0개 → 비용 0 → 가장 싸! 🎯")}
              </div>
            </div>
          </div>
        );
      })(),
    },
    // 1-6: Confirm understanding quiz
    {
      type: "quiz",
      narr: t(E,
        "Let's make sure you got it! In the grid we just saw, the dot counts were [3, 1, 2, 0]. Which column should we pick?",
        "제대로 이해했는지 확인! 방금 본 그리드에서 점 수가 [3, 1, 2, 0]이었어. 어떤 열을 골라야 해?"),
      question: t(E,
        "Dot counts: 1st=3, 2nd=1, 3rd=2, 4th=0. Pick which?",
        "점 수: 1열=3, 2열=1, 3열=2, 4열=0. 어떤 열?"),
      options: [
        t(E, "2nd column (1 dot = cost 1)", "2열 (점 1개 = 비용 1)"),
        t(E, "4th column (0 dots = cost 0!)", "4열 (점 0개 = 비용 0!)"),
        t(E, "1st column (3 dots = cost 3)", "1열 (점 3개 = 비용 3)"),
      ],
      correct: 1,
      explain: t(E,
        "The 4th column has 0 dots — already all fences! Cost = 0, the minimum! 🎯",
        "4열은 점이 0개 — 이미 전부 울타리! 비용 = 0, 최솟값! 🎯"),
    },
  ];
}


/* ═══════════════════════════════════════════════════════════════
   Chapter 2: 🏗️ 시뮬레이션 (4 steps)
   ═══════════════════════════════════════════════════════════════ */
export function makeFencesCh2(E) {
  return [
    // 2-1: Column scanner animation
    {
      type: "fenceColumnScanner",
      narr: t(E,
        "Press ▶ Scan to watch! It counts dots in each column, one by one. The column with the fewest dots is the cheapest! Then try it yourself! 👀",
        "▶ 스캔을 눌러봐! 각 열의 점을 하나씩 세는 걸 볼 수 있어. 점이 가장 적은 열이 가장 싸! 그다음 직접 해봐! 👀"),
    },
    // 2-2: Observation quiz
    {
      type: "quiz",
      narr: t(E,
        "Did you notice? The answer is simply the MINIMUM number of '.' across all columns!",
        "눈치챘어? 답은 그냥 모든 열 중 '.'의 최솟값이야!"),
      question: t(E,
        "What is the answer to this problem?",
        "이 문제의 답은 뭐야?"),
      options: [
        t(E, "The total '.' count in the whole grid", "그리드 전체 '.' 합계"),
        t(E, "The number of columns with at least one '#'", "'#'이 하나라도 있는 열의 수"),
        t(E, "The minimum '.' count in any column", "열별 '.' 개수의 최솟값"),
      ],
      correct: 2,
      explain: t(E,
        "Count '.' per column, take the minimum. That's the entire algorithm!",
        "열별 '.' 수를 세고 최솟값을 구하면 끝!"),
    },
    // 2-3: Hand calculation 1
    {
      type: "input",
      narr: t(E,
        "By hand! 3×4 grid — dots (.) per column: 3, 1, 2, 0. What's the minimum cost?",
        "손으로! 3×4 그리드 — 열별 점(.) 수: 3, 1, 2, 0. 최소 비용은?"),
      question: t(E,
        "Dots per column: 3, 1, 2, 0\nMin cost = ?",
        "열별 점(.) 수: 3, 1, 2, 0\n최소 비용 = ?"),
      answer: 0,
    },
    // 2-4: Hand calculation 2
    {
      type: "input",
      narr: t(E,
        "Another one! 3×3 grid — dots (.) per column: 1, 1, 3. What's the minimum cost?",
        "하나 더! 3×3 그리드 — 열별 점(.) 수: 1, 1, 3. 최소 비용은?"),
      question: t(E,
        "Dots per column: 1, 1, 3\nMin cost = ?",
        "열별 점(.) 수: 1, 1, 3\n최소 비용 = ?"),
      answer: 1,
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
        background: hl && hl.includes(i) ? "rgba(5,150,105,.15)" : "transparent",
        borderRadius: 4, padding: "0 4px",
      }}>
        <span style={{ color: "#4b5563", width: 24, textAlign: "right", marginRight: 10, flexShrink: 0, userSelect: "none", fontSize: 10 }}>{i + 1}</span>
        <span style={{ whiteSpace: "pre", color: hl && hl.includes(i) ? "#6ee7b7" : "#e2e8f0" }}>{l}</span>
      </div>
    ))}
  </div>
);

export function makeFencesCh3(E) {
  return [
    // 3-1: Step 1 — Read N, M
    {
      type: "reveal",
      narr: t(E,
        "Let's build the code step by step! First, we need to know the grid size. The input gives us N (rows) and M (columns) on the first line.",
        "코드를 한 줄씩 만들어보자! 먼저 그리드 크기를 알아야 해. 입력 첫 줄에 N(행 수)과 M(열 수)이 주어져."),
      content: (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#059669", marginBottom: 6 }}>
            {t(E, "Step 1: Read the grid size", "1단계: 그리드 크기 읽기")}
          </div>
          <div style={{ fontSize: 12, color: C.dim, marginBottom: 4, lineHeight: 1.6 }}>
            {t(E,
              "Input first line: \"4 5\" means 4 rows, 5 columns",
              "입력 첫 줄: \"4 5\" → 4행, 5열")}
          </div>
          <CodeSnippet lines={["N, M = map(int, input().split())"]} highlight={[0]} />
          <div style={{ fontSize: 11, color: C.dim, marginTop: 6, lineHeight: 1.5 }}>
            {t(E,
              "input().split() reads \"4 5\" → [\"4\", \"5\"], map(int, ...) makes them numbers.",
              "input().split()은 \"4 5\" → [\"4\", \"5\"]로 나누고, map(int, ...)로 숫자로 바꿔.")}
          </div>
        </div>),
    },
    // 3-2: Step 2 — Prepare count list
    {
      type: "reveal",
      narr: t(E,
        "We need to count dots per column. So we make a list with M zeros — one slot for each column!",
        "열마다 점을 세야 하니까, M개의 0이 들어간 리스트를 만들어야 해 — 열마다 자리 하나!"),
      content: (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#059669", marginBottom: 6 }}>
            {t(E, "Step 2: Prepare the count list", "2단계: 카운트 리스트 준비")}
          </div>
          <div style={{ fontSize: 12, color: C.dim, marginBottom: 4, lineHeight: 1.6 }}>
            {t(E,
              "5 columns → count = [0, 0, 0, 0, 0]. Each slot will store how many dots that column has.",
              "5열이면 → count = [0, 0, 0, 0, 0]. 각 칸에 그 열의 점 수를 저장할 거야.")}
          </div>
          <CodeSnippet
            lines={["N, M = map(int, input().split())", "count = [0] * M"]}
            highlight={[1]}
          />
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 10 }}>
            {[0,0,0,0,0].map((v, i) => (
              <div key={i} style={{
                width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 6, fontSize: 14, fontWeight: 900,
                fontFamily: "'JetBrains Mono',monospace",
                background: "#ecfdf5", border: "2px solid #6ee7b7", color: "#059669",
              }}>{v}</div>
            ))}
          </div>
          <div style={{ textAlign: "center", fontSize: 10, color: C.dim, marginTop: 4 }}>
            {t(E, "count = [0, 0, 0, 0, 0]  (one per column)", "count = [0, 0, 0, 0, 0]  (열마다 하나)")}
          </div>
        </div>),
    },
    // 3-3: Interactive row-to-column visualization
    {
      type: "rowColumnFillViz",
      narr: t(E,
        "Watch how the code reads row by row, but counts are accumulated per column! Press ▶ to step through.",
        "코드가 행을 하나씩 읽으면서 열별 카운터가 어떻게 채워지는지 봐! ▶를 눌러서 한 스텝씩 진행해봐."),
    },
    // 3-4: Step 3 quiz — understanding the loop
    {
      type: "quiz",
      narr: t(E,
        "As you just saw, the code reads row by row. Quick check — why is the outer loop over rows (N)?",
        "방금 봤듯이 코드는 행을 하나씩 읽어. 확인 — 바깥 반복이 행(N)인 이유가 뭘까?"),
      question: t(E,
        "Why is the OUTER loop over rows (N)?",
        "바깥 반복문이 행(N)인 이유는?"),
      options: [
        t(E, "Rows are always bigger than columns", "행이 항상 열보다 크니까"),
        t(E, "Input comes one row at a time, so we read row by row", "입력이 한 줄(행)씩 오니까 행 단위로 읽어야 해"),
        t(E, "It doesn't matter, either order works", "순서 상관없어"),
      ],
      correct: 1,
      explain: t(E,
        "Input gives us one row per line! So we MUST read row by row. Inside each row, we check all columns.",
        "입력이 한 줄에 한 행씩 오니까 행 단위로 읽어야 해! 각 행 안에서 모든 열을 확인하는 거야."),
    },
    // 3-5: Step 4 — Print the answer
    {
      type: "reveal",
      narr: t(E,
        "After counting all dots per column, just print the minimum! Python's min() does this in one line.",
        "모든 열의 점을 다 세고 나면, 최솟값만 출력하면 끝! Python의 min()이 한 줄로 해줘."),
      content: (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#059669", marginBottom: 6 }}>
            {t(E, "Step 4: Print the answer!", "4단계: 답 출력!")}
          </div>
          <CodeSnippet
            lines={[
              "N, M = map(int, input().split())",
              "count = [0] * M",
              "",
              "for i in range(N):",
              "    row = input()",
              "    for j in range(M):",
              "        if row[j] == '.':",
              "            count[j] += 1",
              "",
              "print(min(count))",
            ]}
            highlight={[9]}
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
    // 3-6: Final — full code reveal
    {
      type: "code",
      narr: t(E,
        "Here's the complete solution again. You built every line yourself! 🎉",
        "전체 풀이 코드야. 모든 줄을 직접 만들었어! 🎉"),
      code: SOLUTION_CODE,
      label: t(E, "Show complete code", "전체 코드 보기"),
    },
  ];
}
