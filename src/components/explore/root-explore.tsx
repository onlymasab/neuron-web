import Image from 'next/image'
import React from 'react'

const RootExplore = () => {
    return (
        <div id='explore' className='relative w-full flex flex-col items-center gap-18 mt-43'>
            <div className='flex flex-col gap-x-4 w-[clamp(100px,50vw,590px)]'>
                <h1 className="text-[#74726f] text-center font-medium text-base/6">EXPLORE NEURON</h1>
                <h2 className="text-[#121211] text-center text-[40px] font-semibold mt-4">Your files and photos, safe and accessible</h2>
                <p className='text-center text-[#121211] mt-2'>Securely save, share, and access your files and photos wherever you are.</p>
            </div>

            <div>
                <Image src="/images/explore_img.png" alt="explore" width={1000} height={562} className='h-auto' />
            </div>
            <div className='absolute -top-30 -left-10 -z-10 w-[60vw]'>
                <svg width="811" height="983" viewBox="0 0 1211 1483" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_f_995_123)">
                        <path d="M557.5 600L617.333 784.147H810.957L654.312 897.956L714.145 1082.1L557.5 968.294L400.855 1082.1L460.688 897.956L304.043 784.147H497.667L557.5 600Z" fill="#0D6AFF" />
                    </g>
                    <defs>
                        <filter id="filter0_f_995_123" x="-295.957" y="0" width="1706.91" height="1682.1" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="300" result="effect1_foregroundBlur_995_123" />
                        </filter>
                    </defs>
                </svg>
            </div>
            <div className='absolute top-10 right-0 -z-10'>
                <svg width="849" height="908" viewBox="0 0 1349 1608" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_f_995_124)">
                        <path d="M814 600L864.516 755.471H1027.99L895.736 851.558L946.252 1007.03L814 910.942L681.748 1007.03L732.264 851.558L600.012 755.471H763.484L814 600Z" fill="#B406B4" />
                    </g>
                    <defs>
                        <filter id="filter0_f_995_124" x="0.0126953" y="0" width="1627.97" height="1607.03" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="300" result="effect1_foregroundBlur_995_124" />
                        </filter>
                    </defs>
                </svg>
            </div>
        </div>
    )
}

export default RootExplore