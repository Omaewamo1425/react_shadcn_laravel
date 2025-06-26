import { useSelector } from "react-redux";

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user ? user.first_name : "Loading..."}
      </h1>
    </div>
  );
}
