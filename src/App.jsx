import { useState, useEffect } from "react";
import "./App.css";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

function App() {
  const [copied, setCopied] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  const startListening = () => {
    setCopied(false);
    setDisplayText("");  // reset displayed text on new session
    setIndex(0);
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const copyToClipboard = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Typing effect: reveal transcript text one character at a time
  useEffect(() => {
    if (index < transcript.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + transcript.charAt(index));
        setIndex(index + 1);
      }, 40); // typing speed in ms, adjust if needed

      return () => clearTimeout(timeout);
    } else if (index > transcript.length) {
      // Reset if transcript shrinks or resets
      setDisplayText("");
      setIndex(0);
    }
  }, [index, transcript]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="container">
        <h1>Speech to Text generator</h1>
        <p>Your browser does not support speech recognition.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="container">
        <h1>Speech to Text generator</h1>
        <p>Speak and watch your words turn into text instantly. A simple tool to convert voice to text.</p>

        <div className="main-content" aria-live="polite" aria-label="Transcribed text with typing effect">
          {displayText || "Start speaking to see the transcription here..."}
        </div>

        <div className="btn-style">
          <button onClick={copyToClipboard} disabled={!transcript}>
            {copied ? "Copied!" : "Copy"}
          </button>
          <button onClick={startListening}>Start listening</button>
          <button onClick={stopListening}>Stop listening</button>
        </div>
      </div>
    </div>
  );
}

export default App;
