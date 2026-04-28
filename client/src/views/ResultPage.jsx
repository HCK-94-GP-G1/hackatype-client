// src/views/ResultPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { socket } from "../lib/socket";

export default function ResultPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [winner, setWinner] = useState("");
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [time, setTime] = useState("0:00");
  const [aiFeedback, setAiFeedback] = useState("");

  const isWinner = winner === username;

  useEffect(() => {
    socket.on("game/result", ({ winner, loser, aiFeedback }) => {
      const me = winner.username === username ? winner : loser;
      setWinner(winner.username);
      setWpm(me.wpm);
      setAccuracy(me.accuracy);
      setTime(me.time ?? "0:00");
      setAiFeedback(aiFeedback ?? "");
    });

    return () => {
      socket.off("game/result");
    };
  }, []);

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body items-center text-center gap-6">

          {/* Result */}
          <div>
            <div className="text-5xl mb-3">
              {isWinner ? "🏆" : "😔"}
            </div>
            <h1 className="text-2xl font-bold">
              {isWinner ? "You won!" : "You lost!"}
            </h1>
            <p className="text-base-content/60 text-sm mt-1">Race finished</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="bg-base-200 rounded-xl p-4">
              <p className="text-xs text-base-content/60 mb-1">WPM</p>
              <p className="text-2xl font-bold">{wpm}</p>
            </div>
            <div className="bg-base-200 rounded-xl p-4">
              <p className="text-xs text-base-content/60 mb-1">Accuracy</p>
              <p className="text-2xl font-bold">{accuracy}%</p>
            </div>
            <div className="bg-base-200 rounded-xl p-4">
              <p className="text-xs text-base-content/60 mb-1">Time</p>
              <p className="text-2xl font-bold">{time}</p>
            </div>
          </div>

          {/* AI Feedback */}
          {aiFeedback && (
            <div className={`w-full rounded-xl p-4 text-left flex gap-2 items-start
              ${isWinner ? "bg-blue-500/10" : "bg-base-200"}`}>
              <span className={`flex-shrink-0 mt-0.5
                ${isWinner ? "text-blue-400" : "text-base-content/40"}`}>
                ✦
              </span>
              <p className={`text-sm leading-relaxed
                ${isWinner ? "text-blue-400" : "text-base-content/60"}`}>
                AI feedback: {aiFeedback}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <button className="btn btn-outline" onClick={() => navigate("/")}>
              Play again
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/leaderboard")}>
              Leaderboard
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}