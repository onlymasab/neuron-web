"use client";
import { LogoSvg } from "@/components/logo_svg";
import ProfileCard from "@/components/profileCard";
import { useAuthStore } from "@/stores/useAuthStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Header = () => {
  const currentPath = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { user, signOut } = useAuthStore();
  
      const [showSignin, setShowSignin] = useState(false);
      const [showProfileCard, setShowProfileCard] = useState(false);
  
      const handleProfileClick = () => setShowProfileCard(prev => !prev);
  
      const handleSignOut = async () => {
          await signOut();
          setShowProfileCard(false);
      };
  
      useEffect(() => {
          if (user && showSignin) {
              setShowSignin(false);
          }
      }, [user, showSignin]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white/70 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Search */}
          <div className="flex items-center space-x-6">
            <div className="w-[90px] h-[35px] flex items-center">
              <LogoSvg />
            </div>
            
            {/* Apple-style search */}
            <div className="relative hidden md:flex items-center w-64">
              <div className="absolute left-3 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5 0C11.0052 0 11.4922 0.0651042 11.9609 0.195312C12.4297 0.325521 12.8672 0.510417 13.2734 0.75C13.6797 0.989583 14.0495 1.27865 14.3828 1.61719C14.7214 1.95052 15.0104 2.32031 15.25 2.72656C15.4896 3.13281 15.6745 3.57031 15.8047 4.03906C15.9349 4.50781 16 4.99479 16 5.5C16 6.00521 15.9349 6.49219 15.8047 6.96094C15.6745 7.42969 15.4896 7.86719 15.25 8.27344C15.0104 8.67969 14.7214 9.05208 14.3828 9.39062C14.0495 9.72396 13.6797 10.0104 13.2734 10.25C12.8672 10.4896 12.4297 10.6745 11.9609 10.8047C11.4922 10.9349 11.0052 11 10.5 11C9.84896 11 9.22396 10.8906 8.625 10.6719C8.03125 10.4531 7.48438 10.138 6.98438 9.72656L0.851562 15.8516C0.752604 15.9505 0.635417 16 0.5 16C0.364583 16 0.247396 15.9505 0.148438 15.8516C0.0494792 15.7526 0 15.6354 0 15.5C0 15.3646 0.0494792 15.2474 0.148438 15.1484L6.27344 9.01562C5.86198 8.51562 5.54688 7.96875 5.32812 7.375C5.10938 6.77604 5 6.15104 5 5.5C5 4.99479 5.0651 4.50781 5.19531 4.03906C5.32552 3.57031 5.51042 3.13281 5.75 2.72656C5.98958 2.32031 6.27604 1.95052 6.60938 1.61719C6.94792 1.27865 7.32031 0.989583 7.72656 0.75C8.13281 0.510417 8.57031 0.325521 9.03906 0.195312C9.50781 0.0651042 9.99479 0 10.5 0ZM10.5 10C11.1198 10 11.7031 9.88281 12.25 9.64844C12.7969 9.40885 13.2734 9.08594 13.6797 8.67969C14.0859 8.27344 14.4062 7.79688 14.6406 7.25C14.8802 6.70312 15 6.11979 15 5.5C15 4.88021 14.8802 4.29688 14.6406 3.75C14.4062 3.20312 14.0859 2.72656 13.6797 2.32031C13.2734 1.91406 12.7969 1.59375 12.25 1.35938C11.7031 1.11979 11.1198 1 10.5 1C9.88021 1 9.29688 1.11979 8.75 1.35938C8.20312 1.59375 7.72656 1.91406 7.32031 2.32031C6.91406 2.72656 6.59115 3.20312 6.35156 3.75C6.11719 4.29688 6 4.88021 6 5.5C6 6.11979 6.11719 6.70312 6.35156 7.25C6.59115 7.79688 6.91406 8.27344 7.32031 8.67969C7.72656 9.08594 8.20312 9.40885 8.75 9.64844C9.29688 9.88281 9.88021 10 10.5 10Z" fill="currentColor" />
                </svg>
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100/70 hover:bg-gray-200/50 focus:bg-white rounded-full border border-transparent focus:border-gray-300 focus:shadow-sm transition-all duration-200 outline-none"
                placeholder="Search"
              />
            </div>
          </div>

          {/* Notification Button */}
          <div className="flex items-center space-x-6">
            <button 
              className="relative p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setHasNotification(false)}
            >
              {hasNotification && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
              )}
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-600"
              >
                <path d="M19.3399 14.49L18.3399 12.83C18.1299 12.46 17.9399 11.76 17.9399 11.35V8.82C17.9399 6.47 16.5599 4.44 14.5699 3.49C14.0499 2.57 13.0899 2 11.9899 2C10.8999 2 9.91994 2.59 9.39994 3.52C7.44994 4.49 6.09994 6.5 6.09994 8.82V11.35C6.09994 11.76 5.90994 12.46 5.69994 12.82L4.68994 14.49C4.28994 15.16 4.19994 15.9 4.44994 16.58C4.68994 17.25 5.25994 17.77 5.99994 18.02C7.93994 18.68 9.97994 19 12.0199 19C14.0599 19 16.0999 18.68 18.0399 18.03C18.7399 17.8 19.2799 17.27 19.5399 16.58C19.7999 15.89 19.7299 15.13 19.3399 14.49Z" fill="currentColor"></path>
                <path d="M14.8297 20.01C14.4097 21.17 13.2997 22 11.9997 22C11.2097 22 10.4297 21.68 9.87969 21.11C9.55969 20.81 9.31969 20.41 9.17969 20C9.30969 20.02 9.43969 20.03 9.57969 20.05C9.80969 20.08 10.0497 20.11 10.2897 20.13C10.8597 20.18 11.4397 20.21 12.0197 20.21C12.5897 20.21 13.1597 20.18 13.7197 20.13C13.9297 20.11 14.1397 20.1 14.3397 20.07C14.4997 20.05 14.6597 20.03 14.8297 20.01Z" fill="currentColor"></path>
              </svg>
            </button>
            
            {/* User Profile (Placeholder) */}
            <div className="flex items-center justify-between p-4">
              

                    {user ? (
                        <button onClick={handleProfileClick} className="flex items-center gap-2">
                            <p className="text-sm font-medium">{user.full_name}</p>
                            <img
                                src={user.avatar_url || "/images/user.png"}
                                alt="profile picture"
                                className="object-contain shrink-0 w-9 aspect-square rounded-full"
                            />
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowSignin(true)}
                            className="flex items-center gap-2"
                        >
                            <p className="text-sm font-medium">Sign in</p>
                            <div className="size-8">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="34"
                                    height="34"
                                    viewBox="0 0 34 34"
                                    fill="none"
                                >
                                    <path
                                        d="M17 33C25.8366 33 33 25.8366 33 17C33 8.16344 25.8366 1 17 1C8.16344 1 1 8.16344 1 17C1 25.8366 8.16344 33 17 33Z"
                                        stroke="#707070"
                                    />
                                    <path
                                        d="M16.3657 16.4235C18.615 16.4235 20.4384 14.6 20.4384 12.3507C20.4384 10.1014 18.615 8.27802 16.3657 8.27802C14.1164 8.27802 12.293 10.1014 12.293 12.3507C12.293 14.6 14.1164 16.4235 16.3657 16.4235Z"
                                        stroke="#707070"
                                        strokeWidth="1.5"
                                    />
                                    <path
                                        d="M22.184 23.4053H28.0022M25.0931 20.4962V26.3144M22.6687 21.7122C22.3908 20.1356 21.5321 18.7204 20.2621 17.7458C18.992 16.7712 17.4029 16.308 15.8081 16.4475C14.2133 16.587 12.7287 17.3192 11.6472 18.4995C10.5656 19.6798 9.96574 21.2226 9.96582 22.8235"
                                        stroke="#707070"
                                        strokeWidth="1.5"
                                    />
                                </svg>
                            </div>
                        </button>
                    )}
                </div>
            {showProfileCard && user && (
                    <div className="absolute top-16 right-5 w-[440px] z-40">
                        <ProfileCard
                            name={user.full_name}
                            email={user.email}
                            profilePic={user.avatar_url || "/images/user.png"}
                            onSignOut={handleSignOut}
                        />
                    </div>
                )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;