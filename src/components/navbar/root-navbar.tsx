"use client";

import React, { useState } from "react";

const RootNavbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const navItems = [
        {
            item: "Overview",
            id: "#overview"
        },
        {
            item: "Download the app",
            id: "#download"
        },
        {
            item: "Explore Neuron",
            id: "#explore"
        },
        {
            item: "Plans & pricing",
            id: "#pricing"
        },
        {
            item: "Resources",
            id: "#resources"
        },
        {
            item: "Team",
            id: "#team"
        },
        {
            item: "FAQ",
            id: "#faq"
        },
        {
            item: "Subscribe",
            id: "#subscribe"
        }
    ];

    return (
        <nav className="sticky top-0 w-full shadow-[0px_2px_6px_rgba(0,0,0,0.15)] bg-white z-30">
            <div className="container mx-auto px-6 h-16 max-sm:pr-3 flex relative justify-between items-center">
                <button
                    className="hidden p-2 cursor-pointer border-none max-lg:block"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 12H21M3 6H21M3 18H21" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="flex gap-12 items-center max-2xl:gap-6 max-lg:hidden">
                    {navItems.map((item, index) => (
                        <NavbarItem key={index} text={item.item} id={item.id} />
                    ))}
                </div>

                <div className="flex gap-6 items-center max-2xl:gap-4">
                    <NavbarButton text="See plans & pricing" id="plan" />
                    <NavbarButton text="Sign in" id="signin" />
                </div>
            </div>

            {/* Mobile Menu */}
            <aside
                className="hidden fixed inset-y-0 right-0 p-5 bg-white transition-transform duration-[0.3s] ease-[ease] shadow-[-2px_0_6px_rgba(0,0,0,0.15)] w-[280px] z-[1000] max-sm:block"
                style={{
                    transform: isMobileMenuOpen ? "translateX(0)" : "translateX(100%)",
                }}
            >
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-semibold">Menu</h2>
                    <button
                        className="p-2 cursor-pointer border-none"
                        onClick={toggleMenu}
                        aria-label="Close menu"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <nav className="flex flex-col gap-4">
                    {navItems.map((item, index) => (
                        <div key={index} className="px-4 py-2 cursor-pointer">
                            {item.item}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Backdrop Overlay */}
            <div
                className="hidden fixed inset-0 transition-opacity bg-black/50 duration-[0.3s] ease-[ease] z-[999] max-lg:block"
                onClick={toggleMenu}
                style={{
                    visibility: isMobileMenuOpen ? "visible" : "hidden",
                }}
                aria-hidden="true"
            />
        </nav>
    );
};

export default RootNavbar;

interface NavbarItemProps {
    text: string;
    id: string;
    onClick?: () => void;
}

const NavbarItem: React.FC<NavbarItemProps> = ({ text, id, onClick }) => {
    return (
        <a
            className="h-full flex items-center text-base/6 font-medium tracking-wide text-center cursor-pointer text-[#121211]"
            onClick={onClick}
            role="button"
            tabIndex={0}
            href={id}
        >
            {text}
        </a>
    );
};

interface NavbarButtonProps {
    text: string;
    id: string;
    onClick?: () => void;
}

const NavbarButton: React.FC<NavbarButtonProps> = ({ text, id, onClick }) => {
    return (
        <button
            className={`px-6 py-2 text-base max-xl:text-sm font-medium tracking-wide leading-6 cursor-pointer rounded-[48px] max-xl:px-4 max-xl:py-2 ${id === "plan" ? "bg-[#0d6aff] text-white hover:bg-[#0d56ff] lg:max-xl:hidden" : "bg-transparent border border-[#121211] text-[#121211]"}`}
            id={id}
            onClick={onClick}
        >
            {text}
        </button>
    );
};