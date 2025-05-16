'use client';

import { JSX, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import Link from 'next/link';

const RootNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { item: 'Overview', id: '#overview' },
    { item: 'Download the app', id: '#download' },
    { item: 'Explore Neuron', id: '#explore' },
    { item: 'Plans & pricing', id: '#pricing' },
    { item: 'Resources', id: '#resources' },
    { item: 'Team', id: '#team' },
    { item: 'FAQ', id: '#faq' },
    { item: 'Subscribe', id: '#subscribe' },
  ];

  console.log(user)
  return (
    <nav className="sticky top-0 w-full shadow-[0px_2px_6px_rgba(0,0,0,0.15)] bg-white z-30">
      <div className="container mx-auto px-6 h-16 max-sm:pr-3 flex justify-between items-center">
        {/* Hamburger Button */}
        <button
          className="p-2 max-lg:block hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="flex gap-12 items-center max-2xl:gap-6 max-lg:hidden">
          {navItems.map((item, index) => (
            <NavbarItem key={index} text={item.item} id={item.id} />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-6 items-center max-2xl:gap-4">
          <NavbarButton text="See plans & pricing" id="plan" />
          {user ? (
            <>
              {user.role === 'admin' && <NavbarButton text="Admin" id="admin" />}
              {user.role === 'user' && <NavbarButton text="Cloud App" id="cloud" />}
            </>
          ) : (
            <NavbarButton text="Sign in" id="signin" />
          )}
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-[-2px_0_6px_rgba(0,0,0,0.15)] p-5 transition-transform duration-300 ease-in-out z-[1000] max-lg:block ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={closeMenu} aria-label="Close menu">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="black"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-4">
          {navItems.map((item, index) => (
            <a
              key={index}
              className="px-4 py-2 text-base font-medium text-[#121211]"
              href={item.id}
              onClick={closeMenu}
            >
              {item.item}
            </a>
          ))}
          <div className="mt-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <NavbarButton text="Admin" id="admin" onClick={closeMenu} />
                )}
                {user.role === 'user' && (
                  <NavbarButton text="Cloud App" id="cloud" onClick={closeMenu} />
                )}
              </>
            ) : (
              <NavbarButton text="Sign in" id="signin" onClick={closeMenu} />
            )}
          </div>
        </nav>
      </aside>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[999] max-lg:block"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </nav>
  );
};

export default RootNavbar;

interface NavbarItemProps {
  text: string;
  id: string;
}

const NavbarItem: React.FC<NavbarItemProps> = ({ text, id }) => (
  <a
    href={id}
    className="h-full flex items-center text-base font-medium text-[#121211] cursor-pointer"
  >
    {text}
  </a>
);

type NavbarButtonId = 'cloud' | 'admin' | 'signin' | 'plan';

interface NavbarButtonProps {
  text: string;
  id: NavbarButtonId;
  onClick?: () => void;
}

const NavbarButton: React.FC<NavbarButtonProps> = ({ text, id, onClick }) => {
  const baseClass =
    'px-6 py-2 text-base max-xl:text-sm font-medium rounded-[48px] tracking-wide max-xl:px-4 max-xl:py-2';

  const variants: Record<NavbarButtonId, JSX.Element> = {
    cloud: (
      <Link href="/cloud">
        <button
          onClick={onClick}
          className={`${baseClass} border border-[#121211] text-[#121211]`}
        >
          {text}
        </button>
      </Link>
    ),
    admin: (
      <Link href="/admin">
        <button
          onClick={onClick}
          className={`${baseClass} border border-[#121211] text-[#121211]`}
        >
          {text}
        </button>
      </Link>
    ),
    signin: (
      <Link href="/signin">
        <button
          onClick={onClick}
          className={`${baseClass} bg-[#0d6aff] text-white hover:bg-[#0d56ff]`}
        >
          {text}
        </button>
      </Link>
    ),
    plan: (
      <a href="#pricing">
        <button
          onClick={onClick}
          className={`${baseClass} border border-[#121211] text-[#121211]`}
        >
          {text}
        </button>
      </a>
    ),
  };

  return variants[id];
};

