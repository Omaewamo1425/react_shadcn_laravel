import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Modal from "./custom_modal/Modal"; 
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
export default function UserFormModal({ open, onClose, form, setForm, onSubmit, saving, roles = []   }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

    return (

        <Modal open={open} onClose={onClose} title={form.id ? "Edit User" : "Create User"}>
        <div className="space-y-3 mt-2">
          <Input
            name="first_name"
            placeholder="First name"
            onChange={handleChange}
            value={form.first_name || ""}
          />
          <Input
            name="last_name"
            placeholder="Last name"
            onChange={handleChange}
            value={form.last_name || ""}
          />
          <Select
            value={form.role || ""}
            onValueChange={(value) => setForm((prev) => ({ ...prev, role: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email || ""}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password || ""}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onSubmit} disabled={saving} className="min-w-[100px] h-9">
              {saving ? (
                <div className="flex items-center justify-center w-full">
                  <Loader2 className="animate-spin h-5 w-5" />
                </div>
              ) : (
                form?.id ? "Update" : "Create"
              )}
          </Button>

          </div>
        </div>
      </Modal>
      
    );
}
