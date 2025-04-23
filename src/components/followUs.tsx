import React from 'react'
import { FacebookIcon, GoogleIcon, InstagramIcon, LinkedinIcon, WhatsappIcon } from './socialIcons'

const FollowUs = () => {
    return (
        <div className='w-full mt-25'>
            <div className='container mx-auto px-10 py-12'>
                <div className='flex gap-6'>
                    <span className='text-[#121211] font-medium'>Follow us/</span>
                    <div className='flex gap-5 items-center'>
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

export default FollowUs