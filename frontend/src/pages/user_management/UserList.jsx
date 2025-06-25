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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserList() {
  const token = useSelector((state) => state.auth.token);
  const permissions = useSelector((state) => state.auth.permissions);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({});
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [perPage, setPerPage] = useState(25);

  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res.data);
    } catch {
      showToast("Failed to load roles", "error");
    }
  };

  const fetchUsers = async (page = 1, limit = perPage) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/users?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data.data);
      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
      });
    } catch {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    fetchRoles();
    setForm({ first_name: "", last_name: "", email: "", password: "" });
    setModal(true);
  };

  const openEdit = (u) => {
    fetchRoles();
    setForm({ ...u, password: "", role: u.roles?.[0]?.name || "" });
    setModal(true);
  };

  const saveUser = async () => {
    const label = form.id ? "Update" : "Create";
    const confirmed = await confirmAction(`Are you sure to ${label.toLowerCase()} this user?`, async () => {
      setSaving(true);
      const url = form.id
        ? `http://localhost:8000/api/users/${form.id}`
        : `http://localhost:8000/api/users`;

      const method = form.id ? axios.put : axios.post;

      const response = await method(url, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast(response.data.message);
      fetchUsers(pagination.current_page);
      setModal(false);
    });

    if (!confirmed) setModal(true);
    setSaving(false);
  };

  const deleteUser = async (id) => {
    await confirmAction(`Are you sure to delete this user?`, async () => {
      await axios.delete(`http://localhost:8000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast("User deleted successfully");
      fetchUsers(pagination.current_page);
    });
  };

  useEffect(() => {
    fetchUsers(1, perPage);
  }, [perPage]);

  return (
    <Layout loading={loading}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        {hasPermission(permissions, "create-users") && (
          <Button onClick={openCreate} className="w-full md:w-auto">
            + Create User
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="capitalize">{u.first_name}</TableCell>
                <TableCell className="capitalize">{u.last_name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell className="text-right space-x-2">
                  {hasPermission(permissions, "edit-users") && (
                    <Button variant="outline" size="sm" onClick={() => openEdit(u)}>
                      Edit
                    </Button>
                  )}
                  {hasPermission(permissions, "delete-users") && (
                    <Button variant="destructive" size="sm" onClick={() => deleteUser(u.id)}>
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination + Per Page */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t pt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Show:</span>
          <Select value={perPage.toString()} onValueChange={(value) => setPerPage(Number(value))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.current_page === 1}
            onClick={() => fetchUsers(pagination.current_page - 1, perPage)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page <strong>{pagination.current_page}</strong> of <strong>{pagination.last_page}</strong>
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.current_page === pagination.last_page}
            onClick={() => fetchUsers(pagination.current_page + 1, perPage)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Modal */}
      <UserFormModal
        open={modal}
        onClose={() => setModal(false)}
        form={form}
        setForm={setForm}
        onSubmit={saveUser}
        saving={saving}
        roles={roles}
      />
    </Layout>
  );
}
