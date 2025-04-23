"use client";
import { useState } from "react";

const RootFaqs = () => {

    const faqs = [
        {
            id: 1,
            question: "What is Neuron?",
            answer: "Neuron is a cloud storage service that lets you back up, access, edit, share, and sync your files from any device. You can also convert in real-time with DNA, Graphene and Brain Signals.",
        },
        {
            id: 2,
            question: "How much storage do I get with a free account?",
            answer: "Neuron is a cloud storage service that lets you back up, access, edit, share, and sync your files from any device. You can also convert in real-time with DNA, Graphene and Brain Signals.",
        },
        {
            id: 3,
            question: "Can I buy more storage?",
            answer: "Neuron is a cloud storage service that lets you back up, access, edit, share, and sync your files from any device. You can also convert in real-time with DNA, Graphene and Brain Signals.",
        },
        {
            id: 4,
            question: "What security features come with Neuron?",
            answer: "Neuron is a cloud storage service that lets you back up, access, edit, share, and sync your files from any device. You can also convert in real-time with DNA, Graphene and Brain Signals.",
        },
        {
            id: 5,
            question: "What is Personal Vault?",
            answer: "Neuron is a cloud storage service that lets you back up, access, edit, share, and sync your files from any device. You can also convert in real-time with DNA, Graphene and Brain Signals.",
        },
        {
            id: 6,
            question: "What devices can I backup to Neuron?",
            answer: "Neuron is a cloud storage service that lets you back up, access, edit, share, and sync your files from any device. You can also convert in real-time with DNA, Graphene and Brain Signals.",
        },

    ]

    const [activeFAQ, setActiveFAQ] = useState<number | null>(0);
    const [expand, setExpand] = useState(false);

    const toggleFAQ = (id: number) => {
        setActiveFAQ(activeFAQ === id ? null : id);
    };
    return (
        <div id="faq" className="w-full mt-35">
            <div className="container mx-auto px-15 ">
                <div className="flex flex-col gap-14">
                    <div className="flex justify-between items-center max-lg:flex-col max-lg:gap-10">
                        <h2 className="text-[#121211] text-[40px]/13 font-semibold">Frequently asked questions</h2>
                        <div className="flex gap-3">
                            <button onClick={() => {
                                setExpand(true);
                                setActiveFAQ(null); // reset individual selection
                            }}
                                className="px-4 py-3 border border-[#121211] rounded-lg text-[#121211] hover:bg-[#121211] hover:text-white transition-colors">Expand all</button>
                            <button onClick={() => {
                                setExpand(false);
                                setActiveFAQ(null); // collapse all
                            }} className="px-4 py-3 border border-[#121211] rounded-lg text-[#121211] hover:bg-[#121211] hover:text-white transition-colors">Collapse all</button>
                        </div>
                    </div>

                    <div >
                        {
                            faqs.map((faq) => (
                                <div key={faq.id} className="flex items-start pt-6 pb-8 gap-6 border-b border-b-[#999793]">
                                    <div className="w-[8vw] text-[#121211] text-sm font-medium pt-1">0{faq.id}/</div>
                                    <div className="w-full flex flex-col gap-6 text-[#121211] transition-all duration-300 ease-in-out">
                                        <h4 className="text-lg font-semibold">{faq.question}</h4>
                                        {(expand || activeFAQ === faq.id) && <p>{faq.answer}</p>}
                                    </div>
                                    <button onClick={() => toggleFAQ(faq.id)} className="p-1 mt-1 rounded-lg bg-[#121211]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                            <path d={expand || activeFAQ === faq.id ? "M6 12.5H18" : "M6 12.5H12M12 12.5H18M12 12.5V6.5M12 12.5V18.5"} stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            ))

                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default RootFaqs