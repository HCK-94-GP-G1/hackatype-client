import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { socket } from "../lib/socket";

export default function HomePage() {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  useEffect(() => {
    socket.connect();

    // listener dipasang di sini, bukan di click handler
    // supaya tidak dobel kalau user klik berkali-kali
    socket.on("room/created", ({ roomCode }) => {
      navigate(`/room/${roomCode}`);
    });

    return () => {
      // cleanup waktu user leave HomePage
      socket.off("room/created");
      socket.disconnect();
    };
  }, []);

  const handleCreate = () => {
    // cukup emit saja, listener sudah dipasang di useEffect
    socket.emit("room/create", { userId, username });
  };

  const handleJoin = () => {
    socket.emit("room/join", { userId, username, roomCode });
    navigate(`/room/${roomCode}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold">
        Hacka<span className="text-primary">Type</span>
      </h1>
      <p className="text-base-content/60">Race your friends in a typing duel</p>

      <div className="flex gap-6">
        {/* Create Room */}
        <div className="card bg-base-200 w-72 shadow-xl">
          <div className="card-body items-center text-center gap-4">
            <h2 className="card-title">Create Room</h2>
            <p className="text-base-content/60 text-sm">
              Start a new race and invite a friend
            </p>
            <button className="btn btn-primary w-full" onClick={handleCreate}>
              Create
            </button>
          </div>
        </div>

        {/* Join Room */}
        <div className="card bg-base-200 w-72 shadow-xl">
          <div className="card-body items-center text-center gap-4">
            <h2 className="card-title">Join Room</h2>
            <p className="text-base-content/60 text-sm">
              Enter a room code to join your friend
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
