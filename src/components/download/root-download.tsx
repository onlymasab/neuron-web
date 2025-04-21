import Image from 'next/image'

const RootDownload = () => {
    return (
        <div id='download' className='w-full flex flex-col gap-14 mt-35'>
            <div>
                <h1 className="text-[#74726f] text-center font-medium text-base/6">DOWNLOAD THE APP</h1>
                <h2 className="text-[#121211] text-center text-[40px] font-semibold mt-4">Neuron for all your devices</h2>
            </div>
            <div className='flex gap-6 max-lg:flex-col max-lg:items-center'>
                <div className='flex flex-1 flex-col p-2 xl:pb-8 bg-white gap-8 lg:gap-12 rounded-4xl shadow-[0_0_8px_1px_rgba(0,0,0,0.15)]'>
                    <div className='rounded-3xl'>
                        <Image src="/images/d1.png" alt="browser" width={500} height={282} />
                    </div>
                    <div className='max-w-[500px] px-4'>
                        <h3 className='text-[#121211] text-lg font-bold'>For browser</h3>
                        <p className='text-[#514f4d] font-medium mt-4'>Automatically back up your computer’s folders and files with Neuron.</p>
                        <div className='flex gap-2 mt-8 lg:mt-12'>
                            <div className='size-6'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                    <path d="M6 19.2508L19 6.25073M19 6.25073V18.7308M19 6.25073H6.52" stroke="#121211" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <a href="#" className='text-[#121211] text-sm/5 font-medium'>Go to portal</a>
                        </div>
                    </div>
                </div>

                <div className='flex flex-1 flex-col  p-2 xl:pb-8 bg-white  gap-8 lg:gap-12 rounded-4xl shadow-[0_0_8px_1px_rgba(0,0,0,0.15)]'>
                    <div className='rounded-3xl'>
                        <Image src="/images/d2.png" alt="desktop" width={500} height={282} />
                    </div>
                    <div className='max-w-[500px] px-4'>
                        <h3 className='text-[#121211] text-lg font-bold'>For desktop</h3>
                        <p className='text-[#514f4d] font-medium mt-4'>Automatically back up your computer’s folders and files with Neuron.</p>
                        <div className='flex justify-between max-xl:flex-col gap-2 2xl:gap-12 mt-8 xl:mt-12 '>
                            {
                                ["browser", "desktop", "PWA"].map((item, index) => (
                                    <button key={index} className='flex gap-1'>
                                        <div className='size-6'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                <path d="M6.33301 20.2507H18.333" stroke="#121211" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M12.333 4.25073V16.2507M12.333 16.2507L15.833 12.7507M12.333 16.2507L8.83301 12.7507" stroke="#121211" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <a href="#" className='text-[#121211] text-sm/5 font-medium'>for {item}</a>
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                </div>

                <div className='flex flex-1 flex-col  p-2 xl:pb-8 bg-white  gap-8 lg:gap-12 rounded-4xl shadow-[0_0_8px_1px_rgba(0,0,0,0.15)]'>
                    <div className='rounded-3xl'>
                        <Image src="/images/d3.png" alt="pwa" width={500} height={282} />
                    </div>
                    <div className='max-w-[500px] px-4'>
                        <h3 className='text-[#121211] text-lg font-bold'>For PWA</h3>
                        <p className='text-[#514f4d] font-medium mt-4'>Automatically back up your computer’s folders and files with Neuron.</p>
                        <div className='flex gap-12 mt-8 lg:mt-12 '>
                            <button className='flex gap-2'>
                                <div className='size-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                        <path d="M6.33301 20.2507H18.333" stroke="#121211" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12.333 4.25073V16.2507M12.333 16.2507L15.833 12.7507M12.333 16.2507L8.83301 12.7507" stroke="#121211" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <a href="#" className='text-[#121211] text-sm/5 font-medium'>Download</a>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RootDownload