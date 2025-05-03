"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
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

import { MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Invoice = {
    id: string
    invoiceId: string
    status: "paid" | "progress" | "Outdated"
    category: string
    price: number
}

export const columns: ColumnDef<Invoice>[] = [
    
    {
        accessorKey: "invoiceId",
        header: () => <div className="text-[#637381]"> Invoice ID </div>
        ,
        cell: ({ row }) => {
            const invoiceId = row.getValue("invoiceId") as string
            return <div>{invoiceId}</div>
        }
    },
    {
        accessorKey: "category",
        header: () => <div className="text-[#637381]"> Category </div>
        ,
        cell: ({ row }) => {
            const category = row.getValue("category") as string
            return <div>{category}</div>
        }
    },
    {
        accessorKey: "price",
        header: () => <div className="text-[#637381]"> Price </div>,
        cell: ({ row }) => {
            const price = row.getValue("price") as string
            return <div>{price}</div>
        }
    },

    {
        accessorKey: "status",
        header: () => <div className="text-[#637381]"> Status </div>,

        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const colorMap: Record<string, { text: string; bg: string }> = {
                progress: { text: "text-yellow-800", bg: "bg-yellow-200" },
                paid: { text: "text-green-800", bg: "bg-green-200" },
                outdated: { text: "text-red-800", bg: "bg-red-200" },
            }
            const { text, bg } = colorMap[status] || { text: "text-gray-800", bg: "bg-gray-100" }
            return <span className={`capitalize text-xs font-medium ${bg} ${text} px-3 py-1 rounded-sm`}>{status}</span>
        }
    },

    {
        id: "actions",
        cell: ({ row }) => {
            const order = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">

                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(order.id)}
                        >
                            Copy invoice ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600"> <Trash2 color="#ec000b" /> Delete </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    },

    
]


interface AppDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function AppDataTable<TData, TValue>({
    columns,
    data,
}: AppDataTableProps<TData, TValue>) {

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

    })

    return (
        <div>
            
            <div className="rounded-md border overflow-y-scroll max-h-[65vh] no-scrollbar bg-white">
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



        </div>
    )
}
