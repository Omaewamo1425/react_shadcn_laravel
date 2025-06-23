import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { clearAuth } from "../store/authSlice";

export default function Navbar() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // or from Redux
      console.log("Token used in logout:", token);
      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(clearAuth());
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-between items-center p-4 border-b bg-white shadow-sm">
      <h1 className="text-lg font-semibold">My Dashboard</h1>
      <Button onClick={handleLogout} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          </>
        ) : (
          "Logout"
        )}
      </Button>
    </div>
  );
}
