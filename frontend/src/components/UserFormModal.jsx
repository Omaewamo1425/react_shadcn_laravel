import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UserFormModal({ open, onClose, user, onSubmit, setForm }) {
  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Create User"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input name="name" placeholder="Name" onChange={handleChange} value={user?.name || ""} />
          <Input name="email" placeholder="Email" onChange={handleChange} value={user?.email || ""} />
          <Input name="password" placeholder="Password" type="password" onChange={handleChange} />
          <Button onClick={onSubmit}>{user ? "Update" : "Create"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
