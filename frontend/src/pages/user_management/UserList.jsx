// UserList.jsx — with use-debounce integration
import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import UserFormModal from "../../components/UserFormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { hasPermission } from "../../utils/permissions";
import { showToast } from "../../utils/toast";
import { confirmAction } from "../../utils/confirm";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import Skeleton from "@/components/ui/skeleton";
import { useDebounce } from "use-debounce";

export default function UserList() {
  const token = useSelector((state) => state.auth.token);
  const permissions = useSelector((state) => state.auth.permissions);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({});
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Server-side table state
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [sortBy, setSortBy] = useState();
  const [sortDir, setSortDir] = useState();

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

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: pageIndex + 1,
          limit: pageSize,
          search: debouncedSearch,
          sort_by: sortBy,
          order: sortDir,
        },
      });
      setUsers(res.data.data);
      setTotalPages(res.data.last_page);
    } catch {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }, [token, pageIndex, pageSize, debouncedSearch, sortBy, sortDir]);

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
      fetchUsers();
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
      fetchUsers();
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPageIndex(0);
  }, [debouncedSearch]);

  const columns = useMemo(() => [
    {
      id: "select",
      header: () => <div className="text-center">Select</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <Checkbox checked={row.getIsSelected()} onCheckedChange={() => row.toggleSelected()} />
        </div>
      ),
    },
    {
      accessorKey: "first_name",
      header: "First Name",
      cell: (info) => <span className="capitalize">{info.getValue()}</span>,
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
      cell: (info) => <span className="capitalize">{info.getValue()}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="text-center space-x-2">
          {hasPermission(permissions, "edit-users") && (
            <Button variant="outline" size="sm" onClick={() => openEdit(row.original)}>
              Edit
            </Button>
          )}
          {hasPermission(permissions, "delete-users") && (
            <Button variant="destructive" size="sm" onClick={() => deleteUser(row.original.id)}>
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ], [permissions]);

  const table = useReactTable({
    data: users,
    columns,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {hasPermission(permissions, "create-users") && (
          <Button onClick={openCreate}>+ Create User</Button>
        )}
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full md:w-64"
        />
      </div>

      <div className="overflow-x-auto border rounded-md shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={() => {
                      const sort = header.column.getIsSorted();
                      if (!sort) {
                        setSortBy(header.column.id);
                        setSortDir("asc");
                      } else if (sort === "asc") {
                        setSortBy(header.column.id);
                        setSortDir("desc");
                      } else {
                        setSortBy(undefined);
                        setSortDir(undefined);
                      }
                    }}
                    className="text-center p-3 cursor-pointer"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' ? ' 🔼' : header.column.getIsSorted() === 'desc' ? ' 🔽' : ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, idx) => (
                <tr key={idx}><td colSpan={columns.length}><Skeleton className="h-6 w-full" /></td></tr>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="text-center p-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center p-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4">
        <div className="text-sm text-gray-600">
          Page {pageIndex + 1} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPageIndex(Math.max(0, pageIndex - 1))} disabled={pageIndex === 0}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPageIndex(Math.min(totalPages - 1, pageIndex + 1))} disabled={pageIndex + 1 >= totalPages}>
            Next
          </Button>
        </div>
      </div>

      <UserFormModal
        open={modal}
        onClose={() => setModal(false)}
        form={form}
        setForm={setForm}
        onSubmit={saveUser}
        saving={saving}
        roles={roles}
      />
    </div>
  );
}
