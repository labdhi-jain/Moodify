import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [emotion, setEmotion] = useState("");
  const [confidence, setConfidence] = useState("");

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/detect-emotion",
        { image: imageSrc }
      );

      setEmotion(response.data.emotion);
      setConfidence(response.data.confidence);
    } catch (error) {
      console.error("Error detecting emotion:", error);
    }
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={400}
      />
      <br />
      <button onClick={capture}>Detect Emotion</button>

      {emotion && (
        <div>
          <h2>Emotion: {emotion}</h2>
          <h3>Confidence: {confidence}</h3>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;