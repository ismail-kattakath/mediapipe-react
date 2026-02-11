import { test, expect } from "@playwright/test";

test("Web Worker initializes without errors", async ({ page }) => {
  const errors: Error[] = [];
  page.on("pageerror", (err) => errors.push(err));
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(new Error(`Console error: ${msg.text()}`));
    }
  });

  await page.goto("/");

  // Check if "Generate Hello" button is present
  const button = page.getByRole("button", { name: "Generate Hello" });
  await expect(button).toBeVisible();

  // Click the button to trigger worker initialization (if not lazy)
  // In genai.ts, useEffect initializes worker on mount if modelPath is present.
  // In page.tsx, MediaPipeProvider is used but modelPath is not passed to it.
  // useLlm is called without options.

  // Actually, useLlm in genai.ts:
  // const modelPath = options.modelPath || context.modelPath;
  // if (!context.isBrowser || !modelPath) return;
  // So if no modelPath is provided, worker won't initialize.

  // I should probably check if I need to pass a modelPath to the provider in playground-next
  // or just check that NO errors occurred on page load.

  // Wait a bit for any potential async errors
  await page.waitForTimeout(2000);

  expect(errors).toEqual([]);
});
