import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useLlm } from "../genai";
import { MediaPipeProvider } from "../index";
import React from "react";

// Mock Worker
global.Worker = vi.fn();

vi.mock("../utils", () => ({
  isBrowser: false,
}));

describe("useLlm SSR safety", () => {
  it("does not initialize Worker when isBrowser is false", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MediaPipeProvider modelPath="test-model">{children}</MediaPipeProvider>
    );

    renderHook(() => useLlm(), { wrapper });

    expect(global.Worker).not.toHaveBeenCalled();
  });
});
