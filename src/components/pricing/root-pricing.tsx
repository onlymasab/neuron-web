"use client";
import { useState } from "react";


const RootPricing = () => {
    const [plan, setPlan] = useState(true);
    return (
        <div id="pricing" className="w-full py-18 mt-30" style={{ background: "linear-gradient(251deg, #E2E7FF 0%, #FFEAEA 50%, #D9DAFB 100%)" }}>
            <div className="container mx-auto px-4 ">
                <div className="flex flex-col gap-24">
                    <div className="flex justify-between items-center max-lg:flex-col">
                        <div className="max-w-[415px] max-lg:text-center">
                            <h1 className="text-[#74726f] font-medium text-base/6">PLANS & PRICING</h1>
                            <h2 className="text-[#121211] text-[40px]/13 font-semibold mt-4">Neuron is better than traditional cloud</h2>
                        </div>
                        <div className="relative w-[220px] flex lg:self-start max-lg:mt-10 items-center gap-2 p-1 bg-white rounded-[56px] ">
                            <button onClick={()=>setPlan(true)} className={`px-6 py-2 z-20 ${plan ? "text-white" : "text-[#121211]"}`}>Monthly</button>
                            <button onClick={()=>setPlan(false)} className={`px-6 py-2 z-20 ${plan ? "text-[#121211]" : "text-white"}`}>Yearly</button>
                            <div className={`absolute top-1 bg-[#121211] rounded-[56px] w-[106px] h-10 transition-transform z-10 ${plan ? "translate-0" : "translate-x-full"}`} />
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 col-span-1 gap-6 place-content-center mx-auto">
                        <PricingCard type="Basic" price="Free" storage="5 GB"/>
                        <PricingCard type="Personal" price="USD$1.99" storage="100 GB"/>
                        <PricingCard type="Standard" price="USD$5.99" storage="10TB"/>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default RootPricing

interface PricingCardProps {
    type: string;
    price: string;
    storage: string;
}

const PricingCard = ({type, price, storage}: PricingCardProps) => {

    return (
        <div className="max-w-[490px] flex flex-col p-6 gap-6 lg:gap-10 rounded-3xl bg-white shadow-[0_0_12px_0_rgba(0,0,0,0.15)">
            <div>
                <h2 className="text-[clamp(1rem,1.5vw,1.75rem)] font-semibold text-[#121211]">
                    <span>Neuron 365</span>
                    <br />
                    <span>{type}</span>
                </h2>
                <p className={`mt-8 text-[clamp(2rem,2vw,2.8rem)] font-semibold text-[#121211] max-md:mt-10 max-md:max-w-full max-md:text-4xl ${price == "Free" && 'mt-12'}`}>
                    {price}
                    <span className={`block text-sm ${price == "Free" && 'hidden'}`}>/month</span>
                </p>
                <p className={`text-[#74726f] mt-8 ${price == "Free" && 'opacity-0'}`}>Subscription automatically renews unless canceled in Neuron account. <a href="#" className="text-[#049aff] underline">See terms.</a></p>
            </div>

            <button className="self-stretch px-4 py-3 w-fit text-base tracking-wide text-white rounded-md bg-[#121211]">
                Sign up for free
            </button>
            <ul className="text-sm tracking-wide leading-6 text-neutral-500 max-md:max-w-full">
                <li className="list-disc ml-6">For one person</li>
                <li className="list-disc ml-6">{storage} of cloud storage</li>
                <li className="list-disc ml-6">Works on Windows, macOS, Linux, iOS, and Android™</li>
                <li className="list-disc ml-6">Neuron photo and file backup across your devices</li>
            </ul>
            <p className={`text-[#121211] font-medium ${price == "Free" && 'opacity-0'}`}>Premium value included</p>
        </div>
    )
}