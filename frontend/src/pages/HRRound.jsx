import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function HrRound() {

  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [question, setQuestion] = useState("");

  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // 🔥 Fetch HR Question from backend
  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/hr-question");
      setQuestion(res.data.question);
    } catch (err) {
      console.error(err);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      let chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setVideoBlob(blob);

        streamRef.current.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setRecording(true);

    } catch (error) {
      alert("Camera or microphone permission denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const submitAnswer = async () => {

    if (!videoBlob) {
      alert("Please record your answer first!");
      return;
    }

    const formData = new FormData();
    formData.append("audio", videoBlob, "answer.webm"); // 🔥 must match backend

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/hr-evaluate",
        formData
      );

      setFeedback(res.data.feedback);

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="p-10 text-white bg-gray-900 min-h-screen">

      <h1 className="text-3xl mb-6">HR Interview Practice</h1>

      {/* 🔥 Show Question */}
      <div className="mb-6 bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-semibold">Question:</h2>
        <p className="mt-2">{question}</p>
      </div>

      {/* 🔥 Video Preview */}
      <video
        ref={videoRef}
        autoPlay
        muted
        className="mb-6 w-96 rounded-lg border"
      />

      <div className="flex gap-4">
        <button
          onClick={startRecording}
          disabled={recording}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Start Recording
        </button>

        <button
          onClick={stopRecording}
          disabled={!recording}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Stop Recording
        </button>

        <button
          onClick={submitAnswer}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>

      {/* 🔥 AI Feedback */}
      {feedback && (
        <div className="mt-6 bg-gray-800 p-4 rounded">
          <h3 className="font-bold">AI Feedback</h3>
          <p className="mt-2 whitespace-pre-line">{feedback}</p>
        </div>
      )}

    </div>
  );
}