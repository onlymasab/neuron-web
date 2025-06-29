import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SharedHeader from "../../components/shared_header";
import RecentFiles from "../../components/recentFiles";
import { createClient } from "@/lib/supabase/server";

export default async function ProfileDetail({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: user, error } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", params.id)
    .single();

  if (!user || error) return notFound();

  return (
    <div className="flex flex-col gap-6 w-full text-4xl h-full px-15.5">
      <Link href={"/cloud/people"} className="flex gap-3 self-stretch items-center py-[3vh] border-b border-b-[#A2A2A2]">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <path d="M10.73 19.79c.3.29.77.28 1.06-.01.29-.3.28-.77-.01-1.06L5.52 12.75h14.73a.75.75 0 000-1.5H5.52l6.24-5.95a.75.75 0 10-1.05-1.07L3.31 11.28a.76.76 0 00-.3.58c0 .21.09.42.25.58l7.47 7.35z" fill="#242424" />
        </svg>
        <h2 className="text-sm font-semibold">Back to People</h2>
      </Link>

      <div className="flex gap-4 items-center">
        <div className="flex gap-2.5 items-center">
          {user.avatar_url ? (
            <Image src={user.avatar_url} alt="Profile" width={40} height={40} className="rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">
              {user.full_name[0]}
            </div>
          )}
          <h1 className="text-[#181818] text-[22px] font-semibold">{user.full_name}</h1>
        </div>

        <div className="grow 2xl:ml-10">
          <SharedHeader id="people" />
        </div>
      </div>

      <div className="h-[60vh]">
        <RecentFiles id={params.id} />
      </div>
    </div>
  );
}
