import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { socket } from "../lib/socket";

export default function WaitingRoom() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [opponent, setOpponent] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const username = localStorage.getItem("username");

  useEffect(() => {
    // server emit game/start setelah kedua player siap
    // payload berisi teks yang harus diketik dan list username kedua player
    socket.on("game/start", ({ text, players }) => {
      // cari siapa lawan kita dari list players
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
          // pass text ke GamePage lewat navigate state
          navigate(`/game/${roomCode}`, { state: { text } });
        }
      }, 1000);
    });

    return () => {
      socket.off("game/start");
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Hacka<span className="text-primary">Type</span>
      </h1>

      <div className="card bg-base-200 w-full max-w-md shadow-xl">
        <div className="card-body items-center gap-6">
          <div className="text-center">
            <p className="text-base-content/60 text-sm mb-1">Room Code</p>
            <p className="text-3xl font-bold tracking-widest text-primary">
              {roomCode}
            </p>
          </div>

          <div className="divider w-full">VS</div>

          <div className="flex justify-around w-full">
            <div className="text-center">
              <div className="avatar placeholder mb-2">
                <div className="bg-primary text-primary-content rounded-full w-12">
                  <span>{username?.[0].toUpperCase()}</span>
                </div>
              </div>
              <p className="font-semibold">{username}</p>
              <p className="text-xs text-success">Ready</p>
            </div>

            <div className="text-center">
              <div className="avatar placeholder mb-2">
                <div className="bg-base-300 text-base-content rounded-full w-12">
                  <span>{opponent ? opponent[0].toUpperCase() : "?"}</span>
                </div>
              </div>
              <p className="font-semibold">{opponent ?? "Waiting..."}</p>
              {opponent && <p className="text-xs text-success">Ready</p>}
            </div>
          </div>

          {countdown ? (
            <div className="text-6xl font-bold text-primary animate-pulse">
              {countdown}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-base-content/60">
              <span className="loading loading-dots loading-sm"></span>
              <span>Waiting for opponent...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
