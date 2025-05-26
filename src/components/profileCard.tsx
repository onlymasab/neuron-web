import UserProfileHeader from "./userProfileHeader";

interface ProfileCardProps {
    name: string | null;
    email: string | null;
    profilePic: string | null;
    onSignOut: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, email, profilePic, onSignOut }) => {
    return (
        <article className="overflow-hidden pt-[3vh] flex flex-col gap-5 bg-white rounded-xl border border-zinc-300 max-w-[440px] shadow-[0_0_48px_rgba(0,0,0,0.15)]">
            <UserProfileHeader profilePic={profilePic || "/images/user.png"} name={name || "User"} email={email || "No email provided"} />

            <section className="flex gap-4 px-6 w-full text-sm text-[#121211]">
                <button
                    className="flex flex-1 items-center justify-center gap-2 px-4 py-2 rounded-3xl border border-[#cfcfcf] hover:bg-gray-100 transition"
                    aria-label="Manage Account"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12" y2="16" />
                    </svg>
                    <span>Manage Account</span>
                </button>

                <button
                    onClick={onSignOut}
                    className="flex flex-1 items-center justify-center gap-2 px-4 py-2 rounded-3xl border border-[#cfcfcf] hover:bg-gray-100 transition"
                    aria-label="Sign out"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 17l5-5-5-5" />
                        <path d="M21 12H9" />
                        <path d="M12 19a9 9 0 1 1 0-14" />
                    </svg>
                    <span>Sign out</span>
                </button>
            </section>

            <footer className="flex justify-center items-center py-4 w-full text-sm border-t bg-[#efefef] border-[#d5d5d5] text-neutral-900">
                <span>© 2025 Paandaaa</span>
            </footer>
        </article>
    );
};

export default ProfileCard;