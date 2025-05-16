"use client"
import React from 'react'
import { LogoSvg } from '../logo_svg'
import { FacebookIcon, GoogleIcon, InstagramIcon, LinkedinIcon, WhatsappIcon } from '../socialIcons'
import { useDriveStore } from '@/stores/useDriveStore'

const RootFooter = () => {
    const navigation = [
        {
            title: "Product",
            links: [
                "Feature",
                "Pricing",
                "Case studies",
                "Reviews",
                "Updates"
            ]
        },
        {
            title: "Company",
            links: [
                "About",
                "Contact Us",
                "Careers",
                "Culture",
                "Blog"
            ]
        },
        {
            title: "Support",
            links: [
                "Getting started",
                "Help center",
                "Server status",
                "Report a bug",
                "Chat support"
            ]
        },
        {
            title: "Downloads",
            links: [
                "iOS",
                "Android",
                "Mac",
                "Windows",
                "Chrome"
            ]
        },
    ];

    return (
        <div className='w-full'>
            <div className='w-full border-b border-t border-b-[#d9dbe9] border-t-[#eff0f6]'>
                <div className='container mx-auto px-10 '>
                    <div className='flex max-sm:flex-col py-15 max-sm:gap-10 max-sm:items-center  justify-between'>
                        <div className='w-[177px] h-[70px]'>
                            <LogoSvg />
                        </div>
                        <p className='text-[#74726f] text-lg max-sm:w-[80vw] w-[35vw]'>Secure. Smart. Scalable. Effortless cloud storage for all your files — anytime, anywhere.</p>
                    </div>
                </div>
            </div>

            <div className='container mx-auto px-10'>
                <div className='flex flex-wrap py-20 gap-x-10 gap-y-15 border-b border-b-[#d3d5db]'>
                    <div className='xl:w-[60%] w-full flex flex-wrap gap-10'>
                        {
                            navigation.map((item, index) => (
                                <div key={index} className='flex flex-1 min-w-[110px] flex-col gap-10'>
                                    <h4 className='text-[#121211] text-lg font-bold'>{item.title}</h4>
                                    <ul className='space-y-2'>
                                        {item.links.map((link, index) => (
                                            <li key={index} className='text-[#74726f] text-[1vw] cursor-pointer'>{link}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        }
                    </div>

                    <div id="subscribe" className='xl:w-[30%] flex flex-col gap-10 '>
                        <h4 className='text-[#121211] text-xl font-bold'>Subscribe to our newsletter</h4>
                        <div className='flex flex-col gap-6'>
                            <p className="text-md text-[#74726f]">
                                We care about your data. Read our <a href="#" className="cursor-pointer hover:underline font-bold">Privacy Policy</a>
                            </p>

                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                placeholder="Enter your email"
                                autoComplete="email"
                                className="w-full rounded-full px-6 py-4.5 bg-white border border-[#c0bdb8] text-base shadow-[0_2px_12px_0_rgba(20,20,43,0.08))] placeholder:text-[#74726f] focus:outline-none "

                            />
                            <button
                                type="submit"
                                className="w-fit rounded-full bg-[#121211] px-6 py-4.5 font-semibold text-white shadow-xs"
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className='flex max-lg:flex-col-reverse gap-y-5 justify-between my-[1vw]'>
                    <p className='text-[#121211] text-[1vw]'>Copyright © 2025 Neuron | All Rights Reserved </p>
                    <div className='flex gap-8 items-center cursor-pointer'>
                        <GoogleIcon />
                        <FacebookIcon />
                        <InstagramIcon />
                        <LinkedinIcon />
                        <WhatsappIcon />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RootFooter


