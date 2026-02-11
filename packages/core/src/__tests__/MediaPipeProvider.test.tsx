import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MediaPipeProvider, useMediaPipeContext } from "../index";

const TestComponent = () => {
  const context = useMediaPipeContext();
  return (
    <div>
      <span data-testid="wasm">{context.wasmPath}</span>
      <span data-testid="model">{context.modelPath}</span>
      <span data-testid="browser">{context.isBrowser.toString()}</span>
    </div>
  );
};

describe("MediaPipeProvider", () => {
  it("provides context to children", () => {
    render(
      <MediaPipeProvider wasmPath="/wasm" modelPath="/model">
        <TestComponent />
      </MediaPipeProvider>,
    );

    expect(screen.getByTestId("wasm")).toHaveTextContent("/wasm");
    expect(screen.getByTestId("model")).toHaveTextContent("/model");
    expect(screen.getByTestId("browser")).toHaveTextContent("true");
  });

  it("throws error when used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow(
      "useMediaPipeContext must be used within a MediaPipeProvider",
    );
    consoleSpy.mockRestore();
  });
});
