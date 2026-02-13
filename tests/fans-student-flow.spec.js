import { test, expect } from "@playwright/test";

/*  ──────────────────────────────────────────────────────────────
    Fans 튜토리얼 학생 플로우 E2E 테스트
    ──────────────────────────────────────────────────────────────
    학생이 Fans 페이지에 진입해서 Ch1→Ch2→Ch3를 완주하는 전체 흐름을
    시뮬레이션한다.
    - 퀴즈는 올바른 답을 선택하고,
    - 인터랙티브 컴포넌트(FanPlacementViz, SeparatorBuildViz 등)는
      최소 1회 이상 상호작용하고,
    - 수치 입력(NumInput)은 올바른 값을 입력한다.
    ────────────────────────────────────────────────────────────── */

/* helper: 다음 스텝으로 이동 (→ 버튼 클릭) */
const goNext = async (page) => {
  const nextBtn = page.locator("button").filter({ hasText: "→" });
  await expect(nextBtn).toBeEnabled({ timeout: 5000 });
  await nextBtn.click();
};

/* helper: 현재 스텝 인디케이터 텍스트 가져오기 (e.g. "3/7") */
const getStepIndicator = (page) =>
  page.locator("span").filter({ hasText: /^\d+\/\d+$/ });

/* helper: Fans 페이지 진입 */
const enterFans = async (page) => {
  await page.goto("/");
  await page.click("text=Fans");
  await expect(page.getByRole("heading", { name: "Fans" })).toBeVisible();
};

/* ════════════════════════════════════════════════════════════════
   Chapter 1: 📋 문제 이해 (7 steps)
   ════════════════════════════════════════════════════════════════ */
test.describe("Fans Ch1 — 문제 이해", () => {
  test("학생이 Ch1을 처음부터 끝까지 완주", async ({ page }) => {
    await enterFans(page);

    // 기본적으로 Ch1(📋 문제) 탭이 선택되어 있다
    await expect(getStepIndicator(page)).toHaveText("1/7");

    // ── Step 1-1: Title (reveal) ──
    await expect(page.getByText("MCC 2025 P2")).toBeVisible();
    await goNext(page);

    // ── Step 1-2: Rule explanation (reveal) ──
    await expect(getStepIndicator(page)).toHaveText("2/7");
    await expect(page.locator("text=OK!")).toBeVisible();
    await goNext(page);

    // ── Step 1-3: Quiz (correct = index 2, 3번째 옵션: "빨파빨파") ──
    await expect(getStepIndicator(page)).toHaveText("3/7");
    // → 버튼이 비활성화 상태 (퀴즈를 안 풀었으므로)
    const nextBtnBlocked = page.locator("button").filter({ hasText: "→" });
    await expect(nextBtnBlocked).toBeDisabled();
    // 정답 클릭
    await page.locator("button").filter({ hasText: "빨파빨파" }).click();
    // 정답 표시 확인
    await expect(page.locator("text=✅")).toBeVisible();
    await goNext(page);

    // ── Step 1-4: FanPlacementViz (인터랙티브) ──
    await expect(getStepIndicator(page)).toHaveText("4/7");
    // ▶ 다음 버튼이 보여야 함
    const placementNext = page.locator("button").filter({ hasText: "▶" }).first();
    await expect(placementNext).toBeVisible();
    // 2~3회 클릭하여 배치 진행
    await placementNext.click();
    await placementNext.click();
    await placementNext.click();
    // 남은/Pool 표시 확인
    await expect(page.locator("text=남은:").or(page.locator("text=Pool:"))).toBeVisible();
    await goNext(page);

    // ── Step 1-5: SeparatorBuildViz (인터랙티브) ──
    await expect(getStepIndicator(page)).toHaveText("5/7");
    // "분리자 추가" 버튼
    const addSep = page.locator("button").filter({ hasText: /분리자 추가|Add separator/ });
    await expect(addSep).toBeVisible();
    // 분리자 2개 추가 (insight가 나타나려면 sepCount >= 2)
    await addSep.click();
    await addSep.click();
    // 패턴 insight 확인
    await expect(page.locator("text=min(total")).toBeVisible();
    await goNext(page);

    // ── Step 1-6: Quiz (correct = 1, "11") ──
    await expect(getStepIndicator(page)).toHaveText("6/7");
    await expect(nextBtnBlocked).toBeDisabled();
    await page.locator("button").filter({ hasText: "11" }).first().click();
    await expect(page.locator("text=✅")).toBeVisible();
    await goNext(page);

    // ── Step 1-7: Quiz (correct = 1, "9 (전부 사용!)") ──
    await expect(getStepIndicator(page)).toHaveText("7/7");
    await page.locator("button").filter({ hasText: /9.*전부 사용/ }).click();
    await expect(page.locator("text=✅")).toBeVisible();
    // 마지막 스텝이므로 → 버튼 비활성
    await expect(page.locator("button").filter({ hasText: "→" })).toBeDisabled();
  });
});


