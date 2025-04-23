import Image from 'next/image'
import React from 'react'

const RootExplore = () => {
    return (
        <div id='explore' className='w-full flex flex-col items-center gap-18 mt-43'>
            <div className='flex flex-col gap-x-4 w-[clamp(100px,50vw,590px)]'>
                <h1 className="text-[#74726f] text-center font-medium text-base/6">EXPLORE NEURON</h1>
                <h2 className="text-[#121211] text-center text-[40px] font-semibold mt-4">Your files and photos, safe and accessible</h2>
                <p className='text-center text-[#121211] mt-2'>Securely save, share, and access your files and photos wherever you are.</p>
            </div>

            <div>
                <Image src="/images/explore_img.png" alt="explore" width={1000} height={562} className='h-auto' />
            </div>
        </div>
    )
}

export default RootExplore