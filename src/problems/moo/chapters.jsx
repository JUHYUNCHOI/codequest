import { C, t } from "../../theme";
import { BRUTE_CODE, OPT_CODE, MiniCode } from "./helpers";

export { isMoo, findAllMoos, bruteSolve } from "./helpers";

export function makeMooCh1(E) {
  return [
    { type: "reveal",
      narr: t(E, "Bessie mooed a LOT at a contest. But the recording might have 1 typo... can we still figure out what she said? 🐄", "Bessie가 대회에서 엄청 울었대! 근데 녹음에 오타가 1개 있을 수도... 뭐라고 했는지 알 수 있을까? 🐄"),
      content: (<div style={{ padding: 16, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🐄</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#7c5cfc" }}>It's Mooin' Time</div>
        <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>USACO 2024 December Bronze #3</div>
        <div style={{ marginTop: 12, background: "#ede9fe", border: "2px solid #c4b5fd", borderRadius: 12, padding: 12, fontSize: 13, color: C.text, lineHeight: 1.8 }}>
          {t(E, "A string of letters → find patterns like 'moo', 'baa' → but 1 letter might be wrong!", "글자 문자열 → 'moo', 'baa' 같은 패턴 찾기 → 근데 1글자가 틀렸을 수도!")}
        </div>
      </div>),
    },
    { type: "reveal",
      narr: t(E, "A 'moo' is 3 letters: the first is different, and the last two are the SAME. Like how a cow says 'moo' — one sound, then the same sound twice!", "'moo'는 3글자야: 첫 글자가 다르고, 뒤 2글자가 같아! 소가 '무우' 하는 것처럼 — 한 소리, 그다음 같은 소리 2번!"),
      content: (<div style={{ padding: 16 }}>
        <div style={{ background: "#ede9fe", border: "2px solid #c4b5fd", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.accent, marginBottom: 10 }}>{t(E, "Moo Pattern: ABB (A≠B)", "Moo 패턴: ABB (A≠B)")}</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 }}>
            {[["m","o","o",true],["b","a","a",true],["o","o","o",false],["a","b","c",false]].map(([a,b,c,ok],i) => (
              <div key={i} style={{ padding: "8px 10px", borderRadius: 10, background: ok ? C.okBg : C.noBg, border: `2px solid ${ok ? C.okBd : C.noBd}`, fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 900, color: ok ? C.ok : C.no }}>{a}{b}{c} {ok ? "✅" : "❌"}</div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: C.dim, textAlign: "center" }}>
            {t(E, "'ooo' fails: first = last two. 'abc' fails: last two differ.", "'ooo'는 실패: 첫 글자 = 뒤 글자. 'abc'도 실패: 뒤 2글자가 달라.")}
          </div>
        </div>
      </div>),
    },
    { type: "quiz",
      narr: t(E, "Quick check! Which of these is a valid moo?", "퀴즈! 어떤 게 유효한 moo일까?"),
      question: t(E, "Which is a valid moo (ABB, A≠B)?", "유효한 moo (ABB, A≠B)는?"),
      options: ["att", "aab", "xyz"], correct: 0,
      explain: t(E, "'att': a≠t and t=t → valid! 'aab': first two same (AA_). 'xyz': last two differ (_YZ).", "'att': a≠t이고 t=t → 유효! 'aab': 앞 2개가 같아(AA_). 'xyz': 뒤 2개가 달라(_YZ)."),
    },
    { type: "reveal",
      narr: t(E, "Here's the twist: the recording might have exactly 1 wrong letter. So we try: what if I change THIS letter? What about THAT one? We try every possibility!", "반전: 녹음에 딱 1글자 오타가 있을 수 있어. 그래서 시도해봐: 이 글자를 바꾸면? 저 글자를 바꾸면? 모든 가능성을 시도!"),
      content: (<div style={{ padding: 16, textAlign: "center" }}>
        <div style={{ background: "#fff7ed", border: "2px solid #fdba74", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.carry, marginBottom: 8 }}>{t(E, "Key Constraint", "핵심 조건")}</div>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.8 }}>{t(E, "Original string + change at most 1 letter → find ALL moo patterns appearing ≥ F times", "원래 문자열 + 최대 1글자 변경 → F번 이상 나오는 모든 moo 패턴 찾기")}</div>
        </div>
      </div>),
    },
    { type: "quiz",
      narr: t(E, "Example: 'zzmoozzmoo' with F=2. 'moo' appears 2 times already! Even changing 1 letter, no NEW moo reaches 2. So the answer is just 'moo'.", "예시: 'zzmoozzmoo'에서 F=2. 'moo'가 이미 2번! 1글자 바꿔도 새로 2번 되는 moo가 없어. 답: 'moo' 하나!"),
      question: t(E, "What are we looking for?", "우리가 찾는 건?"),
      options: [
        t(E, "All moo patterns with count ≥ F (trying 0 or 1 letter change)", "0~1글자 바꿨을 때 F번 이상인 모든 moo 패턴"),
        t(E, "Only the most common pattern", "가장 많은 패턴만"),
        t(E, "The position of the typo", "오타 위치"),
      ], correct: 0,
      explain: t(E, "All possible moos that could reach the threshold! We collect them ALL.", "기준치에 도달할 수 있는 모든 moo! 전부 수집!"),
    },
  ];
}

