"use client";
import { AppDataTable, columns, Invoice } from './components/appData-table';
import { AreaBarChart } from './components/AreaBarChart';
import { BarChartMini } from './components/BarChart';
import { DonutChart } from './components/DonutChart';

async function getData(): Promise<Invoice[]> {
    //   const res = await fetch('https://dummyjson.com/carts/1')
    //   const data = await res.json()
    //   return data.products

    return [
        {
            id: "1",
            invoiceId: "INV-1990",
            category: "Android",
            price: 83.74,
            status: "paid",
        },
        {
            id: "2",
            invoiceId: "INV-1991",
            category: "Mac",
            price: 87.14,
            status: "Outdated",
        },
        {
            id: "3",
            invoiceId: "INV-1992",
            category: "Windows",
            price: 68.74,
            status: "progress",
        },
        {
            id: "4",
            invoiceId: "INV-1993",
            category: "Android",
            price: 85.74,
            status: "paid",
        },
        {
            id: "5",
            invoiceId: "INV-1994",
            category: "Mac",
            price: 52.74,
            status: "paid",
        },
    ]

}


const Home = async () => {
    const card = [
        {
            title: "Total active users",
            value: "18,765",
            barColor: "#00a76f",
            sale: "↑ +2.6%",
            saleColor: "text-[#60d58b]"
        },
        {
            title: "Total installed",
            value: "4,876",
            barColor: "#00b8d9",
            sale: "↑ +0.2%",
            saleColor: "text-[#60d58b]"
        },
        {
            title: "Total downloads",
            value: "678",
            barColor: "#ff5630",
            sale: "↓ -0.1%",
            saleColor: "text-[#db6b6b]"
        },
    ]
    const data = await getData()
    return (
        <>
            <div className='grid grid-cols-12 gap-5 p-[1vw]'>
                {
                    card.map((item, index) => (
                        <div key={index} className="col-span-4 p-[3vh] bg-white rounded-lg shadow flex flex-col justify-between">
                            <div className='flex justify-between items-center'>
                                <div className='space-y-5'>
                                    <h5 className='text-sm 2xl:text-xl font-medium'>{item.title}</h5>
                                    <span className='block font-bold text-3xl 2xl:text-4xl'>{item.value}</span>
                                    <p className='block text-sm 2xl:text-xl text-[#637381]'><span className={`${item.saleColor} font-medium`}>{item.sale}</span> last 7 days</p>
                                </div>
                                <div className={`w-40 h-20`}>
                                    <BarChartMini color={item.barColor} />
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='grid grid-cols-12 gap-5 p-[1vw]'>
                <div className="col-span-4">
                    <DonutChart />
                </div>
                <div className='col-span-8'>
                    <AreaBarChart />
                </div>
            </div>
            <div className='grid grid-cols-12 gap-5 p-[1vw]'>
                <div className="col-span-8">
                    <AppDataTable columns={columns} data={data} />
                </div>
            </div>

        </>
    )
}

export default Home