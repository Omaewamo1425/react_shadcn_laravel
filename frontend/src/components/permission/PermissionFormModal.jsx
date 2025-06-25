import React from "react";
import Modal from "../custom_modal/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function PermissionFormModal({ open, onClose, form, setForm, onSubmit, saving }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal open={open} onClose={onClose} title={form.id ? "Edit Permission" : "Create Permission"}>
      <div className="space-y-3 mt-2">
        <Input
          name="name"
          placeholder="Permission name (e.g. create-users)"
          onChange={handleChange}
          value={form.name || ""}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit} disabled={saving} className="min-w-[100px] h-9">
            {saving ? (
              <div className="flex items-center justify-center w-full">
                <Loader2 className="animate-spin h-5 w-5" />
              </div>
            ) : (
              form.id ? "Update" : "Create"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
