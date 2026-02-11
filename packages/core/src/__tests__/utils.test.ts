import { describe, it, expect } from "vitest";
import { isBrowser } from "../utils";

describe("isBrowser", () => {
  it("should return true in jsdom environment", () => {
    expect(isBrowser).toBe(true);
  });
});
