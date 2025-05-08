import Image from "next/image";

interface UserProfileHeaderProps {
  profilePic?: string;
  name?: string;
  email?: string;
}

const UserProfileHeader = ({ profilePic, name, email }: UserProfileHeaderProps) => {
  return (
    <div className="flex items-center gap-4 px-6">
      <div className="w-16 h-16 rounded-full overflow-hidden">
        <Image
          src={profilePic || "/images/user.png"}
          alt={name || "User"}
          width={64}
          height={64}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-lg text-[#121211]">{name || "User"}</span>
        <span className="text-sm text-gray-600">{email || "No email provided"}</span>
      </div>
    </div>
  );
};

export default UserProfileHeader;