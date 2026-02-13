import { test, expect } from "@playwright/test";

/*  ──────────────────────────────────────────────────────────────
    Building Fences 튜토리얼 학생 플로우 E2E 테스트
    ──────────────────────────────────────────────────────────────
    학생이 Fences 페이지에 진입해서 Ch1→Ch2→Ch3를 완주하는 전체 흐름.
    ────────────────────────────────────────────────────────────── */

/* helper: 다음 스텝으로 이동 (→ 버튼 클릭) */
const goNext = async (page) => {
  const nextBtn = page.locator("button").filter({ hasText: "→" });
  await expect(nextBtn).toBeEnabled({ timeout: 5000 });
  await nextBtn.click();
};

/* helper: 스텝 인디케이터 텍스트 (e.g. "3/6") */
const getStepIndicator = (page) =>
  page.locator("span").filter({ hasText: /^\d+\/\d+$/ });

/* helper: Fences 페이지 진입 */
const enterFences = async (page) => {
  await page.goto("/");
  await page.click("text=Building Fences");
  await expect(page.getByRole("heading", { name: "Building Fences" })).toBeVisible();
};

/* ════════════════════════════════════════════════════════════════
   Chapter 1: 📋 문제 이해 (6 steps)
   ════════════════════════════════════════════════════════════════ */
