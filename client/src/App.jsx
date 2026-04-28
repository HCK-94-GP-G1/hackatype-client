import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";
import HomePage from "./views/HomePage";
import WaitingRoom from "./views/WaitingRoom";
import GamePage from "./views/GamePage";
import ResultPage from "./views/ResultPage";
import LeaderboardPage from "./views/LeaderboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/room/:roomCode" element={<WaitingRoom />} />
        <Route path="/game/:roomCode" element={<GamePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
