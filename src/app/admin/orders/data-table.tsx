"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    FilterFn,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"


interface DataTableProps<TData extends { customer: string; order: string; status: string }, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData extends { customer: string; order: string; status: string }, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    })



    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState("")
    const [rowSelection, setRowSelection] = useState({})


    const globalFilterFn: FilterFn<TData> = (row, columnId, filterValue) => {
        const search = filterValue.toLowerCase()

        return (
            String(row.original.customer).toLowerCase().includes(search) ||
            String(row.original.order).toLowerCase().includes(search)
        )
    }

    const table = useReactTable({
        data,
        columns,
        state: {
            pagination,
            sorting,
            columnFilters,
            globalFilter,
            rowSelection,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        globalFilterFn,
        manualPagination: false,

    })

    return (
        <div>
            <div className="flex items-center justify-between py-2 px-4 shadow">
                <Tabs
                    defaultValue="all"
                    onValueChange={(value) => {
                        table.getColumn("status")?.setFilterValue(value === "all" ? undefined : value);
                    }}
                    className="mb-4 w-[40vw]"
                >
                    <TabsList className="w-full grid grid-cols-5 bg-transparent">
                        {["all", "pending", "completed", "refunded", "cancelled"].map((value) => (
                            <TabsTrigger
                                key={value}
                                value={value}
                                className="relative rounded-none px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-black data-[state=active]:text-black transition-all data-[state=active]:shadow-none"
                            >
                                {value.charAt(0).toUpperCase() + value.slice(1)}
                                <span
                                    className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-[#00a76f] transition-transform duration-300 data-[state=active]:scale-x-100"
                                />
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <Input
                    placeholder="Search customer or order ID..."
                    value={globalFilter}
                    onChange={(e) =>
                        setGlobalFilter(e.target.value)
                    }
                    className="max-w-sm hover:border-black placeholder:text-gray-400 text-sm"
                />
            </div>
            <div className="rounded-md border overflow-y-scroll max-h-[65vh] no-scrollbar pl-4">
                <Table>
                    <TableHeader className="bg-gray-200">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="pt-5 pb-2">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between space-x-2 py-4 px-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>

                <div className="flex items-center space-x-2">
                    <p className="text-sm">Rows per page:</p>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                        className="text-sm border px-2 py-1 rounded"
                    >
                        {[5, 10, 25].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >Previous</Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>{/* Add your previous/next buttons here */}
                </div>
            </div>



        </div>
    )
}
