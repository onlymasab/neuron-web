"use client";

import React, { useRef, useEffect } from "react";

interface CodeInputProps {
    verificationCode: string[];
    setVerificationCode: React.Dispatch<React.SetStateAction<string[]>>;
}

const CodeInput: React.FC<CodeInputProps> = ({
    verificationCode,
    setVerificationCode,
}) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Focus the first input on mount
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index: number, value: string) => {
        // Only allow digits
        if (!/^\d*$/.test(value)) return;

        const newCode = [...verificationCode];
        newCode[index] = value.slice(-1); // Only take the last character if multiple are pasted
        setVerificationCode(newCode);

        // Move to next input if a digit was entered
        if (value && index < 4) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        // Handle backspace
        if (e.key === "Backspace") {
            if (!verificationCode[index] && index > 0) {
                // If current field is empty and backspace is pressed, move to previous field
                const newCode = [...verificationCode];
                newCode[index - 1] = "";
                setVerificationCode(newCode);
                inputRefs.current[index - 1]?.focus();
            }
        }
        // Handle left arrow key
        else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        // Handle right arrow key
        else if (e.key === "ArrowRight" && index < 4) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();

        // Check if pasted content is a 5-digit number
        if (/^\d{5}$/.test(pastedData)) {
            const digits = pastedData.split("");
            setVerificationCode(digits);
            // Focus the last input
            inputRefs.current[4]?.focus();
        }
    };

    return (
        <div className="flex gap-2.5 items-center mt-6 text-base font-medium tracking-wide text-center text-black whitespace-nowrap">
            {[0, 1, 2, 3, 4].map((index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={verificationCode[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    aria-label={`Verification code digit ${index + 1}`}
                    className="py-2.5 px-6 w-full bg-white rounded-lg border border-solid border-zinc-300 text-center focus:outline focus:outline-black"
                />
            ))}
        </div>
    );
};

export default CodeInput;
