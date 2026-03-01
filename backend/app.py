from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import cv2
import numpy as np
import base64

app = Flask(__name__)
CORS(app)   # Enable CORS properly

print("Loading emotion model...")
model = load_model("emotion_model.hdf5")
print("Model loaded successfully!")

face_classifier = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)
print("Haarcascade loaded successfully!")

emotion_labels = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]


@app.route("/")
def home():
    return "Backend is working and model loaded!"


@app.route("/detect-emotion", methods=["POST"])
def detect_emotion():
    data = request.json
    image_data = data["image"]

    # Decode base64 image
    encoded_data = image_data.split(",")[1]
    np_arr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)

    if len(faces) == 0:
        return jsonify({"emotion": "No face detected"})

    for (x, y, w, h) in faces:
        roi_gray = gray[y:y + h, x:x + w]
        roi_gray = cv2.resize(roi_gray, (48, 48))
        roi_gray = roi_gray / 255.0
        roi_gray = np.reshape(roi_gray, (1, 48, 48, 1))

        prediction = model.predict(roi_gray)
        emotion = emotion_labels[np.argmax(prediction)]

        return jsonify({"emotion": emotion})


if __name__ == "__main__":
    app.run(debug=True)
    