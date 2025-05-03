"use client";
import Image from 'next/image';
import { CardLineChart } from './LineChart';
import { AnalyticsPieChart } from './PieChart';
import { AnalyticsBarChart } from './BarChart';

const Analytics = async () => {
    const card = [
        {
            title: "Weekly sales",
            value: "714k",
            color: "text-[#027968]",
            barColor: "#027968",
            sale: "↝ +2.6%",
            iconsrc: "/svgs/ic-glass-bag.svg",
            chart: <CardLineChart />,
            bgColor: "linear-gradient(135deg, rgba(200, 250, 214, 0.48), rgba(91, 228, 155, 0.48)"
        },
        {
            title: "New users",
            value: "1.35m",
            color: "text-[#5522b7]",
            barColor: "#5522b7",
            sale: "↯ -0.1%",
            iconsrc: "/svgs/ic-glass-users.svg",
            bgColor: "linear-gradient(135deg, rgba(239, 214, 255, 0.48), rgba(198, 132, 255, 0.48)"
        },
        {
            title: "Purchase orders",
            value: "1.72m",
            color: "text-[#b76e00]",
            barColor: "#b76e00",
            sale: "↝ +2.8%",
            iconsrc: "/svgs/ic-glass-buy.svg",
            bgColor: "linear-gradient(135deg, rgba(255, 245, 204, 0.48), rgba(255, 214, 102, 0.48))"
        },
        {
            title: "Messages",
            value: "234",
            color: "text-[#b71d18]",
            barColor: "#b71d18",
            sale: "↝ +3.6%",
            iconsrc: "/svgs/ic-glass-message.svg",
            bgColor: "linear-gradient(135deg, rgba(255, 233, 213, 0.48), rgba(255, 172, 130, 0.48))"
        },
    ]
    // const data = await getData()
    return (
        <>
            <div className='grid grid-cols-12 gap-5 p-[1vw]'>
                {
                    card.map((item, index) => (
                        <div key={index} className="col-span-3 rounded-lg shadow bg-white" >
                            <div className=' p-[3vh] rounded-lg' style={{ background: item.bgColor }}>
                                <div className='flex justify-between items-center'>
                                    <div className='space-y-5'>
                                        <Image src={item.iconsrc} alt="icon" width={48} height={48} />
                                        <h5 className={`text-sm 2xl:text-xl font-medium ${item.color}`}>{item.title}</h5>
                                        <span className={`block font-bold text-3xl 2xl:text-4xl ${item.color}`}>{item.value}</span>
                                    </div>
                                    <div className='space-y-10'>
                                        <span className={`${item.color} text-end block text-sm 2xl:text-xl font-medium`}>{item.sale}</span>
                                        <div className={`w-30 h-20`}>
                                            {/* <BarChartMini color={item.barColor} /> */}
                                            <CardLineChart color={item.barColor} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
             <div className='grid grid-cols-12 gap-5 p-[1vw]'>
                <div className="col-span-4">
                    <AnalyticsPieChart />
                </div>
                <div className='col-span-8'>
                    <AnalyticsBarChart />
                </div>
            </div>

        </>
    )
}

export default Analytics