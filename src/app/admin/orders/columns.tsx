"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

export type Order = {
    id: string
    order: string
    status: "pending" | "completed" | "refunded" | "cancelled"
    customer: string
    createdAt: string
    items: number
    price: number
}

export const columns: ColumnDef<Order>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="bg-white border-gray-300 data-[state=checked]:bg-[#00a76f] data-[state=checked]:border-[#00a76f] transition-all duration-300"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="bg-white border-gray-300 data-[state=checked]:bg-[#00a76f] data-[state=checked]:border-[#00a76f] transition-all duration-300"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "order",
        header: ({ column }) =>
            <Button
                className="text-[#637381] !px-0"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Order
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ,
        cell: ({ row }) => {
            const order = row.getValue("order") as string
            return <div className="underline">{order}</div>
        }
    },
    {
        accessorKey: "customer",
        header: ({ column }) =>
            <Button
                className="text-[#637381] !px-0"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Customer
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ,
        cell: ({ row }) => {
            const customer = row.getValue("customer") as string
            return <div>{customer}</div>
        }
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) =>
            <Button
                className="text-[#637381] !px-0"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ,
        cell: ({ row }) => {
            const raw = row.getValue("createdAt") as string
            const dateObj = new Date(raw)

            const date = dateObj.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })

            const time = dateObj.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }).toLowerCase()

            return (
                <div className=" text-gray-700 leading-tight">
                    <div>{date}</div>
                    <div className="text-xs text-gray-400 mt-2">{time}</div>
                </div>
            )
        }
    },
    {
        accessorKey: "items",
        header: ({ column }) =>
            <Button
                className="text-[#637381] !px-0"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Items
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ,
    },
    {
        accessorKey: "price",
        header: ({ column }) =>
            <Button
                className="text-[#637381] !px-0"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Price
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ,
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(price)

            return <div>{formatted}</div>
        }
    },
    {
        accessorKey: "status",
        header: ({ column }) =>
            <Button
                className="text-[#637381] !px-0"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ,
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const colorMap: Record<string, { text: string; bg: string }> = {
                pending: { text: "text-yellow-800", bg: "bg-yellow-200" },
                completed: { text: "text-green-800", bg: "bg-green-200" },
                refunded: { text: "text-gray-800", bg: "bg-gray-200" },
                cancelled: { text: "text-red-800", bg: "bg-red-200" },
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
                            Copy order ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600"> <Trash2 color="#ec000b" /> Delete </DropdownMenuItem>
                        <DropdownMenuItem><Eye color="#000" />View</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    },

    
]
