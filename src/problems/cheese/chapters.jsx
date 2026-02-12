import { C, t } from "../../theme";
import { highlight } from "../../components/shared";

/* ================================================================
   HELPERS
   ================================================================ */

export function bruteCount(N, carved) {
  const isCarved = new Set(carved.map(([x,y,z]) => `${x},${y},${z}`));
  let count = 0;
  for (let x = 0; x < N; x++)
    for (let y = 0; y < N; y++) {
      let allGone = true;
      for (let z = 0; z < N; z++) if (!isCarved.has(`${x},${y},${z}`)) { allGone = false; break; }
      if (allGone) count++;
    }
  for (let y = 0; y < N; y++)
    for (let z = 0; z < N; z++) {
      let allGone = true;
      for (let x = 0; x < N; x++) if (!isCarved.has(`${x},${y},${z}`)) { allGone = false; break; }
      if (allGone) count++;
    }
  for (let x = 0; x < N; x++)
    for (let z = 0; z < N; z++) {
      let allGone = true;
      for (let y = 0; y < N; y++) if (!isCarved.has(`${x},${y},${z}`)) { allGone = false; break; }
      if (allGone) count++;
    }
  return count;
}

/* ================================================================
   CODE BLOCKS
   ================================================================ */
export const CH_BRUTE = [
  "for _ in range(Q):",
  "    x, y, z = map(int, input().split())",
  "    cheese[x][y][z] = False",
  "    count = 0",
  "    for a in range(N):        # z-방향: N² 직선",
  "        for b in range(N):",
  "            if all(not cheese[a][b][c] for c in range(N)):",
  "                count += 1",
  "    for b in range(N):        # x-방향: N² 직선",
  "        for c in range(N):",
  "            if all(not cheese[a][b][c] for a in range(N)):",
  "                count += 1",
  "    for a in range(N):        # y-방향: N² 직선",
  "        for c in range(N):",
  "            if all(not cheese[a][b][c] for b in range(N)):",
  "                count += 1",
  "    print(count)",
];

export const USER_CODE_ORIG = [
  "import sys",
  "from collections import defaultdict",
  "input = sys.stdin.readline",
  "",
  "n, q = map(int, input().split())",
  "",
  "xy_dict = defaultdict(int)",
  "yz_dict = defaultdict(int)",
  "xz_dict = defaultdict(int)",
  "",
  "count = 0",
  "for _ in range(q):",
  "  x, y, z = map(int, input().split())",
  "",
  "  xy_dict[(x,y)] += 1",
  "  yz_dict[(y,z)] += 1",
  "  xz_dict[(x,z)] += 1",
  "",
  "  if xy_dict[(x,y)] == n:",
  "    count += 1",
  "    xy_dict[(x,y)] += 1  # ← 불필요한 방어코드",
  "  if yz_dict[(y,z)] == n:",
  "    count += 1",
  "    yz_dict[(y,z)] += 1  # ← 불필요한 방어코드",
  "  if xz_dict[(x,z)] == n:",
  "    count += 1",
  "    xz_dict[(x,z)] += 1  # ← 불필요한 방어코드",
  "  print(count)",
];

export const USER_CODE_CLEAN = [
  "import sys",
  "from collections import defaultdict",
  "input = sys.stdin.readline",
  "",
  "N, Q = map(int, input().split())",
  "",
  "xy = defaultdict(int)  # z-방향: (x,y) 쌍",
  "yz = defaultdict(int)  # x-방향: (y,z) 쌍",
  "xz = defaultdict(int)  # y-방향: (x,z) 쌍",
  "",
  "count = 0",
  "for _ in range(Q):",
  "  x, y, z = map(int, input().split())",
  "  for d, key in [(xy,(x,y)), (yz,(y,z)), (xz,(x,z))]:",
  "    d[key] += 1",
  "    if d[key] == N:",
  "      count += 1",
  "  print(count)",
];


/* ═══════════════════════════════════════════════════════════════
   Chapter 1: 📋 문제 이해 (5 steps)
   
   목표: 아이가 "치즈에서 블록 빼고, 막대 넣는 게임"을 이해
   변경: 어려운 용어 없이 비유로 시작
   ═══════════════════════════════════════════════════════════════ */
