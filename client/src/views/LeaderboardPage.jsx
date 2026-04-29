import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../constants/url";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/leaderboard/`);
        setLeaderboard(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="alert alert-error w-96">
          <p>Error loading leaderboard: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center gap-6 p-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-5xl font-bold">
          Top <span className="text-primary">Typists</span>
        </h1>
        <p className="text-base-content/50 text-lg mt-2">
          Fastest typers on the leaderboard
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="w-full max-w-4xl overflow-x-auto">
        <table className="table bg-base-200 border border-base-300">
          <thead>
            <tr className="border-base-300">
              <th className="text-center">Rank</th>
              <th>Username</th>
              <th className="text-center">Best WPM</th>
              <th className="text-center">Total Wins</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={user.id} className="hover:bg-base-300">
                <td className="text-center font-bold">
                  {index === 0 && <span className="text-yellow-500">🥇</span>}
                  {index === 1 && <span className="text-gray-400">🥈</span>}
                  {index === 2 && <span className="text-orange-600">🥉</span>}
                  {index > 2 && <span>#{index + 1}</span>}
                </td>
                <td className="font-medium">{user.username}</td>
                <td className="text-center">
                  <span className="badge badge-primary">{user.bestWpm} WPM</span>
                </td>
                <td className="text-center">
                  <span className="font-semibold">{user.totalWins}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}