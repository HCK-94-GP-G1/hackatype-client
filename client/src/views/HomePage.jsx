import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { socket } from "../lib/socket";

export default function HomePage() {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  useEffect(() => {
    socket.connect();

    socket.on("room/created", ({ roomCode }) => {
      navigate(`/room/${roomCode}`);
    });

    socket.on("room/joined", ({ roomCode }) => {
      navigate(`/room/${roomCode}`);
    });

    return () => {
      socket.off("room/created");
      socket.off("room/joined");
    };
  }, []);

  const handleCreate = () => {
    socket.emit("room/create", { userId, username });
  };

  const handleJoin = () => {
    socket.emit("room/join", { userId, username, roomCode });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center gap-10 p-8">
      {/* Hero */}
      <div className="text-center flex flex-col gap-3">
        <h1 className="text-6xl font-bold">
          Hacka<span className="text-primary">Type</span>
        </h1>
        <p className="text-base-content/50 text-lg">
          Race your friends in a real-time typing duel
        </p>
      </div>

      {/* Cards */}
      <div className="flex gap-6">
        <div className="card bg-base-200 w-72 shadow-xl">
          <div className="card-body items-center text-center gap-4">
            <h2 className="card-title text-xl">Create Room</h2>
            <p className="text-base-content/50 text-sm">
              Start a new race and share the code with a friend
            </p>
            <button className="btn btn-primary w-full" onClick={handleCreate}>
              Create
            </button>
          </div>
        </div>

        <div className="card bg-base-200 w-72 shadow-xl min-h-56">
          <div className="card-body items-center text-center gap-4">
            <h2 className="card-title text-xl">Join Room</h2>
            <p className="text-base-content/50 text-sm">
              Enter a room code to race against your friend
            </p>
            <input
              type="text"
              placeholder="Room code"
              className="input input-bordered w-full text-center tracking-widest uppercase"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            />
            <button className="btn btn-primary w-full" onClick={handleJoin}>
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
