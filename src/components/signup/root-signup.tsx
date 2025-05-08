import Image from "next/image";

interface SignUpProps {
    setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>; // Correct prop for showing/hiding the sign-up form
}

const RootSignUp: React.FC<SignUpProps> = ({ setShowSignUp }) => {
    return (
        <section className="flex flex-col justify-center px-8 pt-3 pb-8 gap-4 bg-white rounded-xl border border-solid border-zinc-300 max-w-[440px] shadow-[0px_0px_48px_rgba(0,0,0,0.15)]">
            <header className="flex flex-col items-center w-full">
                <button 
                    className="self-end -mr-4" 
                    onClick={() => setShowSignUp(false)} 
                    aria-label="Close sign-up modal"
                >
                    <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 20 20" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path 
                            d="M15 5L5 15M5 5L15 15" 
                            stroke="black" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                        />
                    </svg>
                </button>
                <div>
                    <svg 
                        width="78" 
                        height="78" 
                        viewBox="0 0 78 78" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Insert your SVG content here */}
                    </svg>
                </div>
            </header>

            <p className="font-medium text-2xl text-black">
                Let’s sign you up!
            </p>

            <Image
                alt="Sign Up Image"
                className="rounded-3xl"
                src="/signup_img.png"
                width={270}
                height={180}
            />

            <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                    className="text-blue-600 underline"
                    onClick={() => setShowSignUp(false)} // Handle the sign-in logic here
                >
                    Sign In
                </button>
            </div>
        </section>
    );
};

export default RootSignUp;