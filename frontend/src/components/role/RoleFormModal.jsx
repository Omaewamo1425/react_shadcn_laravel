import React from "react";
import Modal from "../custom_modal/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

export default function RoleFormModal({ open, onClose, form, setForm, onSubmit, permissions, saving }) {
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePermission = (permName) => {
    setForm((prev) => {
      const exists = prev.permissions.includes(permName);
      const updated = exists
        ? prev.permissions.filter((p) => p !== permName)
        : [...prev.permissions, permName];
      return { ...prev, permissions: updated };
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={form.id ? "Edit Role" : "Create Role"}>
      <div className="space-y-4 mt-2">
        <Input name="name" placeholder="Role name" onChange={handleChange} value={form.name || ""} />

        <div>
          <h4 className="font-semibold mb-1">Permissions</h4>
          <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto">
            {permissions.map((p) => (
              <label key={p.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.permissions?.includes(p.name)}
                  onCheckedChange={() => togglePermission(p.name)}
                />
                {p.name}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={saving} className="min-w-[100px] h-9">
            {saving ? <Loader2 className="animate-spin h-4 w-4" /> : form?.id ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
