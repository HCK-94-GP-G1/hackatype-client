import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { socket } from "../lib/socket";
import { toast } from "react-toastify";

export default function WaitingRoom() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [opponent, setOpponent] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const username = localStorage.getItem("username");

  useEffect(() => {
    socket.on("game/start", ({ text, players }) => {
      const myUsername = localStorage.getItem("username");
      const opponentUsername = players.find((p) => p !== myUsername);
      setOpponent(opponentUsername);

      let count = 3;
      setCountdown(count);

      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);

        if (count === 0) {
          clearInterval(interval);
          navigate(`/game/${roomCode}`, { state: { text } });
        }
      }, 1000);
    });

    socket.on("opponent/disconnected", () => {
      toast.error("Opponent disconnected!");
      navigate("/");
    });

    return () => {
      socket.off("game/start");
      socket.off("opponent/disconnected");
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center gap-6 p-8">
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Waiting Room</h2>
        <p className="text-base-content/50 text-sm">
          Share the room code with your friend to start the race
        </p>
      </div>

      <div className="card bg-base-200 w-full max-w-md shadow-xl">
        <div className="card-body items-center gap-6">
          <div className="text-center">
            <p className="text-base-content/50 text-xs uppercase tracking-widest mb-1">
              Room Code
            </p>
            <p className="text-4xl font-bold tracking-widest text-primary">
              {roomCode}
            </p>
          </div>

          <div className="divider w-full my-0">VS</div>

          <div className="flex justify-around w-full">
            <div className="text-center flex flex-col items-center gap-2">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-14">
                  <span className="text-xl">{username?.[0].toUpperCase()}</span>
                </div>
              </div>
              <p className="font-semibold">{username}</p>
              <span className="badge badge-success badge-sm">Ready</span>
            </div>

            <div className="text-center flex flex-col items-center gap-2">
              <div className="avatar placeholder">
                <div className="bg-base-300 text-base-content rounded-full w-14">
                  <span className="text-xl">
                    {opponent ? opponent[0].toUpperCase() : "?"}
                  </span>
                </div>
              </div>
              <p className="font-semibold">{opponent ?? "Waiting..."}</p>
              {opponent ? (
                <span className="badge badge-success badge-sm">Ready</span>
              ) : (
                <span className="badge badge-ghost badge-sm">Pending</span>
              )}
            </div>
          </div>

          <div className="w-full pt-2">
            {countdown ? (
              <div className="flex flex-col items-center gap-2">
                <p className="text-base-content/50 text-sm">Game starts in</p>
                <div className="text-7xl font-bold text-primary animate-pulse">
                  {countdown}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-base-content/50">
                <span className="loading loading-dots loading-sm"></span>
                <span>Waiting for opponent...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
