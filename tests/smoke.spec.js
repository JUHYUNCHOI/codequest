import { test, expect } from "@playwright/test";

test("홈 화면 로드", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
});

test("Fans 페이지 진입", async ({ page }) => {
  await page.goto("/");
  await page.click("text=Fans");
  await expect(page.getByRole("heading", { name: "Fans" })).toBeVisible();
});

test("Fences 페이지 진입", async ({ page }) => {
  await page.goto("/");
  await page.click("text=Building Fences");
  await expect(page.getByRole("heading", { name: "Building Fences" })).toBeVisible();
});
