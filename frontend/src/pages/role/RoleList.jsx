import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import DataTableServer from "@/components/tables/DataTableServer";
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
  const [refresh, setRefresh] = useState(false);

  const fetchPermissions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/permissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPermissions(res.data);
    } catch (e) {
      showToast("Failed to load permissions", "error");
    }
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
      setRefresh((prev) => !prev);
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
    setRefresh((prev) => !prev);
  };

  const columns = [
    {
      accessorKey: "name",
      header: () => <div className="text-center">Role</div>,
      cell: (info) => <div className="text-center text-xs">{info.getValue()}</div>,
    },
    {
      id: "permissions",
      header: () => <div className="text-center">Permissions</div>,
      cell: ({ row }) => (
        <div className="flex justify-center flex-wrap gap-1">
          {row.original.permissions.map((p) => (
            <span
              key={p.id}
              className="bg-green-100 text-green-800 text-[10px] font-medium px-2 py-0.5 rounded-full"
            >
              {p.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-center gap-1">
          <Button size="sm" className="h-6 px-2 text-[10px]" variant="outline" onClick={() => openEdit(row.original)}>
            Edit
          </Button>
          <Button size="sm" className="h-6 px-2 text-[10px]" variant="destructive" onClick={() => deleteRole(row.original.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Roles</h2>
        <DataTableServer
          token={token}
          fetchUrl="http://localhost:8000/api/roles/read"
          columnsDef={columns}
          createButton={<Button onClick={openCreate}>+ Create Role</Button>}
          refreshSignal={refresh}
        />
      </div>

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
  );
}
