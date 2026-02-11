import { MediaPipeProvider } from "@ismail-kattakath/mediapipe-react";
import { useVision } from "@ismail-kattakath/mediapipe-react/vision";

function App() {
  return (
    <MediaPipeProvider>
      <div style={{ padding: "2rem" }}>
        <h1>Vite Playground</h1>
        <p>Testing Library: {useVision()}</p>
      </div>
    </MediaPipeProvider>
  );
}

export default App;
