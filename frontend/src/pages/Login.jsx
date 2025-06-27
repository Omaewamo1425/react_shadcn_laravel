import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { setToken, setUser } from "../store/authSlice";

axios.defaults.withCredentials = false;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // Store token
      localStorage.setItem("token", token);
      dispatch(setToken(token));

      // Wait for Redux to store user and permissions
       dispatch(setUser(user)); // Make sure this matches your reducer's expectation

      // Navigate after state is updated
      navigate("/dashboard");
    } catch (err) {
  console.error("Login failed", err);
  alert(err?.response?.data?.message || "Something went wrong");
}
 {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="space-y-4 w-full max-w-sm bg-white dark:bg-gray-800 p-6 shadow rounded">
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin} className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </div>
    </div>
  );
}