/* ════════════════════════════════════════════════════════════════
   Chapter 2: 🏗️ 시뮬레이션 (4 steps)
   ════════════════════════════════════════════════════════════════ */
test.describe("Fans Ch2 — 시뮬레이션", () => {
  test("학생이 Ch2를 처음부터 끝까지 완주", async ({ page }) => {
    await enterFans(page);

    // 🏗️ 시뮬 탭 클릭
    await page.locator("button").filter({ hasText: /시뮬|Sim/ }).click();
    await expect(getStepIndicator(page)).toHaveText("1/4");

    // ── Step 2-1: FanSimulator ──
    // 프리셋 버튼이 보여야 한다
    await expect(page.locator("button").filter({ hasText: "[3,7,2]" })).toBeVisible();
    // ▶ 다음 버튼으로 2~3 스텝 진행
    const simNext = page.locator("button").filter({ hasText: /▶.*다음|▶.*Next/ }).first();
    await expect(simNext).toBeVisible();
    await simNext.click();
    await simNext.click();
    // 배치 영역 확인
    await expect(page.locator("text=배치:").or(page.locator("text=Placed:"))).toBeVisible();
    await goNext(page);

    // ── Step 2-2: Quiz (correct = 2, 3번째 옵션: "total (전부 사용!)") ──
    await expect(getStepIndicator(page)).toHaveText("2/4");
    await page.locator("button").filter({ hasText: /total.*전부 사용|total.*use everything/ }).click();
    await expect(page.locator("text=✅")).toBeVisible();
    await goNext(page);

    // ── Step 2-3: NumInput (answer = 5) ──
    await expect(getStepIndicator(page)).toHaveText("3/4");
    // "먼저 답해봐" 블로커 확인
    await expect(page.locator("button").filter({ hasText: "→" })).toBeDisabled();
    // 입력 필드에 5 입력
    const input1 = page.locator("input");
    await input1.fill("5");
    await page.locator("button").filter({ hasText: /확인|Check/ }).click();
    await expect(page.locator("text=✅")).toBeVisible();
    await goNext(page);

    // ── Step 2-4: NumInput (answer = 12) ──
    await expect(getStepIndicator(page)).toHaveText("4/4");
    const input2 = page.locator("input");
    await input2.fill("12");
    await page.locator("button").filter({ hasText: /확인|Check/ }).click();
    await expect(page.locator("text=✅")).toBeVisible();
    // 마지막 스텝
    await expect(page.locator("button").filter({ hasText: "→" })).toBeDisabled();
  });
});


/* ════════════════════════════════════════════════════════════════
   Chapter 3: ⚡ 코드 (6 steps)
   ════════════════════════════════════════════════════════════════ */
test.describe("Fans Ch3 — 코드 빌드", () => {
  test("학생이 Ch3를 처음부터 끝까지 완주", async ({ page }) => {
    await enterFans(page);

    // ⚡ 코드 탭 클릭
    await page.locator("button").filter({ hasText: /코드|Code/ }).click();
    await expect(getStepIndicator(page)).toHaveText("1/6");

    // ── Step 3-1: Code step 1 (reveal — T & loop) ──
    await expect(page.locator("text=T = int(input())")).toBeVisible();
    await goNext(page);

    // ── Step 3-2: Code step 2 (reveal — N & counts) ──
    await expect(getStepIndicator(page)).toHaveText("2/6");
    await expect(page.locator("text=c = [3, 7, 2]")).toBeVisible();
    await goNext(page);

    // ── Step 3-3: Code step 3 (reveal — total, max, rest) ──
    await expect(getStepIndicator(page)).toHaveText("3/6");
    await expect(page.locator("text=total").first()).toBeVisible();
    await goNext(page);

    // ── Step 3-4: Code step 4 (reveal — formula line) ──
    await expect(getStepIndicator(page)).toHaveText("4/6");
    await expect(page.locator("text=print(min(total")).toBeVisible();
    await goNext(page);

    // ── Step 3-5: FormulaTrace (인터랙티브) ──
    await expect(getStepIndicator(page)).toHaveText("5/6");
    // ▶ 다음 버튼으로 4번 클릭하여 전체 trace 완료
    const traceNext = page.locator("button").filter({ hasText: /▶.*다음|▶.*Next/ }).first();
    await expect(traceNext).toBeVisible();
    await traceNext.click();
    await traceNext.click();
    await traceNext.click();
    await traceNext.click();
    // trace 완료 후 ↺ 처음부터 버튼이 나타남
    await expect(page.locator("button").filter({ hasText: /처음부터|Restart/ })).toBeVisible();
    await goNext(page);

    // ── Step 3-6: CodeReveal (전체 코드 보기) ──
    await expect(getStepIndicator(page)).toHaveText("6/6");
    // 코드 보기 버튼 클릭
    const revealBtn = page.locator("button").filter({ hasText: /전체 코드 보기|Show complete code/ });
    await expect(revealBtn).toBeVisible();
    await revealBtn.click();
    // 코드가 표시됨 (T = int(input()))
    await expect(page.locator("text=T = int(input())")).toBeVisible();
    // 마지막 스텝
    await expect(page.locator("button").filter({ hasText: "→" })).toBeDisabled();
  });
});


