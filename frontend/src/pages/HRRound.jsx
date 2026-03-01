import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function HrRound() {

  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [question, setQuestion] = useState("");
  const [timer, setTimer] = useState(0);

  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    const res = await axios.get("http://127.0.0.1:8000/hr-question");
    setQuestion(res.data.question);
    setAnalysis(null);
    setTranscript("");
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
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setVideoBlob(blob);
        streamRef.current.getTracks().forEach(track => track.stop());
        clearInterval(timerRef.current);
      };

      recorder.start();
      setRecording(true);
      setTimer(0);

      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);

    } catch {
      alert("Camera permission denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const submitAnswer = async () => {

    if (!videoBlob) {
      alert("Please record first");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoBlob, "answer.webm");

    const res = await axios.post(
      "http://127.0.0.1:8000/hr-evaluate",
      formData
    );

    setTranscript(res.data.transcript);
    setAnalysis(res.data.analysis);
  };

  return (
    <div className="p-10 text-white bg-gray-900 min-h-screen">

      <h1 className="text-3xl mb-6">AI HR Interview Practice</h1>

      {/* Question */}
      <div className="mb-6 bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-semibold">Question:</h2>
        <p className="mt-2">{question}</p>
      </div>

      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        className="mb-4 w-96 rounded-lg border"
      />

      <p className="mb-4">Recording Time: {timer}s</p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={startRecording}
          disabled={recording}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Start
        </button>

        <button
          onClick={stopRecording}
          disabled={!recording}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Stop
        </button>

        <button
          onClick={submitAnswer}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Submit
        </button>

        <button
          onClick={fetchQuestion}
          className="bg-purple-600 px-4 py-2 rounded"
        >
          New Question
        </button>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="bg-gray-800 p-4 rounded mb-6">
          <h3 className="font-bold">Transcript</h3>
          <p className="mt-2">{transcript}</p>
        </div>
      )}

      {/* Analysis */}
      {analysis && (
        <div className="bg-gray-800 p-6 rounded">
          <h3 className="text-xl font-bold mb-4">AI Evaluation</h3>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(analysis, null, 2)}
          </pre>
        </div>
      )}

    </div>
  );
}