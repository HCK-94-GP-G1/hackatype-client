import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import BASE_URL from "../constants/url";
import { useNavigate } from "react-router";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        username,
        password,
      });
      toast.success("Register success! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card bg-base-200 w-full max-w-sm shadow-xl">
        <div className="card-body gap-4">
          <div className="flex items-center gap-2 justify-center mb-2">
            <span className="text-2xl font-bold">
              Hacka<span className="text-primary">Type</span>
            </span>
          </div>

          <h2 className="text-center text-lg font-semibold">Register</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Username"
              className="input input-bordered w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary w-full mt-2">
              Register
            </button>
          </form>

          <p className="text-center text-sm text-base-content/60">
            Sudah punya akun?{" "}
            <a href="/login" className="text-primary hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}