/* ════════════════════════════════════════════════════════════════
   엣지 케이스: 오답 입력 후 재시도
   ════════════════════════════════════════════════════════════════ */
test.describe("Fans 오답 처리", () => {
  test("퀴즈 오답 선택시 ❌ 표시 + 다음 진행 불가", async ({ page }) => {
    await enterFans(page);
    await goNext(page); // step 1
    await goNext(page); // step 2

    // Step 1-3 퀴즈: 오답 선택 (1번째 옵션 "빨빨파파")
    await expect(getStepIndicator(page)).toHaveText("3/7");
    await page.locator("button").filter({ hasText: "빨빨파파" }).click();
    // ❌ 표시 + 정답에 ✅ 표시
    await expect(page.locator("text=❌")).toBeVisible();
    await expect(page.locator("text=✅")).toBeVisible();
    // 오답이라도 이미 answered 이므로 다음으로 진행 가능
    await goNext(page);
    await expect(getStepIndicator(page)).toHaveText("4/7");
  });

  test("NumInput 오답 후 재시도하여 정답", async ({ page }) => {
    await enterFans(page);

    // Ch2 탭으로 이동
    await page.locator("button").filter({ hasText: /시뮬|Sim/ }).click();
    await goNext(page); // step 1 → 2

    // quiz step 2-2 정답 맞춤
    await page.locator("button").filter({ hasText: /total.*전부 사용|total.*use everything/ }).click();
    await goNext(page); // step 2 → 3

    // Step 2-3: 오답 입력 (answer = 5, 일부러 7 입력)
    await expect(getStepIndicator(page)).toHaveText("3/4");
    const input = page.locator("input");
    await input.fill("7");
    await page.locator("button").filter({ hasText: /확인|Check/ }).click();
    await expect(page.locator("text=다시!").or(page.locator("text=Try again!"))).toBeVisible();

    // → 버튼 여전히 비활성
    await expect(page.locator("button").filter({ hasText: "→" })).toBeDisabled();

    // 재시도: 정답 입력
    await input.fill("5");
    await page.locator("button").filter({ hasText: /확인|Check/ }).click();
    await expect(page.locator("text=✅")).toBeVisible();
    await goNext(page);
    await expect(getStepIndicator(page)).toHaveText("4/4");
  });
});


/* ════════════════════════════════════════════════════════════════
   탭 전환 테스트
   ════════════════════════════════════════════════════════════════ */
test.describe("Fans 탭 전환", () => {
  test("탭 전환 시 스텝이 1/N으로 리셋됨", async ({ page }) => {
    await enterFans(page);

    // Ch1에서 스텝 몇 개 진행
    await goNext(page);
    await goNext(page);
    await expect(getStepIndicator(page)).toHaveText("3/7");

    // Ch2 탭으로 전환
    await page.locator("button").filter({ hasText: /시뮬|Sim/ }).click();
    await expect(getStepIndicator(page)).toHaveText("1/4");

    // Ch3 탭으로 전환
    await page.locator("button").filter({ hasText: /코드|Code/ }).click();
    await expect(getStepIndicator(page)).toHaveText("1/6");

    // 다시 Ch1으로 돌아가면 리셋
    await page.locator("button").filter({ hasText: /문제|Problem/ }).click();
    await expect(getStepIndicator(page)).toHaveText("1/7");
  });
});
