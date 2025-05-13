import { Progress } from '@/components/ui/progress';
import Lottie from 'lottie-react';
import animationData from '../lotties/tick.json'
import { Button } from '@/components/ui/button';

interface ConversionModalProps {
    videoSrc: string;
    progressBar: number;
    showAnimation?: boolean;
    onClose?: () => void;
}
const ConversionModal = ({ videoSrc, progressBar, showAnimation, onClose }: ConversionModalProps) => {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] transition-all duration-300">
                {
                    showAnimation ? (
                        <div className="w-[65vw] h-[62vh] flex flex-col items-center justify-between overflow-hidden rounded-md relative">
                            <div className='w-full'>
                                <video preload='auto' autoPlay loop muted className='object-fill object-center h-[62vh] w-full'>
                                    <source src={videoSrc} type="video/mp4" />
                                </video>
                            </div>
                            <div className='w-full absolute bottom-[3vh] flex items-center justify-center h-4.5'>
                                <Progress value={progressBar} className="w-[20%] bg-[#385682] h-4.5" />
                                <span className="absolute z-50 flex items-center justify-center text-xs font-medium text-white">
                                    {progressBar}%
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className='w-[30vw] h-[62vh] flex flex-col items-center justify-start overflow-hidden rounded-md relative bg-white'>
                            <Lottie 
                                animationData={animationData}
                                loop={false}
                                autoplay={true}
                                className="w-[20vh] h-[20vh] mt-10"
                            />
                            <h2 className='text-2xl font-bold mt-3'>Success!!</h2>
                            <p className='text-sm text-zinc-400 mt-4'>Your data has been converted.</p>
                            <Button
                                variant="secondary"
                                className='mt-7 text-white w-1/2'
                                style={{background: "linear-gradient(93deg, #0D6AFF 4.18%, #0956D3 78.6%)"}}
                                onClick={onClose}
                            >
                                Continue
                            </Button>
                        </div>
                    )
                }
            </div>
    );
}
export default ConversionModal