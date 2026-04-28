import { useNavigate, NavLink } from "react-router";
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdKeyboard } from "react-icons/md";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-200 px-6">
      <div className="flex-1">
        <span
          className="text-xl font-bold flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <MdKeyboard className="text-primary" size={24} />
          <span>
            Hacka<span className="text-primary">Type</span>
          </span>
        </span>
      </div>
      <div className="flex-none gap-2">
        <NavLink
          to="/leaderboard"
          className={({ isActive }) =>
            `btn btn-ghost btn-sm ${isActive ? "text-primary" : ""}`
          }
        >
          Leaderboard
        </NavLink>
        <button className="btn btn-ghost btn-sm gap-2" onClick={handleLogout}>
          <RiLogoutBoxLine size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
