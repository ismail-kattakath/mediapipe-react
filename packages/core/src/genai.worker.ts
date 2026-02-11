import { LlmInference, FilesetResolver } from "@mediapipe/tasks-genai";

let llmInference: LlmInference | null = null;

async function checkGpuSupport() {
  if (!("gpu" in navigator)) {
    throw new Error("WebGPU is not supported in this browser.");
  }
  const gpu = (navigator as unknown as { gpu: GPU }).gpu;
  const adapter = await gpu.requestAdapter();
  if (!adapter) {
    throw new Error("No appropriate GPU adapter found.");
  }
}

async function initInference(modelPath: string, wasmPath: string) {
  try {
    await checkGpuSupport();

    const genai = await FilesetResolver.forGenAiTasks(wasmPath);
    llmInference = await LlmInference.createFromOptions(genai, {
      baseOptions: { modelAssetPath: modelPath },
    });
    self.postMessage({ type: "INIT_COMPLETE" });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error during initialization";
    self.postMessage({ type: "ERROR", error: message });
  }
}

self.onmessage = async (event) => {
  const { type, payload } = event.data;

  if (type === "INIT") {
    const { modelPath, wasmPath } = payload;
    await initInference(modelPath, wasmPath);
  }

  if (type === "GENERATE") {
    if (!llmInference) {
      self.postMessage({
        type: "ERROR",
        error:
          "LLM Inference not initialized. Please ensure the model is loaded and WebGPU is supported.",
      });
      return;
    }

    try {
      const { prompt } = payload;
      llmInference.generateResponse(prompt, (partialText, done) => {
        self.postMessage({
          type: "CHUNK",
          payload: { text: partialText, done },
        });
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error generating response";
      self.postMessage({ type: "ERROR", error: message });
    }
  }
};
