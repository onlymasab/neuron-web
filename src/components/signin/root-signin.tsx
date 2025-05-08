"use client"

import { useState } from 'react';
import RootSignUp from '../signup/root-signup';  // Adjust the import as needed
import GoogleLoginButton from '../GoogleLoginButton';
import { LogoIconSvg } from '../logo_svg';

interface SignInProps {
    setShowSignin: React.Dispatch<React.SetStateAction<boolean>>;
    isUserRegistered: boolean;
    onUserNotFound: () => void; // Add this prop for handling user not found
}

function RootSignIn({ setShowSignin, isUserRegistered, onUserNotFound }: SignInProps) {
    const [showSignupModal, setShowSignupModal] = useState(false);

    const handleUserNotFound = () => {
        // Show a message or redirect the user to sign up
        console.warn('User not found — consider showing a sign-up option.');
        onUserNotFound();  // Call onUserNotFound to handle further action in parent
        setShowSignupModal(true);  // Show the sign-up modal
        setShowSignin(false);      // Close the sign-in modal
    };

    return (
        <>
            {showSignupModal && (
                <RootSignUp setShowSignUp={setShowSignupModal} />
            )}

            <section
                className="flex flex-col h-fit justify-center px-8 pt-3 pb-14 gap-6 bg-white rounded-xl border border-solid border-zinc-300 max-w-[440px] shadow-[0px_0px_48px_rgba(0,0,0,0.15)]"
                aria-live="polite"
            >
                <header className="flex flex-col items-center w-full">
                    <button
                        onClick={() => setShowSignin(false)}
                        className="self-end -mr-4"
                        aria-label="Close sign-in modal"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <title>Close</title>
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
                        <LogoIconSvg />
                    </div>
                    <h1 className="mt-4 text-xl font-semibold tracking-normal leading-snug text-black">
                        Sign In to Neuron
                    </h1>
                    <p className="mt-2 text-xs font-medium tracking-normal leading-4 text-center text-[#808080]">
                        Welcome back! Please sign in to continue
                    </p>
                </header>

                {/* Google Login Button with error handling */}
                <div className='mx-auto'>
                    <div
                        className="rounded-full hover:shadow-md cursor-pointer">
                        <GoogleLoginButton onUserNotFound={handleUserNotFound} />
                    </div>
                </div>


                {/* Link to switch between SignIn and SignUp */}
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
        </>
    );
}

export default RootSignIn;