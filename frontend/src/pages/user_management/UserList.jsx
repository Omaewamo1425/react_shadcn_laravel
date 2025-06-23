import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import UserFormModal from "../../components/UserFormModal";
import { Button } from "@/components/ui/button";
import { hasPermission } from "../../utils/permissions";
import { showToast } from "../../utils/toast";
import { confirmAction } from "../../utils/confirm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export default function UserList() {
  const token = useSelector((state) => state.auth.token);
  const auth_user = useSelector((state) => state.auth.user);
  const permissions = useSelector((state) => state.auth.permissions);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({});
  const [modal, setModal] = useState(false);

  
  
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (e) {
      showToast("Failed to load users", "error");
    }
  };

  const openCreate = () => {
    setForm({ first_name: "", last_name: "", email: "", password: "" });
    setModal(true);
  };

  const openEdit = (u) => {
    setForm({ ...u, password: "" });
    setModal(true);
  };

  const saveUser = async () => {
    try {
      if (form.id) {
        await axios.put(`http://localhost:8000/api/users/${form.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast("User updated");
      } else {
        await axios.post(`http://localhost:8000/api/users`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast("User created");
      }

      setModal(false);
      fetchUsers();
     } catch (error) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        // Loop through each error field and show all messages
        Object.values(errors).forEach((messages) => {
          messages.forEach((msg) => showToast(msg, "error"));
        });
      } else {
        const message = error.response?.data?.message || "Error saving user";
        showToast(message, "error");
      }

      console.error("Save user failed:", error);
    }

  };

  const deleteUser = async (id) => {
    if (await confirmAction("Delete this user?")) {
      try {
        await axios.delete(`http://localhost:8000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast("User deleted");
        fetchUsers();
      } catch {
        showToast("Failed to delete user", "error");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Layout>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        {hasPermission(permissions, "create users") && (
          <Button onClick={openCreate}>Create User</Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                {u.first_name
                  ? u.first_name.charAt(0).toUpperCase() + u.first_name.slice(1).toLowerCase()
                  : ""}
              </TableCell>
              <TableCell>
                {u.last_name
                  ? u.last_name.charAt(0).toUpperCase() + u.last_name.slice(1).toLowerCase()
                  : ""}
              </TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell className="space-x-2">
                {hasPermission(permissions, "edit users") && (
                  <Button variant="outline" onClick={() => openEdit(u)}>
                    Edit
                  </Button>
                )}
                {hasPermission(permissions, "delete users") && (
                  <Button
                    variant="destructive"
                    onClick={() => deleteUser(u.id)}
                  >
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal */}
      <UserFormModal
        open={modal}
        onClose={() => setModal(false)}
        form={form}
        setForm={setForm}
        onSubmit={saveUser}
      />
    </Layout>
  );
}
