import {  useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button"; 

export default function Dashboard() {
  // const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  // const permissions = useSelector((state) => state.auth.permissions);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user ? user.first_name : "Loading..."}
      </h1>
    </Layout>
  );
}
