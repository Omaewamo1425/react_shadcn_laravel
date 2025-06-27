import { useEffect,  useState, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useDebounce } from "use-debounce";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Skeleton from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function DataTableServer({
  token,
  fetchUrl,
  columnsDef,
  createButton,
  refetchTrigger,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(fetchUrl, {
        params: {
          page: pageIndex + 1,
          limit: pageSize,
          search: debouncedSearch,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data.data || []);
      setTotalCount(res.data.total || 0);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, token, pageIndex, pageSize, debouncedSearch]);


  useEffect(() => {
    fetchData();
  }, [fetchData, refetchTrigger]);



  const table = useReactTable({
    data,
    columns: columnsDef,
    state: {
      pagination: { pageIndex, pageSize },
      globalFilter: debouncedSearch,
    },
    pageCount: Math.ceil(totalCount / pageSize),
    manualPagination: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
  });

  return (
    <div className="space-y-4 w-full">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 w-full">
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <span className="text-sm text-muted-foreground">Total records: {totalCount}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm">Rows per page:</span>
            <Select value={pageSize.toString()} onValueChange={(val) => setPageSize(Number(val))}>
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map((size) => (
                  <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
          {createButton}
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full md:w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-md border">
        <table className="min-w-full border-collapse text-xs">
          <thead className="bg-muted text-muted-foreground">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="p-2 text-center font-medium whitespace-nowrap text-[#e15b05]"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, idx) => (
                <tr key={idx}>
                  <td colSpan={columnsDef.length} className="px-0.5 py-0.5">
                    <Skeleton className="h-2 w-full" />
                  </td>
                </tr>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className="border-t hover:bg-[#e15b05]/10 transition duration-150"
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="text-center text-[10px] px-0.5 py-1 whitespace-nowrap"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columnsDef.length} className="text-center p-2 text-muted-foreground text-[10px]">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center items-center gap-2 pt-4">
        <Button size="icon" variant="outline" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground">
          Page <strong>{pageIndex + 1}</strong> of <strong>{table.getPageCount()}</strong>
        </span>
        <Button size="icon" variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
