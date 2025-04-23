import Image from 'next/image'
import React from 'react'

const RootDownload2 = () => {
    return (
        <div className='w-full py-36 px-5'>
            <div className='container mx-auto'>
                <div className='flex flex-col gap-14 items-center'>
                    <div className="flex flex-col gap-4 items-center">
                        <h2 className="text-[40px] font-semibold text-center text-[#121211] max-sm:text-3xl">
                            Get the Neuron mobile app
                        </h2>
                        <p className="text-base tracking-wide text-center text-[#121211]">
                            Access, edit, or share your photos and files from anywhere with the
                            Neuron PWA.
                        </p>
                    </div>
                    <div className="flex gap-12 max-md:flex-col max-md:gap-4 max-sm:gap-3">
                        <button className="px-4 py-3 text-base tracking-wide leading-6 text-white rounded-lg cursor-pointer bg-[#121211]">
                            Download for iOS
                        </button>
                        <button className="px-4 py-3 text-base tracking-wide leading-6 rounded-lg border cursor-pointer border-[#121211] text-[#121211] max-sm:w-full max-sm:max-w-[300px]">
                            Download for Android
                        </button>
                    </div>
                    <div className="flex justify-center items-center p-1 bg-white rounded-xl shadow-[0_0_12px_2px_rgba(0,0,0,0.15)]">
                        <Image
                            src="/images/qr_code.png"
                            className="aspect-square"
                            alt="QR Code"
                            width={176}
                            height={176}
                            
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RootDownload2