export function makeMooCh2(E) {
  return [
    { type: "mooSim",
      narr: t(E, "Play with it! Type a string and see the moo patterns. Then click any letter to change it — watch how the moos change! Pay attention to WHICH moos change... 👀", "직접 해봐! 문자열 입력하고 moo 패턴을 봐. 글자를 클릭해서 바꿔봐 — moo가 어떻게 변하는지 봐! 어떤 moo가 변하는지 잘 봐... 👀"),
    },
    { type: "quiz",
      narr: t(E, "Did you notice something? When you change a letter, only the moos RIGHT NEXT to it change. Moos far away stay the same!", "눈치챘어? 글자를 바꾸면 바로 옆 moo만 변해. 멀리 있는 moo는 그대로야!"),
      question: t(E, "If you change position i, which 3-letter windows are affected?", "위치 i를 바꾸면 어떤 3글자 윈도우가 영향받아?"),
      options: [
        t(E, "Only windows that CONTAIN position i (at most 3!)", "위치 i를 포함하는 윈도우만 (최대 3개!)"),
        t(E, "All windows in the entire string", "문자열의 모든 윈도우"),
        t(E, "Only the window starting at position i", "위치 i에서 시작하는 윈도우만"),
      ], correct: 0,
      explain: t(E, "At most 3! Position i can be the 1st, 2nd, or 3rd letter of a window. This is the KEY insight! 💡", "최대 3개! 위치 i가 윈도우의 1번째, 2번째, 3번째 글자일 수 있어. 이게 핵심! 💡"),
    },
    { type: "reveal",
      narr: t(E, "Let's see it clearly. In 'abcdef', if we change position 3 (the 'd'), only 3 windows are affected:", "'abcdef'에서 위치 3('d')을 바꾸면, 딱 3개 윈도우만 영향받아:"),
      content: (<div style={{ padding: 16 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, textAlign: "center", marginBottom: 12 }}>
          {["a","b","c","d","e","f"].map((ch,i) => (
            <span key={i} style={{ display: "inline-block", width: 28, height: 28, lineHeight: "28px", textAlign: "center", borderRadius: 6, margin: "0 2px", fontWeight: 800, background: i===3 ? "#fde68a" : i>=1&&i<=5 ? "#ede9fe" : "#f8f9fc", border: `2px solid ${i===3 ? "#f59e0b" : i>=1&&i<=5 ? "#c4b5fd" : C.border}`, color: i===3 ? "#92400e" : C.text }}>{ch}</span>
          ))}
        </div>
        <div style={{ fontSize: 12, color: C.dim, lineHeight: 2 }}>
          <div>🟣 {t(E, "Window [1,2,3] = 'bcd' — d is 3rd letter", "윈도우 [1,2,3] = 'bcd' — d가 3번째")}</div>
          <div>🟣 {t(E, "Window [2,3,4] = 'cde' — d is 2nd letter", "윈도우 [2,3,4] = 'cde' — d가 2번째")}</div>
          <div>🟣 {t(E, "Window [3,4,5] = 'def' — d is 1st letter", "윈도우 [3,4,5] = 'def' — d가 1번째")}</div>
          <div>⬜ {t(E, "Window [0,1,2] = 'abc' — d not here!", "윈도우 [0,1,2] = 'abc' — d 없음!")}</div>
        </div>
      </div>),
    },
  ];
}

