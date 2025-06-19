import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-100 border-b">
      <h2 className="font-bold text-lg">Dashboard</h2>
      <button
        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
