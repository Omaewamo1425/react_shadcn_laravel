import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import RoleFormModal from "@/components/role/RoleFormModal";
import { showToast } from "@/utils/toast";
import { confirmAction } from "@/utils/confirm";

export default function RoleList() {
  const token = useSelector((state) => state.auth.token);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchRoles = async () => {
    const res = await axios.get("http://localhost:8000/api/roles", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRoles(res.data);
  };

  const fetchPermissions = async () => {
    const res = await axios.get("http://localhost:8000/api/permissions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPermissions(res.data);
  };

  const openCreate = () => {
    setForm({ name: "", permissions: [] });
    setModal(true);
  };

  const openEdit = (role) => {
    setForm({
      id: role.id,
      name: role.name,
      permissions: role.permissions.map((p) => p.name),
    });
    setModal(true);
  };

  const saveRole = async () => {
    setSaving(true);
    const label = form.id ? "Update" : "Create";
    const confirmed = await confirmAction(`${label.toLowerCase()} this role?`, async () => {
      const url = form.id
        ? `http://localhost:8000/api/roles/${form.id}`
        : `http://localhost:8000/api/roles`;
      const method = form.id ? axios.put : axios.post;

      await method(url, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast(`Role ${form.id ? "updated" : "created"} successfully`);
      fetchRoles();
      setModal(false);
    });

    if (!confirmed) setModal(true);
    setSaving(false);
  };

  const deleteRole = async (id) => {
    const confirmed = await confirmAction("Delete this role?");
    if (!confirmed) return;

    await axios.delete(`http://localhost:8000/api/roles/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    showToast("Role deleted successfully");
    fetchRoles();
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);
  return (
    <>
    <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Roles & Permissions</h2>
          <Button onClick={openCreate}>Create Role</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  {role.permissions.map((p) => (
                    <span key={p.id} className="inline-block bg-gray-200 text-sm px-2 py-1 rounded mr-1">
                      {p.name}
                    </span>
                  ))}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" onClick={() => openEdit(role)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => deleteRole(role.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <RoleFormModal
          open={modal}
          onClose={() => setModal(false)}
          form={form}
          setForm={setForm}
          permissions={permissions}
          onSubmit={saveRole}
          saving={saving}
        />
      </div>
    </>
  );
}
