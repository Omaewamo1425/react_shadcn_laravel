import { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import DataTableServer from "@/components/tables/DataTableServer";
import { hasPermission } from "@/utils/permissions";
import { showToast } from "@/utils/toast";
import { confirmAction } from "@/utils/confirm";
import axios from "axios";
import UserFormModal from "@/components/UserFormModal";

export default function UserList() {
  const token = useSelector((state) => state.auth.token);
  const permissions = useSelector((state) => state.auth.permissions);

  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({});
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
      setModal(false);
      setRefreshKey(prev => prev + 1);
    });

    if (!confirmed) setModal(true);
    setSaving(false);
  };

  const deleteUser = async (id) => {
    await confirmAction("Are you sure to delete this user?", async () => {
      const response = await axios.delete(`http://localhost:8000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast(response.data.message);
      setRefreshKey(prev => prev + 1);
    });
  };

  const columns = [
    {
      accessorKey: "first_name",
      header: () => <div className="text-center text-[#e15b05]">First Name</div>,
      cell: (info) => <div className="text-center text-xs">{info.getValue()}</div>,
    },
    {
      accessorKey: "last_name",
      header: () => <div className="text-center text-[#e15b05]">Last Name</div>,
      cell: (info) => <div className="text-center text-xs">{info.getValue()}</div>,
    },
    {
      accessorKey: "email",
      header: () => <div className="text-center text-[#e15b05]">Email</div>,
      cell: (info) => <div className="text-center text-xs">{info.getValue()}</div>,
    },
    {
      id: "actions",
      header: () => <div className="text-center text-[#e15b05]">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-center gap-1 px-1 py-0.5">
          {hasPermission(permissions, "edit-users") && (
            <Button
              size="sm"
              className="h-6 px-2 text-[10px]"
              variant="outline"
              onClick={() => openEdit(row.original)}
            >
              Edit
            </Button>
          )}
          {hasPermission(permissions, "delete-users") && (
            <Button
              size="sm"
              className="h-6 px-2 text-[10px]"
              variant="destructive"
              onClick={() => deleteUser(row.original.id)}
            >
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTableServer
        token={token}
        permissions={permissions}
        fetchUrl="http://localhost:8000/api/users"
        columnsDef={columns}
        refetchTrigger={refreshKey}
        createButton={
          hasPermission(permissions, "create-users") && (
            <Button onClick={openCreate}>+ Create User</Button>
          )
        }
      />

      <UserFormModal
        open={modal}
        onClose={() => setModal(false)}
        form={form}
        setForm={setForm}
        onSubmit={saveUser}
        saving={saving}
        roles={roles}
      />
    </>
  );
}
