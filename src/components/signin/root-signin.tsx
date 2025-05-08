"use client"

import { useState } from 'react';
import RootSignUp from '../signup/root-signup';  // Adjust the import as needed
import GoogleLoginButton from '../GoogleLoginButton';

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
                        <svg
                            width="78"
                            height="78"
                            viewBox="0 0 78 78"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Insert your long SVG content here */}
                        </svg>
                    </div>
                </header>

                {/* Google Login Button with error handling */}
                <div className='mx-auto'>
                    <GoogleLoginButton onUserNotFound={handleUserNotFound} />
                </div>
                

                {/* Link to switch between SignIn and SignUp */}
                <p className='text-center'>By signing in, you agree to our Terms and Privacy Policy. Your data is safe with us.</p>
            </section>
        </>
    );
}

export default RootSignIn;