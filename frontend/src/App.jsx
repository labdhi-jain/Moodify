import { useRef, useState } from "react";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState("");

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const captureAndDetect = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/jpeg");

    const response = await fetch("http://127.0.0.1:5000/detect-emotion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageData }),
    });

    const data = await response.json();
    setEmotion(data.emotion);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Moodify 🎵</h1>

      <video
        ref={videoRef}
        autoPlay
        style={{ width: "400px", borderRadius: "10px" }}
      />

      <br /><br />

      <button onClick={startCamera}>Start Camera</button>
      <button onClick={captureAndDetect} style={{ marginLeft: "10px" }}>
        Detect Emotion
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <h2>Emotion: {emotion}</h2>
    </div>
  );
}

export default App;