test.describe("Fences Ch1 — 문제 이해", () => {
  test("학생이 Ch1을 처음부터 끝까지 완주", async ({ page }) => {
    await enterFences(page);

    // 기본적으로 Ch1 탭이 선택
    await expect(getStepIndicator(page)).toHaveText("1/6");

    // ── Step 1-1: Title (reveal) ──
    await expect(page.getByText("MCC 2025 P1")).toBeVisible();
    await goNext(page);

    // ── Step 1-2: Grid explanation (reveal) ──
    await expect(getStepIndicator(page)).toHaveText("2/6");
    // 세로줄 설명이 보여야 함
    await expect(page.locator("text=이게 열 하나야").or(page.locator("text=This is one column"))).toBeVisible();
    await goNext(page);

    // ── Step 1-3: Quiz (correct = 2, "열의 모든 칸이 #이어야 한다") ──
    await expect(getStepIndicator(page)).toHaveText("3/6");
    await expect(page.locator("button").filter({ hasText: "→" })).toBeDisabled();
    await page.locator("button").filter({ hasText: /모든 칸이.*#|Every cell.*must be/ }).click();
    await expect(page.locator("text=✅")).toBeVisible();
    await goNext(page);

    // ── Step 1-4: Cost concept (reveal) ──
    await expect(getStepIndicator(page)).toHaveText("4/6");
    // 비용 설명이 보임
    await expect(page.locator("text=비용").or(page.locator("text=Cost"))).toBeVisible();
    await goNext(page);

    // ── Step 1-5: Goal quiz with grid (reveal) ──
    await expect(getStepIndicator(page)).toHaveText("5/6");
    await expect(page.locator("text=가장 싸").or(page.locator("text=cheapest"))).toBeVisible();
    await goNext(page);

    // ── Step 1-6: Quiz (correct = 1, "4열 (점 0개 = 비용 0!)") ──
    await expect(getStepIndicator(page)).toHaveText("6/6");
    await expect(page.locator("button").filter({ hasText: "→" })).toBeDisabled();
    await page.locator("button").filter({ hasText: /4열.*비용 0|4th column.*cost 0/ }).click();
    await expect(page.locator("text=✅")).toBeVisible();
    // 마지막 스텝
    await expect(page.locator("button").filter({ hasText: "→" })).toBeDisabled();
  });
});


/* ════════════════════════════════════════════════════════════════
   Chapter 2: 🏗️ 시뮬레이션 (4 steps)
   ════════════════════════════════════════════════════════════════ */
test.describe("Fences Ch2 — 시뮬레이션", () => {
  test("학생이 Ch2를 처음부터 끝까지 완주", async ({ page }) => {
    await enterFences(page);

    // 🏗️ 시뮬 탭 클릭
    await page.locator("button").filter({ hasText: /시뮬|Sim/ }).click();
    await expect(getStepIndicator(page)).toHaveText("1/4");

    // ── Step 2-1: FenceColumnScanner ──
    // "열별로 스캔!" 버튼이 보여야 한다
    const scanBtn = page.locator("button").filter({ hasText: /열별로 스캔|Scan columns/ });
    await expect(scanBtn).toBeVisible();
    // 스캔 시작
    await scanBtn.click();

    // 스캔 중 또는 열 완료 후 "다음" 버튼이 나타남 — 기다림
    // FenceColumnScanner는 자동 애니메이션이므로 "colDone" 상태를 기다림
    // 첫 번째 열 스캔 완료까지 대기 (최대 5초)
    const nextColBtn = page.locator("button").filter({ hasText: /다음.*열|Next.*Column|결과 보기|See result/ });
    await expect(nextColBtn).toBeVisible({ timeout: 10000 });

    // 나머지 열 스캔 — 결과가 나올 때까지 반복 클릭
    while (await page.locator("button").filter({ hasText: /다음.*열|Next.*Column/ }).isVisible().catch(() => false)) {
      await page.locator("button").filter({ hasText: /다음.*열|Next.*Column/ }).click();
      await page.waitForTimeout(3000);
    }

    // "결과 보기" 버튼이 보이면 클릭
    const seeResult = page.locator("button").filter({ hasText: /결과 보기|See result/ });
    if (await seeResult.isVisible().catch(() => false)) {
      await seeResult.click();
    }

    // done 상태: 답이 표시됨
    await expect(page.locator("text=답").or(page.locator("text=Answer"))).toBeVisible({ timeout: 5000 });
    await goNext(page);

    // ── Step 2-2: Quiz (correct = 2, "열별 '.' 개수의 최솟값") ──
    await expect(getStepIndicator(page)).toHaveText("2/4");
    await page.locator("button").filter({ hasText: /최솟값|minimum/ }).click();
    await expect(page.locator("text=✅")).toBeVisible();
    await goNext(page);

    // ── Step 2-3: NumInput (answer = 0) ──
    await expect(getStepIndicator(page)).toHaveText("3/4");
    const input1 = page.locator("input");
    await input1.fill("0");
    await page.locator("button").filter({ hasText: /확인|Check/ }).click();
    await expect(page.locator("text=✅")).toBeVisible();
    await goNext(page);

    // ── Step 2-4: NumInput (answer = 1) ──
    await expect(getStepIndicator(page)).toHaveText("4/4");
    const input2 = page.locator("input");
    await input2.fill("1");
    await page.locator("button").filter({ hasText: /확인|Check/ }).click();
    await expect(page.locator("text=✅")).toBeVisible();
    // 마지막 스텝
    await expect(page.locator("button").filter({ hasText: "→" })).toBeDisabled();
  });
});


/* ════════════════════════════════════════════════════════════════
   Chapter 3: ⚡ 코드 (6 steps)
   ════════════════════════════════════════════════════════════════ */
test.describe("Fences Ch3 — 코드 빌드", () => {
  test("학생이 Ch3를 처음부터 끝까지 완주", async ({ page }) => {
    await enterFences(page);

    // ⚡ 코드 탭 클릭
    await page.locator("button").filter({ hasText: /코드|Code/ }).click();
    await expect(getStepIndicator(page)).toHaveText("1/6");

    // ── Step 3-1: Read N, M (reveal) ──
    await expect(page.locator("text=N, M = map")).toBeVisible();
    await goNext(page);

    // ── Step 3-2: Prepare count list (reveal) ──
    await expect(getStepIndicator(page)).toHaveText("2/6");
    await expect(page.locator("text=count = [0] * M")).toBeVisible();
    await goNext(page);

    // ── Step 3-3: RowColumnFillViz (인터랙티브) ──
    await expect(getStepIndicator(page)).toHaveText("3/6");
    // ▶ 다음 스텝 버튼
    const vizNext = page.locator("button").filter({ hasText: /▶.*다음 스텝|▶.*Next step/ }).first();
    await expect(vizNext).toBeVisible();
    // 몇 스텝 진행
    await vizNext.click();
    await vizNext.click();
    await vizNext.click();
    // count 라벨 확인
    await expect(page.getByText("count", { exact: true })).toBeVisible();
    await goNext(page);

    // ── Step 3-4: Quiz (correct = 1, "입력이 한 줄(행)씩 오니까") ──
    await expect(getStepIndicator(page)).toHaveText("4/6");
    await page.locator("button").filter({ hasText: /입력이 한 줄|Input comes one row/ }).click();
    await expect(page.locator("text=✅")).toBeVisible();
    await goNext(page);

    // ── Step 3-5: Print answer (reveal) ──
    await expect(getStepIndicator(page)).toHaveText("5/6");
    await expect(page.locator("text=print(min(count))")).toBeVisible();
    await goNext(page);

    // ── Step 3-6: CodeReveal (전체 코드 보기) ──
    await expect(getStepIndicator(page)).toHaveText("6/6");
    const revealBtn = page.locator("button").filter({ hasText: /전체 코드 보기|Show complete code/ });
    await expect(revealBtn).toBeVisible();
    await revealBtn.click();
    // 코드가 펼쳐짐
    await expect(page.locator("text=N, M = map")).toBeVisible();
    // 마지막 스텝
    await expect(page.locator("button").filter({ hasText: "→" })).toBeDisabled();
  });
});


/* ════════════════════════════════════════════════════════════════
   엣지 케이스: 오답 + 탭 전환
   ════════════════════════════════════════════════════════════════ */
test.describe("Fences 오답 및 탭 전환", () => {
  test("퀴즈 오답 선택시 ❌ 표시", async ({ page }) => {
    await enterFences(page);
    await goNext(page); // 1→2
    await goNext(page); // 2→3

    // Step 1-3 퀴즈: 오답 선택 (1번째 옵션)
    await expect(getStepIndicator(page)).toHaveText("3/6");
    await page.locator("button").filter({ hasText: /절반 이상|At least half/ }).click();
    await expect(page.locator("text=❌")).toBeVisible();
    await expect(page.locator("text=✅")).toBeVisible();
    // 오답이어도 다음 진행 가능
    await goNext(page);
    await expect(getStepIndicator(page)).toHaveText("4/6");
  });

  test("탭 전환 시 스텝 리셋", async ({ page }) => {
    await enterFences(page);
    await goNext(page);
    await goNext(page);
    await expect(getStepIndicator(page)).toHaveText("3/6");

    // Ch2로 전환
    await page.locator("button").filter({ hasText: /시뮬|Sim/ }).click();
    await expect(getStepIndicator(page)).toHaveText("1/4");

    // Ch3로 전환
    await page.locator("button").filter({ hasText: /코드|Code/ }).click();
    await expect(getStepIndicator(page)).toHaveText("1/6");

    // Ch1으로 복귀 → 리셋
    await page.locator("button").filter({ hasText: /문제|Problem/ }).click();
    await expect(getStepIndicator(page)).toHaveText("1/6");
  });

  test("NumInput 오답 후 재시도", async ({ page }) => {
    await enterFences(page);

    // Ch2로 이동
    await page.locator("button").filter({ hasText: /시뮬|Sim/ }).click();

    // Step 2-1 FenceColumnScanner — 스캔 완료 없이 그냥 다음으로 못 감
    // 스캔 시작
    await page.locator("button").filter({ hasText: /열별로 스캔|Scan columns/ }).click();

    // 스캔 완료 대기 후 모든 열 진행
    const nextColOrResult = page.locator("button").filter({ hasText: /다음.*열|Next.*Column|결과 보기|See result/ });
    await expect(nextColOrResult).toBeVisible({ timeout: 10000 });

    while (await page.locator("button").filter({ hasText: /다음.*열|Next.*Column/ }).isVisible().catch(() => false)) {
      await page.locator("button").filter({ hasText: /다음.*열|Next.*Column/ }).click();
      await page.waitForTimeout(3000);
    }

    const seeResult = page.locator("button").filter({ hasText: /결과 보기|See result/ });
    if (await seeResult.isVisible().catch(() => false)) {
      await seeResult.click();
    }

    await expect(page.locator("text=답").or(page.locator("text=Answer"))).toBeVisible({ timeout: 5000 });
    await goNext(page);

    // quiz
    await page.locator("button").filter({ hasText: /최솟값|minimum/ }).click();
    await goNext(page);

    // Step 2-3: 오답 (answer=0, 일부러 5 입력)
    await expect(getStepIndicator(page)).toHaveText("3/4");
    const input = page.locator("input");
    await input.fill("5");
    await page.locator("button").filter({ hasText: /확인|Check/ }).click();
    await expect(page.locator("text=다시!").or(page.locator("text=Try again!"))).toBeVisible();
    await expect(page.locator("button").filter({ hasText: "→" })).toBeDisabled();

    // 정답 재입력
    await input.fill("0");
    await page.locator("button").filter({ hasText: /확인|Check/ }).click();
    await expect(page.locator("text=✅")).toBeVisible();
    await goNext(page);
    await expect(getStepIndicator(page)).toHaveText("4/4");
  });
});
