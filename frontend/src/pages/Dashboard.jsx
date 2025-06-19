import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/authSlice";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";

export default function Dashboard() {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => dispatch(setUser(res.data)))
      .catch(() => {});
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold">
        Welcome, {user ? user.first_name : "Loading..."}
      </h1>
    </Layout>
  );
}
