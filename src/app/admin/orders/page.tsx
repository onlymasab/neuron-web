import React from 'react'
import { DataTable } from './data-table'
import { Order, columns } from './columns'

async function getData(): Promise<Order[]> {
    //   const res = await fetch('https://dummyjson.com/carts/1')
    //   const data = await res.json()
    //   return data.products

    return [
        {
            id: "1",
            order: "#60118",
            status: "cancelled",
            customer: "Lawson Bass",
            createdAt: "2025-04-13T00:08:06",
            items: 6,
            price: 484.15
        },
        {
            id: "2",
            order: "#60119",
            status: "completed",
            customer: "Ariana Lang Bass",
            createdAt: "2025-04-12T00:07:06",
            items: 1,
            price: 83.74
        },
        {
            id: "3",
            order: "#60126",
            status: "pending",
            customer: "Deja Brady",
            createdAt: "2025-04-30T00:12:06",
            items: 5,
            price: 400.41
        },
        {
            id: "4",
            order: "#60121",
            status: "refunded",
            customer: "Jayvion Simon",
            createdAt: "2025-05-02T00:02:06",
            items: 6,
            price: 484.15
        },
        {
            id: "5",
            order: "#60122",
            status: "completed",
            customer: "Lucian Obrien",
            createdAt: "2025-05-01T00:01:06",
            items: 1,
            price: 83.74
        },
        {
            id: "6",
            order: "#60123",
            status: "cancelled",
            customer: "Sanaa Mccormick",
            createdAt: "2025-04-12T00:03:00",
            items: 1,
            price: 83.74
        },
        {
            id: "7",
            order: "#60124",
            status: "pending",
            customer: "Kobe Mccormick",
            createdAt: "2025-04-12T00:03:00",
            items: 5,
            price: 83.44
        }
    ]

}

export default async function OrdersPage() {
    const data = await getData()
    return (
        
            <div className='w-[95%] max-h-[85vh] m-auto mt-5 bg-white/60 rounded-2xl'>
                <DataTable columns={columns} data={data} />
            </div>
    )
}