export function makeMooCh3(E) {
  return [
    { type: "mooRunner",
      narr: t(E, "Simplest approach: for each position, try all 26 letters, and scan the ENTIRE string each time to count moos. Try N=50 first, then N=200, then N=500. Feel the pain! 🐌", "가장 단순한 방법: 각 위치마다 26글자를 시도하고, 매번 전체 문자열을 스캔해서 moo를 세는 거야. N=50부터, N=200, N=500 해봐. 느린 걸 느껴봐! 🐌"),
    },
    { type: "quiz",
      narr: t(E, "Did you feel it getting MUCH slower? N=50 is instant, N=500 takes ages! Why? Think about what happens: N positions × 26 letters × scan N characters each time...", "엄청 느려지는 거 느꼈지? N=50은 순식간인데 N=500은 한참 걸려! 왜? 생각해봐: N개 위치 × 26글자 × 매번 N글자 스캔..."),
      question: t(E, "Time complexity of brute force?", "브루트포스 시간복잡도?"),
      options: ["O(N)", "O(26 × N²)", "O(N³)"], correct: 1,
      explain: t(E, "O(26N²)! N=20,000 → 26 × 400,000,000 = ~10 billion operations. Way too slow! ⏰", "O(26N²)! N=20,000 → 26 × 4억 = ~100억 연산. 너무 느려! ⏰"),
    },
    { type: "input",
      narr: t(E, "Let's feel how bad it is. N=20,000: 26 × 20,000² = 10.4 billion operations. At 100 million ops/sec, how many seconds?", "얼마나 느린지 체감해보자. N=20,000: 26 × 20,000² = 104억 연산. 1초에 1억 번이면 몇 초?"),
      question: t(E, "10.4 billion ÷ 100 million = ? seconds", "104억 ÷ 1억 = ? 초"),
      hint: t(E, "10,400,000,000 ÷ 100,000,000 = ?", "10,400,000,000 ÷ 100,000,000 = ?"),
      answer: 104,
    },
    { type: "code",
      narr: t(E, "Here's the brute force code — simple but painfully slow:", "브루트포스 코드 — 단순하지만 고통스럽게 느려:"),
      code: BRUTE_CODE, label: t(E, "Show brute force code", "브루트포스 코드 보기"),
    },
    { type: "reveal",
      narr: t(E, "104 seconds! 😱 But remember from the simulator — changing 1 letter only affects 3 windows, not N. There MUST be a better way!", "104초! 😱 근데 시뮬레이터에서 봤잖아 — 1글자 바꾸면 3개 윈도우만 영향, N개가 아니라. 더 좋은 방법이 있을 거야!"),
      content: (<div style={{ fontSize: 13, textAlign: "center", padding: 8 }}>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <div style={{ flex: 1, background: C.noBg, borderRadius: 12, padding: "14px 8px", border: `2px solid ${C.noBd}` }}>
            <div style={{ fontSize: 11, color: C.no, fontWeight: 700 }}>🐌 {t(E, "Brute", "브루트")}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: C.no, marginTop: 4 }}>O(26N²)</div>
            <div style={{ fontSize: 11, color: C.no, marginTop: 6 }}>N=20K → 104s 😱</div>
          </div>
          <div style={{ flex: 1, background: "#f0fdf4", borderRadius: 12, padding: "14px 8px", border: "2px dashed #86efac" }}>
            <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 700 }}>⚡ {t(E, "Better way?", "더 좋은?")}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#16a34a", marginTop: 4 }}>???</div>
            <div style={{ fontSize: 11, color: "#16a34a", marginTop: 6 }}>{t(E, "Next tab! →", "다음 탭! →")}</div>
          </div>
        </div>
      </div>),
    },
  ];
}

