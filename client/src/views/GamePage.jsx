import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { socket } from "../lib/socket";
import { toast } from "react-toastify";

export default function GamePage() {
  const { roomCode } = useParams();
  const { state } = useLocation();
  const text = state?.text;
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  const myProgress = text ? Math.round((input.length / text.length) * 100) : 0;
  const username = localStorage.getItem("username");

  useEffect(() => {
    socket.on("game/opponent-progress", ({ progress }) => {
      setOpponentProgress(progress);
    });

    socket.on("game/result", ({ winner, loser }) => {
      socket.disconnect();
      navigate("/result", { state: { winner, loser } });
    });

    socket.on("opponent/disconnected", () => {
      toast.error("Opponent disconnected!");
      socket.disconnect();
      navigate("/");
    });

    return () => {
      socket.off("game/opponent-progress");
      socket.off("game/result");
      socket.off("opponent/disconnected");
    };
  }, []);

  function handleInput(e) {
    const value = e.target.value;

    // block duluan sebelum apapun
    if (value.length > text.length) return;

    if (!startTime) setStartTime(Date.now());

    setTotalKeystrokes((prev) => prev + 1);
    setInput(value);

    socket.emit("game/progress", { roomCode, charCount: value.length });

    if (value === text) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      const wpm = Math.round(text.length / 5 / elapsedMinutes);
      const accuracy =
        totalKeystrokes > 0
          ? Math.round((text.length / totalKeystrokes) * 100)
          : 100;
      const time = Math.round((Date.now() - startTime) / 1000);

      setFinished(true);
      socket.emit("game/finished", { roomCode, wpm, accuracy, time });
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center gap-6 p-8">
      {/* Progress bars */}
      <div className="w-full max-w-2xl flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{username}</span>
            <span className="text-base-content/50">{myProgress}%</span>
          </div>
          <progress
            className="progress progress-primary w-full"
            value={input.length}
            max={text?.length}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Opponent</span>
            <span className="text-base-content/50">{opponentProgress}%</span>
          </div>
          <progress
            className="progress progress-error w-full"
            value={opponentProgress}
            max={100}
          />
        </div>
      </div>

      {/* Teks */}
      <div className="w-full max-w-2xl bg-base-200 rounded-xl p-6 text-lg leading-relaxed tracking-wide font-mono">
        {text?.split("").map((char, i) => {
          let color = "text-base-content/40";
          if (i < input.length) {
            color = input[i] === char ? "text-success" : "text-error";
          }

          const isCurrent = i === input.length;

          return (
            <span key={i} className={`relative ${color}`}>
              {isCurrent && (
                <span className="absolute left-0 top-0 h-full w-0.5 bg-primary animate-pulse" />
              )}
              {char}
            </span>
          );
        })}
      </div>

      {/* Input */}
      <textarea
        className="textarea textarea-bordered w-full max-w-2xl font-mono"
        rows={3}
        value={input}
        onChange={handleInput}
        disabled={finished}
        placeholder="Start typing..."
        autoFocus
      />

      {finished && (
        <div className="flex items-center gap-2 text-success font-semibold text-lg">
          <span className="loading loading-dots loading-sm"></span>
          Waiting for opponent to finish...
        </div>
      )}
    </div>
  );
}
