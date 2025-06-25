import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showToast } from "@/utils/toast";
import { confirmAction } from "@/utils/confirm";
import PermissionFormModal from "@/components/permission/PermissionFormModal";
import Layout from "@/components/Layout";

export default function PermissionList() {
  const token = useSelector((state) => state.auth.token);
  const [permissions, setPermissions] = useState([]);
  const [form, setForm] = useState({});
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchPermissions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/permissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPermissions(res.data);
    } catch {
      showToast("Failed to load permissions", "error");
    }
  };

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

    const confirmed = await confirmAction(`Are you sure you want to ${label} this permission?`, async () => {
      setSaving(true);

      const url = form.id
        ? `http://localhost:8000/api/permissions/${form.id}`
        : `http://localhost:8000/api/permissions`;

      const method = form.id ? axios.put : axios.post;

      const response = await method(url, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast(`Permission ${form.id ? "updated" : "created"} successfully`);
      fetchPermissions();
      setModal(false);
    });

    if (!confirmed) {
      setModal(true);
    }

    setSaving(false);
  };

  const deletePermission = async (id) => {
    const confirmed = await confirmAction("Are you sure you want to delete this permission?", async () => {
      await axios.delete(`http://localhost:8000/api/permissions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Permission deleted");
      fetchPermissions();
    });
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <Layout>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Permissions</h1>
        <Button onClick={openCreate}>Create Permission</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((perm) => (
            <TableRow key={perm.id}>
              <TableCell>{perm.id}</TableCell>
              <TableCell>{perm.name}</TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" onClick={() => openEdit(perm)}>Edit</Button>
                <Button variant="destructive" onClick={() => deletePermission(perm.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PermissionFormModal
        open={modal}
        onClose={() => setModal(false)}
        form={form}
        setForm={setForm}
        onSubmit={savePermission}
        saving={saving}
      />
    </Layout>
  );
}
