import { BrowserRouter, Routes, Route } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";
import HomePage from "./views/HomePage";
import WaitingRoom from "./views/WaitingRoom";
import GamePage from "./views/GamePage";
import ResultPage from "./views/ResultPage";
import LeaderboardPage from "./views/LeaderboardPage";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/room/:roomCode" element={<WaitingRoom />} />
          <Route path="/game/:roomCode" element={<GamePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