export function makeMooCh4(E) {
  return [
    { type: "quiz",
      narr: t(E, "Remember from the simulator: changing 1 letter only affects nearby windows. Let's think — a letter can be the 1st, 2nd, or 3rd character of a window. So how many windows?", "시뮬레이터에서 기억해: 1글자 바꾸면 근처 윈도우만 영향. 생각해봐 — 글자가 윈도우의 1번째, 2번째, 3번째일 수 있어. 그러면 몇 개?"),
      question: t(E, "1 letter sits in at most how many 3-letter windows?", "1글자가 포함되는 3글자 윈도우는 최대?"),
      options: ["1", "2", "3", "N"], correct: 2,
      explain: t(E, "3! It can be 1st, 2nd, or 3rd character of a window. Not N — just 3!", "3개! 윈도우의 1번째, 2번째, 3번째일 수 있어. N개가 아니라 딱 3개!"),
    },
    { type: "reveal",
      narr: t(E, "So here's the big idea: count ALL moos in the original string FIRST. Then when we try a change, only update the 3 affected windows!", "큰 아이디어: 원래 문자열의 모든 moo를 먼저 세! 그다음 변경할 때 영향받는 3개 윈도우만 업데이트!"),
      content: (<div style={{ padding: 16 }}>
        <div style={{ background: "#ede9fe", border: "2px solid #c4b5fd", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.accent, marginBottom: 10 }}>{t(E, "The Smart Approach 💡", "똑똑한 접근 💡")}</div>
          <div style={{ fontSize: 13, lineHeight: 2.2, color: C.text }}>
            <div>① {t(E, "Pre-count all moos in original string", "원본의 모든 moo 미리 세기")}</div>
            <div>② {t(E, "For each position: REMOVE that position's 3 windows", "각 위치마다: 그 위치의 3개 윈도우 빼기")}</div>
            <div>③ {t(E, "Try 26 letters: temporarily add new windows & check", "26글자 시도: 임시로 새 윈도우 더하고 확인")}</div>
            <div>④ {t(E, "RESTORE original windows", "원래 윈도우 복원")}</div>
          </div>
        </div>
      </div>),
    },
    { type: "reveal",
      narr: t(E, "Think of it like a puzzle! Take out the piece, try new pieces, put the original back. We call it 'Remove → Try → Restore'.", "퍼즐이라고 생각해! 조각을 빼고, 새 조각을 넣어보고, 원래 조각을 다시 넣어. '빼기 → 시도 → 복원'이라 불러."),
      content: (<div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          ["🔴", t(E, "REMOVE: take out 3 windows' moo counts", "빼기: 3개 윈도우의 moo 카운트 빼기"), C.noBg, C.noBd, C.no],
          ["🟡", t(E, "TRY: for each of 26 letters, temporarily add & check ≥ F", "시도: 26글자마다 임시로 더하고 ≥ F 확인"), "#fffbeb", "#fde68a", "#92400e"],
          ["🟢", t(E, "RESTORE: put original moo counts back", "복원: 원래 moo 카운트 다시 넣기"), C.okBg, C.okBd, C.ok],
        ].map(([emoji, text, bg, bd, color], i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 12px", borderRadius: 10, background: bg, border: `1.5px solid ${bd}` }}>
            <span style={{ fontSize: 18 }}>{emoji}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color }}>{text}</span>
          </div>
        ))}
      </div>),
    },
    { type: "reveal",
      narr: t(E, "Let's trace it by hand! String = 'momoo', position 0 ('m'). The 3 windows for position 0 are... well, position 0 can only be the 1st letter, so just 1 window: [0,1,2] = 'mom'. Is 'mom' a moo? m≠o but o≠m, so NO.", "손으로 해보자! 문자열 = 'momoo', 위치 0('m'). 위치 0의 윈도우는... 위치 0은 1번째 글자만 가능하니까 윈도우 1개: [0,1,2] = 'mom'. 'mom'은 moo야? m≠o이고 o≠m이니까 아니야."),
      content: (<div style={{ padding: 16 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", textAlign: "center", marginBottom: 12 }}>
          {["m","o","m","o","o"].map((ch,i) => (
            <span key={i} style={{ display: "inline-block", width: 28, height: 28, lineHeight: "28px", textAlign: "center", borderRadius: 6, margin: "0 2px", fontWeight: 800, background: i===0 ? "#fde68a" : "#f8f9fc", border: `2px solid ${i===0 ? "#f59e0b" : C.border}`, color: i===0 ? "#92400e" : C.text, fontSize: 14 }}>{ch}</span>
          ))}
          <div style={{ fontSize: 10, color: C.dimLight, marginTop: 4 }}>
            {["0","1","2","3","4"].map((n,i) => <span key={i} style={{ display: "inline-block", width: 32, textAlign: "center" }}>{n}</span>)}
          </div>
        </div>
        <div style={{ fontSize: 12, lineHeight: 2, color: C.dim }}>
          <div>🔴 {t(E, "REMOVE: window [0,1,2]='mom' → not moo → nothing to remove", "빼기: 윈도우 [0,1,2]='mom' → moo 아님 → 뺄 거 없음")}</div>
          <div>🟡 {t(E, "TRY 'a': window becomes 'aom' → not moo", "시도 'a': 윈도우가 'aom' → moo 아님")}</div>
          <div>🟡 {t(E, "TRY 'o': window becomes 'oom' → not moo (o=o, first=second!)", "시도 'o': 윈도우가 'oom' → moo 아님 (o=o, 첫째=둘째!)")}</div>
          <div>🟡 {t(E, "TRY 'z': window becomes 'zom' → not moo (o≠m)", "시도 'z': 윈도우가 'zom' → moo 아님 (o≠m)")}</div>
          <div>🟢 {t(E, "RESTORE: nothing was removed, nothing to restore!", "복원: 뺀 게 없으니 복원할 것도 없음!")}</div>
        </div>
      </div>),
    },
    { type: "quiz",
      narr: t(E, "Important: when trying letter 'c', we add its contribution (+1), check the counter, then IMMEDIATELY undo it (-1). Why can't we just leave it?", "중요: 글자 'c' 시도할 때, 기여를 더하고(+1), 카운터 확인하고, 바로 되돌려(-1). 왜 그냥 놔두면 안 돼?"),
      question: t(E, "Why must we undo each trial immediately?", "왜 각 시도를 바로 되돌려야 해?"),
      options: [
        t(E, "Next trial letter needs a clean state — without previous trial's counts!", "다음 시도 글자는 깨끗한 상태가 필요 — 이전 시도의 카운트 없이!"),
        t(E, "To save memory", "메모리 절약"),
      ], correct: 0,
      explain: t(E, "Exactly! If we try 'a' and don't undo, then trying 'b' would still have 'a's counts mixed in! Each of 26 trials must start from the same clean state. 🐛", "맞아! 'a'를 시도하고 안 되돌리면, 'b' 시도할 때 'a'의 카운트가 섞여! 26번 시도 각각 같은 깨끗한 상태에서 시작해야 해. 🐛"),
    },
    { type: "quiz",
      narr: t(E, "Now let's see how fast this is! Brute: N positions × 26 letters × N windows = O(26N²). Smart: N positions × 26 letters × 3 windows = O(78N). For N=20,000, how much faster?", "이제 얼마나 빠른지 보자! 브루트: N × 26 × N = O(26N²). 스마트: N × 26 × 3 = O(78N). N=20,000이면 몇 배 빨라?"),
      question: "O(78N) vs O(26N²), N=20,000?",
      options: [
        t(E, "About 2× faster", "약 2배"),
        t(E, "About N/3 ≈ 6,667× faster!", "약 N/3 ≈ 6,667배!"),
        t(E, "Same speed", "같은 속도"),
      ], correct: 1,
      explain: t(E, "~6,667×! From scanning N windows to just 3. That's the power of local updates! 104 seconds → 0.016 seconds! ⚡", "~6,667배! N개 윈도우 대신 3개만. 로컬 업데이트의 힘! 104초 → 0.016초! ⚡"),
    },
    { type: "reveal",
      narr: t(E, "The whole algorithm in one picture:", "알고리즘 전체를 한 그림으로:"),
      content: (<div style={{ background: C.card, borderRadius: 14, padding: 16, border: "2px solid #7c5cfc" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#7c5cfc", marginBottom: 10 }}>{t(E, "Remove → Try → Restore 🎯", "빼기 → 시도 → 복원 🎯")}</div>
        <div style={{ fontSize: 13, lineHeight: 2.2, color: C.text }}>
          <div>① {t(E, "Pre-count all moos in original", "원본 moo 전부 미리 세기")}</div>
          <div>② {t(E, "For each position:", "각 위치마다:")}</div>
          <div style={{ paddingLeft: 16 }}>
            <div>🔴 {t(E, "Remove 3 windows", "3개 윈도우 빼기")}</div>
            <div>🟡 {t(E, "Try 26 letters × 3 windows (+1, check, -1)", "26글자 × 3윈도우 (+1, 확인, -1)")}</div>
            <div>🟢 {t(E, "Restore 3 windows", "3개 윈도우 복원")}</div>
          </div>
        </div>
        <div style={{ marginTop: 10, padding: "8px 12px", background: C.okBg, borderRadius: 8, fontWeight: 800, color: C.ok, textAlign: "center", fontSize: 13 }}>
          {t(E, "O(78N) — blazing fast! ⚡", "O(78N) — 번개처럼 빨라! ⚡")}
        </div>
      </div>),
    },
  ];
}

export function makeMooCh5(E) {
  return [
    { type: "reveal",
      narr: t(E, "We need to store moo counts — like a notebook. 'moo' appears 3 times? Write it down! Python has defaultdict(int) for this — it auto-starts at 0.", "moo 카운트를 저장해야 해 — 공책처럼. 'moo'가 3번? 적어둬! Python에 defaultdict(int)가 있어 — 자동으로 0에서 시작!"),
      content: (<div style={{ padding: 12 }}><MiniCode lines={["from collections import defaultdict","","mydict = defaultdict(int)","# mydict['moo'] → auto 0!","mydict['moo'] += 1","# mydict['moo'] → now 1!"]} /></div>),
    },
    { type: "quiz",
      narr: t(E, "The code uses `string = list(input())` instead of just `input()`. Why not keep it as a string?", "코드에서 `string = list(input())`을 써. 그냥 문자열로 쓰면 안 돼?"),
      question: t(E, "Why list(input())?", "왜 list(input())?"),
      options: [
        t(E, "Python strings can't be changed! 'abc'[1]='x' gives an error. Lists allow it.", "Python 문자열은 변경 불가! 'abc'[1]='x'는 에러. 리스트는 가능."),
        t(E, "It's faster", "빨라서"),
      ], correct: 0,
      explain: t(E, "Try it: 'abc'[1]='x' → TypeError! But ['a','b','c'][1]='x' works perfectly. We need to swap characters, so we need a list.", "'abc'[1]='x' → TypeError! 하지만 ['a','b','c'][1]='x'는 잘 돼. 글자를 바꿔야 하니까 리스트가 필요!"),
    },
    { type: "quiz",
      narr: t(E, "The window range: minIndex = max(pos-2, 0), maxIndex = min(n-2, pos+1). For pos=3, N=10: range(1,4) = [1,2,3]. Let's verify each window contains pos=3.", "윈도우 범위: minIndex = max(pos-2, 0), maxIndex = min(n-2, pos+1). pos=3, N=10: range(1,4) = [1,2,3]. 각 윈도우가 pos=3을 포함하는지 확인해보자."),
      question: t(E, "idx=1→[1,2,3], idx=2→[2,3,4], idx=3→[3,4,5]. All contain pos=3?", "idx=1→[1,2,3], idx=2→[2,3,4], idx=3→[3,4,5]. 전부 pos=3 포함?"),
      options: [
        t(E, "Yes! Each window covers pos=3 in a different position", "맞아! 각 윈도우가 다른 위치에서 pos=3 포함"),
        t(E, "No, should be range(1,5)", "아니, range(1,5)여야 해"),
      ], correct: 0,
      explain: t(E, "Correct! idx=1: pos=3 is 3rd letter. idx=2: pos=3 is 2nd. idx=3: pos=3 is 1st. All 3 covered!", "맞아! idx=1: pos=3이 3번째. idx=2: 2번째. idx=3: 1번째. 3개 전부!"),
    },
    { type: "quiz",
      narr: t(E, "Tricky line: `t[pos - idx] = c`. We sliced `t = string[idx:idx+3]`, which gives us a copy of 3 letters. If idx=1 and pos=3, which position in t do we change?", "까다로운 줄: `t[pos - idx] = c`. `t = string[idx:idx+3]`으로 3글자 복사본을 만들었어. idx=1이고 pos=3이면, t에서 몇 번째를 바꿔?"),
      question: t(E, "idx=1, pos=3: t[pos-idx] = t[?]", "idx=1, pos=3: t[pos-idx] = t[?]"),
      options: ["t[2]", "t[3]", "t[1]"], correct: 0,
      explain: t(E, "t[3-1] = t[2]! The window starts at idx=1, so pos=3 is at offset 2 (the 3rd letter of the window).", "t[3-1] = t[2]! 윈도우가 idx=1에서 시작하니까 pos=3은 오프셋 2 (윈도우의 3번째 글자)."),
    },
    { type: "reveal",
      narr: t(E, "The cleverest part of the code: +1 → check → -1. Add the trial contribution, immediately check if it crosses the threshold, then undo it. The counter stays clean for the next trial!", "코드에서 가장 영리한 부분: +1 → 확인 → -1. 시도 기여를 더하고, 바로 기준치 넘는지 확인하고, 되돌려. 다음 시도를 위해 카운터가 깨끗!"),
      content: (<div style={{ padding: 12 }}>
        <MiniCode lines={["mydict[key] += 1        # temporarily add","if mydict[key] >= f:    # crosses threshold?","  result.add(key)       # yes → save it!","mydict[key] -= 1        # immediately undo"]} />
        <div style={{ marginTop: 8, fontSize: 12, color: C.accent, fontWeight: 700, textAlign: "center" }}>+1 → check → -1 = {t(E, "clean state for next trial!", "다음 시도를 위한 깨끗한 상태!")} ✨</div>
      </div>),
    },
    { type: "code",
      narr: t(E, "Here's the full optimized code! Read it section by section — you already understand every part:", "최적화된 전체 코드! 섹션별로 읽어봐 — 이미 모든 부분을 이해하고 있어:"),
      code: OPT_CODE, label: t(E, "Show optimized code", "최적화 코드 보기"),
    },
    { type: "reveal",
      narr: t(E, "That's it! The whole insight: don't rescan everything — only update the 3 windows that actually changed. Remove → Try → Restore! 🎉", "이게 전부야! 핵심: 전부 다시 스캔하지 마 — 실제로 바뀐 3개 윈도우만 업데이트. 빼기 → 시도 → 복원! 🎉"),
      content: (<div style={{ textAlign: "center", padding: 8 }}>
        <div style={{ background: "linear-gradient(135deg,#4f46e5,#7c5cfc)", borderRadius: 14, padding: "20px 16px" }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", lineHeight: 1.6 }}>
            {t(E, "Don't rescan everything —", "전부 다시 스캔하지 마 —")}<br/>{t(E, "only update what changed!", "바뀐 것만 업데이트!")}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", marginTop: 8 }}>🐌 O(26N²) → ⚡ O(78N)</div>
        </div>
      </div>),
    },
  ];
}
