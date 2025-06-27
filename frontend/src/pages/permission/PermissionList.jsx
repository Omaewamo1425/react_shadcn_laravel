import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import DataTableServer from "@/components/tables/DataTableServer";
import PermissionFormModal from "@/components/permission/PermissionFormModal";
import { showToast } from "@/utils/toast";
import { confirmAction } from "@/utils/confirm";

export default function PermissionList() {
  const token = useSelector((state) => state.auth.token);
  const [permissions, setPermissions] = useState([]);
  const [form, setForm] = useState({});
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchPermissions = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/permissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPermissions(res.data);
    } catch {
      showToast("Failed to load permissions", "error");
    }
  }, [token]);

  const openCreate = () => {
    setForm({ name: "" });
    setModal(true);
  };

  const openEdit = (perm) => {
    setForm({ ...perm });
    setModal(true);
  };

  const savePermission = async () => {
    const label = form.id ? "update" : "create";
    const confirmed = await confirmAction(
      `Are you sure you want to ${label} this permission?`,
      async () => {
        setSaving(true);
        const url = form.id
          ? `http://localhost:8000/api/permissions/${form.id}`
          : `http://localhost:8000/api/permissions`;
        const method = form.id ? axios.put : axios.post;
        await method(url, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast(`Permission ${form.id ? "updated" : "created"} successfully`);
        fetchPermissions();
        setRefreshKey(prev => prev + 1);
        setModal(false);
      }
    );

    if (!confirmed) setModal(true);
    setSaving(false);
  };

  const deletePermission = async (id) => {
    await confirmAction(
      "Are you sure you want to delete this permission?",
      async () => {
        await axios.delete(`http://localhost:8000/api/permissions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast("Permission deleted");
        setRefreshKey(prev => prev + 1);
        fetchPermissions();
      }
    );
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: () => <div className="text-center">ID</div>,
        cell: (info) => <div className="text-center text-xs">{info.getValue()}</div>,
      },
      {
        accessorKey: "name",
        header: () => <div className="text-center">Name</div>,
        cell: (info) => <div className="text-center text-xs">{info.getValue()}</div>,
      },
      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-center gap-1">
            <Button
              size="sm"
              className="h-6 px-2 text-[10px]"
              variant="outline"
              onClick={() => openEdit(row.original)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              className="h-6 px-2 text-[10px]"
              variant="destructive"
              onClick={() => deletePermission(row.original.id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return (
    <>
      <DataTableServer
          token={token}
          fetchUrl="http://localhost:8000/api/permissions/read"
          createButton={<Button onClick={openCreate}>Create Permission</Button>}
          columnsDef={columns}
          refetchTrigger={refreshKey}
        />

        <PermissionFormModal
          open={modal}
          onClose={() => setModal(false)}
          form={form}
          setForm={setForm}
          onSubmit={savePermission}
          saving={saving}
        />
    </>
  );
}
