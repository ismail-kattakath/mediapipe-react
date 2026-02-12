import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useFaceLandmarker } from "../vision";
import { MediaPipeProvider } from "../index";
import React from "react";

// Mock Worker
class MockWorker {
  onmessage: ((event: any) => void) | null = null;
  postMessage = vi.fn((data: any) => {
    if (data.type === "INIT") {
      // Simulate successful initialization
      setTimeout(() => {
        if (this.onmessage) {
          this.onmessage({ data: { type: "INIT_COMPLETE" } });
        }
      }, 0);
    }
    if (data.type === "DETECT") {
      // Simulate detection results
      setTimeout(() => {
        if (this.onmessage) {
          this.onmessage({
            data: {
              type: "RESULTS",
              payload: { faceLandmarks: [[{ x: 0.5, y: 0.5, z: 0 }]] },
            },
          });
        }
      }, 0);
    }
  });
  terminate = vi.fn();
}

global.Worker = MockWorker as any;
global.createImageBitmap = vi.fn().mockResolvedValue({});

describe("useFaceLandmarker", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MediaPipeProvider>{children}</MediaPipeProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize and load successfully", async () => {
    const { result } = renderHook(() => useFaceLandmarker(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(true));
    expect(result.current.results).toBeNull();

    // Wait for initialization
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("should return results when detect is called", async () => {
    const { result } = renderHook(() => useFaceLandmarker(), { wrapper });

    // Wait for initialization
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    const mockVideo = document.createElement("video");

    await act(async () => {
      result.current.detect(mockVideo as any, 1234);
    });

    // Wait for results
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(result.current.results).toBeDefined();
    const results = result.current.results as any;
    expect(results.faceLandmarks).toHaveLength(1);
    expect(results.faceLandmarks[0][0].x).toBe(0.5);
  });

  it("should handle initialization errors", async () => {
    const originalWorker = global.Worker;
    class ErrorWorker {
      onmessage: any = null;
      postMessage = vi.fn((data: any) => {
        if (data.type === "INIT") {
          setTimeout(() => {
            this.onmessage({
              data: { type: "ERROR", error: "Failed to init" },
            });
          }, 0);
        }
      });
      terminate = vi.fn();
    }
    global.Worker = ErrorWorker as any;

    const { result } = renderHook(() => useFaceLandmarker(), { wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(result.current.error).toBe("Failed to init");
    expect(result.current.isLoading).toBe(false);

    global.Worker = originalWorker;
  });
});
