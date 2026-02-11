"use client";

import { MediaPipeProvider } from "@ismail-kattakath/mediapipe-react";
import { useLlm } from "@ismail-kattakath/mediapipe-react/genai";

function Chat() {
  const { output, isLoading, generate } = useLlm();

  return (
    <div>
      <button onClick={() => generate("Hello!")} disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Hello"}
      </button>
      <pre>{output}</pre>
    </div>
  );
}

export default function Home() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Next.js Playground</h1>
      <MediaPipeProvider>
        <Chat />
      </MediaPipeProvider>
    </main>
  );
}