export function makeCheeseCh1(E) {
  return [
    // 1-1: 호기심 먼저! 질문으로 시작
    {
      type: "reveal",
      narr: t(E,
        "Here's a cube made of cheese cubes, like a Rubik's cube! What happens if you keep removing blocks one by one? Let's find out! 👀",
        "치즈 조각으로 만든 큐브가 있어! 루빅큐브처럼! 여기서 블록을 계속 빼면 무슨 일이 생길까? 알아보자! 👀"),
      content: (
        <div style={{ padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🧀</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#d97706" }}>Cheese Block</div>
          <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>USACO 2024 December Bronze #2</div>
          <div style={{ marginTop: 12, background: "#fffbeb", border: "2px solid #fde68a", borderRadius: 12, padding: 12, fontSize: 13, color: C.text, lineHeight: 1.8 }}>
            {t(E,
              "N×N×N cheese cube → remove blocks → check: can a chopstick fit through? 🥢",
              "N×N×N 치즈 큐브 → 블록을 빼 → 젓가락이 통과할 수 있을까? 🥢")}
          </div>
        </div>),
    },
    // 1-2: 막대 = 젓가락 비유
    {
      type: "reveal",
      narr: t(E,
        "After each removal, we check: can we slide a long chopstick through the cheese? The chopstick is 1×1×N — it goes through the entire cube!",
        "블록을 뺄 때마다 확인해: 긴 젓가락을 치즈에 쭉 통과시킬 수 있을까? 젓가락은 1×1×N — 큐브를 관통하는 길이야!"),
      content: (
        <div style={{ padding: 16 }}>
          <div style={{ background: "#fffbeb", border: "2px solid #fde68a", borderRadius: 14, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🥢</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#92400e", marginBottom: 8 }}>
              {t(E, "Chopstick = 1×1×N stick", "젓가락 = 1×1×N 막대")}
            </div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.8 }}>
              {t(E,
                "It only fits if an entire row of N cells is empty — even one cheese block left = no fit!",
                "N칸짜리 줄이 통째로 비어야 들어가 — 치즈가 1개라도 남으면 못 넣어!")}
            </div>
          </div>
        </div>),
    },
    // 1-3: 막대 조건 퀴즈 — 직관적
    {
      type: "quiz",
      narr: t(E,
        "So the chopstick needs a clear tunnel. How many cells must be empty for it to fit?",
        "젓가락이 들어가려면 터널이 뚫려야 해. 몇 칸이 비어야 할까?"),
      question: t(E,
        "For the chopstick to fit through, how many cells on the row must be empty?",
        "젓가락이 통과하려면, 그 줄에서 몇 칸이 비어야 해?"),
      options: [
        t(E, "Just 1 cell", "1칸만"),
        t(E, "More than half", "절반 이상"),
        t(E, "ALL N cells — the whole row!", "N칸 전부 — 줄 전체!"),
      ], correct: 2,
      explain: t(E,
        "Right! Every single cell on that row must be empty. One block = blocked! 🚫",
        "맞아! 그 줄의 칸이 전부 비어야 해. 1개라도 남으면 막혀! 🚫"),
    },
    // 1-4: 3방향 — 쉬운 설명
    {
      type: "reveal",
      narr: t(E,
        "The chopstick can go in 3 directions — think of it like poking through the cube from 3 sides!",
        "젓가락은 3방향으로 꽂을 수 있어 — 큐브를 3면에서 찌르는 거라고 생각해!"),
      content: (
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
            {[
              ["→", "#ef4444", t(E, "Left→Right", "왼→오")],
              ["→", "#22c55e", t(E, "Front→Back", "앞→뒤")],
              ["↑", "#3b82f6", t(E, "Bottom→Top", "아래→위")],
            ].map(([arrow, col, label], i) => (
              <div key={i} style={{ background: `${col}15`, border: `2px solid ${col}40`, borderRadius: 12, padding: "10px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: col }}>{arrow}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: col, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: C.dim, fontWeight: 600 }}>
            {t(E, "3 directions = 3 ways to poke!", "3방향 = 3가지로 찌를 수 있어!")}
          </div>
        </div>),
    },
    // 1-5: 직선 개수 — 직관적 질문
    {
      type: "quiz",
      narr: t(E,
        "In a 2×2×2 cube: each direction has rows. Left→Right has 2×2=4 rows. Same for other 2 directions.",
        "2×2×2 큐브에서: 각 방향에 줄이 있어. 왼→오는 2×2=4줄. 나머지 2방향도 마찬가지."),
      question: t(E,
        "2×2×2 cube: 4 rows per direction × 3 directions = ?",
        "2×2×2 큐브: 방향당 4줄 × 3방향 = 총 몇 줄?"),
      options: ["4", "8", "12", "24"], correct: 2,
      explain: t(E,
        "12 rows total! That's every possible place a chopstick could fit.",
        "총 12줄! 젓가락이 들어갈 수 있는 모든 자리야."),
    },
  ];
}


/* ═══════════════════════════════════════════════════════════════
   Chapter 2: 🧀 시뮬레이션 (3 steps)
   
   핵심 변경: 시뮬 → 놀라움 → 궁금증
   아이가 직접 버튼을 누르면서 "어? +3이 왜 한꺼번에?" 경험
   퀴즈는 놀란 뒤에 던짐
   ═══════════════════════════════════════════════════════════════ */
export function makeCheeseCh2(E) {
  return [
    // 2-1: 시뮬레이터 — 설명 최소화, 직접 해보게
    {
      type: "cheeseSim2",
      narr: t(E,
        "Try it yourself! Press 🧀 Carve to remove blocks one by one. Watch the number change. Something surprising will happen! 👀",
        "직접 해봐! 🧀 제거 버튼을 눌러서 블록을 하나씩 빼봐. 숫자가 어떻게 바뀌는지 봐. 뭔가 놀라운 일이 생길 거야! 👀"),
    },
    // 2-2: 놀라움 포착 → 질문
    {
      type: "quiz",
      narr: t(E,
        "Did you notice? The answer was 0, 0, 1, 2... then suddenly jumped to 5! Three chopsticks fit at once! Why?",
        "봤지? 답이 0, 0, 1, 2... 였다가 갑자기 5로 뛰었어! 젓가락 3개가 한꺼번에 들어갔어! 왜 그런 걸까?"),
      question: t(E,
        "Why did 3 chopsticks suddenly fit at the same time?",
        "왜 갑자기 젓가락 3개가 동시에 들어간 거야?"),
      options: [
        t(E, "That last block was blocking 3 different rows at once!", "그 마지막 블록이 3개의 다른 줄을 동시에 막고 있었으니까!"),
        t(E, "The cube got smaller", "큐브가 작아져서"),
        t(E, "Just luck", "우연이야"),
      ], correct: 0,
      explain: t(E,
        "Yes! One block can sit on 3 rows (one per direction). When it's the LAST block on all 3 rows → boom, all 3 open up! 🤯",
        "맞아! 블록 하나가 3개 줄 위에 있어 (방향마다 1개). 그 블록이 3줄 모두의 마지막 블록이면 → 3개가 한꺼번에 뚫려! 🤯"),
    },
    // 2-3: 반대 관찰 — 처음에 왜 안 늘었나
    {
      type: "quiz",
      narr: t(E,
        "But the first block (0,0,0) didn't change anything — the answer stayed at 0. Why?",
        "그런데 첫 번째 블록 (0,0,0)은 아무 변화가 없었어 — 답이 0 그대로였지. 왜?"),
      question: t(E,
        "Why didn't removing the first block open up any rows?",
        "첫 블록을 빼도 왜 아무 줄도 안 뚫렸을까?"),
      options: [
        t(E, "The 3 rows it's on still have other blocks left!", "그 블록이 있던 3개 줄에 아직 다른 블록이 남아있어서!"),
        t(E, "First removal never counts", "첫 번째는 원래 안 세"),
        t(E, "Corner blocks don't matter", "모서리 블록은 상관없어서"),
      ], correct: 0,
      explain: t(E,
        "Exactly! Removing one block from a row of 2 still leaves 1 — not empty yet! You need ALL blocks gone.",
        "맞아! 2칸짜리 줄에서 1개 빼도 1개 남아 — 아직 안 비었어! 전부 빠져야 해."),
    },
  ];
}


/* ═══════════════════════════════════════════════════════════════
   Chapter 3: 💡 패턴 발견 (10 steps)
   
   핵심 변경: "아이가 불편함을 느끼고 → 스스로 방법을 발견"
   
   흐름:
   1. 시뮬 결과 다시 보기 (데이터 정리)
   2. "이거 3×3×3이면 27줄인데, 매번 다 세야 해?" → 불편함
   3. "블록 1개 빼면 영향받는 줄이 몇 개?" → 3개! (발견)
   4. "그럼 3개만 추적하면 되겠네!" → 카운터 개념 도달
   5. 직접 손으로 카운터 추적 (체험)
   ═══════════════════════════════════════════════════════════════ */
export function makeCheeseCh3(E) {
  return [
    // 3-1: 시뮬 결과 정리 — 데이터로 보여주기
    {
      type: "reveal",
      narr: t(E,
        "Let's look at what happened in the simulation more carefully:",
        "시뮬에서 일어난 일을 자세히 정리해보자:"),
      content: (
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>
          {[
            ["(0,0,0)", "0 → 0", "+0", "😐", t(E, "Nothing opened", "변화 없음")],
            ["(1,1,1)", "0 → 0", "+0", "😐", t(E, "Still nothing", "여전히 없음")],
            ["(0,1,0)", "0 → 1", "+1", "👀", t(E, "1 row opened!", "1줄 뚫림!")],
            ["(1,0,0)", "1 → 2", "+1", "👀", t(E, "Another row!", "또 1줄!")],
            ["(1,1,0)", "2 → 5", "+3", "🤯", t(E, "3 at once!!", "3개 한꺼번에!!")],
          ].map(([coord, change, delta, emoji, desc], i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", marginBottom: 3,
              background: delta === "+0" ? "#f8f9fc" : delta === "+3" ? C.carryBg : C.okBg,
              borderRadius: 8, border: `1.5px solid ${delta === "+0" ? C.border : delta === "+3" ? C.carryBd : C.okBd}`,
            }}>
              <span style={{ fontWeight: 700, color: C.text, minWidth: 58 }}>{coord}</span>
              <span style={{ color: C.dim, minWidth: 44 }}>{change}</span>
              <span style={{ fontWeight: 800, minWidth: 24, color: delta === "+3" ? C.carry : delta === "+0" ? C.dim : C.ok }}>{delta}</span>
              <span>{emoji}</span>
              <span style={{ fontSize: 11, color: C.dim }}>{desc}</span>
            </div>))}
        </div>),
    },

    // 3-2: 불편함 유도 — "큰 큐브면 어떡해?"
    {
      type: "quiz",
      narr: t(E,
        "That was a tiny 2×2×2 cube with only 12 rows. But real problems have N=1000! That's 3 MILLION rows! Should we check all of them every time we remove one block?",
        "이건 2×2×2 작은 큐브라서 줄이 12개뿐이었어. 근데 실제 문제는 N=1000! 줄이 300만 개야! 블록 1개 뺄 때마다 300만 개를 전부 확인해야 할까?"),
      question: t(E,
        "N=1000: 3 million rows. Check ALL of them after every single removal?",
        "N=1000: 300만 줄. 블록 1개 뺄 때마다 전부 확인?"),
      options: [
        t(E, "That sounds crazy slow! There must be a better way!", "그건 미친 듯이 느릴 거야! 더 좋은 방법이 있을 거야!"),
        t(E, "Sure, just check them all", "그냥 다 확인하면 되지"),
      ], correct: 0,
      explain: t(E,
        "Right! Checking 3 million rows × 200,000 times = way too slow. Let's find a shortcut! 🏎️",
        "맞아! 300만 줄 × 20만 번 = 너무 느려. 지름길을 찾자! 🏎️"),
    },

    // 3-3: 핵심 질문 — 블록 1개가 영향 주는 줄은?
    {
      type: "quiz",
      narr: t(E,
        "Here's the key question: when you remove ONE block, how many rows could possibly change? Think about it — the block sits on rows going left-right, front-back, and up-down.",
        "핵심 질문: 블록 1개를 빼면, 변할 수 있는 줄은 최대 몇 개야? 생각해봐 — 그 블록은 왼오, 앞뒤, 위아래 방향의 줄 위에 있어."),
      question: t(E,
        "Removing 1 block can affect at most how many rows?",
        "블록 1개를 빼면 최대 몇 개 줄이 영향받아?"),
      options: ["1", "2", "3", "N"], correct: 2,
      explain: t(E,
        "Only 3! One row per direction. The other 2,999,997 rows don't change at all! 💡",
        "3개뿐! 방향마다 1줄씩. 나머지 2,999,997줄은 전혀 안 바뀌어! 💡"),
    },

    // 3-4: 아하 모먼트 — 3개만 보면 된다!
    {
      type: "quiz",
      narr: t(E,
        "So out of 3 million rows, only 3 change! What if we just tracked those 3 instead of checking everything?",
        "300만 줄 중에 3개만 바뀌잖아! 전부 확인하는 대신 그 3개만 추적하면 되지 않을까?"),
      question: t(E,
        "What should we keep track of for each row?",
        "각 줄마다 뭘 기록해두면 좋을까?"),
      options: [
        t(E, "How many blocks have been removed from this row", "이 줄에서 제거된 블록 수"),
        t(E, "The coordinates of every block", "모든 블록의 좌표"),
        t(E, "Whether it's half empty", "절반이 비었는지"),
      ], correct: 0,
      explain: t(E,
        "Count removals on each row! When count = N → the row is fully empty → chopstick fits! We call this a 'counter'.",
        "각 줄에서 제거된 수를 세! 그 수 = N이면 → 줄이 전부 빔 → 젓가락 들어감! 이걸 '카운터'라고 불러."),
    },

    // 3-5: 카운터 개념 정리 — 쉬운 말로
    {
      type: "reveal",
      narr: t(E,
        "Let's call it a 'counter' — like a tally. Each row starts at 0. Every time a block is removed from that row, counter goes up by 1. When it hits N, the row is clear!",
        "'카운터'라고 부르자 — 획수 세는 것처럼! 각 줄은 0에서 시작. 블록이 빠질 때마다 +1. N에 도달하면 그 줄은 비었어!"),
      content: (
        <div style={{ padding: 16, textAlign: "center" }}>
          <div style={{ background: "#fffbeb", border: "2px solid #fde68a", borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#92400e", marginBottom: 10 }}>
              {t(E, "Counter = Tally marks per row", "카운터 = 줄마다 세는 획수")}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, fontFamily: "'JetBrains Mono',monospace" }}>
              {[0, 1, 2].map(v => (
                <div key={v} style={{
                  width: 48, height: 48, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, fontWeight: 900,
                  background: v === 2 ? C.okBg : "#f8f9fc",
                  border: `2px solid ${v === 2 ? C.okBd : C.border}`,
                  color: v === 2 ? C.ok : C.text,
                }}>{v}</div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: C.dim, marginTop: 8 }}>
              {t(E, "N=2: when counter hits 2 → row is clear! 🥢", "N=2: 카운터가 2가 되면 → 줄이 뚫려! 🥢")}
            </div>
          </div>
        </div>),
    },

    // 3-6: 손으로 해보기 — (0,0,0) 제거
    {
      type: "input",
      narr: t(E,
        "Let's try it by hand! N=2. We remove (0,0,0). Its 3 counters each go from 0 to 1. But we need 2 to open a row. How many rows opened?",
        "직접 손으로 해보자! N=2. (0,0,0)을 빼. 3개 카운터가 각각 0→1. 근데 줄이 뚫리려면 2가 필요해. 뚫린 줄은 몇 개?"),
      question: t(E,
        "(0,0,0) removed. All 3 counters = 1. Need 2 to open. Rows opened?",
        "(0,0,0) 제거. 카운터 3개 전부 1. 2가 되어야 뚫림. 뚫린 줄?"),
      hint: t(E, "1 is less than 2, so none opened!", "1은 2보다 작으니까 아직 안 뚫렸어!"),
      answer: 0,
    },

    // 3-7: 중간 과정 — narration으로 간략히
    {
      type: "reveal",
      narr: t(E,
        "After 3 removals, some counters hit 2! For example, (0,0,0) and (0,1,0) share the y-row (x=0,z=0) — that counter reached 2, so 1 row opened!",
        "3번 제거 후, 어떤 카운터는 2에 도달했어! 예를 들어 (0,0,0)과 (0,1,0)은 y-줄(x=0,z=0)을 공유해 — 그 카운터가 2가 돼서 1줄 뚫렸어!"),
      content: (
        <div style={{ padding: 16 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: 2.2 }}>
            <div style={{ color: C.dim }}>{t(E, "Removals so far:", "지금까지 제거:")} (0,0,0), (1,1,1), (0,1,0)</div>
            <div style={{ marginTop: 8, background: C.okBg, border: `1.5px solid ${C.okBd}`, borderRadius: 8, padding: "6px 12px", fontWeight: 700, color: C.ok }}>
              {t(E, "y-row (0,_,0): counter = 2 = N → opened! 🥢", "y-줄 (0,_,0): 카운터 = 2 = N → 뚫렸어! 🥢")}
            </div>
            <div style={{ marginTop: 4, color: C.dim, fontSize: 11 }}>
              {t(E, "Total open rows: 1 (after 3rd removal) → 2 (after 4th)", "뚫린 줄: 1개(3번째 후) → 2개(4번째 후)")}
            </div>
          </div>
        </div>),
    },

    // 3-8: 마지막 제거 — 3개 동시!
    {
      type: "input",
      narr: t(E,
        "Last one! Remove (1,1,0). This block sits on 3 rows, and all 3 counters hit 2 at the same time! Previous answer was 2. Now?",
        "마지막! (1,1,0) 제거. 이 블록이 있는 3줄의 카운터가 동시에 2에 도달! 이전 답이 2였어. 이제는?"),
      question: t(E,
        "Previous: 2 rows open. Now +3 more. Total: 2 + 3 = ?",
        "이전: 2줄 뚫림. 이제 +3개 추가. 합계: 2 + 3 = ?"),
      answer: 5,
    },

    // 3-9: 알고리즘 정리 — 쉬운 말로
    {
      type: "reveal",
      narr: t(E,
        "That's the whole trick! Instead of checking millions of rows, just update 3 counters each time!",
        "이게 전부야! 수백만 줄을 확인하는 대신, 매번 카운터 3개만 업데이트!"),
      content: (
        <div style={{ background: C.card, borderRadius: 14, padding: 16, border: "2px solid #d97706", boxShadow: "0 4px 16px rgba(217,119,6,.1)" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#d97706", marginBottom: 10 }}>
            {t(E, "The Counter Trick 🎯", "카운터 트릭 🎯")}
          </div>
          <div style={{ fontSize: 13, lineHeight: 2.2, color: C.text }}>
            <div>① {t(E, "Each row has a counter, starting at 0", "각 줄마다 카운터, 0에서 시작")}</div>
            <div>② {t(E, "Remove block → 3 counters go up by 1", "블록 제거 → 카운터 3개가 +1")}</div>
            <div>③ {t(E, "Counter = N → row is clear → chopstick fits! 🥢", "카운터 = N → 줄이 빔 → 젓가락 들어감! 🥢")}</div>
          </div>
          <div style={{ marginTop: 10, padding: "8px 12px", background: C.okBg, borderRadius: 8, fontWeight: 800, color: C.ok, textAlign: "center", fontSize: 13 }}>
            {t(E, "3 operations per removal — lightning fast! ⚡", "제거마다 연산 3번 — 번개처럼 빨라! ⚡")}
          </div>
        </div>),
    },

    // 3-10: 복잡도 — 체감 비교
    {
      type: "quiz",
      narr: t(E,
        "With the counter trick, each removal only needs 3 operations. For 200,000 removals, how fast is it?",
        "카운터 트릭으로 매번 3번만 하면 돼. 20만 번 제거하면 얼마나 빠를까?"),
      question: t(E,
        "Counter trick: 3 ops per removal. Total for Q removals?",
        "카운터 트릭: 제거당 3번. Q번이면 총?"),
      options: ["O(Q)", "O(QN)", "O(QN²)", "O(QN³)"], correct: 0,
      explain: t(E,
        "O(Q)! Just 200,000 × 3 = 600,000 operations. Done in milliseconds! 🚀",
        "O(Q)! 20만 × 3 = 60만 번이면 끝. 밀리초만에 완료! 🚀"),
    },
  ];
}


/* ═══════════════════════════════════════════════════════════════
   Chapter 4: 🐍 브루트포스 (4 steps)
   
   핵심 변경: "직접 돌려보고 느린 걸 체감"
   설명 먼저가 아니라 → 실행 먼저 → "이거 왜 이렇게 느려?" 느끼게
   ═══════════════════════════════════════════════════════════════ */
export function makeCheeseCh4(E) {
  return [
    // 4-1: 먼저 직접 돌려보게!
    {
      type: "cheeseRunner",
      narr: t(E,
        "The simplest idea: after each removal, check EVERY row. Try N=3, then N=10, then N=20. Feel the difference! 👀",
        "가장 단순한 방법: 블록 뺄 때마다 모든 줄을 확인하는 거야. N=3, 그다음 N=10, N=20 해봐. 차이를 느껴봐! 👀"),
    },

    // 4-2: 느린 이유 — 체감한 후에 설명
    {
      type: "quiz",
      narr: t(E,
        "Did you feel it getting slower? N=3 was instant, N=20 took a while. Why does it slow down so much?",
        "느려지는 거 느꼈지? N=3은 순식간인데, N=20은 좀 걸렸어. 왜 이렇게 느려지는 걸까?"),
      question: t(E,
        "Why does the brute method get so slow as N grows?",
        "N이 커지면 왜 이렇게 느려져?"),
      options: [
        t(E, "Checking N² rows × N cells each = N³ work per removal!", "N²줄 × N칸씩 = 제거당 N³ 연산!"),
        t(E, "The computer is tired", "컴퓨터가 지쳐서"),
        t(E, "It's the same speed, just feels slow", "속도는 같은데 느낌만"),
      ], correct: 0,
      explain: t(E,
        "N³ per removal! N=20: 8,000 ops. N=1000: 1,000,000,000 ops! That's 125,000× slower!",
        "제거당 N³! N=20: 8,000번. N=1000: 10억 번! 12만 5천 배 느려!"),
    },

    // 4-3: 구체적 숫자 체감
    {
      type: "input",
      narr: t(E,
        "N=1000: each removal checks 3 million rows × 1000 cells = 3 billion operations. At 100 million ops/sec, how many seconds per removal?",
        "N=1000: 매번 300만 줄 × 1000칸 = 30억 연산. 1초에 1억 번이면 제거 1개에 몇 초?"),
      question: t(E, "3 billion ÷ 100 million = ? seconds", "30억 ÷ 1억 = ? 초"),
      answer: 30,
    },

    // 4-4: 비교 — 한눈에
    {
      type: "reveal",
      narr: t(E,
        "30 seconds PER removal × 200,000 removals = 70 DAYS! \ud83d\ude31 This is way too slow. There must be a smarter way... let's find it in the next tab!",
        "제거 1개에 30초 × 20만 개 = 70일! \ud83d\ude31 \uc774건 \ub108\ubb34 \ub290\ub824... \ub354 \ub611\ub611\ud55c \ubc29\ubc95\uc774 \uc788\uc744 \uac70\uc57c! \ub2e4\uc74c \ud0ed\uc5d0\uc11c \ucc3e\uc544\ubcf4\uc790!"),
      content: (
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, textAlign: "center", padding: 8 }}>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <div style={{ flex: 1, background: C.noBg, borderRadius: 12, padding: "14px 8px", border: `2px solid ${C.noBd}` }}>
              <div style={{ fontSize: 11, color: C.no, fontWeight: 700 }}>🐌 {t(E, "Brute", "브루트")}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: C.no, marginTop: 4 }}>O(QN³)</div>
              <div style={{ fontSize: 11, color: C.no, marginTop: 6 }}>≈ 70 {t(E, "days", "일")} 😱</div>
            </div>
            <div style={{ flex: 1, background: "#f0fdf4", borderRadius: 12, padding: "14px 8px", border: "2px dashed #86efac" }}>
              <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 700 }}>⚡ {t(E, "Better way?", "더 좋은 방법?")}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#16a34a", marginTop: 4 }}>???</div>
              <div style={{ fontSize: 11, color: "#16a34a", marginTop: 6 }}>{t(E, "Next tab! \u2192", "\ub2e4\uc74c \ud0ed\uc5d0\uc11c! \u2192")}</div>
            </div>
          </div>
        </div>),
    },
  ];
}


/* ═══════════════════════════════════════════════════════════════
   Chapter 5: ⚡ 코드 (8 steps)
   
   변경: 용어를 쉬운 말로 먼저 설명한 뒤 코드
   ═══════════════════════════════════════════════════════════════ */
export function makeCheeseCh5(E) {
  return [
    // 5-1: 자료구조 — 쉬운 비유
    {
      type: "reveal",
      narr: t(E,
        "We need to store counters for each row. Think of it like a notebook — for each row, write down how many blocks are gone.",
        "각 줄의 카운터를 저장해야 해. 공책이라고 생각해 — 각 줄마다 '빠진 블록 수'를 적어두는 거야."),
      content: (
        <div style={{ padding: 16 }}>
          <div style={{ background: "#fffbeb", border: "2px solid #fde68a", borderRadius: 14, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#92400e", marginBottom: 8 }}>
              {t(E, "3 notebooks — one per direction:", "공책 3권 — 방향마다 1권:")}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: 2 }}>
              <div>📗 xy: <span style={{ color: C.dim }}>{t(E, "which (x,y) pair → z-direction row", "(x,y) 쌍 → z-방향 줄")}</span></div>
              <div>📘 yz: <span style={{ color: C.dim }}>{t(E, "which (y,z) pair → x-direction row", "(y,z) 쌍 → x-방향 줄")}</span></div>
              <div>📙 xz: <span style={{ color: C.dim }}>{t(E, "which (x,z) pair → y-direction row", "(x,z) 쌍 → y-방향 줄")}</span></div>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: C.dim }}>
              {t(E, "Python has a perfect tool: defaultdict(int) — auto-starts at 0!", "Python에 딱 맞는 도구: defaultdict(int) — 자동으로 0 시작!")}
            </div>
          </div>
        </div>),
    },

    // 5-2: defaultdict 예시
    {
      type: "reveal",
      narr: t(E,
        "defaultdict(int) works like magic — if you ask for a key that doesn't exist, it gives you 0!",
        "defaultdict(int)는 마법 같아 — 없는 키를 물어보면 자동으로 0을 줘!"),
      content: (() => {
        const lines = [
          "from collections import defaultdict",
          "",
          "xy = defaultdict(int)",
          "# xy[(3,5)] → 자동으로 0!",
          "xy[(3,5)] += 1",
          "# xy[(3,5)] → 이제 1!",
        ];
        return (
          <div style={{ padding: 12 }}>
            <div style={{ background: "#1e1b2e", borderRadius: 10, padding: "12px 10px", overflowX: "auto", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: 1.8 }}>
              {lines.map((l, i) => (
                <div key={i} style={{ display: "flex", minHeight: 20 }}>
                  <span style={{ color: "#4b5563", width: 24, textAlign: "right", marginRight: 8, flexShrink: 0, userSelect: "none", fontSize: 10 }}>{i + 1}</span>
                  <span style={{ whiteSpace: "pre" }}>{highlight(l)}</span>
                </div>
              ))}
            </div>
          </div>);
      })(),
    },

    // 5-3: 핵심 조건 퀴즈
    {
      type: "quiz",
      narr: t(E,
        "The counter goes up by 1 each removal. When does the chopstick fit?",
        "카운터가 제거마다 1씩 올라가. 젓가락이 들어가는 때는?"),
      question: t(E,
        "Chopstick fits when counter reaches…?",
        "카운터가 몇이 되면 젓가락이 들어가?"),
      options: ["0", "N/2", "N", "N²"], correct: 2,
      explain: t(E,
        "N! All blocks removed from that row → completely empty → chopstick fits!",
        "N! 그 줄의 블록이 전부 빠짐 → 완전히 빔 → 젓가락 들어감!"),
    },

    // 5-4: 원본 코드
    {
      type: "code",
      narr: t(E,
        "Here's the code! Let's read it line by line.",
        "코드를 보자! 한 줄씩 읽어볼게."),
      code: USER_CODE_ORIG,
      label: t(E, "Show original code", "원본 코드 보기"),
    },

    // 5-5: 코드 읽기 퀴즈
    {
      type: "quiz",
      narr: t(E,
        "In the code, xy_dict[(x,y)] tracks removals for one specific row. Which direction?",
        "코드에서 xy_dict[(x,y)]는 특정 줄의 제거 수를 세. 어떤 방향?"),
      question: t(E,
        "xy_dict[(x,y)] counts removals on which row?",
        "xy_dict[(x,y)]는 어떤 방향의 줄?"),
      hint: t(E, "If x and y are fixed, which axis is the row along?", "x와 y가 고정이면 줄이 뻗는 축은?"),
      options: [
        t(E, "z-direction (x,y fixed → z varies)", "z-방향 (x,y 고정 → z가 변함)"),
        t(E, "x-direction", "x-방향"),
        t(E, "y-direction", "y-방향"),
      ], correct: 0,
      explain: t(E,
        "xy pair → z-direction row! The pair tells you which 2 axes are fixed.",
        "xy 쌍 → z-방향 줄! 쌍이 어떤 2축이 고정인지 알려줘."),
    },

    // 5-6: 불필요한 +1 — 아이가 발견하게
    {
      type: "quiz",
      narr: t(E,
        "Look at lines 20-21: after count += 1, there's xy_dict[(x,y)] += 1. This pushes the counter past N so == N won't trigger again. But think — can the SAME block be removed twice?",
        "20-21번 줄을 봐: count += 1 뒤에 xy_dict[(x,y)] += 1이 있어. 카운터를 N 위로 올려서 == N이 다시 안 되게 하는 거야. 근데 생각해봐 — 같은 블록이 두 번 빠질 수 있어?"),
      question: t(E,
        "Can the same block be removed twice?",
        "같은 블록이 두 번 제거될 수 있어?"),
      options: [
        t(E, "No! Each block only once → counter hits N exactly once → extra +1 is unnecessary!", "아니! 블록은 한 번만 → 카운터는 N에 딱 한 번 → 추가 +1은 불필요!"),
        t(E, "Yes, need the safety check", "응, 안전장치가 필요해"),
      ], correct: 0,
      explain: t(E,
        "Each block is unique! The extra +1 doesn't hurt but isn't needed. Good defensive thinking though! 👍",
        "블록은 유일해! 추가 +1이 해롭진 않지만 불필요해. 방어적 사고는 좋지만! 👍"),
    },

    // 5-7: 정리 버전
    {
      type: "code",
      narr: t(E,
        "Clean version — same idea, no unnecessary +1, loop instead of repeating 3 times:",
        "정리 버전 — 같은 아이디어, 불필요한 +1 없이, 3번 반복 대신 루프:"),
      code: USER_CODE_CLEAN,
      label: t(E, "Show clean version", "정리 버전 보기"),
    },

    // 5-8: 최종 정리
    {
      type: "reveal",
      narr: t(E,
        "That's it! The whole insight: don't re-check everything — just track what changes. 3 counters per removal = done! 🎉",
        "이게 전부야! 핵심: 전부 다시 확인하지 마 — 바뀌는 것만 추적해. 제거당 카운터 3개 = 끝! 🎉"),
      content: (
        <div style={{ textAlign: "center", padding: 8 }}>
          <div style={{ background: "linear-gradient(135deg,#92400e,#d97706)", borderRadius: 14, padding: "20px 16px" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", lineHeight: 1.6 }}>
              {t(E, "Don't re-check everything —", "전부 확인하지 마 —")}
              <br/>
              {t(E, "only track what changes!", "바뀌는 것만 추적해!")}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", marginTop: 8 }}>
              🐌 O(QN³) → ⚡ O(Q)
            </div>
          </div>
        </div>),
    },
  ];
}
