"use client";
import { useState } from "react";
import RootSignUp from "../signup/root-signup";
import GoogleLoginButton from "../GoogleLoginButton";

interface SignInProps {
    setShowSignin: (value: boolean) => void;
}

function RootSignIn({setShowSignin}: SignInProps) {
    const [showSignupModal, setShowSignupModal] = useState(false);
    return (
        <>
            <section className="flex flex-col h-fit justify-center px-8 pt-3 pb-14 gap-6 bg-white rounded-xl border border-solid border-zinc-300 max-w-[440px] shadow-[0px_0px_48px_rgba(0,0,0,0.15)]">
            <header className="flex flex-col items-center w-full ">
                <button onClick={()=>setShowSignin(false)} className="self-end -mr-4">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 5L5 15M5 5L15 15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div>
                    <svg width="78" height="78" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_d_1146_1769)">
                            <rect x="15" y="15" width="48" height="48" rx="12" fill="url(#paint0_linear_1146_1769)" shapeRendering="crispEdges" />
                            <rect x="14.75" y="14.75" width="48.5" height="48.5" rx="12.25" stroke="#0D6AFF" strokeWidth="0.5" shapeRendering="crispEdges" />
                            <path d="M57.7396 34.1857C56.6704 33.0191 55.184 32.3965 53.7887 31.7119C53.7556 31.6663 54.0199 31.0042 54.0543 30.8795C54.9448 27.6657 53.5184 24.6711 50.6805 23.0802C49.6292 22.4909 47.5456 21.3201 46.4148 21.1812C42.8138 20.7386 40.2343 24.5958 42.0478 27.7599C42.5676 28.6667 43.2433 29.1368 44.1374 29.6231C45.8269 30.5422 47.6354 31.3276 49.3158 32.2567C49.4258 32.3175 49.5786 32.3942 49.6775 32.4581C49.7234 32.4876 49.7617 32.4534 49.7378 32.5626L39.5497 37.2659C36.4404 35.8192 33.2878 34.4547 30.1918 32.9805C30.1237 32.948 29.4703 32.6059 29.4558 32.564C29.5283 32.5357 29.6595 32.5068 29.7548 32.4626C31.5935 31.6093 33.6615 30.6733 35.4333 29.7175C40.2507 27.1186 37.4448 19.9281 32.1853 21.2457C31.2212 21.4874 28.5478 22.9244 27.681 23.5178C24.9998 25.3532 24.0271 28.7601 25.3144 31.7616C24.1735 32.302 22.9536 32.7601 21.9731 33.5745C18.8224 36.1912 18.7676 40.9811 21.8319 43.6934C22.813 44.5619 24.1169 45.0837 25.2643 45.6972C25.2038 46.0372 25.0471 46.3456 24.9615 46.6807C24.1977 49.6667 25.5272 52.5951 28.1239 54.154C29.0571 54.7142 30.408 55.4143 31.4007 55.8658C36.5882 58.2258 40.3441 51.082 35.3396 48.1622L29.221 44.9392L29.2986 44.8528L39.55 40.1098L49.785 44.8461L49.4569 45.0584C47.4962 46.1978 45.0134 47.1722 43.1814 48.477C39.5339 51.0745 41.8408 56.9383 46.3659 56.2731C47.4417 56.115 49.9895 54.7325 50.9934 54.1243C53.8976 52.3639 55.0998 48.9032 53.789 45.7233C54.7228 45.1529 55.78 44.7703 56.6707 44.1307C59.9412 41.7821 60.4827 37.1783 57.7396 34.1855V34.1857ZM29.4244 25.4496C30.4694 24.8159 31.7085 24.3102 32.7971 23.7401C35.1846 23.17 36.3979 26.2676 34.1796 27.4754C32.1392 28.5867 29.8467 29.4336 27.7957 30.5505L27.6229 30.5858C26.8472 28.5689 27.6112 26.5491 29.4244 25.4499V25.4496ZM34.1466 50.4377C36.0359 51.4832 34.9184 54.2688 32.8338 53.6798C31.7513 53.0863 30.523 52.5929 29.4714 51.9597C27.7257 50.908 26.8241 48.9329 27.5968 46.9647L34.1463 50.4379L34.1466 50.4377ZM28.3714 42.4201C27.788 42.7546 27.2334 43.1391 26.7508 43.6112C25.3424 42.7454 23.6387 42.3011 22.7357 40.813C22.0973 39.7606 21.9586 38.5161 22.362 37.352C23.0741 35.2985 25.0629 34.7284 26.8425 33.8798C27.3381 34.2891 27.8463 34.6895 28.4184 34.9892C30.8489 36.2623 33.5712 37.2961 36.0609 38.4995C36.1798 38.557 36.3476 38.6139 36.4204 38.7276L28.3711 42.4201H28.3714ZM44.8762 27.0961C43.1308 25.9617 44.3252 23.2236 46.3509 23.7859C47.0278 23.974 48.712 24.9237 49.3936 25.3082C51.3243 26.3973 52.2631 28.3183 51.4787 30.4927L44.8762 27.0961ZM46.2562 53.6692C44.2435 54.2335 43.0272 51.6646 44.8114 50.4835C45.8569 49.792 47.3081 49.0657 48.4361 48.4611C49.4213 47.9332 50.4371 47.4595 51.4173 46.9216C51.531 46.911 51.5796 47.1878 51.6071 47.2825C52.6821 50.9772 48.8384 52.4039 46.2559 53.6692H46.2562ZM56.4287 40.6422C55.5469 42.2503 53.8006 42.7254 52.3023 43.5761C51.818 43.1722 51.3304 42.7732 50.7744 42.4687L42.6323 38.7278C42.6029 38.6895 42.771 38.6092 42.8029 38.5931C45.3827 37.2867 48.3067 36.274 50.8214 34.8939C51.3584 34.5992 51.8202 34.2013 52.305 33.8318C53.2675 34.3658 54.465 34.7942 55.3329 35.4627C56.9302 36.6927 57.4073 38.857 56.4282 40.6422H56.4287Z" fill="white" />
                        </g>
                        <defs>
                            <filter id="filter0_d_1146_1769" x="0.5" y="0.5" width="77" height="77" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feMorphology radius="2" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_1146_1769" />
                                <feOffset />
                                <feGaussianBlur stdDeviation="6" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1146_1769" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1146_1769" result="shape" />
                            </filter>
                            <linearGradient id="paint0_linear_1146_1769" x1="39" y1="15" x2="39" y2="63" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#0D6AFF" />
                                <stop offset="0.8" stopColor="#004AB9" />
                                <stop offset="1" stopColor="#232CCD" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h1 className="mt-6 text-xl font-semibold tracking-normal leading-snug text-black">
                    Sign In to Neuron
                </h1>
                <p className="mt-2 text-xs font-medium tracking-normal leading-4 text-center text-[#808080]">
                    Welcome back! Please sign in to continue
                </p>
            </header>

            <div className="w-full flex justify-center">
                <div
                    className="rounded-full hover:shadow-md cursor-pointer"
                    
                >
                    <GoogleLoginButton onUserNotFound={() => setShowSignupModal(true)}/>
                </div>

            </div>

            <p className="text-xs font-medium tracking-wide leading-4 text-center text-[#808080]">
                By signing in, you agree to our{" "}
                <a href="#" className="underline">
                    Terms
                </a>{" "}
                and{" "}
                <a href="#" className="underline">
                    Privacy Policy
                </a>
                . Your data is safe with us.
            </p>
            </section>
            {showSignupModal && 
            <RootSignUp onClose={() => setShowSignupModal(false)}/>
            }
        </>
    );
}

export default RootSignIn