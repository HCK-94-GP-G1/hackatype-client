import { useLocation, useNavigate, Navigate } from "react-router";

export default function ResultPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const username = localStorage.getItem("username");

  if (!state) return <Navigate to="/" />;

  const { winner, loser } = state;
  const isWinner = winner.username === username;
  const myStats = isWinner ? winner : loser;
  const feedback = isWinner
    ? "Excellent speed! Keep maintaining that rhythm and you'll be unstoppable."
    : "Good effort! Practice your weak spots and you'll catch up next time.";

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body items-center text-center gap-6">
          {/* Result */}
          <div>
            <div className="text-5xl mb-3">{isWinner ? "🏆" : "😔"}</div>
            <h1 className="text-2xl font-bold">
              {isWinner ? "You won!" : "You lost!"}
            </h1>
            <p className="text-base-content/60 text-sm mt-1">Race finished</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="bg-base-200 rounded-xl p-4">
              <p className="text-xs text-base-content/60 mb-1">WPM</p>
              <p className="text-2xl font-bold">{myStats.wpm}</p>
            </div>
            <div className="bg-base-200 rounded-xl p-4">
              <p className="text-xs text-base-content/60 mb-1">Accuracy</p>
              <p className="text-2xl font-bold">{myStats.accuracy}%</p>
            </div>
            <div className="bg-base-200 rounded-xl p-4">
              <p className="text-xs text-base-content/60 mb-1">Time</p>
              <p className="text-2xl font-bold">{formatTime(myStats.time)}</p>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`w-full rounded-xl p-4 text-left flex gap-2 items-start
              ${isWinner ? "bg-blue-500/10" : "bg-base-200"}`}
            >
              <span
                className={`shrink-0 mt-0.5
                ${isWinner ? "text-blue-400" : "text-base-content/40"}`}
              >
                ✦
              </span>
              <p
                className={`text-sm leading-relaxed
                ${isWinner ? "text-blue-400" : "text-base-content/60"}`}
              >
                {feedback}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <button className="btn btn-outline" onClick={() => navigate("/")}>
              Play again
            </button>
            <button
              className="btn btn-outline"
              onClick={() => navigate("/leaderboard")}
            >
              Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
